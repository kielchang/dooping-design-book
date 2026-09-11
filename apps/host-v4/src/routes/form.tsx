import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/dooping/button";
import { Input } from "@/components/dooping/input";
import { NumberInput } from "@/components/dooping/number-input";
import { SegGroup } from "@/components/dooping/seg-group";
import { Chips } from "@/components/dooping/chips";
import { Stepper } from "@/components/dooping/stepper";
import { PageHeader } from "@/components/dooping/page-header";
import { Callout } from "@/components/dooping/callout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/dooping/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/dooping/select";
import { FormField } from "@/components/dooping/form-field";
import { ConfirmDialog } from "@/components/dooping/confirm-dialog";
import { useToast } from "@/components/dooping/toast";
import { formatNumber } from "@/lib/dooping/utils";
import { CHANNEL_OPTIONS, TIER_OPTIONS, demoRecords } from "@/demo/sample-data";

// 表單頁（多步驟變體）：一欄式、依「回答問題的順序」分組；錯誤就地顯示、頂部只做彙總；
// 動作區固定在尾端——取消在左（有離開防呆）、主要動作在右。

const UNIT_OPTIONS = [...new Set(demoRecords.map((r) => r.unit))];
const STEPS = [
  { key: "unit", label: "選擇單位" },
  { key: "items", label: "加入項目", hint: "名稱與數量" },
  { key: "review", label: "確認送出" },
];

export function FormPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [idx, setIdx] = useState(0);
  const [unit, setUnit] = useState(UNIT_OPTIONS[0]);
  const [tier, setTier] = useState("gold");
  const [name, setName] = useState("");
  const [qty, setQty] = useState(120);
  const [channels, setChannels] = useState<string[]>(["online"]);
  const [showErrors, setShowErrors] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const cur = STEPS[idx].key;
  // 必填未填的問題是「時機」不是顏色：碰過（按了下一步）才標
  const nameError = showErrors && name.trim() === "" ? "請輸入項目名稱。" : undefined;

  const next = () => {
    if (cur === "items" && name.trim() === "") {
      setShowErrors(true);
      return;
    }
    setIdx((i) => i + 1);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="建立批次" meta="三步完成；可以隨時回上一步，已填的內容不會不見。" />

      <Stepper
        current={cur}
        onStep={(k) => setIdx(STEPS.findIndex((s) => s.key === k))}
        completed={Object.fromEntries(STEPS.map((s, i) => [s.key, i < idx]))}
        steps={STEPS}
      />

      {nameError && (
        <Callout variant="warning" title="有 1 個欄位待補" live>
          「項目名稱」未填寫前無法前往下一步。
        </Callout>
      )}

      {cur === "unit" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本資訊</CardTitle>
            <CardDescription>這個批次屬於誰。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select 能聚焦的是 Trigger 不是根元件：FormField 的 children 傳函式，把 id／aria 展開到 trigger 上 */}
            <FormField label="所屬單位" className="max-w-sm">
              {(control) => (
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger {...control}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_OPTIONS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <SegGroup label="等級" options={TIER_OPTIONS} value={tier} onPick={setTier} />
          </CardContent>
        </Card>
      )}

      {cur === "items" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">項目與管道</CardTitle>
            <CardDescription>之後在明細頁隨時可以調整。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="項目名稱" required error={nameError} hint="例：甲案 第一階段">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="數量" className="max-w-40">
              <NumberInput value={qty} onChange={setQty} min={1} step={10} />
            </FormField>
            <Chips
              label="聯絡管道"
              options={CHANNEL_OPTIONS}
              selected={channels}
              onToggle={(v) => setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
            />
          </CardContent>
        </Card>
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
        <Button variant="ghost" onClick={() => setLeaveOpen(true)}>取消</Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>上一步</Button>
          {idx < STEPS.length - 1 ? (
            <Button onClick={next}>下一步</Button>
          ) : (
            <Button
              onClick={() => {
                toast.push({ variant: "success", title: "已建立批次", description: `${unit}・${name}` });
                navigate("/stock-check");
              }}
            >
              送出
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="要放棄這份表單？"
        description="已填的內容不會保留。"
        confirmText="放棄"
        cancelText="繼續填寫"
        destructive
        onConfirm={() => {
          setLeaveOpen(false);
          navigate("/workbench");
        }}
      />
    </div>
  );
}
