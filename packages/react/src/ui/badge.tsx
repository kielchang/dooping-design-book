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
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
        danger: "border-transparent bg-danger text-danger-foreground",
        /** 已改動未送出——保留給這個語意的琥珀色，不要拿來當一般高亮（ADR-0002）。 */
        edit: "border-edit bg-edit-bg text-edit-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * 狀態徽章。
 *
 * 規約：徽章上永遠要有**文字**，顏色只是加速辨識。純色點／純色塊在灰階列印與色覺障礙下等於消失，
 * 而後台系統的表格幾乎一定會被印出來簽核。
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
