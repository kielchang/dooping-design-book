import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Breadcrumb } from "./breadcrumb";
import { Badge } from "./badge";
import { Button } from "./button";

const meta: Meta = { title: "元件/版面/頁首與麵包屑" };
export default meta;
type Story = StoryObj;

export const 明細頁頁首: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        back={{ label: "返回清單", onNav: () => {} }}
        title="R-2406 台興機械"
        badge={<Badge variant="info">已確認</Badge>}
        meta="代號 R-2406"
        actions={
          <>
            <Button size="sm" variant="outline">匯出</Button>
            <Button size="sm">補充資訊</Button>
          </>
        }
      />
      <p className="text-tiny text-muted-foreground">
        明細頁頁首＝識別＋狀態＋這個狀態允許的動作。h1 由元件渲染（一頁一個）；
        動作區至多一顆主要動作，破壞性動作放最後、必經對話框確認。
      </p>
    </div>
  ),
};

export const 清單頁頁首: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="項目清單"
        meta="共 18 筆"
        description="這一頁列出全部項目；點任一列進明細。"
        actions={<Button size="sm">新增項目</Button>}
      />
      <p className="text-tiny text-muted-foreground">
        清單頁不放返回與麵包屑（它就是入口層）；說明只有一行的位置，長說明放內容區。
      </p>
    </div>
  ),
};

export const 麵包屑與壓測: Story = {
  render: () => (
    <div className="max-w-xl space-y-5">
      <Breadcrumb
        items={[
          { label: "項目清單", onNav: () => {} },
          { label: "R-2406 台興機械" },
        ]}
      />
      <Breadcrumb
        items={[
          { label: "全部分類", onNav: () => {} },
          { label: "這是一個非常長的中間層名稱用來測試折行行為", onNav: () => {} },
          { label: "更長的目前頁名稱同樣不會把版面撐破而是自然折行" },
        ]}
      />
      <p className="text-tiny text-muted-foreground">
        最後一項是目前頁：不可點、aria-current="page"。超過三層代表資訊架構太深，
        該修站台層分區，不是加長麵包屑。長標籤自然折行，不截斷。
      </p>
    </div>
  ),
};
