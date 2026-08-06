import { cn } from "../lib/utils";

/**
 * 載入佔位。規範：骨架必須**保留真實版面的高度與形狀**——載入完成的瞬間版面不跳動，
 * 這是骨架存在的唯一理由；隨便丟三根灰條反而比「載入中…」文字更糟。
 *
 * 只用於**首次載入**。重新整理既有畫面時保留舊內容——把使用者已經在看的資料
 * 閃成灰塊，等於把「更新」演成「壞掉」。
 *
 * 脈動尊重 prefers-reduced-motion（`motion-reduce:animate-none`）：
 * 靜止的灰塊本身已足以表達「這裡還沒好」，動態只是輔助。
 *
 * 無障礙：骨架一律 `aria-hidden`，載入語意掛在**容器**上
 * （`aria-busy="true"`，完成後移除）。讀屏使用者不需要逐根聽到灰條。
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
    />
  );
}

/** 文字段落骨架：n 行，末行 60% 寬——等寬到底的假段落一眼就假。 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}
