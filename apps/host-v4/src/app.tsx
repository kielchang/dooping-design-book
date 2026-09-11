import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, CircleHelp, ClipboardCheck, Database, FileText, Layers, LayoutDashboard, LineChart, Search, Settings,
} from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { AppShell } from "@/components/dooping/app-shell";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/dooping/sidebar";
import { SidebarNav, type SidebarNavLinkProps } from "@/components/dooping/sidebar-nav";
import { CommandPalette } from "@/components/dooping/command-palette";
import { Separator } from "@/components/dooping/separator";
import { Button } from "@/components/dooping/button";
import type { NavGroup } from "@/lib/dooping/nav";
import { demoNavGroups } from "@/demo/sample-data";
import { DashboardPage } from "./routes/dashboard";
import { DetailPage } from "./routes/detail";
import { FormPage } from "./routes/form";
import { ListPage } from "./routes/list";
import { PlaceholderPage } from "./routes/placeholder";
import { SettingsPage } from "./routes/settings";

// 圖示以標題對映留在宿主端：示範導覽資料本身不帶 UI 相依（sample-data.ts 的約定）
const ICONS: Record<string, LucideIcon> = {
  工作台: LayoutDashboard, 批次結算: Layers, 存量清查: ClipboardCheck, 用量分析: LineChart,
  報表中心: FileText, 基本資料: Database, 系統設定: Settings, 使用說明: CircleHelp, 操作手冊: BookOpen,
};

/** 導覽資料單一來源：同一份 NavGroup[] 同時餵側邊欄與指令面板（lib/nav 的契約）。 */
const navGroups: NavGroup[] = demoNavGroups.map((g) => ({
  ...g,
  items: g.items.map((i) => ({ ...i, icon: ICONS[i.title] })),
}));

/**
 * 側欄連結注入宿主自己的路由元件——ADR-0011「元件不綁路由」的接縫就在這裡。
 * 站外連結維持真 <a>（SidebarNav 會帶 target／rel），站內改走 react-router 的 Link。
 */
function renderLink({ href, target, rel, ...rest }: SidebarNavLinkProps) {
  if (target) return <a href={href} target={target} rel={rel} {...rest} />;
  return <Link to={href} {...rest} />;
}

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <AppShell
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 font-semibold">
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground"
              >
                D
              </span>
              <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">內部試裝宿主</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={navGroups} currentPath={pathname} renderLink={renderLink} />
          </SidebarContent>
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          {/* 頂列只放全域的東西——頁面標題是 PageHeader 的職責，不在這裡重複一份 */}
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setPaletteOpen(true)}>
            <Search aria-hidden />
            搜尋
            <kbd className="ml-1 rounded-sm border px-1 text-tiny text-muted-foreground">Ctrl K</kbd>
          </Button>
          <CommandPalette
            groups={navGroups}
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            onNavigate={(url, item) => (item.external ? window.open(url, "_blank", "noopener") : navigate(url))}
          />
        </>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/workbench" replace />} />
        <Route path="/workbench" element={<DashboardPage />} />
        <Route path="/stock-check" element={<ListPage />} />
        <Route path="/master" element={<DetailPage />} />
        <Route path="/settlement" element={<FormPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Routes>
    </AppShell>
  );
}
