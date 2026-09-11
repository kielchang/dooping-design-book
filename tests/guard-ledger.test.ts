// 守衛台帳：ARCHITECTURE.md「守衛」一節的兩張表，必須列出每一支 tests/*.test.ts 與 build 後的腳本。
//
// 規則軌的正本是守衛本身，但「有哪些守衛、各管什麼、不管什麼」要有一個人讀得完的地方。
// 那張表以前寫死「七支」，實際長到二十幾支都沒人改——同一份事實兩處（目錄與表格）就需要一支守衛。
// 規則正本：ARCHITECTURE.md「守衛：同一份事實存在兩個地方，就需要一支」。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { because, toLines } from "./lib/guard";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/**
 * 「## 守衛」到下一個 H2 之間，所有表格列第一欄的反引號路徑（含指令列裡括號內的腳本路徑）。
 * 只跳過 ``` 圍籬；行內碼正是要抓的東西，不能像其他守衛那樣先挖掉。
 */
export function ledgerEntries(markdown: string): string[] {
  const lines = toLines(markdown);
  const start = lines.findIndex((l) => /^## 守衛/.test(l));
  if (start < 0) return [];
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  const section = lines.slice(start + 1, end < 0 ? undefined : end);
  const out: string[] = [];
  let fence = false;
  for (const l of section) {
    if (/^\s*```/.test(l)) { fence = !fence; continue; }
    if (fence || !l.startsWith("|")) continue;
    const first = l.split("|")[1] ?? "";
    for (const m of first.matchAll(/`([^`]+)`/g)) {
      const inner = m[1];
      // 指令列（npm run …）不算路徑；括號內的腳本路徑才算
      if (/\.(ts|mjs)(\s|$)/.test(inner) || inner.endsWith(".ts") || inner.endsWith(".mjs")) out.push(inner.replace(/ --check$/, ""));
    }
  }
  return out;
}

const actual = [
  ...readdirSync(join(ROOT, "tests")).filter((n) => n.endsWith(".test.ts")).map((n) => `tests/${n}`),
  ...readdirSync(join(ROOT, "scripts")).filter((n) => /^verify-.*\.mjs$/.test(n)).map((n) => `scripts/${n}`),
  "scripts/host-sync.mjs",
].sort();

describe("ledgerEntries 自測", () => {
  const sample = [
    "# 標題", "", "## 守衛", "",
    "| 檔案 | 管什麼 | 不管什麼 |", "| --- | --- | --- |",
    "| `tests/a.test.ts` | 甲 | 乙 |",
    "| `npm run verify:x`（`scripts/verify-x.mjs`） | 丙 | 丁 |",
    "| `npm run host:check`（`scripts/host-sync.mjs --check`） | 戊 | 己 |",
    "", "```", "| `tests/in-fence.test.ts` | 不算 | 不算 |", "```", "",
    "## 下一節", "| `tests/other.test.ts` | 不在守衛節 | 不算 |",
  ].join("\n");
  it("抓表格第一欄的路徑，指令列取括號內的腳本，圍籬與其他節不算", () => {
    expect(ledgerEntries(sample)).toEqual(["tests/a.test.ts", "scripts/verify-x.mjs", "scripts/host-sync.mjs"]);
  });
});

describe("ARCHITECTURE.md 的守衛台帳", () => {
  const md = readFileSync(join(ROOT, "ARCHITECTURE.md"), "utf8");
  const listed = ledgerEntries(md);

  it("掃描對象不是空的（防空轉）", () => {
    expect(actual.length, "tests/ 與 scripts/ 讀不到守衛").toBeGreaterThanOrEqual(20);
    expect(listed.length, "ARCHITECTURE.md 的守衛節沒有表格列——標題或表格格式變了").toBeGreaterThanOrEqual(20);
  });

  it("每一支守衛都列在表上；表上沒有不存在的守衛", () => {
    const missing = actual.filter((p) => !listed.includes(p));
    const stale = listed.filter((p) => !actual.includes(p));
    expect(missing, because(`守衛台帳漏列：${missing.join(", ")}`, "新守衛沒登記，就沒有人讀得到它管什麼、不管什麼", "ARCHITECTURE.md「守衛」一節的表格")).toEqual([]);
    expect(stale, because(`守衛台帳列了不存在的檔：${stale.join(", ")}`, "守衛改名或刪除後，表格會指向空氣", "ARCHITECTURE.md「守衛」一節的表格")).toEqual([]);
  });
});
