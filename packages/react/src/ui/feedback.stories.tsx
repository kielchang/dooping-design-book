import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchX, PackageOpen, ShieldOff } from "lucide-react";
import { Delta } from "./delta";
import { EmptyState } from "./empty-state";
import { TabPills } from "./tab-pills";
import { Stepper } from "./stepper";
import { Badge } from "./badge";
import { Button } from "./button";
import { formatMoney } from "../lib/utils";

const meta: Meta = { title: "元件/狀態/變異・空狀態・分頁・步驟" };
export default meta;
type Story = StoryObj;

export const 變異顯示: Story = {
  render: () => (
    <div className="space-y-2 text-sm">
      <p>本月營收與上月比較：<Delta value={128_400} posLabel="增加 " negLabel="減少 " format={formatMoney} /></p>
      <p>誤差數（越少越好）：<Delta value={340} goodWhen="negative" posLabel="超出 " negLabel="短少 " /></p>
      <p>交期落差：<Delta value={-3} goodWhen="negative" posLabel="延遲 " negLabel="提前 " format={(n) => `${n} 天`} /></p>
      <p>與上期持平：<Delta value={0} /></p>
      <p className="pt-2 text-xs text-muted-foreground">
        三重編碼：箭頭 ▲▼ ＋ 文字 ＋ 顏色。把這段用灰階印出來，語意仍然完整——那才算過關。
      </p>
    </div>
  ),
};

export const 三種空狀態: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border">
        <EmptyState
          icon={<PackageOpen className="size-7" />}
          title="還沒有任何資料"
          hint="建立第一筆後，這裡會顯示明細與合計。"
          action={<Button size="sm">新增一筆</Button>}
        />
      </div>
      <div className="rounded-lg border">
        <EmptyState
          icon={<SearchX className="size-7" />}
          title="查無符合的資料"
          hint="目前篩選：單位＝乙單位、狀態＝已完成。試著放寬其中一項。"
          action={<Button size="sm" variant="outline">清除篩選</Button>}
        />
      </div>
      <div className="rounded-lg border">
        <EmptyState icon={<ShieldOff className="size-7" />} title="沒有檢視權限" hint="此區資料僅限管理員檢視，請洽系統管理者。" />
      </div>
    </div>
  ),
};

export const 分頁膠囊: Story = {
  render: function Render() {
    const [tab, setTab] = useState("all");
    return (
      <TabPills
        label="處理狀態"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "all", label: "全部" },
          { key: "draft", label: "草稿", badge: <Badge variant="secondary">3</Badge> },
          { key: "confirmed", label: "已確認", badge: <Badge variant="info">7</Badge> },
          { key: "done", label: "已完成" },
        ]}
      />
    );
  },
};

export const 步驟指示: Story = {
  render: function Render() {
    const [cur, setCur] = useState("items");
    return (
      <div className="max-w-2xl">
        <Stepper
          current={cur}
          onStep={setCur}
          completed={{ unit: true }}
          steps={[
            { key: "unit", label: "選擇單位", hint: "或建立新單位" },
            { key: "items", label: "加入項目", hint: "數量與金額" },
            { key: "extra", label: "補充資訊" },
            { key: "review", label: "確認送出" },
          ]}
        />
      </div>
    );
  },
};
