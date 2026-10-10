// 規則正本：book/docs/4-patterns/09-print-and-export.mdx「匯出（CSV）」。
// csvEscape（lib/csv）是 DataTable 匯出的唯一出口。以 = + - @、Tab、CR 開頭的文字原樣寫出，
// 試算表打開時會當成公式執行（CSV 公式注入）——檔案看起來正常、型別與其他測試全綠。
// 這支盯住三件事：危險開頭一律補 '、數字與純數字文字不補（匯出後仍能計算）、序列化與解析往返不走樣。
import { describe, it, expect } from "vitest";
import { csvEscape, csvParse, csvSerialize } from "../packages/react/src/lib/csv";
import { because } from "./lib/guard";

const RULE = "book/docs/4-patterns/09-print-and-export.mdx「匯出（CSV）」";
const WHY = "以 = + - @、Tab、CR 開頭的文字會被試算表當公式執行；純數字補了 ' 就不能拿來計算";
const fix = (what: string) => because(what, WHY, RULE);

describe("csvEscape：公式開頭的文字補單引號", () => {
  it("= + - @ 開頭的文字前面補 '", () => {
    const cases: [string, string][] = [
      ["=1+1", "'=1+1"],
      ['=HYPERLINK("http://example.test")', `"'=HYPERLINK(""http://example.test"")"`],
      ["+886 2 1234 5678", "'+886 2 1234 5678"],
      ["-2+3", "'-2+3"],
      ["@SUM(A1:A9)", "'@SUM(A1:A9)"],
    ];
    for (const [input, expected] of cases) {
      expect(csvEscape(input), fix(`「${input}」要補 ' 才不會被當公式`)).toBe(expected);
    }
  });

  it("Tab、CR 開頭的文字也補（CR 另外會被引號包起來）", () => {
    expect(csvEscape("\t=1+1"), fix("Tab 開頭要補 '")).toBe("'\t=1+1");
    expect(csvEscape("\r=1+1"), fix("CR 開頭要補 '")).toBe(`"'\r=1+1"`);
  });

  it("數字型別不動，連負數也不動", () => {
    expect(csvEscape(-5)).toBe("-5");
    expect(csvEscape(-1234.5)).toBe("-1234.5");
    expect(csvEscape(0)).toBe("0");
    // 很小或很大的數字會印成指數寫法，看起來不像純數字，但它是數字型別，照樣不補
    expect(csvEscape(-5e-7), fix("數字型別一律不補 '")).toBe("-5e-7");
    expect(csvEscape(-1e21), fix("數字型別一律不補 '")).toBe("-1e+21");
  });

  it("只有正負號＋數字的文字不補，匯出後仍是數字", () => {
    for (const s of ["-5", "+5", "-3.5", "-12%", "+5%"]) {
      expect(csvEscape(s), fix(`「${s}」是純數字，補了 ' 就不能計算`)).toBe(s);
    }
    // 含千分位逗號的照常被引號包起來，但不補 '
    for (const s of ["-1,200", "+1,234,567.89", "-1,200.5%"]) {
      expect(csvEscape(s), fix(`「${s}」是純數字，補了 ' 就不能計算`)).toBe(`"${s}"`);
    }
  });

  it("看起來像數字、其實夾了別的東西的，照樣補", () => {
    for (const s of ["-1,20", "-5e3", "+5%x", "-.5", "-", "+"]) {
      expect(csvEscape(s).replace(/^"/, ""), fix(`「${s}」不是純數字，要補 '`)).toMatch(/^'/);
    }
  });

  it("一般文字與原本的跳脫行為不變", () => {
    expect(csvEscape("項目 A")).toBe("項目 A");
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape('說 "好"')).toBe('"說 ""好"""');
    expect(csvEscape("第一行\n第二行")).toBe('"第一行\n第二行"');
    expect(csvEscape(undefined as unknown as string)).toBe("");
  });
});

describe("csvSerialize ↔ csvParse 往返", () => {
  it("表頭也走同一個跳脫", () => {
    const out = csvSerialize(["=標題", "數量"], [], false);
    expect(out).toBe("'=標題,數量");
  });

  it("解析回來：補過的值多一個開頭 '，其餘逐字相同", () => {
    const headers = ["編號", "項目", "數量", "備註"];
    const rows: (string | number)[][] = [
      ["A-001", "項目 A", -5, "=1+1"],
      ["A-002", 'a,"b"', "-1,200", "@SUM(A1)"],
      ["A-003", "第一行\n第二行", 12, "+5%"],
    ];
    const parsed = csvParse(csvSerialize(headers, rows));
    expect(parsed).toEqual([
      headers,
      ["A-001", "項目 A", "-5", "'=1+1"],
      ["A-002", 'a,"b"', "-1,200", "'@SUM(A1)"],
      ["A-003", "第一行\n第二行", "12", "+5%"],
    ]);
  });

  it("csvParse 不拿掉開頭的 '：它是通用解析器，檔案不一定是這裡匯出的", () => {
    expect(csvParse("'=1+1,'abc")).toEqual([["'=1+1", "'abc"]]);
  });
});
