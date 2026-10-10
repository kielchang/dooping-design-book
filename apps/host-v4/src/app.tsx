import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, Briefcase, CalendarDays, FolderOpen, Search, ShieldCheck } from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { AppShell } from "@/components/dooping/app-shell";
import { AppMenubar } from "@/components/dooping/app-menubar";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/dooping/sidebar";
import { SidebarNav, type SidebarNavLinkProps } from "@/components/dooping/sidebar-nav";
import { CommandPalette } from "@/components/dooping/command-palette";
import { Separator } from "@/components/dooping/separator";
import { Button } from "@/components/dooping/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/dooping/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/dooping/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dooping/dialog";
import { findActiveNavLeaf, isNavActive, type NavAction, type NavGroup, type NavLeaf } from "@/lib/dooping/nav";
import { cn } from "@/lib/dooping/utils";
import { demoAppMenus, demoApps, demoNotifications } from "@/demo/sample-data";
import { DashboardPage } from "./routes/dashboard";
import { DetailPage } from "./routes/detail";
import { FormPage } from "./routes/form";
import { ListPage } from "./routes/list";
import { PlaceholderPage } from "./routes/placeholder";
import { SettingsPage } from "./routes/settings";

// 多應用外殼：側欄切應用、頂部選單切功能（組法正本是 story「頁面/多應用外殼」）。
// 這個宿主自己是「作業中心」；其他應用落在 /apps/* 的佔位頁——真實部署時它們是別的系統。

// 圖示以標題對映留在宿主端：示範資料本身不帶 UI 相依（sample-data.ts 的約定）
const APP_ICONS: Record<string, LucideIcon> = {
  作業中心: Briefcase, 文件庫: FolderOpen, 排程: CalendarDays, 系統管理: ShieldCheck,
};
const apps: NavGroup[] = demoApps.map((g) => ({
  ...g,
  items: g.items.map((i) => ({ ...i, icon: APP_ICONS[i.title] })),
}));
const appLeaves = apps.flatMap((g) => g.items) as NavLeaf[];

/**
 * 目前在哪個應用：路徑落在應用自己的 url 底下，或落在它任一個功能項上。
 * 應用各自部署在不同網域時，改成比對網域——接縫就是 SidebarNav 的 isActive。
 */
const isAppActive = (app: NavLeaf, path: string) =>
  isNavActive(app.url, path) || Boolean(findActiveNavLeaf(demoAppMenus[app.url] ?? [], path));

const USER = { name: "使用者甲", account: "user-a" };

/**
 * 連結注入宿主自己的路由元件——「元件不綁路由」的接縫就在這裡。
 * 站外連結維持真 <a>；站內改走 react-router 的 Link（它先呼叫轉發來的 onClick 再導航，
 * 功能選單的「選了就關」靠這個順序）。
 */
function renderLink({ href, target, rel, ...rest }: SidebarNavLinkProps) {
  if (target) return <a href={href} target={target} rel={rel} {...rest} />;
  return <Link to={href} {...rest} />;
}

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [pending, setPending] = useState<NavAction | null>(null);

  const app = findActiveNavLeaf(apps, pathname, isAppActive)?.item ?? appLeaves[0];
  const menus = demoAppMenus[app.url] ?? [];
  const AppIcon = app.icon;
  const unread = demoNotifications.filter((n) => n.unread).length;

  return (
    <AppShell
      sidebar={
        <Sidebar label="應用程式">
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 font-semibold">
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-sidebar-primary text-xs text-sidebar-primary-foreground"
              >
                D
              </span>
              <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">內部試裝宿主</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={apps} currentPath={pathname} isActive={isAppActive} renderLink={renderLink} />
          </SidebarContent>
        </Sidebar>
      }
      header={
        <>
          {/* 左段（系統）：側欄開關＋目前應用 */}
          <SidebarTrigger />
          <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
            {AppIcon ? <AppIcon aria-hidden className="size-4" /> : null}
            <span className="sr-only sm:not-sr-only">{app.title}</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          {/* 中段（應用）：目前應用的功能選單；頁面標題是 PageHeader 的職責，不在頂列重複 */}
          <AppMenubar groups={menus} currentPath={pathname} renderLink={renderLink} onAction={(_, item) => setPending(item)} />
          {/* 右段（系統）：搜尋、通知、使用者 */}
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 px-0 sm:w-auto sm:px-3" onClick={() => setPaletteOpen(true)}>
              <Search aria-hidden />
              <span className="sr-only sm:not-sr-only">搜尋</span>
              <kbd className="ml-1 hidden rounded-sm border px-1 text-tiny text-muted-foreground md:inline">Ctrl K</kbd>
            </Button>
            <Popover open={noticeOpen} onOpenChange={setNoticeOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative size-8" aria-label={`通知，${unread} 則未讀`}>
                  <Bell />
                  {unread > 0 ? (
                    <span
                      aria-hidden
                      data-shell-badge=""
                      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground ring-2 ring-sidebar-foreground"
                    >
                      {unread}
                    </span>
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-2.5">
                  <p className="text-sm font-semibold">通知</p>
                  <span className="text-xs text-muted-foreground">{unread} 則未讀</span>
                </div>
                <ul className="max-h-80 overflow-y-auto py-1">
                  {demoNotifications.map((n) => (
                    <li key={n.id}>
                      <Link
                        to={n.url}
                        onClick={() => setNoticeOpen(false)}
                        className="state-layer flex gap-3 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread && "bg-primary")} />
                        <span className="min-w-0 flex-1">
                          <span className="block">
                            {n.title}
                            {n.unread ? <span className="sr-only">（未讀）</span> : null}
                          </span>
                          <span className="block text-xs text-muted-foreground">{n.time}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full" aria-label={`使用者選單：${USER.name}`}>
                  <span
                    aria-hidden
                    className="flex size-7 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground"
                  >
                    {USER.name.slice(-1)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <span className="block text-sm text-foreground">{USER.name}</span>
                  <span className="block">{USER.account}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/settings")}>個人設定</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/settings/appearance")}>外觀</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>登出</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CommandPalette
            groups={[{ title: "切換應用", items: appLeaves }, ...menus]}
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            onNavigate={(url, item) => (item.external ? window.open(url, "_blank", "noopener") : navigate(url))}
            onAction={(_, item) => setPending(item)}
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
      {/* 功能選單與 ⌘K 的動作項落在這裡：元件只交回代號，開什麼由宿主決定 */}
      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.title.replace(/…$/, "")}</DialogTitle>
            <DialogDescription>內部試裝宿主不存資料：這個對話框示範「動作項由宿主的 onAction 接手」。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>取消</Button>
            <Button onClick={() => setPending(null)}>建立</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
