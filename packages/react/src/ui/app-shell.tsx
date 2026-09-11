import * as React from "react";
import { cn } from "../lib/utils";
import { SidebarProvider, type SidebarProviderProps } from "./sidebar";

export interface AppShellProps extends Omit<SidebarProviderProps, "children"> {
  /** `<Sidebar>…</Sidebar>`（通常內含 SidebarNav）。 */
  sidebar: React.ReactNode;
  /** 頂列內容：SidebarTrigger、全域健康度狀態列、使用者選單的落點。 */
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * 後台外殼的佈局容器：側欄＋（頂列）＋主內容。
 *
 * 刻意小到宿主可以在一小時內自己重寫（ADR-0011 的退場前提）：
 * 它只做 flex 佈局與 SidebarProvider 的轉發，不綁路由、不碰資料、不管狀態持久化。
 * 站台層的規範（分區、狀態列、單一出口、深連結）見模式章〈後台系統的資訊架構〉。
 */
export function AppShell({ sidebar, header, children, className, ...providerProps }: AppShellProps) {
  return (
    <SidebarProvider {...providerProps}>
      <div className={cn("flex min-h-svh w-full bg-background text-foreground", className)}>
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">
          {header ? (
            <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">{header}</header>
          ) : null}
          <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
