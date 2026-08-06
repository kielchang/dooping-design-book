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
const meta: Meta = { title: "頁面/設定頁" };
export default meta;
type Story = StoryObj;

const VIEW_OPTIONS = [
  { value: "table", label: "清單" },
  { value: "card", label: "卡片" },
];

export const 典型組成: Story = {
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
          <h1 className="text-2xl font-semibold">設定</h1>
          <p className="text-sm text-muted-foreground">{demoProfile.name}・{demoProfile.code}</p>
        </div>

        {/* 立即生效區：改了就生效，所以沒有儲存鈕——要在標題旁講清楚 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">顯示偏好</CardTitle>
            <CardDescription>變更立即生效，只影響你自己的畫面。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox id="sp-dense" checked={dense} onCheckedChange={(v) => setDense(v === true)} />
              <Label htmlFor="sp-dense">清單使用密集模式</Label>
            </div>
            <SegGroup label="預設檢視" options={VIEW_OPTIONS} value={view} onPick={setView} />
          </CardContent>
        </Card>

        {/* 需儲存區：影響其他人看到的資料，改動標琥珀、按了儲存才算數 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">額度與管道</CardTitle>
              {dirty && !saved && <Badge variant="edit">已改動未送出</Badge>}
            </div>
            <CardDescription>影響整個單位，按「儲存」才會生效並寫入異動紀錄。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-52 space-y-1">
              <Label>上限額度</Label>
              <NumberInput value={quota} onChange={setQuota} min={0} step={50_000} aria-label="上限額度" />
            </div>
            <Chips
              label="聯絡管道"
              options={CHANNEL_OPTIONS}
              selected={channels}
              onToggle={(v) => {
                setSaved(false);
                setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
              }}
            />
            {saved && (
              <Callout variant="success" title="已儲存" live>
                新的額度與管道即刻生效，這次變更已寫入異動紀錄。
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
              還原
            </Button>
            <Button disabled={!dirty || saved} onClick={() => setSaved(true)}>儲存</Button>
          </CardFooter>
        </Card>

        {/* 危險操作區：獨立隔離、紅字說清楚後果、按了還要再確認一次 */}
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle className="text-base text-danger">危險操作</CardTitle>
            <CardDescription>做了就很難回頭的事，全部集中在這裡。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">停用此單位</p>
              <p className="text-muted-foreground">停用後不能再建立新項目，既有資料保留可查。</p>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="destructive" size="sm">停用</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>確定要停用 {demoProfile.code}？</DialogTitle>
                  <DialogDescription>
                    停用會即刻生效並通知相關負責組別；重新啟用需要管理者權限。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">返回</Button></DialogClose>
                  <Button variant="destructive">確定停用</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  },
};
