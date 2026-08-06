// packages/react/src → registry/*.json（shadcn 自訂 registry）
//
// 為什麼是 registry 而不是 npm 套件（見 ADR-0004）：元件是要被改的。
// registry 把「原始碼複製到你的專案」，之後它就是你的程式碼，改壞誰也不會怪工具箱；
// 而 token 才是唯一值得硬相依的一層——它是契約，不是實作。
//
// 用法：
//   node scripts/build-registry.mjs               # 用預設（GitHub Pages）base
//   REGISTRY_BASE=http://localhost:4173 node scripts/build-registry.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { dirname, join, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "packages/react/src");
const OUT = join(ROOT, "registry");
const BASE = (process.env.REGISTRY_BASE ?? "https://kielchang.github.io/dooping-design-book").replace(/\/$/, "");

/** 目標專案的落點：元件一律 components/dooping/、工具一律 lib/dooping/。 */
const COMPONENT_TARGET = (name) => `components/dooping/${name}.tsx`;
const LIB_TARGET = (name) => `lib/dooping/${name}.ts`;

/** 來源模組路徑 → registry item 名稱 */
const LIB_MODULES = {
  "lib/utils": "utils",
  "lib/use-sort": "use-sort",
  "lib/csv": "csv",
  "lib/download": "download",
  "lib/forms/diff": "forms-diff",
};

/** 外部套件 → npm 相依（其餘視為 peer，不列入） */
const NPM_DEPS = [
  { re: /@radix-ui\/react-([a-z-]+)/g, name: (m) => `@radix-ui/react-${m[1]}` },
  // GraphCanvas 的隔離相依（boundary 守衛保證只有那一個檔案 import 它）。
  // 不在這份白名單裡的外部套件不會被寫進 registry item——取用端就裝不到，
  // 所以「收了新相依卻忘了加這裡」的症狀是 shadcn add 之後畫布整個沒樣式。
  { re: /from\s+["']@xyflow\/react["']/, name: () => "@xyflow/react" },
  { re: /from\s+["']lucide-react["']/, name: () => "lucide-react" },
  { re: /from\s+["']clsx["']/, name: () => "clsx" },
  { re: /from\s+["']tailwind-merge["']/, name: () => "tailwind-merge" },
  { re: /from\s+["']class-variance-authority["']/, name: () => "class-variance-authority" },
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs)); continue; }
    if (/\.(ts|tsx)$/.test(name) && !/\.stories\.tsx$/.test(name)) out.push(abs);
  }
  return out;
}

/** 匯入路徑改寫：相對路徑 → 目標專案的 `@/` 別名。 */
function rewrite(content) {
  return content
    .replace(/from\s+["']\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/dooping/forms-diff"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/dooping/forms-diff"')
    .replace(/from\s+["']\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/dooping/$1"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/dooping/$1"')
    .replace(/from\s+["']\.\.\/(?:ui|form)\/([a-z-]+)["']/g, 'from "@/components/dooping/$1"')
    .replace(/from\s+["']\.\/([a-z-]+)["']/g, 'from "@/components/dooping/$1"');
}

/** 從原始碼推導出這個檔案需要哪些 npm 套件與 registry 相依。 */
function analyse(content) {
  const deps = new Set();
  for (const d of NPM_DEPS) {
    if (d.re.global) {
      for (const m of content.matchAll(d.re)) deps.add(d.name(m));
    } else if (d.re.test(content)) {
      deps.add(d.name());
    }
  }
  const registryDeps = new Set();
  for (const m of content.matchAll(/from\s+["']@\/(?:components|lib)\/dooping\/([a-z-]+)["']/g)) {
    registryDeps.add(m[1]);
  }
  return { deps: [...deps].sort(), registryDeps: [...registryDeps].sort() };
}

const TITLES = {
  button: ["Button 按鈕", "主要／次要／破壞性動作按鈕，含 asChild 組合。"],
  badge: ["Badge 狀態徽章", "帶文字的狀態標記，不只靠顏色傳達語意。"],
  card: ["Card 卡片", "內容容器：標題／描述／內容／頁尾。"],
  callout: ["Callout 提示框", "良好／警示／提醒／危險四種語意提示。"],
  input: ["Input 輸入框", "文字輸入，高度對齊控制項尺寸 token。"],
  label: ["Label 標籤", "表單標籤（Radix Label）。"],
  checkbox: ["Checkbox 勾選框", "單一勾選（Radix Checkbox）。"],
  select: ["Select 下拉選單", "單選下拉（Radix Select）。"],
  dialog: ["Dialog 對話框", "模態對話框（Radix Dialog）。"],
  tooltip: ["Tooltip 提示泡泡", "hover／鍵盤聚焦／長壓顯示，含邊緣防溢與截斷文字元件。"],
  "number-input": ["NumberInput 數值輸入", "右對齊等寬數字，行動裝置出數字鍵盤。"],
  "seg-group": ["SegGroup 分段選擇", "少量互斥選項，radiogroup ＋ roving tabindex。"],
  chips: ["Chips 多選標籤片", "已選與未選同時可見的多選控制項。"],
  table: ["Table 表格基礎件", "表格語意元素＋數字欄／凍結首欄／可排序表頭。"],
  "data-table": ["DataTable 資料表", "搜尋・單欄篩選・排序・分頁・合計・凍結首欄・CSV 匯出。"],
  "tab-pills": ["TabPills 分頁膠囊", "分頁切換的統一元件，含 tablist 語意。"],
  delta: ["Delta 變異顯示", "箭頭＋文字＋顏色三重編碼的差異呈現。"],
  "empty-state": ["EmptyState 空狀態", "圖示＋標題＋說明＋行動呼籲。"],
  stepper: ["Stepper 步驟指示", "多步驟流程進度，完成態同時用勾選與顏色。"],
  coachmark: ["Coachmark 聚光導引", "純呈現的引導聚光框，可縮小、可鍵盤操作、支援驗收標記。"],
  gantt: ["Gantt 時間軸", "檢視與選取用的精簡時間軸：分類色長條、進度、今天線、列選取。"],
  "graph-canvas": ["GraphCanvas 節點畫布", "@xyflow/react 的薄封裝：token 橋接、狀態層選取、中性聚焦環。"],
  mockup: ["Mockup 文件示意積木", "Placeholder／Spotlight／MockScreenFrame：零截圖文件示意。"],
  skeleton: ["Skeleton 骨架屏", "首載用的版面灰塊；三種載入手段的分工見文件〈載入中〉。"],
  "form-field": ["FormField 欄位包裝", "Label＋aria 連動＋錯誤態的固定寫法元件化，含 FieldError。"],
  "editable-field": ["EditableField 唯讀逐欄編輯", "點擊才進編輯、改動標色、undo/redo 先確認。"],
  "change-summary": ["ChangeSummary 變更摘要", "送出前的舊值→新值清單，可逐欄還原。"],
  "use-record-diff": ["useRecordDiff 變更追蹤", "草稿 vs 原始值的差異與還原 hook。"],
  utils: ["utils 通用工具", "cn 與數值／金額／百分比格式化。"],
  "use-sort": ["useSort 排序 hook", "無→大到小→小到大 的三態排序。"],
  csv: ["csv 序列化", "含 UTF-8 BOM 的 CSV 產出與解析。"],
  download: ["download 下載工具", "觸發瀏覽器下載 Blob。"],
  "forms-diff": ["forms/diff 欄位比對", "FieldSpec 驅動的變更偵測與顯示格式化。"],
  charts: ["Charts 圖表", "後台閱讀型的八種零相依圖＋圖例＋色票工具，含文字與鍵盤等價。"],
};

/**
 * 每個 item 都戳上產生它的「規範版號」。
 *
 * 元件是複製走的（ADR-0004），複製完就與上游脫鉤——所以取用端要問的不是
 * 「該鎖哪一版」，而是「我抄的是哪一版」，這樣上游修 bug 時才知道要不要同步。
 * 版號正本是根目錄 package.json 的 version（＝進版時部署自動蓋的 vX.Y.Z tag），
 * 戳記因此能直接對回 GitHub 上的 tag；packages/react 與 version.ts 跟隨此版號，
 * 三者一致由 tests/tokens.test.ts 把關。
 */
const SPEC_VERSION = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf8"),
).version;

/**
 * 每個 item 都明確相依 `@dooping/tokens`。
 *
 * 元件抄走之後就與上游脫鉤，唯一還硬相依的一層是 token（ADR-0004）——
 * 但 registry item 先前沒有把這件事寫出來，於是 `npx shadcn add` 只複製原始碼、
 * 不會裝 token。取用端要自己知道「還得去裝一個套件、而且要對版本」，
 * 沒人知道的結果就是 npm 上的 token 落後四個版本都沒有人發現：
 * 元件吃 `var(--brand)`、`.state-layer`，宿主的 token 裡卻沒有那些東西，
 * 畫面壞掉而且**不會報錯**。
 *
 * 版號正本取 `packages/react/package.json` 宣告的相依，不在這裡寫第二份真相；
 * 那個值本身又由 tests/tokens.test.ts 綁在 tokens/package.json 上。
 *
 * 用 `^` 而不是釘死：npm 對 0.x 的 `^0.5.0` 解讀是 `>=0.5.0 <0.6.0`，
 * 剛好就是這一層的相容性語意——同 minor 的修補自動吃，跨 minor 要重抄元件。
 */
const TOKENS_VERSION = (() => {
  const declared = JSON.parse(
    readFileSync(join(ROOT, "packages/react/package.json"), "utf8"),
  ).dependencies?.["@dooping/tokens"];
  if (!declared) {
    throw new Error("packages/react/package.json 未宣告 @dooping/tokens 相依");
  }
  return declared.replace(/^[\^~>=<\s]+/, "");
})();
const TOKENS_DEP = `@dooping/tokens@^${TOKENS_VERSION}`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const items = [];
for (const abs of walk(SRC)) {
  const rel = relative(SRC, abs).replace(/\\/g, "/");
  if (rel === "index.ts" || rel === "version.ts" || rel.startsWith("demo/")) continue;
  // charts/ 整組打包成單一 item（見迴圈後）——八種圖互相引用共同底座，
  // 拆成十個 item 只會讓取用端裝到一半。
  if (rel.startsWith("charts/")) continue;

  const modKey = rel.replace(/\.tsx?$/, "");
  const isLib = modKey in LIB_MODULES;
  const name = isLib ? LIB_MODULES[modKey] : basename(modKey);
  // 換行一律正規化成 LF。registry JSON 是**散佈產物**——內容是字串，
  // 換行會被逐字寫進 JSON 裡送給取用端。Windows 上 git 以 CRLF 簽出原始碼，
  // 不正規化的話這裡會產出帶 `\r\n` 的 item：取用端 `npx shadcn add` 抄到 CRLF，
  // 而且 CI（Linux，LF）與本機（Windows，CRLF）會永遠互相判定「registry 不同步」。
  const content = rewrite(readFileSync(abs, "utf8").replace(/\r\n/g, "\n"));
  const { deps, registryDeps } = analyse(content);
  const [title, description] = TITLES[name] ?? [name, ""];

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    version: SPEC_VERSION,
    type: isLib ? "registry:lib" : rel.startsWith("form/") ? "registry:component" : "registry:ui",
    title,
    description,
    dependencies: [TOKENS_DEP, ...deps],
    registryDependencies: registryDeps.map((d) => `${BASE}/r/${d}.json`),
    files: [
      {
        path: `dooping/${rel}`,
        content,
        type: isLib ? "registry:lib" : rel.startsWith("form/") ? "registry:component" : "registry:ui",
        target: isLib ? LIB_TARGET(name) : COMPONENT_TARGET(name),
      },
    ],
  };
  writeFileSync(join(OUT, `${name}.json`), `${JSON.stringify(item, null, 2)}\n`, "utf8");
  items.push({ name, version: SPEC_VERSION, type: item.type, title, description });
}

// ── charts：單一多檔 item ─────────────────────────────────────
//
// 八種圖共用一個底座（型別、PALETTE、capItems、文字／鍵盤等價表）並互相引用，
// 拆成十個 item 的話 `npx shadcn add bar-chart` 會漏掉底座、裝到一半。
// 整組一個 item：一個指令帶走全部，相依仍然只有 token 與 utils。
{
  const chartFiles = walk(join(SRC, "charts"));
  if (chartFiles.length > 0) {
    const allDeps = new Set();
    const allRegistryDeps = new Set();
    const selfNames = new Set(
      chartFiles.map((abs) => basename(relative(SRC, abs)).replace(/\.tsx?$/, "")),
    );
    const files = chartFiles.map((abs) => {
      const rel = relative(SRC, abs).replace(/\\/g, "/");
      const content = rewrite(readFileSync(abs, "utf8").replace(/\r\n/g, "\n"));
      const { deps, registryDeps } = analyse(content);
      for (const d of deps) allDeps.add(d);
      // 圖表檔互相引用會被改寫成 @/components/dooping/<name>，
      // 對 item 內部的引用不算 registry 相依——它們就在同一包裡。
      for (const d of registryDeps) if (!selfNames.has(d)) allRegistryDeps.add(d);
      return {
        path: `dooping/${rel}`,
        content,
        type: "registry:ui",
        target: COMPONENT_TARGET(rel.replace(/^charts\//, "").replace(/\.tsx?$/, "")),
      };
    });
    const [title, description] = TITLES.charts;
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "charts",
      version: SPEC_VERSION,
      type: "registry:ui",
      title,
      description,
      dependencies: [TOKENS_DEP, ...[...allDeps].sort()],
      registryDependencies: [...allRegistryDeps].sort().map((d) => `${BASE}/r/${d}.json`),
      files,
    };
    writeFileSync(join(OUT, "charts.json"), `${JSON.stringify(item, null, 2)}\n`, "utf8");
    items.push({ name: "charts", version: SPEC_VERSION, type: item.type, title, description });
  }
}

// registry 索引（給人看、也給工具列舉用）。
// 索引上的 version 是「main 目前發佈的版本」——取用端拿它跟自己抄走那份比對，
// 就知道自己落後多少。
const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "dooping",
  version: SPEC_VERSION,
  // 配對正本：這一版規範宣告的 @dooping/tokens 版本。
  // 「規範 ↔ tokens」是多對一的配對（token 沒變時多個規範版指向同一 tokens 版），
  // 樞紐是 packages/react/package.json 的相依那一行——這裡只是把它曝露成
  // 機器可讀的欄位，取用端一個端點就能問到配對，不必翻 CHANGELOG。
  tokensVersion: TOKENS_VERSION,
  homepage: BASE,
  items: items
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ ...i, url: `${BASE}/r/${i.name}.json` })),
};
writeFileSync(join(OUT, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log(`[registry] ${items.length} 個項目 → registry/（base: ${BASE}）`);
