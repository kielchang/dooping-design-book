import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent, waitFor } from "@storybook/test";
import { PackageOpen } from "lucide-react";
import { DataTable, type Column } from "./data-table";
import { Badge } from "./badge";
import { Button } from "./button";
import { Delta } from "./delta";
import { formatMoney, formatNumber } from "../lib/utils";
import { useTableUrlState, type UrlStateAdapter } from "../lib/use-table-url-state";
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

// ── v0.12.0 強化：faceted 篩選、批次操作、欄位顯示、網址同步 ──

export const Facet_篩選: Story = {
  render: () => (
    <DataTable rows={demoRecords} columns={columns} getRowKey={(r) => r.id} facets={["status", "unit"]} />
  ),
  // 契約：facet 鈕與表頭篩選共用同一份狀態——勾選後列數變、篩選 chip 出現、鈕上出現數字。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    // 「狀態」同名者有二：工具列 facet 鈕與表頭排序鈕——工具列在 DOM 前面，取第一個
    await userEvent.click(canvas.getAllByRole("button", { name: "狀態" })[0]);
    const panel = await within(doc.body).findByRole("dialog");
    const option = within(panel).getByRole("checkbox", { name: /已確認/ });
    // 逐值計數顯示在選項右側
    await expect(option).toHaveTextContent(/\d/);
    await userEvent.click(option);
    await userEvent.keyboard("{Escape}");
    // 篩選 chip 與表頭篩選同一份狀態
    await waitFor(() => expect(canvas.getByText("狀態：已確認")).toBeVisible());
    const rows = canvas.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
    await userEvent.click(canvas.getByRole("button", { name: /全部清除|移除 狀態：已確認/ }));
  },
};

function BulkDemo() {
  const [message, setMessage] = React.useState("");
  return (
    <div className="space-y-2">
      {message && <p className="text-sm text-muted-foreground" data-testid="bulk-result">{message}</p>}
      <DataTable
        rows={demoRecords}
        columns={columns}
        getRowKey={(r) => r.id}
        selectable
        bulkActions={({ selected, clear }) => (
          <>
            <Button size="sm" variant="outline" className="h-7" onClick={() => { setMessage(`已匯出 ${selected.length} 筆`); clear(); }}>
              匯出所選
            </Button>
            <Button size="sm" variant="destructive" className="h-7" onClick={() => { setMessage(`已作廢 ${selected.length} 筆`); clear(); }}>
              作廢所選
            </Button>
          </>
        )}
      />
    </div>
  );
}

export const 批次操作: Story = {
  render: () => <BulkDemo />,
  // 契約：無選取不渲染工具列；表頭勾選只切當頁；方向鍵在列內移動焦點；清除即消失。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("toolbar")).toBeNull();
    const first = canvas.getByRole("checkbox", { name: "選取 R-2401" });
    await userEvent.click(first);
    await userEvent.click(canvas.getByRole("checkbox", { name: "選取 R-2402" }));
    const bar = await canvas.findByRole("toolbar", { name: "已選 2 筆" });
    // 方向鍵在列內移動焦點
    within(bar).getByRole("button", { name: "匯出所選" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(within(bar).getByRole("button", { name: "作廢所選" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(within(bar).getByRole("button", { name: "清除選取" })).toHaveFocus();
    await userEvent.click(within(bar).getByRole("button", { name: "清除選取" }));
    await waitFor(() => expect(canvas.queryByRole("toolbar")).toBeNull());
  },
};

export const 欄位顯示: Story = {
  render: () => (
    <DataTable
      rows={demoRecords}
      columns={columns.map((c) => (c.key === "createdAt" ? { ...c, defaultHidden: true } : c))}
      getRowKey={(r) => r.id}
      columnVisibility
    />
  ),
  // 契約：取消勾選的欄整欄消失；defaultHidden 初始就隱藏；凍結欄不在選單裡。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    // 先證明 columnheader 查得到（否則後面的「不存在」斷言全是空轉）
    await expect(canvas.getByRole("columnheader", { name: /單位/ })).toBeVisible();
    expect(canvas.queryByRole("columnheader", { name: /建立日期/ })).toBeNull();

    // 注意：Radix DropdownMenu 是 modal——開著時選單外的內容整個 aria-hidden，
    // 對表頭的斷言一律要在 Escape 關閉**之後**做，否則查不到（或空轉）。
    await userEvent.click(canvas.getByRole("button", { name: "欄位" }));
    let menu = await within(doc.body).findByRole("menu");
    expect(within(menu).queryByRole("menuitemcheckbox", { name: "編號" })).toBeNull(); // 凍結欄不可隱藏
    await userEvent.click(within(menu).getByRole("menuitemcheckbox", { name: "單位" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("columnheader", { name: /單位/ })).toBeNull());

    // 重開選單再把 defaultHidden 的欄打開
    await userEvent.click(canvas.getByRole("button", { name: "欄位" }));
    menu = await within(doc.body).findByRole("menu");
    await userEvent.click(within(menu).getByRole("menuitemcheckbox", { name: "建立日期" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.getByRole("columnheader", { name: /建立日期/ })).toBeVisible());
  },
};

/** 網址同步示範：畫面上直接顯示序列化字串，play 對它斷言（不碰真的 location）。 */
function UrlSyncDemo() {
  const [search, setSearch] = React.useState("");
  const listeners = React.useRef(new Set<() => void>());
  const adapter = React.useMemo<UrlStateAdapter>(() => ({
    get: () => search,
    set: (next) => { setSearch(next); listeners.current.forEach((cb) => cb()); },
    subscribe: (cb) => { listeners.current.add(cb); return () => listeners.current.delete(cb); },
  }), [search]);
  const { state, onStateChange } = useTableUrlState({ adapter });
  return (
    <div className="space-y-2">
      <p className="rounded border bg-muted px-2 py-1 font-mono text-xs" data-testid="url">
        ?{search || "（全部預設，網址乾淨）"}
      </p>
      <DataTable rows={demoRecords} columns={columns} getRowKey={(r) => r.id} pageSize={5} state={state} onStateChange={onStateChange} />
    </div>
  );
}

export const 網址同步: Story = {
  render: () => <UrlSyncDemo />,
  // 契約：搜尋寫進 q=、翻頁寫進 page=（1-based）、改條件自動回第 1 頁（page 參數消失）。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const url = () => canvas.getByTestId("url").textContent ?? "";
    await userEvent.click(canvas.getByRole("button", { name: /下一頁/ }));
    await waitFor(() => expect(url()).toContain("page=2"));
    const input = canvas.getByRole("textbox", { name: "搜尋關鍵字…" });
    await userEvent.type(input, "甲");
    // 條件變更自動回第 1 頁：page 參數消失、q 出現
    await waitFor(() => expect(url()).toContain("q="));
    await waitFor(() => expect(url()).not.toContain("page="));
    await userEvent.clear(input);
  },
};
