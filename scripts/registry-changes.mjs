// 兩版之間動到哪些 registry item（ADR-0013 第三層）。
//
//   node scripts/registry-changes.mjs --from v0.11.1                 # 對照工作目錄的 registry/
//   node scripts/registry-changes.mjs --before v0.13.0 --markdown    # 自動找 v0.13.0 之前最近的 v* tag（deploy.yml／ci.yml 用）
//   node scripts/registry-changes.mjs --from origin/main --to HEAD --json
//
// 四類：內容有變、只因相依變了而受影響、新增、移除。指紋一律從 registry JSON 現算（不讀 index 的 meta），
// 所以任意兩版都比得了——包括還沒有指紋欄位的舊版。
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { classify, listTags, previousTag, registryItemsAt, renderMarkdown } from "./lib/registry-changes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

let from = option("--from");
const before = option("--before");
if (!from && before) {
  from = previousTag(listTags(ROOT), before);
  if (!from) {
    console.error(`${before} 之前沒有 v* tag——第一版沒有可以比較的對象。`);
    process.exit(2);
  }
}
if (!from) {
  console.error("用法：--from <revision> 或 --before <vX.Y.Z>（另可加 --to <revision>、--markdown、--json）");
  process.exit(2);
}
const to = option("--to") ?? "worktree";

const result = classify(registryItemsAt(ROOT, from), registryItemsAt(ROOT, to));

if (args.includes("--json")) {
  console.log(JSON.stringify({ from, to, ...result }, null, 2));
} else if (args.includes("--markdown")) {
  process.stdout.write(renderMarkdown(result, from));
} else {
  const { changed, affected, added, removed } = result;
  console.log(`\nregistry 異動：${from} → ${to === "worktree" ? "工作目錄" : to}\n`);
  console.log(`  內容有變　　　　　（${changed.length}）${changed.join("、")}`);
  console.log(`  只因相依變了而受影響（${affected.length}）${affected.map((a) => `${a.name}←${a.via.join("+")}`).join("、")}`);
  console.log(`  新增　　　　　　　（${added.length}）${added.join("、")}`);
  console.log(`  移除　　　　　　　（${removed.length}）${removed.join("、")}\n`);
}
