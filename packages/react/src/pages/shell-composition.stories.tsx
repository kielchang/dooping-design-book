import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, CircleHelp, ClipboardCheck, Database, FileText, Layers, LayoutDashboard, LineChart, Plus, Settings,
} from "lucide-react";
import { AppShell } from "../ui/app-shell";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "../ui/sidebar";
import { SidebarNav, type SidebarNavLinkProps } from "../ui/sidebar-nav";
import { PageHeader, BackLink } from "../ui/page-header";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { DataTable, type Column } from "../ui/data-table";
import { Separator } from "../ui/separator";
import { SegGroup } from "../ui/seg-group";
import { TabPills } from "../ui/tab-pills";
import { formatMoney } from "../lib/utils";
import {
  demoNavGroups, demoProfile, demoRecords, STATUS_LABEL, type DemoRecord,
} from "../demo/sample-data";

// 五種頁型組進外殼——ADR-0011 判準①(ii) 的可執行證據。
//
// 各頁型自己的組成規格在「頁面/」的五支 story，這裡不重複；
// 這一支只回答一個問題：**同一副外殼裝得下五種頁型嗎**，
// 而且切換分區之後「一頁一個 h1」「頂列不重複頁面標題」還成不成立。
const meta: Meta = { title: "頁面/五種頁型組進外殼" };
export default meta;
type Story = StoryObj;

const ICONS: Record<string, LucideIcon> = {
  工作台: LayoutDashboard, 批次結算: Layers, 存量清查: ClipboardCheck, 用量分析: LineChart,
  報表中心: FileText, 基本資料: Database, 系統設定: Settings, 使用說明: CircleHelp, 操作手冊: BookOpen,
};
const groups = demoNavGroups.map((g) => ({
  ...g,
  items: g.items.map((i) => ({ ...i, icon: ICONS[i.title] })),
}));

const PERIODS = [
  { value: "2024-01", label: "一月" },
  { value: "2024-02", label: "二月" },
];

const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", freeze: true, cell: (r) => r.id, sortValue: (r) => r.id },
  { key: "unit", header: "單位", cell: (r) => r.unit, sortValue: (r) => r.unit },
  { key: "amount", header: "金額", numeric: true, cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount },
  { key: "status", header: "狀態", cell: (r) => STATUS_LABEL[r.status], sortValue: (r) => STATUS_LABEL[r.status] },
];

/** 五種頁型各一份最精簡的骨架：頁首（PageHeader）＋內容區。 */
function PageBody({ path }: { path: string }) {
  const [period, setPeriod] = useState(PERIODS[1].value);
  const [tab, setTab] = useState("basic");

  if (path.startsWith("/settings")) {
    return (
      <div className="space-y-4">
        <PageHeader title="系統設定" meta={`${demoProfile.name}・${demoProfile.code}`} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">顯示偏好</CardTitle>
            <CardDescription>變更立即生效，只影響你自己的畫面。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">設定頁的分區規格見〈設定頁〉。</CardContent>
        </Card>
      </div>
    );
  }
  if (path === "/master") {
    return (
      <div className="space-y-4">
        <PageHeader
          nav={<BackLink href="#/records" />}
          title={demoProfile.name}
          badges={<Badge variant="success">啟用中</Badge>}
          actions={<Button variant="outline" size="sm">匯出</Button>}
        />
        <TabPills
          label="明細分區"
          value={tab}
          onChange={setTab}
          tabs={[{ key: "basic", label: "基本資料" }, { key: "related", label: "關聯清單" }]}
        />
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">明細頁的組成規格見〈明細頁〉。</CardContent>
        </Card>
      </div>
    );
  }
  if (path === "/settlement") {
    return (
      <div className="max-w-2xl space-y-4">
        <PageHeader title="建立批次" meta="三步完成；可以隨時回上一步，已填的內容不會不見。" />
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">表單頁的組成規格見〈表單頁〉。</CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="outline">取消</Button>
          <Button>送出</Button>
        </div>
      </div>
    );
  }
  if (path === "/workbench") {
    return (
      <div className="space-y-4">
        <PageHeader
          title="成效總覽"
          meta="資料期間：二月・更新於 2024-02-07"
          actions={<SegGroup label="期間" options={PERIODS} value={period} onPick={setPeriod} />}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2"><CardDescription>總金額</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {formatMoney(demoRecords.reduce((s, r) => s + r.amount, 0))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardDescription>總筆數</CardDescription></CardHeader>
            <CardContent><p className="text-3xl font-semibold tabular-nums">{demoRecords.length}</p></CardContent>
          </Card>
        </div>
      </div>
    );
  }
  // 其餘分區一律當清單頁——後台最常見的頁型
  return (
    <div className="space-y-4">
      <PageHeader
        title="存量清查"
        meta={`共 ${demoRecords.length} 筆・最後更新 2024-02-07`}
        actions={<Button><Plus /> 新增項目</Button>}
      />
      <DataTable rows={demoRecords} columns={columns} getRowKey={(r) => r.id} dense pageSize={10} />
    </div>
  );
}

// 桌面版釘死視口：play 的性質不能隨觀看者的視窗寬度改變。
const FORCE_DESKTOP = "(max-width: 0px)";

function Composed() {
  const [path, setPath] = useState("/workbench");
  const renderLink = (props: SidebarNavLinkProps) => (
    <a
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.(e);
        if (!props.target) setPath(props.href);
      }}
    />
  );
  return (
    <AppShell
      mobileQuery={FORCE_DESKTOP}
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 font-semibold">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground">帳</span>
              <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">內部作業系統</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={groups} currentPath={path} renderLink={renderLink} />
          </SidebarContent>
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          {/* 頂列只放全域的東西——頁面標題是 PageHeader 的職責，不在這裡重複一份 */}
          <a href="#pending" onClick={(e) => e.preventDefault()} className="ml-auto">
            <Badge variant="warning">待處理 3 項</Badge>
          </a>
        </>
      }
    >
      <PageBody path={path} />
    </AppShell>
  );
}

export const 切換分區: Story = {
  render: () => <Composed />,
  // 契約：五種頁型在同一副外殼下切換，每一次都只有一個 h1、
  // 頂列不重複頁面標題、主內容留在 <main> 裡（不被側欄蓋掉）。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvasElement.querySelector("main");
    expect(main).not.toBeNull();
    const inMain = within(main as HTMLElement);

    const expectSinglePage = async (heading: string) => {
      await waitFor(() => {
        const h1s = inMain.getAllByRole("heading", { level: 1 });
        expect(h1s).toHaveLength(1);
        expect(h1s[0]).toHaveTextContent(heading);
      });
      // 整個外殼範圍內也只有這一個 h1——頂列重複一份會被螢幕閱讀器唸兩次
      expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    };

    const nav = canvas.getByRole("navigation", { name: "主導覽" });
    await expectSinglePage("成效總覽"); // 儀表板（初始）

    await userEvent.click(within(nav).getByRole("link", { name: /存量清查/ }));
    await expectSinglePage("存量清查"); // 清單頁

    await userEvent.click(within(nav).getByRole("link", { name: /批次結算/ }));
    await expectSinglePage("建立批次"); // 表單頁

    await userEvent.click(within(nav).getByRole("link", { name: /基本資料/ }));
    await expectSinglePage(demoProfile.name); // 明細頁
    // 明細頁的返回是真連結（BackLink），不是 JS 後退
    await expect(inMain.getByRole("link", { name: /返回清單/ })).toHaveAttribute("href", "#/records");

    await userEvent.click(within(nav).getByRole("button", { name: /系統設定/ }));
    await userEvent.click(await within(nav).findByRole("link", { name: "一般" }));
    await expectSinglePage("系統設定"); // 設定頁
  },
};
