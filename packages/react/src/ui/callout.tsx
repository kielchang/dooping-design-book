import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export type CalloutVariant = "success" | "warning" | "info" | "danger";

const VARIANT: Record<CalloutVariant, { wrap: string; color: string; icon: LucideIcon }> = {
  success: { wrap: "border-success/30 bg-success/10", color: "text-success", icon: CheckCircle2 },
  warning: { wrap: "border-warning/40 bg-warning/10", color: "text-warning", icon: AlertTriangle },
  info: { wrap: "border-info/30 bg-info/10", color: "text-info", icon: Lightbulb },
  danger: { wrap: "border-danger/30 bg-danger/10", color: "text-danger", icon: AlertCircle },
};

export interface CalloutProps {
  variant: CalloutVariant;
  title: ReactNode;
  /** 短標籤（如規則代號、分類），顯示在標題前 */
  tag?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

/**
 * 狀態提示框（良好／警示／提醒／危險）。
 *
 * 走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
 * 因此「這是什麼等級的訊息」不是只靠顏色傳達。
 */
export function Callout({ variant, title, tag, icon, children, className }: CalloutProps) {
  const v = VARIANT[variant];
  const Icon = icon ?? v.icon;
  return (
    <div className={cn("flex items-start gap-2.5 rounded-md border p-3", v.wrap, className)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", v.color)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", v.color)}>
          {tag && (
            <span className="mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium">
              {tag}
            </span>
          )}
          {title}
        </p>
        {children && <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
