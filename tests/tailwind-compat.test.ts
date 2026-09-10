// Tailwind v3／v4 相容守衛 —— 元件原始碼只准用兩版語意相同的 utility。
//
// 背景：本書的 Storybook 與文件站跑 v4，但 registry 抄走的元件會落在 v3 或 v4 宿主。
// 開發環境升到 v4 之後，「只有 v4 才有」或「兩版值不同」的 class 寫得出來、畫面也對——
// 直到某個 v3 宿主抄走才安靜變形。開發環境擋不住，所以這裡擋。
//
// 三類規則（清單遇到新例就加，加的時候寫理由）：
//  ① 兩版值不同的裸 utility：ring（v3 3px／v4 1px）、shadow、blur、drop-shadow、backdrop-blur，
//     以及 rounded／rounded-b 之類（v4 掛在棄用區、且不接 --radius）。一律寫明確刻度。
//  ② 只有 v4 才有的語法：CSS 變數簡寫 x-(--var)、尾綴 ! 重要性、not-*／in-*／nth-* 等 variant、
//     容器查詢、v4 新增的 utility（shadow-xs、inset-shadow-*、mask-*、bg-linear-*、outline-hidden…）。
//  ③ 只靠 hover 揭露功能：opacity-0／invisible 配 hover:／group-hover: 顯形，卻沒有 focus 路徑——
//     v4 的 hover 只在指標裝置生效（@media (hover: hover)），觸控使用者永遠看不到那個功能。
//
// 範圍與取捨：只看字串字面值（註解裡提到 ring、rounded 不算）；含非 ASCII 的字串視為文案略過；
// 單一個不帶 - 或 : 的字串（事件名 "blur"）略過——代價是單獨寫成 "ring" 的 class 會漏網。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "packages/react/src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else if (/\.(ts|tsx)$/.test(name)) out.push(abs);
  }
  return out;
}

/** 字串字面值（"…"／'…'／`…`）。先剝掉註解。 */
function stringLiterals(src: string): string[] {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
  return [...code.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3] ?? "");
}

/**
 * 拆出 variant 與 utility 本體。只在**最外層**的冒號切：任意 variant
 * `[&_tr:nth-child(even)]:bg-muted` 的中括號裡那個冒號是 CSS 選擇器的一部分，不是分隔。
 */
function split(tok: string): { variants: string[]; util: string } {
  const pieces: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < tok.length; i++) {
    const c = tok[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) {
      pieces.push(tok.slice(start, i));
      start = i + 1;
    }
  }
  return { variants: pieces, util: tok.slice(start).replace(/^!/, "") };
}

const BARE_DIFFERS: Record<string, string> = {
  ring: "v3 是 3px、v4 是 1px——寫 ring-2 之類的明確寬度",
  shadow: "兩版預設陰影不同——寫 shadow-sm／md／lg（接 token）",
  blur: "兩版預設模糊半徑不同——寫明確刻度",
  "drop-shadow": "兩版預設不同——寫明確刻度",
  "backdrop-blur": "兩版預設不同——寫明確刻度",
  rounded: "v4 掛在棄用區且不接 --radius——寫 rounded-sm",
};
const ROUNDED_SIDE = /^rounded-(t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee)$/;

const V4_ONLY_UTIL: [RegExp, string][] = [
  [/^-?[a-z][a-z-]*-\(--/, "CSS 變數簡寫 x-(--var) 是 v4 語法——寫 x-[var(--var)]"],
  [/^[a-z][a-z0-9-]*-[a-z0-9./[\]%-]+!$/, "尾綴 ! 是 v4 語法——寫前綴 !"],
  [/^(shadow|rounded|blur|drop-shadow|backdrop-blur)-(xs|2xs)$/, "xs／2xs 刻度只有 v4 有"],
  [/^inset-(shadow|ring)(-|$)/, "inset-shadow／inset-ring 只有 v4 有"],
  [/^text-shadow(-|$)/, "text-shadow 只有 v4 有"],
  [/^mask-/, "mask-* 只有 v4 有"],
  [/^bg-(linear|radial|conic)(-|$)/, "漸層新語法只有 v4 有——寫 bg-gradient-to-*"],
  [/^outline-hidden$/, "outline-hidden 只有 v4 有（v3 的 outline-none 就是它的語意）"],
  [/^ring-3$/, "ring-3 只有 v4 有"],
  [/^(field-sizing|scheme|perspective)-/, "只有 v4 有"],
  [/^transform-3d$/, "只有 v4 有"],
  [/^@container/, "容器查詢在 v3 需要外掛"],
];

const V4_ONLY_VARIANT: [RegExp, string][] = [
  [/^not-/, "not-* variant 只有 v4 有"],
  [/^in-/, "in-* variant 只有 v4 有"],
  [/^nth-/, "nth-* variant 只有 v4 有"],
  [/^(starting|inert|details-content|inverted-colors|noscript)$/, "這個 variant 只有 v4 有"],
  [/^(pointer|any-pointer)-/, "pointer-* variant 只有 v4 有——粗指標請用 .tap-target"],
  [/^user-(valid|invalid)$/, "這個 variant 只有 v4 有"],
  [/^@/, "容器查詢 variant 在 v3 需要外掛"],
];

const HIDE = new Set(["opacity-0", "invisible"]);
const SHOW = new Set(["opacity-100", "visible"]);

/** 一段字串裡的違規說明（空陣列＝乾淨）。 */
function violationsIn(literal: string): string[] {
  const toks = literal.trim().split(/\s+/).filter(Boolean);
  if (!(toks.length >= 2 || /[-:]/.test(literal))) return [];
  if (/[^\x00-\x7f]/.test(literal)) return [];

  const out: string[] = [];
  const parts = toks.map(split);
  parts.forEach(({ variants, util }, i) => {
    const tok = toks[i];
    if (Object.hasOwn(BARE_DIFFERS, util)) out.push(`${tok}：${BARE_DIFFERS[util]}`);
    else if (ROUNDED_SIDE.test(util)) out.push(`${tok}：v4 掛在棄用區且不接 --radius——加上 -sm 之類的明確刻度`);
    for (const [re, why] of V4_ONLY_UTIL) if (re.test(util)) out.push(`${tok}：${why}`);
    for (const v of variants) for (const [re, why] of V4_ONLY_VARIANT) if (re.test(v)) out.push(`${tok}：${why}`);
  });

  const hides = parts.some((p) => p.variants.length === 0 && HIDE.has(p.util));
  const hoverShows = parts.some((p) => SHOW.has(p.util) && p.variants.some((v) => /^(group-|peer-)?hover(\/|$)/.test(v)));
  const focusShows = parts.some((p) => SHOW.has(p.util) && p.variants.some((v) => v.includes("focus")));
  if (hides && hoverShows && !focusShows)
    out.push(`「${literal.trim()}」：只靠 hover 顯形——觸控裝置沒有 hover；補 focus-within／group-focus-within 路徑，或常駐顯示`);
  return out;
}

const files = walk(SRC);

describe("Tailwind v3／v4 相容守衛", () => {
  it("元件原始碼只用兩版語意相同的 utility", () => {
    const all: string[] = [];
    for (const f of files) {
      const rel = relative(ROOT, f).replace(/\\/g, "/");
      for (const lit of stringLiterals(readFileSync(f, "utf8"))) for (const v of violationsIn(lit)) all.push(`${rel}  ${v}`);
    }
    expect(all, all.join("\n")).toEqual([]);
  });

  it("守衛沒有空轉：掃描量有下限", () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
    const classLists = files
      .flatMap((f) => stringLiterals(readFileSync(f, "utf8")))
      .filter((l) => l.trim().split(/\s+/).length >= 3 && !/[^\x00-\x7f]/.test(l));
    expect(classLists.length).toBeGreaterThanOrEqual(300);
  });

  it("自我驗證：每一類假造的違規都抓得到，合規寫法不誤報", () => {
    const bad: [string, number][] = [
      ["rounded p-2", 1],
      ["ring-offset-2 ring", 1],
      ["rounded-b bg-card", 1],
      ["shadow border", 1],
      ["bg-(--x) p-2", 1],
      ["p-2! text-sm", 1],
      ["shadow-xs p-2", 1],
      ["not-first:p-2 text-sm", 1],
      ["@sm:p-2 text-sm", 1],
      ["opacity-0 group-hover:opacity-100", 1],
    ];
    for (const [lit, n] of bad) expect(violationsIn(lit), lit).toHaveLength(n);

    expect(violationsIn("opacity-0 group-hover:opacity-100 group-focus-within:opacity-100")).toEqual([]);
    expect(violationsIn("rounded-sm rounded-b-sm ring-2 shadow-sm p-2 text-tiny [&_svg]:size-4")).toEqual([]);
    expect(violationsIn("blur")).toEqual([]);
    expect(stringLiterals("// 註解裡的 rounded ring\nconst a = 1;")).toEqual([]);
  });
});
