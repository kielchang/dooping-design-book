import * as React from "react";

// 表格狀態 ↔ 網址同步（蒸餾自 shadcn-admin 的 use-table-url-state，改成框架無關）。
//
// 深連結是模式章〈後台系統的資訊架構〉的站台層規範：「畫面內的分頁與選中的對象
// 要寫進網址」，這支 hook 是它在資料表上的落地。三條蒸餾來的規則：
// 1. 預設值不寫進網址（page=1 省略）——網址是會被貼進聊天室的，保持乾淨。
// 2. 篩選／搜尋變更自動回第 1 頁（DataTable 端已附帶，這裡再保險一次）。
// 3. 參數用人看得懂的字（q=甲、sort=amount.desc），不用內部索引。
//
// 刻意**不** import ui/——lib 不反向依賴 ui，registry 端這個 item 也不用拖整張表。
// TableUrlState 與 DataTableState 的結構相容由 tests/table-url-state.test.ts 的
// 型別斷言盯住，漂移會紅在測試不會紅在取用端。

/** 與 DataTable 的 ColFilter 同構（結構相容，見檔頭）。 */
export interface UrlColFilter {
  texts: string[];
  min: string;
  max: string;
  values: string[];
}

export interface TableUrlState {
  /** 內部 0-based；網址序列化成 1-based（人看得懂），第 1 頁省略。 */
  page: number;
  pageSize: number;
  query: string;
  sort: { key: string; dir: "asc" | "desc" } | null;
  filters: Record<string, UrlColFilter>;
}

/**
 * 網址存取的注入點。預設 historyAdapter；TanStack Router／Next 宿主
 * 用自家 API 包出同介面（get 回傳不含 "?" 的 search 字串）。
 *
 * `set` 收到的是**整串** search：hook 寫入前已保留同頁不屬於這張表的參數
 * （分頁籤的 `view`、另一個 prefix 的表），adapter 照單寫回即可，不必自己合併。
 */
export interface UrlStateAdapter {
  get(): string;
  set(search: string): void;
  subscribe(cb: () => void): () => void;
}

/**
 * 預設 adapter：history.replaceState ＋ popstate。
 * 用 replace 而不是 push——每敲一個字就多一筆歷史，上一頁會變成倒帶打字機。
 * set 後補發 popstate 讓同頁的其他訂閱者（含自己）重讀。
 * 全部 window 取用都在函式內並有守門，SSR 期間安全（回空字串、訂閱為 no-op）。
 */
export const historyAdapter: UrlStateAdapter = {
  get: () => (typeof window === "undefined" ? "" : window.location.search.replace(/^\?/, "")),
  set: (search) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  },
  subscribe: (cb) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("popstate", cb);
    return () => window.removeEventListener("popstate", cb);
  },
};

const DEFAULTS: TableUrlState = { page: 0, pageSize: 15, query: "", sort: null, filters: {} };

const enc = encodeURIComponent;
const joinVals = (vals: string[]) => vals.map(enc).join(",");
const splitVals = (raw: string) => raw.split(",").filter(Boolean).map(decodeURIComponent);

/** state → search 字串。預設值省略；filters 逐欄三種通道：f.<欄>＝多選、ft.<欄>＝文字、fr.<欄>＝範圍。 */
export function serializeTableState(state: TableUrlState, defaults: TableUrlState, prefix = ""): string {
  const p = new URLSearchParams();
  const k = (name: string) => `${prefix}${name}`;
  if (state.query.trim() !== defaults.query) p.set(k("q"), state.query.trim());
  if (state.page !== defaults.page) p.set(k("page"), String(state.page + 1));
  if (state.pageSize !== defaults.pageSize) p.set(k("size"), String(state.pageSize));
  if (state.sort && (defaults.sort === null || state.sort.key !== defaults.sort.key || state.sort.dir !== defaults.sort.dir)) {
    p.set(k("sort"), `${state.sort.key}.${state.sort.dir}`);
  }
  for (const [col, f] of Object.entries(state.filters)) {
    if (f.values.length > 0) p.set(k(`f.${col}`), joinVals(f.values));
    if (f.texts.length > 0) p.set(k(`ft.${col}`), joinVals(f.texts));
    if (f.min !== "" || f.max !== "") p.set(k(`fr.${col}`), `${enc(f.min)}..${enc(f.max)}`);
  }
  return p.toString();
}

/** search 字串 → state。看不懂的參數原樣忽略（同頁還有別人的參數是常態）。 */
export function deserializeTableState(search: string, defaults: TableUrlState, prefix = ""): TableUrlState {
  const p = new URLSearchParams(search);
  const state: TableUrlState = { ...defaults, filters: { ...defaults.filters } };
  const strip = (name: string) => (prefix && name.startsWith(prefix) ? name.slice(prefix.length) : prefix ? null : name);

  for (const [rawName, value] of p.entries()) {
    const name = strip(rawName);
    if (name === null) continue;
    if (name === "q") state.query = value;
    else if (name === "page") {
      const n = Number(value);
      if (Number.isInteger(n) && n >= 1) state.page = n - 1;
    } else if (name === "size") {
      const n = Number(value);
      if (Number.isInteger(n) && n > 0) state.pageSize = n;
    } else if (name === "sort") {
      const m = value.match(/^(.+)\.(asc|desc)$/);
      if (m) state.sort = { key: m[1], dir: m[2] as "asc" | "desc" };
    } else if (name.startsWith("f.")) {
      const col = name.slice(2);
      state.filters[col] = { ...(state.filters[col] ?? { texts: [], min: "", max: "", values: [] }), values: splitVals(value) };
    } else if (name.startsWith("ft.")) {
      const col = name.slice(3);
      state.filters[col] = { ...(state.filters[col] ?? { texts: [], min: "", max: "", values: [] }), texts: splitVals(value) };
    } else if (name.startsWith("fr.")) {
      const col = name.slice(3);
      const m = value.match(/^(.*)\.\.(.*)$/);
      if (m) {
        state.filters[col] = {
          ...(state.filters[col] ?? { texts: [], min: "", max: "", values: [] }),
          min: decodeURIComponent(m[1]),
          max: decodeURIComponent(m[2]),
        };
      }
    }
  }
  return state;
}

/** 參數是不是本表的：prefix 底下的表格鍵（q／page／size／sort／f.*／ft.*／fr.*）。同 prefix 開頭的其他鍵不算。 */
function isTableParam(name: string, prefix: string): boolean {
  const key = !prefix ? name : name.startsWith(prefix) ? name.slice(prefix.length) : null;
  if (key === null) return false;
  return (
    key === "q" || key === "page" || key === "size" || key === "sort" ||
    key.startsWith("f.") || key.startsWith("ft.") || key.startsWith("fr.")
  );
}

/**
 * 把這張表的狀態寫回**整串** search：只替換本表的參數，其他參數原樣保留。
 *
 * prefix 原本只隔離了讀：寫入時交出「只有本表參數」的字串，而預設 historyAdapter 整串覆寫，
 * 同頁的其他參數（分頁籤的 `view`、另一張表的 `t2.*`）就被洗掉——內部試裝宿主第一次接就踩到。
 * 沒有 prefix 時，通用鍵（`page`、`q`）一律視為本表的；同頁還有別人的參數就該帶 prefix。
 */
export function mergeTableSearch(search: string, state: TableUrlState, defaults: TableUrlState, prefix = ""): string {
  const p = new URLSearchParams(search);
  for (const name of [...new Set(p.keys())]) {
    if (isTableParam(name, prefix)) p.delete(name);
  }
  for (const [name, value] of new URLSearchParams(serializeTableState(state, defaults, prefix))) {
    p.append(name, value);
  }
  return p.toString();
}

export interface UseTableUrlStateOptions {
  /** 預設 historyAdapter。 */
  adapter?: UrlStateAdapter;
  /** 預設值不寫進網址；pageSize 的預設要與 DataTable 的 pageSize prop 一致。 */
  defaults?: Partial<TableUrlState>;
  /** 同頁多張表、或同頁還有其他網址參數時的鍵前綴（"t2." → t2.q=…）。讀與寫都只碰這個前綴底下的表格鍵。 */
  prefix?: string;
}

/**
 * 表格狀態 ↔ 網址。回傳值直接接 DataTable：
 * `<DataTable state={state} onStateChange={onStateChange} …/>`
 *
 * `selection` 與 `hiddenColumns` 的 patch 會被忽略——暫時狀態不進網址
 * （判準：別人打開這個連結，需要看到一樣的東西嗎？）。
 */
export function useTableUrlState(options: UseTableUrlStateOptions = {}) {
  const { adapter = historyAdapter, prefix = "" } = options;
  const defaults = React.useMemo(
    () => ({ ...DEFAULTS, ...options.defaults }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(options.defaults)],
  );

  const search = React.useSyncExternalStore(adapter.subscribe, adapter.get, () => "");
  const state = React.useMemo(
    () => deserializeTableState(search, defaults, prefix),
    [search, defaults, prefix],
  );

  const onStateChange = React.useCallback(
    (patch: Partial<TableUrlState & { selection: string[]; hiddenColumns: string[] }>) => {
      const { selection: _sel, hiddenColumns: _hid, ...rest } = patch;
      if (Object.keys(rest).length === 0) return;
      // 條件變更未帶 page 時回第 1 頁——DataTable 端已附帶，獨立使用時這裡保險
      const resets = ["query", "filters", "sort", "pageSize"].some((key) => key in rest);
      const current = adapter.get();
      const next: TableUrlState = {
        ...deserializeTableState(current, defaults, prefix),
        ...(resets && !("page" in rest) ? { page: 0 } : {}),
        ...rest,
      };
      adapter.set(mergeTableSearch(current, next, defaults, prefix));
    },
    [adapter, defaults, prefix],
  );

  return { state, onStateChange };
}
