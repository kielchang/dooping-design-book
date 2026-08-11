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
const meta: Meta = { title: "Pages/Detail Page", id: "頁面/明細頁" };
export default meta;
type Story = StoryObj;

const SPECS: FieldSpec[] = [
  { key: "name", label: "Unit name", kind: "text" },
  { key: "tier", label: "Tier", kind: "select", format: (v) => TIER_OPTIONS.find((o) => o.value === v)?.label ?? String(v) },
  { key: "quota", label: "Quota", kind: "money" },
  { key: "contact", label: "Contact", kind: "text" },
];

const relatedColumns: Column<DemoRecord>[] = [
  { key: "id", header: "ID", cell: (r) => r.id, sortValue: (r) => r.id },
  { key: "name", header: "Item", truncate: 160, cell: (r) => r.name, sortValue: (r) => r.name },
  { key: "amount", header: "Amount", numeric: true, cell: (r) => formatMoney(r.amount), sortValue: (r) => r.amount },
  { key: "status", header: "Status", cell: (r) => STATUS_LABEL[r.status], sortValue: (r) => STATUS_LABEL[r.status] },
];

function PageHeader() {
  return (
    <div className="space-y-2">
      <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <ArrowLeft /> Back to list
      </Button>
      {/* 頁首＝識別（名稱＋代號）＋狀態＋這個狀態允許的動作 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{demoProfile.name}</h1>
          <Badge variant="outline">{demoProfile.code}</Badge>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Dialog>
            <DialogTrigger asChild><Button variant="destructive" size="sm">Deactivate</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deactivate {demoProfile.code}?</DialogTitle>
                <DialogDescription>
                  This unit will no longer accept new items. Existing items are unaffected. The action will be recorded.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button variant="destructive">Confirm deactivation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export const 典型組成: Story = {
  name: "Typical composition",
  render: function Render() {
    const [tab, setTab] = useState("basic");
    const related = demoRecords.filter((r) => r.unit === "Unit A");
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <PageHeader />

        {/* 分頁籤切區：實務上目前分頁要寫進網址，分享連結才落在同一個分頁 */}
        <TabPills
          label="Detail sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "basic", label: "Basic information" },
            { key: "related", label: "Related items", badge: <Badge variant="secondary">{related.length}</Badge> },
            { key: "history", label: "Change history" },
          ]}
        />

        {tab === "basic" && (
          <Card>
            <CardHeader><CardTitle className="text-base">Basic information</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {/* 唯讀優先：平常是乾淨的唯讀版面，點值才進入編輯 */}
              <EditableField label="Unit name" kind="text" value={demoProfile.name} original={demoProfile.name} onChange={() => {}} />
              <EditableField label="Unit code" kind="text" value={demoProfile.code} original={demoProfile.code} onChange={() => {}} disabled lockHint="The code cannot be changed after creation" />
              <EditableField label="Tier" kind="select" options={TIER_OPTIONS} value={demoProfile.tier} original={demoProfile.tier} onChange={() => {}} />
              <EditableField label="Quota" kind="money" value={demoProfile.quota} original={demoProfile.quota} onChange={() => {}} />
            </CardContent>
          </Card>
        )}

        {tab === "related" && (
          <DataTable rows={related} columns={relatedColumns} getRowKey={(r) => r.id} dense searchable={false} onRowClick={() => {}} />
        )}

        {tab === "history" && (
          <Card>
            <CardContent className="space-y-2 pt-6 text-sm">
              <p><span className="text-muted-foreground">2024-02-05 · Team One</span> Updated quota: $1,500,000 → $1,650,000</p>
              <p><span className="text-muted-foreground">2024-01-26 · Team Two</span> Tier: Silver → Gold</p>
              <p><span className="text-muted-foreground">2019-04-01 · System</span> Created this unit</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

export const 編輯與變更摘要: Story = {
  name: "Inline editing and change summary",
  render: function Render() {
    const [draft, setDraft] = useState<DemoProfile>(demoProfile);
    const { changes, revertField, revertAll } = useRecordDiff(demoProfile, draft, setDraft, SPECS);
    const set = (k: keyof DemoProfile) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <PageHeader />
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader><CardTitle className="text-base">Basic information</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <EditableField label="Unit name" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
              <EditableField label="Tier" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
              <EditableField label="Quota" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
              <EditableField label="Contact" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} />
            </CardContent>
          </Card>
          {/* 動作區：送出前先看得到改了什麼；沒有變更就不能送 */}
          <div className="space-y-2">
            <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
            <Button className="w-full" disabled={changes.length === 0}>
              Submit {changes.length > 0 && `(${changes.length} change${changes.length === 1 ? "" : "s"})`}
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
