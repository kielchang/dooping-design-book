import type { Meta, StoryObj } from "@storybook/react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Callout } from "./callout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

const meta: Meta = { title: "Components/Primitives/Buttons, badges, callouts, and cards", id: "元件/基礎/按鈕・徽章・提示・卡片" };
export default meta;
type Story = StoryObj;

export const 按鈕: Story = {
  name: "Buttons",
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>Primary action</Button>
        <Button variant="brand">Start new flow</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link style</Button>
        <Button variant="destructive"><Trash2 /> Delete record</Button>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        Use the toolbar's<strong> hue</strong> control to switch themes: only the <code>brand</code> button changes; everything else stays put.
        Dense screens have many buttons, so coloring every one with the theme hue makes the<strong> saturated area</strong> overwhelming
        (color fatigue is about area and frequency, not the number of hues). In<strong> Graphite</strong>, <code>brand</code>
        is identical to <code>default</code> by design because that theme has no brand color.
      </p>

      <div className="max-w-2xl space-y-2 rounded-md border border-l-4 border-l-danger bg-danger-subtle p-3 text-danger-subtle-foreground">
        <p className="text-xs font-semibold">Do not use brand for confirm, submit, or save</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-xs">
        <Button size="sm">Submit request</Button> Correct
          </span>
          <span className="flex items-center gap-2 text-xs">
        <Button size="sm" variant="brand">Submit request</Button> Incorrect
          </span>
        </div>
        <p className="text-xs leading-relaxed">
          <code>--brand</code> identifies<strong> who the product is</strong>; a confirm button communicates<strong> what will happen</strong> when pressed.
          Hues carry conventions—green means pass, blue is the system default, red means stop, and gray means disabled.
          Purple and magenta<strong> have no action convention</strong>, so they read as decoration on a confirm button.
          Switch the toolbar to Violet or Amethyst to compare the two buttons.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add"><Plus /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>Disabled</Button>
        <Button disabled><Loader2 className="animate-spin" /> Processing…</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Loading has no dedicated variant: disable the button, add a spinner, and change the copy.
        An extra variant would only make the choice harder.
      </p>
    </div>
  ),
};

export const 徽章: Story = {
  name: "Badges",
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">Complete</Badge>
        <Badge variant="warning">Needs information</Badge>
        <Badge variant="info">In review</Badge>
        <Badge variant="danger">Returned</Badge>
        <Badge variant="edit">Unsaved changes</Badge>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        Badges need text. A solid-color dot disappears in grayscale print and for people with color-vision differences.
        The four states use<strong> subtle surfaces</strong> from the same tokens as low-intensity callouts, keeping polarity consistent
        (a tinted surface plus dark text of the same hue). The previous version mixed medium-light solid fills with dark text
        and dark danger with reversed text, creating<strong> two polarities in one row</strong> and a 23.5 L* background range.
        The eye read that polarity reversal as different kinds rather than different severity; the range is now 10.
      </p>
      <div className="space-y-2 border-t pt-3">
        <p className="text-xs font-semibold">intensity=&quot;high&quot; · Solid fill, only when the message must interrupt</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" intensity="high">Complete</Badge>
          <Badge variant="warning" intensity="high">Needs information</Badge>
          <Badge variant="info" intensity="high">In review</Badge>
          <Badge variant="danger" intensity="high">Returned</Badge>
        </div>
        <p className="max-w-2xl text-xs text-muted-foreground">
          <strong>Do not use this row in a data table.</strong> Hundreds of solid badges on one page overwhelm the saturated area
          —color fatigue is area × frequency, not the number of hues. This row also shows the old appearance:
          notice how the danger badge has the opposite polarity from the three on its left.
        </p>
      </div>
    </div>
  ),
};

export const 提示框: Story = {
  name: "Callouts",
  render: () => (
    <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs font-semibold">Low intensity (default) · Everyday and secondary guidance</p>
        <Callout variant="success" title="All records are complete">12 records; the last completed on 2024-02-05.</Callout>
        <Callout variant="info" title="Tip" tag="TIP">Use a column filter to compare multiple units at once.</Callout>
        <Callout variant="warning" title="3 records need information">Complete the fields before moving to the next step.</Callout>
        <Callout variant="danger" title="Not enough quota to confirm" tag="E-104">Item “Plan C — First draft” has 2 available; 6 required.</Callout>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold">High intensity · Blocking; stop and decide</p>
        <Callout intensity="high" variant="success" title="All records are complete">12 records; the last completed on 2024-02-05.</Callout>
        <Callout intensity="high" variant="info" title="Tip" tag="TIP">Use a column filter to compare multiple units at once.</Callout>
        <Callout intensity="high" variant="warning" title="3 records need information">Complete the fields before moving to the next step.</Callout>
        <Callout intensity="high" variant="danger" title="Not enough quota to confirm" tag="E-104">Item “Plan C — First draft” has 2 available; 6 required.</Callout>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground lg:col-span-2">
        The range comes from<strong> two intensities for each semantic color</strong>, not more hues—four meanings are the ceiling.
        <strong>Use low intensity when in doubt</strong>: frequent high-intensity alerts quickly exhaust the color-fatigue budget.
        Low-intensity surfaces are generated tokens with text solved to 4.5:1 contrast, not a solid fill simply layered at 10%—
        that approach makes contrast depend on the surface underneath and is uncontrollable.
      </p>
    </div>
  ),
};

export const 卡片: Story = {
  name: "Cards",
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>This month's data</CardTitle>
        <CardDescription>February 2024, through today</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tabular-nums">1,284</CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">View details</Button>
        <Button size="sm" variant="outline">Export</Button>
      </CardFooter>
    </Card>
  ),
};
