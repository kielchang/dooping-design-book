import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Callout } from "../ui/callout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Chips } from "../ui/chips";
import { Label } from "../ui/label";
import { NumberInput } from "../ui/number-input";
import { SegGroup } from "../ui/seg-group";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "../ui/dialog";
import { CHANNEL_OPTIONS, demoProfile } from "../demo/sample-data";

// 設定頁的組成規格：立即生效與需儲存分區（同一張卡不混用兩種模式）、
// 危險操作獨立隔離在最後、每一區寫清楚生效方式。
const meta: Meta = { title: "Pages/Settings Page", id: "頁面/設定頁" };
export default meta;
type Story = StoryObj;

const VIEW_OPTIONS = [
  { value: "table", label: "List" },
  { value: "card", label: "Cards" },
];

export const 典型組成: Story = {
  name: "Typical composition",
  render: function Render() {
    const [dense, setDense] = useState(false);
    const [view, setView] = useState("table");

    const [quota, setQuota] = useState(demoProfile.quota);
    const [channels, setChannels] = useState<string[]>(demoProfile.channels);
    const [saved, setSaved] = useState(false);
    const dirty =
      quota !== demoProfile.quota ||
      channels.length !== demoProfile.channels.length ||
      channels.some((c) => !demoProfile.channels.includes(c));

    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">{demoProfile.name}・{demoProfile.code}</p>
        </div>

        {/* 立即生效區：改了就生效，所以沒有儲存鈕——要在標題旁講清楚 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display preferences</CardTitle>
            <CardDescription>Changes take effect immediately and only affect your view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox id="sp-dense" checked={dense} onCheckedChange={(v) => setDense(v === true)} />
              <Label htmlFor="sp-dense">Use compact mode for lists</Label>
            </div>
            <SegGroup label="Default view" options={VIEW_OPTIONS} value={view} onPick={setView} />
          </CardContent>
        </Card>

        {/* 需儲存區：影響其他人看到的資料，改動標琥珀、按了儲存才算數 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Quota and channels</CardTitle>
              {dirty && !saved && <Badge variant="edit">Unsaved changes</Badge>}
            </div>
            <CardDescription>Affects the whole unit. Save to apply and record the change.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-52 space-y-1">
              <Label>Quota</Label>
              <NumberInput value={quota} onChange={setQuota} min={0} step={50_000} aria-label="Quota" />
            </div>
            <Chips
              label="Contact channels"
              options={CHANNEL_OPTIONS}
              selected={channels}
              onToggle={(v) => {
                setSaved(false);
                setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
              }}
            />
            {saved && (
              <Callout variant="success" title="Saved" live>
                The new quota and channels are active, and the change was added to the audit log.
              </Callout>
            )}
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              disabled={!dirty}
              onClick={() => {
                setQuota(demoProfile.quota);
                setChannels(demoProfile.channels);
                setSaved(false);
              }}
            >
              Reset
            </Button>
            <Button disabled={!dirty || saved} onClick={() => setSaved(true)}>Save</Button>
          </CardFooter>
        </Card>

        {/* 危險操作區：獨立隔離、紅字說清楚後果、按了還要再確認一次 */}
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle className="text-base text-danger">Danger zone</CardTitle>
            <CardDescription>Irreversible actions are grouped here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">Deactivate this unit</p>
              <p className="text-muted-foreground">New items cannot be created after deactivation; existing data remains available.</p>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="destructive" size="sm">Deactivate</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deactivate {demoProfile.code}?</DialogTitle>
                  <DialogDescription>
                    Deactivation takes effect immediately and notifies the responsible team. Re-enabling requires administrator access.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button variant="destructive">Confirm deactivation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  },
};
