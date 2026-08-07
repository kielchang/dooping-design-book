import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent } from "@storybook/test";
import { Button } from "./button";
import { ToastProvider, useToast } from "./toast";
import { Skeleton, SkeletonText } from "./skeleton";

const meta: Meta = { title: "元件/狀態/操作回饋與載入" };
export default meta;
type Story = StoryObj;

function PushButtons() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => push({ variant: "success", title: "已儲存", description: "12 個欄位已更新。" })}>
        成功
      </Button>
      <Button size="sm" variant="secondary" onClick={() => push({ variant: "info", title: "已加入排程", description: "匯出完成後會在這裡通知。" })}>
        資訊
      </Button>
      <Button size="sm" variant="secondary" onClick={() => push({ variant: "warning", title: "部分項目已略過", description: "3 筆重複的紀錄未匯入。" })}>
        警示
      </Button>
      <Button size="sm" variant="destructive" onClick={() => push({ variant: "danger", title: "儲存失敗", description: "連線逾時，請再試一次。此訊息不會自動消失。" })}>
        失敗（不自動消失）
      </Button>
    </div>
  );
}

export const 操作回饋: Story = {
  render: () => (
    <ToastProvider>
      <div className="max-w-xl space-y-3">
        <PushButtons />
        <p className="text-tiny text-muted-foreground">
          去向固定<strong>右下</strong>、堆疊上限 3（最舊被擠出）。success／info／warning
          5 秒自動消失，hover／聚焦時暫停倒數；<strong>danger 一律手動關閉</strong>。
          語彙與 Callout 同源：同一張圖示表、同一組淡底，不靠顏色單獨傳達。
        </p>
      </div>
    </ToastProvider>
  ),
  // 宣告可被讀屏聽到：success 走 role=status（禮貌宣告）、danger 走 role=alert（立即打斷）
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "成功" }));
    await expect(await doc.findByRole("status")).toHaveTextContent("已儲存");
    await userEvent.click(canvas.getByRole("button", { name: "失敗（不自動消失）" }));
    await expect(await doc.findByRole("alert")).toHaveTextContent("儲存失敗");
  },
};

function StressButtons() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          for (let i = 1; i <= 10; i++) push({ variant: "info", title: `第 ${i} 則`, description: "連發測試——上限 3，最舊被擠出。" });
        }}
      >
        連發 10 則
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          push({
            variant: "warning",
            title: "超長標題也不會把版面撐破，會自動折行而不是裁掉或推開其他訊息",
            description:
              "說明文字同樣可以很長：匯入完成，共 4,820 筆；其中 96 筆因欄位格式不符已略過，明細已寫入匯入紀錄，可於清單頁以「已略過」篩選檢視。",
          })
        }
      >
        超長文字
      </Button>
    </div>
  );
}

export const 回饋壓測: Story = {
  render: () => (
    <ToastProvider>
      <div className="max-w-xl space-y-3">
        <StressButtons />
        <p className="text-tiny text-muted-foreground">
          連發不會疊出一面牆——上限 3 是硬的。重要到不能被擠出的訊息，該用 Dialog 不是 Toast。
        </p>
      </div>
    </ToastProvider>
  ),
};

export const 載入佔位: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <div aria-busy="true" className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
        <SkeletonText lines={3} />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>骨架必須<strong>保留真實版面的高度與形狀</strong>——載入完成的瞬間版面不跳動。</p>
        <p>只用於首次載入；重新整理既有畫面時保留舊內容，不要把看得好好的資料閃成灰塊。</p>
        <p>
          骨架本身 <code>aria-hidden</code>，載入語意掛在容器的 <code>aria-busy</code> 上；
          脈動尊重 <code>prefers-reduced-motion</code>（自動停止）。
        </p>
      </div>
    </div>
  ),
};
