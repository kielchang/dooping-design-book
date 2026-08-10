// 壓力測試／多類別圖形：20 個類別、12 段的堆疊、1 類、全零、空陣列。
// 標籤會不會糊成一團？超過色票數量怎麼處理？最窄的那段還點得到嗎？
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "../charts/bar-chart";
import { StackedBar } from "../charts/stacked-bar";
import { Legend } from "../charts/legend";
import { colorByKey, PALETTE } from "../charts/base";
import { formatMoney } from "../lib/utils";
import { makeCategories, makeRecords } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/多類別圖形" };
export default meta;
type Story = StoryObj;

const twenty = makeCategories(20);

export const 二十類長條: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">✅ 預設封頂（maxItems 12）：取大者、其餘併「其他」</p>
        <p className="mb-2 text-xs text-muted-foreground">
          撞出來的規範：超過上限彙總成「其他（N 項）」，不要循環用色。
          留意「其他」那支的值——它是 9 個類別的和，不該假裝自己是第 13 類。
        </p>
        <BarChart data={twenty} title="二十類（封頂後）" showValues valueFmt={(n) => formatMoney(n)} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">🚫 不封頂（maxItems 20）：20 支長條</p>
        <p className="mb-2 text-xs text-muted-foreground">
          該看什麼：圖要嘛水平捲動、要嘛標籤擠成一團；捲出畫面外的長條等於不存在。
          這就是封頂存在的理由。
        </p>
        <BarChart data={twenty} maxItems={20} title="二十類（不封頂）" valueFmt={(n) => formatMoney(n)} />
      </div>
    </div>
  ),
};

export const 十二段堆疊: Story = {
  render: () => {
    const keys = makeCategories(12).map((c) => c.label);
    const rows = makeRecords({ count: 5 }).map((r, i) => ({
      label: r.unit,
      segments: makeCategories(12, { seed: 7 + i }).map((c) => ({
        label: c.label,
        value: c.value,
        color: colorByKey(c.label, keys),
      })),
    }));
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">每列 12 段——色票只有 {PALETTE.length} 色</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：第 9 段起 colorByKey 一律退灰（muted）——圖例出現一排同色不同名的項目，
          這是「該把尾巴併成『其他』」的訊號，不是「該去生第 9 種顏色」。
          也試著 hover 最窄的那段：還點得到、讀得到值嗎？
        </p>
        <Legend items={keys.map((k) => ({ label: k, color: colorByKey(k, keys) }))} />
        <StackedBar rows={rows} title="十二段堆疊" valueFmt={(n) => formatMoney(n)} />
      </div>
    );
  },
};

export const 一類與全零: Story = {
  render: () => (
    <div className="max-w-xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">1 個類別</p>
        <p className="mb-2 text-xs text-muted-foreground">單一長條的圖還算圖嗎？——也許一個大數字就夠了。</p>
        <BarChart data={makeCategories(1)} title="單一類別" showValues valueFmt={(n) => formatMoney(n)} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">6 個類別、全部為 0</p>
        <p className="mb-2 text-xs text-muted-foreground">
          該看什麼：座標軸正常、長條全部貼地，**不是除以零炸掉**。
          「本期皆為 0」要由宿主明說，否則使用者會以為資料沒載入。
        </p>
        <BarChart data={makeCategories(6, { valueRange: [0, 0] })} title="全零" showValues />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">「沒有」那一側：空陣列</p>
        <p className="mb-2 text-xs text-muted-foreground">統一出口是一行「無資料」，不畫空白座標軸。</p>
        <BarChart data={[]} title="空資料" />
      </div>
    </div>
  ),
};
