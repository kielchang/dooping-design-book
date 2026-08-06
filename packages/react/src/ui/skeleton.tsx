import { cn } from "../lib/utils";

// 載入中的三種手段各有位置（規範見文件〈載入中〉一節），這支只負責第一種：
//
//   1. 首次載入、版面已知 → Skeleton（本檔）：反映真實版面的灰塊，保留版面不跳動
//   2. 已有內容、重新查詢 → 就地變暗＋保留舊內容＋aria-busy（元件各自實作，如 DataTable）
//   3. 提交中（按鈕）     → disabled＋換圖示＋改文案（01-button 的既有立場，沒有 loading 變體）
//
// 載入不是狀態語意——顏色一律中性（--muted），不進提醒色的彩色家族。
// 動畫用 Tailwind 內建 animate-pulse，並**顯式**以 motion-reduce:animate-none 停下——
// prefers-reduced-motion 的使用者拿到靜態灰塊，它本身已足以表達「這裡還沒好」。零新 token。
//
// 無障礙分工：骨架本身 aria-hidden（它不承載資訊）；「載入中」由**容器**宣告
// （aria-busy ＋ role="status" 的 sr-only 文字），不是每一塊灰各念一次。

/** 骨架塊：尺寸由 className 決定（h-4 w-32 之類），反映它替代的真實內容。 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
    />
  );
}

/**
 * 多行文字骨架：預設三行，最後一行短一截（真實段落的形狀，不是三條等長的槓）。
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}
