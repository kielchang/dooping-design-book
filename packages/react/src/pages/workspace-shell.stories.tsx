import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import type { LucideIcon } from "lucide-react";
import { Bell, Briefcase, CalendarDays, FolderOpen, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "../ui/app-shell";
import { AppMenubar } from "../ui/app-menubar";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "../ui/sidebar";
import { SidebarNav, type SidebarNavLinkProps } from "../ui/sidebar-nav";
import { CommandPalette } from "../ui/command-palette";
import { PageHeader } from "../ui/page-header";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { findActiveNavLeaf, isNavActive, type NavAction, type NavGroup, type NavLeaf } from "../lib/nav";
import { cn } from "../lib/utils";
import { demoAppMenus, demoApps, demoNotifications } from "../demo/sample-data";

// 多應用外殼：側欄切應用、頂部切功能（〈後台系統的資訊架構〉的「多應用系統」一節）。
//
// 這一支是組法的正本——宿主（apps/host-v4）照同一個組法接自己的路由。它回答三個問題：
// ① 換應用時頂部功能選單整組換掉，側欄、選單、⌘K 三個出口吃同一份資料；
// ② 頂列左右兩段留給系統（開關＋目前應用／搜尋・通知・使用者），中段才是應用的功能；
// ③ 一頁一個 h1、頂列不重複頁面標題，在換應用之後仍成立。
const meta: Meta = { title: "頁面/多應用外殼" };
export default meta;
type Story = StoryObj;

// icon 以標題對映留在 story 端（sample-data 不帶 UI 相依）
const APP_ICONS: Record<string, LucideIcon> = {
  作業中心: Briefcase, 文件庫: FolderOpen, 排程: CalendarDays, 系統管理: ShieldCheck,
};
const apps: NavGroup[] = demoApps.map((g) => ({
  ...g,
  items: g.items.map((i) => ({ ...i, icon: APP_ICONS[i.title] })),
}));
const appLeaves = apps.flatMap((g) => g.items) as NavLeaf[];

/**
 * 「目前在哪個應用」：路徑落在應用自己的 url 底下，或落在它任一個功能項上。
 * 跨系統部署（每個應用一個網域）時改成比對網域——接縫就是 SidebarNav／findActiveNavLeaf 的 isActive。
 */
const isAppActive = (app: NavLeaf, path: string) =>
  isNavActive(app.url, path) || Boolean(findActiveNavLeaf(demoAppMenus[app.url] ?? [], path));

// 桌面／行動釘死；桌面版再釘最小寬度——功能選單「擠不下就收合」是量出來的，
// 不釘的話窄視窗看到的是收合態，play 的性質會隨觀看者的視窗寬度改變。
const FORCE_DESKTOP = "(max-width: 0px)";
const FORCE_MOBILE = "(min-width: 0px)";
const DESKTOP_MIN_WIDTH = "min-w-[1100px]";
const USER = { name: "使用者甲", account: "user-a" };

/** 同 react-router 的 Link：先交給轉發來的 onClick（Radix 選單在這裡關），沒被攔下才導航。 */
function StoryLink({ onClick, onNavigate, ...props }: SidebarNavLinkProps & { onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        if (!props.target) onNavigate(props.href);
      }}
    />
  );
}

function Workspace({
  collapsible,
  mobileQuery = FORCE_DESKTOP,
  defaultOpen,
  followAppTheme = false,
}: {
  collapsible?: "icon" | "offcanvas";
  mobileQuery?: string;
  defaultOpen?: boolean;
  /**
   * 外殼跟著目前應用的環境色走。真實部署時每個應用是各自的系統、在自己的 <html> 鎖一組主題；
   * 這裡用主題島（外層 data-color-theme）模擬「切到另一個系統」。
   */
  followAppTheme?: boolean;
}) {
  const [path, setPath] = useState("/workbench");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [pending, setPending] = useState<NavAction | null>(null);

  const app = findActiveNavLeaf(apps, path, isAppActive)?.item ?? appLeaves[0];
  const menus = demoAppMenus[app.url] ?? [];
  const page = findActiveNavLeaf(menus, path)?.item;
  const AppIcon = app.icon;
  const unread = demoNotifications.filter((n) => n.unread).length;
  const renderLink = (props: SidebarNavLinkProps) => <StoryLink {...props} onNavigate={setPath} />;

  const shell = (
    <AppShell
      mobileQuery={mobileQuery}
      defaultOpen={defaultOpen}
      className={mobileQuery === FORCE_DESKTOP ? DESKTOP_MIN_WIDTH : undefined}
      sidebar={
        <Sidebar label="應用程式" collapsible={collapsible}>
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 font-semibold">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-sidebar-primary text-xs text-sidebar-primary-foreground">D</span>
              <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">工作平台</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={apps} currentPath={path} isActive={isAppActive} renderLink={renderLink} />
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
          {/* 中段（應用）：目前應用的功能選單——換應用就整組換掉 */}
          <AppMenubar
            groups={menus}
            currentPath={path}
            renderLink={renderLink}
            onAction={(_, item) => setPending(item)}
          />
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
                      <a
                        href={n.url}
                        onClick={(e) => {
                          e.preventDefault();
                          setNoticeOpen(false);
                          setPath(n.url);
                        }}
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
                      </a>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full" aria-label={`使用者選單：${USER.name}`}>
                  <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
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
                <DropdownMenuItem>個人設定</DropdownMenuItem>
                <DropdownMenuItem>外觀</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>登出</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CommandPalette
            groups={[{ title: "切換應用", items: appLeaves }, ...menus]}
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            onNavigate={(url) => setPath(url)}
            onAction={(_, item) => setPending(item)}
          />
        </>
      }
    >
      <div className="space-y-4">
        <PageHeader title={page?.title ?? app.title} meta={`${app.title}・${path}`} />
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            應用內容區。側欄切應用、頂部選單切這個應用裡的功能；收合側欄時工作區拿回整個寬度。
          </CardContent>
        </Card>
      </div>
      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.title.replace(/…$/, "")}</DialogTitle>
            <DialogDescription>動作項不導航：選單把代號交回 onAction，由宿主決定開什麼。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>取消</Button>
            <Button onClick={() => setPending(null)}>建立</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
  // display: contents——不佔版面，只讓底下的外殼鍵換成目前應用的那一組（CSS 變數照 DOM 繼承）
  return followAppTheme ? <div className="contents" data-color-theme={app.colorTheme}>{shell}</div> : shell;
}

/** WCAG 相對亮度與對比——play 量外殼徽章外圈用。 */
const luminance = (rgb: number[]) =>
  rgb.map((v) => v / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrastOf = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const rgbOf = (css: string) => (css.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);

export const 切換應用: Story = {
  render: () => <Workspace />,
  // 契約：換應用 → 頂部選單整組換掉、側欄標出目前應用；一頁一個 h1、頂列不重複頁面標題；
  // 動作項開對話框；⌘K 同時找得到應用與功能；通知可點、直接到目的地。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const header = canvasElement.querySelector("header") as HTMLElement;
    const main = canvasElement.querySelector("main") as HTMLElement;
    const nav = canvas.getByRole("navigation", { name: "應用程式" });
    const bar = () => canvas.getByRole("menubar", { name: "應用功能" });

    const expectPage = async (title: string) => {
      await waitFor(() => {
        const h1s = canvas.getAllByRole("heading", { level: 1 });
        expect(h1s).toHaveLength(1);
        expect(h1s[0]).toHaveTextContent(title);
        expect(main.contains(h1s[0])).toBe(true);
      });
      expect(header.textContent).not.toContain(title);
    };

    await expectPage("工作台");
    await expect(within(nav).getByRole("link", { name: /作業中心/ })).toHaveAttribute("aria-current", "page");
    await expect(within(bar()).getByRole("menuitem", { name: "每日作業" })).toBeInTheDocument();

    // ① 換應用：選單整組換掉
    await userEvent.click(within(nav).getByRole("link", { name: /文件庫/ }));
    await expectPage("全部文件");
    await expect(within(nav).getByRole("link", { name: /文件庫/ })).toHaveAttribute("aria-current", "page");
    await waitFor(() => expect(within(bar()).getByRole("menuitem", { name: "整理" })).toBeInTheDocument());
    expect(within(bar()).queryByRole("menuitem", { name: "每日作業" })).toBeNull();

    // 動作項 → 對話框
    await userEvent.click(within(bar()).getByRole("menuitem", { name: "整理" }));
    await userEvent.click(within(await body.findByRole("menu")).getByRole("menuitem", { name: "新增資料夾…" }));
    const dialog = await body.findByRole("dialog", { name: "新增資料夾" });
    await userEvent.click(within(dialog).getByRole("button", { name: "取消" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());

    // ⌘K：應用與目前應用的功能都在
    await userEvent.click(canvas.getByRole("button", { name: /搜尋/ }));
    const palette = await body.findByRole("dialog", { name: "指令面板" });
    await expect(within(palette).getByRole("option", { name: /最近開啟/ })).toBeInTheDocument();
    await expect(within(palette).getByRole("option", { name: /新增資料夾/ })).toBeInTheDocument();
    await userEvent.click(within(palette).getByRole("option", { name: /作業中心/ }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expectPage("工作台");
    await waitFor(() => expect(within(bar()).getByRole("menuitem", { name: "每日作業" })).toBeInTheDocument());

    // 通知：未讀數在名字裡（不只靠徽章的顏色），點一則直接到目的地
    await userEvent.click(canvas.getByRole("button", { name: "通知，2 則未讀" }));
    const notice = await body.findByRole("dialog");
    await userEvent.click(within(notice).getByRole("link", { name: /B-0217/ }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expectPage("批次結算");
  },
};

export const 環境色跟著應用: Story = {
  render: () => <Workspace followAppTheme />,
  // 契約：主題只換外殼（側欄＋頂列）。切到另一個應用，外殼換成那個應用的環境色——
  // 頂列的底色等於應用清單裡那個應用色塊的底色（色塊是主題島，畫的就是那個系統的外殼色）；
  // 內容區不跟著變。外殼上的通知數有一圈外殼字色的外圈，紅點才不會糊進深色外殼。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector("header") as HTMLElement;
    // 內容區的底色畫在 AppShell 的根（main 本身透明）
    const content = (canvasElement.querySelector("main") as HTMLElement).closest(".min-h-svh") as HTMLElement;
    const nav = canvas.getByRole("navigation", { name: "應用程式" });
    const tileOf = (name: RegExp) =>
      within(nav).getByRole("link", { name }).querySelector("[data-app-tile]") as HTMLElement;
    const bg = (el: HTMLElement) => getComputedStyle(el).backgroundColor;

    const contentBefore = bg(content);
    await waitFor(() => expect(bg(header)).toBe(bg(tileOf(/作業中心/))));

    await userEvent.click(within(nav).getByRole("link", { name: /文件庫/ }));
    await waitFor(() => expect(bg(header)).toBe(bg(tileOf(/文件庫/))));
    expect(bg(header)).not.toBe(bg(tileOf(/作業中心/)));
    // 內容區維持中性：換環境不換內容面的底色
    expect(bg(content)).toBe(contentBefore);

    // 外殼上的通知數：外圈＝外殼字色，紅點對外圈 ≥ 3:1（WCAG 1.4.11）
    const badge = canvasElement.querySelector("[data-shell-badge]") as HTMLElement;
    const ink = getComputedStyle(header).color;
    expect(getComputedStyle(badge).boxShadow).toContain(ink);
    expect(contrastOf(rgbOf(getComputedStyle(badge).backgroundColor), rgbOf(ink))).toBeGreaterThanOrEqual(3);
  },
};

export const 收合到零: Story = {
  render: () => <Workspace collapsible="offcanvas" defaultOpen={false} />,
  // 契約：offcanvas 收合是工作區最大的形態；碰左緣叫出應用清單（浮層），選了就收、頂部選單跟著換。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aside = canvasElement.querySelector("aside") as HTMLElement;
    await expect(aside).toHaveAttribute("inert");
    await userEvent.hover(canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await userEvent.click(within(aside).getByRole("link", { name: /排程/ }));
    await waitFor(() => expect(aside).toHaveAttribute("inert"));
    const bar = canvas.getByRole("menubar", { name: "應用功能" });
    await waitFor(() => expect(within(bar).getByRole("menuitem", { name: "檢視" })).toBeInTheDocument());
  },
};

export const 行動版: Story = {
  render: () => <Workspace mobileQuery={FORCE_MOBILE} />,
  // 契約：行動版側欄是抽屜（應用清單同一份、同順序），功能選單收成單一「選單」鈕，右段工具剩圖示。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", { name: "應用功能" });
    expect(within(bar).getAllByRole("menuitem")).toHaveLength(1);

    await userEvent.click(canvas.getByRole("button", { name: "切換側邊欄" }));
    const drawer = await body.findByRole("dialog", { name: "應用程式" });
    await userEvent.click(within(drawer).getByRole("link", { name: /排程/ }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());

    await userEvent.click(within(bar).getByRole("menuitem", { name: "選單" }));
    const menu = await body.findByRole("menu");
    await expect(within(menu).getByText("檢視")).toBeVisible();
    await expect(within(menu).getByRole("menuitem", { name: /新增排程/ })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};
