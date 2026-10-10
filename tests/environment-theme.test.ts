// 環境色主題的兩條結構性規則：主題島真的能用、色票頁與 tokens 同步。
//
// 色值本身合不合格（對比、色票距離、內容中性）由 scripts/verify-color.mjs 擋；
// 這支管的是「規則在產物與文件裡有沒有落地」：
//
// 1. 主題島：`data-color-theme` 可以放在任何元素上（例如應用切換清單裡「那個系統」的色塊）。
//    頁面的 `.dark` 在 <html> 上、主題屬性在色塊上，兩者不在同一個元素，
//    所以每個主題（含預設）都要有後代形式的深色選擇器。少一組，那個主題的色塊在深色模式
//    會拿到淺色的外殼值，而畫面不會報錯。
// 2. 色票頁：取用端挑主題靠〈環境色票〉那張表。表上漏一組或色名寫錯，等於那組主題不存在，
//    或讓人用錯色名去溝通。
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { themeMeta } from "../packages/tokens/src/index";
import { because, stripCode } from "./lib/guard";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CSS_PATH = join(ROOT, "packages/tokens/dist/tokens.css");
const PALETTE_DOC = "book/docs/2-foundations/09-environment-palette.mdx";
const themes = themeMeta();

describe("環境色主題", () => {
  it("主題數讀得到（防空轉）", () => {
    expect(themes.length).toBeGreaterThanOrEqual(18);
  });

  it("每個主題（含預設）都能當主題島：淺色區塊與兩種後代深色選擇器都在", () => {
    expect(existsSync(CSS_PATH), "請先執行 npm run build:tokens").toBe(true);
    const css = readFileSync(CSS_PATH, "utf8");
    const missing: string[] = [];
    for (const { name } of themes) {
      for (const sel of [
        `[data-color-theme="${name}"] {`,
        `.dark [data-color-theme="${name}"]`,
        `[data-theme="dark"] [data-color-theme="${name}"]`,
      ]) {
        if (!css.includes(sel)) missing.push(sel);
      }
    }
    expect(missing, because(
      "tokens.css 缺主題島選擇器，請檢查 packages/tokens/scripts/build-css.mjs 再重跑 npm run build:tokens",
      "主題屬性放在元素上、.dark 放在 <html> 上時，少了後代選擇器，那個色塊在深色模式會拿到淺色外殼",
      "book/docs/2-foundations/06-theming.mdx「主題島」",
    )).toEqual([]);
  });

  it("〈環境色票〉的表列出每個主題，色名、色族、色階與 tokens 一致", () => {
    const path = join(ROOT, PALETTE_DOC);
    expect(existsSync(path), `${PALETTE_DOC} 不存在`).toBe(true);
    // 表格列：| … | `name` | 色名 | 色族 | 色階 | …
    const rows = stripCode(readFileSync(path, "utf8").replace(/`([a-z-]+)`/g, "⟨$1⟩"))
      .filter((l) => l.trimStart().startsWith("|"))
      .map((l) => l.split("|").map((c) => c.trim()));
    const offenders: string[] = [];
    for (const t of themes) {
      const row = rows.find((cells) => cells.includes(`⟨${t.name}⟩`));
      if (!row) { offenders.push(`${t.name}：表上沒有這一列`); continue; }
      for (const [field, want] of [["色名", t.term], ["色族", `⟨${t.family}⟩`], ["色階", `⟨${t.tier}⟩`]] as const) {
        if (!row.includes(want)) offenders.push(`${t.name}：${field}應為「${want.replace(/[⟨⟩]/g, "")}」`);
      }
    }
    expect(offenders, because(
      `照 tokens.json 的 themes.*（$term／$family／$tier）更新 ${PALETTE_DOC} 的色票表`,
      "取用端靠這張表挑主題、用色名溝通；表上漏一組或寫錯，等於那組主題不存在或被叫錯名字",
      `${PALETTE_DOC}「色票清單」`,
    )).toEqual([]);
  });
});
