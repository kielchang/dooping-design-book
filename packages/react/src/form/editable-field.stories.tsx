import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EditableField, type EditableFieldValue } from "./editable-field";
import { ChangeSummary } from "./change-summary";
import { useRecordDiff } from "./use-record-diff";
import type { FieldKind, FieldSpec } from "../lib/forms/diff";
import { Button } from "../ui/button";
import { demoProfile, TIER_OPTIONS, CHANNEL_OPTIONS, type DemoProfile } from "../demo/sample-data";
import { makeOptions } from "../demo/generate";

const meta: Meta = { title: "Components/Forms/Read-only inline editing", id: "元件/表單/唯讀逐欄編輯" };
export default meta;
type Story = StoryObj;

const SPECS: FieldSpec[] = [
  { key: "name", label: "Unit name", kind: "text" },
  { key: "code", label: "Unit code", kind: "text" },
  { key: "tier", label: "Tier", kind: "select", format: (v) => TIER_OPTIONS.find((o) => o.value === v)?.label ?? String(v) },
  { key: "quota", label: "Quota", kind: "money" },
  { key: "adjustRate", label: "Adjustment rate", kind: "rate" },
  { key: "channels", label: "Contact channels", kind: "multiselect" },
  { key: "active", label: "Active", kind: "checkbox" },
  { key: "contact", label: "Contact", kind: "text" },
  { key: "since", label: "Created", kind: "date" },
];

export const 單一欄位: Story = {
  name: "Single field",
  render: function Render() {
    const [v, setV] = useState<string | number | boolean | string[] | null | undefined>(1_500_000);
    return (
      <div className="max-w-sm space-y-6">
        <EditableField
          label="Quota"
          kind="money"
          value={v}
          original={1_500_000}
          onChange={setV}
          onRevert={() => setV(1_500_000)}
          help="Click the value to edit; changed fields use the edit color and show a revert button."
        />
        <EditableField label="Unit code (locked)" kind="text" value="U-1042" original="U-1042" onChange={() => {}} disabled lockHint="The code cannot be changed after creation" />
      </div>
    );
  },
};

export const 完整表單與變更摘要: Story = {
  name: "Full form and change summary",
  render: function Render() {
    const [draft, setDraft] = useState<DemoProfile>(demoProfile);
    const { changes, revertField, revertAll } = useRecordDiff(demoProfile, draft, setDraft, SPECS);
    const set = (k: keyof DemoProfile) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <EditableField label="Unit name" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
          <EditableField label="Unit code" kind="text" value={draft.code} original={demoProfile.code} onChange={set("code")} onRevert={() => revertField("code")} />
          <EditableField label="Tier" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
          <EditableField label="Quota" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
          <EditableField label="Adjustment rate" kind="rate" value={draft.adjustRate} original={demoProfile.adjustRate} onChange={set("adjustRate")} onRevert={() => revertField("adjustRate")} help="Displayed as %, stored as a ratio." />
          <EditableField label="Active" kind="checkbox" value={draft.active} original={demoProfile.active} onChange={set("active")} onRevert={() => revertField("active")} />
          <EditableField label="Contact channels" kind="multiselect" options={CHANNEL_OPTIONS} value={draft.channels} original={demoProfile.channels} onChange={set("channels")} onRevert={() => revertField("channels")} className="sm:col-span-2" />
          <EditableField label="Contact" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} className="sm:col-span-2" />
        </div>
        <div className="space-y-2">
          <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
          <Button className="w-full" disabled={changes.length === 0}>Submit {changes.length > 0 && `(${changes.length} change${changes.length === 1 ? "" : "s"})`}</Button>
          <p className="text-tiny text-muted-foreground">
            The Change[] structure and the before/after values written to the audit record are the same data—
            what users see before submission is what the audit trail will show later.
          </p>
        </div>
      </div>
    );
  },
};

export const 新增模式: Story = {
  name: "Create mode",
  render: function Render() {
    const [draft, setDraft] = useState({ name: "", code: "", tier: "bronze" });
    const set = (k: string) => (v: unknown) => setDraft((d) => ({ ...d, [k]: v }));
    return (
      <div className="max-w-sm space-y-3">
        <p className="text-xs text-muted-foreground">
          In create mode, use `alwaysEdit` and disable `trackChanges`: fields remain editable without marking the whole form as changed.
        </p>
        <EditableField label="Unit name" kind="text" value={draft.name} onChange={set("name")} alwaysEdit trackChanges={false} placeholder="Enter unit name" />
        <EditableField label="Unit code" kind="text" value={draft.code} onChange={set("code")} alwaysEdit trackChanges={false} placeholder="Example: U-1042" />
        <EditableField label="Tier" kind="radio" options={TIER_OPTIONS} value={draft.tier} onChange={set("tier")} alwaysEdit trackChanges={false} />
      </div>
    );
  },
};

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 改 args 時 value state 必須 remount 重置——否則多選的 value 會停在
// 已不存在的選項上，所以用「內部 Demo 元件＋key」的寫法。
const KIND_BY_LABEL = {
  Text: "text", Number: "number", Money: "money", Rate: "rate", Date: "date",
  Select: "select", Radio: "radio", Multiselect: "multiselect", Checkbox: "checkbox",
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
    default: return "Plan A — Phase 1";
  }
}

type InteractiveArgs = {
  fieldType: keyof typeof KIND_BY_LABEL;
  optionCount: number;
  locked: boolean;
  lockReason: string;
  alwaysEdit: boolean;
  trackChanges: boolean;
  helpText: string;
};

export const 互動: StoryObj<InteractiveArgs> = {
  name: "Interactive playground",
  args: {
    fieldType: "Money",
    optionCount: 4,
    locked: false,
    lockReason: "This record is closed; unlock it first",
    alwaysEdit: false,
    trackChanges: true,
    helpText: "",
  },
  argTypes: {
    fieldType: { control: "select", options: Object.keys(KIND_BY_LABEL) },
    // Storybook 的 if 條件只有 eq/neq/exists/truthy，表達不了「三選一才顯示」，
    // 所以恆顯示、用描述講清楚適用範圍
    optionCount: { control: { type: "range", min: 0, max: 24, step: 1 }, description: "Affects select, radio, and multiselect" },
    locked: { control: "boolean" },
    lockReason: { control: "text", if: { arg: "locked" } },
    alwaysEdit: { control: "boolean" },
    trackChanges: { control: "boolean" },
    helpText: { control: "text" },
  },
  render: (a) => {
    const kind = KIND_BY_LABEL[a.fieldType];
    const opts = makeOptions(a.optionCount);
    const original = originalOf(kind, opts);
    const Demo = () => {
      const [v, setV] = useState<EditableFieldValue>(original);
      return (
        <EditableField
          label="Demo field"
          kind={kind}
          value={v}
          original={original}
          onChange={setV}
          onRevert={() => setV(original)}
          options={opts}
          disabled={a.locked}
          lockHint={a.locked ? a.lockReason : undefined}
          alwaysEdit={a.alwaysEdit}
          trackChanges={a.trackChanges}
          help={a.helpText || undefined}
        />
      );
    };
    return (
      <div className="max-w-sm">
        <Demo key={`${kind}-${a.optionCount}-${a.alwaysEdit}`} />
      </div>
    );
  },
};
