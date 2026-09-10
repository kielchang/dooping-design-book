import { Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { DataTable, type Column } from "@/components/dooping/data-table";
import { Badge } from "@/components/dooping/badge";
import { Button } from "@/components/dooping/button";
import { TabPills } from "@/components/dooping/tab-pills";
import { PageHeader } from "@/components/dooping/page-header";
import { useTableUrlState } from "@/lib/dooping/use-table-url-state";
import { formatMoney } from "@/lib/dooping/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord, type RecordStatus } from "@/demo/sample-data";
import { useRouterUrlAdapter } from "../url-adapter";

// 清單頁：頁首（標題＋筆數＋唯一主要動作右上）→ 工具區（檢視切換）→ 內容區（資料表）。
// 檢視與表格狀態都寫進網址：篩完的清單可以直接貼給別人（〈後台系統的資訊架構〉的深連結規範）。
//
// 刻意沒開 selectable：〈清單頁〉的「整列可點」與「勾選後出現批次列」同時成立時，
// DataTable 會在可聚焦的列裡包勾選框（axe nested-interactive）。verify-host 第一次跑就抓到，
// 回饋記在 LEDGER.md；元件修好之前，宿主只保留整列可點這條主要入口。

const STATUS_VARIANT = { draft: "secondary", confirmed: "info", done: "success", void: "danger" } as const;

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

const VIEWS = ["all", "draft", "confirmed", "done", "void"] as const;
type View = (typeof VIEWS)[number];

/** 表格狀態在網址裡的前綴：同頁還有 view 參數，兩者不能互相覆寫 */
const TABLE_PREFIX = "t.";

export function ListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const viewParam = params.get("view");
  const view: View = VIEWS.includes(viewParam as View) ? (viewParam as View) : "all";

  const adapter = useRouterUrlAdapter();
  const { state, onStateChange } = useTableUrlState({
    adapter,
    prefix: TABLE_PREFIX,
    defaults: { pageSize: 10, sort: { key: "createdAt", dir: "desc" } },
  });

  // 換檢視＝換條件：回第 1 頁，否則停在第 3 頁會看到空白
  const setView = (next: string) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === "all") p.delete("view");
        else p.set("view", next);
        p.delete(`${TABLE_PREFIX}page`);
        return p;
      },
      { replace: true },
    );

  const rows = view === "all" ? demoRecords : demoRecords.filter((r) => r.status === view);
  const count = (s: RecordStatus) => demoRecords.filter((r) => r.status === s).length;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="存量清查"
        meta={`共 ${demoRecords.length} 筆・最後更新 2024-02-07`}
        actions={
          <Button onClick={() => navigate("/settlement")}>
            <Plus aria-hidden /> 新增項目
          </Button>
        }
      />

      <TabPills
        label="處理狀態"
        value={view}
        onChange={setView}
        tabs={[
          { key: "all", label: "全部" },
          { key: "draft", label: STATUS_LABEL.draft, badge: <Badge variant="secondary">{count("draft")}</Badge> },
          { key: "confirmed", label: STATUS_LABEL.confirmed, badge: <Badge variant="info">{count("confirmed")}</Badge> },
          { key: "done", label: STATUS_LABEL.done },
          { key: "void", label: STATUS_LABEL.void },
        ]}
      />

      <DataTable
        rows={rows}
        columns={columns}
        getRowKey={(r) => r.id}
        pageSize={10}
        state={state}
        onStateChange={onStateChange}
        onRowClick={() => navigate("/master")}
        csv={{
          headers: ["編號", "單位", "項目", "金額", "狀態", "建立日期"],
          row: (r) => [r.id, r.unit, r.name, r.amount, STATUS_LABEL[r.status], r.createdAt],
          fileName: "records.csv",
        }}
      />
    </div>
  );
}
