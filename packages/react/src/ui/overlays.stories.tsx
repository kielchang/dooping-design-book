import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { Tooltip, TruncatedText } from "./tooltip";
import { Button } from "./button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "./dialog";

const meta: Meta = { title: "Components/Overlays/Tooltip and dialog", id: "元件/浮層/提示泡泡・對話框" };
export default meta;
type Story = StoryObj;

export const 提示泡泡: Story = {
  name: "Tooltips",
  render: () => (
    <div className="space-y-6 py-8">
      <p className="text-sm">
        Processing status
        <Tooltip content="Confirmed means the content and quantity are locked but processing has not started." className="ml-1">
          <span className="cursor-help underline decoration-dotted underline-offset-2">Confirmed</span>
        </Tooltip>
      </p>
      <div className="max-w-[220px] rounded-md border p-2">
        <TruncatedText text="Industrial bearing 6204 / deep-groove ball / double shield / 20mm inner diameter" />
        <p className="mt-1 text-tiny text-muted-foreground">Truncated text: hover or long-press to see the full value.</p>
      </div>
      <div className="flex justify-end">
          <Tooltip content="A right-aligned tooltip stays inside the viewport instead of being clipped.">
          <span className="cursor-help rounded border px-2 py-1 text-xs">Edge positioning</span>
        </Tooltip>
      </div>
      <p className="text-tiny text-muted-foreground">
        Mobile devices have no hover: long-press for about 0.35 seconds to show the tooltip. Without long-press support, tooltip-only information does not exist on mobile.
      </p>
    </div>
  ),
  // 泡泡的行為契約：hover 顯示 role=tooltip、移開消失（顯示時機規範的可驗部分）
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("Confirmed");
    await userEvent.hover(trigger);
    const tip = await canvas.findByRole("tooltip");
    await expect(tip).toHaveTextContent("content and quantity are locked");
    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByRole("tooltip")).toBeNull());
  },
};

export const 對話框: Story = {
  name: "Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="destructive">Void this record</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Void R-2403?</DialogTitle>
          <DialogDescription>
            Voiding releases the reserved quota and is added to the audit log. Completed items are unaffected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button variant="destructive">Confirm void</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  // 焦點陷阱三段式：開啟後焦點進對話框、Esc 關閉、焦點回到觸發鈕。
  // Dialog 走 portal 掛在 body——斷言要查 ownerDocument.body，不是 canvas 子樹。
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", { name: "Void this record" });
    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(doc.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  },
};
