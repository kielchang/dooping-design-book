// 壓力測試／超長文字值：內容超出欄寬時，截斷還是換行？截斷有沒有 Tooltip？
// 換行的那幾列，同列其他欄位有沒有跟著變高？
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type Column } from "../ui/data-table";
import { ChangeSummary } from "../form/change-summary";
import { formatMoney } from "../lib/utils";
import { STATUS_LABEL, type DemoRecord } from "../demo/sample-data";
import { makeRecords, makeChanges } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超長文字值" };
export default meta;
type Story = StoryObj;

// 同一個 name 欄位放兩次：一次截斷、一次不截斷，兩種策略的代價並排看
const columns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", cell: (r) => r.id },
  {
    key: "nameTruncate", header: "項目（截斷 200px）", truncate: 200,
    cell: (r) => r.name, filterText: (r) => r.name,
  },
  { key: "nameWrap", header: "項目（不截斷）", cell: (r) => r.name },
  { key: "status", header: "狀態", cell: (r) => STATUS_LABEL[r.status] },
  {
    key: "amount", header: "金額", numeric: true,
    cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount,
  },
];

export const 截斷與換行: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">一半的筆數帶 40 字左右的名稱（makeRecords longNameRatio: 0.5）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：截斷欄 hover 有沒有完整內容的提示？不截斷欄換行後，同一列的「狀態」「金額」跟著變高，
        掃讀金額欄的視線會被打斷——這就是要在元件層決定截斷策略的原因。
      </p>
      <DataTable
        rows={makeRecords({ count: 6, longNameRatio: 0.5 })}
        columns={columns}
        getRowKey={(r) => r.id}
        searchable={false}
      />
    </div>
  ),
};

export const 變更摘要的長值: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <p className="text-sm font-medium">一半的變更帶超長標籤與超長前後值（makeChanges longTextRatio: 0.5）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：每一列仍然是「舊值 → 新值」一行嗎？截斷處 hover 拿得到完整值嗎？
        箭頭與還原鈕有沒有被長文字推走？
      </p>
      <ChangeSummary changes={makeChanges(8, { longTextRatio: 0.5 })} onRevertField={() => {}} onRevertAll={() => {}} />
    </div>
  ),
};

export const 空字串: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">「沒有」那一側：整欄 name 都是空字串</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：空儲存格是留白、還是顯示占位符號？列高有沒有塌掉？
          「消失的 UI 沒有人會在開發時注意到」——這支 story 就是拿來注意它的。
        </p>
        <DataTable
          rows={makeRecords({ count: 4 }).map((r) => ({ ...r, name: "" }))}
          columns={columns}
          getRowKey={(r) => r.id}
          searchable={false}
        />
      </div>
      <div className="max-w-md space-y-2">
        <p className="text-sm font-medium">零筆變更：ChangeSummary 的空狀態</p>
        <ChangeSummary changes={[]} />
      </div>
    </div>
  ),
};
