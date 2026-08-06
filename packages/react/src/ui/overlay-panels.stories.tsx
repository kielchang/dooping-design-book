import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Label } from "./label";
import { Switch } from "./switch";
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose,
} from "./drawer";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "./dropdown-menu";

const meta: Meta = { title: "元件/浮層/側板・小面板・動作選單" };
export default meta;
type Story = StoryObj;

export const 側板快看: Story = {
  render: () => (
    <div className="space-y-3">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">快看 R-2406</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>R-2406 台興機械</DrawerTitle>
            <DrawerDescription>從清單快看——背景仍看得到你從哪一列來。</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">狀態</span><Badge variant="info">已確認</Badge></p>
            <p className="flex justify-between"><span className="text-muted-foreground">數量</span><span className="tabular-nums">300</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">金額</span><span className="tabular-nums">$91,200</span></p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild><Button variant="outline" size="sm">關閉</Button></DrawerClose>
            <Button size="sm">開啟完整明細</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="text-tiny text-muted-foreground">
        內容超過兩個畫面高就該是有網址的明細頁，不是更大的側板。行動版全寬。
      </p>
    </div>
  ),
};

export const 小面板設定: Story = {
  render: () => (
    <div className="space-y-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">顯示設定</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-3">
            <p className="text-xs font-medium">清單顯示</p>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="pp-dense">密集列表</Label>
              <Switch id="pp-dense" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="pp-zebra">斑馬紋</Label>
              <Switch id="pp-zebra" defaultChecked />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-tiny text-muted-foreground">
        非模態：點外面就關、背景不失焦。表單的一部分不要放進來——收在浮層裡的必填欄位一定會被漏掉。
      </p>
    </div>
  ),
};

export const 動作選單: Story = {
  render: () => (
    <div className="space-y-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="更多動作">
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>R-2406</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => {}}>複製一筆</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>匯出這一筆</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => {}}>作廢（需確認）</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-tiny text-muted-foreground">
        選單收「次要動作」；主要動作永遠是看得見的按鈕。破壞性動作放最後、danger 樣式、必經對話框確認。
        高亮與 Select 同一條規則：滑鼠與鍵盤走同一路，強度拉到「按 Enter 會執行」那一階。
      </p>
    </div>
  ),
};
