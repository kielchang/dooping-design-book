import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { because, toLines } from "./lib/guard";

// 規則正本指向守衛：註解與文件裡寫「規則正本：<路徑>「<標題>」」或「流程正本：…」時，那個檔與那個標題都要存在。
//
// 管什麼：
// - 含「規則正本：」「規則正本在」「流程正本：」「流程正本在」的行，抓出每一組 `<路徑>「<標題>」`。
//   同一行後面只寫「與「…」」「、「…」」的，沿用前一個路徑；寫「本檔「…」」的指向該行所在的檔。
// - 路徑從 repo 根找，找不到再試 `book/docs/`。檔案要存在。
// - markdown 檔的標題（略過 ``` 圍籬，去掉行內碼反引號與 `**`）要有一個等於引號內文字，
//   或以它開頭、後面接「：」「（」或空白。
//
// 不管：沒有「」的指向（只寫檔名或「檔頭」）、`because()` 的第三個參數與 RULE 常數、指向的內容是否還寫著那條規則。
const RULE = "CLAUDE.md「repo 只放規則、架構描述與使用說明」";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SELF = "tests/rule-pointers.test.ts";
const TEXT = /\.(md|mdx|ts|tsx|js|jsx|mjs|cjs|mts|json|ya?ml|css|txt|sh|html)$/;
const MARKER = /(規則正本|流程正本)(：|在)/;
const POINTER = /(本檔|[A-Za-z0-9_][A-Za-z0-9_./-]*\.[A-Za-z0-9]+)?「([^」]+)」/g;

export type Pointer = { at: string; path: string; heading: string };

/** 一個檔裡的所有指向。`file` 是 repo 相對路徑，用來解析「本檔」。 */
export function extractPointers(file: string, text: string): Pointer[] {
  const out: Pointer[] = [];
  toLines(text).forEach((line, i) => {
    const m = MARKER.exec(line);
    if (!m) return;
    const rest = line.slice(m.index + m[0].length).replace(/`/g, "");
    let current: string | null = null;
    for (const p of rest.matchAll(POINTER)) {
      if (p[1] === "本檔") current = file;
      else if (p[1]) current = /\.mdx?$/.test(p[1]) ? p[1] : null;
      if (current) out.push({ at: `${file}:${i + 1}`, path: current, heading: p[2] });
    }
  });
  return out;
}

const normalize = (s: string) => s.replace(/`/g, "").replace(/\*\*/g, "").trim();

/** markdown 的標題文字（略過圍籬、去掉行內碼反引號、粗體與 `{#id}`）。 */
export function headingsOf(markdown: string): string[] {
  let fence = false;
  const out: string[] = [];
  for (const l of toLines(markdown)) {
    if (/^\s*```/.test(l)) { fence = !fence; continue; }
    const m = fence ? null : /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(l);
    if (m) out.push(normalize(m[1].replace(/\s*\{#[^}]+\}$/, "")));
  }
  return out;
}

/** 標題等於引號內文字，或以它開頭、後面接「：」「（」或空白。 */
export function headingMatches(heading: string, quoted: string): boolean {
  const q = normalize(quoted);
  return heading === q || (heading.startsWith(q) && /^[：（(:\s]/.test(heading.slice(q.length)));
}

function resolvePath(p: string): string | null {
  for (const candidate of [p, join("book/docs", p)]) if (existsSync(join(ROOT, candidate))) return candidate;
  return null;
}

/** 追蹤中＋尚未追蹤但沒被忽略的文字檔（repo 相對路徑，正斜線）。 */
function publicFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: ROOT, encoding: "utf8" });
  return [...new Set(out.split("\0"))]
    .filter((f) => TEXT.test(f) && f !== SELF && f !== "package-lock.json" && !f.endsWith("/package-lock.json"))
    .filter((f) => existsSync(join(ROOT, f)));
}

describe("extractPointers／headingMatches 自測", () => {
  const mark = "規則" + "正本";
  const sample = [
    `// ${mark}：docs/a.md「甲」與「乙」、src/x.ts 檔頭、docs/b.mdx「丙」。`,
    `// ${mark}在 本檔「丁」`,
    `// 只是提到${mark}這個詞，不算`,
    `console.error("\\n${mark}：\`docs/c.md\`「戊」")`,
    `// ${mark}：src/y.ts「不是 markdown，不算」`,
  ].join("\n");
  it("抓路徑與標題；沿用前一個路徑；本檔指向自己；非 markdown 與沒有冒號的不算", () => {
    expect(extractPointers("self.md", sample).map((p) => `${p.path}#${p.heading}`)).toEqual([
      "docs/a.md#甲", "docs/a.md#乙", "docs/b.mdx#丙", "self.md#丁", "docs/c.md#戊",
    ]);
  });
  it("標題相同或以它開頭後接「：」「（」才算", () => {
    expect(headingMatches("Tailwind v4（建議）", "Tailwind v4")).toBe(true);
    expect(headingMatches("宿主前置條件：樣式基座（preflight）", "宿主前置條件")).toBe(true);
    expect(headingMatches("分支與部署拓樸", "分支與部署拓樸")).toBe(true);
    expect(headingMatches("Tailwind v40", "Tailwind v4")).toBe(false);
    expect(headingMatches("版本策略", "三段式發布")).toBe(false);
  });
  it("標題抽取略過圍籬、去掉反引號與粗體", () => {
    const md = ["# 一", "## `code` 與 **粗**", "```", "## 圍籬裡的假標題", "```", "### 三 {#three}"].join("\n");
    expect(headingsOf(md)).toEqual(["一", "code 與 粗", "三"]);
  });
});

describe("規則正本指向都指到存在的檔與標題", () => {
  const pointers = publicFiles().flatMap((f) => extractPointers(f, readFileSync(join(ROOT, f), "utf8")));

  it("抓到的指向夠多（防空轉）", () => {
    expect(pointers.length, because("抓到的指向太少", "標記字樣或解析規則改壞時，這條先紅", RULE)).toBeGreaterThanOrEqual(15);
  });

  it("指向的檔存在", () => {
    const missing = pointers.filter((p) => !resolvePath(p.path)).map((p) => `${p.at} → ${p.path}`);
    expect(missing, because("改成現在的路徑", "檔案搬走或改名後，指向會指到空氣", RULE)).toEqual([]);
  });

  it("指向的標題存在", () => {
    const cache = new Map<string, string[]>();
    const broken = pointers.flatMap((p) => {
      const file = resolvePath(p.path);
      if (!file) return [];
      if (!cache.has(file)) cache.set(file, headingsOf(readFileSync(join(ROOT, file), "utf8")));
      return cache.get(file)!.some((h) => headingMatches(h, p.heading)) ? [] : [`${p.at} → ${file}「${p.heading}」`];
    });
    expect(broken, because("改成目標檔裡現在的標題（或把標題改回來）", "內容搬走或標題改名後，讀者照指向找不到規則", RULE)).toEqual([]);
  });
});
