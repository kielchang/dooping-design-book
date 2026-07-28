import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface Step {
  key: string;
  label: string;
  hint?: string;
}

export interface StepperProps {
  steps: Step[];
  /** 目前步驟 key */
  current: string;
  /** 各步驟是否已完成（可跳著完成，不必依序） */
  completed?: Record<string, boolean>;
  onStep?: (key: string) => void;
  className?: string;
}

/**
 * 步驟指示。
 *
 * 完成態同時用**勾選圖示**與顏色標示，不只靠綠色；步驟可點擊回頭，
 * 因為多步驟表單最常見的挫折就是「我想回去確認第 2 步填了什麼，但只能一路取消重來」。
 */
export function Stepper({ steps, current, completed = {}, onStep, className }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === current);
  return (
    <ol className={cn("flex w-full items-start overflow-x-auto pb-1", className)}>
      {steps.map((s, i) => {
        const isCurrent = s.key === current;
        const isDone = completed[s.key];
        const isPast = i < currentIndex;
        const state: "current" | "done" | "todo" = isCurrent ? "current" : isDone || isPast ? "done" : "todo";
        return (
          <li key={s.key} className={cn("flex flex-1 items-start", i === steps.length - 1 && "flex-none")}>
            <button
              type="button"
              onClick={() => onStep?.(s.key)}
              aria-current={isCurrent ? "step" : undefined}
              className="group flex flex-col items-center gap-1.5 text-center"
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-fast",
                  state === "current" && "border-primary bg-primary text-primary-foreground",
                  state === "done" && "border-success bg-success text-success-foreground",
                  state === "todo" && "border-muted-foreground/30 bg-background text-muted-foreground group-hover:border-primary/50",
                )}
              >
                {state === "done" ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className="w-24 sm:w-32">
                <span className={cn("block text-xs font-medium leading-tight sm:text-sm", state === "todo" ? "text-muted-foreground" : "text-foreground")}>
                  {s.label}
                </span>
                {s.hint && <span className="mt-0.5 hidden text-tiny leading-tight text-muted-foreground sm:block">{s.hint}</span>}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span className={cn("mt-[18px] h-0.5 flex-1", i < currentIndex || isDone ? "bg-success" : "bg-muted-foreground/20")} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
