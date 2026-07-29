import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  // 沒有 transition-colors：`state-layer` 自己的 transition 已經涵蓋顏色類屬性，
  // 而 Tailwind 的 utility 排在 tokens.css 之後，兩者並存會讓狀態層失去淡入。
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // hover／pressed 一律走 `state-layer`：疊一層 currentColor，而不是每個 variant
      // 各挑一個透明度。改版前這裡有 /90 /80 兩種、全 repo 共七種，實測可見度從
      // ΔE00 0.7（secondary，等於沒變）到 7.4（default，過於刻意）差了十倍。
      variant: {
        default: "state-layer bg-primary text-primary-foreground",
        brand: "state-layer bg-brand text-brand-foreground",
        destructive: "state-layer bg-destructive text-destructive-foreground",
        outline: "state-layer border border-input bg-background",
        secondary: "state-layer bg-secondary text-secondary-foreground",
        ghost: "state-layer",
        // link 刻意不加狀態層：它是一段文字不是一塊表面，疊上去會在字後面浮出一個色塊。
        link: "text-primary underline-offset-4 transition-colors duration-fast hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 把樣式套到子元素上（例如讓 `<a>` 長得像按鈕），而不是多包一層 `<button>`。 */
  asChild?: boolean;
}

/**
 * 按鈕。
 *
 * `destructive` 是**控制項語意**（這顆按下去會刪東西），與狀態語意 `danger`（這筆資料有問題）
 * 刻意分成兩個 token — 同一個畫面上兩者常常同時出現，混用會讓「紅色」失去意義。
 *
 * `brand` 是**色相主題色**，跟著 `<html data-color-theme>` 走；`default` 則是中性的近黑殼，
 * 與主題無關。這個分工是刻意的：資料密集的後台畫面上按鈕很多，全部吃主題色會讓
 * 高飽和色的出現面積失控（色彩疲勞管的是面積與頻率，不是色相數量）。
 *
 * ## `brand` 不要用在「確認／送出／儲存」上
 *
 * 這兩件事的職責不同：`--brand` 負責**識別**（這是誰的產品），確認按鈕負責
 * **指示可供性**（按下去會提交）。讓一個 token 同時做兩件事，就是 `destructive`
 * 與 `danger` 當初分家的那個錯。
 *
 * 而且色相帶著既成慣例：綠＝通行、藍＝系統預設動作、紅＝停止、灰＝停用。
 * 紫與洋紅**沒有動作慣例**，放在確認按鈕上會被讀成裝飾而不是功能控制項——
 * 主題切到藍紫或紫晶時，一顆紫色的「送出申請」就是這樣來的。
 *
 * | 用 `brand` | 用 `default`（`--primary`） |
 * | --- | --- |
 * | logo 區、品牌強調 | **確認、送出、儲存、套用** |
 * | 「開始新流程」這類非提交型入口 | 一般操作 |
 * | 選中的導覽項（走 `--brand-subtle`） | 取消、返回 |
 *
 * 提交性動作在**任何主題下都用 `default`**，色相就永遠不會與動作語意打架。
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
