import type { Meta, StoryObj } from "@storybook/react";
import { PackageOpen } from "lucide-react";
import { DataTable, type Column } from "./data-table";
import { Badge } from "./badge";
import { Button } from "./button";
import { Delta } from "./delta";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoOrders, ORDER_STATUS_LABEL, type DemoOrder } from "../demo/sample-data";

const meta: Meta<typeof DataTable> = { title: "元件/資料/資料表 DataTable" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = {
  draft: "secondary",
  confirmed: "info",
  shipped: "success",
  cancelled: "danger",
} as const;

const columns: Column<DemoOrder>[] = [
  {
    key: "id", header: "訂單編號", freeze: true,
    cell: (r) => r.id, sortValue: (r) => r.id, filterText: (r) => r.id,
  },
  {
    key: "customer", header: "客戶",
    cell: (r) => r.customer, sortValue: (r) => r.customer, filterText: (r) => r.customer, filter: "select",
  },
  {
    key: "item", header: "品項", truncate: 180,
    cell: (r) => r.item, sortValue: (r) => r.item, filterText: (r) => r.item,
  },
  {
    key: "category", header: "分類",
    cell: (r) => r.category, sortValue: (r) => r.category, filterText: (r) => r.category, filter: "select",
  },
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
  {
    key: "status", header: "狀態",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{ORDER_STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => ORDER_STATUS_LABEL[r.status],
    filterText: (r) => ORDER_STATUS_LABEL[r.status],
    filter: "select",
  },
  {
    key: "createdAt", header: "建立日期",
    cell: (r) => r.createdAt, sortValue: (r) => r.createdAt, filterText: (r) => r.createdAt,
  },
];

export const 完整功能: Story = {
  render: () => (
    <DataTable
      rows={demoOrders}
      columns={columns}
      getRowKey={(r) => r.id}
      initialSort={{ key: "amount", dir: "desc" }}
      pageSize={5}
      csv={{
        headers: ["訂單編號", "客戶", "品項", "分類", "數量", "金額", "狀態", "建立日期"],
        row: (r) => [r.id, r.customer, r.item, r.category, r.qty, r.amount, ORDER_STATUS_LABEL[r.status], r.createdAt],
        fileName: "orders.csv",
      }}
    />
  ),
};

export const 空狀態: Story = {
  render: () => (
    <DataTable
      rows={[] as DemoOrder[]}
      columns={columns}
      getRowKey={(r) => r.id}
      empty={{
        title: "還沒有任何訂單",
        hint: "建立第一筆訂單後，這裡會顯示明細與合計。",
        icon: <PackageOpen className="size-7" />,
        action: <Button size="sm">建立訂單</Button>,
      }}
    />
  ),
};

export const 密集模式與變異欄: Story = {
  render: () => {
    const cols: Column<DemoOrder>[] = [
      ...columns.slice(0, 2),
      {
        key: "delta", header: "與上期差異", numeric: true,
        cell: (r) => <Delta value={r.amount - 100_000} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
        sortValue: (r) => r.amount - 100_000,
      },
    ];
    return <DataTable rows={demoOrders.slice(0, 6)} columns={cols} getRowKey={(r) => r.id} dense searchable={false} />;
  },
};
