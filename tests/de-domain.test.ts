// 去領域化守衛 — 硬性驗收。
//
// 這個工具箱的來源是一套真實運作的內部後台系統，但收進來的只有「操作邏輯與設計語言」，
// 領域語意一律留在原地。示範資料會被複製貼上：一旦示範裡出現特定產業的欄位，
// 抄過去的人就會連那個產業的資料模型一起抄走。
//
// 因此這裡不是「盡量避免」，是「一個字都不留」，而且用測試盯著。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, extname } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** 掃描範圍：程式、示範資料、stories、文件、ADR、registry。 */
const SCAN_DIRS = [
  "packages/react/src",
  "packages/tokens/src",
  ".storybook",
  "book/docs",
  "book/src",
  "docs",
  "registry",
];
const SCAN_FILES = ["README.md", "packages/react/README.md", "packages/tokens/README.md"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".md", ".mdx", ".json", ".css"]);

/**
 * 禁用詞：來源專案的領域語彙。
 * 分兩類 —— 明確的產業術語，以及會把「這是給誰用的系統」講死的角色／流程詞。
 */
const FORBIDDEN = [
  // 產業術語
  "薪資", "薪水", "薪酬", "薪資條", "工資",
  "勞保", "健保", "勞退", "投保", "保費", "級距", "補充保費",
  "扣繳", "免稅額", "扣除額", "所得稅",
  "加班費", "特休", "年資", "眷屬", "撫養",
  "申報", "名冊", "破月",
  // 角色／流程（會把工具箱綁死在單一產業）
  "員工", "人事", "到職", "離職", "留停", "停職", "復職",
  "加保", "退保", "停保", "復保", "打卡", "出勤", "考勤",
  // 英文
  "payroll", "salary", "wage", "labor insurance", "health insurance",
];

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "build" || name === ".docusaurus" || name === "dist") continue;
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs)); continue; }
    if (EXTS.has(extname(name))) out.push(abs);
  }
  return out;
}

const targets = [
  ...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...SCAN_FILES.map((f) => join(ROOT, f)).filter((f) => existsSync(f)),
];

describe("去領域化", () => {
  it("掃描範圍非空（守衛本身沒有空轉）", () => {
    expect(targets.length).toBeGreaterThan(20);
  });

  it("全部檔案不含來源專案的領域詞彙", () => {
    const hits: string[] = [];
    for (const abs of targets) {
      const rel = relative(ROOT, abs);
      // 這支測試檔自己就是詞表，跳過
      if (rel.includes("de-domain.test")) continue;
      const lines = readFileSync(abs, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const term of FORBIDDEN) {
          if (line.toLowerCase().includes(term.toLowerCase())) {
            hits.push(`${rel}:${i + 1} 出現「${term}」 → ${line.trim().slice(0, 80)}`);
          }
        }
      });
    }
    expect(hits, `發現領域詞彙殘留：\n${hits.join("\n")}`).toEqual([]);
  });
});
