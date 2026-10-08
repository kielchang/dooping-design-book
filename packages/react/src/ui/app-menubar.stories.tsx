import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { AppMenubar } from "./app-menubar";
import { SidebarProvider } from "./sidebar";
import type { SidebarNavLinkProps } from "./sidebar-nav";
import { demoAppMenus } from "../demo/sample-data";

const meta: Meta = { title: "元件/外殼/功能選單列" };
export default meta;
type Story = StoryObj;

// 「作業中心」的選單＝工作節奏五區（＋一個動作項），與側欄示範同一份資料
const menus = demoAppMenus["/workbench"];

// 桌面／行動一律釘死（同 sidebar.stories）：play 的性質不能隨觀看者的視窗寬度改變。
// 列寬也釘死——「擠不下就收合」是量出來的，不釘的話窄視窗看到的是另一個狀態。
const FORCE_DESKTOP = "(max-width: 0px)";
const FORCE_MOBILE = "(min-width: 0px)";
const BAR_WIDTH = 760;

/**
 * 模擬 SPA 的 Link：**先**呼叫轉發來的 onClick（Radix 在這裡關選單），沒被攔下才自己導航——
 * 與 react-router 的 Link 同一個順序。反過來先 preventDefault，Radix 會當作「被攔下了」而不關選單。
 * 必須是元件（不是直接回傳 <a onClick>）：Radix 的 Slot 會把它的 onClick 合併成這個元件的 prop。
 */
function StoryLink({ onClick, onNavigate, ...props }: SidebarNavLinkProps & { onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault(); // 不讓 Storybook 的 iframe 真的被帶走（外部連結也一樣）
        if (!props.target) onNavigate(props.href);
      }}
    />
  );
}

function Bar({ mobileQuery = FORCE_DESKTOP, width = BAR_WIDTH }: { mobileQuery?: string; width?: number }) {
  const [path, setPath] = useState("/workbench");
  const [lastAction, setLastAction] = useState<string | null>(null);
  return (
    <SidebarProvider mobileQuery={mobileQuery}>
      <div className="space-y-3 overflow-x-auto">
        <div
          className="flex h-12 shrink-0 items-center gap-2 rounded-md border bg-background px-3"
          style={{ width }}
        >
          <span className="shrink-0 text-sm font-semibold">作業中心</span>
          <AppMenubar
            groups={menus}
            currentPath={path}
            renderLink={(props) => <StoryLink {...props} onNavigate={setPath} />}
            onAction={(action) => setLastAction(action)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          目前路徑：<span data-testid="path">{path}</span>
          {lastAction ? <>・已執行動作：<span data-testid="action">{lastAction}</span></> : null}
        </p>
      </div>
    </SidebarProvider>
  );
}

export const 典型組成: Story = {
  render: () => <Bar />,
  // 契約：menubar 有名字；所在分區的標題被標出、所在項 aria-current；
  // 選連結即導航並關選單；動作項把代號交回 onAction；兩層群組是「分區標題＋子項」不是子選單。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", { name: "應用功能" });
    const daily = within(bar).getByRole("menuitem", { name: "每日作業" });
    await expect(daily).toHaveAttribute("data-current");

    await userEvent.click(daily);
    const menu = await body.findByRole("menu");
    await expect(within(menu).getByRole("menuitem", { name: "工作台" })).toHaveAttribute("aria-current", "page");
    await expect(within(menu).getByText("Ctrl N")).toBeVisible();
    await userEvent.click(within(menu).getByRole("menuitem", { name: /存量清查/ }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("path")).toHaveTextContent("/stock-check");

    // 動作項：不導航，把代號交回宿主
    await userEvent.click(daily);
    // 快捷鍵提示是名稱的一部分（「新增紀錄… Ctrl N」）——讀屏使用者一樣該知道有快捷鍵
    await userEvent.click(within(await body.findByRole("menu")).getByRole("menuitem", { name: /^新增紀錄…\s*Ctrl N$/ }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("action")).toHaveTextContent("new-record");

    // 兩層群組：分區標題＋子項，沒有往右彈的子選單
    const settings = within(bar).getByRole("menuitem", { name: "主檔與設定" });
    await userEvent.click(settings);
    const settingsMenu = await body.findByRole("menu");
    await expect(within(settingsMenu).getByText("系統設定")).toBeVisible();
    expect(within(settingsMenu).queryByRole("menuitem", { name: "系統設定" })).toBeNull();
    await userEvent.click(within(settingsMenu).getByRole("menuitem", { name: "外觀" }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    // 所在分區跟著換——斷言放在選單關閉之後（Radix 選單開著時外部內容是 aria-hidden）
    await waitFor(() => expect(settings).toHaveAttribute("data-current"));
    await expect(daily).not.toHaveAttribute("data-current");

    // 外部連結另開分頁
    await userEvent.click(within(bar).getByRole("menuitem", { name: "說明" }));
    const help = await body.findByRole("menu");
    await expect(within(help).getByRole("menuitem", { name: /操作手冊/ })).toHaveAttribute("target", "_blank");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const 鍵盤操作: Story = {
  render: () => <Bar />,
  // 契約（macOS 選單列的行為）：整條 menubar 一個 Tab 停駐點；Enter 開、左右鍵在頂層選單間移動
  // 並循環；Esc 關閉、焦點回到那一個標題。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const bar = canvas.getByRole("menubar", { name: "應用功能" });
    const trigger = (name: string) => within(bar).getByRole("menuitem", { name });

    trigger("每日作業").focus();
    await userEvent.keyboard("{Enter}");
    await body.findByRole("menu");
    await expect(trigger("每日作業")).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(trigger("規劃與分析")).toHaveAttribute("aria-expanded", "true"));
    await expect(trigger("每日作業")).toHaveAttribute("aria-expanded", "false");

    // 從第一個往左循環到最後一個
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await waitFor(() => expect(trigger("說明")).toHaveAttribute("aria-expanded", "true"));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger("說明")));
  },
};

export const 窄版收成單一選單: Story = {
  render: () => <Bar mobileQuery={FORCE_MOBILE} />,
  // 契約：行動版全部收進一個「選單」鈕，裡面依原順序列出每一區——不為手機另設計一套導覽。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", { name: "應用功能" });
    expect(within(bar).getAllByRole("menuitem")).toHaveLength(1);
    await userEvent.click(within(bar).getByRole("menuitem", { name: "選單" }));
    const menu = await body.findByRole("menu");
    const order = menus.map((g) => g.title);
    const labels = order.map((t) => within(menu).getByText(t, { selector: "[role=menu] > [role=group] > div" }));
    // 分區標題在 DOM 上的先後＝原順序
    for (let i = 1; i < labels.length; i++) {
      expect(labels[i - 1].compareDocumentPosition(labels[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    await userEvent.click(within(menu).getByRole("menuitem", { name: /報表中心/ }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("path")).toHaveTextContent("/reports");
  },
};

export const 擠不下時自動收合: Story = {
  render: () => <Bar width={360} />,
  // 契約：桌面寬度但頂層標題擠不下（例如平板、或右段工具較多）時也收成單一鈕，不讓標題被裁掉。
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("menubar", { name: "應用功能" });
    await waitFor(() => expect(within(bar).getByRole("menuitem", { name: "選單" })).toBeVisible());
    expect(within(bar).queryByRole("menuitem", { name: "每日作業" })).toBeNull();
  },
};

export const 兩態並列: Story = {
  render: () => (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-sm text-muted-foreground">完整（所在分區加粗＋底線）</h2>
        <Bar />
      </section>
      <section className="space-y-2">
        <h2 className="text-sm text-muted-foreground">收合成單一選單（行動版或擠不下）</h2>
        <Bar mobileQuery={FORCE_MOBILE} />
      </section>
    </div>
  ),
};
