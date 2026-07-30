import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        // 四種狀態走**淡底層**，與 `Callout` 的低強度同一組 token。
        // 改版前是實色填底，一排徽章因此有兩種極性（success／warning／info 是
        // 「中明度底＋深字」，danger 是「深底＋反白」），L* 全距 23.5——
        // 眼睛把極性反轉讀成「不同種類」而不是「不同嚴重度」。
        success: "border-transparent bg-success-subtle text-success-subtle-foreground",
        warning: "border-transparent bg-warning-subtle text-warning-subtle-foreground",
        info: "border-transparent bg-info-subtle text-info-subtle-foreground",
        danger: "border-transparent bg-danger-subtle text-danger-subtle-foreground",
        /**
         * 已改動未送出——保留給這個語意的琥珀色，不要拿來當一般高亮（ADR-0002）。
         * 這是全組唯一**刻意帶可見邊框**的變體：它要與一般狀態分得開。
         */
        edit: "border-edit bg-edit-bg text-edit-foreground",
      },
      /**
       * 強度，與 `Callout` 同一套語彙。`low` 是預設；`high` 換成實色滿版＋反白字。
       *
       * **表格裡一律用 `low`。** 資料表一頁有上百個徽章，實色填底會讓高飽和色的
       * 出現面積失控（色彩疲勞管的是面積 × 頻率，不是色相種類數）。
       */
      intensity: { low: "", high: "" },
    },
    compoundVariants: [
      { variant: "success", intensity: "high", class: "bg-success text-success-foreground" },
      { variant: "warning", intensity: "high", class: "bg-warning text-warning-foreground" },
      { variant: "info", intensity: "high", class: "bg-info text-info-foreground" },
      { variant: "danger", intensity: "high", class: "bg-danger text-danger-foreground" },
    ],
    defaultVariants: { variant: "default", intensity: "low" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * 狀態徽章。
 *
 * 規約：徽章上永遠要有**文字**，顏色只是加速辨識。純色點／純色塊在灰階列印與色覺障礙下等於消失，
 * 而後台系統的表格幾乎一定會被印出來存檔。
 *
 * 四種狀態預設走**淡底層**（與 `Callout` 的 `intensity="low"` 同一組 token）。
 * 這讓整排徽章的構造與極性一致：全部是「淡底＋同色相深墨」，L\* 全距從 23.5 收到 10。
 * 需要喊的場合才傳 `intensity="high"` 換成實色——**但表格裡不要用**。
 */
function Badge({ className, variant, intensity, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, intensity }), className)} {...props} />;
}

export { Badge, badgeVariants };
