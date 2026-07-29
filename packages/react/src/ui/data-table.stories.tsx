import type { Meta, StoryObj } from "@storybook/react";
import { PackageOpen } from "lucide-react";
import { DataTable, type Column } from "./data-table";
import { Badge } from "./badge";
import { Button } from "./button";
import { Delta } from "./delta";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord } from "../demo/sample-data";

const meta: Meta<typeof DataTable> = { title: "元件/資料/資料表 DataTable" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = {
  draft: "secondary",
  confirmed: "info",
  done: "success",
  void: "danger",
} as const;

const columns: Column<DemoRecord>[] = [
  {
    key: "id", header: "編號", freeze: true,
    cell: (r) => r.id, sortValue: (r) => r.id, filterText: (r) => r.id,
  },
  {
    key: "unit", header: "單位",
    cell: (r) => r.unit, sortValue: (r) => r.unit, filterText: (r) => r.unit, filter: "select",
  },
  {
    key: "name", header: "項目", truncate: 180,
    cell: (r) => r.name, sortValue: (r) => r.name, filterText: (r) => r.name,
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
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status],
    filterText: (r) => STATUS_LABEL[r.status],
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
      rows={demoRecords}
      columns={columns}
      getRowKey={(r) => r.id}
      initialSort={{ key: "amount", dir: "desc" }}
      pageSize={5}
      csv={{
        headers: ["編號", "單位", "項目", "分類", "數量", "金額", "狀態", "建立日期"],
        row: (r) => [r.id, r.unit, r.name, r.category, r.qty, r.amount, STATUS_LABEL[r.status], r.createdAt],
        fileName: "records.csv",
      }}
    />
  ),
};

export const 空狀態: Story = {
  render: () => (
    <DataTable
      rows={[] as DemoRecord[]}
      columns={columns}
      getRowKey={(r) => r.id}
      empty={{
        title: "還沒有任何資料",
        hint: "建立第一筆後，這裡會顯示明細與合計。",
        icon: <PackageOpen className="size-7" />,
        action: <Button size="sm">新增一筆</Button>,
      }}
    />
  ),
};

export const 密集模式與變異欄: Story = {
  render: () => {
    const cols: Column<DemoRecord>[] = [
      ...columns.slice(0, 2),
      {
        key: "delta", header: "與上期差異", numeric: true,
        cell: (r) => <Delta value={r.amount - 100_000} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
        sortValue: (r) => r.amount - 100_000,
      },
    ];
    return <DataTable rows={demoRecords.slice(0, 6)} columns={cols} getRowKey={(r) => r.id} dense searchable={false} />;
  },
};
