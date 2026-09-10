import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// dooping-check：元件更新檢查（dooping-design-book 的 ADR-0013 第二層）。
//
//   node scripts/dooping-check.mjs init data-table page-header   # 剛 npx shadcn add 完：以這幾個 item 建立 dooping.lock.json
//   node scripts/dooping-check.mjs                               # 例行檢查：每個 item 回報「已是最新／上游有更新／本地改過」
//   node scripts/dooping-check.mjs update data-table             # 重抄完：更新這幾個 item 的紀錄（不給名稱＝lock 裡全部）
//
// 選項：
//   --registry <URL 或本機目錄>  預設沿用 lock 記的；init 時沒有 lock 就用正式站
//   --cwd <專案根目錄>           預設目前目錄
//   --strict                     有要看的 item 就以結束碼 1 結束——預設只提醒、不擋建置
//
// 為什麼預設不擋：升級是決定，不是 CI 事件（上游文件站〈跟上新版〉）。
// 這個檔本身也是 registry item（dooping-check）——它更新了，你用同一套檢查就會知道。
// 零相依；Node 18 以上（內建 fetch）。

export const DEFAULT_REGISTRY = "https://kielchang.github.io/dooping-design-book/r";
export const LOCK_FILE = "dooping.lock.json";

const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortKeys = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => byCodeUnit(a, b)));
const isUrl = (registry) => /^https?:\/\//.test(registry);

/** 檔案內容指紋：換行正規化成 LF 後，SHA-256 的前 16 個十六進位字元（與上游 registry 產生器同一條規則）。 */
export const contentHash = (content) =>
  createHash("sha256").update(content.replace(/\r\n/g, "\n"), "utf8").digest("hex").slice(0, 16);

/** 讀 registry 的 index 或某個 item：URL 走 fetch，其餘視為本機目錄（相對於 cwd）。 */
export async function readRegistry(registry, name, cwd) {
  if (isUrl(registry)) {
    const url = `${registry.replace(/\/$/, "")}/${name}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`讀不到 ${url}（HTTP ${res.status}）`);
    return res.json();
  }
  return JSON.parse(readFileSync(resolve(cwd, registry, `${name}.json`), "utf8"));
}

/**
 * registry 檔案的 target → 專案內的路徑，與 shadcn CLI 同一個對應：
 * `~/` 開頭＝專案根；`components/`、`lib/` 走 components.json 的 aliases，別名的 `@/` 照 tsconfig 的 paths 展開。
 */
export function resolveTargets(cwd) {
  const readText = (file) => (existsSync(join(cwd, file)) ? readFileSync(join(cwd, file), "utf8") : "");
  let aliases = {};
  try {
    aliases = JSON.parse(readText("components.json") || "{}").aliases ?? {};
  } catch {
    aliases = {};
  }
  // tsconfig 常帶註解（JSONC），不整份 parse，只抓 "@/*" 對應的第一個路徑
  const tsconfig = ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"].map(readText).join("\n");
  const mapped = /"@\/\*"\s*:\s*\[\s*"([^"]+)"/.exec(tsconfig)?.[1];
  const base = mapped ? mapped.replace(/^\.\//, "").replace(/\*$/, "") : existsSync(join(cwd, "src")) ? "src/" : "";
  const dir = (alias, fallback) => (alias ?? fallback).replace(/^@\//, base).replace(/\/$/, "");
  const components = dir(aliases.components, "@/components");
  const lib = dir(aliases.lib, "@/lib");
  return (target) => {
    if (target.startsWith("~/")) return target.slice(2);
    if (target.startsWith("components/")) return `${components}/${target.slice("components/".length)}`;
    if (target.startsWith("lib/")) return `${lib}/${target.slice("lib/".length)}`;
    return target;
  };
}

/** 一個 item 加上它的遞移 registry 相依：`npx shadcn add <item>` 會寫進專案的，就是這些 item 的檔。 */
async function closureItems(registry, name, cwd) {
  const seen = new Map();
  const queue = [name];
  while (queue.length > 0) {
    const current = queue.shift();
    if (seen.has(current)) continue;
    const item = await readRegistry(registry, current, cwd);
    seen.set(current, item);
    for (const ref of item.registryDependencies ?? []) queue.push(ref.split("/").pop().replace(/\.json$/, ""));
  }
  return [...seen.values()];
}

/** lock 裡每個 item 的紀錄：上游的 closureHash，以及它（含相依）寫進專案的每個檔的內容指紋。 */
export async function createLockEntries(registry, names, cwd, index) {
  const mapTarget = resolveTargets(cwd);
  const entries = {};
  for (const name of names) {
    const meta = (index.items ?? []).find((i) => i.name === name)?.meta;
    if (!meta?.closureHash) throw new Error(`registry 的 index 沒有「${name}」的指紋——名稱打錯，或上游版本早於指紋上線`);
    const files = {};
    for (const item of await closureItems(registry, name, cwd)) {
      for (const file of item.files ?? []) files[mapTarget(file.target ?? file.path)] = contentHash(file.content ?? "");
    }
    entries[name] = { closureHash: meta.closureHash, files: sortKeys(files) };
  }
  return entries;
}

/**
 * 每個 lock item 的狀態（純函式）：
 *   removed   上游已經沒有這個 item
 *   upstream  上游的 closureHash 與 lock 不同——上游有更新（包括只有相依變了）
 *   modified  本地內容與 lock 不同的檔（缺檔也算）——本地改過
 * upstream 與 modified 可以同時成立。
 */
export function evaluate(lock, index, readLocal) {
  const remote = new Map((index.items ?? []).map((i) => [i.name, i.meta?.closureHash]));
  return Object.keys(lock.items ?? {})
    .sort(byCodeUnit)
    .map((name) => {
      const entry = lock.items[name];
      const modified = Object.keys(entry.files ?? {})
        .sort(byCodeUnit)
        .filter((path) => {
          const content = readLocal(path);
          return content === null || contentHash(content) !== entry.files[path];
        });
      return {
        name,
        removed: !remote.has(name),
        upstream: remote.has(name) && remote.get(name) !== entry.closureHash,
        modified,
      };
    });
}

const needsAttention = (r) => r.removed || r.upstream || r.modified.length > 0;

/** 人讀的報告：只列要看的 item，最後一行是總結。 */
export function renderReport(results, { registry }) {
  const lines = [];
  for (const r of results.filter(needsAttention)) {
    const label = r.removed
      ? "上游已移除"
      : [r.upstream && "上游有更新", r.modified.length > 0 && "本地改過"].filter(Boolean).join("＋");
    lines.push(`  ${r.name}：${label}`);
    if (r.upstream) {
      const ref = isUrl(registry) ? `${registry.replace(/\/$/, "")}/${r.name}.json` : r.name;
      lines.push(`    先看差異：npx shadcn@latest add ${ref} --dry-run --diff`);
      lines.push(`    決定跟進：把上一行的 --dry-run --diff 換成 --overwrite，再跑 node scripts/dooping-check.mjs update ${r.name}`);
    }
    if (r.modified.length > 0) {
      lines.push(`    本地改過的檔：${r.modified.join("、")}`);
      lines.push("    刻意偏離就記進符合性台帳；不是刻意的，重抄即可");
    }
  }
  const attention = results.filter(needsAttention).length;
  lines.push(`[dooping-check] ${results.length} 個 item：已是最新 ${results.length - attention}、要看的 ${attention}`);
  return lines.join("\n");
}

export function parseArgs(argv) {
  const out = { command: "check", items: [], registry: undefined, cwd: undefined, strict: false };
  const rest = [...argv];
  if (["check", "init", "update"].includes(rest[0])) out.command = rest.shift();
  while (rest.length > 0) {
    const arg = rest.shift();
    if (arg === "--registry") out.registry = rest.shift();
    else if (arg === "--cwd") out.cwd = rest.shift();
    else if (arg === "--strict") out.strict = true;
    else if (arg.startsWith("--")) throw new Error(`不認得的選項：${arg}`);
    else out.items.push(arg);
  }
  return out;
}

export async function main(argv) {
  const args = parseArgs(argv);
  const cwd = resolve(args.cwd ?? process.cwd());
  const lockPath = join(cwd, LOCK_FILE);
  const existing = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : null;
  const registry = args.registry ?? existing?.registry ?? DEFAULT_REGISTRY;
  const index = await readRegistry(registry, "index", cwd);

  if (args.command === "init" || args.command === "update") {
    if (args.command === "init" && args.items.length === 0) throw new Error("init 要給 item 名稱：init data-table page-header …");
    const names = args.items.length > 0 ? args.items : Object.keys(existing?.items ?? {});
    const entries = await createLockEntries(registry, names, cwd, index);
    const lock = {
      $comment:
        "由 scripts/dooping-check.mjs 產生（init／update），請勿手改。每個 item 記上游的 closureHash，以及它（含相依）寫進專案的每個檔的內容指紋。",
      registry,
      items: sortKeys(args.command === "init" ? entries : { ...(existing?.items ?? {}), ...entries }),
    };
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    console.log(`[dooping-check] ${args.command === "init" ? "建立" : "更新"} ${LOCK_FILE}：${names.length} 個 item`);
    return 0;
  }

  if (!existing) throw new Error(`找不到 ${LOCK_FILE}——剛 npx shadcn add 完的話，先跑 init <item…>`);
  const results = evaluate(existing, index, (path) => {
    const file = join(cwd, path);
    return existsSync(file) ? readFileSync(file, "utf8") : null;
  });
  console.log(renderReport(results, { registry }));
  if (process.env.GITHUB_ACTIONS === "true") {
    for (const r of results.filter(needsAttention)) {
      console.log(`::warning title=dooping-check::${r.name} 上游有更新或本地改過，細節見這一步的輸出`);
    }
  }
  return args.strict && results.some(needsAttention) ? 1 : 0;
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invokedDirectly) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error) => {
      console.error(`[dooping-check] ${error.message}`);
      // 例行檢查讀不到 registry（離線、上游暫時掛掉）只提醒；init／update 與 --strict 一律失敗
      const routine = !["init", "update"].includes(process.argv[2]) && !process.argv.includes("--strict");
      if (routine && process.env.GITHUB_ACTIONS === "true") console.log(`::warning title=dooping-check::${error.message}`);
      process.exit(routine ? 0 : 2);
    },
  );
}
