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
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除訂單</Button>
      </div>
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
        <Badge variant="success">已出貨</Badge>
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
    <div className="max-w-xl space-y-2">
      <Callout variant="success" title="這批訂單已全部出貨">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
      <Callout variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個客戶。</Callout>
      <Callout variant="warning" title="有 3 筆訂單缺少收件資訊">未填寫前無法排程出貨。</Callout>
      <Callout variant="danger" title="庫存不足，無法確認訂單" tag="E-104">品項「伺服馬達 750W」可用量 2，需求 6。</Callout>
    </div>
  ),
};

export const 卡片: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>本月訂單</CardTitle>
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
