import { cn } from "../lib/utils";

export interface LegendItem {
  label: string;
  color: string;
}

/**
 * 圖例：色塊 ＋ 文字標籤。**色塊永遠不會單獨出現**——只有色塊的圖例，
 * 灰階列印後全部一樣。
 *
 * 只有多序列的圖（StackedBar）需要圖例；單序列的圖不要放——
 * 一個顏色配一行說明只是佔位子，標題已經說完了。
 */
export function Legend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", className)}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block size-2.5 rounded-sm border border-foreground/20"
            style={{ backgroundColor: it.color }}
          />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
