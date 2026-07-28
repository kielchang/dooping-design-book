import { Input } from "./input";
import { cn } from "../lib/utils";

export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * 數值輸入。
 *
 * 三件小事，但每一件漏了都會被使用者罵：`inputMode="numeric"`（手機直接出數字鍵盤）、
 * `tabular-nums`（等寬數字，上下對齊才看得出位數）、右對齊（數字靠右才好比大小）。
 * 底色套 `.field-editable`＝可編輯欄位的統一長相。
 */
export function NumberInput({ value, onChange, className, step, min, max, disabled, ...rest }: NumberInputProps) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      step={step}
      min={min}
      max={max}
      disabled={disabled}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      className={cn("field-editable h-8 w-28 text-right tabular-nums", className)}
      {...rest}
    />
  );
}
