import { useEffect, useRef } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "../lib/utils";
import type { SegOption } from "./seg-group";

export interface ChipsProps {
  options: SegOption[];
  selected: string[];
  onToggle: (v: string) => void;
  label?: string;
  autoFocus?: boolean;
  onEscape?: () => void;
  disabled?: boolean;
  lockHint?: string;
  changed?: boolean;
  emptyHint?: string;
  className?: string;
}

/**
 * 多選標籤片。
 *
 * 何時用它取代多選下拉：選項 **固定且不多（≤ 12）**、使用者需要**同時看到已選與未選**時。
 * 多選下拉最大的問題是「選完就看不見選了什麼」，而在後台系統裡，
 * 使用者常常需要在按下送出前再確認一次自己勾了哪些。
 *
 * 無障礙：一組 `role="checkbox"` 放在 `role="group"` 裡（不是 radiogroup——可複選），
 * roving tabindex ＋ 方向鍵移動、Space/Enter 切換、Esc 收合；選中同時打勾與填色。
 */
export function Chips({
  options, selected, onToggle, label, autoFocus, onEscape, disabled, lockHint,
  changed = false, emptyHint = "（無選項）", className,
}: ChipsProps) {
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) btns.current[0]?.focus();
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
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(options[idx].value); }
    else if (e.key === "Escape") { e.preventDefault(); onEscape?.(); }
  };

  return (
    <div
      role="group"
      aria-label={label}
      title={disabled ? lockHint : undefined}
      className={cn(
        "flex flex-wrap items-center gap-1.5 rounded-md border p-1.5",
        changed ? "border-edit bg-edit-bg" : "border-input bg-background",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {options.map((o, idx) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            ref={(el) => { btns.current[idx] = el; }}
            type="button"
            role="checkbox"
            aria-checked={on}
            tabIndex={disabled ? -1 : idx === 0 ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onToggle(o.value)}
            onKeyDown={(e) => onKey(e, idx)}
            className={cn(
              "state-layer tap-target-y inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs",
              on ? "border-primary bg-primary/10 font-medium text-primary" : "border-input text-muted-foreground",
            )}
          >
            {on && <Check aria-hidden className="size-3 shrink-0" />}
            {o.label}
          </button>
        );
      })}
      {options.length === 0 && <span className="px-1 text-xs text-muted-foreground">{emptyHint}</span>}
      {disabled && <Lock className="size-3.5 opacity-60" aria-hidden />}
    </div>
  );
}
