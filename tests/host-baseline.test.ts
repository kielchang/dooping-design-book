// 宿主基座守衛 — 「元件假設的樣式前提」與「宿主實際提供的 reset」是同一份事實的兩個所在。
//
// 事實一：Tailwind v4 的 preflight.css ＋ @dooping/tokens/tailwind.css 的 @layer base——
//   Storybook 與任何 v4 宿主拿到的樣式前提，就是這兩層。
// 事實二：book/src/css/demo-base.css——文件站關掉全站 preflight，改在 demo scope 內移植同一份。
//
// demo-base 由 book/scripts/port-preflight.mjs 產生。這支測試用**獨立寫的第二份**移植規則逐條比對：
// 拿產生器自己的函式來驗產生器，等於沒驗。
//   - Tailwind 升版改了 preflight、或 tokens 基座改了 → 這裡紅，重跑產生器；
//   - demo-base 被手改、少一條、scope 前綴寫錯 → 這裡紅；
//   - kit.css 的引入順序與「utilities 不進 cascade layer」是承重結構 → 這裡鎖。
//
// 為什麼讀**根**的 node_modules：CI 的 npm test 跑在 book/ 的 npm ci 之前，book/node_modules 當下不存在。
// 兩邊裝到同一版由「宣告範圍字串相等」那條保證。背景與取捨見 ADR-0010。
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

type Rule = { at: string | null; sels: string[]; decls: string[] };
const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/** 逗號切分；小括號與中括號裡的逗號不算（input:where([type='button'], [type='reset']) 是一個選擇器） */
function splitList(text: string): string[] {
  const out: string[] = [];
  let buf = "";
  let depth = 0;
  for (const ch of text) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(buf);
      buf = "";
    } else buf += ch;
  }
  out.push(buf);
  return out.map(squash).filter(Boolean);
}

/**
 * 以堆疊掃大括號，收集一般規則並記下外層條件（@supports）。@layer 視為透明——
 * demo-base 不進 layer，比對的是「規則本身」而不是它在來源裡被包在哪個 layer。
 */
function parseCss(src: string): Rule[] {
  const text = src.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  const stack: { prelude: string; start: number }[] = [];
  let mark = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      stack.push({ prelude: squash(text.slice(mark, i)), start: i + 1 });
      mark = i + 1;
    } else if (ch === "}") {
      const top = stack.pop();
      if (!top) throw new Error("CSS 大括號不成對");
      if (!top.prelude.startsWith("@")) {
        const wrappers = stack.map((s) => s.prelude).filter((p) => !p.startsWith("@layer"));
        rules.push({
          at: wrappers.length ? wrappers.join(" ") : null,
          sels: splitList(top.prelude),
          decls: text.slice(top.start, i).split(";").map(squash).filter(Boolean),
        });
      }
      mark = i + 1;
    }
  }
  return rules;
}

// ── 移植規則（book/scripts/port-preflight.mjs 的第二份獨立實作） ──
const B_PREFIX = "body > :where(:not(#__docusaurus))";

function transformSelector(sel: string): string[] {
  if (sel === "*") return [".demo-body :where(*)", B_PREFIX, `${B_PREFIX} :where(*)`];
  if (sel.startsWith("::")) return [`.demo-body ${sel}`, `${B_PREFIX} ${sel}`];
  const tail = /^(.+?)(::[a-zA-Z-]+)$/.exec(sel);
  if (tail) return [`.demo-body :where(${tail[1]})${tail[2]}`, `${B_PREFIX} :where(${tail[1]})${tail[2]}`];
  return [`.demo-body :where(${sel})`, `${B_PREFIX} :where(${sel})`];
}

/** --theme(--x, fallback) 的解法。preflight 出現本表以外的鍵時直接失敗——那代表要人工重審移植。 */
const THEME_MAP: Record<string, string> = {
  "--default-font-family": "var(--font-family-sans)",
  "--default-font-feature-settings": "normal",
  "--default-font-variation-settings": "normal",
  "--default-mono-font-family": "var(--font-family-mono)",
  "--default-mono-font-feature-settings": "normal",
  "--default-mono-font-variation-settings": "normal",
};

function mapDecl(decl: string): string {
  const t = /--theme\(\s*(--[\w-]+)/.exec(decl);
  if (!t) return decl;
  const mapped = THEME_MAP[t[1]];
  if (!mapped) throw new Error(`preflight 用了對映表沒有的 --theme() 鍵：${t[1]}——請更新移植與 THEME_MAP`);
  return `${decl.slice(0, decl.indexOf(":")).trim()}: ${mapped}`;
}

// html/:host 只搬可繼承、與 scope 根相容的宣告；兩張清單都是顯式的，
// preflight 新增了不在任一清單的宣告時要人工決定去留，不能默默通過。
const HTML_KEEP = new Set([
  "line-height", "tab-size", "font-family", "font-feature-settings", "font-variation-settings", "-webkit-tap-highlight-color",
]);
const HTML_DROP = new Set(["-webkit-text-size-adjust"]);
const propOf = (d: string) => d.slice(0, d.indexOf(":")).trim();

function port(rules: Rule[]): Rule[] {
  return rules.map((rule) => {
    if (rule.sels.join(",") === "html,:host") {
      for (const d of rule.decls) {
        if (!HTML_KEEP.has(propOf(d)) && !HTML_DROP.has(propOf(d)))
          throw new Error(`preflight 的 html 規則出現未分類宣告：${d}`);
      }
      return { at: rule.at, sels: [".demo-body", B_PREFIX], decls: rule.decls.filter((d) => HTML_KEEP.has(propOf(d))).map(mapDecl) };
    }
    return { at: rule.at, sels: rule.sels.flatMap(transformSelector), decls: rule.decls.map(mapDecl) };
  });
}

/** 逐條比對（外層條件逐字、selector 當集合、宣告當序列），回傳差異訊息。 */
function diffRules(expected: Rule[], actual: Rule[]): string[] {
  const diffs: string[] = [];
  if (expected.length !== actual.length) diffs.push(`規則數不符：應為 ${expected.length}，實際 ${actual.length}`);
  for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
    const e = expected[i];
    const a = actual[i];
    if (e.at !== a.at) diffs.push(`第 ${i + 1} 條外層條件不符：應為 ${e.at}，實際 ${a.at}`);
    const eSet = [...e.sels].sort().join(" | ");
    const aSet = [...a.sels].sort().join(" | ");
    if (eSet !== aSet) diffs.push(`第 ${i + 1} 條 selector 不符：\n  應為 ${eSet}\n  實際 ${aSet}`);
    if (e.decls.join("; ") !== a.decls.join("; "))
      diffs.push(`第 ${i + 1} 條（${a.sels[0] ?? "?"}）宣告不符：\n  應為 ${e.decls.join("; ")}\n  實際 ${a.decls.join("; ")}`);
  }
  return diffs;
}

// demo-base 檔尾的宿主反制段（不是 preflight，是 Docusaurus 特有），逐項鎖死。
const HOST_EXTRA: Rule[] = [
  {
    at: null,
    sels: [".demo-body"],
    decls: [
      "--ifm-table-border-width: 0",
      "--ifm-table-cell-padding: 0",
      "--ifm-table-stripe-background: transparent",
      "--ifm-table-background: transparent",
      "--ifm-table-head-background: transparent",
    ],
  },
  { at: null, sels: [".demo-body :where(table)"], decls: ["display: table", "margin-bottom: 0", "overflow: visible"] },
  { at: null, sels: ['.markdown :where([role="note"])', '.markdown :where([role="alert"])'], decls: ["border-style: solid"] },
];

const preflight = parseCss(read("node_modules/tailwindcss/preflight.css"));
const tokensCss = read("packages/tokens/dist/tailwind.css");
const tokensBase = parseCss(tokensCss.slice(tokensCss.indexOf("@layer base")));
const demoBase = parseCss(read("book/src/css/demo-base.css"));
const expected = [...port(preflight), ...port(tokensBase)];

describe("宿主基座：demo-base 與 v4 preflight＋tokens 基座逐條對應", () => {
  it("移植段逐條相符（Tailwind 升版、tokens 基座改動、demo-base 被手改時此條會紅）", () => {
    const diffs = diffRules(expected, demoBase.slice(0, expected.length));
    expect(diffs, `${diffs.join("\n\n")}\n\n→ 重跑 node book/scripts/port-preflight.mjs`).toEqual([]);
  });

  it("守衛沒有空轉：規則數有下限", () => {
    // v4.3 的 preflight 約 38 條；掉到 30 以下代表解析壞了或檔案被清空
    expect(preflight.length).toBeGreaterThanOrEqual(30);
    expect(tokensBase.length, "tokens 的 tailwind.css 應有邊框色與按鈕游標兩條基座").toBeGreaterThanOrEqual(2);
    expect(demoBase.length).toBe(expected.length + HOST_EXTRA.length);
  });

  it("宿主反制段（Infima 表格變數、display 反制、Callout 例外）逐項相符", () => {
    const diffs = diffRules(HOST_EXTRA, demoBase.slice(expected.length));
    expect(diffs, diffs.join("\n\n")).toEqual([]);
  });
});

describe("宿主基座：管線必要條件", () => {
  const kit = read("book/src/css/kit.css").replace(/\/\*[\s\S]*?\*\//g, "");

  it("kit.css：demo-base 在 utilities 之前，且 utilities 不進 cascade layer", () => {
    const base = kit.indexOf('@import "./demo-base.css"');
    const utils = /@import\s+"tailwindcss\/utilities\.css"([^;]*);/.exec(kit);
    expect(base, "kit.css 必須引入 demo-base.css").toBeGreaterThanOrEqual(0);
    expect(utils, "kit.css 必須直接引入 tailwindcss/utilities.css").not.toBeNull();
    expect(base, "demo-base 必須在 utilities 之前（同特異度靠順序讓 utilities 贏）").toBeLessThan(utils!.index);
    expect(utils![1], "utilities 進了 layer 就會輸給 unlayered 的 demo-base 與 Infima").not.toMatch(/layer\(/);
  });

  it("文件站不注入全站 reset：不引入 preflight，也不整包引入 tailwindcss", () => {
    expect(kit).not.toMatch(/tailwindcss\/preflight/);
    expect(kit).not.toMatch(/@import\s+"tailwindcss"\s*(source\([^)]*\))?\s*;/);
  });

  it("Storybook 管線保有另一份基座（v4：@import tailwindcss 帶 preflight，tokens 的 tailwind.css 補邊框色）", () => {
    const sb = read(".storybook/styles.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(sb).toMatch(/@import\s+"tailwindcss"/);
    expect(sb).toContain('@import "@dooping/tokens/tailwind.css"');
    expect(tokensCss).toContain("border-color: hsl(var(--border))");
  });

  it("根與 book 宣告同一個 tailwindcss 範圍（守衛讀根的 preflight，兩邊必須同版）", () => {
    const rootRange = JSON.parse(read("package.json")).devDependencies?.tailwindcss;
    const book = JSON.parse(read("book/package.json"));
    expect(rootRange).toBeTruthy();
    expect(rootRange).toBe(book.devDependencies?.tailwindcss ?? book.dependencies?.tailwindcss);
  });

  it("demo-base 聲明自己是產生器的產物（手改會被下一次產生覆蓋）", () => {
    expect(read("book/src/css/demo-base.css")).toContain("book/scripts/port-preflight.mjs");
  });
});

describe("宿主基座：守衛自我驗證（比對器抓得到假造的壞規則）", () => {
  it("逗號切分不切括號內", () => {
    expect(splitList("button, input:where([type='button'], [type='reset']), ::file-selector-button")).toEqual([
      "button",
      "input:where([type='button'], [type='reset'])",
      "::file-selector-button",
    ]);
  });

  it("@supports 包著的規則保留外層條件，@layer 視為透明", () => {
    expect(parseCss("@supports (x: y) { a { color: red; } } @layer base { b { color: blue; } }")).toEqual([
      { at: "@supports (x: y)", sels: ["a"], decls: ["color: red"] },
      { at: null, sels: ["b"], decls: ["color: blue"] },
    ]);
  });

  it("selector 轉換與 --theme() 對映的已知輸入輸出", () => {
    expect(transformSelector("a")).toEqual([".demo-body :where(a)", `${B_PREFIX} :where(a)`]);
    expect(transformSelector("::placeholder")).toEqual([".demo-body ::placeholder", `${B_PREFIX} ::placeholder`]);
    expect(mapDecl("font-family: --theme( --default-font-family, -apple-system, sans-serif )")).toBe(
      "font-family: var(--font-family-sans)",
    );
  });

  it("把一條宣告改壞（solid → dashed），比對器必須回報差異", () => {
    const corrupted: Rule[] = structuredClone(demoBase.slice(0, expected.length));
    corrupted[0].decls = corrupted[0].decls.map((d) => d.replace("solid", "dashed"));
    expect(diffRules(expected, corrupted).length).toBeGreaterThan(0);
  });

  it("把一條規則整條拿掉，比對器必須回報差異", () => {
    const missing = demoBase.slice(0, expected.length).filter((_, i) => i !== 5);
    expect(diffRules(expected, missing).length).toBeGreaterThan(0);
  });
});
