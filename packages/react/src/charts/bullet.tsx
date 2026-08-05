import { cn } from "../lib/utils";
import { type ValueFmt, defaultFmt } from "./base";

export interface BulletProps {
  /** 指標名稱。 */
  label: string;
  value: number;
  target: number;
  valueFmt?: ValueFmt;
  className?: string;
}

/**
 * 子彈圖：實際 vs 目標，一條就講完。放在卡片頂端當摘要。
 *
 * **這是唯一使用狀態色的圖**：超出目標走 `--danger`、未超出走 `--success`。
 * 預設假設「目標＝上限」（例如預算）；若你的指標是「目標＝下限」，
 * 請用文案講清楚，不要讓讀者自己猜紅色代表什麼。
 *
 * 無障礙：實際、目標、達成率都是**鄰近可見文字**，圖形部分 `aria-hidden`——
 * 不再附資料表，那會讓報讀器把同一份數字唸兩次。
 */
export function Bullet({ label, value, target, valueFmt = defaultFmt, className }: BulletProps) {
  const over = value > target;
  const max = Math.max(1, value, target);
  const pct = target > 0 ? Math.round((value / target) * 100) : null;
  const fill = over ? "hsl(var(--danger))" : "hsl(var(--success))";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">
          {valueFmt(value)} / 目標 {valueFmt(target)}
          {pct != null && <span className="ml-1 text-muted-foreground">（{pct}%）</span>}
        </span>
      </div>
      <div aria-hidden className="relative h-3 overflow-hidden rounded-sm bg-muted">
        <div className="h-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: fill }} />
        {/* 目標刻度：一條清楚的直線，灰階列印下仍然讀得出「線在哪、條到沒到」 */}
        <div
          className="absolute inset-y-0 w-0.5 bg-foreground"
          style={{ left: `${(target / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
