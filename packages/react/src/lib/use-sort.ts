import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";
export type SortState = { key: string; dir: SortDir } | null;

/**
 * 表格排序狀態。點欄頭循環：**無 → 由大到小 → 由小到大 → 無**。
 *
 * 為什麼第一下是「由大到小」：後台表格點欄頭的第一意圖幾乎都是「誰最多／最嚴重」。
 * 為什麼要有「無」這一態：使用者需要回到原始（通常是有意義的）排序，否則資料順序一去不回。
 *
 * @param accessors 欄位 key → 取值器（數字或字串）。字串以 `localeCompare` 比較，
 *                  預設 locale 交由呼叫端指定（中文字典序與英文不同）。
 */
export function useSort<T>(
  rows: T[],
  accessors: Record<string, (row: T) => number | string>,
  initial: SortState = null,
  locale = "zh-Hant",
  /**
   * 受控模式（可選、非破壞性）：給了 `value` 排序就由呼叫端管理（`null` 也算給了），
   * `toggle` 只透過 `onChange` 通知。DataTable 的網址同步用這條路。
   */
  controlled?: { value?: SortState; onChange?: (next: SortState) => void },
) {
  const [sortState, setSortState] = useState<SortState>(initial);
  const isControlled = controlled !== undefined && controlled.value !== undefined;
  const sort = isControlled ? (controlled.value as SortState) : sortState;

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const acc = accessors[sort.key];
    if (!acc) return rows;
    return [...rows].sort((a, b) => {
      const va = acc(a);
      const vb = acc(b);
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), locale);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort, accessors, locale]);

  const toggle = (key: string) => {
    const next: SortState =
      sort && sort.key === key ? (sort.dir === "desc" ? { key, dir: "asc" } : null) : { key, dir: "desc" };
    if (!isControlled) setSortState(next);
    controlled?.onChange?.(next);
  };

  return { sorted, sort, toggle };
}
