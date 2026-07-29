import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EditableField } from "./editable-field";
import { ChangeSummary } from "./change-summary";
import { useRecordDiff } from "./use-record-diff";
import type { FieldSpec } from "../lib/forms/diff";
import { Button } from "../ui/button";
import { demoProfile, TIER_OPTIONS, CHANNEL_OPTIONS, type DemoProfile } from "../demo/sample-data";

const meta: Meta = { title: "元件/表單/唯讀逐欄編輯" };
export default meta;
type Story = StoryObj;

const SPECS: FieldSpec[] = [
  { key: "name", label: "單位名稱", kind: "text" },
  { key: "code", label: "單位代號", kind: "text" },
  { key: "tier", label: "等級", kind: "select", format: (v) => TIER_OPTIONS.find((o) => o.value === v)?.label ?? String(v) },
  { key: "quota", label: "上限額度", kind: "money" },
  { key: "adjustRate", label: "調整率", kind: "rate" },
  { key: "channels", label: "聯絡管道", kind: "multiselect" },
  { key: "active", label: "啟用中", kind: "checkbox" },
  { key: "contact", label: "聯絡方式", kind: "text" },
  { key: "since", label: "建立日期", kind: "date" },
];

export const 單一欄位: Story = {
  render: function Render() {
    const [v, setV] = useState<string | number | boolean | string[] | null | undefined>(1_500_000);
    return (
      <div className="max-w-sm space-y-6">
        <EditableField
          label="上限額度"
          kind="money"
          value={v}
          original={1_500_000}
          onChange={setV}
          onRevert={() => setV(1_500_000)}
          help="點一下值就能編輯；改過的欄位會標成琥珀色，並出現還原鈕。"
        />
        <EditableField label="單位代號（鎖定）" kind="text" value="U-1042" original="U-1042" onChange={() => {}} disabled lockHint="代號建立後不可變更" />
      </div>
    );
  },
};

export const 完整表單與變更摘要: Story = {
  render: function Render() {
    const [draft, setDraft] = useState<DemoProfile>(demoProfile);
    const { changes, revertField, revertAll } = useRecordDiff(demoProfile, draft, setDraft, SPECS);
    const set = (k: keyof DemoProfile) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <EditableField label="單位名稱" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
          <EditableField label="單位代號" kind="text" value={draft.code} original={demoProfile.code} onChange={set("code")} onRevert={() => revertField("code")} />
          <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
          <EditableField label="上限額度" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
          <EditableField label="調整率" kind="rate" value={draft.adjustRate} original={demoProfile.adjustRate} onChange={set("adjustRate")} onRevert={() => revertField("adjustRate")} help="畫面顯示 %，存的是比值。" />
          <EditableField label="啟用中" kind="checkbox" value={draft.active} original={demoProfile.active} onChange={set("active")} onRevert={() => revertField("active")} />
          <EditableField label="聯絡管道" kind="multiselect" options={CHANNEL_OPTIONS} value={draft.channels} original={demoProfile.channels} onChange={set("channels")} onRevert={() => revertField("channels")} className="sm:col-span-2" />
          <EditableField label="聯絡方式" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} className="sm:col-span-2" />
        </div>
        <div className="space-y-2">
          <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
          <Button className="w-full" disabled={changes.length === 0}>送出 {changes.length > 0 && `（${changes.length} 項變更）`}</Button>
          <p className="text-tiny text-muted-foreground">
            摘要的資料結構（Change[]）與寫入異動紀錄的 before/after 是同一份——
            使用者送出前看到的，就是稽核紀錄之後會呈現的。
          </p>
        </div>
      </div>
    );
  },
};

export const 新增模式: Story = {
  render: function Render() {
    const [draft, setDraft] = useState({ name: "", code: "", tier: "bronze" });
    const set = (k: string) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="max-w-sm space-y-3">
        <p className="text-xs text-muted-foreground">
          新增時 `alwaysEdit` ＋關閉 `trackChanges`：欄位恆為輸入態，也不會整張表單都被標成「已變更」。
        </p>
        <EditableField label="單位名稱" kind="text" value={draft.name} onChange={set("name")} alwaysEdit trackChanges={false} placeholder="輸入單位名稱" />
        <EditableField label="單位代號" kind="text" value={draft.code} onChange={set("code")} alwaysEdit trackChanges={false} placeholder="例：U-1042" />
        <EditableField label="等級" kind="radio" options={TIER_OPTIONS} value={draft.tier} onChange={set("tier")} alwaysEdit trackChanges={false} />
      </div>
    );
  },
};
