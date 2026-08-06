import { cn } from "../lib/utils";
import {
  type BarDatum,
  type ValueFmt,
  PALETTE,
  capItems,
  defaultFmt,
  ChartDataTable,
  ChartEmpty,
} from "./base";

export interface ParetoProps {
  /** 元件內部自行由大到小排序，宿主不必先排。 */
  data: BarDatum[];
  title?: string;
  maxItems?: number;
  valueFmt?: ValueFmt;
  onSelect?: (index: number, datum: BarDatum) => void;
  selectedIndex?: number;
  height?: number;
  className?: string;
}

/**
 * 柏拉圖：長條由大到小 ＋ 累積百分比折線。回答「前幾項就佔掉多少」。
 *
 * 累積線是本組唯一的「雙軸」——它是柏拉圖的定義，不是為了省一張圖疊上去的。
 * 即使如此也不畫第二條 Y 軸刻度，累積值只在提示與資料表裡以百分比呈現。
 *
 * 單一顏色是刻意的例外：整張圖的語意就是排序，分類配色反而添亂。
 */
export function Pareto({
  data,
  title = "柏拉圖",
  maxItems = 12,
  valueFmt = defaultFmt,
  onSelect,
  selectedIndex,
  height = 180,
  className,
}: ParetoProps) {
  if (data.length === 0) return <ChartEmpty />;
  const sorted = capItems([...data].sort((a, b) => b.value - a.value), maxItems);
  const total = Math.max(1, sorted.reduce((s, d) => s + d.value, 0));
  const max = Math.max(1, ...sorted.map((d) => d.value));

  const slot = 56;
  const pad = { top: 10, bottom: 20 };
  const plotH = height - pad.top - pad.bottom;
  const W = sorted.length * slot;

  let acc = 0;
  const cum = sorted.map((d) => (acc += d.value) / total);
  const lineX = (i: number) => i * slot + 10 + (slot - 20) / 2;
  const lineY = (c: number) => pad.top + (1 - c) * plotH;
  const cutoff = cum.findIndex((c) => c >= 0.8);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        role="img"
        aria-label={`${title}，共 ${sorted.length} 項，前 ${cutoff + 1} 項累積佔 ${Math.round(cum[Math.max(cutoff, 0)] * 100)}%`}
        viewBox={`0 0 ${W} ${height}`}
        width={W}
        height={height}
        className="block"
      >
        <line x1={0} y1={height - pad.bottom} x2={W} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        {sorted.map((d, i) => {
          const h = (d.value / max) * plotH;
          const x = i * slot + 10;
          const dim = selectedIndex != null && selectedIndex !== i;
          return (
            <g
              key={d.id ?? d.label}
              onClick={onSelect ? () => onSelect(i, d) : undefined}
              className={cn(onSelect && "cursor-pointer")}
            >
              <title>{`${d.label}：${valueFmt(d.value)}（累積 ${Math.round(cum[i] * 100)}%）`}</title>
              <rect
                x={x}
                y={height - pad.bottom - h}
                width={slot - 20}
                height={h}
                fill={PALETTE[0]}
                opacity={dim ? 0.35 : 1}
              />
              <text x={x + (slot - 20) / 2} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
                {d.label}
              </text>
            </g>
          );
        })}
        <polyline
          points={cum.map((c, i) => `${lineX(i)},${lineY(c)}`).join(" ")}
          fill="none"
          stroke="var(--chart-text)"
          strokeWidth={1.5}
        />
        {cum.map((c, i) => (
          <circle key={i} cx={lineX(i)} cy={lineY(c)} r={2.5} fill="var(--chart-text)" />
        ))}
      </svg>
      <ChartDataTable
        caption={`${title}（資料表，含累積佔比）`}
        head={["項目", "數值", "累積"]}
        rows={sorted.map((d, i) => [d.label, valueFmt(d.value), `${Math.round(cum[i] * 100)}%`])}
        onSelect={onSelect ? (i) => onSelect(i, sorted[i]) : undefined}
        selectedIndex={selectedIndex}
      />
    </div>
  );
}
