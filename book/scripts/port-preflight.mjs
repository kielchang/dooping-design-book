// Tailwind v4 preflight ＋ tokens 基座 → book/src/css/demo-base.css（文件站 demo 宿主基座，ADR-0010）
//
//   node book/scripts/port-preflight.mjs
//
// 文件站關掉全站 preflight（保護 Docusaurus／Infima 的站台 chrome），所以元件需要的樣式前提
// 要在 demo 範圍內自己鋪。v3 時代這份移植是手工逐條抄的；v4 的 preflight 規則更多、
// 有巢狀 @supports、選擇器裡也有逗號（input:where([type='button'], …)），手抄一定會錯。
// 這支把移植變成機械動作：Tailwind 升版讓 tests/host-baseline.test.ts 紅了，重跑這支就好。
//
// 移植規則（tests/host-baseline.test.ts 以獨立寫的第二份實作逐條比對）：
//   - 每個選擇器落到兩個 scope：A) .demo-body 底下的活範例；B) body 直下的 portal 內容
//     （Dialog／Select／Tooltip 掛在 body 直下，逃出 Demo 子樹）。
//   - 一律包 :where() 壓特異度，讓元件的 utilities（同為 0,1,0、較晚載入）靠順序獲勝。
//   - html／:host 規則只搬可繼承、與 scope 根相容的宣告；--theme(...) 依對映表換成 token 變數。
//   - preflight 之後接 @dooping/tokens/tailwind.css 的 @layer base（邊框預設色、按鈕游標），
//     因為 Storybook 與 v4 宿主拿到的前提就是「preflight＋tokens 基座」兩層。
//   - 最後是 Docusaurus 特有的反制段，逐字保留。
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PREFLIGHT = join(ROOT, "node_modules/tailwindcss/preflight.css");
const TOKENS_V4 = join(ROOT, "packages/tokens/dist/tailwind.css");
const OUT = join(ROOT, "book/src/css/demo-base.css");

const B = "body > :where(:not(#__docusaurus))";
const norm = (s) => s.replace(/\s+/g, " ").trim();

/** 只在最外層的逗號切（:where(a, b) 裡的逗號不算） */
function splitTop(text) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));
  return out.map(norm).filter(Boolean);
}

/** 規則清單：{ at（外層 @supports 等，無則 undefined）, sels, decls } */
function parseCss(src) {
  const css = src.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const walk = (text, at) => {
    let pos = 0;
    while (pos < text.length) {
      const open = text.indexOf("{", pos);
      if (open < 0) break;
      let depth = 0;
      let close = -1;
      for (let j = open; j < text.length; j++) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}" && --depth === 0) {
          close = j;
          break;
        }
      }
      const prelude = norm(text.slice(pos, open));
      const body = text.slice(open + 1, close);
      if (prelude.startsWith("@")) walk(body, prelude.startsWith("@layer") ? at : prelude);
      else rules.push({ at, sels: splitTop(prelude), decls: body.split(";").map(norm).filter(Boolean) });
      pos = close + 1;
    }
  };
  walk(css, undefined);
  return rules;
}

function transformSelector(sel) {
  if (sel === "*") return [".demo-body :where(*)", B, `${B} :where(*)`];
  if (sel.startsWith("::")) return [`.demo-body ${sel}`, `${B} ${sel}`];
  const tail = /^(.+?)(::[a-zA-Z-]+)$/.exec(sel);
  if (tail) return [`.demo-body :where(${tail[1]})${tail[2]}`, `${B} :where(${tail[1]})${tail[2]}`];
  return [`.demo-body :where(${sel})`, `${B} :where(${sel})`];
}

/** --theme(--x, fallback) 的解法：本書 token 的對應變數 */
const THEME_MAP = {
  "--default-font-family": "var(--font-family-sans)",
  "--default-font-feature-settings": "normal",
  "--default-font-variation-settings": "normal",
  "--default-mono-font-family": "var(--font-family-mono)",
  "--default-mono-font-feature-settings": "normal",
  "--default-mono-font-variation-settings": "normal",
};
function mapDecl(decl) {
  const t = /--theme\(\s*(--[\w-]+)/.exec(decl);
  if (!t) return decl;
  if (!THEME_MAP[t[1]]) throw new Error(`preflight 用了對映表沒有的 --theme() 鍵：${t[1]}——請更新 THEME_MAP`);
  return `${decl.slice(0, decl.indexOf(":")).trim()}: ${THEME_MAP[t[1]]}`;
}

const HTML_KEEP = new Set(["line-height", "tab-size", "font-family", "font-feature-settings", "font-variation-settings", "-webkit-tap-highlight-color"]);
const HTML_DROP = new Set(["-webkit-text-size-adjust"]);
const prop = (d) => d.slice(0, d.indexOf(":")).trim();

function port(rules) {
  return rules.map((r) => {
    if (r.sels.join(",") === "html,:host") {
      for (const d of r.decls) if (!HTML_KEEP.has(prop(d)) && !HTML_DROP.has(prop(d))) throw new Error(`html 規則出現未分類宣告：${d}`);
      return { at: r.at, sels: [".demo-body", B], decls: r.decls.filter((d) => HTML_KEEP.has(prop(d))).map(mapDecl) };
    }
    return { at: r.at, sels: r.sels.flatMap(transformSelector), decls: r.decls.map(mapDecl) };
  });
}

function emit(rule) {
  const body = `${rule.sels.join(",\n")} {\n${rule.decls.map((d) => `  ${d};`).join("\n")}\n}`;
  return rule.at ? `${rule.at} {\n${body.replace(/^/gm, "  ")}\n}` : body;
}

const tokensBase = (() => {
  const css = readFileSync(TOKENS_V4, "utf8");
  const at = css.indexOf("@layer base");
  if (at < 0) throw new Error("dist/tailwind.css 沒有 @layer base——請先 npm run build:tokens");
  return parseCss(css.slice(at));
})();

const HEADER = `/* demo 宿主基座 — Tailwind v4 preflight ＋ @dooping/tokens 基座，移植到兩個 scope，
 * 讓文件站的活範例拿到與 Storybook（v4）完全相同的樣式前提（ADR-0010）。
 *
 * ⚠️ 本檔由 book/scripts/port-preflight.mjs 產生，請勿手改。
 * tests/host-baseline.test.ts 會拿 node_modules/tailwindcss/preflight.css 與 tokens 的 tailwind.css
 * 逐條比對；Tailwind 升版讓那支測試紅了，重跑產生器即可。
 *
 * 為什麼需要：元件的 utility 只宣告 border-width；「border-style: solid、border-width: 0、
 * 預設邊框色」是基座提供的隱含契約。文件站關掉全站 preflight（保護 Docusaurus 站台 chrome），
 * 所以這份契約要在範例的範圍內自己鋪——否則按鈕吃瀏覽器原生外框、表格吃 Infima 格線、
 * 元件自畫的邊框整批安靜消失。
 *
 * 兩個 scope：
 *   A) .demo-body :where(…)                      — Demo 容器內的活範例
 *   B) body > :where(:not(#__docusaurus)) :where(…) — portal 內容（Dialog／Select／Tooltip／
 *      資料表篩選面板都掛在 body 直下，逃出 Demo 子樹）
 *
 * 特異度是承重結構：一律 :where() 壓到 (0,1,0) 以下——蓋得過 Infima 的裸元素規則與 UA 預設，
 * 又讓元件的 utilities（同為 0,1,0、在本檔之後載入、同樣不在 cascade layer 裡）靠順序獲勝。
 * 本檔必須在 kit.css 的 tailwindcss/utilities.css 之前引入。
 *
 * 注意：Demo 內只放元件，不要放散文清單或連結——a／ol／ul 在這裡會被 reset 成元件語境。
 */`;

const HOST_EXTRA = `/* ── 以下不是 preflight：Docusaurus 宿主特有的反制與例外 ────────── */

/* Infima 對裸 <table> 的格線、斑馬、儲存格 padding 全走 --ifm-table-* 變數。
   在容器上把變數歸零——變數靠繼承生效、不吃特異度，所以不會誤傷元件自己的
   bg/padding utilities（它們是顯式宣告，不讀這些變數）。 */
.demo-body {
  --ifm-table-border-width: 0;
  --ifm-table-cell-padding: 0;
  --ifm-table-stripe-background: transparent;
  --ifm-table-background: transparent;
  --ifm-table-head-background: transparent;
}

/* Infima 的 table { display: block; margin-bottom; overflow: auto } 沒走變數，
   用結構規則反制（(0,1,0) 蓋過裸元素的 (0,0,1)）。 */
.demo-body :where(table) {
  display: table;
  margin-bottom: 0;
  overflow: visible;
}

/* 全站唯一在 Demo 外裸用的真元件是 Callout（散文旁註）。它只缺基座的
   border-style: solid 這一項；用它的 a11y role 當穩定鉤子，不動 tsx、不動 DOM。
   誤中 Docusaurus admonition 也無害——Infima 的 .alert 本來就是 solid。 */
.markdown :where([role="note"]),
.markdown :where([role="alert"]) {
  border-style: solid;
}
`;

const preflight = port(parseCss(readFileSync(PREFLIGHT, "utf8")));
const base = port(tokensBase);
const out = [
  HEADER,
  "",
  "/* ── Tailwind v4 preflight 移植（順序與原檔一致） ─────────────── */",
  "",
  preflight.map(emit).join("\n\n"),
  "",
  "/* ── @dooping/tokens 的 v4 基座（tailwind.css 的 @layer base） ──── */",
  "",
  base.map(emit).join("\n\n"),
  "",
  HOST_EXTRA,
].join("\n");

writeFileSync(OUT, out, "utf8");
console.log(`[port-preflight] preflight ${preflight.length} 條＋tokens 基座 ${base.length} 條 → book/src/css/demo-base.css`);
