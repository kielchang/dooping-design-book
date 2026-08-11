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
          Presets are first-class controls—most dashboard requests use these four ranges; choose “Custom” to reveal the date inputs.
          Try setting the start date after the end date: the other side clamps to the same day without showing an error.
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
