import type { LucideIcon } from "lucide-react";

// 導覽資料的框架無關契約（蒸餾自 shadcn-admin 的 sidebar-data pattern）。
//
// 單一來源、多個出口：同一份 NavGroup[] 同時餵側邊欄（SidebarNav）、
// 頂部功能選單（AppMenubar）與指令面板（CommandPalette），幾邊永遠一致——
// 導覽項改名不會出現「選單叫 A、搜尋叫 B」。分區的**規範**（依工作節奏、不依資料表）
// 見模式章〈後台系統的資訊架構〉；這裡只是那份規範的資料形狀。

/** 〔例行〕／〔試算〕標籤：這個畫面動不動到正式資料。 */
export type NavBadge = "routine" | "sandbox";

/** 葉節點：有 url、沒有子項。`items?: never` 讓 TS 強制互斥。 */
export interface NavLeaf {
  title: string;
  /** 純字串路徑，不綁任何 router——SPA 宿主經 renderLink 注入自家 Link。 */
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  /** 外部連結（操作手冊這類）：target=_blank、不參與 active 判定。 */
  external?: boolean;
  /**
   * 這一項代表的應用用哪一組環境色主題（`data-color-theme` 的值）。應用切換清單用它畫一塊
   * 「那個系統的外殼色」縮影，一眼認出每個應用；名稱照舊顯示，不靠顏色單獨辨識。
   */
  colorTheme?: string;
  items?: never;
  action?: never;
}

/** 可展開群組：有子項、自己沒有 url。刻意只兩層，不做無限遞迴。 */
export interface NavCollapsible {
  title: string;
  icon?: LucideIcon;
  items: NavLeaf[];
  url?: never;
  badge?: never;
  action?: never;
}

/**
 * 動作項：不導航，交給宿主執行（開對話框、重新整理這類）。
 * 元件只負責把 `action` 代號交回 `onAction`——它做什麼是應用層的決定，
 * 同 CommandPalette 不內建任何指令的理由。
 */
export interface NavAction {
  title: string;
  /** 動作代號，宿主依它分派。 */
  action: string;
  icon?: LucideIcon;
  /** 純顯示的快捷鍵提示；註冊快捷鍵仍是宿主的事（同 CommandActionItem.shortcut）。 */
  shortcut?: string;
  url?: never;
  items?: never;
  badge?: never;
  external?: never;
}

export type NavItem = NavLeaf | NavCollapsible | NavAction;

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export function isNavAction(item: NavItem): item is NavAction {
  return typeof (item as NavAction).action === "string";
}

/** findActiveNavLeaf 的回傳：所在的葉節點，連同它的分組與（兩層時的）父群組。 */
export interface ActiveNavLeaf {
  group: NavGroup;
  item: NavLeaf;
  parent?: NavCollapsible;
}

/**
 * 找出目前所在的葉節點。多個都亮時取 **url 最長**的那個——
 * `/settings` 與 `/settings/appearance` 同時符合時，後者才是「我在哪」。
 *
 * 外殼用它推兩件事：側欄（應用清單）裡目前是哪個應用、頂部功能選單裡目前在哪一區。
 * 外部連結與動作項不參與。
 */
export function findActiveNavLeaf(
  groups: NavGroup[],
  currentPath: string,
  isActive: (item: NavLeaf, currentPath: string) => boolean = (item, path) => isNavActive(item.url, path),
): ActiveNavLeaf | undefined {
  let best: ActiveNavLeaf | undefined;
  const consider = (group: NavGroup, item: NavLeaf, parent?: NavCollapsible) => {
    if (item.external || !isActive(item, currentPath)) return;
    if (!best || item.url.length > best.item.url.length) best = { group, item, parent };
  };
  for (const group of groups) {
    for (const item of group.items) {
      if (isNavAction(item)) continue;
      if (item.items) for (const sub of item.items) consider(group, sub, item);
      else consider(group, item);
    }
  }
  return best;
}

/**
 * 導覽項的 active 判定（多層 fallback，蒸餾自 shadcn-admin 的 checkIsActive）：
 * 完整相符 → 去 query/hash 與尾斜線後相符 → 路徑**邊界**上的父路徑相符
 * （`/settings` 在 `/settings/appearance` 時也亮，但 `/master` 不因
 * `/master-data` 而亮）。外部連結與根路徑不做前綴比對——根路徑會永遠 active。
 *
 * 純函式，tests/nav.test.ts 直接驗，不用開瀏覽器。
 */
export function isNavActive(url: string, currentPath: string, opts: { exact?: boolean } = {}): boolean {
  if (!url || /^[a-z]+:\/\//i.test(url)) return false;
  const clean = (s: string) => {
    const path = s.split(/[?#]/)[0] ?? "";
    const trimmed = path.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  };
  const target = clean(url);
  const current = clean(currentPath);
  if (target === current) return true;
  if (opts.exact) return false;
  return target !== "/" && current.startsWith(`${target}/`);
}

const SAFE_NAV_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * 導覽連結的網址白名單：相對路徑、http、https、mailto、tel 原樣放行，其他一律換成 `"#"`。
 *
 * 導覽資料常從後台設定或資料庫來；`javascript:`、`data:` 這類網址點下去會執行內容，
 * React 18 不會擋。判斷交給瀏覽器同一套網址解析（會先剝掉開頭空白與夾在中間的 Tab、換行），
 * 所以 ` javascript:` 或拆開的寫法也擋得住。SidebarNav、AppMenubar、CommandPalette 都經過它。
 */
export function safeNavUrl(url: string): string {
  try {
    return SAFE_NAV_PROTOCOLS.has(new URL(url, "http://relative.invalid").protocol) ? url : "#";
  } catch {
    return "#";
  }
}
