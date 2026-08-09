import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { Filter, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "./dropdown-menu";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta = { title: "元件/浮層/彈出面板・下拉選單" };
export default meta;
type Story = StoryObj;

export const 彈出面板: Story = {
  render: () => (
    <div className="py-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline"><Filter className="mr-1 size-4" />篩選條件</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm font-medium">顯示範圍</p>
          <div className="mt-3 space-y-2">
            {["草稿", "已確認", "已完成"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <Checkbox id={`pv-${label}`} defaultChecked={label !== "草稿"} />
                <Label htmlFor={`pv-${label}`}>{label}</Label>
              </div>
            ))}
          </div>
          <p className="mt-3 text-tiny text-muted-foreground">
            彈出面板承載「一小塊就地設定」；要使用者做完整決定的內容請用對話框。
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
  // 行為契約：點開浮層（portal 掛 body）、Esc 關閉、焦點回到觸發鈕。
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", { name: "篩選條件" });
    await userEvent.click(trigger);
    const panel = await body.findByRole("dialog");
    await expect(panel).toHaveTextContent("顯示範圍");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  },
};

export const 下拉選單: Story = {
  render: () => (
    <div className="py-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="更多操作"><MoreHorizontal className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>R-2403</DropdownMenuLabel>
          <DropdownMenuItem>查看明細</DropdownMenuItem>
          <DropdownMenuItem>複製編號</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">作廢</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  // 鍵盤契約：方向鍵在選項間移動（Radix 把 DOM 焦點移過去）、Esc 關閉、焦點歸還。
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", { name: "更多操作" });
    await userEvent.click(trigger);
    const menu = await body.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      const first = within(menu).getByRole("menuitem", { name: "查看明細" });
      expect(doc.activeElement).toBe(first);
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  },
};

function ColumnToggleDemo() {
  const [visible, setVisible] = React.useState<Record<string, boolean>>({
    單位: true, 類別: true, 數量: false,
  });
  return (
    <div className="py-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">欄位</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>顯示欄位</DropdownMenuLabel>
          {Object.keys(visible).map((key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={visible[key]}
              onCheckedChange={(v) => setVisible((s) => ({ ...s, [key]: v === true }))}
            >
              {key}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="mt-3 text-tiny text-muted-foreground">
        勾選項預設不關閉選單——連續切換多個開關是它存在的理由。
      </p>
    </div>
  );
}

export const 勾選項不關閉: Story = {
  render: () => <ColumnToggleDemo />,
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", { name: "欄位" });
    await userEvent.click(trigger);
    const menu = await body.findByRole("menu");
    const item = within(menu).getByRole("menuitemcheckbox", { name: "數量" });
    await expect(item).toHaveAttribute("aria-checked", "false");
    await userEvent.click(item);
    // 勾選後選單仍開著、勾選狀態已翻轉
    await waitFor(() => expect(within(body.getByRole("menu")).getByRole("menuitemcheckbox", { name: "數量" }))
      .toHaveAttribute("aria-checked", "true"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};
