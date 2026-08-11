import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PackageOpen, Plus } from "lucide-react";
import { DataTable, type Column } from "../ui/data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TabPills } from "../ui/tab-pills";
import { EmptyState } from "../ui/empty-state";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord, type RecordStatus } from "../demo/sample-data";

// 「頁面/」層的 story 是**組成規格**：證明文件站頁面章寫的骨架
// （頁首 → 工具 → 內容）用現有元件就組得出來，不需要新元件。
// 各元件自身的行為規格在「元件/」層各自的 story，這裡不重複。
const meta: Meta = { title: "Pages/List Page", id: "頁面/清單頁" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = {
  draft: "secondary",
  confirmed: "info",
  done: "success",
  void: "danger",
} as const;

const columns: Column<DemoRecord>[] = [
  { key: "id", header: "ID", freeze: true, cell: (r) => r.id, sortValue: (r) => r.id, filterText: (r) => r.id },
  { key: "unit", header: "Unit", cell: (r) => r.unit, sortValue: (r) => r.unit, filterText: (r) => r.unit, filter: "select" },
  { key: "name", header: "Item", truncate: 180, cell: (r) => r.name, sortValue: (r) => r.name, filterText: (r) => r.name },
  {
    key: "amount", header: "Amount", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
    total: (rows) => formatMoney(rows.reduce((s, r) => s + r.amount, 0)),
  },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status], filterText: (r) => STATUS_LABEL[r.status], filter: "select",
  },
  { key: "createdAt", header: "Created", cell: (r) => r.createdAt, sortValue: (r) => r.createdAt, filterText: (r) => r.createdAt },
];

export const 典型組成: Story = {
  name: "Typical composition",
  render: function Render() {
    const [tab, setTab] = useState<"all" | RecordStatus>("all");
    const rows = tab === "all" ? demoRecords : demoRecords.filter((r) => r.status === tab);
    const count = (s: RecordStatus) => demoRecords.filter((r) => r.status === s).length;
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：識別＋筆數＋唯一的主要動作（固定右上） */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Item list</h1>
            <p className="text-sm text-muted-foreground">{demoRecords.length} records · Last updated 2024-02-07</p>
          </div>
          <Button><Plus /> Add item</Button>
        </div>

        {/* 工具區：檢視切換（實務上這個狀態要寫進網址，深連結才回得來） */}
        <TabPills
          label="Processing status"
          value={tab}
          onChange={(k) => setTab(k as "all" | RecordStatus)}
          tabs={[
            { key: "all", label: "All" },
            { key: "draft", label: STATUS_LABEL.draft, badge: <Badge variant="secondary">{count("draft")}</Badge> },
            { key: "confirmed", label: STATUS_LABEL.confirmed, badge: <Badge variant="info">{count("confirmed")}</Badge> },
            { key: "done", label: STATUS_LABEL.done },
            { key: "void", label: STATUS_LABEL.void },
          ]}
        />

        {/* 內容區：資料表自帶搜尋、欄篩選、分頁、合計與匯出（細則見資料表標準） */}
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(r) => r.id}
          initialSort={{ key: "createdAt", dir: "desc" }}
          pageSize={10}
          onRowClick={() => {}}
          csv={{
            headers: ["ID", "Unit", "Item", "Amount", "Status", "Created"],
            row: (r) => [r.id, r.unit, r.name, r.amount, STATUS_LABEL[r.status], r.createdAt],
            fileName: "records.csv",
          }}
        />
        <p className="text-xs text-muted-foreground">
          The row is the entry point: select one to open its detail page. Keep row actions in the detail action area instead of adding a wall of icons.
        </p>
      </div>
    );
  },
};

export const 空與載入: Story = {
  name: "Empty and loading",
  render: () => (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-medium">First visit (there is no data yet): keep the header and provide a next step</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Item list</h1>
            <p className="text-sm text-muted-foreground">0 records</p>
          </div>
          <Button><Plus /> Add item</Button>
        </div>
        <div className="rounded-lg border">
          <EmptyState
            icon={<PackageOpen className="size-7" />}
            title="No items yet"
            hint="Create the first record to see details and totals here."
            action={<Button size="sm">Add a record</Button>}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">Loading: preserve the layout height so the page does not jump</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Item list</h1>
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
          <Button disabled><Plus /> Add item</Button>
        </div>
        <div className="flex min-h-64 items-center justify-center rounded-lg border" role="status">
          <p className="text-sm text-muted-foreground">Loading the list…</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing “{formatNumber(0)}” before the data arrives is wrong—zero is an answer, while loading is not.
        </p>
      </div>
    </div>
  ),
};
