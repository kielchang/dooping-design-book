import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { ChevronsLeft, ChevronsRight, PanelLeft } from "lucide-react";
import { cn } from "@/lib/dooping/utils";
import { Button, type ButtonProps } from "@/components/dooping/button";
import { Tooltip } from "@/components/dooping/tooltip";

// 應用外殼的側邊欄家族：純呈現、不綁路由與資料，蒸餾自 shadcn sidebar、刻意精簡。
//
// 與 shadcn 上游的差異都是刻意決定：
// - 砍 variant="floating|inset"、SidebarRail、cookie 持久化、Ctrl+B 快捷鍵——
//   本庫無 SSR，持久化交宿主（defaultOpen＋受控 open）；
//   全域鍵位表是宿主的事（useSidebar().toggle() 自己掛）。
// - 收合形態兩種：icon（圖示欄，預設）與 offcanvas（收到 0、工作區最大）。
//   offcanvas 收合後滑鼠碰左緣會「窺看」——側欄浮在內容上、不推版面，離開就收；
//   釘選展開走拉環（點擊、拖拉、鍵盤都行；只靠 hover 揭露的功能等於對觸控與鍵盤不存在）。
// - 桌面版的收合入口是側欄右緣、固定在底部的**拉環**（Sidebar 自己畫，宿主不用接）：
//   點一下或左右拖拉切換。頂列的 SidebarTrigger 只在行動版出現，負責開抽屜——
//   頂列放切換鈕會跟功能選單混在一起，看不出它是收合側欄的。
//   多應用外殼的側欄是應用清單，見模式章〈後台系統的資訊架構〉。
// - 行動版抽屜用**既有的 Radix Dialog** 組左滑面板，不新收 Sheet——
//   focus trap／Esc／焦點歸還免費取得，且「分區與順序完全不變」自動成立
//   （同一份 children，模式章〈後台系統的資訊架構〉的行動版規範）。
// - 子元件與 --sidebar-* token 沿用 shadcn 命名，讓上游生態的 class 逐字對得上。

// ── 狀態 ──────────────────────────────────────────────────────

interface SidebarContextValue {
  /** 桌面收合狀態（行動版永遠是 expanded——抽屜打開就是全寬）。 */
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 桌面切收合、行動切抽屜——自動分流，拉環、SidebarTrigger 與宿主快捷鍵都走這裡。 */
  toggle: () => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** 內部使用：行動版抽屜的開啟者，關閉時把焦點還給它（我們不走 Radix Trigger，得自己記）。 */
  mobileOpenerRef: React.RefObject<HTMLElement | null>;
  /** offcanvas 收合態的窺看（浮在內容上的暫時展開）；釘選展開時一律為 false。 */
  peek: boolean;
  setPeek: (peek: boolean) => void;
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
  const [peekState, setPeek] = React.useState(false);
  const mobileOpenerRef = React.useRef<HTMLElement | null>(null);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  // 釘選展開或換成行動版，窺看就沒有意義——衍生而不是另外同步，免得兩個狀態打架
  const peek = peekState && !open && !isMobile;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setOpenState(next);
      setPeek(false);
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
    () => ({
      state: open ? "expanded" : "collapsed", open, setOpen, toggle, isMobile, openMobile, setOpenMobile, mobileOpenerRef,
      peek, setPeek,
    }),
    [open, setOpen, toggle, isMobile, openMobile, setOpenMobile, peek],
  );
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ── 容器 ──────────────────────────────────────────────────────

export interface SidebarProps extends React.ComponentPropsWithoutRef<"aside"> {
  /**
   * 桌面的收合形態：
   * "icon"＝收成圖示欄（預設）；"offcanvas"＝收到 0、滑鼠碰左緣窺看；"none"＝固定展開。
   */
  collapsible?: "icon" | "offcanvas" | "none";
  /** 導覽地標與行動版抽屜的可及名稱。 */
  label?: string;
}

// 窺看的開關延遲：開要一點猶豫（滑鼠路過左緣不該彈出來），
// 關要一點寬容（手抖出界一下不該立刻收掉）。
const PEEK_OPEN_DELAY = 120;
const PEEK_CLOSE_DELAY = 250;
// 拉環拖過這段距離（px）才算拖拉；不到就當成點擊
const PULL_DRAG_THRESHOLD = 24;

/**
 * 拉環：貼在側欄右緣、固定在底部的小標籤，像抽屜的拉環。點一下或左右拖拉切換展開／收合
 * （往左拖收合、往右拖展開）。拖拉是加分不是必要——點擊與鍵盤（Enter／空白鍵）都能切換，
 * 可及名稱與圖示跟著狀態變。展開狀態由 Sidebar 傳進來（讀釘選狀態，不是子元件看到的「眼前長怎樣」）。
 */
function SidebarPullTab({
  open,
  setOpen,
  className,
  onPointerEnter,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  onPointerEnter?: () => void;
}) {
  const drag = React.useRef<{ x: number; moved: boolean } | null>(null);
  const label = open ? "收合側邊欄" : "展開側邊欄";
  const Icon = open ? ChevronsLeft : ChevronsRight;
  return (
    <div data-sidebar-pull="" className={cn("z-10", className)} onPointerEnter={onPointerEnter}>
      {/* 提示的錨點固定成拉環大小：泡泡掛上去、還沒定位的那一刻不會把錨點撐寬，量到的位置才準 */}
      <Tooltip content={label} side="right" className="h-10 w-5">
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          className={cn(
            "state-layer flex h-10 w-5 touch-none items-center justify-center rounded-r-md border border-l-0 border-sidebar-border",
            "bg-sidebar text-sidebar-foreground shadow-sm outline-none [&_svg]:size-3.5 [&_svg]:shrink-0",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            drag.current = { x: e.clientX, moved: false };
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.moved) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) < PULL_DRAG_THRESHOLD) return;
            d.moved = true;
            if (dx < 0 && open) setOpen(false);
            else if (dx > 0 && !open) setOpen(true);
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onClick={() => {
            const moved = drag.current?.moved;
            drag.current = null;
            if (!moved) setOpen(!open);
          }}
        >
          <Icon aria-hidden />
        </button>
      </Tooltip>
    </div>
  );
}

export function Sidebar({
  collapsible = "icon",
  label = "主導覽",
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onBlur,
  ...props
}: SidebarProps) {
  const ctx = useSidebar();
  const { state, isMobile, openMobile, setOpenMobile, mobileOpenerRef, peek, setPeek } = ctx;
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  React.useEffect(() => clearTimer, [clearTimer]);
  const schedulePeek = (next: boolean) => {
    clearTimer();
    timer.current = setTimeout(() => setPeek(next), next ? PEEK_OPEN_DELAY : PEEK_CLOSE_DELAY);
  };

  // 子元件（SidebarNav、選單鈕的提示）看的是「眼前長怎樣」，不是釘選狀態：
  // offcanvas 沒有圖示欄這一態——看得到的時候一定是展開的樣子。
  const dataState = collapsible === "icon" ? state : "expanded";
  const childCtx = React.useMemo<SidebarContextValue>(() => ({ ...ctx, state: dataState }), [ctx, dataState]);

  const offcanvasCollapsed = collapsible === "offcanvas" && state === "collapsed" && !isMobile;
  const peeking = offcanvasCollapsed && peek;
  const hidden = offcanvasCollapsed && !peek;

  // Esc 收窺看要掛在 document：窺看是滑鼠叫出來的，焦點通常不在側欄裡
  React.useEffect(() => {
    if (!peeking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      clearTimer();
      setPeek(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [peeking, clearTimer, setPeek]);

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

  const nav = (
    <nav aria-label={label} className="flex h-full min-h-0 flex-col">
      {children}
    </nav>
  );

  if (collapsible === "offcanvas") {
    // 側欄本體永遠是 fixed、靠位移滑進滑出；版面佔位另外一塊——
    // 釘選展開時佔位推開內容，窺看時不佔位（浮在內容上）。
    // 同一塊元素在 fixed 與流內之間換來換去，收窺看那一下寬度動畫會把內容推一下。
    return (
      <SidebarContext.Provider value={childCtx}>
        <div
          aria-hidden
          className={cn(
            "shrink-0 transition-[width] duration-normal ease-standard motion-reduce:transition-none",
            state === "expanded" ? "w-64" : "w-0",
          )}
        />
        {hidden ? (
          <div
            aria-hidden
            data-sidebar-edge=""
            className="fixed inset-y-0 left-0 z-[45] w-2"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") schedulePeek(true);
            }}
            onPointerLeave={clearTimer}
          />
        ) : null}
        <aside
          data-state={dataState}
          data-collapsible={collapsible}
          data-peek={peeking ? "" : undefined}
          // 收到 0 的側欄用 inert 整塊移出 Tab 順序與無障礙樹——移出畫面不等於鍵盤走不進去
          inert={hidden || undefined}
          className={cn(
            "group/sidebar fixed inset-y-0 left-0 z-[45] flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
            "transition-transform duration-normal ease-standard motion-reduce:transition-none",
            hidden ? "-translate-x-full" : "translate-x-0",
            peeking && "shadow-lg",
            className,
          )}
          onPointerEnter={(e) => {
            onPointerEnter?.(e);
            if (peeking) clearTimer();
          }}
          onPointerLeave={(e) => {
            onPointerLeave?.(e);
            // 焦點還在裡面（鍵盤使用者正在裡面走）就不收——收了焦點會掉到 body
            if (peeking && e.pointerType === "mouse" && !e.currentTarget.contains(document.activeElement)) {
              schedulePeek(false);
            }
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (peeking && !e.currentTarget.contains(e.relatedTarget as Node | null)) setPeek(false);
          }}
          {...props}
        >
          {nav}
        </aside>
        {/* 拉環放在 aside 外面：收合時 aside 是 inert，拉環要留在左緣、點得到也 Tab 得到 */}
        <SidebarPullTab
          open={state === "expanded"}
          setOpen={ctx.setOpen}
          className={cn(
            "fixed bottom-6 z-[46] transition-[left] duration-normal ease-standard motion-reduce:transition-none",
            hidden ? "left-0" : "left-64",
          )}
          onPointerEnter={() => {
            // 窺看中滑到拉環上：別讓「離開側欄就收」先把它收掉
            if (peeking) clearTimer();
          }}
        />
      </SidebarContext.Provider>
    );
  }

  const pullTab =
    collapsible === "icon" ? (
      <SidebarPullTab open={state === "expanded"} setOpen={ctx.setOpen} className="absolute bottom-6 left-full -ml-px" />
    ) : null;

  return (
    <SidebarContext.Provider value={childCtx}>
      <aside
        data-state={dataState}
        data-collapsible={collapsible}
        className={cn(
          // 貼著視窗頂端：長頁面捲動時應用清單不跟著捲走
          "group/sidebar sticky top-0 flex h-svh shrink-0 flex-col self-start border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
          "transition-[width] duration-normal ease-standard motion-reduce:transition-none",
          dataState === "collapsed" ? "w-14" : "w-64",
          className,
        )}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onBlur={onBlur}
        {...props}
      >
        {nav}
        {pullTab}
      </aside>
    </SidebarContext.Provider>
  );
}

/**
 * 行動版的抽屜開關，放在頂列。桌面版不渲染——收合入口是 Sidebar 右緣的拉環。
 * 頂列照樣放 `<SidebarTrigger />`：寬螢幕時它自動消失，窄螢幕時出現。
 */
export const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps & { label?: string }>(
  ({ className, onClick, label = "切換側邊欄", ...props }, ref) => {
    const { toggle, isMobile, openMobile } = useSidebar();
    if (!isMobile) return null;
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-expanded={openMobile}
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
      <Tooltip content={tooltip} side="right" className="w-full">
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
