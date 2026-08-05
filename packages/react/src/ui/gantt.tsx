import * as React from "react";
import { cn } from "../lib/utils";

/**
 * 時間軸（精簡 Gantt）。
 *
 * ## 為什麼自建，而不是收現成的
 *
 * 評估過 ReUI 的 Gantt（MIT、copy-own）：9 檔 325KB，需要 5 個本 repo 沒有的
 * shadcn 元件（calendar／context-menu／dropdown-menu／popover／scroll-area）與
 * 3 個新 npm 相依。把它收進來等於一次擴張 40% 的元件數，而那 5 個元件全都
 * 違反三次法則（還沒被用過就收）。這支改用既有的機制自建：
 * 列互動＝`state-layer`、長條顏色＝`--chart-N`、聚焦＝`--ring`——
 * 三道閘門（邊界／字面色／去領域化）天然通過，零新相依。
 *
 * 代價是沒有拖拉排程與週期規則——那屬於「編輯器」，本元件的定位是
 * **檢視與選取**。需要編輯時，選中一列之後用旁邊的表單改日期，
 * 與本書「逐欄編輯」模式一致；拖拉排程留給真的用到三次再收。
 *
 * ## 色彩（ADR-0007 的色相預算）
 *
 * | 元素 | 吃什麼 | 為什麼 |
 * | --- | --- | --- |
 * | 長條 | `--chart-N`（顏色跟資料實體走） | 分類色與狀態語意脫鉤：同一類在所有畫面同色 |
 * | 進度 | 未完成段蓋 `--background/45%` | 實色＝已完成、淡段＝剩餘；對任何分類色、任何模式都成立 |
 * | 今天線 | `--foreground/50%`（中性） | 結構標記不吃狀態色——用 info 藍會被讀成「這裡有提示」 |
 * | 列 hover／已選 | `state-layer` 6%／20% | 與資料表列完全同一套 |
 * | 延誤／警示 | **不把長條染紅**——走徽章或圖示 | 紅色面積要保留給真正的警報（色彩疲勞預算） |
 *
 * 已選的列，次要文字（日期欄）自動改用正文色——20% 疊加之後
 * `--muted-foreground` 會掉到 4.5:1 以下，這條規則與 `TableRow` 相同。
 */
export interface GanttItem {
  id: string;
  /** 左欄顯示名稱 */
  label: string;
  /** ISO 日期字串（yyyy-mm-dd）或 Date */
  start: string | Date;
  /** 含當天 */
  end: string | Date;
  /**
   * 分類（1–8，對映 `--chart-N`）。顏色編類別、不編狀態——同一類的項目
   * 在所有畫面上同色。省略＝中性長條（`--muted-foreground`）。
   */
  category?: number;
  /** 0–100。省略＝不顯示進度（整條實色） */
  progress?: number;
}

export interface GanttLabels {
  today: string;
  /** 讀屏用：`{label}，{start} 到 {end}` 之後接的進度描述 */
  progressSuffix: (pct: number) => string;
}

export const DEFAULT_GANTT_LABELS: GanttLabels = {
  today: "今天",
  progressSuffix: (pct) => `，進度 ${pct}%`,
};

export interface GanttProps {
  items: GanttItem[];
  /** 視窗起訖。省略＝由資料推導（前後各留 5% 邊距） */
  viewStart?: string | Date;
  viewEnd?: string | Date;
  /** 受控選取。列是持久狀態，所以吃 20% 狀態層（與資料表列同階） */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** 顯示今天線（在視窗內才畫）。預設開 */
  today?: boolean;
  /** 左欄寬（px）。預設 176 */
  labelWidth?: number;
  labels?: Partial<GanttLabels>;
  className?: string;
  "aria-label"?: string;
}

const DAY = 86_400_000;

const toDate = (d: string | Date): Date => {
  if (d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1); // 當地時區的當日零點——避免 ISO 字串被當成 UTC 而差一天
};

const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

/**
 * 刻度：跨度決定粒度（≤21 天→日、≤120 天→週一、更長→月初）。
 * 刻意不做縮放切換——那是編輯器的功能；檢視用的時間軸，粒度自動選對就好。
 */
function ticks(start: Date, end: Date): { at: Date; label: string }[] {
  const span = (end.getTime() - start.getTime()) / DAY;
  const out: { at: Date; label: string }[] = [];
  const cur = new Date(start);
  if (span <= 21) {
    while (cur <= end) { out.push({ at: new Date(cur), label: fmt(cur) }); cur.setDate(cur.getDate() + 1); }
  } else if (span <= 120) {
    cur.setDate(cur.getDate() + ((8 - cur.getDay()) % 7)); // 下一個週一
    while (cur <= end) { out.push({ at: new Date(cur), label: fmt(cur) }); cur.setDate(cur.getDate() + 7); }
  } else {
    cur.setDate(1); if (cur < start) cur.setMonth(cur.getMonth() + 1);
    while (cur <= end) { out.push({ at: new Date(cur), label: `${cur.getFullYear()}/${cur.getMonth() + 1}` }); cur.setMonth(cur.getMonth() + 1); }
  }
  return out;
}

export function Gantt({
  items,
  viewStart,
  viewEnd,
  selectedId = null,
  onSelect,
  today = true,
  labelWidth = 176,
  labels,
  className,
  "aria-label": ariaLabel,
}: GanttProps) {
  const L = { ...DEFAULT_GANTT_LABELS, ...labels };

  const dates = items.flatMap((i) => [toDate(i.start), toDate(i.end)]);
  const min = viewStart ? toDate(viewStart) : new Date(Math.min(...dates.map(Number)));
  const max = viewEnd ? toDate(viewEnd) : new Date(Math.max(...dates.map(Number)));
  // 邊距：資料推導時前後各留 5%，長條才不會貼著框
  const pad = viewStart || viewEnd ? 0 : Math.max(1, Math.round(((max.getTime() - min.getTime()) / DAY) * 0.05));
  const lo = new Date(min.getTime() - pad * DAY);
  const hi = new Date(max.getTime() + (pad + 1) * DAY); // +1：end 含當天
  const span = hi.getTime() - lo.getTime();
  const pct = (d: Date) => `${(((d.getTime() - lo.getTime()) / span) * 100).toFixed(3)}%`;

  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const showToday = today && todayDate >= lo && todayDate <= hi;

  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: `${labelWidth}px 1fr` };
  const Row: React.ElementType = onSelect ? "button" : "div";

  return (
    <div role="group" aria-label={ariaLabel} className={cn("overflow-x-auto rounded-md border", className)}>
      <div className="min-w-[560px]">
        {/* 刻度列 */}
        <div style={grid} className="border-b bg-muted/40">
          <div />
          <div className="relative h-7">
            {ticks(lo, hi).map(({ at, label }) => (
              <span
                key={at.getTime()}
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 text-tiny tabular-nums text-muted-foreground"
                style={{ left: pct(at) }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* 格線與今天線：跨所有列，畫在列的下層 */}
          <div style={grid} aria-hidden className="pointer-events-none absolute inset-0">
            <div />
            <div className="relative">
              {ticks(lo, hi).map(({ at }) => (
                <span key={at.getTime()} className="absolute inset-y-0 border-l border-border/60" style={{ left: pct(at) }} />
              ))}
              {showToday && (
                <span className="absolute inset-y-0 z-10 border-l-2 border-foreground/50" style={{ left: pct(todayDate) }}>
                  <span className="absolute top-0 -translate-x-1/2 rounded-b bg-foreground/70 px-1 text-tiny text-background">
                    {L.today}
                  </span>
                </span>
              )}
            </div>
          </div>

          {items.map((it) => {
            const s = toDate(it.start);
            const e = new Date(toDate(it.end).getTime() + DAY); // 含當天
            const selected = selectedId === it.id;
            const aria =
              `${it.label}，${fmt(s)} 到 ${fmt(toDate(it.end))}` +
              (it.progress != null ? L.progressSuffix(it.progress) : "");
            return (
              <Row
                key={it.id}
                {...(onSelect
                  ? { type: "button", onClick: () => onSelect(it.id), "aria-pressed": selected, "aria-label": aria }
                  : { role: "img", "aria-label": aria })}
                data-state={selected ? "selected" : undefined}
                style={grid}
                // 列＝資料表列：state-layer 給 hover／pressed／已選三階；
                // 已選時把弱化文字整個換回正文色（muted-foreground 在 20% 疊加下會低於 4.5:1）
                className={cn(
                  "state-layer w-full border-b text-left last:border-b-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected && "[--muted-foreground:var(--foreground)]",
                )}
              >
                <div className="truncate border-r px-3 py-2 text-sm">{it.label}</div>
                <div className="relative h-9">
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-sm"
                    style={{
                      left: pct(s),
                      width: `${(((e.getTime() - s.getTime()) / span) * 100).toFixed(3)}%`,
                      background: it.category ? `var(--chart-${it.category})` : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {/* 進度：未完成段蓋一層背景色。實色＝已完成、淡段＝剩餘——
                        不換色相，所以對任何分類色、深淺兩模式都成立 */}
                    {it.progress != null && (
                      <span
                        className="absolute inset-y-0 right-0 bg-background/45"
                        style={{ width: `${100 - Math.min(100, Math.max(0, it.progress))}%` }}
                      />
                    )}
                  </span>
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
