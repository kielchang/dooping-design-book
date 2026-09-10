// tokens.json → dist/tailwind.css（Tailwind v4 入口）
//
// v4 是 CSS-first：主題不寫在 tailwind.config.js，而是 CSS 裡的 @theme。
// 這個檔案的定位與 v3 的 tailwind-preset.cjs 完全相同——**只做「token → utility 名稱」的對映，
// 不決定任何值**。值只活在 dist/tokens.css 一處，這裡一律 var() 過去；
// 所以同一份 class 在任何宿主都能換皮而不重編譯，v3 與 v4 宿主拿到的畫面是同一份事實。
//
// 用法（順序是承重結構：tokens.css 提供值，本檔提供名稱）：
//   @import "tailwindcss";
//   @import "tw-animate-css";
//   @import "@dooping/tokens/tokens.css";
//   @import "@dooping/tokens/tailwind.css";
//
// 三個實測過的前提（tailwindcss 4.3.3，編譯輸出逐行看過）：
// 1. 用 `@theme inline reference`，兩個字都不能少。`inline` 讓 utility 直接內聯 var(--x)；
//    `reference` 讓這些對映不往 :root 吐變數。只寫 inline 時，v4 會把「被 utility 用到的」
//    主題變數吐進 `@layer theme { :root, :host { … } }`——而圓角與陰影的 Tailwind 命名空間
//    剛好與 tokens.css 同名，吐出來就是 `--shadow-sm: var(--shadow-sm)` 自我參照。
//    一般頁面靠 unlayered 的 tokens.css 蓋掉而看不出來；shadow DOM 的 :host 裡就是失效。
// 2. 色彩維持 HSL 三元組（v3 宿主、元件內的 hsl(var(--x))、JS API 都靠這個格式），
//    這裡用 hsl(var(--x)) 包一層；`bg-primary/50` 由 v4 轉成 color-mix(in oklab, …)，
//    透明度修飾照常可用。
// 3. `--color-*: initial` 清空預設色盤——v3 preset「覆蓋 theme.colors」在 v4 的等價物，
//    也就是漂移防線①。white／black 要補回；transparent／current／inherit 是 v4 內建靜態 utility。
//
// 色鍵集合一律從 tokens.json 推導，不手列：v3 preset 手列主題層鍵，曾經漏過一次
// （sidebar-primary/accent），這裡不重蹈覆轍。tests/tokens.test.ts 會拿本檔與 JSON、
// 與 v3 preset 三方逐鍵比對。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const tokens = JSON.parse(readFileSync(join(ROOT, "src/tokens.json"), "utf8"));

const isToken = (v) => v && typeof v === "object" && typeof v.value === "string";
const keys = (obj) => Object.keys(obj ?? {}).filter((k) => isToken(obj[k]));

const semantic = keys(tokens.color.light);
const semanticSet = new Set(semantic);
// 只存在於主題層的鍵（brand 家族、sidebar-primary/accent 家族）＝各主題鍵集的聯集 − 語意層鍵集
const themeOnly = [
  ...new Set(Object.values(tokens.themes ?? {}).flatMap((t) => keys(t.light))),
].filter((k) => !semanticSet.has(k));
const chart = keys(tokens.chart.light);

const out = [
  "/**",
  " * @dooping/tokens — Tailwind v4 對映，由 src/tokens.json 產生，請勿手改。",
  ` * 版本 ${tokens.meta.version}`,
  " *",
  " * 用法（順序是承重結構：tokens.css 提供值，本檔只做名稱對映）：",
  ' *   @import "tailwindcss";',
  ' *   @import "tw-animate-css";',
  ' *   @import "@dooping/tokens/tokens.css";',
  ' *   @import "@dooping/tokens/tailwind.css";',
  " */",
  "",
  '/* 深色兩種宿主鉤子：.dark（Tailwind／shadcn 慣例）＋ [data-theme="dark"]（文件站／後台框架慣例） */',
  '@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));',
  "",
  "/* inline：utility 直接內聯 var(--x)；reference：不往 :root 吐變數（圓角與陰影與 tokens.css 同名，吐出來會自我參照） */",
  "@theme inline reference {",
  "  /* 清空預設色盤（漂移防線①）：bg-red-500 在取用端編譯期就產不出樣式。 */",
  "  --color-*: initial;",
  "  --color-white: #fff;",
  "  --color-black: #000;",
  "",
  "  /* 語意色 */",
  ...semantic.map((k) => `  --color-${k}: hsl(var(--${k}));`),
  "",
  "  /* 主題層獨有（值由 <html data-color-theme> 決定） */",
  ...themeOnly.map((k) => `  --color-${k}: hsl(var(--${k}));`),
  "",
  "  /* 圖表色票與圖表骨架（hex，不包 hsl） */",
  ...chart.map((k) => `  --color-${k}: var(--${k});`),
  "",
  "  /* 圓角（base 是 --radius 本體；full 由 rounded-full 靜態提供） */",
  ...keys(tokens.radius)
    .filter((k) => k !== "base" && k !== "full")
    .map((k) => `  --radius-${k}: var(--radius-${k});`),
  "",
  "  /* 陰影（表面抬升三階） */",
  ...keys(tokens.shadow).map((k) => `  --shadow-${k}: var(--shadow-${k});`),
  "",
  "  /* 字級（含行高） */",
  ...keys(tokens.fontSize).flatMap((k) => [
    `  --text-${k}: var(--font-size-${k});`,
    ...(tokens.fontSize[k].lineHeight ? [`  --text-${k}--line-height: var(--line-height-${k});`] : []),
  ]),
  "",
  "  /* 字體 */",
  ...keys(tokens.fontFamily).map((k) => `  --font-${k}: var(--font-family-${k});`),
  "",
  "  /* 動態（duration-fast、ease-standard…） */",
  ...keys(tokens.duration).map((k) => `  --transition-duration-${k}: var(--duration-${k});`),
  ...keys(tokens.easing).map((k) => `  --ease-${k}: var(--easing-${k});`),
  "",
  "  /* 互動尺寸（h-control、size-tap-target…）。一般間距刻度維持 Tailwind 數字，不做語意化間距。 */",
  ...keys(tokens.size).map((k) => `  --spacing-${k}: var(--size-${k});`),
  "}",
  "",
  "/* 宿主基座（ADR-0010 在 v4 的對應）：v4 preflight 把邊框色改成 currentColor、拿掉按鈕游標。",
  "   元件的 utility 只宣告 border-width，邊框色與游標是它們假設存在的前提——由套件一次補齊，",
  "   不必每個宿主的 globals.css 記得補。 */",
  "@layer base {",
  "  *, ::before, ::after, ::backdrop, ::file-selector-button {",
  "    border-color: hsl(var(--border));",
  "  }",
  '  button:not(:disabled), [role="button"]:not(:disabled) {',
  "    cursor: pointer;",
  "  }",
  "}",
  "",
];

const css = out.join("\n");
mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist/tailwind.css"), css, "utf8");
console.log(
  `[@dooping/tokens] dist/tailwind.css ${css.length} bytes（色鍵 ${semantic.length}＋${themeOnly.length}＋${chart.length}）`,
);
