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

export interface BarChartProps {
  data: BarDatum[];
  /** 這張圖在講什麼——同時是 aria-label 摘要與資料表 caption 的開頭。 */
  title?: string;
  /**
   * 在長條頂端標數值。**列印與觸控裝置一定要開**——
   * 沒有 hover 的情境裡，不標值的長條只是形狀。
   */
  showValues?: boolean;
  /** 類別上限（含彙總項），超過取值最大的前幾名、其餘併成「其他」。 */
  maxItems?: number;
  valueFmt?: ValueFmt;
  /** 點擊鑽取。明細清單由宿主渲染——元件不猜「鑽下去看什麼」。 */
  onSelect?: (index: number, datum: BarDatum) => void;
  selectedIndex?: number;
  /** 單一序列色。預設 `PALETTE[0]`——它是全站單序列圖的預設色，要穩定。 */
  color?: string;
  height?: number;
  className?: string;
}

/**
 * 長條圖：比較同一個量在不同類別間的大小。
 * 類別是時間（月份、週）請用 TrendChart——長條不表達「順序連續」。
 */
export function BarChart({
  data,
  title = "長條圖",
  showValues = false,
  maxItems = 12,
  valueFmt = defaultFmt,
  onSelect,
  selectedIndex,
  color = PALETTE[0],
  height = 180,
  className,
}: BarChartProps) {
  if (data.length === 0) return <ChartEmpty />;
  const items = capItems(data, maxItems);
  // 全零時以 1 為底避免除以零——座標軸正常、長度全部是 0。
  // 「本期皆為 0」要由宿主明說，否則使用者會以為資料沒載入。
  const max = Math.max(1, ...items.map((d) => d.value));

  const slot = 56;
  const pad = { top: showValues ? 18 : 8, bottom: 20 };
  const plotH = height - pad.top - pad.bottom;
  const W = items.length * slot;
  const peak = items.reduce((a, b) => (b.value > a.value ? b : a), items[0]);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <svg
        role="img"
        aria-label={`${title}，共 ${items.length} 項，最高為 ${peak.label} ${valueFmt(peak.value)}`}
        viewBox={`0 0 ${W} ${height}`}
        width={W}
        height={height}
        className="block"
      >
        {/* 基準線：只畫底線，不做完整刻度系統（閱讀型圖表的刻意限制） */}
        <line x1={0} y1={height - pad.bottom} x2={W} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        {items.map((d, i) => {
          const h = (d.value / max) * plotH;
          const x = i * slot + 10;
          const y = height - pad.bottom - h;
          const dim = selectedIndex != null && selectedIndex !== i;
          return (
            <g
              key={d.id ?? d.label}
              onClick={onSelect ? () => onSelect(i, d) : undefined}
              className={cn(onSelect && "cursor-pointer")}
            >
              {/* 原生 <title> 是零相依的 hover 提示；鍵盤與報讀器走下方資料表 */}
              <title>{`${d.label}：${valueFmt(d.value)}`}</title>
              <rect x={x} y={y} width={slot - 20} height={h} fill={color} opacity={dim ? 0.35 : 1} />
              {showValues && (
                <text x={x + (slot - 20) / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
                  {valueFmt(d.value)}
                </text>
              )}
              <text x={x + (slot - 20) / 2} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--chart-text)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ChartDataTable
        caption={`${title}（資料表）`}
        head={["項目", "數值"]}
        rows={items.map((d) => [d.label, valueFmt(d.value)])}
        onSelect={onSelect ? (i) => onSelect(i, items[i]) : undefined}
        selectedIndex={selectedIndex}
      />
    </div>
  );
}
