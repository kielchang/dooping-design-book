// 壓力測試／超多欄位：表格 10 欄以上。凍結首欄還有效嗎？
// 水平捲動時黏性表頭有沒有透出後面的內容？
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type Column } from "../ui/data-table";
import { Badge } from "../ui/badge";
import { Delta } from "../ui/delta";
import { formatMoney, formatNumber, formatPercent } from "../lib/utils";
import { STATUS_LABEL, type DemoRecord } from "../demo/sample-data";
import { makeRecords } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超多欄位" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = { draft: "secondary", confirmed: "info", done: "success", void: "danger" } as const;

const rows = makeRecords({ count: 20, longNameRatio: 0.15 });
const grandTotal = rows.reduce((s, r) => s + r.amount, 0);

// 9 個原生欄位＋ 3 個衍生欄＝ 12 欄
const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", freeze: true, cell: (r) => r.id, sortValue: (r) => r.id },
  { key: "unit", header: "單位", cell: (r) => r.unit, sortValue: (r) => r.unit, filter: "select", filterText: (r) => r.unit },
  { key: "name", header: "項目", truncate: 160, cell: (r) => r.name, filterText: (r) => r.name },
  { key: "category", header: "類別", cell: (r) => r.category, sortValue: (r) => r.category },
  {
    key: "qty", header: "數量", numeric: true,
    cell: (r) => formatNumber(r.qty), sortValue: (r) => r.qty,
    total: (rs) => formatNumber(rs.reduce((s, r) => s + r.qty, 0)),
  },
  {
    key: "amount", header: "金額", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
    total: (rs) => formatMoney(rs.reduce((s, r) => s + r.amount, 0)),
  },
  {
    key: "delta", header: "與基準差異", numeric: true,
    cell: (r) => <Delta value={r.amount - 150_000} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
    sortValue: (r) => r.amount - 150_000,
  },
  {
    key: "share", header: "佔比", numeric: true,
    cell: (r) => formatPercent(r.amount / grandTotal), sortValue: (r) => r.amount / grandTotal,
  },
  {
    key: "status", header: "狀態",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status], filter: "select", filterText: (r) => STATUS_LABEL[r.status],
  },
  { key: "owner", header: "負責組別", cell: (r) => r.owner, sortValue: (r) => r.owner },
  { key: "createdAt", header: "建立日期", cell: (r) => r.createdAt, sortValue: (r) => r.createdAt },
  { key: "note", header: "備註", cell: (r) => (r.status === "void" ? "已作廢，不列入例行彙整" : "—") },
];

export const 十二欄: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">12 欄＋凍結首欄＋黏性表頭（maxHeight 360px）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：水平捲動時凍結的「編號」欄還在原地嗎？垂直捲動時黏性表頭下緣
        有沒有透出後面的內容？合計列橫向捲動時對得上各自的欄嗎？
      </p>
      <DataTable
        rows={rows}
        columns={columns}
        getRowKey={(r) => r.id}
        stickyHeader
        maxHeight="360px"
        pageSize={30}
      />
    </div>
  ),
};

export const 單欄: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：只剩一欄</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：單欄的表格還像表格嗎？搜尋、排序、分頁這些配件在一欄時會不會顯得突兀？
        ——如果只剩一欄，也許該用清單而不是表格。
      </p>
      <DataTable
        rows={makeRecords({ count: 5 })}
        columns={[{ key: "name", header: "項目", cell: (r) => r.name, sortValue: (r) => r.name }]}
        getRowKey={(r) => r.id}
        searchable={false}
      />
    </div>
  ),
};
