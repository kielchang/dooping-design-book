import type { Meta, StoryObj } from "@storybook/react";
import { Placeholder, Spotlight, MockScreenFrame, MockRow } from "./mockup";
import { Button } from "./button";
import { Badge } from "./badge";
import { TabPills } from "./tab-pills";

const meta: Meta = { title: "Components/Documentation demos/Mockup blocks", id: "元件/文件示意/模擬畫面積木" };
export default meta;
type Story = StoryObj;

export const 積木: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Placeholder: leave non-focused regions blank</p>
        <div className="flex gap-2"><Placeholder w={90} label="Sidebar" /><Placeholder /><Placeholder w={60} h={22} /></div>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Spotlight: wrap the real component, not the placeholder</p>
        <div className="py-4"><Spotlight label="Export from here"><Button variant="outline" size="sm">Export CSV</Button></Spotlight></div>
      </div>
    </div>
  ),
};

export const 一步操作示意: Story = {
  render: () => (
    <div className="overflow-x-auto rounded-lg border">
      <MockScreenFrame>
        <div className="flex items-center gap-2">
      <TabPills value="confirmed" onChange={() => {}} tabs={[{ key: "all", label: "All" }, { key: "confirmed", label: "Confirmed" }]} />
      <span className="ml-auto"><Spotlight label="1. Switch to Confirmed"><Badge variant="info">7 records</Badge></Spotlight></span>
        </div>
        <MockRow />
      <MockRow focus={<Spotlight><Button size="sm" variant="outline">Schedule</Button></Spotlight>} />
        <MockRow />
      </MockScreenFrame>
    </div>
  ),
};

export const 為什麼不用截圖: Story = {
  render: () => (
    <div className="max-w-xl space-y-2 text-sm">
      <p>Screenshots start expiring on day one. Move one button and every illustration in the book needs to be recaptured; eventually nobody does it, and the book starts lying.</p>
      <p>Mockups use<strong> real components from the library</strong>: when a component changes, the illustration changes with it, and nobody has to reshoot anything.</p>
      <p className="text-muted-foreground">
        The tradeoff is that a mockup is not pixel-for-pixel identical to the real screen (the layout is simplified).
        That is intentional—the reader needs to know “where to click,” not see a pixel-perfect replica.
      </p>
    </div>
  ),
};
