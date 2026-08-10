import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor, fn } from "@storybook/test";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "./command";
import { CommandPalette } from "./command-palette";
import { demoNavGroups } from "../demo/sample-data";
import { setInputValue } from "../demo/play";

const meta: Meta = { title: "元件/浮層/指令面板 Command" };
export default meta;
type Story = StoryObj;

export const 清單模式: Story = {
  render: () => (
    <div className="max-w-md rounded-md border py-0">
      <Command>
        <CommandInput placeholder="搜尋頁面…" />
        <CommandList>
          <CommandEmpty>查無符合的結果</CommandEmpty>
          {demoNavGroups.slice(0, 3).map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.flatMap((item) =>
                item.items
                  ? item.items.map((sub) => (
                      <CommandItem key={sub.title} value={`${item.title} ${sub.title}`}>{sub.title}</CommandItem>
                    ))
                  : [<CommandItem key={item.title} value={item.title}>{item.title}</CommandItem>],
              )}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  ),
  // 過濾契約：輸入後只剩符合項，且目前項有 aria-selected。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("搜尋頁面…");
    setInputValue(input, "報表");
    await waitFor(() => {
      const options = canvas.getAllByRole("option");
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("報表中心");
      expect(options[0]).toHaveAttribute("aria-selected", "true");
    });
  },
};

const navigateSpy = fn();

function PaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-3 py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>
        開啟指令面板 <kbd className="ml-2 rounded border px-1.5 text-xs text-muted-foreground">Ctrl K</kbd>
      </Button>
      <p className="text-tiny text-muted-foreground">
        導覽項來自與側邊欄同一份 demoNavGroups——單一來源，兩個出口。
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={demoNavGroups}
        onNavigate={(url) => navigateSpy(url)}
      />
    </div>
  );
}

export const 對話框與快捷鍵: Story = {
  render: () => <PaletteDemo />,
  // 契約：Ctrl+K 開啟、輸入過濾、Enter 導航（執行即關閉）、Esc 關閉。
  play: async ({ canvasElement }) => {
    navigateSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.keyboard("{Control>}k{/Control}");
    const input = await body.findByPlaceholderText("搜尋頁面或指令…");
    await waitFor(() => expect(doc.activeElement).toBe(input));
    setInputValue(input, "批次");
    await waitFor(() => expect(body.getAllByRole("option")).toHaveLength(1));
    await userEvent.keyboard("{Enter}");
    await expect(navigateSpy).toHaveBeenCalledWith("/settlement");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

const themeSpy = fn();

function ActionsDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="py-8">
      <Button variant="outline" onClick={() => setOpen(true)}>開啟（含自訂指令群）</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        groups={demoNavGroups.slice(0, 1)}
        actions={[
          {
            heading: "外觀",
            items: [
              { id: "light", label: "切換淺色模式", icon: Sun, run: () => themeSpy("light") },
              { id: "dark", label: "切換深色模式", icon: Moon, run: () => themeSpy("dark") },
            ],
          },
        ]}
      />
    </div>
  );
}

export const 自訂指令群: Story = {
  render: () => <ActionsDemo />,
  // 契約：自訂指令選中即執行、面板關閉。主題切換由宿主提供——元件不內建任何指令。
  play: async ({ canvasElement }) => {
    themeSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: /開啟（含自訂指令群）/ }));
    const dialog = await body.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("option", { name: "切換深色模式" }));
    await expect(themeSpy).toHaveBeenCalledWith("dark");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};
