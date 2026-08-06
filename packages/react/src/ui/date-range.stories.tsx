import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRange, dateRangeFromPreset, type DateRangeValue, type DateRangePreset } from "./date-range";

const meta: Meta = { title: "元件/表單/期間選擇" };
export default meta;
type Story = StoryObj;

export const 檔位與自訂: Story = {
  render: function Render() {
    const [v, setV] = useState<DateRangeValue>(() => dateRangeFromPreset("30d"));
    const [p, setP] = useState<DateRangePreset>("30d");
    return (
      <div className="max-w-xl space-y-3">
        <DateRange value={v} initialPreset="30d" onChange={(nv, np) => { setV(nv); setP(np); }} />
        <p className="text-xs tabular-nums text-muted-foreground">
          目前值：{v.from} ～ {v.to}（檔位：{p}）
        </p>
        <p className="text-tiny text-muted-foreground">
          檔位是一等公民——儀表板九成的期間需求是這四個檔位；「自訂」才展開起訖輸入。
          切到「自訂」試試把「起」選到「迄」之後：另一端會自動夾到同一天，不跳錯誤訊息。
        </p>
      </div>
    );
  },
};

export const 停用態: Story = {
  render: function Render() {
    const [v, setV] = useState<DateRangeValue>(() => dateRangeFromPreset("7d"));
    return (
      <div className="max-w-xl space-y-2">
        <DateRange value={v} initialPreset="7d" onChange={setV} disabled />
        <p className="text-tiny text-muted-foreground">整組停用：檔位鎖定、輸入不可改。</p>
      </div>
    );
  },
};
