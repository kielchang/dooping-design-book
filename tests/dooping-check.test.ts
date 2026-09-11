// dooping-check（ADR-0013 第二層）：取用端的 lock 與例行檢查。
//
// 工具是抄進取用端的獨立腳本，不能 import 本 repo 的任何東西，所以指紋規則在工具裡另寫一份——
// 這支先確認那一份與 registry 產生器一致，再拿內部試裝宿主當取用端，驗三種狀態分得出來。
// 規則正本：book/docs/7-governance/06-staying-current.mdx「例行檢查：dooping-check」與「指紋怎麼算」。
import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { contentHash as registryContentHash } from "../scripts/lib/fingerprint.mjs";
import {
  contentHash, createLockEntries, evaluate, parseArgs, renderReport, resolveTargets,
  type Lock, type RegistryIndexLike,
} from "../templates/dooping-check.mjs";

const ROOT = join(__dirname, "..");
const HOST = join(ROOT, "apps/host-v4");
const REGISTRY = join(ROOT, "registry");
const index: RegistryIndexLike = JSON.parse(readFileSync(join(REGISTRY, "index.json"), "utf8"));
const readHost = (path: string) => {
  const file = join(HOST, path);
  return existsSync(file) ? readFileSync(file, "utf8") : null;
};

describe("contentHash：工具與 registry 產生器同一條規則", () => {
  it("同一段內容算出同一個指紋；CRLF 與 LF 視為相同", () => {
    for (const s of ["", "a\nb\n", "中文\r\n第二行", "x".repeat(5000)]) expect(contentHash(s), JSON.stringify(s.slice(0, 20))).toBe(registryContentHash(s));
    expect(contentHash("x\r\ny")).toBe(contentHash("x\ny"));
    expect(contentHash("x\ny")).not.toBe(contentHash("x\nz"));
  });
});

describe("resolveTargets：target 對應到專案路徑（與 shadcn CLI 同一個對應）", () => {
  it("內部試裝宿主：@/* 指到 src/", () => {
    const map = resolveTargets(HOST);
    expect(map("components/dooping/data-table.tsx")).toBe("src/components/dooping/data-table.tsx");
    expect(map("lib/dooping/utils.ts")).toBe("src/lib/dooping/utils.ts");
    expect(map("~/scripts/dooping-check.mjs")).toBe("scripts/dooping-check.mjs");
  });

  it("沒有 tsconfig paths、也沒有 src/ 的專案：別名直接落在根目錄；components.json 的自訂別名照用", () => {
    const dir = mkdtempSync(join(tmpdir(), "dooping-check-"));
    writeFileSync(join(dir, "components.json"), JSON.stringify({ aliases: { components: "@/ui-kit", lib: "@/shared" } }));
    const map = resolveTargets(dir);
    expect(map("components/dooping/button.tsx")).toBe("ui-kit/dooping/button.tsx");
    expect(map("lib/dooping/utils.ts")).toBe("shared/dooping/utils.ts");

    mkdirSync(join(dir, "src"));
    writeFileSync(join(dir, "components.json"), "{}");
    expect(resolveTargets(dir)("components/dooping/button.tsx")).toBe("src/components/dooping/button.tsx");
  });
});

describe("evaluate：內部試裝宿主當取用端", () => {
  const names = ["data-table", "page-header", "dooping-check"];
  let lock: Pick<Lock, "items">;

  beforeAll(async () => {
    lock = { items: await createLockEntries(REGISTRY, names, HOST, index) };
  });

  it("lock 涵蓋 item 與它的相依寫進專案的檔（防空轉）", () => {
    const files = Object.keys(lock.items["data-table"].files);
    expect(files.length).toBeGreaterThan(10);
    expect(files).toContain("src/components/dooping/data-table.tsx");
    expect(files).toContain("src/lib/dooping/utils.ts");
    expect(Object.keys(lock.items["dooping-check"].files)).toEqual(["scripts/dooping-check.mjs"]);
  });

  it("剛同步完：全部已是最新", () => {
    const results = evaluate(lock, index, readHost);
    expect(results.map((r) => r.name)).toEqual([...names].sort());
    for (const r of results) expect(r, r.name).toEqual({ name: r.name, removed: false, upstream: false, modified: [] });
  });

  it("上游的 closureHash 變了：只有那個 item 標「上游有更新」", () => {
    const moved: RegistryIndexLike = {
      items: index.items.map((i) => (i.name === "data-table" ? { ...i, meta: { ...i.meta, closureHash: "0000000000000000" } } : i)),
    };
    const byName = Object.fromEntries(evaluate(lock, moved, readHost).map((r) => [r.name, r]));
    expect(byName["data-table"].upstream).toBe(true);
    expect(byName["page-header"].upstream).toBe(false);
  });

  it("本地改了相依的檔：抄了它的 item 都標「本地改過」並列出那個檔", () => {
    const edited = (path: string) => (path === "src/lib/dooping/utils.ts" ? `${readHost(path)}\n// 本地改動` : readHost(path));
    const byName = Object.fromEntries(evaluate(lock, index, edited).map((r) => [r.name, r]));
    expect(byName["data-table"].modified).toEqual(["src/lib/dooping/utils.ts"]);
    expect(byName["data-table"].upstream).toBe(false);
    expect(byName["dooping-check"].modified).toEqual([]);
  });

  it("缺檔算本地改過；上游拿掉的 item 標 removed", () => {
    const missing = (path: string) => (path === "src/components/dooping/page-header.tsx" ? null : readHost(path));
    const byName = Object.fromEntries(evaluate(lock, index, missing).map((r) => [r.name, r]));
    expect(byName["page-header"].modified).toEqual(["src/components/dooping/page-header.tsx"]);
    const without: RegistryIndexLike = { items: index.items.filter((i) => i.name !== "page-header") };
    expect(Object.fromEntries(evaluate(lock, without, readHost).map((r) => [r.name, r]))["page-header"].removed).toBe(true);
  });
});

describe("renderReport 與 parseArgs", () => {
  it("只列要看的 item，上游有更新時給出看差異與跟進的指令", () => {
    const text = renderReport(
      [
        { name: "data-table", removed: false, upstream: true, modified: [] },
        { name: "badge", removed: false, upstream: false, modified: [] },
      ],
      { registry: "https://kielchang.github.io/dooping-design-book/r" },
    );
    expect(text).toContain("data-table：上游有更新");
    expect(text).toContain("npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/data-table.json --dry-run --diff");
    expect(text).toContain("update data-table");
    expect(text).not.toContain("badge：");
    expect(text).toContain("2 個 item：已是最新 1、要看的 1");
  });

  it("解析指令與選項；不認得的選項直接丟錯", () => {
    expect(parseArgs(["init", "data-table", "badge", "--cwd", "app", "--registry", "./r", "--strict"])).toEqual({
      command: "init", items: ["data-table", "badge"], registry: "./r", cwd: "app", strict: true,
    });
    expect(parseArgs([]).command).toBe("check");
    expect(() => parseArgs(["--force"])).toThrow("不認得的選項");
  });
});
