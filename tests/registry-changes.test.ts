// 兩版 registry 之間的異動分類（ADR-0013 第三層）——Release notes 附的就是這份清單。
// 用小型合成 registry 驗四類分類、Markdown 輸出、上一個 tag 的挑法；真實歷史由 ci.yml 在 dev 上預演。
import { describe, it, expect } from "vitest";
import { classify, previousTag, renderMarkdown } from "../scripts/lib/registry-changes.mjs";

const BASE = "https://example.test/r";
const item = (name: string, content: string, deps: string[] = []) => ({
  name,
  type: "registry:ui",
  version: "0.13.0",
  dependencies: ["@dooping/tokens@^0.7.0"],
  registryDependencies: deps.map((d) => `${BASE}/${d}.json`),
  files: [{ path: `dooping/ui/${name}.tsx`, type: "registry:ui", target: `components/dooping/${name}.tsx`, content }],
});

// utils ← table ← data-table；csv 獨立
const v1 = [
  item("utils", "export const cn = 1;"),
  item("table", "import { cn } from '@/lib/dooping/utils';", ["utils"]),
  item("data-table", "import { Table } from '@/components/dooping/table';", ["table", "utils"]),
  item("csv", "export const csv = 1;"),
];

describe("classify", () => {
  it("相同的兩版：四類都空", () => {
    expect(classify(v1, v1)).toEqual({ changed: [], affected: [], added: [], removed: [] });
  });

  it("utils 內容變了：utils 是「內容有變」，table 與 data-table 是「只因相依受影響」，csv 不出現", () => {
    const v2 = v1.map((i) => (i.name === "utils" ? item("utils", "export const cn = 2;") : i));
    const r = classify(v1, v2);
    expect(r.changed).toEqual(["utils"]);
    expect(r.affected).toEqual([
      { name: "data-table", via: ["utils"] },
      { name: "table", via: ["utils"] },
    ]);
    expect(r.added).toEqual([]);
    expect(r.removed).toEqual([]);
  });

  it("只改版號、標題：不算異動", () => {
    const v2 = v1.map((i) => ({ ...i, version: "9.9.9", title: "改名" }));
    expect(classify(v1, v2)).toEqual({ changed: [], affected: [], added: [], removed: [] });
  });

  it("registry base 換了（預覽站 vs 正式站）：不算異動", () => {
    const v2 = v1.map((i) => ({ ...i, registryDependencies: i.registryDependencies.map((u) => u.replace(BASE, "http://127.0.0.1:4173/r")) }));
    expect(classify(v1, v2)).toEqual({ changed: [], affected: [], added: [], removed: [] });
  });

  it("新增、移除、改相依組成", () => {
    const v2 = [
      ...v1.filter((i) => i.name !== "csv" && i.name !== "data-table"),
      item("data-table", "import { Table } from '@/components/dooping/table';", ["table"]),
      item("download", "export const saveBlob = 1;"),
    ];
    const r = classify(v1, v2);
    expect(r.added).toEqual(["download"]);
    expect(r.removed).toEqual(["csv"]);
    expect(r.changed).toEqual(["data-table"]); // registry 相依少了 utils＝自己的 hash 變了
  });

  it("舊版的相依指到不存在的 item 也比得了（strict:false），不丟錯", () => {
    const broken = [item("table", "x", ["ghost"])];
    expect(() => classify(broken, broken)).not.toThrow();
  });
});

describe("renderMarkdown", () => {
  it("有異動：標題帶比較基準、只列有東西的類別、附看差異的指令", () => {
    const md = renderMarkdown(
      { changed: ["utils"], affected: [{ name: "data-table", via: ["utils"] }], added: [], removed: [] },
      "v0.11.1",
    );
    expect(md).toContain("### 這一版動到的 registry item（相對 v0.11.1）");
    expect(md).toContain("**內容有變（1）**：`utils`");
    expect(md).toContain("**只因相依變了而受影響（1）**：`data-table`");
    expect(md).toContain("--dry-run --diff");
    expect(md).not.toContain("新增");
    expect(md).not.toContain("移除");
  });

  it("沒有異動：明說不必重抄（安靜也是訊號）", () => {
    const md = renderMarkdown({ changed: [], affected: [], added: [], removed: [] }, "v0.13.0");
    expect(md).toContain("沒有任何異動");
    expect(md).not.toContain("--dry-run");
  });
});

describe("previousTag", () => {
  const tags = ["v0.9.0", "v0.10.0", "v0.11.1", "v0.13.0", "tokens-v0.7.0", "draft/drawer-on-0.11.0"];

  it("照數字大小挑，不照字串排序（v0.10.0 > v0.9.0）", () => {
    expect(previousTag(tags, "v0.13.0")).toBe("v0.11.1");
    expect(previousTag(tags, "v0.11.0")).toBe("v0.10.0");
    expect(previousTag(tags, "v0.10.0")).toBe("v0.9.0");
  });

  it("尚未打 tag 的新版也挑得到上一版；更早沒有就回 null；非 vX.Y.Z 的 tag 不算", () => {
    expect(previousTag(tags, "v0.14.0")).toBe("v0.13.0");
    expect(previousTag(tags, "v0.9.0")).toBeNull();
    expect(previousTag(["tokens-v0.7.0"], "v1.0.0")).toBeNull();
  });
});
