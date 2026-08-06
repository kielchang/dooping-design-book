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
const meta: Meta = { title: "頁面/清單頁" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = {
  draft: "secondary",
  confirmed: "info",
  done: "success",
  void: "danger",
} as const;

const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", freeze: true, cell: (r) => r.id, sortValue: (r) => r.id, filterText: (r) => r.id },
  { key: "unit", header: "單位", cell: (r) => r.unit, sortValue: (r) => r.unit, filterText: (r) => r.unit, filter: "select" },
  { key: "name", header: "項目", truncate: 180, cell: (r) => r.name, sortValue: (r) => r.name, filterText: (r) => r.name },
  {
    key: "amount", header: "金額", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
    total: (rows) => formatMoney(rows.reduce((s, r) => s + r.amount, 0)),
  },
  {
    key: "status", header: "狀態",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status], filterText: (r) => STATUS_LABEL[r.status], filter: "select",
  },
  { key: "createdAt", header: "建立日期", cell: (r) => r.createdAt, sortValue: (r) => r.createdAt, filterText: (r) => r.createdAt },
];

export const 典型組成: Story = {
  render: function Render() {
    const [tab, setTab] = useState<"all" | RecordStatus>("all");
    const rows = tab === "all" ? demoRecords : demoRecords.filter((r) => r.status === tab);
    const count = (s: RecordStatus) => demoRecords.filter((r) => r.status === s).length;
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：識別＋筆數＋唯一的主要動作（固定右上） */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">共 {demoRecords.length} 筆・最後更新 2024-02-07</p>
          </div>
          <Button><Plus /> 新增項目</Button>
        </div>

        {/* 工具區：檢視切換（實務上這個狀態要寫進網址，深連結才回得來） */}
        <TabPills
          label="處理狀態"
          value={tab}
          onChange={(k) => setTab(k as "all" | RecordStatus)}
          tabs={[
            { key: "all", label: "全部" },
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
            headers: ["編號", "單位", "項目", "金額", "狀態", "建立日期"],
            row: (r) => [r.id, r.unit, r.name, r.amount, STATUS_LABEL[r.status], r.createdAt],
            fileName: "records.csv",
          }}
        />
        <p className="text-xs text-muted-foreground">
          列本身就是入口：點任一列進明細頁。逐列動作不做一排圖示，收斂進明細頁的動作區。
        </p>
      </div>
    );
  },
};

export const 空與載入: Story = {
  render: () => (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-medium">首次進入（真的沒有資料）：頁首照常、內容區給下一步</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">共 0 筆</p>
          </div>
          <Button><Plus /> 新增項目</Button>
        </div>
        <div className="rounded-lg border">
          <EmptyState
            icon={<PackageOpen className="size-7" />}
            title="還沒有任何項目"
            hint="建立第一筆後，這裡會顯示明細與合計。"
            action={<Button size="sm">新增一筆</Button>}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">載入中：保留版面高度，不讓頁面跳動（Skeleton 元件尚未收錄）</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">載入中…</p>
          </div>
          <Button disabled><Plus /> 新增項目</Button>
        </div>
        <div className="flex min-h-64 items-center justify-center rounded-lg border" role="status">
          <p className="text-sm text-muted-foreground">正在載入清單…</p>
        </div>
        <p className="text-xs text-muted-foreground">
          數字還沒回來就先顯示「{formatNumber(0)}」是錯的——0 是一個答案，載入中不是。
        </p>
      </div>
    </div>
  ),
};
