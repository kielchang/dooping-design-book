import * as React from "react";
import { ChevronRight } from "lucide-react";
import { isNavActive, type NavGroup, type NavLeaf } from "../lib/nav";
import { Badge } from "./badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "./sidebar";

// NavGroup[] → 側邊欄的三態渲染（蒸餾自 shadcn-admin 的 nav-group）：
// 葉節點＝連結；兩層群組在展開態＝Collapsible、在 icon 收合態＝往右彈出的 DropdownMenu。
// 同一份資料也餵 CommandPalette——單一來源，兩個出口。

/** renderLink 收到的 props——注入端要**原樣轉發**（onClick 帶著行動版關抽屜的行為）。 */
export interface SidebarNavLinkProps {
  href: string;
  "aria-current"?: "page";
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler;
}

export interface SidebarNavProps {
  groups: NavGroup[];
  /** active 判定的唯一輸入（pathname；含 query 也可，比對時會剝掉）。 */
  currentPath: string;
  /**
   * 連結渲染注入。預設渲染真 `<a href>`（MPA／文件站直接可用）；
   * SPA 宿主在這裡換成自家 `<Link>`，其餘 props 原樣轉發。
   */
  renderLink?: (props: SidebarNavLinkProps, item: NavLeaf) => React.ReactElement;
  /** 覆寫預設的 isNavActive（例如宿主要用 route matcher）。 */
  isActive?: (item: NavLeaf, currentPath: string) => boolean;
  /** 〔例行〕〔試算〕標籤文字。 */
  labels?: { routine?: string; sandbox?: string };
}

const defaultRenderLink = (props: SidebarNavLinkProps) => <a {...props} />;

/** 標籤語意固定：例行＝正式作業（中性）、試算＝沙盒（info）。文字本身就是語意，不靠色。 */
function NavBadgeTag({ badge, labels }: { badge: NavLeaf["badge"]; labels: Required<NonNullable<SidebarNavProps["labels"]>> }) {
  if (!badge) return null;
  return (
    <Badge
      variant={badge === "sandbox" ? "info" : "secondary"}
      className="ml-auto shrink-0 px-1.5 py-0 text-[10px] group-data-[state=collapsed]/sidebar:hidden"
    >
      {labels[badge]}
    </Badge>
  );
}

export function SidebarNav({
  groups,
  currentPath,
  renderLink = defaultRenderLink,
  isActive,
  labels: labelsProp,
}: SidebarNavProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const labels = { routine: "例行", sandbox: "試算", ...labelsProp };
  const active = isActive ?? ((item: NavLeaf, path: string) => isNavActive(item.url, path));
  const collapsed = state === "collapsed" && !isMobile;

  const leafLink = (item: NavLeaf, sub = false) => {
    const isCurrent = !item.external && active(item, currentPath);
    const link = renderLink(
      {
        href: item.url,
        "aria-current": isCurrent ? "page" : undefined,
        children: (
          <>
            {item.icon ? <item.icon /> : null}
            {/* 收合態用 sr-only 不用 hidden：display:none 會把連結的可及名稱一起藏掉 */}
            <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">{item.title}</span>
            <NavBadgeTag badge={item.badge} labels={labels} />
          </>
        ),
        // 行動版點選後關抽屜——使用者選完目的地，留著抽屜只是擋住他要去的地方
        onClick: isMobile ? () => setOpenMobile(false) : undefined,
        ...(item.external ? { target: "_blank", rel: "noreferrer" } : {}),
      },
      item,
    );
    return sub ? (
      <SidebarMenuSubButton asChild isActive={isCurrent}>{link}</SidebarMenuSubButton>
    ) : (
      <SidebarMenuButton asChild isActive={isCurrent} tooltip={item.title}>{link}</SidebarMenuButton>
    );
  };

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              if (!item.items) {
                return <SidebarMenuItem key={item.title}>{leafLink(item)}</SidebarMenuItem>;
              }
              const anyChildActive = item.items.some((sub) => active(sub, currentPath));

              // icon 收合態：子選單改往右彈出（Collapsible 在 3.5rem 寬的欄裡放不下）
              if (collapsed) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton isActive={anyChildActive} tooltip={item.title}>
                          {item.icon ? <item.icon /> : null}
                          <span className="sr-only">{item.title}</span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                        {item.items.map((sub) => (
                          <DropdownMenuItem key={sub.title} asChild>
                            {renderLink(
                              {
                                href: sub.url,
                                "aria-current": active(sub, currentPath) ? "page" : undefined,
                                children: sub.title,
                              },
                              sub,
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              }

              // 展開態：Collapsible，含 active 子項的群組預設展開（使用者「在裡面」）
              return (
                <Collapsible key={item.title} asChild defaultOpen={anyChildActive}>
                  <SidebarMenuItem className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.icon ? <item.icon /> : null}
                        <span className="truncate">{item.title}</span>
                        <ChevronRight className="ml-auto shrink-0 transition-transform duration-fast group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>{leafLink(sub, true)}</SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
