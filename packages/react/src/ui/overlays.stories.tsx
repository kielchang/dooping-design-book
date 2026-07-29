import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TruncatedText } from "./tooltip";
import { Button } from "./button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "./dialog";

const meta: Meta = { title: "元件/浮層/提示泡泡・對話框" };
export default meta;
type Story = StoryObj;

export const 提示泡泡: Story = {
  render: () => (
    <div className="space-y-6 py-8">
      <p className="text-sm">
        處理狀態
        <Tooltip content="「已確認」代表已鎖定內容與數量，尚未進入處理。" className="ml-1">
          <span className="cursor-help underline decoration-dotted underline-offset-2">已確認</span>
        </Tooltip>
      </p>
      <div className="max-w-[220px] rounded-md border p-2">
        <TruncatedText text="工業級軸承 6204 / 深溝球 / 雙面防塵蓋 / 內徑 20mm" />
        <p className="mt-1 text-tiny text-muted-foreground">截斷文字：hover 或長壓看完整內容。</p>
      </div>
      <div className="flex justify-end">
        <Tooltip content="靠右的泡泡會自動夾回視窗內，不會被切掉。">
          <span className="cursor-help rounded border px-2 py-1 text-xs">邊緣測試</span>
        </Tooltip>
      </div>
      <p className="text-tiny text-muted-foreground">
        行動裝置沒有 hover：長壓約 0.35 秒顯示。不處理長壓＝所有靠泡泡補充的資訊在手機上等於不存在。
      </p>
    </div>
  ),
};

export const 對話框: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="destructive">作廢這筆</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定要作廢 R-2403？</DialogTitle>
          <DialogDescription>
            作廢後將釋放已保留的配額，且此動作會寫入異動紀錄。已完成的項目不受影響。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">返回</Button></DialogClose>
          <Button variant="destructive">確定作廢</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
