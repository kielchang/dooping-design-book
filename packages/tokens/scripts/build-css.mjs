// tokens.json → dist/tokens.css
//
// 產物是「框架中立」的：一份 CSS 變數 + 少量語意 utility class，不含任何 Tailwind 指令，
// 因此可被 Tailwind、CSS Modules、原生 CSS、甚至非 React 的宿主直接吃。
//
// 深色一次宣告兩種鉤子：`.dark`（Tailwind / shadcn 慣例）與 `[data-theme="dark"]`
// （Docusaurus、部分文件站與後台框架的慣例）。兩者共用同一組規則，見 ADR-0005 補充。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const tokens = JSON.parse(readFileSync(join(ROOT, "src/tokens.json"), "utf8"));

const isToken = (v) => v && typeof v === "object" && typeof v.value === "string";
const entries = (obj) => Object.entries(obj ?? {}).filter(([, v]) => isToken(v));

/** 一組 name→token 轉成 `  --prefix-name: value;` 行 */
function vars(obj, prefix = "") {
  return entries(obj).map(([k, v]) => `  --${prefix}${k}: ${v.value};`);
}

const lines = [];
lines.push("/**");
lines.push(" * @dooping/tokens — 由 src/tokens.json 產生，請勿手改。");
lines.push(` * 版本 ${tokens.meta.version}`);
lines.push(" */");
lines.push("");

// ── :root（淺色 + 全部非色彩 token） ───────────────────────────
lines.push(":root {");
lines.push("  /* 色彩：語意（淺色） */");
lines.push(...vars(tokens.color.light));
lines.push("");
lines.push("  /* 圖表分類色票（淺色） */");
lines.push(...vars(tokens.chart.light));
lines.push("");
lines.push("  /* 圓角 */");
lines.push(`  --radius: ${tokens.radius.base.value};`);
lines.push(...entries(tokens.radius).filter(([k]) => k !== "base").map(([k, v]) => `  --radius-${k}: ${v.value};`));
lines.push("");
lines.push("  /* 間距 */");
lines.push(...entries(tokens.space).map(([k, v]) => `  --space-${k.replace(".", "_")}: ${v.value};`));
lines.push("");
lines.push("  /* 字級 */");
lines.push(...entries(tokens.fontSize).flatMap(([k, v]) => [
  `  --font-size-${k}: ${v.value};`,
  ...(v.lineHeight ? [`  --line-height-${k}: ${v.lineHeight};`] : []),
]));
lines.push("");
lines.push("  /* 字體 */");
lines.push(...vars(tokens.fontFamily, "font-family-"));
lines.push("");
lines.push("  /* 陰影（表面抬升層級） */");
lines.push(...vars(tokens.shadow, "shadow-"));
lines.push("");
lines.push("  /* 動態 */");
lines.push(...vars(tokens.duration, "duration-"));
lines.push(...vars(tokens.easing, "easing-"));
lines.push("");
lines.push("  /* 互動尺寸 */");
lines.push(...vars(tokens.size, "size-"));
lines.push("}");
lines.push("");

// ── 深色：兩種宿主鉤子 ────────────────────────────────────────
lines.push('.dark,\n[data-theme="dark"] {');
lines.push("  /* 色彩：語意（深色） */");
lines.push(...vars(tokens.color.dark));
lines.push("");
lines.push("  /* 圖表分類色票（深色） */");
lines.push(...vars(tokens.chart.dark));
lines.push("}");
lines.push("");

// ── 語意 utility：欄位「可編輯 vs 唯讀」 ──────────────────────
lines.push(`/* 欄位語意（單一二分法）：可編輯＝淡冷底＋清楚邊框；唯讀／計算值＝muted。
   刻意不做「輸入／假設／公式」三色——那是試算表儲存格慣例，對網頁表單語意不成立（ADR-0002）。 */
.field-editable {
  background-color: hsl(var(--field-editable));
  color: hsl(var(--field-editable-foreground));
  border-color: hsl(var(--field-border));
}
.field-readonly {
  background-color: hsl(var(--field-readonly));
  color: hsl(var(--field-readonly-foreground));
}
`);

// ── 觸控目標（WCAG 2.5.5） ────────────────────────────────────
lines.push(`/* 觸控目標：粗指標（手機／平板）才放大，桌機維持精簡尺寸。 */
@media (pointer: coarse) {
  .tap-target {
    min-height: var(--size-tap-target);
    min-width: var(--size-tap-target);
  }
  .tap-target-y {
    min-height: var(--size-tap-target);
  }
}
`);

// ── 聚光脈動環（引導與文件示意共用同一種「看這裡」語言） ──────
lines.push(`/* 聚光環：引導式導覽與文件示意共用同一視覺語言。尊重 prefers-reduced-motion。 */
@keyframes dooping-spotlight-pulse {
  0%   { box-shadow: 0 0 0 2px hsl(var(--primary)), 0 0 0 4px hsl(var(--primary) / 0.35); }
  70%  { box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 0 14px hsl(var(--primary) / 0); }
  100% { box-shadow: 0 0 0 2px hsl(var(--primary)), 0 0 0 4px hsl(var(--primary) / 0); }
}
.spotlight-ring {
  animation: dooping-spotlight-pulse var(--duration-slow) var(--easing-out) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .spotlight-ring {
    animation: none;
    box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--primary) / 0.3);
  }
}
`);

// ── 列印 ──────────────────────────────────────────────────────
lines.push(`/* 列印：畫面底色在後台系統裡是「內容」不是裝飾（徽章／提示框／佔位塊全靠底色辨義），
   因此強制 print-color-adjust: exact。控制項一律隱藏，資料不跨頁截斷。 */
.print-only { display: none; }
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-only { display: block; }
  .print-hidden { display: none !important; }
  table { break-inside: auto; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr, img, svg, figure, blockquote, pre, li { break-inside: avoid; }
  .print-block { break-inside: avoid; }
  h1, h2, h3, h4 { break-after: avoid; break-inside: avoid; }
  p { orphans: 3; widows: 3; }
  .spotlight-ring {
    animation: none !important;
    box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 0 6px hsl(var(--primary) / 0.3) !important;
  }
}
`);

const css = lines.join("\n");
mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist/tokens.css"), css, "utf8");
console.log(`[@dooping/tokens] dist/tokens.css ${css.length} bytes`);

// ── 同時產出 TS 資料模組 ──────────────────────────────────────
// 不讓 index.ts 直接 `import ... from "./tokens.json"`：import attributes（`with { type: "json" }`）
// 在 webpack/vite/tsc 各家支援度不一致，宿主一多就會炸。改用產生的 .ts 模組，任何打包器都吃得下。
const ts = `// 由 scripts/build-css.mjs 從 tokens.json 產生，請勿手改。
export default ${JSON.stringify(tokens, null, 2)} as const;
`;
writeFileSync(join(ROOT, "src/tokens.data.ts"), ts, "utf8");
console.log("[@dooping/tokens] src/tokens.data.ts 已更新");
