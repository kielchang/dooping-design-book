import { Link, useLocation } from "react-router";
import { LayoutTemplate } from "lucide-react";
import { PageHeader } from "@/components/dooping/page-header";
import { EmptyState } from "@/components/dooping/empty-state";
import { Button } from "@/components/dooping/button";
import { findActiveNavLeaf } from "@/lib/dooping/nav";
import { demoAppMenus } from "@/demo/sample-data";

/** 從同一份選單資料找標題——頁名與選單名永遠一致（跨頁守則：同一個東西全站同一個名字）。 */
function titleOf(path: string): string | undefined {
  for (const menus of Object.values(demoAppMenus)) {
    const hit = findActiveNavLeaf(menus, path, (item, p) => item.url === p.split(/[?#]/)[0]);
    if (hit) return hit.item.title;
  }
  return undefined;
}

/**
 * 選單裡還沒有頁型示範的功能，以及其他應用（/apps/*，真實部署時是別的系統）。
 * 內部試裝宿主只示範五種頁型——其餘留白，但仍是「一頁一個 h1、主內容在 main 裡」的完整頁面，
 * 功能選單與指令面板照樣走得到。
 */
export function PlaceholderPage() {
  const { pathname } = useLocation();
  const title = titleOf(pathname);
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader title={title ?? "找不到這一頁"} />
      <div className="rounded-lg border">
        <EmptyState
          icon={<LayoutTemplate className="size-7" />}
          title={title ? "這個分區還沒有內容" : "網址不在導覽裡"}
          hint="內部試裝宿主只示範五種頁型：清單、明細、表單、儀表板、設定。"
          action={
            <Button asChild size="sm">
              <Link to="/workbench">回工作台</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
