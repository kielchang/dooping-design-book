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

// ── 多色相主題 ────────────────────────────────────────────────
// 主題只影響 5 個 token（brand 三件組 + ring），其餘語意色與主題無關——
// 背景、邊框、狀態色在所有主題之間完全相同。因此主題層很薄，
// 而且**取用端不設定 data-color-theme 時，輸出與沒有主題功能之前一模一樣**。
//
// --ring 是唯一被主題覆蓋的既有 token：它在 color.* 裡仍保有中性值當後備，
// 主題層宣告在後面把它蓋掉。宿主若只引 tokens.css 而不設任何主題屬性，
// 拿到的就是預設主題（石墨）——觀感與原本的中性殼一致。
const THEMES = tokens.themes ?? {};
const DEFAULT_THEME = tokens.meta.defaultTheme;
const themeVars = (name, mode) => vars(THEMES[name]?.[mode] ?? {});

// ── :root（淺色 + 全部非色彩 token） ───────────────────────────
lines.push(":root {");
lines.push("  /* 色彩：語意（淺色） */");
lines.push(...vars(tokens.color.light));
lines.push("");
lines.push(`  /* 主題色（預設：${THEMES[DEFAULT_THEME]?.$label ?? DEFAULT_THEME}，淺色） */`);
lines.push(...themeVars(DEFAULT_THEME, "light"));
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
lines.push("");
lines.push("  /* 互動狀態層強度（不分淺深：疊加色取 currentColor，方向自動正確） */");
lines.push(...vars(tokens.state, "state-"));
lines.push("}");
lines.push("");

// ── 深色：兩種宿主鉤子 ────────────────────────────────────────
lines.push('.dark,\n[data-theme="dark"] {');
lines.push("  /* 色彩：語意（深色） */");
lines.push(...vars(tokens.color.dark));
lines.push("");
lines.push(`  /* 主題色（預設：${THEMES[DEFAULT_THEME]?.$label ?? DEFAULT_THEME}，深色） */`);
lines.push(...themeVars(DEFAULT_THEME, "dark"));
lines.push("");
lines.push("  /* 圖表分類色票（深色） */");
lines.push(...vars(tokens.chart.dark));
lines.push("}");
lines.push("");

// ── 非預設主題 ────────────────────────────────────────────────
// 順序即是 cascade：淺色區塊全部排在深色區塊之後，深色區塊靠
// `[data-color-theme=X].dark`（0,2,0）的較高權重蓋回來。少了這層權重差，
// 「深色 + 非預設主題」會拿到淺色的 brand。
const OTHERS = Object.keys(THEMES).filter((n) => n !== DEFAULT_THEME);
if (OTHERS.length) {
  lines.push("/* 其餘色相主題：宿主在 <html> 上設 data-color-theme=\"<name>\" 切換。 */");
  for (const name of OTHERS) {
    lines.push(`[data-color-theme="${name}"] { /* ${THEMES[name].$label} */`);
    lines.push(...themeVars(name, "light"));
    lines.push("}");
  }
  for (const name of OTHERS) {
    lines.push(`[data-color-theme="${name}"].dark,\n[data-color-theme="${name}"][data-theme="dark"] {`);
    lines.push(...themeVars(name, "dark"));
    lines.push("}");
  }
  lines.push("");
}

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

// ── 互動狀態層 ────────────────────────────────────────────────
// 一條原則：每個顏色變化都要對應一件使用者需要知道的事，強度與那件事的**持續時間**成正比。
//
// 疊加而不是換色。`--accent` 那種「hover 專用底色」是**取代**：斑馬列本來就是 muted，
// hover 換成 accent（同值）等於沒變。這裡改成在元件自己的底色上疊一層，
// 「深了一階」這件事因此在 card／muted／field-* 任何底色上都成立。
//
// 疊加色取 `currentColor`——也就是該表面自己的內容色。這是刻意的：
// 深色模式下 `--foreground` 與 `--primary` 是同一個近白，用它去疊實色按鈕會得到 ΔE00 0.0
// （按鈕完全沒有 hover 回饋）；取 currentColor 則自動是「深底配亮疊、亮底配深疊」。
//
// 走 background-image 而不是 ::after 疊加層，理由是**畫在哪一層**：
// background-image 落在背景層——在 background-color 之上、內容之下。
// ::after 會蓋在內容上，已選列裡的徽章會被染掉（實測 #dcfce7 → #abc4b4）。
// 附帶好處：不必給元件加 position: relative（會改變絕對定位子元素的容器），
// 也不必 border-radius: inherit（背景本來就被圓角裁切）。
//
// @property 只影響**過渡**：註冊成 <percentage> 之後這個變數才能被 transition 內插。
// 不支援的瀏覽器仍會套用狀態，只是瞬間切換而不是淡入——降級是安全的。
//
// ⚠️ 唯一的取用端陷阱：`background` **簡寫**會把 background-image 重設為 none，狀態層整個消失。
// 一律用 `background-color`（Tailwind 的 `bg-*` 產的就是 background-color，因此不受影響）。
lines.push(`/* 互動狀態層：hover／pressed／selected 三級，疊在元件自己的底色上。
   強度來自 --state-*-alpha；顏色一律是 currentColor，因此淺深兩模式共用同一組值。 */
@property --state-layer-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
.state-layer {
  background-image: linear-gradient(
    color-mix(in srgb, currentColor var(--state-layer-alpha), transparent),
    color-mix(in srgb, currentColor var(--state-layer-alpha), transparent)
  );
  /* 一併涵蓋 transition-colors 管的那幾個屬性：Tailwind 的 utility 排在 tokens.css 之後，
     元件若同時寫 transition-colors，那個簡寫會蓋掉這裡的 transition-property，
     狀態層就只會瞬間切換。因此規則是「用了 state-layer 就不要再寫 transition-colors」，
     由 tests/ 的守衛擋住，而這裡把顏色類屬性補進來，拿掉那個 utility 不會少東西。 */
  transition:
    --state-layer-alpha var(--duration-fast) var(--easing-out),
    color var(--duration-fast) var(--easing-out),
    background-color var(--duration-fast) var(--easing-out),
    border-color var(--duration-fast) var(--easing-out);
}
.state-layer:hover { --state-layer-alpha: var(--state-hover-alpha); }
/* 已選壓過 hover：列已經在最強的一階，再往上加會越過「太刻意」的上限。 */
.state-layer[data-state="selected"] { --state-layer-alpha: var(--state-selected-alpha); }
/* 按住壓過所有狀態——包含已選：22% → 14% 是往回一階，方向相反但看得見（ΔE00 4.7）。 */
.state-layer:active { --state-layer-alpha: var(--state-pressed-alpha); }
/* 停用是「移除可供性」，不是「加訊息」：不給狀態層，只留 opacity。 */
.state-layer:disabled,
.state-layer[aria-disabled="true"],
.state-layer[data-disabled] { --state-layer-alpha: 0%; }
@media (prefers-reduced-motion: reduce) {
  .state-layer { transition: none; }
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
