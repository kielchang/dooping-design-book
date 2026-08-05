// 文件掛鉤守衛：文件引用的 story id 必須真的存在。
//
// 文件一旦開始嵌入真元件（`<StoryFrame id="…">`），它就對元件庫產生了
// **以字串為鍵的相依**——而字串沒有型別檢查。story 改名、export 改名、元件被刪，
// TypeScript 一個字都不會說。
//
// 失敗的樣子不是壞掉，是**安靜地變成一塊空白 iframe**：沒有錯誤訊息、沒有紅燈，
// 只有讀者看到空白然後以為文件壞了。這正是「同一份事實存在兩個地方就需要一支守衛」
// 的標準案例（治理章〈漂移防護〉第 7 支）。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const KIT = join(ROOT, "packages/react/src");
const DOCS = join(ROOT, "book/docs");

function walk(dir: string, keep: (name: string) => boolean): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs, keep)); continue; }
    if (keep(name)) out.push(abs);
  }
  return out;
}

/**
 * Storybook 的 id 正規化，逐字照抄它的規則：
 * 小寫化 → 把空白與 ASCII 標點換成 `-` → 收合連續的 `-` → 去掉頭尾的 `-`。
 *
 * CJK 與全角標點**原樣保留**——所以 `元件/基礎/按鈕・徽章` 會變成
 * `元件-基礎-按鈕・徽章`（`・` 留著，`/` 變 `-`）。這一點驗證過：
 * 拿 `npm run build-storybook` 產物的 index.json 逐一對過，33 個 id 全數相符。
 */
function sanitize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/** 從 stories 檔推導出全部合法的 story id。 */
function collectStoryIds(): Set<string> {
  const ids = new Set<string>();
  for (const abs of walk(KIT, (n) => n.endsWith(".stories.tsx"))) {
    const src = readFileSync(abs, "utf8");

    // 只認 meta 的 title。stories 內文也會出現 `title:`（那是元件的 prop，
    // 例如 EmptyState 的標題），拿它當 kind 會憑空生出不存在的 id。
    const metaAt = src.indexOf("const meta");
    if (metaAt < 0) continue;
    const title = src.slice(metaAt).match(/title:\s*"([^"]+)"/)?.[1];
    if (!title) continue;

    for (const [, name] of src.matchAll(/^export const ([^\s:=]+)\s*[:=]/gm)) {
      if (name === "default" || name === "meta") continue;
      ids.add(`${sanitize(title)}--${sanitize(name)}`);
    }
  }
  return ids;
}

/**
 * 掃出文件裡所有 `<StoryFrame … id="…">` 的引用。
 *
 * 兩個刻意的取捨：
 *
 * 1. **圍籬程式碼區塊照驗。** 那些是讀者會複製走的範例——範例裡的 id 死掉，
 *    跟頁面上的嵌入死掉一樣糟，只是晚一步才發現。
 * 2. **行內程式碼（單反引號）不驗。** 散文要能討論這個標籤本身
 *    （「掃出所有 `<StoryFrame id="…">`」），不該因為提到它就被判定為引用。
 *    這一條是實際踩到的：本頁的守衛說明自己就先觸發了一次假警報。
 */
function collectRefs(): { file: string; id: string }[] {
  const refs: { file: string; id: string }[] = [];
  for (const abs of walk(DOCS, (n) => /\.mdx?$/.test(n))) {
    const file = relative(ROOT, abs).replace(/\\/g, "/");
    let inFence = false;

    for (const raw of readFileSync(abs, "utf8").split("\n")) {
      if (/^\s*```/.test(raw)) { inFence = !inFence; continue; }
      // 圍籬內原樣掃；圍籬外先把行內程式碼挖掉
      const line = inFence ? raw : raw.replace(/`[^`]*`/g, "");
      for (const [, id] of line.matchAll(/<StoryFrame[^>]*\bid="([^"]+)"/g)) {
        refs.push({ file, id });
      }
    }
  }
  return refs;
}

describe("文件掛鉤", () => {
  const valid = collectStoryIds();
  const refs = collectRefs();

  // 這兩條是「守衛沒有空轉」的保險。少了它們，正則寫錯會讓兩個集合都變成空的，
  // 而下面那條 forEach 一次都不跑——測試報告上與「全部通過」長得一模一樣。
  it("推導得出足夠數量的 story id（守衛本身沒有空轉）", () => {
    expect(valid.size, "一個 story id 都推導不出來，代表 meta.title 或 export 的比對壞了").toBeGreaterThan(10);
  });

  it("文件裡至少嵌了一個 story（守衛不是在對空集合微笑）", () => {
    expect(
      refs.length,
      "book/docs 裡找不到任何 <StoryFrame>。若是刻意移除全部嵌入，請連這條下限一起改。",
    ).toBeGreaterThan(0);
  });

  it("文件引用的 story id 都真的存在", () => {
    const broken = refs.filter((r) => !valid.has(r.id));
    // 失敗訊息要能讓「正在改元件、對文件毫無概念」的人知道該改哪一行——
    // 所以印出檔名、壞掉的 id，以及合法 id 的樣子。
    expect(
      broken.map((r) => `${r.file} → ${r.id}`),
      `這些引用指向不存在的 story（改了 meta.title 或 export 名？）。` +
        `合法 id 由 stories 檔推導，例如：${[...valid].slice(0, 3).join("、")}`,
    ).toEqual([]);
  });
});
