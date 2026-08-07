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
  // 排序：點欄頭 → th 的 aria-sort 連動（首擊 desc——後台先看大的，再擊 asc）；
  // 篩選：面板 portal 到 body、選項是 role=checkbox、Esc 收回。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const sortBtn = canvas.getByRole("button", { name: /^單位/ });
    await userEvent.click(sortBtn);
    await waitFor(() =>
      expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "descending"));
    await userEvent.click(sortBtn);
    await waitFor(() =>
      expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "ascending"));

    await userEvent.click(canvas.getByRole("button", { name: "篩選 單位" }));
    await within(doc.body).findAllByRole("checkbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(doc.body).queryAllByRole("checkbox")).toHaveLength(0));
  },
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

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 資料出自 demo/generate 的確定性生成器——「把資料筆數拉到 0 看空狀態」
// 這類驗收動線，對方能在 Controls 面板自己做。
type 互動Args = {
  資料筆數: number;
  每頁筆數: number;
  斑馬紋: boolean;
  密集模式: boolean;
  十字對準: boolean;
  可調欄寬: boolean;
  超長名稱: boolean;
  載入中: boolean;
};

export const 互動: StoryObj<互動Args> = {
  args: {
    資料筆數: 42,
    每頁筆數: 15,
    斑馬紋: true,
    密集模式: false,
    十字對準: true,
    可調欄寬: true,
    超長名稱: false,
    載入中: false,
  },
  argTypes: {
    資料筆數: { control: { type: "range", min: 0, max: 200, step: 1 } },
    每頁筆數: { control: "inline-radio", options: [5, 15, 30, 50] },
    斑馬紋: { control: "boolean" },
    密集模式: { control: "boolean" },
    十字對準: { control: "boolean" },
    可調欄寬: { control: "boolean" },
    超長名稱: { control: "boolean" },
    載入中: { control: "boolean" },
  },
  render: (a) => (
    <DataTable
      // pageSize 是內部分頁 state 的初值，改 arg 必須 remount 才會生效；
      // rows 刻意不進 key——調筆數時保留既有的排序與篩選，才能玩「條件不變、資料變」
      key={a.每頁筆數}
      rows={makeRecords(a.資料筆數, { longNameRatio: a.超長名稱 ? 0.15 : 0 })}
      columns={columns}
      getRowKey={(r) => r.id}
      pageSize={a.每頁筆數}
      zebra={a.斑馬紋}
      dense={a.密集模式}
      crosshair={a.十字對準}
      resizable={a.可調欄寬}
      loading={a.載入中}
    />
  ),
};
