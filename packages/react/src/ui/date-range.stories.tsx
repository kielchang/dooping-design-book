import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRange, dateRangeFromPreset, type DateRangeValue, type DateRangePreset } from "./date-range";

const meta: Meta = { title: "Components/Forms/Date range", id: "元件/表單/期間選擇" };
export default meta;
type Story = StoryObj;

export const 檔位與自訂: Story = {
  name: "Presets and custom range",
  render: function Render() {
    const [v, setV] = useState<DateRangeValue>(() => dateRangeFromPreset("30d"));
    const [p, setP] = useState<DateRangePreset>("30d");
    return (
      <div className="max-w-xl space-y-3">
        <DateRange value={v} initialPreset="30d" onChange={(nv, np) => { setV(nv); setP(np); }} />
        <p className="text-xs tabular-nums text-muted-foreground">
          Current value: {v.from} – {v.to} (preset: {p})
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
  name: "Disabled",
  render: function Render() {
    const [v, setV] = useState<DateRangeValue>(() => dateRangeFromPreset("7d"));
    return (
      <div className="max-w-xl space-y-2">
        <DateRange value={v} initialPreset="7d" onChange={setV} disabled />
        <p className="text-tiny text-muted-foreground">Disabled state: presets are locked and inputs cannot be edited.</p>
      </div>
    );
  },
};
