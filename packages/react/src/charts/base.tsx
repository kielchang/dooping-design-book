import type { ReactNode } from "react";
import { cn, formatNumber } from "../lib/utils";

// 圖表家族的共同底座：型別、色票取用、彙總工具、文字／鍵盤等價表。
//
// 這一組是「後台閱讀型」圖表（見文件〈Charts 圖表〉的邊界）：
// 零相依、資料點百位數以內、只有 hover 提示與 onSelect 鑽取。
// 縮放、刷選、圖內鑽取刻意不做——需要分析型互動請用成熟圖表庫。

/** 單序列資料點（BarChart／Pareto／TrendChart）。 */
export type BarDatum = { label: string; value: number; id?: string };
/** 堆疊分段（StackedBar）。顏色由宿主指定——序列色要跨期穩定，元件不猜。 */
export type Segment = { label: string; value: number; color: string };
/** 座標點（Scatter／LineChart）。 */
export type Point = { x: number; y: number; label?: string; id?: string };

/**
 * 分類色票。`PALETTE[n]` 只代表「這是哪一類」——類別身分，沒有好壞。
 * 值是 CSS 變數引用：換色票、切深淺模式都由 token 層決定，這裡永遠不需要動。
 * 順序即安全順序（相鄰取用永遠是近似最佳的 k 色子集），所以不要重排、不要循環。
 */
export const PALETTE = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);

/**
 * 類別數封頂：取值最大的 `max - 1` 名（維持原本相對順序），其餘彙總成「其他（N 項）」。
 *
 * 不循環取色的配套——第 9 類拿到跟第 1 類一樣的顏色，圖例會出現兩個同色不同名的項目。
 */
export function capItems(data: BarDatum[], max: number): BarDatum[] {
  if (data.length <= max) return data;
  const keep = new Set(
    [...data].sort((a, b) => b.value - a.value).slice(0, max - 1),
  );
  const kept = data.filter((d) => keep.has(d));
  const rest = data.filter((d) => !keep.has(d));
  return [
    ...kept,
    { label: `其他（${rest.length} 項）`, value: rest.reduce((s, d) => s + d.value, 0) },
  ];
}

export type ValueFmt = (n: number) => string;
export const defaultFmt: ValueFmt = (n) => formatNumber(n);

/**
 * 文字等價 ＋ 鍵盤等價，一張表兩個職責（見〈Charts 圖表〉的無障礙一節與
 * 無障礙四原則的「文字等價用表格」）：
 *
 * - **報讀器**：圖形掛 `role="img"` 後子樹被隱藏，精確數值由這張表補回
 *   （`<caption>` ＋ `scope`，報讀器有專門的表格瀏覽指令）。
 * - **鍵盤**：hover 提示與點擊鑽取對鍵盤使用者不可達——這張表兼任操作介面，
 *   有 `onSelect` 時每一列是一顆真按鈕。表平常 `sr-only`，**鍵盤焦點進入時現形**
 *   （同 skip-link 的慣例），明眼的鍵盤使用者才不會把焦點丟進看不見的地方。
 */
export function ChartDataTable({
  caption,
  head,
  rows,
  onSelect,
  selectedIndex,
  className,
}: {
  /** 表格標題＝這張圖在講什麼。報讀器靠它定位，所以必填。 */
  caption: string;
  head: string[];
  /** 每列＝[label, ...值們]（已格式化成字串）。 */
  rows: string[][];
  onSelect?: (index: number) => void;
  selectedIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sr-only focus-within:not-sr-only focus-within:mt-2 focus-within:block",
        className,
      )}
    >
      <table className="w-full border-collapse rounded-md border text-xs">
        <caption className="p-1 text-left font-medium">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="border-b px-2 py-1 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className={cn(selectedIndex === i && "bg-muted")}>
              <th scope="row" className="px-2 py-1 text-left font-normal">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-pressed={selectedIndex === i}
                    className="underline decoration-dotted underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {cells[0]}
                  </button>
                ) : (
                  cells[0]
                )}
              </th>
              {cells.slice(1).map((c, j) => (
                <td key={j} className="px-2 py-1 tabular-nums">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 空資料的統一出口：一行「無資料」，不畫空白座標軸（見文件〈空資料、單點、全零〉）。 */
export function ChartEmpty({ children }: { children?: ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      {children ?? "無資料"}
    </p>
  );
}
