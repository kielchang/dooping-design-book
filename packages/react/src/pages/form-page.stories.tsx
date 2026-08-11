import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { NumberInput } from "../ui/number-input";
import { SegGroup } from "../ui/seg-group";
import { Chips } from "../ui/chips";
import { Stepper } from "../ui/stepper";
import { Callout } from "../ui/callout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "../ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { formatNumber } from "../lib/utils";
import { TIER_OPTIONS, CHANNEL_OPTIONS, demoRecords } from "../demo/sample-data";

// 表單頁的組成規格：欄位依「回答問題的順序」分組（不是照資料表欄序）、
// 錯誤就地顯示＋頂部只做彙總、動作區固定在尾端。
const meta: Meta = { title: "Pages/Form Page", id: "頁面/表單頁" };
export default meta;
type Story = StoryObj;

const UNIT_OPTIONS = [...new Set(demoRecords.map((r) => r.unit))];

export const 典型組成: Story = {
  name: "Typical composition",
  render: function Render() {
    const [name, setName] = useState("");
    const [qty, setQty] = useState(10);
    const [tier, setTier] = useState("gold");
    const [channels, setChannels] = useState<string[]>(["online"]);
    const [submitted, setSubmitted] = useState(false);
    const nameMissing = submitted && name.trim() === "";
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {/* 頁首區：這一頁只做一件事，標題直接說出那件事 */}
        <div>
          <h1 className="text-2xl font-semibold">Create item</h1>
          <p className="text-sm text-muted-foreground">Submit the basic information now; add the remaining settings later.</p>
        </div>

        {/* 頂部彙總：只列「有幾個欄位要補」，錯誤細節在欄位旁邊 */}
        {nameMissing && (
          <Callout variant="warning" title="1 field needs attention" live>
            The item name is required before you can submit.
          </Callout>
        )}

        {/* 內容區：依情境分組，一組一張卡 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic information</CardTitle>
            <CardDescription>What this item is and who it belongs to.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fp-name">Item name (required)</Label>
              <Input
                id="fp-name"
                value={name}
                placeholder="Example: Plan A — Phase 1"
                aria-invalid={nameMissing || undefined}
                aria-describedby={nameMissing ? "fp-name-err" : undefined}
                onChange={(e) => setName(e.target.value)}
              />
              {nameMissing && (
                <p id="fp-name-err" className="text-tiny text-danger">Enter an item name.</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="fp-unit">Unit</Label>
              <Select defaultValue={UNIT_OPTIONS[0]}>
                <SelectTrigger id="fp-unit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SegGroup label="Tier" options={TIER_OPTIONS} value={tier} onPick={setTier} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quantity and channels</CardTitle>
            <CardDescription>You can adjust these values later on the detail page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-40 space-y-1">
              <Label>Quantity</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="Quantity" />
            </div>
            <Chips
              label="Contact channels"
              options={CHANNEL_OPTIONS}
              selected={channels}
              onToggle={(v) => setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
            />
          </CardContent>
        </Card>

        {/* 動作區：取消在左（有離開防呆）、主要動作在右 */}
        <div className="flex items-center justify-between border-t pt-4">
          <Dialog>
            <DialogTrigger asChild><Button variant="ghost">Cancel</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Discard this form?</DialogTitle>
                <DialogDescription>Entered values will not be saved.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Keep editing</Button></DialogClose>
                <Button variant="destructive">Discard</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setSubmitted(true)}>Submit</Button>
        </div>
      </div>
    );
  },
};

export const 多步驟: Story = {
  name: "Multi-step",
  render: function Render() {
    const steps = [
      { key: "unit", label: "Choose unit" },
      { key: "items", label: "Add items", hint: "Name and quantity" },
      { key: "review", label: "Review and submit" },
    ];
    const [idx, setIdx] = useState(0);
    const [unit, setUnit] = useState(UNIT_OPTIONS[0]);
    const [name, setName] = useState("甲案 第一階段");
    const [qty, setQty] = useState(120);
    const cur = steps[idx].key;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Create batch</h1>
          <p className="text-sm text-muted-foreground">Three steps; you can go back at any time without losing entered values.</p>
        </div>

        <Stepper
          current={cur}
          onStep={(k) => setIdx(steps.findIndex((s) => s.key === k))}
          completed={Object.fromEntries(steps.map((s, i) => [s.key, i < idx]))}
          steps={steps}
        />

        {cur === "unit" && (
          <div className="max-w-sm space-y-1">
            <Label htmlFor="ms-unit">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="ms-unit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {cur === "items" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ms-name">Item name</Label>
              <Input id="ms-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="max-w-40 space-y-1">
              <Label>Quantity</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="Quantity" />
            </div>
          </div>
        )}

        {cur === "review" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Final review</CardTitle>
              <CardDescription>Submitting creates one batch; you can still adjust it on the detail page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Unit　</span>{unit}</p>
              <p><span className="text-muted-foreground">Item name　</span>{name}</p>
              <p><span className="text-muted-foreground">Quantity　</span>{formatNumber(qty)}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
            Previous
          </Button>
          {idx < steps.length - 1 ? (
            <Button onClick={() => setIdx((i) => i + 1)}>Next</Button>
          ) : (
            <Button>Submit</Button>
          )}
        </div>
      </div>
    );
  },
};
