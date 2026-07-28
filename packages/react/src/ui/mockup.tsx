// 模擬畫面積木 — **寫文件的工具，不是產品元件**。
//
// 為什麼要有這一組：操作手冊配截圖，截圖第一天就開始過期。改一次按鈕位置，
// 全手冊的圖都要重錄，於是沒人重錄，於是手冊開始說謊。
//
// 這裡的做法是「零截圖」：示意圖用**元件庫的真元件**排出來，非重點區域用 Placeholder 佔位，
// 重點用 Spotlight 圈起來。元件改版，示意圖跟著改版，不會有人需要去重拍任何東西。
//
// 用法規約：重點控制項＝真元件包 `<Spotlight>`；其餘一律 `<Placeholder>` 留白。
// 不要用 Placeholder 去「假裝」一個真元件——那又變成一種會過期的截圖。
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** 佔位塊：非重點區域一律留白（muted 圓角塊，可帶淡字標籤）。 */
export function Placeholder({
  w, h = 14, label, className,
}: { w?: number | string; h?: number; label?: string; className?: string }) {
  return (
    <div
      className={cn(
        "mock-placeholder flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-muted text-tiny text-muted-foreground",
        className,
      )}
      style={{ width: w ?? "100%", height: h }}
    >
      {label ?? ""}
    </div>
  );
}

/**
 * 聚光：包住「重點元件」。
 * 用的是與 Coachmark 同一個 `.spotlight-ring`——讀者在文件與系統裡看到的是**同一種**「看這裡」語言。
 * 琥珀色專屬「已改動未送出」，不得用於聚光。
 */
export function Spotlight({ children, label, className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <span className={cn("spotlight-ring relative inline-block rounded-lg p-1", className)}>
      {children}
      {label && (
        <span
          className="absolute left-2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-tiny text-primary-foreground"
          style={{ top: -10, transform: "translateY(-100%)" }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

/**
 * 畫面框：模擬系統版面（側欄／頂欄＝佔位），children 放該步驟的排版。
 * `min-w` 保底：小螢幕靠外層容器橫向捲動，不擠壞排版（擠壞的示意圖比沒有示意圖更糟）。
 */
export function MockScreenFrame({
  children, className, navLabel = "選單", topLabel = "頂部狀態列",
}: { children: ReactNode; className?: string; navLabel?: string; topLabel?: string }) {
  return (
    <div className={cn("flex min-w-[460px] gap-2.5 bg-background p-3 text-foreground", className)} style={{ minHeight: 230 }}>
      <div className="flex w-[90px] flex-col gap-1.5">
        <Placeholder h={22} label={navLabel} />
        <Placeholder h={14} /><Placeholder h={14} /><Placeholder h={14} /><Placeholder h={14} /><Placeholder h={14} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <Placeholder h={20} label={topLabel} />
        <div className="flex flex-col items-stretch gap-2.5">{children}</div>
      </div>
    </div>
  );
}

/** 表格假列（可帶一個重點格）。 */
export function MockRow({ focus }: { focus?: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Placeholder w={64} /><Placeholder w={90} /><Placeholder /><Placeholder w={70} />
      {focus ?? <Placeholder w={64} h={22} />}
    </div>
  );
}
