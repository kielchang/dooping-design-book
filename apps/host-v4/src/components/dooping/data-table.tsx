import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, freezeFirst,
} from "@/components/dooping/table";
import { EmptyState } from "@/components/dooping/empty-state";
import { Skeleton } from "@/components/dooping/skeleton";
import { Input } from "@/components/dooping/input";
import { Button } from "@/components/dooping/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/dooping/select";
import { Tooltip } from "@/components/dooping/tooltip";
import { Checkbox } from "@/components/dooping/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/dooping/popover";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel,
} from "@/components/dooping/dropdown-menu";
import { useSort, type SortState } from "@/lib/dooping/use-sort";
import { csvSerialize } from "@/lib/dooping/csv";
import { saveBlob } from "@/lib/dooping/download";
import { cn } from "@/lib/dooping/utils";
import {
  Search, Download, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, Filter, X, Check, Plus, Columns3,
} from "lucide-react";

/** 欄位定義：用「設定」描述一欄怎麼顯示、排序、篩選、合計，而不是每張表各自手刻 `<td>`。 */
export type Column<T> = {
  key: string;
  header: ReactNode;
  /** 顯示內容 */
  cell: (row: T) => ReactNode;
  /** 數字欄＝右對齊等寬 */
  numeric?: boolean;
  /** 可排序時的取值（數字或字串）；未給＝此欄不可排序 */
  sortValue?: (row: T) => number | string;
  /** 參與關鍵字搜尋的文字；未給時數字欄不參與、文字欄以 sortValue 推導 */
  filterText?: (row: T) => string;
  /**
   * 單欄篩選型態：text＝包含、range＝數值範圍、select＝從清單多選、none＝不可篩。
   * 未給則自動判定：數字欄且可排序→range、有 filterText/sortValue→text、其餘 none。
   */
  filter?: "text" | "range" | "select" | "none";
  /** 合計列內容。傳入的是「篩選後全部」而不是當頁——合計只算看得到的一頁是經典的對帳災難。 */
  total?: (rows: T[]) => ReactNode;
  /** 凍結為首欄 */
  freeze?: boolean;
  headerClassName?: string;
  cellClassName?: string | ((row: T) => string);
  /** 最大寬度(px)：超出以 … 截斷，hover/長壓顯示完整（提示文字取 filterText） */
  truncate?: number;
  /** 可被「欄位」切換隱藏；預設 true，凍結欄強制不可隱藏 */
  hideable?: boolean;
  /** 預設隱藏（可從「欄位」切換打開） */
  defaultHidden?: boolean;
};

export interface DataTableLabels {
  search: string;
  exportCsv: string;
  filterOf: (header: string) => string;
  /** 每頁筆數下拉的可及名稱——combobox 的名稱不能取自值文字 */
  perPageLabel: string;
  activeFilters: string;
  clearAll: string;
  clear: string;
  done: string;
  remove: (what: string) => string;
  rangeTitle: string;
  rangeMin: string;
  rangeMax: string;
  selectTitle: string;
  selectSearch: string;
  selectAll: string;
  selectNone: string;
  noMatchingValues: string;
  textTitle: string;
  textPlaceholder: string;
  suggestions: string;
  emptyTitle: string;
  noResultTitle: string;
  noResultHint: string;
  loading: string;
  rowsRange: (from: number, to: number, total: number) => string;
  perPage: (n: number) => string;
  prev: string;
  next: string;
  totalRow: string;
  resizeHint: string;
  selectAllPage: string;
  selectRow: (key: string) => string;
  selectedCount: (n: number) => string;
  clearSelection: string;
  columnsButton: string;
  columnsTitle: string;
}

/** 預設文案（繁體中文）。宿主要換語言時整包覆寫，不必改元件。 */
export const DEFAULT_DATA_TABLE_LABELS: DataTableLabels = {
  search: "搜尋關鍵字…",
  exportCsv: "匯出 CSV",
  filterOf: (h) => `篩選 ${h}`,
  activeFilters: "篩選條件：",
  clearAll: "全部清除",
  clear: "清除",
  done: "完成",
  remove: (w) => `移除 ${w}`,
  rangeTitle: "數值範圍",
  rangeMin: "最小",
  rangeMax: "最大",
  selectTitle: "選取值（多選）",
  selectSearch: "搜尋值…",
  selectAll: "全選",
  selectNone: "取消全選",
  noMatchingValues: "無符合的值",
  textTitle: "包含文字（可多筆，符合任一即列出）",
  textPlaceholder: "輸入關鍵字，Enter 加入…",
  suggestions: "推薦（點擊快速加入）",
  emptyTitle: "尚無資料",
  noResultTitle: "查無符合的資料",
  noResultHint: "請調整關鍵字或欄位篩選。",
  loading: "載入中…",
  rowsRange: (f, t, n) => `第 ${f}–${t} ／ 共 ${n} 筆`,
  perPage: (n) => `每頁 ${n}`,
  // combobox 的可及名稱不能取自內容文字（值不是名稱）——觸發鈕必須另給程式可及標籤
  perPageLabel: "每頁筆數",
  prev: "上一頁",
  next: "下一頁",
  totalRow: "合計",
  resizeHint: "拖曳調整欄寬，雙擊自適應內容",
  selectAllPage: "選取本頁全部",
  selectRow: (key) => `選取 ${key}`,
  selectedCount: (n) => `已選 ${n} 筆`,
  clearSelection: "清除選取",
  columnsButton: "欄位",
  columnsTitle: "顯示欄位",
};

export type ColFilter = { texts: string[]; min: string; max: string; values: string[] };
const EMPTY_FILTER: ColFilter = { texts: [], min: "", max: "", values: [] };
const POP_W = 224;

/**
 * 可受控／可同步網址的狀態全集。`selection` 與 `hiddenColumns` 是暫時狀態，
 * 深連結判準（「別人打開這個連結需要看到一樣的東西嗎？」）之下**不進網址**——
 * `useTableUrlState` 會自動忽略這兩鍵。
 */
export interface DataTableState {
  page: number;
  pageSize: number;
  query: string;
  sort: SortState;
  filters: Record<string, ColFilter>;
  hiddenColumns: string[];
  selection: string[];
}

export type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T, index: number) => string;
  initialSort?: SortState;
  /** 超過此筆數才顯示分頁器（門檻式）；預設 15 */
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  searchPlaceholder?: string;
  zebra?: boolean;
  stickyHeader?: boolean;
  dense?: boolean;
  maxHeight?: string;
  /** 指向儲存格時 highlight 整行整列（十字對準）；預設開 */
  crosshair?: boolean;
  /** 可拖曳欄位邊界調整寬度、雙擊自適應；預設開 */
  resizable?: boolean;
  empty?: { title: string; hint?: string; icon?: ReactNode; action?: ReactNode };
  /**
   * 載入中。兩種長相，元件自己分（規範見文件〈載入中〉）：
   * 還沒有資料 → 骨架列（列數＝每頁筆數，上限 15——骨架超過一屏沒有意義）；
   * 已有資料（重新查詢）→ 保留舊內容就地變暗＋資料列脈動＋ `aria-busy`，**不要**蓋骨架（會閃）。
   */
  loading?: boolean;
  /** 工具列額外元素（期間選擇器、其他按鈕…），置於搜尋列右側 */
  toolbar?: ReactNode;
  /** 提供則顯示「匯出 CSV」按鈕，匯出**目前篩選排序後**的資料 */
  csv?: { headers: string[]; row: (row: T) => (string | number)[]; fileName: string };
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  labels?: Partial<DataTableLabels>;
  /**
   * 逐鍵受控（Radix 慣例）：給了哪個鍵、哪個鍵由宿主管理，其餘維持內部狀態。
   * 配 `useTableUrlState` 一行接上網址同步：
   * `const { state, onStateChange } = useTableUrlState(); <DataTable state={state} onStateChange={onStateChange} …/>`
   */
  state?: Partial<DataTableState>;
  /** 任一狀態變更時回呼：patch＝這次改了什麼、next＝合併後的完整狀態。 */
  onStateChange?: (patch: Partial<DataTableState>, next: DataTableState) => void;
  /**
   * 多選列：首欄前插勾選欄。表頭勾選只切**當頁**（批次操作是寫入，誤殺半徑優先），
   * 選取跨頁保留。需要穩定的 `getRowKey`（不得依賴 index）。
   */
  selectable?: boolean;
  /** 批次操作列：有選取才出現，sticky 置底（容器內，不蓋站台 UI）。 */
  bulkActions?: (ctx: { selected: T[]; clear: () => void }) => ReactNode;
  /**
   * 升級為工具列 faceted 鈕的欄 key（欄的篩選型態需為／可推導為 select）。
   * 與表頭篩選**共用同一份**狀態——兩個入口、一個真相，不會打架。
   */
  facets?: string[];
  /** 顯示「欄位」顯示切換鈕（配 Column 的 hideable／defaultHidden）。 */
  columnVisibility?: boolean;
};

/**
 * 資料表（跨系統標準件）。
 *
 * 內建：關鍵字搜尋、單欄篩選（文字包含／數值範圍／多選）、排序、可調欄寬、十字對準、
 * 門檻式分頁、黏性表頭、斑馬紋、凍結首欄、合計列、空狀態、CSV 匯出。
 *
 * 三個刻意的決定：
 * 1. **門檻式分頁**——資料量沒超過一頁就不顯示分頁器。永遠顯示「1/1 頁」只是噪音。
 * 2. **合計算篩選後全部**，不是當頁。使用者篩完就是要那個總數。
 * 3. **匯出跟著畫面**——匯出的是他現在看到的（篩選＋排序後），不是原始全量。
 */
export function DataTable<T>({
  rows, columns, getRowKey, initialSort = null,
  pageSize = 15, pageSizeOptions = [5, 15, 30, 50],
  searchable = true, searchPlaceholder,
  zebra = true, stickyHeader = true, dense = false, maxHeight, crosshair = true, resizable = true,
  empty, toolbar, csv, rowClassName, onRowClick, loading = false, labels: labelOverrides,
  state: stateProp, onStateChange, selectable = false, bulkActions, facets = [], columnVisibility = false,
}: DataTableProps<T>) {
  const L = { ...DEFAULT_DATA_TABLE_LABELS, ...labelOverrides };

  // ── 狀態：逐鍵受控 ─────────────────────────────────────────
  // `state` 給了哪個鍵、哪個鍵由宿主管理（配 useTableUrlState 同步網址），
  // 沒給的鍵維持內部狀態——兩種模式逐鍵混用。所有變更都走 update()：
  // 篩選／搜尋／排序／每頁筆數的 patch 一律附帶 page:0（條件變了還停在第 7 頁沒有意義）。
  const [queryState, setQueryState] = useState("");
  const [sizeState, setSizeState] = useState(pageSize);
  const [pageState, setPageState] = useState(0);
  const [filtersState, setFiltersState] = useState<Record<string, ColFilter>>({});
  const [sortState, setSortState] = useState<SortState>(initialSort);
  const [hiddenState, setHiddenState] = useState<string[]>(
    () => columns.filter((c) => c.defaultHidden).map((c) => c.key),
  );
  const [selectionState, setSelectionState] = useState<string[]>([]);

  const query = stateProp?.query ?? queryState;
  const size = stateProp?.pageSize ?? sizeState;
  const page = stateProp?.page ?? pageState;
  const colFilters = stateProp?.filters ?? filtersState;
  const sort = stateProp?.sort !== undefined ? stateProp.sort : sortState;
  const hiddenColumns = stateProp?.hiddenColumns ?? hiddenState;
  const selection = stateProp?.selection ?? selectionState;

  const update = (patch: Partial<DataTableState>) => {
    if (patch.query !== undefined && stateProp?.query === undefined) setQueryState(patch.query);
    if (patch.pageSize !== undefined && stateProp?.pageSize === undefined) setSizeState(patch.pageSize);
    if (patch.page !== undefined && stateProp?.page === undefined) setPageState(patch.page);
    if (patch.filters !== undefined && stateProp?.filters === undefined) setFiltersState(patch.filters);
    if (patch.sort !== undefined && stateProp?.sort === undefined) setSortState(patch.sort);
    if (patch.hiddenColumns !== undefined && stateProp?.hiddenColumns === undefined) setHiddenState(patch.hiddenColumns);
    if (patch.selection !== undefined && stateProp?.selection === undefined) setSelectionState(patch.selection);
    onStateChange?.(patch, {
      page, pageSize: size, query, sort, filters: colFilters, hiddenColumns, selection, ...patch,
    });
  };

  const [cross, setCross] = useState<{ r: number; c: number } | null>(null);
  const [openFilter, setOpenFilter] = useState<{ key: string; top: number; left: number } | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [selQuery, setSelQuery] = useState("");
  const [textInput, setTextInput] = useState("");
  useEffect(() => { setSelQuery(""); setTextInput(""); }, [openFilter?.key]);

  // 篩選面板要吃 Esc：只靠點背景關閉，鍵盤使用者會被困在面板裡。
  // 掛在 document 而不是面板上——焦點可能還停在表頭的篩選鈕，面板層收不到按鍵。
  useEffect(() => {
    if (!openFilter) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenFilter(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openFilter]);

  const tableRef = useRef<HTMLTableElement>(null);
  const headRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const resizing = useRef<{ key: string; startX: number; startW: number } | null>(null);

  const filterKind = (c: Column<T>): "text" | "range" | "select" | "none" =>
    c.filter ?? (c.numeric && c.sortValue ? "range" : c.filterText || c.sortValue ? "text" : "none");
  const colText = (c: Column<T>, r: T) => (c.filterText ? c.filterText(r) : c.sortValue ? String(c.sortValue(r)) : "");
  const distinctValues = (c: Column<T>) => [...new Set(rows.map((r) => colText(c, r)).filter((v) => v !== ""))].sort();
  const getFilter = (key: string) => colFilters[key] ?? EMPTY_FILTER;
  const isFilterActive = (c: Column<T>) => {
    const f = getFilter(c.key);
    const k = filterKind(c);
    return k === "range" ? f.min !== "" || f.max !== "" : k === "select" ? f.values.length > 0 : f.texts.length > 0;
  };
  const activeFilterCount = columns.filter(isFilterActive).length;
  const setFilter = (key: string, patch: Partial<ColFilter>) =>
    update({ filters: { ...colFilters, [key]: { ...getFilter(key), ...patch } }, page: 0 });
  const clearFilter = (key: string) => {
    const { [key]: _drop, ...rest } = colFilters;
    update({ filters: rest, page: 0 });
  };
  const clearAllFilters = () => update({ filters: {}, page: 0 });

  const filterLabel = (c: Column<T>) => {
    const f = getFilter(c.key);
    const head = typeof c.header === "string" ? c.header : c.key;
    if (filterKind(c) === "range") {
      const parts: string[] = [];
      if (f.min !== "") parts.push(`≥ ${f.min}`);
      if (f.max !== "") parts.push(`≤ ${f.max}`);
      return `${head}：${parts.join("、")}`;
    }
    const vals = filterKind(c) === "select" ? f.values : f.texts;
    const shown = vals.slice(0, 2).join("、");
    return `${head}：${shown}${vals.length > 2 ? ` 等 ${vals.length} 項` : ""}`;
  };

  // 篩選抽成可排除單欄的函式：faceted 鈕的逐值計數要對「除了自己以外的
  // 其餘篩選＋搜尋後」的列集合算——否則勾了一個值，其他選項的數字全部歸零。
  const applyFilters = (excludeKey?: string) => {
    const q = query.trim().toLowerCase();
    const active = columns.filter((c) => c.key !== excludeKey && isFilterActive(c));
    if (!q && active.length === 0) return rows;
    const rowText = (r: T) =>
      columns.map((c) => (c.filterText ? c.filterText(r) : !c.numeric && c.sortValue ? String(c.sortValue(r)) : "")).join(" ").toLowerCase();
    return rows.filter((r) => {
      if (q && !rowText(r).includes(q)) return false;
      for (const c of active) {
        const f = getFilter(c.key);
        const k = filterKind(c);
        if (k === "range") {
          const v = Number(c.sortValue?.(r));
          if (Number.isNaN(v)) return false;
          if (f.min !== "" && v < Number(f.min)) return false;
          if (f.max !== "" && v > Number(f.max)) return false;
        } else if (k === "select") {
          if (!f.values.includes(colText(c, r))) return false;
        } else {
          const t = colText(c, r).toLowerCase();
          // 同欄多筆條件＝符合任一即列出（OR）；跨欄＝全部都要符合（AND）
          if (!f.texts.some((term) => t.includes(term.toLowerCase()))) return false;
        }
      }
      return true;
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtered = useMemo(() => applyFilters(), [rows, query, columns, colFilters]);

  const accessors = useMemo(() => {
    const m: Record<string, (row: T) => number | string> = {};
    for (const c of columns) if (c.sortValue) m[c.key] = c.sortValue;
    return m;
  }, [columns]);
  const { sorted, toggle } = useSort(filtered, accessors, initialSort, "zh-Hant", {
    value: sort,
    onChange: (next) => update({ sort: next, page: 0 }),
  });

  const paged = sorted.length > size ? sorted.slice(page * size, page * size + size) : sorted;
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const showPager = sorted.length > size;

  // 頁碼越界（資料量縮小）回第 1 頁——與內部行為一致，受控時以 patch 通知宿主
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (page > pageCount - 1) update({ page: 0 }); }, [page, pageCount]);

  // ── 欄位顯示與多選 ──────────────────────────────────────────
  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.includes(c.key)),
    [columns, hiddenColumns],
  );
  const hasFreeze = visibleColumns.some((c) => c.freeze);

  const selectedSet = useMemo(() => new Set(selection), [selection]);
  const pageKeys = selectable ? paged.map((row, i) => getRowKey(row, i)) : [];
  const pageSelectedCount = pageKeys.filter((k) => selectedSet.has(k)).length;
  const allPageSelected = pageKeys.length > 0 && pageSelectedCount === pageKeys.length;
  const somePageSelected = pageSelectedCount > 0 && !allPageSelected;
  const togglePageSelection = () => {
    const next = new Set(selection);
    if (allPageSelected) pageKeys.forEach((k) => next.delete(k));
    else pageKeys.forEach((k) => next.add(k));
    update({ selection: [...next] });
  };
  const toggleRowSelection = (key: string) =>
    update({ selection: selectedSet.has(key) ? selection.filter((k) => k !== key) : [...selection, key] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedRows = useMemo(
    () => (selectable ? rows.filter((r, i) => selectedSet.has(getRowKey(r, i))) : []),
    [rows, selectedSet, selectable],
  );

  // ── 欄寬調整 ────────────────────────────────────────────────
  const onResizeMove = useCallback((e: PointerEvent) => {
    const r = resizing.current;
    if (!r) return;
    setColWidths((m) => ({ ...m, [r.key]: Math.max(48, r.startW + (e.clientX - r.startX)) }));
  }, []);
  const onResizeUp = useCallback(() => {
    resizing.current = null;
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeUp);
  }, [onResizeMove]);
  const startResize = (e: React.PointerEvent, key: string, ci: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = { key, startX: e.clientX, startW: colWidths[key] ?? headRefs.current[ci]?.offsetWidth ?? 120 };
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeUp);
  };
  const autoFit = (key: string) => setColWidths((m) => { const { [key]: _d, ...rest } = m; return rest; });
  useEffect(() => () => {
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeUp);
  }, [onResizeMove, onResizeUp]);

  const hasTotals = visibleColumns.some((c) => c.total);
  const showToolbar = searchable || toolbar || csv || activeFilterCount > 0 || facets.length > 0 || columnVisibility;

  const exportCsv = () => {
    if (!csv) return;
    saveBlob(new Blob([csvSerialize(csv.headers, sorted.map(csv.row))], { type: "text/csv;charset=utf-8" }), csv.fileName);
  };

  // 十字對準用「背景漸層圖層」而不是 background-color：漸層疊在儲存格既有底色之上，
  // 不會蓋掉凍結首欄／黏性表頭的不透明底（否則被指到的黏性格會透出後面捲過去的欄位）。
  const xline = "bg-gradient-to-r from-primary/[0.06] to-primary/[0.06]";
  const xcell = "bg-gradient-to-r from-primary/20 to-primary/20";

  const openFilterAt = (key: string, btn: HTMLElement) => {
    if (openFilter?.key === key) { setOpenFilter(null); return; }
    const r = btn.getBoundingClientRect();
    setOpenFilter({ key, top: r.bottom + 4, left: Math.max(8, Math.min(r.right - POP_W, window.innerWidth - POP_W - 8)) });
  };

  return (
    <div className="space-y-2">
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2 print-hidden">
          {searchable && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(e) => update({ query: e.target.value, page: 0 })}
                placeholder={searchPlaceholder ?? L.search}
                aria-label={searchPlaceholder ?? L.search}
                className="h-8 w-48 pl-7"
              />
            </div>
          )}
          {/* faceted 篩選鈕：與表頭篩選共用 colFilters——兩個入口、一個真相 */}
          {facets.map((facetKey) => {
            const c = columns.find((x) => x.key === facetKey);
            if (!c) return null;
            const f = getFilter(facetKey);
            const head = typeof c.header === "string" ? c.header : c.key;
            return (
              <Popover key={facetKey}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <Filter /> {head}
                    {f.values.length > 0 && (
                      <span className="rounded-sm bg-primary/10 px-1.5 text-xs tabular-nums text-primary">{f.values.length}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-2.5 text-sm">
                  {(() => {
                    // 逐值計數對「排除本欄的其餘篩選後」集合算（見 applyFilters 註解）
                    const base = applyFilters(facetKey);
                    const counts = new Map<string, number>();
                    for (const r of base) {
                      const v = colText(c, r);
                      if (v !== "") counts.set(v, (counts.get(v) ?? 0) + 1);
                    }
                    const all = distinctValues(c);
                    const toggleValue = (v: string) =>
                      setFilter(facetKey, { values: f.values.includes(v) ? f.values.filter((x) => x !== v) : [...f.values, v] });
                    return (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">{head}</p>
                        <div className="max-h-56 space-y-0.5 overflow-y-auto">
                          {all.map((v) => {
                            const on = f.values.includes(v);
                            return (
                              <button key={v} type="button" role="checkbox" aria-checked={on} onClick={() => toggleValue(v)} className="state-layer flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left text-xs">
                                <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-sm border", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                                  {on && <Check className="size-3" aria-hidden />}
                                </span>
                                <span className="min-w-0 flex-1 truncate">{v}</span>
                                <span className="tabular-nums text-muted-foreground">{counts.get(v) ?? 0}</span>
                              </button>
                            );
                          })}
                        </div>
                        {f.values.length > 0 && (
                          <button type="button" onClick={() => clearFilter(facetKey)} className="w-full rounded-sm border-t pt-1.5 text-center text-xs text-muted-foreground hover:underline">
                            {L.clear}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </PopoverContent>
              </Popover>
            );
          })}
          {toolbar}
          <div className="ml-auto flex items-center gap-2">
            {columnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm"><Columns3 /> {L.columnsButton}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{L.columnsTitle}</DropdownMenuLabel>
                  {columns.filter((c) => (c.hideable ?? true) && !c.freeze).map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.key}
                      checked={!hiddenColumns.includes(c.key)}
                      onCheckedChange={(v) =>
                        update({
                          hiddenColumns: v === true
                            ? hiddenColumns.filter((k) => k !== c.key)
                            : [...hiddenColumns, c.key],
                        })
                      }
                    >
                      {typeof c.header === "string" ? c.header : c.key}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {csv && <Button variant="outline" size="sm" onClick={exportCsv}><Download /> {L.exportCsv}</Button>}
          </div>
        </div>
      )}

      {/* 篩選條件列：每個值都是獨立標籤、可個別移除。只能「一次全清」會逼使用者從頭再篩一次。 */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 print-hidden">
          <span className="text-xs text-muted-foreground">{L.activeFilters}</span>
          {columns.filter(isFilterActive).flatMap((c) => {
            const f = getFilter(c.key);
            const head = typeof c.header === "string" ? c.header : c.key;
            const k = filterKind(c);
            if (k === "range") return [{ id: c.key, text: filterLabel(c), remove: () => clearFilter(c.key) }];
            const vals = k === "select" ? f.values : f.texts;
            return vals.map((v) => ({
              id: `${c.key}|${v}`,
              text: `${head}：${v}`,
              remove: () => setFilter(c.key, k === "select" ? { values: f.values.filter((x) => x !== v) } : { texts: f.texts.filter((x) => x !== v) }),
            }));
          }).map((chip) => (
            <span key={chip.id} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 py-0.5 pl-2.5 pr-1 text-xs text-primary">
              {chip.text}
              <button type="button" aria-label={L.remove(chip.text)} onClick={chip.remove} className="state-layer tap-target inline-flex items-center justify-center rounded-full p-0.5">
                <X className="size-3" aria-hidden />
              </button>
            </span>
          ))}
          {activeFilterCount > 1 && (
            <button type="button" onClick={clearAllFilters} className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline">
              {L.clearAll}
            </button>
          )}
        </div>
      )}

      {/* 載入的無障礙出口：狀態由容器宣告一次，骨架塊本身 aria-hidden */}
      {loading && (
        <p role="status" className="sr-only">
          {L.loading}
        </p>
      )}
      {loading && rows.length === 0 ? (
        // 首載骨架：表頭是真的（欄位已知），列是灰塊——版面不跳動。
        // 列數＝每頁筆數，上限 15：骨架超過一屏沒有意義。
        <Table zebra={false} maxHeight={maxHeight}>
          <TableHeader sticky={false}>
            <TableRow>
              {selectable && <TableHead className="w-10" />}
              {visibleColumns.map((c) => (
                <TableHead key={c.key} className={cn(c.numeric && "text-right")}>
                  <div className={cn("flex h-10 items-center px-2", c.numeric && "justify-end")}>{c.header}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody aria-hidden>
            {Array.from({ length: Math.min(size, 15) }, (_, r) => (
              <TableRow key={r}>
                {selectable && <TableCell className="w-10" />}
                {visibleColumns.map((c) => (
                  <TableCell key={c.key}>
                    <Skeleton className={cn("h-4", c.numeric ? "ml-auto w-16" : "w-4/5")} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : sorted.length === 0 ? (
        <EmptyState
          title={query || activeFilterCount > 0 ? L.noResultTitle : empty?.title ?? L.emptyTitle}
          hint={query || activeFilterCount > 0 ? L.noResultHint : empty?.hint}
          icon={empty?.icon}
          action={empty?.action}
          compact
        />
      ) : (
        // 已有資料的重新查詢：保留舊內容就地變暗（仍可讀）＋鎖互動，
        // 資料列再加骨架同一套脈動（表頭不動——呼應首載骨架「表頭是真的、列在閃」）。
        // 只變暗會跟唯讀／禁用混淆；脈動借骨架的動畫語彙說「正在工作」。
        // 不蓋骨架——資料換一批就閃一次骨架，比「看著舊資料等新的」糟得多。
        // motion-reduce 停動畫，變暗與 aria-busy 仍在，語意不靠動畫。
        <div aria-busy={loading || undefined} className={cn(loading && "pointer-events-none opacity-60 transition-opacity [&_tbody]:animate-pulse motion-reduce:[&_tbody]:animate-none")}>
        <Table ref={tableRef} zebra={zebra} maxHeight={maxHeight}>
          <TableHeader sticky={stickyHeader}>
            <TableRow onMouseLeave={() => crosshair && setCross(null)}>
              {selectable && (
                <TableHead className={cn("w-10 p-0", hasFreeze && freezeFirst)}>
                  <div className="flex h-10 items-center justify-center px-2">
                    <Checkbox
                      aria-label={L.selectAllPage}
                      checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                      onCheckedChange={togglePageSelection}
                    />
                  </div>
                </TableHead>
              )}
              {visibleColumns.map((c, ci) => {
                const kind = filterKind(c);
                const active = isFilterActive(c);
                const cw = colWidths[c.key];
                const isSorted = sort?.key === c.key;
                const SortIcon = !c.sortValue ? null : !isSorted ? ChevronsUpDown : sort!.dir === "desc" ? ChevronDown : ChevronUp;
                return (
                  <TableHead
                    key={c.key}
                    ref={(el) => { headRefs.current[ci] = el; }}
                    style={{
                      ...(cw ? { width: cw, maxWidth: cw } : {}),
                      // 有勾選欄時凍結欄讓出 2.5rem，兩個 sticky 欄才不會疊在一起
                      ...(c.freeze && selectable ? { left: "2.5rem" } : {}),
                    }}
                    aria-sort={isSorted ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("relative select-none p-0", c.freeze && freezeFirst, c.headerClassName, crosshair && cross?.c === ci && xline)}
                  >
                    <div className="flex h-10 items-center gap-1 px-2">
                      {c.sortValue ? (
                        <button type="button" onClick={() => toggle(c.key)} className={cn("inline-flex min-w-0 items-center gap-1 hover:text-foreground", isSorted && "text-foreground")}>
                          <span className="truncate">{c.header}</span>
                          {SortIcon && <SortIcon className={cn("size-3.5 shrink-0", !isSorted && "opacity-40")} aria-hidden />}
                        </button>
                      ) : (
                        <span className="min-w-0 truncate">{c.header}</span>
                      )}
                      {kind !== "none" && (
                        <button
                          type="button"
                          aria-label={L.filterOf(typeof c.header === "string" ? c.header : c.key)}
                          onClick={(e) => { e.stopPropagation(); openFilterAt(c.key, e.currentTarget); }}
                          className={cn(
                            "tap-target ml-auto inline-flex shrink-0 items-center justify-center rounded-sm p-0.5 transition-colors duration-fast",
                            active ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground",
                          )}
                        >
                          <Filter className="size-3" aria-hidden />
                        </button>
                      )}
                    </div>
                    {resizable && (
                      <div
                        onPointerDown={(e) => startResize(e, c.key, ci)}
                        onDoubleClick={() => autoFit(c.key)}
                        title={L.resizeHint}
                        // 全 repo 唯一保留 `hover:bg-*` 的地方，是刻意的例外：
                        // 這條 1.5px 的把手平常**完全透明**，hover 要做的是「讓一個看不見的
                        // 控制項現形」，不是「幫一塊既有表面加一階」。狀態層在這裡沒有東西可疊
                        // ——6% 的 currentColor 疊在透明條上等於還是看不見。
                        className="absolute right-0 top-0 z-20 h-full w-1.5 cursor-col-resize touch-none transition-colors duration-fast hover:bg-primary/40"
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((row, i) => (
              <TableRow
                key={getRowKey(row, i)}
                data-state={selectable && selectedSet.has(getRowKey(row, i)) ? "selected" : undefined}
                className={cn(rowClassName?.(row), onRowClick && "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(row); } } : undefined}
              >
                {selectable && (
                  <TableCell
                    className={cn("w-10 p-0", hasFreeze && freezeFirst, dense && "py-1")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center px-2">
                      <Checkbox
                        aria-label={L.selectRow(getRowKey(row, i))}
                        checked={selectedSet.has(getRowKey(row, i))}
                        onCheckedChange={() => toggleRowSelection(getRowKey(row, i))}
                      />
                    </div>
                  </TableCell>
                )}
                {visibleColumns.map((c, ci) => {
                  const cls = typeof c.cellClassName === "function" ? c.cellClassName(row) : c.cellClassName;
                  const inRow = crosshair && cross?.r === i;
                  const inCol = crosshair && cross?.c === ci;
                  const cw = colWidths[c.key];
                  const maxW = c.truncate ?? cw;
                  return (
                    <TableCell
                      key={c.key}
                      style={{
                        ...(maxW ? { width: cw, maxWidth: maxW } : {}),
                        ...(c.freeze && selectable ? { left: "2.5rem" } : {}),
                      }}
                      onMouseEnter={crosshair ? () => setCross({ r: i, c: ci }) : undefined}
                      onTouchStart={crosshair ? () => setCross({ r: i, c: ci }) : undefined}
                      className={cn(
                        c.numeric && "text-right tabular-nums",
                        c.freeze && cn(freezeFirst, "font-medium"),
                        dense && "py-1",
                        cw && "overflow-hidden",
                        cls,
                        (inRow || inCol) && xline,
                        inRow && inCol && xcell,
                      )}
                    >
                      {c.truncate ? (
                        <Tooltip content={c.filterText?.(row)} className="w-full" focusable>
                          <span className="block truncate">{c.cell(row)}</span>
                        </Tooltip>
                      ) : cw ? (
                        <div className="truncate">{c.cell(row)}</div>
                      ) : c.cell(row)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
          {hasTotals && (
            <TableFooter>
              <TableRow>
                {selectable && <TableCell className={cn("w-10", hasFreeze && freezeFirst)} />}
                {visibleColumns.map((c, i) => (
                  <TableCell
                    key={c.key}
                    style={c.freeze && selectable ? { left: "2.5rem" } : undefined}
                    className={cn(c.numeric && "text-right tabular-nums", c.freeze && freezeFirst)}
                  >
                    {c.total ? c.total(sorted) : i === 0 && !visibleColumns[0].total ? L.totalRow : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
        </div>
      )}

      {/* 篩選面板走 portal＋fixed：留在表格內會被水平捲動裁掉，或被凍結首欄蓋住。 */}
      {openFilter && createPortal(
        <>
          <div className="fixed inset-0 z-[55]" onClick={() => setOpenFilter(null)} aria-hidden />
          {(() => {
            const c = columns.find((x) => x.key === openFilter.key);
            if (!c) return null;
            const f = getFilter(c.key);
            const active = isFilterActive(c);
            return (
              <div
                style={{ position: "fixed", top: openFilter.top, left: openFilter.left, width: POP_W }}
                className="z-[60] rounded-md border bg-popover p-2.5 text-left text-sm text-popover-foreground shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {filterKind(c) === "range" ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">{L.rangeTitle}</p>
                    <div className="flex items-center gap-1.5">
                      <Input type="number" placeholder={L.rangeMin} aria-label={L.rangeMin} className="h-8 tabular-nums" value={f.min} onChange={(e) => setFilter(c.key, { min: e.target.value })} />
                      <span className="text-xs text-muted-foreground">～</span>
                      <Input type="number" placeholder={L.rangeMax} aria-label={L.rangeMax} className="h-8 tabular-nums" value={f.max} onChange={(e) => setFilter(c.key, { max: e.target.value })} />
                    </div>
                  </div>
                ) : filterKind(c) === "select" ? (
                  (() => {
                    const all = distinctValues(c);
                    const shown = all.filter((v) => v.toLowerCase().includes(selQuery.toLowerCase()));
                    const toggleValue = (v: string) =>
                      setFilter(c.key, { values: f.values.includes(v) ? f.values.filter((x) => x !== v) : [...f.values, v] });
                    return (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">{L.selectTitle}</p>
                        {all.length > 8 && <Input autoFocus placeholder={L.selectSearch} className="h-8" value={selQuery} onChange={(e) => setSelQuery(e.target.value)} />}
                        <div className="max-h-48 space-y-0.5 overflow-y-auto">
                          {shown.length === 0 && <p className="px-1 py-2 text-xs text-muted-foreground">{L.noMatchingValues}</p>}
                          {shown.map((v) => {
                            const on = f.values.includes(v);
                            return (
                              <button key={v} type="button" role="checkbox" aria-checked={on} onClick={() => toggleValue(v)} className="state-layer flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left text-xs">
                                <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-sm border", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                                  {on && <Check className="size-3" aria-hidden />}
                                </span>
                                <span className="truncate">{v}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <button type="button" className="hover:underline" onClick={() => setFilter(c.key, { values: all })}>{L.selectAll}</button>
                          <button type="button" className="hover:underline" onClick={() => setFilter(c.key, { values: [] })}>{L.selectNone}</button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  (() => {
                    const terms = f.texts;
                    const q = textInput.trim();
                    const add = (t: string) => {
                      const v = t.trim();
                      if (!v || terms.includes(v)) return;
                      setFilter(c.key, { texts: [...terms, v] });
                      setTextInput("");
                    };
                    // 推薦：該欄不重複值中與輸入最相似的前 3 項（起頭 > 包含 > 字元相近）。
                    // 使用者常常記得「大概長怎樣」但打不出完整字串，尤其是中文品名與代碼混排時。
                    const sim = (v: string) => {
                      const lv = v.toLowerCase();
                      const lq = q.toLowerCase();
                      if (!q) return 0.1;
                      if (lv.startsWith(lq)) return 1;
                      if (lv.includes(lq)) return 0.8;
                      const qs = new Set(lq);
                      let hit = 0;
                      qs.forEach((ch) => { if (lv.includes(ch)) hit++; });
                      return (hit / qs.size) * 0.5;
                    };
                    const sugg = distinctValues(c)
                      .filter((v) => !terms.includes(v))
                      .map((v) => ({ v, s: sim(v) }))
                      .filter((x) => (q === "" ? true : x.s >= 0.34))
                      .sort((a, b) => b.s - a.s || a.v.length - b.v.length)
                      .slice(0, 3)
                      .map((x) => x.v);
                    return (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">{L.textTitle}</p>
                        {terms.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {terms.map((t) => (
                              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                {t}
                                <button type="button" aria-label={L.remove(t)} onClick={() => setFilter(c.key, { texts: terms.filter((x) => x !== t) })} className="state-layer rounded-full">
                                  <X className="size-3" aria-hidden />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <Input
                          autoFocus
                          placeholder={L.textPlaceholder}
                          className="h-8"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(textInput); } }}
                        />
                        {sugg.length > 0 && (
                          <div className="space-y-0.5">
                            <p className="px-1 text-tiny text-muted-foreground">{L.suggestions}</p>
                            {sugg.map((v) => (
                              <button key={v} type="button" onClick={() => add(v)} className="state-layer flex w-full items-center gap-1.5 rounded-sm px-1.5 py-1 text-left text-xs">
                                <Plus className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                                <span className="truncate">{v}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
                <div className="mt-2 flex justify-between">
                  <Button variant="ghost" size="sm" className="h-7" disabled={!active} onClick={() => clearFilter(c.key)}>{L.clear}</Button>
                  <Button size="sm" className="h-7" onClick={() => {
                    if (filterKind(c) === "text" && textInput.trim() && !f.texts.includes(textInput.trim())) {
                      setFilter(c.key, { texts: [...f.texts, textInput.trim()] });
                    }
                    setOpenFilter(null);
                  }}>{L.done}</Button>
                </div>
              </div>
            );
          })()}
        </>,
        document.body,
      )}

      {/* 批次操作列：有選取才出現。sticky 在**容器內**置底——文件站內嵌時不能蓋到站台 UI。
          role=toolbar＋方向鍵在列內移動焦點（蒸餾 shadcn-admin bulk-actions）。 */}
      {selectable && bulkActions && selection.length > 0 && (
        <div
          role="toolbar"
          aria-label={L.selectedCount(selection.length)}
          onKeyDown={(e) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
            const items = Array.from(
              e.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"),
            );
            if (items.length === 0) return;
            e.preventDefault();
            const idx = items.indexOf(e.currentTarget.ownerDocument.activeElement as HTMLElement);
            const next =
              e.key === "Home" ? 0
              : e.key === "End" ? items.length - 1
              : e.key === "ArrowRight" ? (idx + 1 + items.length) % items.length
              : (idx - 1 + items.length) % items.length;
            items[next]?.focus();
          }}
          className="sticky bottom-2 z-30 mx-auto flex w-fit flex-wrap items-center gap-2 rounded-lg border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg print-hidden"
        >
          <span aria-live="polite" className="tabular-nums text-muted-foreground">{L.selectedCount(selection.length)}</span>
          <span className="h-4 w-px bg-border" aria-hidden />
          {bulkActions({ selected: selectedRows, clear: () => update({ selection: [] }) })}
          <span className="h-4 w-px bg-border" aria-hidden />
          <Button variant="ghost" size="sm" className="h-7" onClick={() => update({ selection: [] })}>
            {L.clearSelection}
          </Button>
        </div>
      )}

      {showPager && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground print-hidden">
          <span>{L.rowsRange(page * size + 1, Math.min((page + 1) * size, sorted.length), sorted.length)}</span>
          <div className="flex items-center gap-2">
            <Select value={String(size)} onValueChange={(v) => update({ pageSize: Number(v), page: 0 })}>
              <SelectTrigger className="h-7 w-24" aria-label={L.perPageLabel}><SelectValue /></SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => <SelectItem key={n} value={String(n)}>{L.perPage(n)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="tap-target h-7" disabled={page === 0} onClick={() => update({ page: Math.max(0, page - 1) })}>
              <ChevronLeft /> {L.prev}
            </Button>
            <span>{page + 1} / {pageCount}</span>
            <Button variant="outline" size="sm" className="tap-target h-7" disabled={page >= pageCount - 1} onClick={() => update({ page: Math.min(pageCount - 1, page + 1) })}>
              {L.next} <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
