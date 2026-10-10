// 規則正本：ARCHITECTURE.md「同一個網域：瀏覽器儲存只放介面偏好」。
// 正式站、/staging/、/preview/ 與帳號下其他 GitHub Pages 網站都在同一個網域，瀏覽器以網域為界——
// 任何一站的程式都讀寫得到其他站存在瀏覽器裡的東西。所以會送到瀏覽器的程式碼：
//   - 不註冊 service worker
//   - 瀏覽器儲存（localStorage／sessionStorage／IndexedDB／cookie）只准出現在允許清單的檔案，清單上每一檔都要真的在用（只准縮短）
// 「只放介面偏好、讀取時一律驗證」是內容規則，守衛管不到——人工：改到允許清單上的檔時，由審 PR 的人看。
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { because } from "./lib/guard";

const ROOT = join(__dirname, "..");
const RULE = "ARCHITECTURE.md「同一個網域：瀏覽器儲存只放介面偏好」";
const WHY = "三個站與帳號下其他 Pages 網站共用同一個網域，彼此讀寫得到瀏覽器儲存；存了敏感資料就等於交給同網域的每一個站";

/** 會送到瀏覽器的程式碼。scripts/ 裡的 playwright 腳本只在驗證時跑，不在範圍內。 */
const SCOPE = ["packages/react/src", "apps/host-v4/src", "apps/host-v4/index.html", "book/src", "book/docusaurus.config.ts", ".storybook"];

/** 允許用瀏覽器儲存的檔：宿主的主題設定（明暗與色相），與首繪前讀同一個鍵的那段腳本。 */
const STORAGE_ALLOWED = ["apps/host-v4/index.html", "apps/host-v4/src/theme.tsx"];

const files = execFileSync("git", ["ls-files", "--", ...SCOPE], { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter((f) => /\.(tsx?|jsx?|mjs|html|css|mdx?)$/.test(f));
const read = (f: string) => readFileSync(join(ROOT, f), "utf8");
const STORAGE = /\b(localStorage|sessionStorage|indexedDB)\b|document\.cookie/;

describe("同一個網域：瀏覽器儲存只放介面偏好", () => {
  it("掃描範圍夠大（防空轉）", () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it("不註冊 service worker", () => {
    const hits = files.filter((f) => /serviceWorker\s*\.\s*register|navigator\.serviceWorker/.test(read(f)));
    expect(hits, because(`這些檔註冊了 service worker：${hits.join("、")}`, WHY, RULE)).toEqual([]);
  });

  it("瀏覽器儲存只出現在允許清單的檔", () => {
    const hits = files.filter((f) => !STORAGE_ALLOWED.includes(f) && STORAGE.test(read(f)));
    expect(hits, because(`清單外的檔用了瀏覽器儲存：${hits.join("、")}——只放介面偏好、讀取時驗證，並把檔加進允許清單`, WHY, RULE)).toEqual([]);
  });

  it("允許清單只准縮短：清單上的檔都還在用", () => {
    const stale = STORAGE_ALLOWED.filter((f) => !files.includes(f) || !STORAGE.test(read(f)));
    expect(stale, because(`這些檔已經不用瀏覽器儲存，從允許清單拿掉：${stale.join("、")}`, WHY, RULE)).toEqual([]);
  });
});
