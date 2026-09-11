// 守衛共用的三個小工具。規則軌的兩條慣例都在這裡落地：
//   1. 失敗訊息要帶理由與規則所在的文件頁——讀到紅燈的人（或 agent）不必翻檔頭就知道為什麼、去哪改。
//   2. 逐行比對 markdown 時先去掉行尾 CR（工作目錄在 Windows 是 CRLF、CI 是 LF），並且圍籬與行內碼不算內文。
// 守衛台帳（每支守衛管什麼、不管什麼）在 ARCHITECTURE.md「守衛」一節，tests/guard-ledger.test.ts 盯著它不漏列。

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);

/**
 * 組出帶理由與指向的失敗訊息：`expect(offenders, because("修法", "理由", "book/docs/…")).toEqual([])`。
 * 第三個參數是規則正本的位置——文件頁路徑或檔案路徑都可以，取用端與 agent 都找得到。
 */
export function because(fix: string, why: string, ruleAt: string): string {
  return `${fix}${LF}為什麼：${why}${LF}規則正本：${ruleAt}`;
}

/** 文字切行並去掉行尾 CR。 */
export const toLines = (text: string): string[] => text.split(LF).map((l) => (l.endsWith(CR) ? l.slice(0, -1) : l));

/**
 * 去掉 markdown 裡「不算內文」的部分：``` 圍籬整段、以及圍籬外的行內碼。
 * 回傳逐行陣列，圍籬內的行變成空字串（保留行號，方便回報第幾行）。
 */
export function stripCode(text: string): string[] {
  let fence = false;
  return toLines(text).map((raw) => {
    if (/^\s*```/.test(raw)) { fence = !fence; return ""; }
    return fence ? "" : raw.replace(/`[^`]*`/g, "");
  });
}
