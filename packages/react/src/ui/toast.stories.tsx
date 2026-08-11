import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent } from "@storybook/test";
import { Button } from "./button";
import { ToastProvider, useToast } from "./toast";
import { Skeleton, SkeletonText } from "./skeleton";

const meta: Meta = { title: "Components/States/Action feedback and loading", id: "元件/狀態/操作回饋與載入" };
export default meta;
type Story = StoryObj;

function PushButtons() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => push({ variant: "success", title: "Saved", description: "12 fields were updated." })}>
        Success
      </Button>
      <Button size="sm" variant="secondary" onClick={() => push({ variant: "info", title: "Added to schedule", description: "You will be notified here when the export is ready." })}>
        Info
      </Button>
      <Button size="sm" variant="secondary" onClick={() => push({ variant: "warning", title: "Some items skipped", description: "3 duplicate records were not imported." })}>
        Warning
      </Button>
      <Button size="sm" variant="destructive" onClick={() => push({ variant: "danger", title: "Save failed", description: "The connection timed out. Try again. This message does not dismiss automatically." })}>
        Failure (manual dismiss)
      </Button>
    </div>
  );
}

export const 操作回饋: Story = {
  name: "Action feedback",
  render: () => (
    <ToastProvider>
      <div className="max-w-xl space-y-3">
        <PushButtons />
        <p className="text-tiny text-muted-foreground">
          Toasts stay in the<strong> bottom-right</strong> and stack up to 3 (the oldest is removed).
          success/info/warning dismiss after 5 seconds and pause on hover or focus; <strong>danger always requires manual dismissal</strong>.
          The vocabulary shares a source with Callout: one icon map and one set of subtle surfaces, never color alone.
        </p>
      </div>
    </ToastProvider>
  ),
  // 宣告可被讀屏聽到：success 走 role=status（禮貌宣告）、danger 走 role=alert（立即打斷）
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Success" }));
    await expect(await doc.findByRole("status")).toHaveTextContent("Saved");
    await userEvent.click(canvas.getByRole("button", { name: "Failure (manual dismiss)" }));
    await expect(await doc.findByRole("alert")).toHaveTextContent("Save failed");
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
          for (let i = 1; i <= 10; i++) push({ variant: "info", title: `Message ${i}`, description: "Burst test — maximum 3; oldest messages are removed." });
        }}
      >
        Send 10 messages
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          push({
            variant: "warning",
            title: "A long title wraps instead of breaking the layout or pushing away other messages",
            description:
              "Descriptions can be long too: import complete, 4,820 records; 96 were skipped because their field format was invalid. Details are in the import log and can be filtered on the list page.",
          })
        }
      >
        Long text
      </Button>
    </div>
  );
}

export const 回饋壓測: Story = {
  name: "Feedback stress test",
  render: () => (
    <ToastProvider>
      <div className="max-w-xl space-y-3">
        <StressButtons />
        <p className="text-tiny text-muted-foreground">
          Bursts do not build a wall—the limit of 3 is hard. A message too important to be pushed out belongs in a Dialog, not a Toast.
        </p>
      </div>
    </ToastProvider>
  ),
};

export const 載入佔位: Story = {
  name: "Loading placeholders",
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
        <p>Skeletons must<strong> preserve the height and shape of the real layout</strong> so the page does not jump when loading completes.</p>
        <p>Use them only for the first load; keep existing content during a refresh instead of flashing healthy data into gray blocks.</p>
        <p>
          The skeleton itself is <code>aria-hidden</code>; the loading meaning belongs on the container's <code>aria-busy</code>.
          The pulse respects <code>prefers-reduced-motion</code> and stops automatically.
        </p>
      </div>
    </div>
  ),
};
