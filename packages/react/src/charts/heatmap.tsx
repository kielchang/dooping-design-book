import { cn } from "../lib/utils";
import { type ValueFmt, PALETTE, defaultFmt, ChartEmpty } from "./base";

export interface HeatmapProps {
  rowLabels: string[];
  colLabels: string[];
  /** 列 × 欄。**`null` 代表無資料，不是 0**——沒有發生和數值為零是兩件事。 */
  cells: (number | null)[][];
  title?: string;
  /**
   * 色階值域。不給就依當期資料自動取 min/max。
   * **跨期比較時務必手動指定**：多張並排的熱圖各自用自動值域，
   * 每張的「最深」代表不同的數字，並排比較就是錯的——而且錯得看不出來。
   */
  domain?: [number, number];
  fmt?: ValueFmt;
  /** 色階圖例（預設開）。 */
  legend?: boolean;
  onSelect?: (row: number, col: number, value: number | null) => void;
  className?: string;
}

/**
 * 熱圖：兩個維度交叉之後，值集中在哪裡。格子數 100 以內——
 * 人沒辦法在 2500 格裡找出模式，那需要排序後的清單或 Pareto。
 *
 * 無障礙：熱圖**本來就是真表格**——數值是可見文字、顏色只是輔助。
 * 不另附 sr-only 表格，把表格語意補正即可（caption／scope／列標頭）。
 */
export function Heatmap({
  rowLabels,
  colLabels,
  cells,
  title = "熱圖",
  domain,
  fmt = defaultFmt,
  legend = true,
  onSelect,
  className,
}: HeatmapProps) {
  const flat = cells.flat().filter((v): v is number => v != null);
  if (rowLabels.length === 0 || flat.length === 0) return <ChartEmpty />;

  let [lo, hi] = domain ?? [Math.min(...flat), Math.max(...flat)];
  // 值全部相同時把值域撐開，避免整張同色——若「全部一樣」在業務上有意義，用文字說明
  if (lo === hi) [lo, hi] = [lo - 1, hi + 1];

  // 染色量壓在 8%–78%：上限保住深色格上的文字對比，下限讓最小值仍看得出「有值」
  const tint = (v: number) => 8 + ((v - lo) / (hi - lo)) * 70;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="border-collapse text-xs">
        <caption className="p-1 text-left font-medium">{title}</caption>
        <thead>
          <tr>
            <td />
            {colLabels.map((c) => (
              <th key={c} scope="col" className="px-2 py-1 text-center font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((r, ri) => (
            <tr key={r}>
              <th scope="row" className="pr-2 text-left font-medium">
                {r}
              </th>
              {colLabels.map((_, ci) => {
                const v = cells[ri]?.[ci] ?? null;
                return (
                  <td
                    key={ci}
                    onClick={onSelect ? () => onSelect(ri, ci, v) : undefined}
                    className={cn(
                      "min-w-14 border border-background px-2 py-1.5 text-center tabular-nums",
                      onSelect && "cursor-pointer",
                      v == null && "bg-muted text-muted-foreground",
                    )}
                    style={
                      v == null
                        ? undefined
                        : { backgroundColor: `color-mix(in srgb, ${PALETTE[0]} ${tint(v)}%, transparent)` }
                    }
                  >
                    {v == null ? "—" : fmt(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {legend && (
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            aria-hidden
            className="inline-block h-2.5 w-16 rounded-sm"
            style={{
              background: `linear-gradient(to right, color-mix(in srgb, ${PALETTE[0]} 8%, transparent), color-mix(in srgb, ${PALETTE[0]} 78%, transparent))`,
            }}
          />
          淺 {fmt(lo)} → 深 {fmt(hi)}；灰＝無資料
        </p>
      )}
    </div>
  );
}
