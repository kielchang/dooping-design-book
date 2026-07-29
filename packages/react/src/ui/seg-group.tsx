import { useEffect, useRef } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "../lib/utils";

export interface SegOption {
  value: string;
  label: string;
}

export interface SegGroupProps {
  options: SegOption[];
  value: string;
  onPick: (v: string) => void;
  label?: string;
  autoFocus?: boolean;
  onEscape?: () => void;
  disabled?: boolean;
  lockHint?: string;
  /** 標成「已改動未送出」（琥珀） */
  changed?: boolean;
  className?: string;
}

/**
 * 分段選擇（少量互斥選項）。
 *
 * 何時用它取代原生 radio：選項 **2–5 個、標籤短、需要一眼看完**時。
 * 選項超過 5 個或標籤長，用 Select；選項會動態增減，用 Select。
 *
 * 無障礙：`role="radiogroup"` ＋ roving tabindex（整組只佔一個 Tab 停留點），
 * 方向鍵移動、Space/Enter 選定、Esc 取消。選中項同時打勾與填色——不只靠顏色。
 */
export function SegGroup({
  options, value, onPick, label, autoFocus, onEscape, disabled, lockHint, changed = false, className,
}: SegGroupProps) {
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdx = options.findIndex((o) => o.value === value);
  const focusIdx = activeIdx >= 0 ? activeIdx : 0;

  useEffect(() => {
    if (autoFocus) btns.current[focusIdx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const move = (from: number, dir: number) => {
    const n = options.length;
    if (!n) return;
    btns.current[(from + dir + n) % n]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, idx: number) => {
    if (disabled) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(idx, 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(idx, -1); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); onPick(options[idx].value); }
    else if (e.key === "Escape") { e.preventDefault(); onEscape?.(); }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      title={disabled ? lockHint : undefined}
      className={cn(
        "inline-flex flex-wrap items-center gap-0.5 rounded-md border p-0.5",
        changed ? "border-edit bg-edit-bg" : "border-input bg-background",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {options.map((o, idx) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => { btns.current[idx] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={disabled ? -1 : idx === focusIdx ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onPick(o.value)}
            onKeyDown={(e) => onKey(e, idx)}
            className={cn(
              "state-layer tap-target-y inline-flex items-center justify-center gap-1 rounded px-3 py-1 text-sm",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {active && <Check aria-hidden className="size-3.5 shrink-0" />}
            {o.label}
          </button>
        );
      })}
      {disabled && <Lock className="mx-1 size-3.5 opacity-60" aria-hidden />}
    </div>
  );
}
