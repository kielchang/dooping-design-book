// 壓力測試／超大數值：13 位數金額、超長小數。千分位還在嗎？會不會自動縮小字級（不該）？
// 容器是捲動還是撐破？
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type Column } from "../ui/data-table";
import { EditableField } from "../form/editable-field";
import { Delta } from "../ui/delta";
import { formatMoney, formatNumber } from "../lib/utils";
import { type DemoRecord } from "../demo/sample-data";
import { makeRecords } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超大數值" };
export default meta;
type Story = StoryObj;

const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", cell: (r) => r.id },
  { key: "name", header: "項目", cell: (r) => r.name },
  {
    key: "qty", header: "數量", numeric: true,
    cell: (r) => formatNumber(r.qty), sortValue: (r) => r.qty,
    total: (rows) => formatNumber(rows.reduce((s, r) => s + r.qty, 0)),
  },
  {
    key: "amount", header: "金額", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
    total: (rows) => formatMoney(rows.reduce((s, r) => s + r.amount, 0)),
  },
];

export const 十三位數金額: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">金額範圍 [1e12, 9.9e12]——合計列會到 14 位數</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：千分位還在嗎？數字欄有沒有偷偷縮小字級（規範：數值欄一律不縮字級，改為容器捲動）？
          合計列與明細列的字級一致嗎？
        </p>
        <DataTable
          rows={makeRecords({ count: 6, amountRange: [1e12, 9.9e12], qtyRange: [10_000, 900_000] })}
          columns={columns}
          getRowKey={(r) => r.id}
          searchable={false}
        />
      </div>
      <div className="max-w-sm space-y-2">
        <p className="text-sm font-medium">同一個 13 位數放進逐欄編輯</p>
        <EditableField
          label="上限額度"
          kind="money"
          value={9_876_543_210_123}
          original={9_876_543_210_123}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const 超長小數: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">數量 10 位小數、金額 8 位小數</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：顯示端**不四捨五入**是規約（formatNumber 忠實呈現到 10 位）——
        於是小數位不齊的欄位右對齊時會參差。這裡要回答的是「該在計算層進位到幾位」，
        不是「顯示層要不要偷偷 round」。
      </p>
      <DataTable
        rows={makeRecords({ count: 4, qtyRange: [0, 1], qtyDecimals: 10, amountRange: [0, 1], amountDecimals: 8 })}
        columns={columns}
        getRowKey={(r) => r.id}
        searchable={false}
      />
    </div>
  ),
};

export const 零與負值: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：數量全零、金額跨越正負</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：負金額是會計慣例的括號（不是只靠紅字）；全零的合計是「0」不是空白；
        差異欄在 0 的時候不該掛正負號。
      </p>
      <DataTable
        rows={makeRecords({ count: 6, qtyRange: [0, 0], amountRange: [-250_000, 250_000] })}
        columns={[
          ...columns,
          {
            key: "delta", header: "與基準差異", numeric: true,
            cell: (r) => <Delta value={r.amount} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
            sortValue: (r) => r.amount,
          },
        ]}
        getRowKey={(r) => r.id}
        searchable={false}
      />
    </div>
  ),
};
