// 應用外殼的側邊欄家族（ADR-0011，蒸餾自 shadcn sidebar，刻意精簡）。
//
// 與 shadcn 上游的差異都是刻意決定：
// - 砍 variant="floating|inset"、SidebarRail、cookie 持久化、Ctrl+B 快捷鍵——
//   後台 IA 規範只有一種側欄形態；本庫無 SSR，持久化交宿主（defaultOpen＋受控 open）；
//   全域鍵位表是宿主的事（useSidebar().toggle() 自己掛）。
// - 行動版抽屜用**既有的 Radix Dialog** 組左滑面板，不新收 Sheet——
//   focus trap／Esc／焦點歸還免費取得，且「分區與順序完全不變」自動成立
//   （同一份 children，模式章〈後台系統的資訊架構〉的行動版規範）。
// - 子元件與 --sidebar-* token 沿用 shadcn 命名，讓上游生態的 class 逐字對得上。
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";
import { Tooltip } from "./tooltip";

// ── 狀態 ──────────────────────────────────────────────────────

interface SidebarContextValue {
  /** 桌面收合狀態（行動版永遠是 expanded——抽屜打開就是全寬）。 */
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 桌面切收合、行動切抽屜——自動分流，SidebarTrigger 與宿主快捷鍵都走這裡。 */
  toggle: () => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** 內部使用：行動版抽屜的開啟者，關閉時把焦點還給它（我們不走 Radix Trigger，得自己記）。 */
  mobileOpenerRef: React.RefObject<HTMLElement | null>;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar 必須在 <SidebarProvider> 內使用");
  return ctx;
}

/** SSR 安全的媒體查詢（伺服器端回 false＝桌面版）。 */
function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  /** 非受控的初始展開狀態。要持久化就改用受控 open/onOpenChange＋宿主自己的儲存。 */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * 行動版判定，預設 "(max-width: 767px)"。
   * story 用它做確定性驗收（傳 "(min-width: 0px)" 強制行動版），不賭 viewport addon。
   */
  mobileQuery?: string;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  mobileQuery = "(max-width: 767px)",
}: SidebarProviderProps) {
  const isMobile = useMediaQuery(mobileQuery);
  const [openState, setOpenState] = React.useState(defaultOpen);
  const [openMobile, setOpenMobileState] = React.useState(false);
  const mobileOpenerRef = React.useRef<HTMLElement | null>(null);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  // 開抽屜的當下記住是誰開的——關閉時 Sidebar 把焦點還給它
  const setOpenMobile = React.useCallback((next: boolean) => {
    if (next && typeof document !== "undefined") {
      mobileOpenerRef.current = document.activeElement as HTMLElement | null;
    }
    setOpenMobileState(next);
  }, []);
  const toggle = React.useCallback(() => {
    if (isMobile) setOpenMobile(!openMobile);
    else setOpen(!open);
  }, [isMobile, openMobile, setOpenMobile, open, setOpen]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({ state: open ? "expanded" : "collapsed", open, setOpen, toggle, isMobile, openMobile, setOpenMobile, mobileOpenerRef }),
    [open, setOpen, toggle, isMobile, openMobile, setOpenMobile],
  );
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ── 容器 ──────────────────────────────────────────────────────

export interface SidebarProps extends React.ComponentPropsWithoutRef<"aside"> {
  /** "icon"＝桌面可收成圖示欄（預設）；"none"＝固定展開。 */
  collapsible?: "icon" | "none";
  /** 導覽地標與行動版抽屜的可及名稱。 */
  label?: string;
}

export function Sidebar({ collapsible = "icon", label = "主導覽", className, children, ...props }: SidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile, mobileOpenerRef } = useSidebar();

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="group/sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg outline-none"
            data-state="expanded"
            // 焦點歸還：開關不走 Radix Trigger（狀態在 context），Radix 不知道誰開的
            onCloseAutoFocus={(e) => {
              const opener = mobileOpenerRef.current;
              if (opener?.isConnected) {
                e.preventDefault();
                opener.focus();
              }
            }}
          >
            <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
            <nav aria-label={label} className="flex h-full min-h-0 flex-col">
              {children}
            </nav>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  const dataState = collapsible === "none" ? "expanded" : state;
  return (
    <aside
      data-state={dataState}
      className={cn(
        "group/sidebar flex h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "transition-[width] duration-normal ease-standard motion-reduce:transition-none",
        dataState === "collapsed" ? "w-14" : "w-64",
        className,
      )}
      {...props}
    >
      <nav aria-label={label} className="flex h-full min-h-0 flex-col">
        {children}
      </nav>
    </aside>
  );
}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps & { label?: string }>(
  ({ className, onClick, label = "切換側邊欄", ...props }, ref) => {
    const { toggle, isMobile, open, openMobile } = useSidebar();
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-expanded={isMobile ? openMobile : open}
        className={cn("size-8", className)}
        onClick={(e) => {
          onClick?.(e);
          toggle();
        }}
        {...props}
      >
        <PanelLeft />
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

// ── 結構件 ────────────────────────────────────────────────────

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-auto", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-7 items-center rounded-md px-2 text-xs text-muted-foreground",
        "group-data-[state=collapsed]/sidebar:sr-only",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex w-full min-w-0 list-none flex-col gap-1 p-0", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)} {...props} />;
}

// ── 選單鈕 ────────────────────────────────────────────────────

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  /**
   * 選中態：`bg-sidebar-accent`（＝該主題的 brand-subtle，識別層）。
   * 刻意**不用** state-layer 的 data-state=selected 疊加——淡底上再疊 currentColor
   * 會把文字對比吃掉；hover 仍走 state-layer（疊在 accent 上只有 6%，無害）。
   */
  isActive?: boolean;
  /** icon 收合態顯示的提示（展開時文字就在旁邊，重複的 tooltip 是噪音）。 */
  tooltip?: string;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild = false, isActive = false, tooltip, className, children, ...props }, ref) => {
    const { state, isMobile } = useSidebar();
    const cls = cn(
      "state-layer flex h-9 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
      "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
      "group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0",
      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      className,
    );
    // asChild 時把樣式套到子元素——導覽是真 <a>，中鍵開新分頁、複製連結都要能用
    const Comp = asChild ? Slot : "button";
    const inner = (
      <Comp ref={ref} type={asChild ? undefined : "button"} className={cls} {...props}>
        {children}
      </Comp>
    );
    if (!tooltip || isMobile || state !== "collapsed") return inner;
    return (
      <Tooltip content={tooltip} className="w-full">
        {inner}
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/** 展開態的子選單（收合態改由 DropdownMenu 彈出，見 SidebarNav）。 */
export function SidebarMenuSub({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "mx-3.5 flex min-w-0 list-none flex-col gap-1 border-l border-sidebar-border py-0.5 pl-2.5",
        "group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)} {...props} />;
}

export interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

export const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ asChild = false, isActive = false, className, children, ...props }, ref) => {
    const cls = cn(
      "state-layer flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
      "disabled:pointer-events-none disabled:opacity-50",
      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      className,
    );
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} type={asChild ? undefined : "button"} className={cls} {...props}>
        {children}
      </Comp>
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
