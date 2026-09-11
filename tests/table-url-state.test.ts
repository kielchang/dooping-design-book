// 規則正本：book/docs/3-components/13-data-table.mdx「狀態同步網址」、4-patterns/11-back-office-ia.mdx 深連結規範。
// useTableUrlState 的 codec 是純函式，直接驗。
// 另外用型別斷言盯住 TableUrlState ↔ DataTableState 的結構相容——
// lib 刻意不 import ui（registry 相依不拖整張表），兩份結構型別的漂移
// 要在這裡紅，不能等到取用端接不上才發現。
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import {
  serializeTableState, deserializeTableState, mergeTableSearch, useTableUrlState,
  type TableUrlState, type UrlStateAdapter,
} from "../packages/react/src/lib/use-table-url-state";
import type { DataTableState } from "../packages/react/src/ui/data-table";

// ── 型別相容斷言（編譯期）────────────────────────────────────
// TableUrlState 必須恰好是 DataTableState 去掉兩個暫時狀態鍵的子集，雙向可指派。
type UrlKeys = "page" | "pageSize" | "query" | "sort" | "filters";
type _AssertA = TableUrlState extends Pick<DataTableState, UrlKeys> ? true : never;
type _AssertB = Pick<DataTableState, UrlKeys> extends TableUrlState ? true : never;
const _typeCompatible: [_AssertA, _AssertB] = [true, true];
void _typeCompatible;

const DEFAULTS: TableUrlState = { page: 0, pageSize: 15, query: "", sort: null, filters: {} };
const f = (patch: Partial<TableUrlState["filters"][string]>) => ({ texts: [], min: "", max: "", values: [], ...patch });

describe("serializeTableState", () => {
  it("預設值不寫進網址（全預設＝空字串）", () => {
    expect(serializeTableState(DEFAULTS, DEFAULTS)).toBe("");
  });

  it("page 序列化成 1-based，第 1 頁省略", () => {
    expect(serializeTableState({ ...DEFAULTS, page: 2 }, DEFAULTS)).toBe("page=3");
    expect(serializeTableState({ ...DEFAULTS, page: 0 }, DEFAULTS)).toBe("");
  });

  it("sort 用人看得懂的 key.dir", () => {
    expect(serializeTableState({ ...DEFAULTS, sort: { key: "amount", dir: "desc" } }, DEFAULTS)).toBe("sort=amount.desc");
  });

  it("三種篩選各走自己的通道", () => {
    const s = serializeTableState(
      { ...DEFAULTS, filters: { status: f({ values: ["已確認", "草稿"] }), amount: f({ min: "1000", max: "5000" }), name: f({ texts: ["甲"] }) } },
      DEFAULTS,
    );
    const p = new URLSearchParams(s);
    expect(p.get("f.status")).toContain(",");
    expect(p.get("fr.amount")).toBe(`${encodeURIComponent("1000")}..${encodeURIComponent("5000")}`);
    expect(p.get("ft.name")).toBe(encodeURIComponent("甲"));
  });
});

describe("round-trip", () => {
  it("serialize → deserialize 還原同一個狀態", () => {
    const state: TableUrlState = {
      page: 4,
      pageSize: 30,
      query: "甲 乙",
      sort: { key: "qty", dir: "asc" },
      filters: {
        status: f({ values: ["已確認", "含,逗號"] }),
        amount: f({ min: "100", max: "" }),
        name: f({ texts: ["長名稱", "B-7"] }),
      },
    };
    const back = deserializeTableState(serializeTableState(state, DEFAULTS), DEFAULTS);
    expect(back).toEqual(state);
  });

  it("prefix 隔離同頁多張表", () => {
    const s1 = serializeTableState({ ...DEFAULTS, query: "甲" }, DEFAULTS, "t1.");
    const s2 = serializeTableState({ ...DEFAULTS, query: "乙" }, DEFAULTS, "t2.");
    const merged = `${s1}&${s2}`;
    expect(deserializeTableState(merged, DEFAULTS, "t1.").query).toBe("甲");
    expect(deserializeTableState(merged, DEFAULTS, "t2.").query).toBe("乙");
  });

  it("看不懂的參數原樣忽略", () => {
    const s = deserializeTableState("q=%E7%94%B2&utm_source=x&page=abc", DEFAULTS);
    expect(s.query).toBe("甲");
    expect(s.page).toBe(0); // page=abc 不是合法頁碼
  });
});

// prefix 原本只隔離讀、沒有隔離寫：寫入交出只有本表參數的字串，預設 adapter 又整串覆寫，
// 同頁的 view 與另一張表的參數會被洗掉（內部試裝宿主 LEDGER 回饋 2）。
describe("mergeTableSearch：寫入只替換本表的參數", () => {
  it("保留同頁其他參數與另一張表的參數", () => {
    const next = mergeTableSearch("view=draft&t2.q=%E4%B9%99&t1.page=3", { ...DEFAULTS, query: "甲" }, DEFAULTS, "t1.");
    const p = new URLSearchParams(next);
    expect(p.get("t1.q")).toBe("甲");
    expect(p.get("view")).toBe("draft");
    expect(p.get("t2.q")).toBe("乙");
    expect(p.has("t1.page")).toBe(false); // 回到預設值的鍵要拿掉，不能留著舊值
  });

  it("同 prefix 開頭但不是表格鍵的參數不碰", () => {
    const p = new URLSearchParams(mergeTableSearch("t1.tab=history&t1.q=%E8%88%8A", DEFAULTS, DEFAULTS, "t1."));
    expect(p.get("t1.tab")).toBe("history");
    expect(p.has("t1.q")).toBe(false);
  });

  it("沒有 prefix 時也保留非表格參數", () => {
    const p = new URLSearchParams(mergeTableSearch("view=grid&q=old&page=2", { ...DEFAULTS, query: "新" }, DEFAULTS));
    expect(p.get("q")).toBe("新");
    expect(p.get("view")).toBe("grid");
    expect(p.has("page")).toBe(false);
  });

  it("合併後另一張表的篩選值（含逗號、雙重編碼）原樣還原", () => {
    const other: TableUrlState = { ...DEFAULTS, filters: { status: f({ values: ["已確認", "含,逗號"] }) } };
    const merged = mergeTableSearch(serializeTableState(other, DEFAULTS, "t2."), { ...DEFAULTS, query: "甲" }, DEFAULTS, "t1.");
    expect(deserializeTableState(merged, DEFAULTS, "t1.").query).toBe("甲");
    expect(deserializeTableState(merged, DEFAULTS, "t2.")).toEqual(other);
  });
});

describe("useTableUrlState：hook 的寫入走 mergeTableSearch", () => {
  // node 環境用 renderToString 跑一次 hook、把 onStateChange 帶出來直接呼叫——
  // 為了這一條不必拉 jsdom 或 testing-library。
  function capture(adapter: UrlStateAdapter, prefix: string) {
    let api: ReturnType<typeof useTableUrlState> | undefined;
    function Probe() {
      api = useTableUrlState({ adapter, prefix });
      return null;
    }
    renderToString(createElement(Probe));
    if (!api) throw new Error("hook 沒有執行");
    return api;
  }

  it("同頁的 view 與另一張表的參數不會被洗掉", () => {
    let search = "view=draft&t2.q=%E4%B9%99";
    const adapter: UrlStateAdapter = {
      get: () => search,
      set: (s) => {
        search = s;
      },
      subscribe: () => () => {},
    };
    capture(adapter, "t1.").onStateChange({ query: "甲" });
    const p = new URLSearchParams(search);
    expect(p.get("t1.q")).toBe("甲");
    expect(p.get("view")).toBe("draft");
    expect(p.get("t2.q")).toBe("乙");
  });
});
