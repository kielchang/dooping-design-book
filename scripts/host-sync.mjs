// registry/*.json → apps/host-v4/src（內部試裝宿主的決定性同步）
//
//   node scripts/host-sync.mjs          # 依安裝集把 registry item 的檔案寫進宿主
//   node scripts/host-sync.mjs --check  # 不寫檔，只比對；有差異 exit 1（CI 用）
//
// apps/host-v4 是「照取用端的路接上來」的內部試裝宿主：
//   - 人與 agent 用 scripts/host-add.mjs 走真的 `npx shadcn add`（HTTP 取件、相依解析、npm install）；
//   - CI 用這支——零網路、零版本漂移。兩條路的產物必須逐位元組相同：
//     registry JSON 才是契約，CLI 只是把 files[].content 抄到 target。
//
// 這個宿主不允許改元件：它是範本不是產品，任何差異都代表 registry 與原始碼、或與宿主脫鉤了。
// 取用端「改了元件要記原因」的正常情況，由它的 LEDGER.md 示範格式。
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { rewrite } from "./lib/rewrite.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = join(ROOT, "registry");
const HOST = join(ROOT, "apps/host-v4");
const SRC = join(HOST, "src");
const CHECK = process.argv.includes("--check");

const lf = (s) => s.replace(/\r\n/g, "\n");
const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const INSTALL_SET = JSON.parse(readFileSync(join(HOST, "dooping.install.json"), "utf8")).items;

function readItem(name) {
  const p = join(REGISTRY, `${name}.json`);
  if (!existsSync(p)) throw new Error(`registry 沒有「${name}」——安裝集寫錯，或忘了 npm run build:registry`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const abs = join(dir, n);
    return statSync(abs).isDirectory() ? walk(abs) : [abs];
  });
}

// 安裝集＋沿 registryDependencies 的遞移閉包（與 `npx shadcn add` 的相依解析同一個語意）
const resolved = new Map();
const queue = [...INSTALL_SET];
while (queue.length) {
  const name = queue.shift();
  if (resolved.has(name)) continue;
  const item = readItem(name);
  resolved.set(name, item);
  for (const url of item.registryDependencies ?? []) queue.push(url.split("/").pop().replace(/\.json$/, ""));
}

// 期望的檔案：registry item 的檔案 ＋ 示範資料（唯一來源 packages/react/src/demo/sample-data.ts）
const expected = new Map();
// target 以 ~/ 開頭＝專案根目錄（shadcn CLI 的規則；registry:file 用，例如 dooping-check），其餘落在 src/
const targetPath = (target) => (target.startsWith("~/") ? join(HOST, target.slice(2)) : join(SRC, target));
for (const item of resolved.values()) for (const f of item.files) expected.set(targetPath(f.target), f.content);

const DEMO_SRC = join(ROOT, "packages/react/src/demo/sample-data.ts");
const DEMO_HEADER =
  "// 由 scripts/host-sync.mjs 從 packages/react/src/demo/sample-data.ts 同步——示範資料只有一個來源，請勿手改。\n";
expected.set(join(SRC, "demo/sample-data.ts"), DEMO_HEADER + rewrite(lf(readFileSync(DEMO_SRC, "utf8"))));

const problems = [];

// 宿主必須宣告每個 item 的 npm 相依。CLI 路徑會自動 npm install，這條路不會——
// 漏宣告的症狀是建置或執行期才炸，所以在同步時就擋。
const hostPkg = JSON.parse(readFileSync(join(HOST, "package.json"), "utf8"));
const declared = { ...hostPkg.dependencies, ...hostPkg.devDependencies };
const pkgName = (spec) => (spec.startsWith("@") ? "@" + spec.slice(1).split("@")[0] : spec.split("@")[0]);
const needed = [...new Set([...resolved.values()].flatMap((i) => i.dependencies ?? []).map(pkgName))].sort();
const missingDeps = needed.filter((n) => !declared[n]);
if (missingDeps.length) problems.push(`apps/host-v4/package.json 缺少相依：${missingDeps.join(", ")}`);

const MANAGED = [join(SRC, "components/dooping"), join(SRC, "lib/dooping")];

if (CHECK) {
  for (const [file, content] of expected) {
    if (!existsSync(file)) problems.push(`缺檔：${rel(file)}`);
    else if (lf(readFileSync(file, "utf8")) !== content) problems.push(`內容與 registry 不同：${rel(file)}`);
  }
  for (const f of MANAGED.flatMap(walk)) {
    if (!expected.has(f)) problems.push(`安裝集之外的檔案：${rel(f)}（安裝集拿掉了這個 item，或有人手動加檔）`);
  }
} else {
  // 就地同步：只寫內容有變的檔、只刪安裝集之外的檔。不整個目錄先刪再寫——
  // 開著 `npm run host:dev` 時，刪除與重寫之間的空檔會讓 Vite 把「找不到模組」快取住，
  // 開發中的畫面就卡在錯誤覆蓋層上（實際踩過一次）。
  let written = 0;
  let removed = 0;
  for (const [file, content] of expected) {
    if (existsSync(file) && lf(readFileSync(file, "utf8")) === content) continue;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content, "utf8");
    written++;
  }
  for (const f of MANAGED.flatMap(walk)) {
    if (expected.has(f)) continue;
    rmSync(f);
    removed++;
  }
  console.log(`[host-sync] 寫入 ${written} 個、移除 ${removed} 個（其餘內容相同，未動）`);
}

const direct = new Set(INSTALL_SET).size;
console.log(
  `[host-sync] ${resolved.size} 個 item（安裝集 ${direct}＋遞移 ${resolved.size - direct}）→ ${expected.size} 個檔案` +
    (CHECK ? "（比對模式，未寫檔）" : ""),
);
if (expected.size <= 1) problems.push("幾乎沒有檔案可同步——安裝集或 registry 讀取壞了，守衛不能空轉");

// 宿主的 dooping.lock.json（ADR-0013 第二層）。宿主是取用端範本：host:sync＝「重抄＋重建 lock」，
// host:check＝「例行檢查 --strict」——用剛同步進宿主的那一份工具跑，走取用端會走的同一條路。
// lock 指向本 repo 的 registry/（相對於宿主根目錄），CI 零網路、結果決定性。
const TOOL = join(HOST, "scripts/dooping-check.mjs");
if (!existsSync(TOOL)) {
  problems.push("缺 apps/host-v4/scripts/dooping-check.mjs——安裝集要含 dooping-check");
} else {
  const toolArgs = CHECK
    ? ["--cwd", HOST, "--strict"]
    : ["init", ...INSTALL_SET, "--cwd", HOST, "--registry", "../../registry"];
  try {
    execFileSync(process.execPath, [TOOL, ...toolArgs], { stdio: "inherit" });
  } catch {
    problems.push(CHECK ? "dooping.lock.json 與 registry 或宿主檔案對不上" : "dooping-check init 失敗");
  }
}

if (problems.length) {
  console.error(problems.map((p) => `  ✗ ${p}`).join("\n"));
  if (CHECK) console.error("\n請執行 npm run host:sync 並提交結果（宿主是範本，不允許手改元件）。");
  process.exit(1);
}
