// 示範資料單一來源守衛 — 硬性驗收。
//
// de-domain 的詞表擋得住**已知**領域，擋不住**新**領域。而新領域最容易從哪裡進來？
// 從「某一頁自己寫了一份示範資料」。每一份獨立的資料集都是一個入口，
// 而且它長得像正常的頁面內容，review 時不會有人多看一眼。
//
// 因此規則不是「盡量共用」，是「只能有一個來源」：
// packages/react/src/demo/sample-data.ts。
//
// 界線畫在「業務資料模型」而不是「所有陣列」——UI 文案（導覽步驟、選項清單、
// 欄位規格）本來就該寫在用它的地方。用**頂層鍵數 ≥4** 分開這兩者：
// 實測既有內容，UI 用途的物件都在 3 鍵以下，業務資料集都在 6 鍵以上，中間是空的。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, extname, basename } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** 超過這個鍵數就算「業務資料模型」，不再是 UI 文案。 */
const KEY_THRESHOLD = 4;

const SCAN = [
  { dir: "packages/react/src", match: (f: string) => f.endsWith(".stories.tsx") },
  { dir: "book/docs", match: (f: string) => extname(f) === ".mdx" },
];

/** 示範資料的唯一來源。引用它的檔案才可以在本地宣告衍生結構（例如欄位定義）。 */
const SOURCE = /from\s+["'][^"']*demo\/sample-data["']/;

export interface Dataset {
  name: string;
  keys: number;
}

/**
 * 剝掉 markdown 圍籬程式碼。
 *
 * 圍籬裡的 `const columns = [...]` 是**API 示意**，不是餵給活範例的資料——
 * 它渲染不出東西，也不會有人把整段當資料集用。圍籬內容的領域詞另由 de-domain 守衛掃。
 */
export function stripFences(src: string): string {
  return src.replace(/^```[\s\S]*?^```/gm, "");
}

/**
 * 找出「物件陣列」宣告，並回傳第一個物件的頂層鍵數。
 *
 * 掃描時會跳過字串內容——否則 `name: "甲案, 第一階段"` 裡的逗號會被算成一個鍵。
 */
export function findDatasets(src: string): Dataset[] {
  const out: Dataset[] = [];
  const decl = /(?:export\s+)?const\s+(\w+)\s*(?::[^=]+?)?=\s*\[\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = decl.exec(src))) {
    let i = src.indexOf("{", m.index + m[0].length - 1);
    let depth = 0;
    let commas = 0;
    let quote = "";
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === "\\") i++;
        else if (c === quote) quote = "";
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
      if (c === "{" || c === "[") depth++;
      else if (c === "}" || c === "]") { depth--; if (depth === 0) break; }
      else if (c === "," && depth === 1) commas++;
    }
    out.push({ name: m[1], keys: commas + 1 });
  }
  return out;
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

describe("示範資料單一來源", () => {
  const targets = SCAN.flatMap(({ dir, match }) =>
    walk(join(ROOT, dir)).filter((f) => match(basename(f))),
  );

  it("掃描範圍非空（守衛本身沒有空轉）", () => {
    expect(targets.length).toBeGreaterThan(10);
  });

  it("stories 與文件都不得自行宣告業務資料集", () => {
    const offenders: string[] = [];
    for (const abs of targets) {
      const raw = readFileSync(abs, "utf8");
      if (SOURCE.test(raw)) continue; // 有引用單一來源，衍生結構放行
      const src = extname(abs) === ".mdx" ? stripFences(raw) : raw;
      for (const d of findDatasets(src)) {
        if (d.keys >= KEY_THRESHOLD) {
          offenders.push(`${relative(ROOT, abs)} → const ${d.name}（${d.keys} 鍵）`);
        }
      }
    }
    expect(
      offenders,
      `以下檔案自己宣告了業務資料集（共 ${offenders.length} 處）：\n${offenders.join("\n")}\n\n` +
        "改為 import { demoRecords, ... } from \"@dooping/react/demo/sample-data\"（文件站）" +
        "或 \"../demo/sample-data\"（stories）。欄位定義可以留在本地——" +
        "有引用單一來源的檔案就放行，範本見 packages/react/src/ui/data-table.stories.tsx。",
    ).toEqual([]);
  });

  // ── 守衛的自我驗證：證明鍵數判定真的分得開，而不是永遠回傳空陣列
  it("鍵數判定：業務資料集會被抓出來", () => {
    const src = `export const rows = [\n  { id: "a", unit: "甲", name: "x, y", qty: 1, amount: 2 },\n];`;
    expect(findDatasets(src)).toEqual([{ name: "rows", keys: 5 }]);
  });

  it("圍籬內的 API 示意不算資料集", () => {
    const src = ["前言", "```tsx", "const columns = [{ a: 1, b: 2, c: 3, d: 4, e: 5 }];", "```", "後記"].join("\n");
    expect(findDatasets(stripFences(src))).toEqual([]);
    expect(findDatasets(src)).toHaveLength(1); // 沒剝圍籬就會誤報——證明剝這件事有作用
  });

  it("鍵數判定：UI 文案用的小物件不會誤報", () => {
    const src = `const steps = [{ key: "a", label: "甲", hint: "乙" }];`;
    const found = findDatasets(src);
    expect(found).toEqual([{ name: "steps", keys: 3 }]);
    expect(found.every((d) => d.keys < KEY_THRESHOLD)).toBe(true);
  });
});
