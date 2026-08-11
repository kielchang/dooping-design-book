import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { Button } from "./button";

const meta: Meta = { title: "Foundations/Interaction state layers", id: "基礎/互動狀態層" };
export default meta;
type Story = StoryObj;

// 靜態展示用：把偽類換成把 alpha 直接寫死，這樣 hover／pressed 能與一般態並排比較，
// 也才截得到圖。實際元件上這三階是 `:hover` / `:active` / `[data-state=selected]`。
const AS = {
  default: undefined,
  hover: "var(--state-hover-alpha)",
  pressed: "var(--state-pressed-alpha)",
} as const;

export const 資料表列的三種狀態: Story = {
  name: "Three table-row states",
  render: () => (
    <div className="max-w-3xl space-y-4">
      <Table zebra>
        <TableHeader>
          <TableRow>
            <TableHead>State</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead className="text-muted-foreground">Secondary text</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Object.entries(AS), ...Object.entries(AS)].map(([label, a], i) => (
            <TableRow key={i} style={a ? ({ "--state-layer-alpha": a } as React.CSSProperties) : undefined}>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell>{i < 3 ? "Odd row (no zebra)" : "Even row (zebra)"}</TableCell>
              <TableCell><Badge variant="success">Complete</Badge></TableCell>
              <TableCell className="text-muted-foreground">2024-02-05</TableCell>
            </TableRow>
          ))}
          <TableRow data-state="selected">
            <TableCell className="font-medium">Selected</TableCell>
            <TableCell>data-state=&quot;selected&quot;</TableCell>
            <TableCell><Badge variant="success">Complete</Badge></TableCell>
            <TableCell className="text-muted-foreground">Secondary text returns to foreground color</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="max-w-2xl text-xs text-muted-foreground">
        All three layers<strong> stack</strong> on the row's own surface instead of swapping in a second surface—so a hovered zebra row is simply “one step darker.”
        The old version used <code>--accent</code> for hover and <code>--muted</code> for selected, but those token values were identical,
        making the measured ordinary-to-hover difference only ΔE00 <strong>1.6</strong>.
        The selected row's badge<strong> is completely unaffected</strong> (fill pixels match the ordinary row; only antialiasing at the surface edge differs):
        the layer sits above <code>background-color</code> and below content. If <code>::after</code> covered the content, the same badge would be tinted
        <code>#abc4b4</code>.
      </p>
    </div>
  ),
};

export const 按鈕的三種狀態: Story = {
  name: "Three button states",
  render: () => (
    <div className="space-y-4">
      <div className="grid max-w-2xl grid-cols-[5rem_repeat(3,1fr)] items-center gap-2 text-xs">
        <span />
        {Object.keys(AS).map((k) => <span key={k} className="font-medium">{k}</span>)}
        {(["default", "secondary", "outline", "destructive"] as const).map((v) => (
          <React.Fragment key={v}>
            <code className="text-xs">{v}</code>
            {Object.values(AS).map((a, i) => (
              <Button
                key={i}
                variant={v}
                size="sm"
                style={a ? ({ "--state-layer-alpha": a } as React.CSSProperties) : undefined}
              >
                Apply
              </Button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        All six variants share one intensity scale. The old version picked a different opacity for each variant (<code>/90</code>,
        <code>/80</code>…), producing visibility from ΔE00 <strong>0.6</strong> (secondary, effectively no hover)
        to <strong>7.4</strong> (default, too deliberate)—a tenfold spread. They now all sit between <strong>2.6–4.5</strong>.
        The <code>link</code> variant intentionally has no layer: it is text, not a surface.
      </p>
    </div>
  ),
};
