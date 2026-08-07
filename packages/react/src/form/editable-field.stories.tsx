import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EditableField, type EditableFieldValue } from "./editable-field";
import { ChangeSummary } from "./change-summary";
import { useRecordDiff } from "./use-record-diff";
import type { FieldKind, FieldSpec } from "../lib/forms/diff";
import { Button } from "../ui/button";
import { demoProfile, TIER_OPTIONS, CHANNEL_OPTIONS, type DemoProfile } from "../demo/sample-data";
import { makeOptions } from "../demo/generate";

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

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 改 args 時 value state 必須 remount 重置——否則多選的 value 會停在
// 已不存在的選項上，所以用「內部 Demo 元件＋key」的寫法。
const KIND_BY_LABEL = {
  文字: "text", 數值: "number", 金額: "money", 比率: "rate", 日期: "date",
  下拉: "select", 單選: "radio", 多選: "multiselect", 是否: "checkbox",
} as const satisfies Record<string, FieldKind>;

function originalOf(kind: FieldKind, opts: { value: string; label: string }[]): EditableFieldValue {
  switch (kind) {
    case "number": return 250;
    case "money": return demoProfile.quota;
    case "rate": return demoProfile.adjustRate;
    case "date": return demoProfile.since;
    case "select": case "radio": return opts[0]?.value ?? null;
    case "multiselect": return opts.slice(0, 2).map((o) => o.value);
    case "checkbox": return true;
    default: return "甲案 第一階段";
  }
}

type 互動Args = {
  欄位型別: keyof typeof KIND_BY_LABEL;
  選項數: number;
  鎖定: boolean;
  鎖定原因: string;
  恆為輸入態: boolean;
  追蹤變更: boolean;
  說明文字: string;
};

export const 互動: StoryObj<互動Args> = {
  args: {
    欄位型別: "金額",
    選項數: 4,
    鎖定: false,
    鎖定原因: "此筆已結案，需先解除鎖定",
    恆為輸入態: false,
    追蹤變更: true,
    說明文字: "",
  },
  argTypes: {
    欄位型別: { control: "select", options: Object.keys(KIND_BY_LABEL) },
    // Storybook 的 if 條件只有 eq/neq/exists/truthy，表達不了「三選一才顯示」，
    // 所以恆顯示、用描述講清楚適用範圍
    選項數: { control: { type: "range", min: 0, max: 24, step: 1 }, description: "只影響 下拉／單選／多選" },
    鎖定: { control: "boolean" },
    鎖定原因: { control: "text", if: { arg: "鎖定" } },
    恆為輸入態: { control: "boolean" },
    追蹤變更: { control: "boolean" },
    說明文字: { control: "text" },
  },
  render: (a) => {
    const kind = KIND_BY_LABEL[a.欄位型別];
    const opts = makeOptions(a.選項數);
    const original = originalOf(kind, opts);
    const Demo = () => {
      const [v, setV] = useState<EditableFieldValue>(original);
      return (
        <EditableField
          label="示範欄位"
          kind={kind}
          value={v}
          original={original}
          onChange={setV}
          onRevert={() => setV(original)}
          options={opts}
          disabled={a.鎖定}
          lockHint={a.鎖定 ? a.鎖定原因 : undefined}
          alwaysEdit={a.恆為輸入態}
          trackChanges={a.追蹤變更}
          help={a.說明文字 || undefined}
        />
      );
    };
    return (
      <div className="max-w-sm">
        <Demo key={`${kind}-${a.選項數}-${a.恆為輸入態}`} />
      </div>
    );
  },
};
