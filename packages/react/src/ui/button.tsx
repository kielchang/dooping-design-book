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
 * ## `brand` 已淘汰：外觀等同 `default`
 *
 * 主題（`<html data-color-theme>`）只換外殼——側欄與頂列的大區塊底色——內容區一律中性，
 * 所以 `--brand` 在所有主題都鏡射 `--primary`，`variant="brand"` 與 `default` 長得一樣。
 * 保留這個變體只是為了相容，新程式一律用 `default`。
 *
 * 為什麼不讓按鈕帶主題色：按鈕、提醒、琥珀欄位都靠顏色傳達意思，主題色一進內容區
 * 就會和它們搶色相——一顆紫色的「送出申請」會被讀成裝飾，一塊紅色的品牌強調會被讀成錯誤。
 * 認出「我在哪個系統」交給外殼的大區塊顏色，按鈕只管動作。
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
