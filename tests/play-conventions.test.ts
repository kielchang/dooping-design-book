import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Play 慣例守衛：stories 裡不得用 userEvent 的文字插入 API 對輸入框設值。
//
// 理由：user-event 的文字插入在部分 Chromium 環境（實測 Electron 42／Chrome 148）
// 會經元素實例的 value descriptor 寫值，同步更新 React 的 value tracker，
// 後續 input 事件被變更偵測判定「值沒變」而吞掉 onChange——受控元件不更新，
// play 在無頭 CI 綠、真瀏覽器紅。一律改用 demo/play.ts 的 setInputValue
// （prototype setter 繞過 tracker，所有環境行為一致）。
// 鍵盤（keyboard）、點擊（click）不受影響，照常用 userEvent。
const FORBIDDEN_CALLS = ["userEvent.type(", "userEvent.clear(", "userEvent.paste("] as const;

const STORIES_ROOT = join(__dirname, "..", "packages", "react", "src");

function listStoryFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listStoryFiles(full);
    return name.endsWith(".stories.tsx") ? [full] : [];
  });
}

export function scanForForbiddenTyping(content: string): string[] {
  const hits: string[] = [];
  content.split("\n").forEach((line, i) => {
    for (const call of FORBIDDEN_CALLS) {
      if (line.includes(call)) hits.push(`${i + 1}: ${line.trim()}`);
    }
  });
  return hits;
}

describe("play 慣例：受控輸入的設值路徑", () => {
  const files = listStoryFiles(STORIES_ROOT);

  it("掃描目標存在（防空轉：glob 壞掉時這條會先紅）", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("比對邏輯抓得到已知違規（防空轉）", () => {
    expect(scanForForbiddenTyping(`await userEvent.type(input, "x");`)).toHaveLength(1);
    expect(scanForForbiddenTyping(`await userEvent.clear(input);`)).toHaveLength(1);
  });

  it("乾淨內容不會誤報（防空轉）", () => {
    expect(scanForForbiddenTyping(`await userEvent.keyboard("{Enter}");\nsetInputValue(input, "x");`)).toHaveLength(0);
  });

  it.each(files)("%s 不含 userEvent 文字插入呼叫", (file) => {
    const hits = scanForForbiddenTyping(readFileSync(file, "utf8"));
    expect(
      hits,
      `改用 packages/react/src/demo/play.ts 的 setInputValue（理由見該檔與本測試頂部註解）：\n${hits.join("\n")}`,
    ).toHaveLength(0);
  });
});
