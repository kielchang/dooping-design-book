import type { Meta, StoryObj } from "@storybook/react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Callout } from "./callout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

const meta: Meta = { title: "元件/基礎/按鈕・徽章・提示・卡片" };
export default meta;
type Story = StoryObj;

export const 按鈕: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要動作</Button>
        <Button variant="brand">送出申請</Button>
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除這筆</Button>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        用工具列的<strong>色相</strong>切主題：只有 <code>brand</code> 那顆會變，其餘全部不動。
        這是刻意的——資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的<strong>出現面積</strong>失控
        （色彩疲勞管的是面積與頻率，不是色相種類數）。<code>brand</code> 只給一頁一顆的關鍵動作。
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">小</Button>
        <Button>預設</Button>
        <Button size="lg">大</Button>
        <Button size="icon" aria-label="新增"><Plus /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>停用</Button>
        <Button disabled><Loader2 className="animate-spin" /> 處理中…</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。
        多一個 variant 只會讓人猶豫該用哪個。
      </p>
    </div>
  ),
};

export const 徽章: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>預設</Badge>
        <Badge variant="secondary">次要</Badge>
        <Badge variant="outline">外框</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">已完成</Badge>
        <Badge variant="warning">待補件</Badge>
        <Badge variant="info">審核中</Badge>
        <Badge variant="danger">已退回</Badge>
        <Badge variant="edit">已改動未送出</Badge>
      </div>
      <p className="text-xs text-muted-foreground">徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。</p>
    </div>
  ),
};

export const 提示框: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs font-semibold">低強度（預設）· 日常與次要提示</p>
        <Callout variant="success" title="這批資料已全部完成">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
        <Callout variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個單位。</Callout>
        <Callout variant="warning" title="有 3 筆缺少必要資訊">未填寫前無法進入下一步。</Callout>
        <Callout variant="danger" title="配額不足，無法確認" tag="E-104">項目「丙案 初版」可用量 2，需求 6。</Callout>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold">高強度 · 阻斷式，必須停下來決定</p>
        <Callout intensity="high" variant="success" title="這批資料已全部完成">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
        <Callout intensity="high" variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個單位。</Callout>
        <Callout intensity="high" variant="warning" title="有 3 筆缺少必要資訊">未填寫前無法進入下一步。</Callout>
        <Callout intensity="high" variant="danger" title="配額不足，無法確認" tag="E-104">項目「丙案 初版」可用量 2，需求 6。</Callout>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground lg:col-span-2">
        豐富度來源是「同一語意色的<strong>兩種強度</strong>」，不是加色相——四種語意封頂，不再擴充。
        <strong>有疑慮就用低強度</strong>：高強度出現頻率一高，色彩疲勞的預算會瞬間爆掉。
        低強度的淡底是生成的 token（文字對它反解到 4.5:1），不是把實色壓 10% 疊上去——
        後者的對比取決於底下是什麼表面，完全不可控。
      </p>
    </div>
  ),
};

export const 卡片: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>本月資料</CardTitle>
        <CardDescription>2024 年 2 月，截至今日</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tabular-nums">1,284</CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">查看明細</Button>
        <Button size="sm" variant="outline">匯出</Button>
      </CardFooter>
    </Card>
  ),
};
