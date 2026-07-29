import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, freezeFirst,
} from "./table";
import { EmptyState } from "./empty-state";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Tooltip } from "./tooltip";
import { useSort, type SortState } from "../lib/use-sort";
import { csvSerialize } from "../lib/csv";
import { saveBlob } from "../lib/download";
import { cn } from "../lib/utils";
import {
  Search, Download, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, Filter, X, Check, Plus,
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
};

export interface DataTableLabels {
  search: string;
  exportCsv: string;
  filterOf: (header: string) => string;
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
  rowsRange: (from: number, to: number, total: number) => string;
  perPage: (n: number) => string;
  prev: string;
  next: string;
  totalRow: string;
  resizeHint: string;
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
  rowsRange: (f, t, n) => `第 ${f}–${t} ／ 共 ${n} 筆`,
  perPage: (n) => `每頁 ${n}`,
  prev: "上一頁",
  next: "下一頁",
  totalRow: "合計",
  resizeHint: "拖曳調整欄寬，雙擊自適應內容",
};

type ColFilter = { texts: string[]; min: string; max: string; values: string[] };
const EMPTY_FILTER: ColFilter = { texts: [], min: "", max: "", values: [] };
const POP_W = 224;

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
  /** 工具列額外元素（期間選擇器、其他按鈕…），置於搜尋列右側 */
  toolbar?: ReactNode;
  /** 提供則顯示「匯出 CSV」按鈕，匯出**目前篩選排序後**的資料 */
  csv?: { headers: string[]; row: (row: T) => (string | number)[]; fileName: string };
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  labels?: Partial<DataTableLabels>;
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
  empty, toolbar, csv, rowClassName, onRowClick, labels: labelOverrides,
}: DataTableProps<T>) {
  const L = { ...DEFAULT_DATA_TABLE_LABELS, ...labelOverrides };
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(pageSize);
  const [page, setPage] = useState(0);
  const [cross, setCross] = useState<{ r: number; c: number } | null>(null);
  const [colFilters, setColFilters] = useState<Record<string, ColFilter>>({});
  const [openFilter, setOpenFilter] = useState<{ key: string; top: number; left: number } | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [selQuery, setSelQuery] = useState("");
  const [textInput, setTextInput] = useState("");
  useEffect(() => { setSelQuery(""); setTextInput(""); }, [openFilter?.key]);

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
    setColFilters((m) => ({ ...m, [key]: { ...getFilter(key), ...patch } }));
  const clearFilter = (key: string) => setColFilters((m) => { const { [key]: _drop, ...rest } = m; return rest; });
  const clearAllFilters = () => setColFilters({});

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = columns.filter(isFilterActive);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, columns, colFilters]);

  const accessors = useMemo(() => {
    const m: Record<string, (row: T) => number | string> = {};
    for (const c of columns) if (c.sortValue) m[c.key] = c.sortValue;
    return m;
  }, [columns]);
  const { sorted, sort, toggle } = useSort(filtered, accessors, initialSort);

  const paged = sorted.length > size ? sorted.slice(page * size, page * size + size) : sorted;
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const showPager = sorted.length > size;

  useEffect(() => { setPage(0); }, [query, size, sort, colFilters]);
  useEffect(() => { if (page > pageCount - 1) setPage(0); }, [page, pageCount]);

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

  const hasTotals = columns.some((c) => c.total);
  const showToolbar = searchable || toolbar || csv || activeFilterCount > 0;

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
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder ?? L.search}
                aria-label={searchPlaceholder ?? L.search}
                className="h-8 w-48 pl-7"
              />
            </div>
          )}
          {toolbar}
          <div className="ml-auto flex items-center gap-2">
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

      {sorted.length === 0 ? (
        <EmptyState
          title={query || activeFilterCount > 0 ? L.noResultTitle : empty?.title ?? L.emptyTitle}
          hint={query || activeFilterCount > 0 ? L.noResultHint : empty?.hint}
          icon={empty?.icon}
          action={empty?.action}
          compact
        />
      ) : (
        <Table ref={tableRef} zebra={zebra} maxHeight={maxHeight}>
          <TableHeader sticky={stickyHeader}>
            <TableRow onMouseLeave={() => crosshair && setCross(null)}>
              {columns.map((c, ci) => {
                const kind = filterKind(c);
                const active = isFilterActive(c);
                const cw = colWidths[c.key];
                const isSorted = sort?.key === c.key;
                const SortIcon = !c.sortValue ? null : !isSorted ? ChevronsUpDown : sort!.dir === "desc" ? ChevronDown : ChevronUp;
                return (
                  <TableHead
                    key={c.key}
                    ref={(el) => { headRefs.current[ci] = el; }}
                    style={cw ? { width: cw, maxWidth: cw } : undefined}
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
                            "tap-target ml-auto inline-flex shrink-0 items-center justify-center rounded p-0.5 transition-colors duration-fast",
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
                className={cn(rowClassName?.(row), onRowClick && "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(row); } } : undefined}
              >
                {columns.map((c, ci) => {
                  const cls = typeof c.cellClassName === "function" ? c.cellClassName(row) : c.cellClassName;
                  const inRow = crosshair && cross?.r === i;
                  const inCol = crosshair && cross?.c === ci;
                  const cw = colWidths[c.key];
                  const maxW = c.truncate ?? cw;
                  return (
                    <TableCell
                      key={c.key}
                      style={maxW ? { width: cw, maxWidth: maxW } : undefined}
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
                {columns.map((c, i) => (
                  <TableCell key={c.key} className={cn(c.numeric && "text-right tabular-nums", c.freeze && freezeFirst)}>
                    {c.total ? c.total(sorted) : i === 0 && !columns[0].total ? L.totalRow : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
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
                              <button key={v} type="button" role="checkbox" aria-checked={on} onClick={() => toggleValue(v)} className="state-layer flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-xs">
                                <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
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
                              <button key={v} type="button" onClick={() => add(v)} className="state-layer flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs">
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

      {showPager && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground print-hidden">
          <span>{L.rowsRange(page * size + 1, Math.min((page + 1) * size, sorted.length), sorted.length)}</span>
          <div className="flex items-center gap-2">
            <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
              <SelectTrigger className="h-7 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => <SelectItem key={n} value={String(n)}>{L.perPage(n)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="tap-target h-7" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft /> {L.prev}
            </Button>
            <span>{page + 1} / {pageCount}</span>
            <Button variant="outline" size="sm" className="tap-target h-7" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
              {L.next} <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
