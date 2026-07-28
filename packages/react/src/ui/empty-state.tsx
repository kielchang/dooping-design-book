import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "../lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  /** 說明「為什麼是空的」或「下一步該做什麼」——只寫「無資料」等於沒說。 */
  hint?: string;
  /** 行動呼籲（新增第一筆、清除篩選…） */
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

/**
 * 空狀態。
 *
 * 三種空是不一樣的，文案必須分開：**還沒有資料**（引導建立）、
 * **篩選後沒有結果**（引導放寬條件）、**沒有權限看**（說明原因）。
 * 全部塞同一句「查無資料」是最常見、也最讓人卡住的偷懶做法。
 */
export function EmptyState({ icon, title, hint, action, className, compact = false }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", compact ? "py-6" : "py-10", className)}>
      <div className="mb-2 text-muted-foreground/60">{icon ?? <Inbox className="size-7" />}</div>
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
