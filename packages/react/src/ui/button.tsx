import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        brand: "bg-brand text-brand-foreground hover:bg-brand/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
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
 * 因此 `brand` 只給**一頁一顆**的關鍵動作，其餘一律 `default`。
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
