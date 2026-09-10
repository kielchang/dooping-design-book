import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fingerprints } from "./fingerprint.mjs";

// 兩版 registry 之間的異動分類（ADR-0013 第三層）：deploy.yml 附進 Release notes、
// ci.yml 在 dev 預演、npm run status 印數量。純函式在上半、git／檔案讀取在下半。

const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * 四類異動。指紋一律現算——舊版的 index 沒有 meta，讀欄位就比不了任意兩版。
 * - changed：item 自己的 hash 變了（檔案內容、落點、npm 或 registry 相依）
 * - affected：自己的 hash 沒變，但 closureHash 變了；via＝閉包裡變了（或新加入）的相依
 * - added／removed：只在新版／只在舊版
 */
export function classify(fromItems, toItems) {
  const before = fingerprints(fromItems, { strict: false });
  const after = fingerprints(toItems, { strict: false });
  const changed = [];
  const affected = [];
  const added = [];
  const removed = [];
  for (const [name, now] of after) {
    const was = before.get(name);
    if (!was) {
      added.push(name);
    } else if (was.hash !== now.hash) {
      changed.push(name);
    } else if (was.closureHash !== now.closureHash) {
      const via = now.closure.filter((dep) => dep !== name && before.get(dep)?.hash !== after.get(dep)?.hash);
      affected.push({ name, via });
    }
  }
  for (const name of before.keys()) if (!after.has(name)) removed.push(name);
  changed.sort(byCodeUnit);
  added.sort(byCodeUnit);
  removed.sort(byCodeUnit);
  affected.sort((a, b) => byCodeUnit(a.name, b.name));
  return { changed, affected, added, removed };
}

const codeList = (names) => names.map((n) => `\`${n}\``).join("、");

/** Release notes 用的一節。四類都空時也輸出一行，讓「沒動到任何 item」本身成為訊號。 */
export function renderMarkdown({ changed, affected, added, removed }, fromLabel) {
  const lines = [`### 這一版動到的 registry item（相對 ${fromLabel}）`, ""];
  if (changed.length + affected.length + added.length + removed.length === 0) {
    lines.push("registry item 沒有任何異動——抄過的元件不必重抄。", "");
    return lines.join("\n");
  }
  lines.push(
    "抄過下列 item 的取用端要重抄，相依會一起覆寫。想先看會動到哪些檔、差在哪：",
    "`npx shadcn@latest add <item 的 URL> --dry-run --diff`。",
    "",
  );
  if (changed.length) lines.push(`- **內容有變（${changed.length}）**：${codeList(changed)}`);
  if (affected.length)
    lines.push(`- **只因相依變了而受影響（${affected.length}）**：${codeList(affected.map((a) => a.name))}——自己的檔沒變，重抄時被一起覆寫的是它相依的 item`);
  if (added.length) lines.push(`- **新增（${added.length}）**：${codeList(added)}`);
  if (removed.length) lines.push(`- **移除（${removed.length}）**：${codeList(removed)}——抄過的副本不會自動消失，留或刪自己決定`);
  lines.push("");
  return lines.join("\n");
}

const parseTag = (tag) => {
  const m = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  return m ? m.slice(1).map(Number) : null;
};
const compareVersion = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** 比 before 小的 vX.Y.Z tag 裡最大的那一個；沒有就回 null。tokens-v*、draft/* 這類 tag 不算。 */
export function previousTag(tags, before) {
  const limit = parseTag(before);
  if (!limit) throw new Error(`「${before}」不是 vX.Y.Z`);
  let best = null;
  for (const tag of tags) {
    const v = parseTag(tag);
    if (v && compareVersion(v, limit) < 0 && (!best || compareVersion(v, best.v) > 0)) best = { tag, v };
  }
  return best ? best.tag : null;
}

// ── git／檔案讀取 ──────────────────────────────────────────────

const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

export const listTags = (root) => git(root, "tag", "--list", "v*").split("\n").map((t) => t.trim()).filter(Boolean);

/** 某個 git revision（或 "worktree"＝工作目錄）底下 registry/*.json 的全部 item（不含 index.json）。 */
export function registryItemsAt(root, rev) {
  if (!rev || rev === "worktree") {
    const dir = join(root, "registry");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json") && f !== "index.json")
      .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  }
  const paths = git(root, "ls-tree", "--name-only", rev, "registry/")
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.endsWith(".json") && !p.endsWith("/index.json"));
  if (paths.length === 0) throw new Error(`${rev} 底下沒有 registry/*.json`);
  return paths.map((p) => JSON.parse(git(root, "show", `${rev}:${p}`)));
}
