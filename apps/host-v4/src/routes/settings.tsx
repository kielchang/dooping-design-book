import { useState } from "react";
import { DEFAULT_THEME, TOKENS_VERSION } from "@dooping/tokens";
import { Badge } from "@/components/dooping/badge";
import { Button } from "@/components/dooping/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/dooping/card";
import { Chips } from "@/components/dooping/chips";
import { Label } from "@/components/dooping/label";
import { NumberInput } from "@/components/dooping/number-input";
import { PageHeader } from "@/components/dooping/page-header";
import { SegGroup } from "@/components/dooping/seg-group";
import { Switch } from "@/components/dooping/switch";
import { FormField } from "@/components/dooping/form-field";
import { ConfirmDialog } from "@/components/dooping/confirm-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/dooping/select";
import { useToast } from "@/components/dooping/toast";
import { CHANNEL_OPTIONS, demoProfile } from "@/demo/sample-data";
import { COLOR_THEMES, useTheme, type Mode } from "../theme";

// 設定頁：分組卡固定順序——立即生效區 → 需儲存區 → 危險操作區。
// 外觀（明暗＋色相主題）本來就是設定頁的正當功能；另加一張「執行環境」卡，
// 讓 scripts/verify-host.mjs 有穩定的探針（token 版本、color-mix 透明度）。

const MODE_OPTIONS = [
  { value: "light", label: "淺色" },
  { value: "dark", label: "深色" },
];

export function SettingsPage() {
  const toast = useToast();
  const [theme, setTheme] = useTheme();
  const [dense, setDense] = useState(false);

  const [quota, setQuota] = useState(demoProfile.quota);
  const [channels, setChannels] = useState<string[]>(demoProfile.channels);
  const dirty =
    quota !== demoProfile.quota ||
    channels.length !== demoProfile.channels.length ||
    channels.some((c) => !demoProfile.channels.includes(c));
  const [disableOpen, setDisableOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="系統設定" meta={`${demoProfile.name}・${demoProfile.code}`} />

      {/* 立即生效區：改了就生效，所以沒有儲存鈕——標題旁講清楚 */}
      <Card id="appearance">
        <CardHeader>
          <CardTitle className="text-base">外觀與顯示</CardTitle>
          <CardDescription>變更立即生效，只影響你自己的畫面。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SegGroup
            label="明暗"
            options={MODE_OPTIONS}
            value={theme.mode}
            onPick={(v) => setTheme({ ...theme, mode: v as Mode })}
          />
          <FormField label="色相主題" className="max-w-xs">
            {(control) => (
              <Select value={theme.color} onValueChange={(v) => setTheme({ ...theme, color: v })}>
                <SelectTrigger {...control}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_THEMES.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {t.label}
                      {t.name === DEFAULT_THEME ? "（預設）" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
          <div className="flex items-center gap-2">
            <Switch id="settings-dense" checked={dense} onCheckedChange={setDense} />
            <Label htmlFor="settings-dense">清單使用密集模式</Label>
          </div>
        </CardContent>
      </Card>

      {/* 需儲存區：影響其他人看到的資料，改動標琥珀、按了儲存才算數 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">額度與管道</CardTitle>
            {dirty && <Badge variant="edit">已改動未送出</Badge>}
          </div>
          <CardDescription>影響整個單位，按「儲存」才會生效並寫入異動紀錄。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="上限額度" className="max-w-52">
            <NumberInput value={quota} onChange={setQuota} min={0} step={50_000} />
          </FormField>
          <Chips
            label="聯絡管道"
            options={CHANNEL_OPTIONS}
            selected={channels}
            onToggle={(v) => setChannels((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
          />
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            disabled={!dirty}
            onClick={() => {
              setQuota(demoProfile.quota);
              setChannels(demoProfile.channels);
            }}
          >
            還原
          </Button>
          <Button
            disabled={!dirty}
            onClick={() => toast.push({ variant: "success", title: "已儲存", description: "這次變更已寫入異動紀錄。" })}
          >
            儲存
          </Button>
        </CardFooter>
      </Card>

      {/* 執行環境：token 版本與幾個主題指紋色塊。bg-primary/50 是 v4 color-mix 透明度的探針 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">執行環境</CardTitle>
          <CardDescription>這個宿主實際吃到的 token 版本與主題。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">@dooping/tokens　</span>
            <span data-probe="tokens-version" className="font-mono">{TOKENS_VERSION}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2" aria-label="主題指紋色塊">
            <span className="size-8 rounded-sm bg-primary" title="primary" />
            <span className="size-8 rounded-sm bg-brand" title="brand" />
            <span className="size-8 rounded-sm border bg-sidebar" title="sidebar" />
            <span className="size-8 rounded-sm bg-danger-subtle" title="danger-subtle" />
            <span data-probe="color-mix" className="size-8 rounded-sm bg-primary/50" title="primary／50%" />
          </div>
        </CardContent>
      </Card>

      {/* 危險操作區：獨立隔離、說清楚後果、要輸入代號才解鎖 */}
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
          <Button variant="destructive" size="sm" onClick={() => setDisableOpen(true)}>停用</Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title={`確定要停用 ${demoProfile.code}？`}
        description="停用會即刻生效並通知相關負責組別；重新啟用需要管理者權限。"
        confirmText="停用"
        destructive
        typeToConfirm={{ expected: demoProfile.code, label: `輸入單位代號「${demoProfile.code}」以確認` }}
        onConfirm={() => {
          setDisableOpen(false);
          toast.push({ variant: "danger", title: `已停用 ${demoProfile.code}` });
        }}
      />
    </div>
  );
}
