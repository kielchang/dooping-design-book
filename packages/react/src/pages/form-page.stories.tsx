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
const meta: Meta = { title: "頁面/表單頁" };
export default meta;
type Story = StoryObj;

const UNIT_OPTIONS = [...new Set(demoRecords.map((r) => r.unit))];

export const 典型組成: Story = {
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
          <h1 className="text-2xl font-semibold">建立項目</h1>
          <p className="text-sm text-muted-foreground">填完基本資訊即可送出，其餘設定之後隨時可補。</p>
        </div>

        {/* 頂部彙總：只列「有幾個欄位要補」，錯誤細節在欄位旁邊 */}
        {nameMissing && (
          <Callout variant="warning" title="有 1 個欄位待補" live>
            「項目名稱」未填寫前無法送出。
          </Callout>
        )}

        {/* 內容區：依情境分組，一組一張卡 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本資訊</CardTitle>
            <CardDescription>這個項目是什麼、屬於誰。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fp-name">項目名稱（必填）</Label>
              <Input
                id="fp-name"
                value={name}
                placeholder="例：甲案 第一階段"
                aria-invalid={nameMissing || undefined}
                aria-describedby={nameMissing ? "fp-name-err" : undefined}
                onChange={(e) => setName(e.target.value)}
              />
              {nameMissing && (
                <p id="fp-name-err" className="text-tiny text-danger">請輸入項目名稱。</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>所屬單位</Label>
              <Select defaultValue={UNIT_OPTIONS[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SegGroup label="等級" options={TIER_OPTIONS} value={tier} onPick={setTier} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">數量與管道</CardTitle>
            <CardDescription>之後在明細頁隨時可以調整。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-40 space-y-1">
              <Label>數量</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="數量" />
            </div>
            <Chips
              label="聯絡管道"
              options={CHANNEL_OPTIONS}
              selected={channels}
              onToggle={(v) => setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
            />
          </CardContent>
        </Card>

        {/* 動作區：取消在左（有離開防呆）、主要動作在右 */}
        <div className="flex items-center justify-between border-t pt-4">
          <Dialog>
            <DialogTrigger asChild><Button variant="ghost">取消</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>要放棄這份表單？</DialogTitle>
                <DialogDescription>已填的內容不會保留。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">繼續填寫</Button></DialogClose>
                <Button variant="destructive">放棄</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setSubmitted(true)}>送出</Button>
        </div>
      </div>
    );
  },
};

export const 多步驟: Story = {
  render: function Render() {
    const steps = [
      { key: "unit", label: "選擇單位" },
      { key: "items", label: "加入項目", hint: "名稱與數量" },
      { key: "review", label: "確認送出" },
    ];
    const [idx, setIdx] = useState(0);
    const [unit, setUnit] = useState(UNIT_OPTIONS[0]);
    const [name, setName] = useState("甲案 第一階段");
    const [qty, setQty] = useState(120);
    const cur = steps[idx].key;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">建立批次</h1>
          <p className="text-sm text-muted-foreground">三步完成；可以隨時回上一步，已填的內容不會不見。</p>
        </div>

        <Stepper
          current={cur}
          onStep={(k) => setIdx(steps.findIndex((s) => s.key === k))}
          completed={Object.fromEntries(steps.map((s, i) => [s.key, i < idx]))}
          steps={steps}
        />

        {cur === "unit" && (
          <div className="max-w-sm space-y-1">
            <Label>所屬單位</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {cur === "items" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ms-name">項目名稱</Label>
              <Input id="ms-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="max-w-40 space-y-1">
              <Label>數量</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="數量" />
            </div>
          </div>
        )}

        {cur === "review" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最後確認</CardTitle>
              <CardDescription>送出後會建立 1 筆批次，內容仍可在明細頁調整。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">所屬單位　</span>{unit}</p>
              <p><span className="text-muted-foreground">項目名稱　</span>{name}</p>
              <p><span className="text-muted-foreground">數量　　　</span>{formatNumber(qty)}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
            上一步
          </Button>
          {idx < steps.length - 1 ? (
            <Button onClick={() => setIdx((i) => i + 1)}>下一步</Button>
          ) : (
            <Button>送出</Button>
          )}
        </div>
      </div>
    );
  },
};
