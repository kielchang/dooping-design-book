// 宿主基座守衛 — 「元件假設的樣式前提」與「宿主實際提供的 reset」是同一份事實的兩個所在。
//
// 事實一在 node_modules/tailwindcss 的 preflight.css（Storybook 靠 @tailwind base 直接拿到），
// 事實二在 book/src/css/demo-base.css（文件站關 preflight，改在 demo scope 內移植同一份）。
// 依治理章的判準「同一份事實存在於兩個地方，就需要一支守衛」，這裡把兩者逐條對應：
//   - Tailwind 升版改了 preflight → 這裡紅，提醒回去重新移植；
//   - demo-base 被改壞、少一條、scope 前綴寫錯 → 這裡紅；
//   - kit.css 的引入順序（基座必須在 utilities 之前）是承重結構 → 這裡鎖。
//
// 為什麼讀**根**的 node_modules：CI 的 npm test 跑在 book/ 的 npm ci 之前，
// book/node_modules 當下不存在。兩邊裝到同一版由「宣告範圍字串相等」那條保證。
//
// 背景與選項取捨見 ADR-0009；這支守衛的誕生原因：文件站上 demo 的按鈕吃到瀏覽器
// 原生外框、表格吃到宿主格線、元件自畫的邊框整批消失——三者都是基座缺席的症狀，
// 而先前沒有任何一道防線看得見「樣式前提」這一層。
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

// ── 極簡 CSS 解析：去註解 → 逐條規則（selector 清單 + 宣告清單） ──
type Rule = { sels: string[]; decls: string[] };

function parseCss(src: string): Rule[] {
  const clean = src.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    const sels = m[1].split(",").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
    const decls = m[2].split(";").map((d) => d.replace(/\s+/g, " ").trim()).filter(Boolean);
    if (sels.length) rules.push({ sels, decls });
  }
  return rules;
}

// ── 移植規則（demo-base.css 檔頭記載的同一份轉換，這裡是可執行的版本） ──
const B_PREFIX = "body > :where(:not(#__docusaurus))";

function transformSelector(sel: string): string[] {
  if (sel === "*") return [".demo-body :where(*)", B_PREFIX, `${B_PREFIX} :where(*)`];
  if (sel.startsWith("::")) return [`.demo-body ${sel}`, `${B_PREFIX} ${sel}`];
  const tail = /^(.+?)(::[a-zA-Z-]+)$/.exec(sel); // 例：input::placeholder
  if (tail) return [`.demo-body :where(${tail[1]})${tail[2]}`, `${B_PREFIX} :where(${tail[1]})${tail[2]}`];
  return [`.demo-body :where(${sel})`, `${B_PREFIX} :where(${sel})`];
}

/** theme() 的解法對映。preflight 出現本表以外的 theme() 鍵時直接失敗——那代表要人工重審移植。 */
const THEME_MAP: Record<string, string> = {
  "borderColor.DEFAULT": "hsl(var(--border))",
  "fontFamily.sans": "var(--font-family-sans)",
  "fontFamily.mono": "var(--font-family-mono)",
  "fontFamily.sans[1].fontFeatureSettings": "normal",
  "fontFamily.sans[1].fontVariationSettings": "normal",
  "fontFamily.mono[1].fontFeatureSettings": "normal",
  "fontFamily.mono[1].fontVariationSettings": "normal",
  "colors.gray.400": "#9ca3af",
};

function mapDecl(decl: string): string {
  const t = /theme\('([^']+)'/.exec(decl);
  if (!t) return decl;
  const mapped = THEME_MAP[t[1]];
  if (!mapped) throw new Error(`preflight 用了對映表沒有的 theme() 鍵：${t[1]}——請更新移植與 THEME_MAP`);
  const prop = decl.slice(0, decl.indexOf(":")).trim();
  return `${prop}: ${mapped}`;
}

// html/:host 只搬可繼承、與 scope 根相容的宣告；html-only 的丟棄。兩張清單都是顯式的，
// preflight 新增了不在任一清單的宣告時要人工決定去留，不能默默通過。
const HTML_KEEP = new Set([
  "line-height", "-moz-tab-size", "tab-size", "font-family",
  "font-feature-settings", "font-variation-settings", "-webkit-tap-highlight-color",
]);
const HTML_DROP = new Set(["-webkit-text-size-adjust"]);
const BODY_DROP = new Set(["margin", "line-height"]); // body 整條捨棄（scope 根不是 body）

/** 由 preflight 產生 demo-base 應有的完整規則序列（前段），供逐條比對。 */
function expectedFromPreflight(pf: Rule[]): Rule[] {
  const out: Rule[] = [];
  const [universal, pseudoContent, ...rest] = pf;
  expect(universal.sels).toEqual(["*", "::before", "::after"]);
  expect(pseudoContent.sels).toEqual(["::before", "::after"]);
  out.push({ sels: transformSelector("*"), decls: universal.decls.map(mapDecl) });
  out.push({
    sels: [...transformSelector("::before"), ...transformSelector("::after")],
    decls: [...universal.decls.map(mapDecl), ...pseudoContent.decls.map(mapDecl)],
  });
  for (const rule of rest) {
    if (rule.sels.join() === "html,:host") {
      const kept: string[] = [];
      for (const d of rule.decls) {
        const prop = d.slice(0, d.indexOf(":")).trim();
        if (HTML_KEEP.has(prop)) kept.push(mapDecl(d));
        else if (!HTML_DROP.has(prop)) throw new Error(`preflight 的 html 規則出現未分類宣告：${d}`);
      }
      out.push({ sels: [".demo-body", B_PREFIX], decls: kept });
      continue;
    }
    if (rule.sels.join() === "body") {
      for (const d of rule.decls) {
        const prop = d.slice(0, d.indexOf(":")).trim();
        if (!BODY_DROP.has(prop)) throw new Error(`preflight 的 body 規則出現未分類宣告：${d}`);
      }
      continue; // 整條捨棄
    }
    out.push({ sels: rule.sels.flatMap(transformSelector), decls: rule.decls.map(mapDecl) });
  }
  return out;
}

/** 逐條比對（selector 當集合、宣告當序列），回傳差異訊息。 */
function diffRules(expected: Rule[], actual: Rule[]): string[] {
  const diffs: string[] = [];
  if (expected.length !== actual.length)
    diffs.push(`規則數不符：應為 ${expected.length}，實際 ${actual.length}`);
  const n = Math.min(expected.length, actual.length);
  for (let i = 0; i < n; i++) {
    const e = expected[i], a = actual[i];
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
    sels: [".demo-body"],
    decls: [
      "--ifm-table-border-width: 0",
      "--ifm-table-cell-padding: 0",
      "--ifm-table-stripe-background: transparent",
      "--ifm-table-background: transparent",
      "--ifm-table-head-background: transparent",
    ],
  },
  { sels: [".demo-body :where(table)"], decls: ["display: table", "margin-bottom: 0", "overflow: visible"] },
  {
    sels: ['.markdown :where([role="note"])', '.markdown :where([role="alert"])'],
    decls: ["border-style: solid"],
  },
];

const preflight = parseCss(read("node_modules/tailwindcss/lib/css/preflight.css"));
const demoBase = parseCss(read("book/src/css/demo-base.css"));

describe("宿主基座：demo-base 與 preflight 逐條對應", () => {
  const expected = expectedFromPreflight(preflight);
  const ported = demoBase.slice(0, expected.length);
  const extra = demoBase.slice(expected.length);

  it("移植段與 preflight 逐條相符（Tailwind 升版或 demo-base 被改動時此條會紅）", () => {
    const diffs = diffRules(expected, ported);
    expect(diffs, diffs.join("\n\n")).toEqual([]);
  });

  it("守衛沒有空轉：對應規則數有下限", () => {
    // preflight 3.4.x 是 38 條 → 移植 36 條。掉到 30 以下代表解析壞了或檔案被清空。
    expect(expected.length).toBeGreaterThanOrEqual(30);
    expect(demoBase.length).toBe(expected.length + HOST_EXTRA.length);
  });

  it("宿主反制段（Infima 表格變數、display 反制、Callout 例外）逐項相符", () => {
    const diffs = diffRules(HOST_EXTRA, extra);
    expect(diffs, diffs.join("\n\n")).toEqual([]);
  });
});

describe("宿主基座：管線必要條件", () => {
  it("kit.css 引入 demo-base，且在 @tailwind utilities 之前（同特異度靠順序讓 utilities 贏）", () => {
    // 先剝註解——kit.css 的說明文字本身就會提到這兩個字串
    const kit = read("book/src/css/kit.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const imp = kit.indexOf('@import "./demo-base.css"');
    const utils = kit.indexOf("@tailwind utilities");
    expect(imp, "kit.css 必須引入 demo-base.css").toBeGreaterThanOrEqual(0);
    expect(utils, "kit.css 必須保留 @tailwind utilities").toBeGreaterThanOrEqual(0);
    expect(imp, "demo-base 必須在 @tailwind utilities 之前").toBeLessThan(utils);
  });

  it("文件站維持 preflight: false（全站 reset 會打爆站台 chrome——基座只鋪在 demo scope）", () => {
    expect(read("book/tailwind.config.js")).toMatch(/preflight:\s*false/);
  });

  it("Storybook 管線保有另一份基座（@tailwind base + border-color 預設）", () => {
    const sb = read(".storybook/styles.css");
    expect(sb).toContain("@tailwind base");
    expect(sb).toContain("border-color: hsl(var(--border))");
  });

  it("根與 book 宣告同一個 tailwindcss 範圍（守衛讀根的 preflight，兩邊必須同版）", () => {
    const root = JSON.parse(read("package.json"));
    const book = JSON.parse(read("book/package.json"));
    const rootRange = root.devDependencies?.tailwindcss;
    const bookRange = book.devDependencies?.tailwindcss ?? book.dependencies?.tailwindcss;
    expect(rootRange).toBeTruthy();
    expect(rootRange).toBe(bookRange);
  });
});

describe("宿主基座：守衛自我驗證（比對器抓得到假造的壞規則）", () => {
  it("selector 轉換的已知輸入輸出", () => {
    expect(transformSelector("a")).toEqual([
      ".demo-body :where(a)",
      "body > :where(:not(#__docusaurus)) :where(a)",
    ]);
    expect(transformSelector("input::placeholder")).toEqual([
      ".demo-body :where(input)::placeholder",
      "body > :where(:not(#__docusaurus)) :where(input)::placeholder",
    ]);
    expect(transformSelector("::-webkit-file-upload-button")).toEqual([
      ".demo-body ::-webkit-file-upload-button",
      "body > :where(:not(#__docusaurus)) ::-webkit-file-upload-button",
    ]);
    expect(mapDecl("border-color: theme('borderColor.DEFAULT', currentColor)")).toBe(
      "border-color: hsl(var(--border))",
    );
  });

  it("把一條宣告改壞（solid → dashed），比對器必須回報差異", () => {
    const expected = expectedFromPreflight(preflight);
    const corrupted: Rule[] = structuredClone(demoBase.slice(0, expected.length));
    corrupted[0].decls = corrupted[0].decls.map((d) => d.replace("solid", "dashed"));
    expect(diffRules(expected, corrupted).length).toBeGreaterThan(0);
  });

  it("把一條規則整條拿掉，比對器必須回報差異", () => {
    const expected = expectedFromPreflight(preflight);
    const missing = demoBase.slice(0, expected.length).filter((_, i) => i !== 5);
    expect(diffRules(expected, missing).length).toBeGreaterThan(0);
  });
});
