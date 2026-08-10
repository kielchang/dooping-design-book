// 壓力測試／超長標籤：欄位、分頁、徽章的**標籤**過長時，標籤換行 vs 元件變形。
// 判準：標籤可以換行，控制項不該變形。
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EditableField } from "../form/editable-field";
import { TabPills } from "../ui/tab-pills";
import { Badge } from "../ui/badge";
import { makeLongText, makeOptions } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超長標籤" };
export default meta;
type Story = StoryObj;

export const 欄位與徽章標籤: Story = {
  render: () => (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">28 字的欄位標籤（容器 max-w-sm）</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：標籤自己換行，值的區塊不該被擠變形；還原鈕與鎖頭的位置不該漂移。
        </p>
        <EditableField
          label={makeLongText(28)}
          kind="text"
          value="第一階段"
          original="第一階段"
          onChange={() => {}}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">徽章：2 字 vs 6 字 vs 20 字</p>
        <p className="text-xs text-muted-foreground">
          20 字的徽章會把表格行高撐開——撞出來的規範是「徽章文字 2–6 字，寫不短就換元件」。
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">完成</Badge>
          <Badge variant="info">等待中的批次</Badge>
          <Badge variant="warning">{makeLongText(20)}</Badge>
        </div>
      </div>
    </div>
  ),
};

export const 分頁標籤: Story = {
  render: function Render() {
    const tabs = makeOptions(4, { longLabelRatio: 1 }).map((o) => ({ key: o.value, label: o.label }));
    const [v, setV] = useState(tabs[0].key);
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">4 個超長標籤的分頁膠囊</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：膠囊列整體換行（flex-wrap）是預期行為；單顆膠囊內部不該斷成兩行。
          真的長到這樣，該縮短標籤，不是撐大元件。
        </p>
        <TabPills tabs={tabs} value={v} onChange={setV} label="超長標籤分頁" />
      </div>
    );
  },
};

export const 無標籤: Story = {
  render: function Render() {
    const [v, setV] = useState("o1");
    return (
      <div className="max-w-sm space-y-6">
        <p className="text-sm font-medium">「沒有」那一側：標籤全部是空字串</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：空標籤的欄位剩一個孤零零的值、空標籤的分頁剩一顆空膠囊、
          空文字的徽章縮成一粒膠囊皮——每一個都是「整塊元件安靜消失」的前兆。
        </p>
        <EditableField label="" kind="text" value="有值但沒有標籤" original="有值但沒有標籤" onChange={() => {}} />
        <TabPills
          tabs={[{ key: "o1", label: "" }, { key: "o2", label: "第二頁" }]}
          value={v}
          onChange={setV}
          label="含空標籤的分頁"
        />
        <div className="flex items-center gap-2">
          <Badge variant="success">{""}</Badge>
          <span className="text-xs text-muted-foreground">← 空字串的徽章</span>
        </div>
      </div>
    );
  },
};
