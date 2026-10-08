import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, CircleHelp, ClipboardCheck, Database, FileText, Layers, LayoutDashboard, LineChart, Settings,
} from "lucide-react";
import { AppShell } from "./app-shell";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "./sidebar";
import { SidebarNav, type SidebarNavLinkProps } from "./sidebar-nav";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { demoNavGroups } from "../demo/sample-data";

const meta: Meta = { title: "元件/外殼/應用外殼・側邊欄" };
export default meta;
type Story = StoryObj;

// icon 以 key 對映留在 story 端——sample-data 不帶 UI 相依
const ICONS: Record<string, LucideIcon> = {
  工作台: LayoutDashboard, 批次結算: Layers, 存量清查: ClipboardCheck, 用量分析: LineChart,
  報表中心: FileText, 基本資料: Database, 系統設定: Settings, 使用說明: CircleHelp, 操作手冊: BookOpen,
};
const groups = demoNavGroups.map((g) => ({
  ...g,
  items: g.items.map((i) => ({ ...i, icon: ICONS[i.title] })),
}));

// story 裡的連結不真的導航（會把 Storybook iframe 帶走），但保留 <a> 語意與轉發的 onClick
const storyLink = (props: SidebarNavLinkProps) => (
  <a
    {...props}
    onClick={(e) => {
      e.preventDefault();
      props.onClick?.(e);
    }}
  />
);

// 桌面版 story 一律釘 "(max-width: 0px)"（永不成立＝強制桌面）——
// 與行動版 story 釘 "(min-width: 0px)" 是同一條規則：play 的性質不能隨
// 觀看者的視窗寬度改變（窄視口下桌面斷言會找不到地標而假性失敗）。
const FORCE_DESKTOP = "(max-width: 0px)";

function Shell({
  currentPath,
  mobileQuery = FORCE_DESKTOP,
  defaultOpen,
  collapsible,
}: {
  currentPath: string;
  mobileQuery?: string;
  defaultOpen?: boolean;
  collapsible?: "icon" | "offcanvas";
}) {
  return (
    <AppShell
      mobileQuery={mobileQuery}
      defaultOpen={defaultOpen}
      sidebar={
        <Sidebar collapsible={collapsible}>
          <SidebarHeader>
            <div className="flex h-9 items-center gap-2 px-2 font-semibold">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground">帳</span>
              <span className="truncate group-data-[state=collapsed]/sidebar:sr-only">內部作業系統</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav groups={groups} currentPath={currentPath} renderLink={storyLink} />
          </SidebarContent>
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">工作台</span>
          {/* 全域健康度狀態列：可點的數字，見〈後台系統的資訊架構〉 */}
          <a href="#pending" onClick={(e) => e.preventDefault()} className="ml-auto">
            <Badge variant="warning">待處理 3 項</Badge>
          </a>
        </>
      }
    >
      <Card>
        <CardHeader><CardTitle>主內容區</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          外殼只管佈局：側欄分區與順序照〈後台系統的資訊架構〉的工作節奏分區，
          路由與資料一律由宿主提供。
        </CardContent>
      </Card>
    </AppShell>
  );
}

export const 典型組成: Story = {
  render: () => <Shell currentPath="/workbench" />,
  // 契約:導覽地標有名字、目前頁 aria-current、例行/試算標籤是文字不是顏色。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "主導覽" });
    const current = within(nav).getByRole("link", { name: /工作台/ });
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByText("試算")).toBeVisible();
    expect(within(nav).getAllByText("例行").length).toBeGreaterThanOrEqual(2);
    // 外連結另開分頁且不參與 active
    const external = within(nav).getByRole("link", { name: /操作手冊/ });
    await expect(external).toHaveAttribute("target", "_blank");
  },
};

export const 收合成圖示欄: Story = {
  render: () => <Shell currentPath="/workbench" />,
  // 契約：收合後寬度換擋、名稱仍在（sr-only）、hover 圖示出提示、兩層群組改右彈選單。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const trigger = canvas.getByRole("button", { name: "切換側邊欄" });
    await userEvent.click(trigger);
    const aside = canvasElement.querySelector("aside");
    await waitFor(() => expect(aside).toHaveAttribute("data-state", "collapsed"));
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    // 收合後連結的可及名稱不能消失
    const link = canvas.getByRole("link", { name: /工作台/ });
    await userEvent.hover(link);
    const tip = await canvas.findByRole("tooltip");
    await expect(tip).toHaveTextContent("工作台");
    await userEvent.unhover(link);
    // 兩層群組在收合態改成往右彈出
    await userEvent.click(canvas.getByRole("button", { name: /系統設定/ }));
    const menu = await within(doc.body).findByRole("menu");
    await expect(within(menu).getByRole("menuitem", { name: "外觀" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(doc.body).queryByRole("menu")).toBeNull());
    // 收尾：展開回來，別讓視覺掃描拿到收合畫面
    await userEvent.click(trigger);
    await waitFor(() => expect(aside).toHaveAttribute("data-state", "expanded"));
  },
};

export const 收合成完全隱藏: Story = {
  render: () => <Shell currentPath="/workbench" collapsible="offcanvas" />,
  // 契約：offcanvas 收合後側欄整塊移出畫面與 Tab 順序（inert）；滑鼠碰左緣窺看——
  // 浮在內容上、不推版面；Esc 或滑鼠離開就收；釘選展開走 SidebarTrigger（鍵盤與觸控的路）。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const trigger = canvas.getByRole("button", { name: "切換側邊欄" });
    const aside = canvasElement.querySelector("aside") as HTMLElement;
    const main = canvasElement.querySelector("main") as HTMLElement;
    const mainLeft = () => main.getBoundingClientRect().left;
    const pinnedLeft = mainLeft();
    // DIAG（暫時，不併）：只記瀏覽器自己發的（trusted）指標事件與 data-peek 變化，訊息會被截在 300 字
    const trace: string[] = [];
    const t0 = performance.now();
    for (const type of ["pointerover", "pointerenter"]) {
      doc.addEventListener(type, (e) => {
        if (e.isTrusted && (e.target as Element)?.closest?.("aside,[data-sidebar-edge]"))
          trace.push(`${Math.round(performance.now() - t0)}T${type === "pointerover" ? "o" : "e"}`);
      }, true);
    }
    new MutationObserver(() => trace.push(`${Math.round(performance.now() - t0)}P${aside.hasAttribute("data-peek") ? 1 : 0}`))
      .observe(aside, { attributes: true, attributeFilter: ["data-peek"] });
    const diag = async (step: string, fn: () => Promise<unknown>) => {
      try { await fn(); } catch { throw new Error(`DIAG ${step} trace=${trace.join(",")}`); }
    };

    await userEvent.click(trigger);
    await waitFor(() => expect(aside).toHaveAttribute("inert"));
    await diag("right<=0", () => waitFor(() => expect(aside.getBoundingClientRect().right).toBeLessThanOrEqual(0)));
    // 工作區拿回整個寬度
    await waitFor(() => expect(mainLeft()).toBeLessThan(pinnedLeft));
    const collapsedLeft = mainLeft();
    // 移出畫面不等於鍵盤走不進去——inert 要真的擋住焦點
    const link = within(aside).getByRole("link", { name: /工作台/, hidden: true });
    link.focus();
    await expect(doc.activeElement).not.toBe(link);

    // 碰左緣窺看：浮層、不推版面
    const edge = canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement;
    await userEvent.hover(edge);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await expect(aside).not.toHaveAttribute("inert");
    await waitFor(() => expect(aside.getBoundingClientRect().left).toBe(0));
    expect(mainLeft()).toBe(collapsedLeft);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Esc 收（焦點不在側欄裡也要收得掉）
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(aside).toHaveAttribute("inert"));

    // 再叫出來，滑鼠離開就收
    await userEvent.hover(canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await userEvent.unhover(aside);
    await diag("unhover", () => waitFor(() => expect(aside).not.toHaveAttribute("data-peek")));
    await expect(aside).toHaveAttribute("inert");

    // 收尾：釘選展開回來（推開內容），別讓視覺掃描拿到收合畫面
    await userEvent.click(trigger);
    await waitFor(() => expect(aside).not.toHaveAttribute("inert"));
    await waitFor(() => expect(mainLeft()).toBe(pinnedLeft));
  },
};

export const 群組展開與鍵盤: Story = {
  render: () => <Shell currentPath="/settings/appearance" />,
  // 契約：含 active 子項的群組初始就展開、trigger 的 aria-expanded 跟著開合。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groupBtn = canvas.getByRole("button", { name: /系統設定/ });
    await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
    const sub = canvas.getByRole("link", { name: "外觀" });
    await expect(sub).toHaveAttribute("aria-current", "page");
    await userEvent.click(groupBtn);
    await waitFor(() => expect(groupBtn).toHaveAttribute("aria-expanded", "false"));
    await waitFor(() => expect(canvas.queryByRole("link", { name: "外觀" })).toBeNull());
    await userEvent.click(groupBtn);
    await waitFor(() => expect(canvas.getByRole("link", { name: "外觀" })).toBeVisible());
  },
};

export const 行動版抽屜: Story = {
  // 用 mobileQuery 強制行動版（確定性），不賭 viewport addon 在守衛環境的行為
  render: () => <Shell currentPath="/workbench" mobileQuery="(min-width: 0px)" />,
  // 契約：抽屜有可及名稱、分區順序與桌面一致、點連結即關、Esc 關閉焦點歸還。
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", { name: "切換側邊欄" });
    await userEvent.click(trigger);
    const drawer = await body.findByRole("dialog", { name: "主導覽" });
    // 分區與順序完全不變（back-office-ia 的行動版規範）
    const labels = Array.from(drawer.querySelectorAll("[class*='text-xs']"))
      .map((el) => el.textContent)
      .filter((t) => ["每日作業", "規劃與分析", "報表", "主檔與設定", "說明"].includes(t ?? ""));
    expect(labels.slice(0, 2)).toEqual(["每日作業", "規劃與分析"]);
    // 點選目的地即關抽屜
    await userEvent.click(within(drawer).getByRole("link", { name: /批次結算/ }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    // 重開後 Esc 關閉、焦點回到觸發鈕
    await userEvent.click(trigger);
    await body.findByRole("dialog", { name: "主導覽" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  },
};
