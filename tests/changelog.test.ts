// CHANGELOG 的分節與 deploy.yml 抽 Release notes 的規則，是同一份事實的兩處。
// deploy.yml 從「## v<版號> 」那行之後開始讀、遇到第一條恰為 `---` 的行停——
// 某一節漏了節尾分隔線，notes 就會一路吃進下一個版本，而且不會有任何錯誤訊息。
// 2026-09-10 的 v0.13.0 實際發生過（模擬抽出 275 行、18 個工作項，正確是 221 行、15 個），
// 合併前人工抓到；這支守衛讓它下次在本機就紅。
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);

// 工作目錄在 Windows 是 CRLF、CI checkout 是 LF——比對前一律去掉行尾 CR
const toLines = (text: string) => text.split(LF).map((l) => (l.endsWith(CR) ? l.slice(0, -1) : l));

/**
 * deploy.yml「建立 GitHub Release」那一步 awk 的逐行移植：
 *   index($0, "## " tag " ") == 1 {f=1; next}   以「## <tag> 」開頭的行開始（該行本身不輸出）
 *   f && /^---$/ {exit}                          開始之後第一條恰為 --- 的行結束（不含）
 *   f                                            其間每一行輸出
 * 找不到標題回傳 null（deploy.yml 會發 warning，Release 沒有 notes）。
 */
function extractReleaseNotes(text: string, tag: string): string[] | null {
  let started = false;
  const out: string[] = [];
  for (const line of toLines(text)) {
    if (line.startsWith(`## ${tag} `)) {
      started = true;
      continue;
    }
    if (started && line === "---") break;
    if (started) out.push(line);
  }
  return started ? out : null;
}

const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
const version: string = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;

describe("extractReleaseNotes：deploy.yml 抽取規則的移植", () => {
  // 先證明移植本身抓得到「漏分隔線」，下面對真檔的斷言才不會空轉
  const sample = [
    "# 標題", "",
    "## v9.9.9 · 日期", "", "甲", "",
    "## v9.9.8 · 日期", "乙", "", "---", "",
    "## v9.9.7 · 日期", "丙",
  ].join(LF);

  it("遇到第一條 --- 才停：少了節尾分隔線就吃進下一節", () => {
    const notes = extractReleaseNotes(sample, "v9.9.9");
    expect(notes).toContain("甲");
    expect(notes).toContain("## v9.9.8 · 日期");
    expect(notes).not.toContain("## v9.9.7 · 日期");
  });

  it("找不到標題回傳 null；版號後面要接空白才算（v9.9.9 不會吃到 v9.9.90）", () => {
    expect(extractReleaseNotes(sample, "v1.0.0")).toBeNull();
    expect(extractReleaseNotes(["## v9.9.90 · 日期", "丁"].join(LF), "v9.9.9")).toBeNull();
  });

  it("CRLF 與 LF 抽出同樣的結果", () => {
    expect(extractReleaseNotes(sample.split(LF).join(CR + LF), "v9.9.9")).toEqual(extractReleaseNotes(sample, "v9.9.9"));
  });
});

describe("CHANGELOG 對得上 Release notes 的抽取規則", () => {
  it(`目前版號 v${version} 的 notes 只含自己這一節`, () => {
    const notes = extractReleaseNotes(changelog, `v${version}`);
    if (notes === null) {
      // 還在 dev 上工作、尚未改名：必須有「未發佈」節可以改名，否則合併後 Release 沒有 notes
      const hasUnreleased = toLines(changelog).some((l) => l.startsWith("## 未發佈"));
      expect(hasUnreleased, `CHANGELOG 既沒有「## v${version} 」也沒有「## 未發佈」節`).toBe(true);
      return;
    }
    expect(notes.some((l) => l.trim() !== ""), `v${version} 的 notes 是空的`).toBe(true);
    const leaked = notes.filter((l) => l.startsWith("## "));
    expect(leaked, `v${version} 節尾缺分隔線，Release notes 會吃進這些節`).toEqual([]);
  });

  it("第一個 ## 標題之後，每一節前面都是「空行、---、空行」", () => {
    const lines = toLines(changelog);
    const headings: number[] = [];
    let fence = false;
    lines.forEach((l, i) => {
      if (l.startsWith("```")) fence = !fence;
      else if (!fence && l.startsWith("## ")) headings.push(i);
    });
    // 防空轉：解析壞掉時標題數會是 0，迴圈一次都不跑
    expect(headings.length).toBeGreaterThan(3);
    const missing = headings
      .slice(1)
      .filter((i) => !(lines[i - 1] === "" && lines[i - 2] === "---" && lines[i - 3] === ""))
      .map((i) => `第 ${i + 1} 行：${lines[i]}`);
    expect(missing, "這些標題前缺節尾分隔線（deploy.yml 抽 notes 靠它停止）").toEqual([]);
  });
});
