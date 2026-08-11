import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { PackageOpen } from "lucide-react";
import { DataTable, type Column } from "./data-table";
import { Badge } from "./badge";
import { Button } from "./button";
import { Delta } from "./delta";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord } from "../demo/sample-data";
import { makeRecords } from "../demo/generate";

const meta: Meta<typeof DataTable> = { title: "Components/Data/DataTable", id: "元件/資料/資料表-datatable" };
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
    key: "id", header: "ID", freeze: true,
    cell: (r) => r.id, sortValue: (r) => r.id, filterText: (r) => r.id,
  },
  {
    key: "unit", header: "Unit",
    cell: (r) => r.unit, sortValue: (r) => r.unit, filterText: (r) => r.unit, filter: "select",
  },
  {
    key: "name", header: "Item", truncate: 180,
    cell: (r) => r.name, sortValue: (r) => r.name, filterText: (r) => r.name,
  },
  {
    key: "category", header: "Category",
    cell: (r) => r.category, sortValue: (r) => r.category, filterText: (r) => r.category, filter: "select",
  },
  {
    key: "qty", header: "Quantity", numeric: true,
    cell: (r) => formatNumber(r.qty), sortValue: (r) => r.qty,
    total: (rows) => formatNumber(rows.reduce((s, r) => s + r.qty, 0)),
  },
  {
    key: "amount", header: "Amount", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
    total: (rows) => formatMoney(rows.reduce((s, r) => s + r.amount, 0)),
  },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status],
    filterText: (r) => STATUS_LABEL[r.status],
    filter: "select",
  },
  {
    key: "createdAt", header: "Created",
    cell: (r) => r.createdAt, sortValue: (r) => r.createdAt, filterText: (r) => r.createdAt,
  },
];

export const 完整功能: Story = {
  name: "Full featured",
  render: () => (
    <DataTable
      rows={demoRecords}
      columns={columns}
      getRowKey={(r) => r.id}
      initialSort={{ key: "amount", dir: "desc" }}
      pageSize={5}
      csv={{
        headers: ["ID", "Unit", "Item", "Category", "Quantity", "Amount", "Status", "Created"],
        row: (r) => [r.id, r.unit, r.name, r.category, r.qty, r.amount, STATUS_LABEL[r.status], r.createdAt],
        fileName: "records.csv",
      }}
    />
  ),
  // 排序：點欄頭 → th 的 aria-sort 連動（首擊 desc——後台先看大的，再擊 asc）；
  // 篩選：面板 portal 到 body、選項是 role=checkbox、Esc 收回。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const sortBtn = canvas.getByRole("button", { name: /^Unit/ });
    await userEvent.click(sortBtn);
    await waitFor(() =>
      expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "descending"));
    await userEvent.click(sortBtn);
    await waitFor(() =>
      expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "ascending"));

    await userEvent.click(canvas.getByRole("button", { name: "Filter Unit" }));
    await within(doc.body).findAllByRole("checkbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(doc.body).queryAllByRole("checkbox")).toHaveLength(0));
  },
};

export const 空狀態: Story = {
  name: "Empty state",
  render: () => (
    <DataTable
      rows={[] as DemoRecord[]}
      columns={columns}
      getRowKey={(r) => r.id}
      empty={{
        title: "No data yet",
        hint: "Create the first record to see details and totals here.",
        icon: <PackageOpen className="size-7" />,
        action: <Button size="sm">Add a record</Button>,
      }}
    />
  ),
};

export const 密集模式與變異欄: Story = {
  name: "Dense mode and delta column",
  render: () => {
    const cols: Column<DemoRecord>[] = [
      ...columns.slice(0, 2),
      {
        key: "delta", header: "Change from last period", numeric: true,
        cell: (r) => <Delta value={r.amount - 100_000} posLabel="above baseline " negLabel="below baseline " format={formatMoney} />,
        sortValue: (r) => r.amount - 100_000,
      },
    ];
    return <DataTable rows={demoRecords.slice(0, 6)} columns={cols} getRowKey={(r) => r.id} dense searchable={false} />;
  },
};

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 資料出自 demo/generate 的確定性生成器——「把資料筆數拉到 0 看空狀態」
// 這類驗收動線，對方能在 Controls 面板自己做。
type InteractiveArgs = {
  recordCount: number;
  pageSize: number;
  zebra: boolean;
  dense: boolean;
  crosshair: boolean;
  resizable: boolean;
  longNames: boolean;
  loading: boolean;
};

export const 互動: StoryObj<InteractiveArgs> = {
  name: "Interactive playground",
  args: {
    recordCount: 42,
    pageSize: 15,
    zebra: true,
    dense: false,
    crosshair: true,
    resizable: true,
    longNames: false,
    loading: false,
  },
  argTypes: {
    recordCount: { control: { type: "range", min: 0, max: 200, step: 1 } },
    pageSize: { control: "inline-radio", options: [5, 15, 30, 50] },
    zebra: { control: "boolean" },
    dense: { control: "boolean" },
    crosshair: { control: "boolean" },
    resizable: { control: "boolean" },
    longNames: { control: "boolean" },
    loading: { control: "boolean" },
  },
  render: (a) => (
    <DataTable
      // pageSize 是內部分頁 state 的初值，改 arg 必須 remount 才會生效；
      // rows 刻意不進 key——調筆數時保留既有的排序與篩選，才能玩「條件不變、資料變」
      key={a.pageSize}
      rows={makeRecords(a.recordCount, { longNameRatio: a.longNames ? 0.15 : 0 })}
      columns={columns}
      getRowKey={(r) => r.id}
      pageSize={a.pageSize}
      zebra={a.zebra}
      dense={a.dense}
      crosshair={a.crosshair}
      resizable={a.resizable}
      loading={a.loading}
    />
  ),
};
