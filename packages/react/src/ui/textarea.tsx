import * as React from "react";
import { cn } from "../lib/utils";

/**
 * 多行文字輸入。樣式逐項鏡射 `Input`（邊框、聚焦環、不合格態、停用態），
 * 兩者排在同一張表單裡不會出現第二套質感。
 *
 * `resize-y` 是顯式宣告：只准直向調整，橫向會破壞表單欄寬對齊。
 * 高度下限 `min-h-16`（約三行）——低於這個高度的自由文字，該用 `Input`。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors duration-fast placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-subtle disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
