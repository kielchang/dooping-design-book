import { cn } from "../lib/utils";
import {
  type BarDatum,
  type ValueFmt,
  PALETTE,
  defaultFmt,
  ChartDataTable,
  ChartEmpty,
} from "./base";

export interface TrendChartProps {
  /** `label` 當 x 軸刻度——x 軸必須是**等距的時間**（每月、每週）。 */
  data: BarDatum[];
  title?: string;
  /**
   * Y 軸是否從 0 起算，預設 **true**。
   * 金額、數量這類絕對量一律從 0 起算——才不會把 2% 的波動畫成懸崖。
   * 只有看「相對變化」時才關；關掉時兩端數值仍會標示，那是誠實的底線。
   */
  zeroBased?: boolean;
  valueFmt?: ValueFmt;
  onSelect?: (index: number, datum: BarDatum) => void;
  selectedIndex?: number;
  color?: string;
  height?: number;
  className?: string;
}

/**
 * 趨勢折線：同一個量隨時間怎麼變。
 * 單一資料點沒有趨勢可言——只畫該點並置中，不畫線。
 */
export function TrendChart({
  data,
  title = "趨勢折線",
  zeroBased = true,
  valueFmt = defaultFmt,
  onSelect,
  selectedIndex,
  color = PALETTE[0],
  height = 180,
  className,
}: TrendChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  const slot = 64;
  const pad = { top: 18, bottom: 20 };
  const plotH = height - pad.top - pad.bottom;
  const W = Math.max(1, data.length) * slot;

  const lo = zeroBased ? 0 : Math.min(...data.map((d) => d.value));
  const hi = Math.max(zeroBased ? 1 : lo + 1, ...data.map((d) => d.value));
  const X = (i: number) => i * slot + slot / 2;
  const Y = (v: number) => pad.top + (1 - (v - lo) / (hi - lo)) * plotH;

  const first = data[0];
  const last = data[data.length - 1];

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        role="img"
        aria-label={`${title}，${data.length} 期，${first.label} ${valueFmt(first.value)} 到 ${last.label} ${valueFmt(last.value)}`}
        viewBox={`0 0 ${W} ${height}`}
        width={W}
        height={height}
        className="block"
      >
        <line x1={0} y1={height - pad.bottom} x2={W} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        {data.length > 1 && (
          <polyline
            points={data.map((d, i) => `${X(i)},${Y(d.value)}`).join(" ")}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />
        )}
        {data.map((d, i) => {
          const sel = selectedIndex === i;
          // 端點值永遠標示：zeroBased 關掉時它是誠實的底線，開著時也是最常被問的兩個數字
          const endpoint = i === 0 || i === data.length - 1;
          return (
            <g
              key={d.id ?? d.label}
              onClick={onSelect ? () => onSelect(i, d) : undefined}
              className={cn(onSelect && "cursor-pointer")}
            >
              <title>{`${d.label}：${valueFmt(d.value)}`}</title>
              <circle cx={X(i)} cy={Y(d.value)} r={sel ? 5 : 3.5} fill={color} />
              {endpoint && (
                <text x={X(i)} y={Y(d.value) - 8} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
                  {valueFmt(d.value)}
                </text>
              )}
              <text x={X(i)} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ChartDataTable
        caption={`${title}（各期數值）`}
        head={["期別標籤", "數值"]}
        rows={data.map((d) => [d.label, valueFmt(d.value)])}
        onSelect={onSelect ? (i) => onSelect(i, data[i]) : undefined}
        selectedIndex={selectedIndex}
      />
    </div>
  );
}
