import { cn } from "../lib/utils";
import {
  type Point,
  type ValueFmt,
  PALETTE,
  defaultFmt,
  ChartDataTable,
  ChartEmpty,
} from "./base";

export interface ScatterProps {
  points: Point[];
  title?: string;
  /** 兩軸各是什麼。不標的話整張圖無從得知——視同必填。 */
  xLabel: string;
  yLabel: string;
  valueFmt?: ValueFmt;
  onSelect?: (index: number, point: Point) => void;
  selectedIndex?: number;
  color?: string;
  height?: number;
  className?: string;
}

/**
 * 散布圖：兩個數值之間有沒有關係。點數 20–300 才有意義——
 * 少於 10 個點看不出關係卻容易讓人腦補出一條線，上千個點請先在資料層彙總。
 *
 * 軸範圍取自資料的 min/max（**不從 0 起算**）：散布圖看的是分散形狀，不是絕對大小。
 */
export function Scatter({
  points,
  title = "散布圖",
  xLabel,
  yLabel,
  valueFmt = defaultFmt,
  onSelect,
  selectedIndex,
  color = PALETTE[0],
  height = 220,
  className,
}: ScatterProps) {
  if (points.length === 0) return <ChartEmpty />;

  const W = 320;
  const pad = { top: 10, right: 10, bottom: 28, left: 10 };
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const X = (x: number) => pad.left + ((x - x0) / Math.max(1e-9, x1 - x0)) * (W - pad.left - pad.right);
  const Y = (y: number) => pad.top + (1 - (y - y0) / Math.max(1e-9, y1 - y0)) * (height - pad.top - pad.bottom);

  return (
    <div className={className}>
      <svg
        role="img"
        aria-label={`${title}，${points.length} 個點，橫軸 ${xLabel}、縱軸 ${yLabel}`}
        viewBox={`0 0 ${W} ${height}`}
        className="block w-full"
        style={{ maxWidth: W }}
      >
        <line x1={pad.left} y1={height - pad.bottom} x2={W - pad.right} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        {points.map((p, i) => {
          const dim = selectedIndex != null && selectedIndex !== i;
          return (
            <circle
              key={p.id ?? i}
              cx={X(p.x)}
              cy={Y(p.y)}
              r={selectedIndex === i ? 5.5 : 4}
              fill={color}
              opacity={dim ? 0.3 : 0.8}
              onClick={onSelect ? () => onSelect(i, p) : undefined}
              className={cn(onSelect && "cursor-pointer")}
            >
              <title>{`${p.label ?? `第 ${i + 1} 點`}：${xLabel} ${valueFmt(p.x)}、${yLabel} ${valueFmt(p.y)}`}</title>
            </circle>
          );
        })}
        <text x={(W + pad.left) / 2} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
          {xLabel} →
        </text>
        <text
          x={pad.left + 4}
          y={pad.top + 2}
          fontSize={10}
          fill="var(--chart-text)"
        >
          ↑ {yLabel}
        </text>
      </svg>
      <ChartDataTable
        caption={`${title}（各點座標）`}
        head={["點", xLabel, yLabel]}
        rows={points.map((p, i) => [p.label ?? `第 ${i + 1} 點`, valueFmt(p.x), valueFmt(p.y)])}
        onSelect={onSelect ? (i) => onSelect(i, points[i]) : undefined}
        selectedIndex={selectedIndex}
      />
    </div>
  );
}
