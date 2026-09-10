import type { LucideIcon } from "lucide-react";

// 導覽資料的框架無關契約（蒸餾自 shadcn-admin 的 sidebar-data pattern）。
//
// 單一來源、多個出口：同一份 NavGroup[] 同時餵側邊欄（SidebarNav）與
// 指令面板（CommandPalette），兩邊永遠一致——導覽項改名不會出現
// 「側欄叫 A、搜尋叫 B」。分區的**規範**（依工作節奏、不依資料表）
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
  items?: never;
}

/** 可展開群組：有子項、自己沒有 url。刻意只兩層，不做無限遞迴。 */
export interface NavCollapsible {
  title: string;
  icon?: LucideIcon;
  items: NavLeaf[];
  url?: never;
  badge?: never;
}

export type NavItem = NavLeaf | NavCollapsible;

export interface NavGroup {
  title: string;
  items: NavItem[];
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
