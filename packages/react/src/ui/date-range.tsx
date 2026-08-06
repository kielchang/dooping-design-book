import { useId, useState } from "react";
import { cn } from "../lib/utils";
import { SegGroup } from "./seg-group";
import { Label } from "./label";
import { Input } from "./input";

/**
 * 期間選擇 v1：預設區間 ＋ 自訂起訖。
 *
 * 儀表板九成的期間需求是「今日／近 7 日／近 30 日／本月」這幾個檔位——
 * 所以 v1 把檔位做成一等公民（SegGroup），自訂用兩個原生 `date` 輸入承接。
 *
 * **刻意不做日曆格。** 日曆的鍵盤導覽、讀屏語意與在地化是一整座山，
 * 而檔位＋原生輸入已涵蓋主要場景；等三個實際場景證明需要視覺化日曆再收
 * （三次法則）。原生 `date` 輸入的外觀跨瀏覽器略有差異——接受，
 * 它換來的是免費的日期驗證、行動裝置原生選擇器與讀屏支援。
 */

/** 期間值：ISO `yyyy-mm-dd`（本地日期，不含時區——跨時區的解讀由宿主決定）。 */
export interface DateRangeValue {
  from: string;
  to: string;
}

export type DateRangePreset = "today" | "7d" | "30d" | "month" | "custom";

const PRESET_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: "today", label: "今日" },
  { value: "7d", label: "近 7 日" },
  { value: "30d", label: "近 30 日" },
  { value: "month", label: "本月" },
  { value: "custom", label: "自訂" },
];

// 用本地年月日組字串——不能走 toISOString()，那是 UTC，會在時差邊界差一天
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 由檔位算出期間（含今日）。宿主初始化 value 時也用這支，跟元件同一套算法。 */
export function dateRangeFromPreset(
  preset: Exclude<DateRangePreset, "custom">,
  now: Date = new Date(),
): DateRangeValue {
  const to = iso(now);
  const back = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return iso(d);
  };
  switch (preset) {
    case "today":
      return { from: to, to };
    case "7d":
      return { from: back(6), to };
    case "30d":
      return { from: back(29), to };
    case "month":
      return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to };
  }
}

export interface DateRangeProps {
  value: DateRangeValue;
  /** 換檔位或改自訂起訖時觸發；`preset` 告訴宿主這個值是哪個檔位算出來的。 */
  onChange: (value: DateRangeValue, preset: DateRangePreset) => void;
  /** 初始選中的檔位（僅初始；之後由元件自己管理）。預設「近 30 日」。 */
  initialPreset?: DateRangePreset;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRange({
  value,
  onChange,
  initialPreset = "30d",
  label = "期間",
  disabled,
  className,
}: DateRangeProps) {
  const [preset, setPreset] = useState<DateRangePreset>(initialPreset);
  const fromId = useId();
  const toId = useId();

  const pick = (p: string) => {
    const next = p as DateRangePreset;
    setPreset(next);
    if (next !== "custom") onChange(dateRangeFromPreset(next), next);
  };

  // 起訖反了就把另一端夾到改動的那一天——比跳錯誤訊息省一步，
  // 而且「反著選」幾乎都是想選單日
  const setFrom = (from: string) => {
    if (!from) return;
    onChange(from > value.to ? { from, to: from } : { ...value, from }, "custom");
  };
  const setTo = (to: string) => {
    if (!to) return;
    onChange(to < value.from ? { from: to, to } : { ...value, to }, "custom");
  };

  return (
    <div role="group" aria-label={label} className={cn("space-y-2", className)}>
      <SegGroup label={label} options={PRESET_OPTIONS} value={preset} onPick={pick} disabled={disabled} />
      {preset === "custom" && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label htmlFor={fromId} className="text-xs">起</Label>
            <Input
              id={fromId}
              type="date"
              value={value.from}
              max={value.to || undefined}
              onChange={(e) => setFrom(e.target.value)}
              disabled={disabled}
              className="w-40 tabular-nums"
            />
          </div>
          <span className="pb-2 text-xs text-muted-foreground">～</span>
          <div className="space-y-1">
            <Label htmlFor={toId} className="text-xs">迄</Label>
            <Input
              id={toId}
              type="date"
              value={value.to}
              min={value.from || undefined}
              onChange={(e) => setTo(e.target.value)}
              disabled={disabled}
              className="w-40 tabular-nums"
            />
          </div>
        </div>
      )}
    </div>
  );
}
