// 發版閘：dev → staging → main 三段式發布的機器規則。
//
//   node scripts/release-gate.mjs bump-guard     # dev push：元件／token 相對 main 有變就必須 bump（抓不到 main 放行）
//   node scripts/release-gate.mjs release        # staging：這個候選版能不能發（抓不到 main 直接失敗）
//   node scripts/release-gate.mjs pr             # PR → staging／main：release ＋ 來源分支 ＋ 樹相等 ＋ 核准清單
//   node scripts/release-gate.mjs notes vX.Y.Z   # 印出 CHANGELOG 該版的 Release notes（deploy 發 Release 用）
//
// pr 模式讀環境變數：BASE_REF、HEAD_REF、HEAD_SHA、HEAD_REPO、GITHUB_REPOSITORY、PR_BODY。
// 一律以目前工作目錄為 repo 根。
//
// 規則正本：book/docs/7-governance/01-versioning.mdx「三段式發布」。
// 純函式在上半（tests/release-gate.test.ts 直接測，每條規則都轉紅過一次），git 在下半（CI 實跑）。
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DATE_HEADING,
  UNRELEASED_PREFIX,
  extractReleaseNotes,
  headings,
  sectionBody,
  toLines,
  topReleaseHeading,
} from "./lib/changelog.mjs";
import { WATCH_PATHS } from "./lib/release-watch.mjs";

const RULE = "book/docs/7-governance/01-versioning.mdx「三段式發布」";
const because = (fix, why, ruleAt = RULE) => `${fix}\n為什麼：${why}\n規則正本：${ruleAt}`;

// ── 純函式 ─────────────────────────────────────────────────────

export function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v ?? "").trim());
  return m ? m.slice(1).map(Number) : null;
}

export function compareVersions(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  if (!x || !y) throw new Error(`版號格式不是 X.Y.Z：${x ? b : a}`);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

const canonical = (v) =>
  Array.isArray(v)
    ? `[${v.map(canonical).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`
      : JSON.stringify(v);

/** tokens.json 去掉 meta 後的正規化字串——比「token 內容有沒有變」，不受鍵順序影響。 */
export function tokensContentKey(json) {
  const { meta: _meta, ...rest } = typeof json === "string" ? JSON.parse(json) : json;
  return canonical(rest);
}

/** dev push 的兩條硬閘，行為與改寫前的 ci.yml 相同：只驗「內容變了、版號沒動」。 */
export function evaluateBumpGuard(s) {
  const failures = [];
  if (s.mainTokens && s.headTokens && s.mainTokens.key !== s.headTokens.key && s.mainTokens.version === s.headTokens.version)
    failures.push(because(
      `tokens.json 的內容相對 main 有變，但 tokens 版號還停在 ${s.headTokens.version}。請同步 bump 三處（tokens/package.json、tokens.json 的 meta.version、react/package.json 的相依）並補一則 CHANGELOG`,
      "npm 上的 token 只在版號變時才發佈；內容變了版號不動，取用端永遠裝不到",
      "CLAUDE.md「版號」",
    ));
  if (s.watchedChanged.length > 0 && s.mainVersion === s.headVersion)
    failures.push(because(
      `元件或 token 相對 main 有變，但規範版號還停在 ${s.headVersion}。請依大中小判準 bump 根目錄 package.json（並同步 react/package.json 與 version.ts、重跑 npm run build:registry）。變更檔案：${s.watchedChanged.slice(0, 20).join(" ")}`,
      "規範版號是取用端「要不要跟進」的訊號；介面變了版號不動，取用端看不到",
      "book/docs/7-governance/01-versioning.mdx「兩個對外訊號」",
    ));
  return failures;
}

/** CHANGELOG 的發版標題：已改名、標題型別對得上版號、不重複、有內容、節尾有分隔線。 */
export function evaluateChangelog(changelog, mainChangelog, { bumped, version }) {
  const failures = [];
  const rule = "CHANGELOG.md 開頭的格式規則";
  if (headings(changelog).some(({ line }) => line.startsWith(UNRELEASED_PREFIX)))
    failures.push(because(
      "CHANGELOG 還有「## 未發佈」節——開 dev → staging 的 PR 之前要改名",
      "候選版就是要發的那一版；不改名，Release notes 抽不到、發版紀錄也對不上",
      rule,
    ));
  const top = topReleaseHeading(changelog);
  if (!top) {
    failures.push(because("CHANGELOG 找不到任何發版標題", "每次進版一則，標題是 `## vX.Y.Z · 日期` 或 `## 日期（說明）`", rule));
    return failures;
  }
  if (top.line.startsWith(UNRELEASED_PREFIX)) return failures;
  if (bumped && !top.line.startsWith(`## v${version} `))
    failures.push(because(
      `版號是 ${version}，最上面的發版標題應該是「## v${version} · 日期」，實際是「${top.line}」`,
      "有 bump 的進版，deploy 用「## v<版號> 」這一行抽 Release notes",
      rule,
    ));
  if (!bumped && !DATE_HEADING.test(top.line))
    failures.push(because(
      `版號沒動（${version}），最上面的發版標題應該是「## YYYY-MM-DD（說明）」，實際是「${top.line}」`,
      "版號沒動的進版不打 tag、不發 Release，標題只寫日期",
      rule,
    ));
  if (mainChangelog && toLines(mainChangelog).includes(top.line))
    failures.push(because(
      `「${top.line}」已經在 main 的 CHANGELOG 裡——這一版要有自己的一則`,
      "一次進版一則；同一天兩次版號沒動的進版，用括號裡的說明區分",
      rule,
    ));
  const body = sectionBody(changelog, top) ?? [];
  if (!body.some((l) => l.trim() !== ""))
    failures.push(because(`「${top.line}」底下沒有內容`, "每則要回答：改了什麼／我需要做什麼／為什麼改", rule));
  const leaked = body.filter((l) => l.startsWith("## "));
  if (leaked.length)
    failures.push(because(
      `「${top.line}」節尾缺分隔線，會一路吃進：${leaked.join("、")}`,
      "Release notes 讀到第一條恰為 --- 的行才停",
      rule,
    ));
  return failures;
}

/** 候選版能不能發：版號、tag、tokens 版號、CHANGELOG。 */
export function evaluateRelease(s) {
  const failures = [];
  const cmp = compareVersions(s.headVersion, s.mainVersion);
  const bumped = cmp > 0;
  if (cmp < 0)
    failures.push(because(`規範版號 ${s.headVersion} 比 main 的 ${s.mainVersion} 小`, "版號只能往前走；倒退會讓 tag 與 Release 的順序錯亂"));
  if (s.watchedChanged.length > 0 && !bumped)
    failures.push(because(
      `元件或 token 相對 main 有變，但規範版號（${s.headVersion}）沒有大於 main（${s.mainVersion}）。變更檔案：${s.watchedChanged.slice(0, 20).join(" ")}`,
      "規範版號是取用端「要不要跟進」的訊號；介面變了版號不動，合併進 main 也不會打 tag、發 Release",
    ));
  if (bumped && s.tagExists)
    failures.push(because(
      `v${s.headVersion} 這個 tag 已經存在——請再 bump 一次`,
      "合併進 main 後 deploy 看到 tag 已存在就不打，取用端拿到的版號會對不上這一版的內容",
    ));
  if (s.mainTokens && s.headTokens && s.mainTokens.key !== s.headTokens.key && compareVersions(s.headTokens.version, s.mainTokens.version) <= 0)
    failures.push(because(
      `tokens.json 的內容相對 main 有變，但 tokens 版號 ${s.headTokens.version} 沒有大於 main 的 ${s.mainTokens.version}`,
      "npm 上的 token 只在版號變時才發佈",
      "CLAUDE.md「版號」",
    ));
  failures.push(...evaluateChangelog(s.changelog ?? "", s.mainChangelog, { bumped, version: s.headVersion }));
  return failures;
}

export const MIN_APPROVAL_ITEMS = 4;

/** PR 內文「核准清單」標題之後、下一個標題之前的勾選項；沒有這個標題回傳 null。 */
export function approvalChecklist(body) {
  const lines = toLines(body ?? "");
  const start = lines.findIndex((l) => /^#{1,6}\s*核准清單/.test(l));
  if (start < 0) return null;
  const items = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6}\s/.test(line)) break;
    const m = /^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/.exec(line);
    if (m) items.push({ checked: m[1] !== " ", text: m[2].trim() });
  }
  return items;
}

const ALLOWED_SOURCE = { staging: "dev", main: "staging" };

/** PR 閘：release 的全部規則 ＋ 同 repo ＋ 分支配對 ＋ 樹相等 ＋（base＝main）核准清單。 */
export function evaluatePr(s) {
  const failures = evaluateRelease(s);
  if (s.headRepo !== s.repository)
    failures.push(because(`PR 來自其他 repo（${s.headRepo}）`, "候選版與核准版只收同一個 repo 的 dev 與 staging"));
  if (ALLOWED_SOURCE[s.baseRef] !== s.headRef)
    failures.push(because(
      `不允許 ${s.baseRef} ← ${s.headRef}：只能 staging ← dev、main ← staging（其他 PR 請開到 dev）`,
      "main 是核准版、staging 是候選版；跳段就是跳過套用驗收",
    ));
  if (!s.treeEqual)
    failures.push(because(
      "合併後的內容不等於來源分支——目標分支有來源分支沒有的東西",
      "驗過的必須就是合併後拿到的；把目標分支在本機合回 dev，再走一次 dev → staging → main",
    ));
  if (s.baseRef === "main") {
    const items = approvalChecklist(s.prBody);
    if (!items) {
      failures.push(because("PR 內文找不到「核准清單」", "合併 staging → main 就是核准，核准要留紀錄——用 PR 模板的核准區塊"));
    } else {
      if (items.length < MIN_APPROVAL_ITEMS)
        failures.push(because(`核准清單只有 ${items.length} 項（至少 ${MIN_APPROVAL_ITEMS} 項）`, "清單被刪短，就不是同一種核准"));
      const open = items.filter((i) => !i.checked);
      if (open.length)
        failures.push(because(`核准清單還有 ${open.length} 項沒勾：${open.map((i) => i.text).join("；")}`, "勾完才算守門人核准；勾完後 PR 會自動重跑這道閘"));
    }
  }
  return failures;
}

// ── git 與檔案 ─────────────────────────────────────────────────

const ROOT = process.cwd();
const git = (...args) =>
  execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
const tryGit = (...args) => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};
const readText = (p) => readFileSync(join(ROOT, p), "utf8");

function fetchMain() {
  return tryGit("fetch", "--no-tags", "--quiet", "origin", "+refs/heads/main:refs/remotes/origin/main") !== null
    && tryGit("rev-parse", "--verify", "--quiet", "origin/main") !== null;
}

function tokensState(text) {
  if (!text) return null;
  const json = JSON.parse(text);
  return { version: json.meta?.version ?? "", key: tokensContentKey(json) };
}

function gatherState() {
  const TOKENS = "packages/tokens/src/tokens.json";
  return {
    headVersion: JSON.parse(readText("package.json")).version,
    mainVersion: JSON.parse(git("show", "origin/main:package.json")).version,
    watchedChanged: git("diff", "--name-only", "origin/main", "HEAD", "--", ...WATCH_PATHS).split("\n").map((l) => l.trim()).filter(Boolean),
    headTokens: tokensState(readText(TOKENS)),
    mainTokens: tokensState(tryGit("show", `origin/main:${TOKENS}`)),
    changelog: readText("CHANGELOG.md"),
    mainChangelog: tryGit("show", "origin/main:CHANGELOG.md"),
  };
}

function tagExists(version) {
  try {
    git("ls-remote", "--exit-code", "--tags", "origin", `refs/tags/v${version}`);
    return true;
  } catch (e) {
    if (e.status === 2) return false;
    throw new Error(`查不到 origin 上的 tag：${String(e.stderr ?? e.message).split("\n")[0]}`);
  }
}

function treeEqual(headSha) {
  if (!headSha) return false;
  try {
    git("diff", "--quiet", headSha, "HEAD");
    return true;
  } catch {
    return false;
  }
}

function report(mode, failures) {
  if (failures.length === 0) return;
  for (const f of failures) {
    if (process.env.GITHUB_ACTIONS) console.log(`::error title=發版閘（${mode}）::${f.split("\n")[0]}`);
    console.error(`\n✗ ${f}`);
  }
  console.error(`\n發版閘（${mode}）：${failures.length} 項不通過。`);
  process.exitCode = 1;
}

function main(argv) {
  const [mode, arg] = argv;
  if (mode === "notes") {
    const notes = extractReleaseNotes(readText("CHANGELOG.md"), arg);
    process.stdout.write(notes ? `${notes.join("\n")}\n` : "");
    return;
  }
  if (!["bump-guard", "release", "pr"].includes(mode)) {
    console.error("用法：node scripts/release-gate.mjs <bump-guard|release|pr|notes vX.Y.Z>");
    process.exitCode = 2;
    return;
  }
  if (!fetchMain()) {
    if (mode === "bump-guard") {
      console.log("::notice::抓不到 origin/main，bump 守衛略過——dev 上只是提醒，候選版會在 staging 嚴格檢查。");
      return;
    }
    report(mode, [because("抓不到 origin/main", "發版閘要跟已發佈的核准版比較；比不了就不能放行")]);
    return;
  }
  const state = gatherState();
  if (mode === "bump-guard") return report(mode, evaluateBumpGuard(state));
  const bumped = compareVersions(state.headVersion, state.mainVersion) > 0;
  const full = { ...state, tagExists: bumped ? tagExists(state.headVersion) : false };
  const failures =
    mode === "release"
      ? evaluateRelease(full)
      : evaluatePr({
          ...full,
          baseRef: process.env.BASE_REF ?? "",
          headRef: process.env.HEAD_REF ?? "",
          headRepo: process.env.HEAD_REPO ?? "",
          repository: process.env.GITHUB_REPOSITORY ?? "",
          prBody: process.env.PR_BODY ?? "",
          treeEqual: treeEqual(process.env.HEAD_SHA),
        });
  report(mode, failures);
  if (failures.length === 0)
    console.log(`✓ 發版閘（${mode}）通過：規範 ${state.headVersion}（main ${state.mainVersion}）、CHANGELOG「${topReleaseHeading(state.changelog)?.line}」`);
}

const invoked = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (invoked) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(`發版閘執行失敗：${e.message}`);
    process.exitCode = 1;
  }
}
