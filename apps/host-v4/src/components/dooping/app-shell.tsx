import * as React from "react";
import { cn } from "@/lib/dooping/utils";
import { SidebarProvider, type SidebarProviderProps } from "@/components/dooping/sidebar";

export interface AppShellProps extends Omit<SidebarProviderProps, "children"> {
  /** `<Sidebar>…</Sidebar>`（通常內含 SidebarNav）。 */
  sidebar: React.ReactNode;
  /**
   * 頂列內容。多應用外殼的三段：左＝系統（SidebarTrigger＋目前應用）、
   * 中＝目前應用的功能選單（AppMenubar）、右＝系統（搜尋、通知、使用者選單）。
   * 頁面標題不放這裡——那是 PageHeader 的 h1。
   */
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * 後台外殼的佈局容器：側欄＋（頂列）＋主內容。
 *
 * 刻意小到宿主可以在一小時內自己重寫（ADR-0011 的退場前提）：
 * 它只做 flex 佈局與 SidebarProvider 的轉發，不綁路由、不碰資料、不管狀態持久化。
 * 站台層的規範（分區、頂列三段、單一出口、深連結）見模式章〈後台系統的資訊架構〉。
 *
 * 頂列與側欄都貼著視窗頂端（sticky）：長頁面捲動時功能選單與應用切換一直在手邊。
 * 頂列 z-40 低於所有浮層（z-50 起），浮層一律蓋得過它。
 */
export function AppShell({ sidebar, header, children, className, ...providerProps }: AppShellProps) {
  return (
    <SidebarProvider {...providerProps}>
      <div className={cn("flex min-h-svh w-full bg-background text-foreground", className)}>
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">
          {header ? (
            <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 md:px-4">
              {header}
            </header>
          ) : null}
          <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
