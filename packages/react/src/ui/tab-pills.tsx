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
      {tabs.map((t, i) => {
        const active = t.key === value;
        // label 是空字串（或純空白）時按鈕沒有可及名稱——退一個序數當保底，
        // 不能讓「這一頁沒有標題」變成「這顆按鈕沒有名字」。
        const bare = typeof t.label === "string" && t.label.trim() === "";
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={bare ? `分頁 ${i + 1}` : undefined}
            data-tour={t.dataTour}
            onClick={() => onChange(t.key)}
            className={cn(
              "state-layer tap-target-y inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm",
              active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
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
