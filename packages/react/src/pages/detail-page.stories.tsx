import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TabPills } from "../ui/tab-pills";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DataTable, type Column } from "../ui/data-table";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "../ui/dialog";
import { EditableField } from "../form/editable-field";
import { ChangeSummary } from "../form/change-summary";
import { useRecordDiff } from "../form/use-record-diff";
import type { FieldSpec } from "../lib/forms/diff";
import { formatMoney } from "../lib/utils";
import {
  demoProfile, demoRecords, TIER_OPTIONS, STATUS_LABEL, type DemoProfile, type DemoRecord,
} from "../demo/sample-data";

// 明細頁的組成規格：頁首＝識別＋狀態＋該狀態允許的動作，
// 內容用分頁籤切區、欄位唯讀優先（點了才變輸入）。
const meta: Meta = { title: "頁面/明細頁" };
export default meta;
type Story = StoryObj;

const SPECS: FieldSpec[] = [
  { key: "name", label: "單位名稱", kind: "text" },
  { key: "tier", label: "等級", kind: "select", format: (v) => TIER_OPTIONS.find((o) => o.value === v)?.label ?? String(v) },
  { key: "quota", label: "上限額度", kind: "money" },
  { key: "contact", label: "聯絡方式", kind: "text" },
];

const relatedColumns: Column<DemoRecord>[] = [
  { key: "id", header: "編號", cell: (r) => r.id, sortValue: (r) => r.id },
  { key: "name", header: "項目", truncate: 160, cell: (r) => r.name, sortValue: (r) => r.name },
  { key: "amount", header: "金額", numeric: true, cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount },
  { key: "status", header: "狀態", cell: (r) => STATUS_LABEL[r.status], sortValue: (r) => STATUS_LABEL[r.status] },
];

function PageHeader() {
  return (
    <div className="space-y-2">
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <ArrowLeft /> 返回清單
      </Button>
      {/* 頁首＝識別（名稱＋代號）＋狀態＋這個狀態允許的動作 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{demoProfile.name}</h1>
          <Badge variant="outline">{demoProfile.code}</Badge>
          <Badge variant="success">啟用中</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">匯出</Button>
          <Dialog>
            <DialogTrigger asChild><Button variant="destructive" size="sm">停用</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>確定要停用 {demoProfile.code}？</DialogTitle>
                <DialogDescription>
                  停用後此單位不能再建立新項目，既有項目不受影響。此動作會寫入異動紀錄。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">返回</Button></DialogClose>
                <Button variant="destructive">確定停用</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export const 典型組成: Story = {
  render: function Render() {
    const [tab, setTab] = useState("basic");
    const related = demoRecords.filter((r) => r.unit === "甲單位");
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <PageHeader />

        {/* 分頁籤切區：實務上目前分頁要寫進網址，分享連結才落在同一個分頁 */}
        <TabPills
          label="明細分區"
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "basic", label: "基本資料" },
            { key: "related", label: "關聯項目", badge: <Badge variant="secondary">{related.length}</Badge> },
            { key: "history", label: "異動紀錄" },
          ]}
        />

        {tab === "basic" && (
          <Card>
            <CardHeader><CardTitle className="text-base">基本資料</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {/* 唯讀優先：平常是乾淨的唯讀版面，點值才進入編輯 */}
              <EditableField label="單位名稱" kind="text" value={demoProfile.name} original={demoProfile.name} onChange={() => {}} />
              <EditableField label="單位代號" kind="text" value={demoProfile.code} original={demoProfile.code} onChange={() => {}} disabled lockHint="代號建立後不可變更" />
              <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={demoProfile.tier} original={demoProfile.tier} onChange={() => {}} />
              <EditableField label="上限額度" kind="money" value={demoProfile.quota} original={demoProfile.quota} onChange={() => {}} />
            </CardContent>
          </Card>
        )}

        {tab === "related" && (
          <DataTable rows={related} columns={relatedColumns} getRowKey={(r) => r.id} dense searchable={false} onRowClick={() => {}} />
        )}

        {tab === "history" && (
          <Card>
            <CardContent className="space-y-2 pt-6 text-sm">
              <p><span className="text-muted-foreground">2024-02-05・第一組</span>　調整上限額度：$1,500,000 → $1,650,000</p>
              <p><span className="text-muted-foreground">2024-01-26・第二組</span>　等級：銀級 → 金級</p>
              <p><span className="text-muted-foreground">2019-04-01・系統</span>　建立此單位</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

export const 編輯與變更摘要: Story = {
  render: function Render() {
    const [draft, setDraft] = useState<DemoProfile>(demoProfile);
    const { changes, revertField, revertAll } = useRecordDiff(demoProfile, draft, setDraft, SPECS);
    const set = (k: keyof DemoProfile) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <PageHeader />
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader><CardTitle className="text-base">基本資料</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <EditableField label="單位名稱" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
              <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
              <EditableField label="上限額度" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
              <EditableField label="聯絡方式" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} />
            </CardContent>
          </Card>
          {/* 動作區：送出前先看得到改了什麼；沒有變更就不能送 */}
          <div className="space-y-2">
            <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
            <Button className="w-full" disabled={changes.length === 0}>
              送出 {changes.length > 0 && `（${changes.length} 項變更）`}
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
