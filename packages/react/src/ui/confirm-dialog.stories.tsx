import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor, fn } from "@storybook/test";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import { useDialogState } from "../lib/use-dialog-state";
import { setInputValue } from "../demo/play";

const meta: Meta = { title: "元件/浮層/確認對話框 ConfirmDialog" };
export default meta;
type Story = StoryObj;

const confirmSpy = fn();

function BasicDemo() {
  const [dialog, setDialog] = useDialogState<"submit">();
  return (
    <div className="py-8">
      <Button onClick={() => setDialog("submit")}>送出本期批次</Button>
      <ConfirmDialog
        open={dialog === "submit"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="送出本期批次？"
        description="送出後本期進入鎖定狀態，內容不再接受修改。"
        confirmText="送出"
        onConfirm={confirmSpy}
      />
    </div>
  );
}

export const 一般確認: Story = {
  render: () => <BasicDemo />,
  // 契約：確認鈕觸發 onConfirm 但**不自動關閉**——成功才關、失敗留在原地，時機由宿主決定。
  play: async ({ canvasElement }) => {
    confirmSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "送出本期批次" }));
    const dialog = await body.findByRole("dialog");
    await expect(dialog).toHaveAccessibleName("送出本期批次？");
    await userEvent.click(within(dialog).getByRole("button", { name: "送出" }));
    await expect(confirmSpy).toHaveBeenCalledTimes(1);
    await expect(body.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

function HardConfirmDemo() {
  const [dialog, setDialog] = useDialogState<"void">();
  return (
    <div className="py-8">
      <Button variant="destructive" onClick={() => setDialog("void")}>作廢 R-2403</Button>
      <ConfirmDialog
        open={dialog === "void"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="作廢 R-2403？"
        description="作廢會釋放已保留的配額並寫入異動紀錄，且無法還原。"
        confirmText="作廢"
        destructive
        typeToConfirm={{ expected: "R-2403" }}
        onConfirm={confirmSpy}
      />
    </div>
  );
}

export const 破壞性與硬確認: Story = {
  render: () => <HardConfirmDemo />,
  // 硬確認契約：輸入完全相符前，確認鈕鎖住——把危險操作變成刻意的決定（硬鎖定模式）。
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "作廢 R-2403" }));
    const dialog = await body.findByRole("dialog");
    const confirm = within(dialog).getByRole("button", { name: "作廢" });
    await expect(confirm).toBeDisabled();
    const input = within(dialog).getByRole("textbox");
    // setInputValue 是整段設值：第二次給完整目標值，不是接續打字
    setInputValue(input, "R-240");
    await expect(confirm).toBeDisabled();
    setInputValue(input, "R-2403");
    await waitFor(() => expect(confirm).toBeEnabled());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

function LoadingDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="py-8">
      <Button onClick={() => setOpen(true)}>重新開啟</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="正在送出…"
        description="送出進行中。此時所有出口都會鎖住，避免使用者以為已取消。"
        confirmText="送出"
        loading
        onConfirm={confirmSpy}
      />
    </div>
  );
}

export const 載入中: Story = {
  render: () => <LoadingDemo />,
  // 載入中契約：確認鈕鎖住（disabled ＋ pointer-events-none，連點打不進來）、
  // Esc 也關不掉——操作進行中沒有出口。
  play: async ({ canvasElement }) => {
    confirmSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const dialog = await body.findByRole("dialog");
    const confirm = within(dialog).getByRole("button", { name: "送出" });
    await expect(confirm).toBeDisabled();
    await expect(confirm).toHaveAttribute("aria-busy", "true");
    await expect(within(dialog).getByRole("button", { name: "取消" })).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    await expect(body.getByRole("dialog")).toBeInTheDocument();
  },
};
