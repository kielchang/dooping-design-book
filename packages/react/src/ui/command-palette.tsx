import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import type { NavGroup, NavLeaf } from "../lib/nav";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut,
} from "./command";

export interface CommandActionItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** 純顯示的快捷鍵提示；註冊快捷鍵仍是宿主的事。 */
  shortcut?: string;
  /** 額外的搜尋關鍵字（同義詞、舊名）。 */
  keywords?: string[];
  run: () => void;
}

export interface CommandActionGroup {
  heading: string;
  items: CommandActionItem[];
}

export interface CommandPaletteProps {
  /** 導覽區：**同一份**餵側邊欄的 NavGroup[]。兩層項目顯示成「父 › 子」。 */
  groups?: NavGroup[];
  /** 自訂指令群（主題切換這類）。元件不內建任何指令——那是應用層的決定。 */
  actions?: CommandActionGroup[];
  /** 選中導覽項時呼叫。palette 內的項目是 option 不是連結——導航方式由宿主決定。 */
  onNavigate?: (url: string, item: NavLeaf) => void;
  /** 受控開關；不給就用內部狀態（配 hotkey 即可獨立運作）。 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * 快捷鍵字母，預設 "k"（⌘K／Ctrl+K 開關）。`false` 表示不註冊——
   * 宿主要接自己的鍵位系統時用受控模式＋false。
   * 放元件內是刻意的：palette 天生全站單例，「⌘K 開啟」是它的行為規範，
   * 規範要能被 play function 驗收就得住在元件裡（同 Toast 自帶 viewport 的取捨）。
   */
  hotkey?: string | false;
  placeholder?: string;
  emptyText?: string;
  title?: string;
}

/**
 * 全域指令面板。導覽資料單一來源（與 SidebarNav 同一份 NavGroup[]），
 * 外加宿主自訂的指令群。
 */
export function CommandPalette({
  groups = [],
  actions = [],
  onNavigate,
  open: openProp,
  onOpenChange,
  hotkey = "k",
  placeholder = "搜尋頁面或指令…",
  emptyText = "查無符合的結果",
  title = "指令面板",
}: CommandPaletteProps) {
  const [openState, setOpenState] = React.useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  React.useEffect(() => {
    if (hotkey === false) return;
    const key = hotkey.toLowerCase();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey, open, setOpen]);

  // 執行即關閉：選了項目卻留著面板，會讓人懷疑「到底有沒有生效」
  const runCommand = React.useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    [setOpen],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title={title}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.items.flatMap((item) =>
              item.items
                ? item.items.map((sub) => (
                    <CommandItem
                      key={`${item.title}-${sub.title}`}
                      value={`${item.title} ${sub.title}`}
                      onSelect={() => runCommand(() => onNavigate?.(sub.url, sub))}
                    >
                      {item.icon ? <item.icon /> : null}
                      <span className="flex items-center gap-1">
                        {item.title}
                        <ChevronRight className="size-3 text-muted-foreground" />
                        {sub.title}
                      </span>
                    </CommandItem>
                  ))
                : [
                    <CommandItem
                      key={item.title}
                      value={item.title}
                      onSelect={() => runCommand(() => onNavigate?.(item.url, item))}
                    >
                      {item.icon ? <item.icon /> : null}
                      {item.title}
                    </CommandItem>,
                  ],
            )}
          </CommandGroup>
        ))}
        {actions.map((group) => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.items.map((action) => (
              <CommandItem
                key={action.id}
                value={[action.label, ...(action.keywords ?? [])].join(" ")}
                onSelect={() => runCommand(action.run)}
              >
                {action.icon ? <action.icon /> : null}
                {action.label}
                {action.shortcut ? <CommandShortcut>{action.shortcut}</CommandShortcut> : null}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
