import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { ExternalLink, Menu } from "lucide-react";
import { findActiveNavLeaf, isNavAction, isNavActive, safeNavUrl, type NavAction, type NavGroup, type NavLeaf } from "../lib/nav";
import { cn } from "../lib/utils";
import { menuContentClass, menuItemClass } from "./dropdown-menu";
import { useSidebar } from "./sidebar";
import type { SidebarNavLinkProps } from "./sidebar-nav";

// 頂部功能選單（多應用外殼的中段）：NavGroup[] → 一組一個頂層選單，像 macOS 的選單列。
//
// - 資料契約與 SidebarNav、CommandPalette 是同一份：工作節奏分區從側欄搬到頂部，
//   分區規範（〈後台系統的資訊架構〉）原封不動適用；⌘K 一樣找得到每一項。
// - Radix Menubar 免費給 macOS 的行為：左右鍵在頂層選單間移動、開著時滑過另一個標題就切換、
//   Esc 關閉並把焦點還給標題。
// - 刻意只有一層（同 DropdownMenu 的收錄原則）：兩層群組（NavCollapsible）在選單裡
//   渲染成「分區標題＋子項」，不做往右彈的子選單——觸控與鍵盤都難操作。
// - 寬度不夠（行動版，或頂層標題擠不下）時全部收成單一「選單」鈕，
//   裡面依原順序列出每一區：不為窄螢幕另設計一套導覽。
// - 純呈現：連結經 renderLink 注入宿主的 Link，動作項只把代號交回 onAction。

export interface AppMenubarProps {
  /** 一組＝一個頂層選單（與 SidebarNav／CommandPalette 同一份資料）。 */
  groups: NavGroup[];
  /** active 判定的唯一輸入：所在的那一區標題加粗、畫底線，所在的那一項 aria-current。 */
  currentPath: string;
  /** 連結渲染注入，同 SidebarNav——注入端要原樣轉發收到的 props。 */
  renderLink?: (props: SidebarNavLinkProps, item: NavLeaf) => React.ReactElement;
  /** 覆寫預設的 isNavActive。 */
  isActive?: (item: NavLeaf, currentPath: string) => boolean;
  /** 動作項被選取時呼叫（開對話框之類）。 */
  onAction?: (action: string, item: NavAction) => void;
  /** menubar 的可及名稱。 */
  label?: string;
  /** 窄版單一選單鈕的文字。 */
  compactLabel?: string;
  className?: string;
}

const defaultRenderLink = (props: SidebarNavLinkProps) => <a {...props} />;

const triggerClass = cn(
  "state-layer relative flex h-8 shrink-0 cursor-default select-none items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm outline-none",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "data-[state=open]:[--state-layer-alpha:var(--state-selected-alpha)] [&_svg]:size-4 [&_svg]:shrink-0",
);

// 所在分區：加粗＋底線兩種編碼——強制色彩模式下背景色會被系統換掉，字重留得下來。
// 底線跟著文字色（currentColor）：選單列放在外殼（頂列）上，外殼的字色隨主題是近黑或近白。
const currentTriggerClass =
  "font-semibold after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-current";

const contentClass = cn(
  menuContentClass,
  "max-h-[var(--radix-menubar-content-available-height)] min-w-[12rem] overflow-y-auto",
);

function MenuSeparator() {
  return <MenubarPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <MenubarPrimitive.Label className="px-2 py-1.5 text-xs text-muted-foreground">{children}</MenubarPrimitive.Label>;
}

export function AppMenubar({
  groups,
  currentPath,
  renderLink = defaultRenderLink,
  isActive,
  onAction,
  label = "應用功能",
  compactLabel = "選單",
  className,
}: AppMenubarProps) {
  const { isMobile } = useSidebar();
  const active = isActive ?? ((item: NavLeaf, path: string) => isNavActive(item.url, path));
  const current = findActiveNavLeaf(groups, currentPath, active);

  // 擠不擠得下用一把隱形的「尺」量：它永遠照完整版排一次標題，跟容器寬度比。
  // 不拿選單本身量——收成單一鈕之後就量不到完整寬度，會在兩態之間來回跳。
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const [tooNarrow, setTooNarrow] = React.useState(false);
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const ruler = rulerRef.current;
    if (!container || !ruler) return;
    const check = () => setTooNarrow(ruler.scrollWidth > container.clientWidth + 1);
    check();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(check);
    ro.observe(container);
    return () => ro.disconnect();
  }, [groups]);
  const compact = isMobile || tooNarrow;

  const leafItem = (item: NavLeaf) => {
    const isCurrent = !item.external && current?.item === item;
    return (
      <MenubarPrimitive.Item key={item.title} asChild className={menuItemClass}>
        {renderLink(
          {
            href: safeNavUrl(item.url),
            "aria-current": isCurrent ? "page" : undefined,
            children: (
              <>
                {item.icon ? <item.icon /> : null}
                <span className="truncate">{item.title}</span>
                {item.external ? <ExternalLink aria-hidden className="ml-auto text-muted-foreground" /> : null}
              </>
            ),
            ...(item.external ? { target: "_blank", rel: "noreferrer" } : {}),
          },
          item,
        )}
      </MenubarPrimitive.Item>
    );
  };

  const actionItem = (item: NavAction) => (
    <MenubarPrimitive.Item key={item.title} className={menuItemClass} onSelect={() => onAction?.(item.action, item)}>
      {item.icon ? <item.icon /> : null}
      <span className="truncate">{item.title}</span>
      {item.shortcut ? (
        <span className="ml-auto pl-4 text-xs tracking-widest text-muted-foreground">{item.shortcut}</span>
      ) : null}
    </MenubarPrimitive.Item>
  );

  // 一組的內容：兩層群組前後各補一條分隔線，讓「分區標題＋子項」自成一塊
  const groupItems = (group: NavGroup) => {
    const out: React.ReactNode[] = [];
    group.items.forEach((item, i) => {
      const prev = group.items[i - 1];
      if (item.items) {
        if (i > 0) out.push(<MenuSeparator key={`${item.title}-sep`} />);
        out.push(
          <MenubarPrimitive.Group key={item.title}>
            <SectionLabel>{item.title}</SectionLabel>
            {item.items.map(leafItem)}
          </MenubarPrimitive.Group>,
        );
        return;
      }
      if (prev?.items) out.push(<MenuSeparator key={`${item.title}-sep`} />);
      out.push(isNavAction(item) ? actionItem(item) : leafItem(item));
    });
    return out;
  };

  return (
    <div ref={containerRef} className={cn("relative flex min-w-0 flex-1 items-center", className)}>
      <div ref={rulerRef} aria-hidden className="invisible absolute left-0 top-0 flex h-0 w-max gap-0.5 overflow-hidden">
        {groups.map((g) => (
          <span key={g.title} className={cn(triggerClass, "font-semibold")}>
            {g.title}
          </span>
        ))}
      </div>
      <MenubarPrimitive.Root aria-label={label} className="flex items-center gap-0.5">
        {compact ? (
          <MenubarPrimitive.Menu>
            <MenubarPrimitive.Trigger className={triggerClass}>
              <Menu aria-hidden />
              {compactLabel}
            </MenubarPrimitive.Trigger>
            <MenubarPrimitive.Portal>
              <MenubarPrimitive.Content align="start" sideOffset={8} className={contentClass}>
                {groups.map((group, i) => (
                  <MenubarPrimitive.Group key={group.title}>
                    {i > 0 ? <MenuSeparator /> : null}
                    <SectionLabel>{group.title}</SectionLabel>
                    {groupItems(group)}
                  </MenubarPrimitive.Group>
                ))}
              </MenubarPrimitive.Content>
            </MenubarPrimitive.Portal>
          </MenubarPrimitive.Menu>
        ) : (
          groups.map((group) => (
            <MenubarPrimitive.Menu key={group.title}>
              <MenubarPrimitive.Trigger
                data-current={current?.group === group ? "" : undefined}
                className={cn(triggerClass, current?.group === group && currentTriggerClass)}
              >
                {group.title}
              </MenubarPrimitive.Trigger>
              <MenubarPrimitive.Portal>
                <MenubarPrimitive.Content align="start" sideOffset={8} className={contentClass}>
                  {groupItems(group)}
                </MenubarPrimitive.Content>
              </MenubarPrimitive.Portal>
            </MenubarPrimitive.Menu>
          ))
        )}
      </MenubarPrimitive.Root>
    </div>
  );
}
