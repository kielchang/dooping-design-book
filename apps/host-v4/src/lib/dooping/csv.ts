// CSV 序列化／解析。
//
// 為什麼自己寫而不是拉套件：需求只有「跳脫 + BOM」兩件事，但 BOM 那件事沒有它中文在 Excel
// 開起來就是亂碼——這是每個交付到台灣／日本辦公室的系統都會踩的坑，所以它必須是預設行為。

export function csvEscape(v: string | number): string {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** 表頭＋資料列 → CSV 文字。預設加 UTF-8 BOM（Excel 才會用 UTF-8 解讀）。 */
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
