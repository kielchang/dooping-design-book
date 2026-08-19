import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "../lib/utils";

/**
 * 頁首區：把「頁面解剖」的第①區做成預設值。
 *
 * 這個元件收錄之前，五支頁面 story 手排了八次頁首，對齊方式已經漂移
 * （`items-end` 與 `items-center` 兩種、兩處漏了 `flex-wrap`），
 * 明細頁的返回入口甚至是 `<button>`——違反它自己那頁寫的
 * 「返回入口是真連結不是 JS 後退」。收錄理由與解鎖脈絡見 ADR-0008 後記。
 *
 * 版型規則直接編進元件，不留給呼叫端決定：
 *   - **一頁只有一個 h1**——h1 由本元件渲染，內容區不要再開第二個
 *   - **至多一顆主要動作**——`actions` 裡其餘用 outline／ghost，破壞性動作排最後
 *   - 說明只有一行（`meta`）——長說明放內容區，不要塞頁首
 *
 * 三個 export 對應資訊架構的三層，互不綁死：`PageHeader` 是骨架，
 * `nav` slot 吃 `BackLink`（兩層）或 `Breadcrumb`（三層以上）。
 * 兩者不要同時放——見〈後台系統的資訊架構〉。
 */
export interface PageHeaderProps {
  /** 頁面標題。渲染成整頁唯一的 h1（`text-2xl font-semibold`）。 */
  title: ReactNode;
  /** 識別碼與狀態徽章，與標題同列。 */
  badges?: ReactNode;
  /** 副標一行：筆數、期間、範圍說明。 */
  meta?: ReactNode;
  /** 上層路徑：`<BackLink>` 或 `<Breadcrumb>`，排在標題列上方。 */
  nav?: ReactNode;
  /** 右側動作區——「每頁至多一顆主要動作」的家。 */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, badges, meta, nav, actions, className }: PageHeaderProps) {
  // 刻意用 <div> 不用 <header>：<header> 只要不在 main／article／aside／section 裡
  // 就是 banner 地標，而一頁只能有一個 banner。文件頁與 story 常常並排展示兩三個頁首
  // （空狀態 vs 載入中），用 <header> 會直接踩到 axe 的 landmark-no-duplicate-banner。
  // 頁首的語意由 h1 承擔，不需要再多一個地標。
  return (
    <div className={cn("space-y-2", className)}>
      {nav}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* 標題階層表：頁面標題 text-2xl font-semibold，一頁一個 */}
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            {badges}
          </div>
          {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * 返回上一層：兩層資訊架構（清單 → 明細）的正典入口。
 *
 * 渲染**真連結**而不是 `<button>` 加 `history.back()`——直接開連結進來的人
 * （從搜尋結果、從同事貼的網址）沒有「上一頁」可回，JS 後退會把他們送出這個系統。
 * 真連結也讓中鍵開新分頁、複製網址這些瀏覽器慣例照常運作。
 *
 * 元件庫不綁路由（`boundary.test.ts` 擋 router import），所以 `href` 由宿主給；
 * 抄走之後把 `<a>` 換成自家 Link 是預期中的改法。
 */
export function BackLink({
  href,
  label = "返回清單",
  className,
}: {
  href: string;
  label?: ReactNode;
  className?: string;
}) {
  return (
    <Button asChild variant="ghost" size="sm" className={cn("-ml-2 text-muted-foreground", className)}>
      <a href={href}>
        <ArrowLeft aria-hidden />
        {label}
      </a>
    </Button>
  );
}

export interface Crumb {
  label: ReactNode;
  /** 沒有 href＝目前頁（只有末項可以省略）。 */
  href?: string;
}

/**
 * 麵包屑：回答「我在階層裡的哪一層」，並提供逐層返回。
 *
 * **兩層用 `BackLink`、三層以上才用麵包屑，不要同時放**——兩個返回入口
 * 會讓使用者要先判斷該點哪一個。層級再深下去該修的是站台層的分區
 * （〈後台系統的資訊架構〉），不是把麵包屑加長。
 *
 * 末項是目前頁：不可點、帶 `aria-current="page"`。目前頁做成連結，
 * 使用者點了什麼都沒發生，會以為畫面壞了。
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
  return (
    <nav aria-label={label} className={cn("text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden />}
              {item.href && !last ? (
                <a
                  href={item.href}
                  className="rounded-sm hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-foreground")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
