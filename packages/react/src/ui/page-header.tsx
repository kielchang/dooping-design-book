import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Breadcrumb, type Crumb } from "./breadcrumb";

/**
 * 頁首區：把「頁面解剖」的第①區做成預設值。
 *
 * 排列固定（可缺項、不可換序）：麵包屑或返回 → h1 標題＋狀態徽章＋識別資訊 →
 * 一行說明 → 右側動作區。跨頁守則直接內建：
 *   - 一頁只有一個 h1——h1 由本元件渲染，內容區不要再開第二個
 *   - 至多一顆主要動作（`actions` 裡其餘用 outline／ghost；破壞性動作放最後）
 *   - 說明只有一行的位置——長說明放內容區，不要塞頁首
 *
 * `breadcrumb` 與 `back` 擇一：階層清楚用麵包屑（含逐層返回），
 * 只需要「回上一層」用 back。兩個都傳時只渲染麵包屑。
 */
export interface PageHeaderProps {
  title: ReactNode;
  breadcrumb?: Crumb[];
  /** 返回入口（明細頁常用）。SPA 宿主用 onNav 接路由。 */
  back?: { label?: ReactNode; href?: string; onNav?: () => void };
  /** 狀態徽章（通常是 <Badge>）——「這一筆現在什麼狀態」。 */
  badge?: ReactNode;
  /** 識別資訊或筆數（「共 18 筆」「代號 R-2406」），弱化字。 */
  meta?: ReactNode;
  /** 一行說明。 */
  description?: ReactNode;
  /** 右側動作區。 */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title, breadcrumb, back, badge, meta, description, actions, className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-1.5", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb items={breadcrumb} />
      ) : back ? (
        <a
          href={back.href ?? "#"}
          onClick={back.onNav ? (e) => { e.preventDefault(); back.onNav!(); } : undefined}
          className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {back.label ?? "返回"}
        </a>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {/* 標題階層表：頁面標題 text-2xl font-semibold，一頁一個 */}
        <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        {badge}
        {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
        {actions && <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </header>
  );
}
