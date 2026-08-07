import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { Input } from "./input";
import { Label } from "./label";
import { NumberInput } from "./number-input";
import { Checkbox } from "./checkbox";
import { Switch } from "./switch";
import { Textarea } from "./textarea";
import { RadioGroup, RadioGroupItem } from "./radio-group";
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

export const 欄位狀態: Story = {
  render: function Render() {
    const [invalid, setInvalid] = useState(true);
    return (
      <div className="max-w-xl space-y-5">
        <p className="text-sm text-muted-foreground">
          一格欄位可以<strong>同時</strong>是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道，
          疊起來互不干涉——<strong>聚焦環永遠是同一個顏色</strong>，邊框與底色管狀態。
        </p>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="f-ro">唯讀／計算值</Label>
            <div className="field-readonly rounded-md border border-transparent px-3 py-2 text-sm">1,380,000</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-ok">可編輯（優先序 0）</Label>
            <Input id="f-ok" defaultValue="1,500,000" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-edit">已改動未送出（優先序 1）</Label>
            <div className="rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground">
              1,650,000
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-bad">不合格（優先序 2，最高）</Label>
            <Input
              id="f-bad"
              defaultValue="0"
              aria-invalid={invalid}
              aria-describedby="f-bad-err"
              onChange={(e) => setInvalid(e.target.value === "0")}
            />
            {invalid && (
              <p id="f-bad-err" className="text-tiny text-danger">
                數值必須大於 0。改成別的值就會恢復。
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          用 Tab 鍵走過上面四格，注意<strong>聚焦環不隨狀態變色</strong>。
          若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。
          環與邊框之間有一圈背景色（<code>ring-offset</code>）：少了它，環會直接畫在紅框上，
          實測深色模式下兩者對比只有 <strong>1.04:1</strong>，聚焦環等於隱形。
        </p>
        <p className="text-xs text-muted-foreground">
          「<strong>必填未填</strong>」是不合格的一種，但它的問題是<strong>時機</strong>不是顏色——
          不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。
        </p>
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
          {/* combobox 的名稱不能取自值文字——Label 一定要用 htmlFor 接到觸發鈕的 id */}
          <Label htmlFor="s-tier">等級</Label>
          <Select defaultValue="gold">
            <SelectTrigger id="s-tier"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
  // 勾選框：鍵盤 Space 切換 aria-checked；下拉：combobox 名稱來自 Label（不是值文字）、
  // 鍵盤開啟出 listbox（portal 在 body）、Esc 收回且 aria-expanded 連動。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", { name: "啟用此單位" });
    await expect(box).toHaveAttribute("aria-checked", "true");
    box.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(box).toHaveAttribute("aria-checked", "false"));
    await userEvent.keyboard(" ");
    await waitFor(() => expect(box).toHaveAttribute("aria-checked", "true"));

    const trigger = canvas.getByRole("combobox", { name: "等級" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await within(canvasElement.ownerDocument.body).findByRole("listbox");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
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

export const 開關: Story = {
  render: function Render() {
    const [autoSave, setAutoSave] = useState(true);
    const [dense, setDense] = useState(false);
    return (
      <div className="max-w-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-save">自動儲存</Label>
          <Switch id="sw-save" checked={autoSave} onCheckedChange={setAutoSave} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-dense">密集列表</Label>
          <Switch id="sw-dense" checked={dense} onCheckedChange={setDense} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-locked" className="opacity-60">週報寄送（由管理端統一設定）</Label>
          <Switch id="sw-locked" checked disabled />
        </div>
        <p className="text-tiny text-muted-foreground">
          開關＝<strong>切了立即生效</strong>（設定頁）；「送出才生效」的表單選項用 Checkbox。
          所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。
        </p>
      </div>
    );
  },
  // 開關：role=switch、Space 切換 aria-checked、disabled 的不動
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole("switch", { name: "自動儲存" });
    await expect(sw).toHaveAttribute("aria-checked", "true");
    sw.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(sw).toHaveAttribute("aria-checked", "false"));
    await userEvent.keyboard(" ");
    await waitFor(() => expect(sw).toHaveAttribute("aria-checked", "true"));
    await expect(canvas.getByRole("switch", { name: "週報寄送（由管理端統一設定）" })).toBeDisabled();
  },
};

export const 長文輸入: Story = {
  render: function Render() {
    const [note, setNote] = useState("");
    const tooLong = note.length > 200;
    return (
      <div className="max-w-xl space-y-4">
        <div className="space-y-1">
          <Label htmlFor="ta-note">備註</Label>
          <Textarea
            id="ta-note"
            placeholder="補充說明（選填）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            aria-invalid={tooLong || undefined}
            aria-describedby={tooLong ? "ta-err" : undefined}
          />
          {tooLong && (
            <p id="ta-err" className="text-tiny text-danger">
              超過 200 字上限（目前 {note.length} 字）。
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ta-ro">結案原因（停用示意）</Label>
          <Textarea id="ta-ro" defaultValue="重複建立，已併入既有紀錄。" disabled />
        </div>
        <p className="text-tiny text-muted-foreground">
          與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y），
          橫向拉寬會破壞表單欄寬對齊。
        </p>
      </div>
    );
  },
};

export const 單選群: Story = {
  render: function Render() {
    const [v, setV] = useState("all");
    return (
      <div className="max-w-md space-y-3">
        <RadioGroup value={v} onValueChange={setV} aria-label="通知範圍">
          {[
            { value: "all", label: "全部動態", hint: "每一筆變更都通知" },
            { value: "important", label: "重要事項", hint: "只有需要動作的才通知" },
            { value: "none", label: "暫停通知", hint: "改到站內清單自行查看" },
          ].map((o) => (
            <div key={o.value} className="flex items-start gap-2">
              <RadioGroupItem value={o.value} id={`rg-${o.value}`} className="mt-0.5" />
              <Label htmlFor={`rg-${o.value}`} className="font-normal">
                <span className="block text-sm">{o.label}</span>
                <span className="block text-tiny text-muted-foreground">{o.hint}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-tiny text-muted-foreground">
          選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇；
          超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。
        </p>
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
