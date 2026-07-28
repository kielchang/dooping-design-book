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
const BASE = (process.env.REGISTRY_BASE ?? "https://kielchang.github.io/doping-design-book").replace(/\/$/, "");

/** 目標專案的落點：元件一律 components/doping/、工具一律 lib/doping/。 */
const COMPONENT_TARGET = (name) => `components/doping/${name}.tsx`;
const LIB_TARGET = (name) => `lib/doping/${name}.ts`;

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
    .replace(/from\s+["']\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/doping/forms-diff"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/doping/forms-diff"')
    .replace(/from\s+["']\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/doping/$1"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/doping/$1"')
    .replace(/from\s+["']\.\.\/(?:ui|form)\/([a-z-]+)["']/g, 'from "@/components/doping/$1"')
    .replace(/from\s+["']\.\/([a-z-]+)["']/g, 'from "@/components/doping/$1"');
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
  for (const m of content.matchAll(/from\s+["']@\/(?:components|lib)\/doping\/([a-z-]+)["']/g)) {
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
  mockup: ["Mockup 文件示意積木", "Placeholder／Spotlight／MockScreenFrame：零截圖文件示意。"],
  "editable-field": ["EditableField 唯讀逐欄編輯", "點擊才進編輯、改動標色、undo/redo 先確認。"],
  "change-summary": ["ChangeSummary 變更摘要", "送出前的舊值→新值清單，可逐欄還原。"],
  "use-record-diff": ["useRecordDiff 變更追蹤", "草稿 vs 原始值的差異與還原 hook。"],
  utils: ["utils 通用工具", "cn 與數值／金額／百分比格式化。"],
  "use-sort": ["useSort 排序 hook", "無→大到小→小到大 的三態排序。"],
  csv: ["csv 序列化", "含 UTF-8 BOM 的 CSV 產出與解析。"],
  download: ["download 下載工具", "觸發瀏覽器下載 Blob。"],
  "forms-diff": ["forms/diff 欄位比對", "FieldSpec 驅動的變更偵測與顯示格式化。"],
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const items = [];
for (const abs of walk(SRC)) {
  const rel = relative(SRC, abs).replace(/\\/g, "/");
  if (rel === "index.ts" || rel === "version.ts" || rel.startsWith("demo/")) continue;

  const modKey = rel.replace(/\.tsx?$/, "");
  const isLib = modKey in LIB_MODULES;
  const name = isLib ? LIB_MODULES[modKey] : basename(modKey);
  const content = rewrite(readFileSync(abs, "utf8"));
  const { deps, registryDeps } = analyse(content);
  const [title, description] = TITLES[name] ?? [name, ""];

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: isLib ? "registry:lib" : rel.startsWith("form/") ? "registry:component" : "registry:ui",
    title,
    description,
    dependencies: deps,
    registryDependencies: registryDeps.map((d) => `${BASE}/r/${d}.json`),
    files: [
      {
        path: `doping/${rel}`,
        content,
        type: isLib ? "registry:lib" : rel.startsWith("form/") ? "registry:component" : "registry:ui",
        target: isLib ? LIB_TARGET(name) : COMPONENT_TARGET(name),
      },
    ],
  };
  writeFileSync(join(OUT, `${name}.json`), `${JSON.stringify(item, null, 2)}\n`, "utf8");
  items.push({ name, type: item.type, title, description });
}

// registry 索引（給人看、也給工具列舉用）
const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "doping",
  homepage: BASE,
  items: items
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => ({ ...i, url: `${BASE}/r/${i.name}.json` })),
};
writeFileSync(join(OUT, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log(`[registry] ${items.length} 個項目 → registry/（base: ${BASE}）`);
