import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../lib/utils";

/**
 * 開關：切了**立即生效**。
 *
 * 與 Checkbox 的分工是語意不是外觀——「送出才生效」的表單選項用 Checkbox，
 * 設定頁那種切下去就儲存的用 Switch。因此 Switch 刻意沒有「已改動未送出」
 * 的琥珀態：立即生效的控制項不存在未送出狀態（ADR-0002 的保留色也就用不上）。
 *
 * 必須配可見的文字標籤（`<Label htmlFor>`）：開／關語意不靠位置與顏色單獨傳達，
 * 標籤同時擴大點擊面積（軌道本身只有 20px 高）。
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
  >
    {/* 滑塊行程 = 軌道內寬 32 − 滑塊 16 = 16px（translate-x-4），改尺寸時要一起算 */}
    <SwitchPrimitive.Thumb
      className="pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform duration-fast data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
