import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchX, PackageOpen, ShieldOff } from "lucide-react";
import { Delta } from "./delta";
import { EmptyState } from "./empty-state";
import { TabPills } from "./tab-pills";
import { Stepper } from "./stepper";
import { Badge } from "./badge";
import { Button } from "./button";
import { formatMoney } from "../lib/utils";

const meta: Meta = { title: "Components/States/Deltas, empty states, tabs, and steps", id: "元件/狀態/變異・空狀態・分頁・步驟" };
export default meta;
type Story = StoryObj;

export const 變異顯示: Story = {
  name: "Deltas",
  render: () => (
    <div className="space-y-2 text-sm">
      <p>Revenue versus last month: <Delta value={128_400} posLabel="up " negLabel="down " format={formatMoney} /></p>
      <p>Error count (lower is better): <Delta value={340} goodWhen="negative" posLabel="over " negLabel="under " /></p>
      <p>Schedule variance: <Delta value={-3} goodWhen="negative" posLabel="late " negLabel="early " format={(n) => `${n} days`} /></p>
      <p>Flat versus last period: <Delta value={0} /></p>
      <p className="pt-2 text-xs text-muted-foreground">
        Triple encoding: arrow ▲▼ + text + color. The meaning remains complete in grayscale print.
      </p>
    </div>
  ),
};

export const 三種空狀態: Story = {
  name: "Three empty states",
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border">
        <EmptyState
          icon={<PackageOpen className="size-7" />}
          title="No data yet"
          hint="Create the first record to see details and totals here."
          action={<Button size="sm">Add a record</Button>}
        />
      </div>
      <div className="rounded-lg border">
        <EmptyState
          icon={<SearchX className="size-7" />}
          title="No matching records"
          hint="Current filters: Unit B, Status = Complete. Try broadening one filter."
          action={<Button size="sm" variant="outline">Clear filters</Button>}
        />
      </div>
      <div className="rounded-lg border">
        <EmptyState icon={<ShieldOff className="size-7" />} title="No view permission" hint="Only administrators can view this area. Contact your system administrator." />
      </div>
    </div>
  ),
};

export const 分頁膠囊: Story = {
  name: "Tab pills",
  render: function Render() {
    const [tab, setTab] = useState("all");
    return (
      <TabPills
        label="Processing status"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "all", label: "All" },
          { key: "draft", label: "Draft", badge: <Badge variant="secondary">3</Badge> },
          { key: "confirmed", label: "Confirmed", badge: <Badge variant="info">7</Badge> },
          { key: "done", label: "Complete" },
        ]}
      />
    );
  },
};

export const 步驟指示: Story = {
  name: "Stepper",
  render: function Render() {
    const [cur, setCur] = useState("items");
    return (
      <div className="max-w-2xl">
        <Stepper
          current={cur}
          onStep={setCur}
          completed={{ unit: true }}
          steps={[
            { key: "unit", label: "Choose unit", hint: "Or create a new unit" },
            { key: "items", label: "Add items", hint: "Quantity and amount" },
            { key: "extra", label: "Additional information" },
            { key: "review", label: "Review and submit" },
          ]}
        />
      </div>
    );
  },
};
