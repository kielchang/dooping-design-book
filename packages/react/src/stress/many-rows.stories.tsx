// 壓力測試／超多筆：42 筆（跨越分頁門檻）、200 筆、0 筆。
// 分頁器出現時機、合計是否算全部、捲動是否卡頓。
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import type { Meta, StoryObj } from "@storybook/react";
import { PackageOpen } from "lucide-react";
import { DataTable, type Column } from "../ui/data-table";
import { Badge } from "../ui/badge";
import { formatMoney, formatNumber } from "../lib/utils";
import { STATUS_LABEL, type DemoRecord } from "../demo/sample-data";
import { makeRecords } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超多筆" };
export default meta;
type Story = StoryObj;

const STATUS_VARIANT = { draft: "secondary", confirmed: "info", done: "success", void: "danger" } as const;

const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", cell: (r) => r.id, sortValue: (r) => r.id },
  { key: "name", header: "項目", truncate: 200, cell: (r) => r.name, filterText: (r) => r.name },
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
    key: "status", header: "狀態",
    cell: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>,
    sortValue: (r) => STATUS_LABEL[r.status], filter: "select", filterText: (r) => STATUS_LABEL[r.status],
  },
];

export const 四十二筆: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">42 筆、每頁 15——剛好跨過門檻式分頁的線</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：分頁器這時才第一次出現，位置與行為對嗎？
        合計列算的是**篩選後全部 42 筆**，不是當頁 15 筆——拿第一頁的金額心算一下就能抓到這種錯。
      </p>
      <DataTable rows={makeRecords({ count: 42 })} columns={columns} getRowKey={(r) => r.id} pageSize={15} />
    </div>
  ),
};

export const 兩百筆: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">200 筆、每頁 50、黏性表頭</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：捲動順不順？切頁順不順？搜尋打一個字的反應時間能不能接受？
        這是「上線第一週就會遇到」的資料量，不是罕見狀況。
      </p>
      <DataTable
        rows={makeRecords({ count: 200 })}
        columns={columns}
        getRowKey={(r) => r.id}
        pageSize={50}
        stickyHeader
        maxHeight="420px"
      />
    </div>
  ),
};

export const 零筆: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：0 筆</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：空狀態有標題、說明與下一步，不是一個空白的表框；
        分頁器與合計列這時都不該出現。
      </p>
      <DataTable
        rows={[] as DemoRecord[]}
        columns={columns}
        getRowKey={(r) => r.id}
        empty={{
          title: "還沒有任何紀錄",
          hint: "建立第一筆後，這裡會顯示明細與合計。",
          icon: <PackageOpen className="size-7" />,
        }}
      />
    </div>
  ),
};

// 中文 arg playground（見〈Story 撰寫慣例〉）：讓驗收的人自己把「資料筆數」拉到 0 或 200
export const 互動: StoryObj<{ 資料筆數: number; 每頁筆數: number; 斑馬紋: boolean }> = {
  args: { 資料筆數: 42, 每頁筆數: 15, 斑馬紋: true },
  argTypes: {
    資料筆數: { control: { type: "range", min: 0, max: 200, step: 1 } },
    每頁筆數: { control: "inline-radio", options: [5, 15, 30, 50] },
    斑馬紋: { control: "boolean" },
  },
  render: (a) => (
    <DataTable
      key={`${a.資料筆數}-${a.每頁筆數}`}
      rows={makeRecords({ count: a.資料筆數 })}
      columns={columns}
      getRowKey={(r) => r.id}
      pageSize={a.每頁筆數}
      zebra={a.斑馬紋}
      empty={{ title: "還沒有任何紀錄", hint: "把「資料筆數」往右拉就有了。" }}
    />
  ),
};
