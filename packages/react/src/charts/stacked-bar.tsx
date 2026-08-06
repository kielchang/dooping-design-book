import { cn } from "../lib/utils";
import { type Segment, type ValueFmt, defaultFmt, ChartDataTable, ChartEmpty } from "./base";

export interface StackedBarRow {
  label: string;
  segments: Segment[];
}

export interface StackedBarProps {
  rows: StackedBarRow[];
  title?: string;
  valueFmt?: ValueFmt;
  onSelectRow?: (index: number, row: StackedBarRow) => void;
  selectedRow?: number;
  /** 單列高度（px）。 */
  height?: number;
  className?: string;
}

/**
 * 水平堆疊長條：看一個總量由哪些部分構成，同時比較多個總量。
 *
 * 每列右側**固定顯示總量**——堆疊圖最常被問的就是「所以總共多少」，
 * 人沒辦法用眼睛把幾個色塊加起來。
 *
 * 分段顏色由宿主指定（`Segment.color`）：序列色要**跨期穩定**、跟實體走，
 * 元件沒有那個知識，猜了只會猜錯。
 *
 * 無障礙：數值已在鄰近可見文字（列標籤＋合計），圖形部分 `aria-hidden`，
 * 分段明細由資料表提供——避免同一份資料被報讀器唸兩次。
 */
export function StackedBar({
  rows,
  title = "堆疊長條",
  valueFmt = defaultFmt,
  onSelectRow,
  selectedRow,
  height = 22,
  className,
}: StackedBarProps) {
  if (rows.length === 0) return <ChartEmpty />;
  const totals = rows.map((r) => r.segments.reduce((s, x) => s + x.value, 0));
  const max = Math.max(1, ...totals);
  const segNames = [...new Set(rows.flatMap((r) => r.segments.map((s) => s.label)))];

  return (
    <div className={className}>
      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const dim = selectedRow != null && selectedRow !== i;
          return (
            <div
              key={r.label}
              className={cn("flex items-center gap-2", onSelectRow && "cursor-pointer", dim && "opacity-50")}
              onClick={onSelectRow ? () => onSelectRow(i, r) : undefined}
            >
              <span className="w-24 shrink-0 truncate text-xs">{r.label}</span>
              <div aria-hidden className="flex h-full flex-1 overflow-hidden rounded-sm" style={{ height }}>
                {r.segments.map((s) => (
                  <div
                    key={s.label}
                    title={`${s.label}：${valueFmt(s.value)}`}
                    style={{ width: `${(s.value / max) * 100}%`, backgroundColor: s.color }}
                  />
                ))}
              </div>
              <span className="w-20 shrink-0 text-right text-xs tabular-nums">{valueFmt(totals[i])}</span>
            </div>
          );
        })}
      </div>
      <ChartDataTable
        caption={`${title}（各列分段明細）`}
        head={["項目", ...segNames, "合計"]}
        rows={rows.map((r, i) => [
          r.label,
          ...segNames.map((n) => {
            const seg = r.segments.find((s) => s.label === n);
            return seg ? valueFmt(seg.value) : "—";
          }),
          valueFmt(totals[i]),
        ])}
        onSelect={onSelectRow ? (i) => onSelectRow(i, rows[i]) : undefined}
        selectedIndex={selectedRow}
      />
    </div>
  );
}
