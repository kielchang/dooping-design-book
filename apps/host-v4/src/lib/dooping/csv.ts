export function csvEscape(v: string | number): string {
  // 文字以 = + - @、Tab、CR 開頭時，試算表會把它當公式執行（CSV 公式注入）：前面補 ' 讓它成為一般文字。
  // 數字型別、以及只有「正負號＋數字」的文字（千分位逗號、小數點、結尾 % 都算）不補——
  // 它們不可能是公式，補了之後試算表就不能拿來計算。
  // 說明寫在函式內而不是檔頭：shadcn CLI 安裝時會刪掉檔案開頭的註解（tests/registry-content.test.ts）。
  let s = String(v ?? "");
  if (typeof v === "string" && /^[=+\-@\t\r]/.test(s) && !/^[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?%?$/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * 表頭＋資料列 → CSV 文字。預設加 UTF-8 BOM（Excel 才會用 UTF-8 解讀）。
 *
 * CSV 序列化／解析為什麼自己寫而不是拉套件：需求只有「跳脫 + BOM」兩件事，但 BOM 那件事沒有它中文在 Excel
 * 開起來就是亂碼——這是每個交付到台灣／日本辦公室的系統都會踩的坑，所以它必須是預設行為。
 */
export function csvSerialize(headers: string[], rows: (string | number)[][], bom = true): string {
  const body = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
  return (bom ? "﻿" : "") + body;
}

/** CSV 文字 → 二維字串陣列。處理引號內逗號／換行、跳脫 `""`、CRLF、開頭 BOM；略過全空白列。 */
export function csvParse(text: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); out.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); out.push(row); }
  return out.filter((r) => r.some((cell) => cell.trim() !== ""));
}
