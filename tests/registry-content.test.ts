// registry 的 files[].content 就是取用端經 shadcn CLI 拿到的原始碼——但不是逐字。
// 實測 shadcn@4.21.0（2026-09-10，scripts/host-add.mjs 裝出來的檔與 registry 內容逐位元組比對）：
// CLI 會刪掉「檔案開頭、第一個程式 token 之前」的全部註解，連掛在第一個 export 上的 JSDoc 也一起消失。
// 於是寫在檔頭的設計理由在走 CLI 的取用端整段不見，而 host-sync 那條路照樣保留——兩條安裝路徑悄悄分岔。
// 設計理由要寫在最後一個 import 之後；沒有 import 的檔，掛到不是第一個宣告的 export 上或寫進函式內。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const REGISTRY = join(__dirname, "..", "registry");

interface RegistryFile {
  path: string;
  content?: string;
}
interface RegistryItem {
  name: string;
  files?: RegistryFile[];
}

const items: RegistryItem[] = readdirSync(REGISTRY)
  .filter((f) => f.endsWith(".json") && f !== "index.json")
  .map((f) => JSON.parse(readFileSync(join(REGISTRY, f), "utf8")));

const files = items.flatMap((item) => (item.files ?? []).map((file) => ({ item: item.name, ...file })));

describe("registry 檔案內容：取用端經 shadcn CLI 拿到的樣子", () => {
  it("掃描對象不是空的", () => {
    // 防空轉：registry 目錄讀錯時 files 會是 0 個，下一條永遠綠
    expect(files.length).toBeGreaterThan(50);
    expect(files.every((f) => typeof f.content === "string" && f.content.length > 0)).toBe(true);
  });

  it("沒有檔案以註解開頭（shadcn CLI 會把那段註解整段刪掉）", () => {
    const offenders = files
      .filter((f) => {
        const head = (f.content ?? "").trimStart();
        return head.startsWith("//") || head.startsWith("/*");
      })
      .map((f) => `${f.item}：${f.path}`);
    expect(offenders, "把檔頭註解移到最後一個 import 之後（沒有 import 的檔改掛到後面的宣告上）").toEqual([]);
  });
});
