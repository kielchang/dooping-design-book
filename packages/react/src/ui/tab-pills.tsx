import { type ReactNode } from "react";
import { cn } from "../lib/utils";

export type TabPill = { key: string; label: ReactNode; badge?: ReactNode; /** 導覽錨點屬性 */ dataTour?: string };

export interface TabPillsProps {
  tabs: TabPill[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
  /** 無障礙名稱（畫面上有標題時可省略，改用 aria-labelledby） */
  label?: string;
}

/**
 * 分頁膠囊列。
 *
 * 存在的唯一理由是**收斂**：分頁列是最容易被各畫面各自手刻 `<button>` 的元件，
 * 一旦散開，改一次樣式就要全站找一遍，而且 `role="tablist"` 語意會漏掉。
 */
export function TabPills({ tabs, value, onChange, className, label }: TabPillsProps) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap gap-1", className)}>
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            data-tour={t.dataTour}
            onClick={() => onChange(t.key)}
            className={cn(
              "tap-target-y inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors duration-fast",
              active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent",
            )}
          >
            {t.label}
            {t.badge}
          </button>
        );
      })}
    </div>
  );
}
