import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";
import { NumberInput } from "./number-input";
import { Checkbox } from "./checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { SegGroup } from "./seg-group";
import { Chips } from "./chips";
import { TIER_OPTIONS, CHANNEL_OPTIONS } from "../demo/sample-data";

const meta: Meta = { title: "元件/表單/輸入控制項" };
export default meta;
type Story = StoryObj;

export const 文字與數值: Story = {
  render: function Render() {
    const [qty, setQty] = useState(120);
    return (
      <div className="max-w-sm space-y-4">
        <div className="space-y-1">
          <Label htmlFor="s-name">單位名稱</Label>
          <Input id="s-name" defaultValue="遠東貿易股份有限公司" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="s-code">單位代號</Label>
          <Input id="s-code" placeholder="例：C-1042" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="s-locked">建立日期</Label>
          <Input id="s-locked" defaultValue="2019-04-01" disabled />
        </div>
        <div className="space-y-1">
          <Label>訂購數量</Label>
          <NumberInput value={qty} onChange={setQty} min={0} step={10} aria-label="訂購數量" />
          <p className="text-tiny text-muted-foreground">數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。</p>
        </div>
      </div>
    );
  },
};

export const 勾選與下拉: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return (
      <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox id="s-active" checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
          <Label htmlFor="s-active">啟用此單位</Label>
        </div>
        <div className="space-y-1">
          <Label>等級</Label>
          <Select defaultValue="gold">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};

export const 分段選擇: Story = {
  render: function Render() {
    const [v, setV] = useState("gold");
    const [locked] = useState("silver");
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">選項少、標籤短、要一眼看完 → 分段選擇</p>
          <SegGroup label="等級" options={TIER_OPTIONS} value={v} onPick={setV} />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">已改動未送出（琥珀）</p>
          <SegGroup label="等級（已改動）" options={TIER_OPTIONS} value={v} onPick={setV} changed />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">鎖定：可聚焦、有鎖頭、hover 有原因</p>
          <SegGroup label="等級（鎖定）" options={TIER_OPTIONS} value={locked} onPick={() => {}} disabled lockHint="此筆已結案，需先解除鎖定" />
        </div>
        <p className="text-tiny text-muted-foreground">鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。</p>
      </div>
    );
  },
};

export const 多選標籤片: Story = {
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return (
      <div className="max-w-md space-y-2">
        <Chips
          label="下單管道"
          options={CHANNEL_OPTIONS}
          selected={sel}
          onToggle={(v) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
        />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>
    );
  },
};
