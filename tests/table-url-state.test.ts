// useTableUrlState 的 codec 是純函式，直接驗。
// 另外用型別斷言盯住 TableUrlState ↔ DataTableState 的結構相容——
// lib 刻意不 import ui（registry 相依不拖整張表），兩份結構型別的漂移
// 要在這裡紅，不能等到取用端接不上才發現。
import { describe, it, expect } from "vitest";
import {
  serializeTableState, deserializeTableState, type TableUrlState,
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
