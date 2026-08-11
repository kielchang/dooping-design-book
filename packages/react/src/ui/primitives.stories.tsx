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
        用工具列的<strong>色相</strong>切主題：只有 <code>brand</code> 那顆會變，其餘全部不動。
        資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的<strong>出現面積</strong>失控
        （色彩疲勞管的是面積與頻率，不是色相種類數）。切到<strong>石墨</strong>時 <code>brand</code>
        會與 <code>default</code> 完全一樣——那一組刻意沒有品牌色。
      </p>

      <div className="max-w-2xl space-y-2 rounded-md border border-l-4 border-l-danger bg-danger-subtle p-3 text-danger-subtle-foreground">
        <p className="text-xs font-semibold">brand 不要用在確認／送出／儲存上</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-xs">
        <Button size="sm">Submit request</Button> Correct
          </span>
          <span className="flex items-center gap-2 text-xs">
        <Button size="sm" variant="brand">Submit request</Button> Incorrect
          </span>
        </div>
        <p className="text-xs leading-relaxed">
          <code>--brand</code> 的職責是<strong>識別</strong>（這是誰的產品），確認按鈕的職責是
          <strong>指示可供性</strong>（按下去會提交）。色相帶著既成慣例——綠＝通行、藍＝系統預設、
          紅＝停止、灰＝停用；紫與洋紅<strong>沒有動作慣例</strong>，放在確認按鈕上會讀成裝飾。
          把工具列切到藍紫或紫晶，比較上面兩顆就看得出來。
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
        「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。
        多一個 variant 只會讓人猶豫該用哪個。
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
        徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。
        四種狀態走<strong>淡底層</strong>，與提示框的低強度同一組 token——所以整排的構造與極性一致
        （全部是「淡底＋同色相深墨」）。改版前 success／warning／info 是中明度實色配深字、
        danger 是深實色配反白，<strong>一排裡有兩種極性</strong>、底色 L* 全距 23.5；
        眼睛會把極性反轉讀成「不同種類」而不是「不同嚴重度」。現在全距收到 10。
      </p>
      <div className="space-y-2 border-t pt-3">
        <p className="text-xs font-semibold">intensity=&quot;high&quot; · 實色，只給必須喊的場合</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" intensity="high">Complete</Badge>
          <Badge variant="warning" intensity="high">Needs information</Badge>
          <Badge variant="info" intensity="high">In review</Badge>
          <Badge variant="danger" intensity="high">Returned</Badge>
        </div>
        <p className="max-w-2xl text-xs text-muted-foreground">
          <strong>資料表裡不要用這一排。</strong>一頁上百個徽章全用實色，高飽和色的出現面積會失控
          ——色彩疲勞管的是面積 × 頻率，不是色相種類數。這一排也正好是舊版的長相：
          注意 danger 那顆的極性與左邊三顆相反。
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
        <p className="text-xs font-semibold">低強度（預設）· 日常與次要提示</p>
        <Callout variant="success" title="All records are complete">12 records; the last completed on 2024-02-05.</Callout>
        <Callout variant="info" title="Tip" tag="TIP">Use a column filter to compare multiple units at once.</Callout>
        <Callout variant="warning" title="3 records need information">Complete the fields before moving to the next step.</Callout>
        <Callout variant="danger" title="Not enough quota to confirm" tag="E-104">Item “Plan C — First draft” has 2 available; 6 required.</Callout>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold">高強度 · 阻斷式，必須停下來決定</p>
        <Callout intensity="high" variant="success" title="All records are complete">12 records; the last completed on 2024-02-05.</Callout>
        <Callout intensity="high" variant="info" title="Tip" tag="TIP">Use a column filter to compare multiple units at once.</Callout>
        <Callout intensity="high" variant="warning" title="3 records need information">Complete the fields before moving to the next step.</Callout>
        <Callout intensity="high" variant="danger" title="Not enough quota to confirm" tag="E-104">Item “Plan C — First draft” has 2 available; 6 required.</Callout>
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
