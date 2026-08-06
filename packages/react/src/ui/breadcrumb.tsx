import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface Crumb {
  label: ReactNode;
  /** 有 href 走一般連結；SPA 宿主可改用 onNav 接路由。兩者都沒有＝純文字。 */
  href?: string;
  onNav?: () => void;
}

/**
 * 麵包屑：回答「我在階層裡的哪一層」，並提供逐層返回。
 *
 * 元件庫不綁路由（邊界守衛擋 router import），所以導覽用 href 或 onNav
 * 由宿主接。最後一項是**目前頁**：不可點、`aria-current="page"`——
 * 目前頁做成連結會讓使用者點了以為壞掉（什麼都沒發生）。
 *
 * 兩層就好。超過三層通常代表資訊架構太深，該修的是站台層的分區，
 * 不是把麵包屑加長（站台層規範見〈後台系統的資訊架構〉）。
 */
export function Breadcrumb({
  items,
  label = "所在位置",
  className,
}: {
  items: Crumb[];
  label?: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          const clickable = !last && (c.href || c.onNav);
          return (
            <li key={i} className="flex items-center gap-1.5">
              {clickable ? (
                <a
                  href={c.href ?? "#"}
                  onClick={c.onNav ? (e) => { e.preventDefault(); c.onNav!(); } : undefined}
                  className="rounded-sm hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {c.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-medium text-foreground")}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
