// 版本狀態儀表板（給設計端）：一個指令回答「做到哪、下一版幾號、離進版差什麼」。
//
// 取用端不需要這支——他們只看 main（Releases／/r/index.json／npm），
// 正本在文件站「治理 → 跟上新版」。這支看的是**提議中的未來**：
// dev 對 main 的差距、CHANGELOG 未發佈節、合併之後會發生什麼。
//
// 只讀不寫：它是儀表板，不是工具箱。
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const tryto = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

// 比對要新鮮——先抓 main；離線就退用本地既有的 origin/main 並註明
const fetched = tryto(() => (sh("git fetch origin main --quiet"), true), false);

const localVer = read("package.json").version;
const mainVer = tryto(
  () => JSON.parse(sh("git show origin/main:package.json")).version,
  "（讀不到 origin/main）",
);
const declaredTokens = read("packages/react/package.json")
  .dependencies["@dooping/tokens"].replace(/^[\^~>=<\s]+/, "");
const npmTokens = tryto(() => sh("npm view @dooping/tokens version"), "查不到（離線？）");

const ahead = tryto(() => sh("git log --oneline origin/main..HEAD").split("\n").filter(Boolean), []);
const behind = tryto(() => Number(sh("git rev-list --count HEAD..origin/main")), 0);

// CHANGELOG「## 未發佈」節底下的工作項標題
const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
const unreleasedBlock = changelog.match(/^## 未發佈[^\n]*\n([\s\S]*?)^## /m)?.[1] ?? "";
const workItems = [...unreleasedBlock.matchAll(/^### (.+)$/gm)].map((m) => m[1]);

console.log(`\n版本狀態${fetched ? "" : "（離線：以本地的 origin/main 快照比對）"}\n`);
console.log(`  已發佈（main）：${mainVer}　＝最新 v${mainVer} tag ＝ Releases 最上則`);
console.log(`  工作中（本地）：${localVer}`);
console.log(`  token 配對　　：宣告 ${declaredTokens}／npm ${npmTokens}${declaredTokens === npmTokens ? "　一致" : "　⚠ 不一致"}`);
console.log("");

if (ahead.length === 0 && behind === 0) {
  console.log("  與 main 同步——沒有待進版的內容。\n");
} else {
  if (behind > 0) console.log(`  ⚠ 本地落後 origin/main ${behind} 個 commit——先同步再看狀態。\n`);
  if (ahead.length > 0) {
    console.log(`  領先 main ${ahead.length} 個 commit：`);
    for (const c of ahead.slice(0, 10)) console.log(`    ${c}`);
    if (ahead.length > 10) console.log(`    …另 ${ahead.length - 10} 個`);
    console.log("");
  }
  if (workItems.length > 0) {
    console.log(`  未發佈工作項（CHANGELOG）：`);
    for (const t of workItems) console.log(`    ・${t}`);
    console.log("");
  } else if (ahead.length > 0) {
    console.log("  ⚠ 有領先的 commit 但 CHANGELOG 沒有「未發佈」工作項——確認是不是漏記了。\n");
  }

  // 合併預測：本地版本動了沒，決定進版是「發佈」還是「純文件」
  if (localVer !== mainVer) {
    console.log(`  合併進 main 之後：自動蓋 v${localVer} tag ＋ 發 GitHub Release（notes＝CHANGELOG 該則）`);
    console.log(`  　　　　　　　　　合併前記得把「未發佈」節改名為「## v${localVer} · 日期」`);
    if (declaredTokens !== npmTokens) {
      console.log(`  　　　　　　　　　⚠ token 宣告 ${declaredTokens} 尚未發佈到 npm——合併後要推 tokens-v${declaredTokens}`);
    }
  } else {
    console.log("  合併進 main 之後：純文件進版——不蓋 tag、不發 Release（取用端無感）");
    console.log("  　　　　　　　　　CHANGELOG 未發佈節屆時改名為只寫日期的標題");
  }
  console.log("");
}
