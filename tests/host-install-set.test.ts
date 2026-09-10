// 內部試裝宿主的接入守衛 —— 文件列的安裝指令要在宿主裡真的裝得進去，宿主也要在配對模型裡。
//
// 五種頁型文件末尾各有一條 `npx shadcn@latest add <URL…>`。這些指令以前只是文字：
// 列錯一個 item 名、或 item 後來改名／被移除，取用端照抄就失敗，而本 repo 沒有任何東西會紅。
// 現在它們有可執行的證據：apps/host-v4 的安裝集必須涵蓋每一條，對應的檔案也真的在宿主裡。
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PAGES = join(ROOT, "book/docs/5-pages");
const HOST = join(ROOT, "apps/host-v4");
const readJson = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

/** 從頁面章文件的 bash 圍籬裡，抽出 shadcn add 指令列的 `/r/<name>.json` item 名 */
function installSetsFromDocs(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const file of readdirSync(PAGES).filter((n) => /\.mdx?$/.test(n))) {
    const src = readFileSync(join(PAGES, file), "utf8");
    const names: string[] = [];
    for (const block of src.matchAll(/```bash\s*\n([\s\S]*?)```/g)) {
      if (!/shadcn@[\w.]+\s+add/.test(block[1])) continue;
      for (const m of block[1].matchAll(/\/r\/([a-z0-9-]+)\.json/g)) names.push(m[1]);
    }
    if (names.length) out.set(file, names);
  }
  return out;
}

const hostSet = new Set<string>(readJson("apps/host-v4/dooping.install.json").items);
const sets = installSetsFromDocs();

describe("頁面章的最小安裝集在內部試裝宿主裡裝得進去", () => {
  it("守衛沒有空轉：五種頁型文件都抽得到安裝指令", () => {
    expect([...sets.keys()].sort()).toEqual([
      "02-list-page.mdx",
      "03-detail-page.mdx",
      "04-form-page.mdx",
      "05-dashboard.mdx",
      "06-settings-page.mdx",
    ]);
  });

  it("文件列的每個 item 都在 registry 裡（列錯名字、item 改名或移除都會紅）", () => {
    const missing = [...sets.entries()].flatMap(([file, names]) =>
      names.filter((n) => !existsSync(join(ROOT, "registry", `${n}.json`))).map((n) => `${file}：${n}`),
    );
    expect(missing).toEqual([]);
  });

  it("宿主的安裝集涵蓋每一條文件指令", () => {
    const missing = [...sets.entries()].flatMap(([file, names]) =>
      names.filter((n) => !hostSet.has(n)).map((n) => `${file}：${n}`),
    );
    expect(missing, "把缺的 item 加進 apps/host-v4/dooping.install.json，再跑 npm run host:sync").toEqual([]);
  });

  it("文件指令裝的檔案真的在宿主裡（host:sync 跑過並已提交）", () => {
    const names = [...new Set([...sets.values()].flat())];
    const missing = names.flatMap((n) =>
      (readJson(`registry/${n}.json`).files as { target: string }[])
        .map((f) => f.target)
        .filter((target) => !existsSync(join(HOST, "src", target))),
    );
    expect(missing, "請執行 npm run host:sync 並提交結果").toEqual([]);
  });
});

describe("內部試裝宿主在配對模型裡", () => {
  // 宿主宣告的 tokens 版必須等於元件庫宣告的那一版——否則它驗的是另一份契約。
  it("宿主宣告的 @dooping/tokens 版＝元件庫宣告", () => {
    const strip = (v: string) => v.replace(/^[\^~]/, "");
    expect(strip(readJson("apps/host-v4/package.json").dependencies["@dooping/tokens"])).toBe(
      strip(readJson("packages/react/package.json").dependencies["@dooping/tokens"]),
    );
  });

  // CLI 路徑（host-add）會跑 npm install。版號範圍對不上時，npm 會安靜地從 registry 裝進舊版，
  // 宿主就在驗 npm 上的舊 token 而不是這個 repo 的——畫面照樣會出來，不會報錯。
  it("宿主拿到的 @dooping/tokens 是 workspace 連結，不是 npm 上的版本", () => {
    const candidates = ["apps/host-v4/node_modules/@dooping/tokens", "node_modules/@dooping/tokens"]
      .map((p) => join(ROOT, p))
      .filter((p) => existsSync(p));
    expect(candidates.length, "找不到安裝的 @dooping/tokens——請先 npm install").toBeGreaterThan(0);
    expect(realpathSync(candidates[0])).toBe(realpathSync(join(ROOT, "packages/tokens")));
  });
});
