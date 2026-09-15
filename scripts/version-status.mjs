// 版本狀態儀表板（給設計端）：三段式發布走到哪、下一步做什麼。
//
//   main（核准版）← staging（候選版，套用驗收）← dev（工作中）
//
// 取用端不需要這支——他們只看 main（Releases／/r/index.json／npm），正本在文件站「治理 → 跟上新版」。
// 流程正本：book/docs/7-governance/01-versioning.mdx「三段式發布」。只讀不寫：它是儀表板，不是工具箱。
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { UNRELEASED_PREFIX, topReleaseHeading } from "./lib/changelog.mjs";
import { classify, listTags, previousTag, registryItemsAt } from "./lib/registry-changes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STAGING_URL = "https://kielchang.github.io/dooping-design-book/staging/";
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const tryto = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

// 比對要新鮮——遠端有的分支各抓一次（staging 可能還沒建立）；連不上遠端就用本地既有的 origin/* 快照並註明
const remoteHeads = tryto(() => sh("git ls-remote --heads origin").split("\n").map((l) => l.split("refs/heads/")[1]).filter(Boolean), null);
const fetched = (remoteHeads ?? []).filter((b) => ["main", "staging", "dev"].includes(b)).map((b) => tryto(() => (sh(`git fetch origin ${b} --quiet`), true), false));
const exists = (b) => (remoteHeads ? remoteHeads.includes(b) : tryto(() => (sh(`git rev-parse --verify --quiet origin/${b}`), true), false));
const versionAt = (b) => tryto(() => JSON.parse(sh(`git show origin/${b}:package.json`)).version, null);
const sameTree = (a, b) => tryto(() => (sh(`git diff --quiet origin/${a} origin/${b}`), true), false);
const pending = (from, to) => tryto(() => sh(`git log --no-merges --oneline origin/${to}..origin/${from}`).split("\n").filter(Boolean), []);

const hasStaging = exists("staging");
const mainVer = versionAt("main") ?? "（讀不到 origin/main）";
const stagingVer = hasStaging ? versionAt("staging") : null;
const devVer = versionAt("dev");
const localVer = read("package.json").version;
const branch = tryto(() => sh("git branch --show-current"), "?");
const behindDev = tryto(() => Number(sh("git rev-list --count --no-merges HEAD..origin/dev")), 0);
const aheadDev = tryto(() => Number(sh("git rev-list --count --no-merges origin/dev..HEAD")), 0);

const declaredTokens = read("packages/react/package.json").dependencies["@dooping/tokens"].replace(/^[\^~>=<\s]+/, "");
const npmTokens = tryto(() => sh("npm view @dooping/tokens version"), "查不到（離線？）");

const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
const top = topReleaseHeading(changelog);
const unreleased = top?.line.startsWith(UNRELEASED_PREFIX);

const devVsStaging = hasStaging ? sameTree("dev", "staging") : false;
const stagingVsMain = hasStaging ? sameTree("staging", "main") : false;
const devPending = hasStaging ? pending("dev", "staging") : pending("dev", "main");
const stagingPending = hasStaging ? pending("staging", "main") : [];

const stagingRun = hasStaging
  ? tryto(() => JSON.parse(sh("gh run list --workflow staging.yml --branch staging -L 1 --json status,conclusion,headSha,url"))[0] ?? null, null)
  : null;
const stagingDeploy = hasStaging
  ? await fetch(`${STAGING_URL}deploy.json?t=${Date.now()}`, { signal: AbortSignal.timeout(5000) })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
  : null;
const stagingTip = hasStaging ? tryto(() => sh("git rev-parse origin/staging"), "") : "";

const rel = (list) => (list.length ? `領先 ${list.length} 個 commit` : "內容相同");
const offline = remoteHeads && fetched.every(Boolean) ? "" : "（離線：以本地的 origin/* 快照比對）";

console.log(`\n版本狀態${offline}\n`);
console.log(`  main（核准版）  ：${mainVer}　＝最新 v tag ＝ Releases 最上則；其他系統只參照這裡`);
if (hasStaging) {
  console.log(`  staging（候選版）：${stagingVer}　相對 main ${stagingVsMain ? "內容相同" : rel(stagingPending)}`);
  const runText = stagingRun
    ? `${stagingRun.status === "completed" ? stagingRun.conclusion : stagingRun.status}（${stagingRun.headSha.slice(0, 7)}）`
    : "查不到（沒有 gh 或尚未跑過）";
  const deployText = stagingDeploy ? `${stagingDeploy.sha.slice(0, 7)}${stagingDeploy.sha === stagingTip ? "＝staging 最新" : "（落後 staging 最新）"}` : "查不到";
  console.log(`  　　　　　　　　　驗收 run：${runText}；/staging/ 上線版本：${deployText}`);
} else {
  console.log("  staging（候選版）：尚未建立");
}
console.log(`  dev（工作中）   ：${devVer}　相對 ${hasStaging ? "staging" : "main"} ${hasStaging && devVsStaging ? "內容相同" : rel(devPending)}`);
console.log(`  本地            ：${branch} ${localVer}${behindDev ? `　⚠ 落後 origin/dev ${behindDev}` : ""}${aheadDev ? `　領先 origin/dev ${aheadDev}（未推）` : ""}`);
console.log(`  token 配對      ：宣告 ${declaredTokens}／npm ${npmTokens}${declaredTokens === npmTokens ? "　一致" : "　⚠ 不一致"}`);
console.log(`  CHANGELOG 最上面：${top?.line ?? "（找不到發版標題）"}`);

// ── 下一步 ─────────────────────────────────────────────────────
const steps = [];
if (branch !== "dev" || behindDev > 0) steps.push("先同步：git switch dev && git pull（功能分支做完才併進 dev）");
if (!hasStaging) {
  steps.push("staging 分支還沒建立：git push origin origin/main:refs/heads/staging");
} else if (!devVsStaging) {
  if (unreleased) steps.push("切候選版：CHANGELOG「## 未發佈」改名為「## vX.Y.Z · 日期」（有 bump）或「## 日期（說明）」（版號沒動）");
  steps.push("開 dev → staging 的 PR：gh pr create --base staging --head dev（發版閘會檢查版號與 CHANGELOG）");
} else if (!stagingVsMain) {
  const run = stagingRun;
  if (!run) steps.push("看 staging 最近一次驗收：gh run list --workflow staging.yml --branch staging");
  else if (run.status !== "completed") steps.push("等 staging 的套用驗收跑完");
  else if (run.conclusion !== "success") steps.push("驗收紅了：修在 dev、推上去，再開一次 dev → staging PR——不要直接改 staging");
  else steps.push("開 staging → main 的 PR 並勾完核准清單：gh pr create --base main --head staging（合併＝核准）");
} else {
  steps.push("三段內容一致——沒有待發布的內容");
}
if (declaredTokens !== npmTokens && mainVer === localVer)
  steps.push(`token 宣告 ${declaredTokens} 還沒發佈到 npm：確認已在 main 上後推 tokens-v${declaredTokens}`);

console.log("\n  下一步：");
for (const s of steps) console.log(`    ・${s}`);

// Release 會附的 registry 異動清單（有 bump 才會發 Release）——候選版送出前先看規模
if (devVer && devVer !== mainVer && !devVer.startsWith("（")) {
  const prev = tryto(() => previousTag(listTags(ROOT), `v${devVer}`), null);
  const changes = prev ? tryto(() => classify(registryItemsAt(ROOT, prev), registryItemsAt(ROOT, "worktree")), null) : null;
  if (changes) {
    console.log(`\n  v${devVer} 合併進 main 時 Release 會附 registry 異動（相對 ${prev}）：內容有變 ${changes.changed.length}、只因相依受影響 ${changes.affected.length}、新增 ${changes.added.length}、移除 ${changes.removed.length}`);
    console.log(`  完整清單：npm run registry:changes -- --before v${devVer}`);
  }
} else if (devVer === mainVer) {
  console.log("\n  版號沒動：進 main 時是純文件／純 CI 進版——不打 tag、不發 Release（取用端無感）");
}
console.log("");
