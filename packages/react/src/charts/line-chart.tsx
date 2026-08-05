import { type Point, PALETTE, ChartDataTable, ChartEmpty } from "./base";

export interface LineChartProps {
  /** 累積分布曲線的點，**x 與 y 都必須先正規化到 0–1**。 */
  points: Point[];
  title?: string;
  /** 對角基準線（完全平均分布），預設開。曲線離對角線越遠＝越集中。 */
  diagonal?: boolean;
  height?: number;
  className?: string;
}

/**
 * 累積分布折線：配對角基準線看「離平均分布差多遠」。
 * 例：前 20% 的對象貢獻了多少總量。
 *
 * 對角線是這張圖的全部意義所在——沒有基準線，這條曲線讀不出任何東西。
 * 時間序列不要用這支（那是 TrendChart）：這裡兩軸都是 0–1 的比例，語意不同。
 */
export function LineChart({
  points,
  title = "累積分布",
  diagonal = true,
  height = 220,
  className,
}: LineChartProps) {
  if (points.length === 0) return <ChartEmpty />;

  const W = 240;
  const pad = 12;
  const X = (x: number) => pad + x * (W - pad * 2);
  const Y = (y: number) => pad + (1 - y) * (height - pad * 2);
  const sorted = [...points].sort((a, b) => a.x - b.x);
  // 摘要取最接近 x=0.2 的點：「前 20% 佔多少」是這張圖被畫出來的原因
  const at20 = sorted.reduce((a, b) => (Math.abs(b.x - 0.2) < Math.abs(a.x - 0.2) ? b : a), sorted[0]);

  return (
    <div className={className}>
      <svg
        role="img"
        aria-label={`${title}，前 ${Math.round(at20.x * 100)}% 累積約 ${Math.round(at20.y * 100)}%`}
        viewBox={`0 0 ${W} ${height}`}
        className="block w-full"
        style={{ maxWidth: W }}
      >
        <line x1={pad} y1={height - pad} x2={W - pad} y2={height - pad} stroke="var(--chart-axis)" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="var(--chart-axis)" />
        {diagonal && (
          <line
            x1={X(0)}
            y1={Y(0)}
            x2={X(1)}
            y2={Y(1)}
            stroke="var(--chart-grid)"
            strokeDasharray="4 3"
          />
        )}
        <polyline
          points={[`${X(0)},${Y(0)}`, ...sorted.map((p) => `${X(p.x)},${Y(p.y)}`)].join(" ")}
          fill="none"
          stroke={PALETTE[0]}
          strokeWidth={2}
        />
      </svg>
      <ChartDataTable
        caption={`${title}（累積比例）`}
        head={["位置", "累積"]}
        rows={sorted.map((p) => [
          p.label ?? `前 ${Math.round(p.x * 100)}%`,
          `${Math.round(p.y * 100)}%`,
        ])}
      />
    </div>
  );
}
