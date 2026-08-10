// Storybook 分類守衛 — 驗收 .storybook/preview.tsx 的 storySort 涵蓋與吻合。
//
// 規則出自文件〈Storybook 設定〉（book/docs/7-governance/07-storybook-setup.mdx）：
//   1. order 必須涵蓋所有頂層分類——沒列到的不是消失，是排到尾端，順序看起來像隨機的。
//   2. order 的字串必須與實際分類完全吻合——「多一個空格就對不上，而且不會報錯」，
//      這支測試就是讓它報錯的地方。雙向核對：列了但不存在（幽靈）也算錯。
//   3. 有提供子層排序的分類，子層套同一套規則（例如「元件」與「壓力測試」）。
//
// 真實分類清單不用建置 Storybook 才拿得到——這個 repo 現有的 story 檔全部在
// meta 裡明講 title（沒有任何一支靠 autotitle），直接靜態掃 title: 字串就是同一份資料，
// 比讀建置產物快，也不用等 build-storybook。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, basename } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/**
 * 從 preview 原始碼抽出 storySort 的 order 陣列（含巢狀）。
 * 不 eval、不 import——preview.tsx 是 TSX，這裡只需要那一個陣列字面值。
 */
export function parseOrder(src: string): unknown[] {
  const m = /storySort\s*:\s*\{[\s\S]*?order\s*:\s*/.exec(src);
  if (!m) throw new Error("preview 裡找不到 storySort 的 order");
  let i = m.index + m[0].length;
  if (src[i] !== "[") throw new Error("storySort 的 order 不是陣列字面值");
  const parse = (): unknown[] => {
    i++; // 吃掉 [
    const arr: unknown[] = [];
    while (i < src.length) {
      const c = src[i];
      if (c === "]") { i++; return arr; }
      if (c === "[") { arr.push(parse()); continue; }
      if (c === '"' || c === "'") {
        const q = c;
        let s = "";
        i++;
        while (i < src.length && src[i] !== q) { s += src[i]; i++; }
        i++; // 吃掉收尾引號
        arr.push(s);
        continue;
      }
      if (c === "/") break; // order 陣列內不該有註解；有就是這裡沒料到的寫法
      i++; // 逗號與空白
    }
    throw new Error("order 陣列未閉合（或含有這裡沒料到的語法）");
  };
  return parse();
}

/**
 * 雙向核對。titles＝每支 story 檔宣告的 meta.title；order＝storySort 的巢狀陣列。
 * 回傳問題清單；空陣列＝通過。
 */
export function checkCoverage(titles: string[], order: unknown[]): string[] {
  const problems: string[] = [];

  // 實際分類樹：頂層 → 第二層集合
  const actual = new Map<string, Set<string>>();
  for (const t of titles) {
    const segs = t.split("/");
    const set = actual.get(segs[0]) ?? new Set<string>();
    if (segs[1]) set.add(segs[1]);
    actual.set(segs[0], set);
  }

  // order 樹：頂層字串 → 緊跟其後的子層陣列（沒有＝null）
  const declared = new Map<string, string[] | null>();
  for (let i = 0; i < order.length; i++) {
    if (typeof order[i] !== "string") continue;
    const next = order[i + 1];
    declared.set(
      order[i] as string,
      Array.isArray(next) ? next.filter((x): x is string => typeof x === "string") : null,
    );
  }

  for (const top of actual.keys()) {
    if (!declared.has(top)) {
      problems.push(`頂層分類「${top}」不在 order 裡——它會被排到清單尾端，順序看起來像隨機的`);
    }
  }
  for (const [top, sub] of declared) {
    const set = actual.get(top);
    if (!set) {
      problems.push(`order 列了「${top}」，但沒有任何 story 屬於這個分類——多半是改名沒同步，或字串多了空格`);
      continue;
    }
    if (!sub) continue; // 沒提供子層排序就不核對子層
    for (const s of sub) {
      if (!set.has(s)) problems.push(`order 在「${top}」底下列了「${s}」，但沒有這個子分類——字串要完全吻合`);
    }
    for (const s of set) {
      if (!sub.includes(s)) problems.push(`「${top}/${s}」不在 order 的子清單裡——有提供子層排序就要涵蓋全部子分類`);
    }
  }
  return problems;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "build" || name === ".docusaurus" || name === "dist") continue;
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs)); continue; }
    out.push(abs);
  }
  return out;
}

/** 靜態抽每支 story 檔的 meta.title——這個 repo 的慣例是一律明講，不靠 autotitle。 */
function collectTitles(): string[] {
  const files = walk(join(ROOT, "packages/react/src")).filter((f) => basename(f).endsWith(".stories.tsx"));
  const titles: string[] = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const m = /title:\s*["']([^"']+)["']/.exec(src);
    if (m) titles.push(m[1]);
  }
  return [...new Set(titles)];
}

describe("Storybook 分類守衛：storySort 涵蓋與吻合", () => {
  it("掃描範圍非空（守衛本身沒有空轉）", () => {
    expect(collectTitles().length).toBeGreaterThan(10);
  });

  it("order 涵蓋所有實際分類、且與實際分類完全吻合", () => {
    const titles = collectTitles();
    const preview = readFileSync(join(ROOT, ".storybook/preview.tsx"), "utf8");
    const problems = checkCoverage(titles, parseOrder(preview));
    expect(
      problems,
      `storySort 與實際分類不一致（共 ${problems.length} 處）：\n${problems.join("\n")}\n\n` +
        "改 .storybook/preview.tsx 的 order，或把分類名改回一致。規則見文件〈Storybook 設定〉。",
    ).toEqual([]);
  });

  // ── 守衛的自我驗證：先證明它抓得到已知的壞輸入，再去看真的資料。
  //    沒有這一步，「守衛全綠」與「守衛空轉」在輸出上長得一模一樣。
  it("抓得到已知的壞輸入：漏列頂層、幽靈分類、子層缺漏都會被抓出來", () => {
    const order = ["A", ["a1", "a2"], "B"];
    const missTop = checkCoverage(["A/a1/x", "C/c1"], order); // C 沒被涵蓋
    const ghosts = checkCoverage(["A/a1/x", "A/a2/y"], ["A", ["a1", "a2 "], "B"]); // 空格＋幽靈分類
    const missSub = checkCoverage(["A/a1/x", "A/a3/y", "B/b"], order); // a3 不在子清單
    const clean = checkCoverage(["A/a1/x", "A/a2/y", "B/b"], order);
    expect(missTop.length).toBeGreaterThan(0);
    expect(ghosts.length).toBeGreaterThanOrEqual(2);
    expect(missSub.length).toBeGreaterThan(0);
    expect(clean).toEqual([]);
  });
});
