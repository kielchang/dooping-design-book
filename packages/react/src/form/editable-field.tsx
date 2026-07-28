import { useEffect, useRef, useState, type ReactNode } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TruncatedText } from "../ui/tooltip";
import { SegGroup, type SegOption } from "../ui/seg-group";
import { Chips } from "../ui/chips";
import { cn } from "../lib/utils";
import { eqValue, fmtValue, type FieldKind } from "../lib/forms/diff";
import { Undo2, Redo2, Lock, ArrowRight, Pencil } from "lucide-react";

export type EditableFieldOption = SegOption;
export type EditableFieldValue = string | number | boolean | string[] | null | undefined;

export interface EditableFieldLabels {
  changed: string;
  undo: string;
  undoTitle: string;
  redo: string;
  redoTitle: string;
  confirmUndo: string;
  confirmRedo: string;
  cancel: string;
  confirm: string;
  done: string;
  yes: string;
  no: string;
  locked: string;
  editHint: (label: string, display: string) => string;
  more: (n: number) => string;
}

export const DEFAULT_EDITABLE_FIELD_LABELS: EditableFieldLabels = {
  changed: "已變更",
  undo: "還原",
  undoTitle: "還原為原始值（會先確認）",
  redo: "重做",
  redoTitle: "重做（回到修改後的值，會先確認）",
  confirmUndo: "還原？",
  confirmRedo: "重做？",
  cancel: "取消",
  confirm: "確定",
  done: "完成",
  yes: "是",
  no: "否",
  locked: "已鎖定",
  editHint: (label, display) => `${label}，目前 ${display}，按 Enter 編輯`,
  more: (n) => `其他 ${n} 項`,
};

export interface EditableFieldProps {
  label: string;
  value: EditableFieldValue;
  /** 原始值；用於「已變更」標色與還原。新增模式請留空並關掉 trackChanges */
  original?: EditableFieldValue;
  kind: FieldKind;
  onChange: (v: string | number | boolean | string[]) => void;
  onRevert?: () => void;
  options?: EditableFieldOption[];
  /** 顯示格式覆寫（如 select 值→標籤） */
  format?: (v: unknown) => string;
  placeholder?: string;
  /** 鎖定（例如已確認、已結案的資料）：不可編輯，顯示鎖頭與原因 */
  disabled?: boolean;
  lockHint?: string;
  help?: string;
  /** 是否追蹤變更（新增模式關閉，否則整張表單都會被標成「已變更」） */
  trackChanges?: boolean;
  /** 恆為輸入態（新增表單用）：跳過唯讀按鈕，直接可編輯 */
  alwaysEdit?: boolean;
  unit?: string;
  min?: number;
  step?: number;
  className?: string;
  labels?: Partial<EditableFieldLabels>;
}

/**
 * 唯讀逐欄編輯欄位。
 *
 * 預設是**唯讀**：長得像值、不像輸入框，點一下才變成真正的輸入。
 * 這個順序是刻意反過來的——後台系統的主檔表單，使用者 90% 的時間是在「看」，
 * 只有 10% 在「改」。一整片輸入框會讓人分不清「哪些是我改過的」，也很容易誤觸改壞資料。
 *
 * 值 ≠ 原值時整欄標琥珀色並出現還原鈕。undo/redo **都會先確認**（顯示 舊值 → 新值），
 * 因為「還原」本身也是一次資料變更，一鍵無聲還原跟一鍵無聲改壞一樣危險。
 */
export function EditableField({
  label, value, original, kind, onChange, onRevert, options, format,
  placeholder, disabled, lockHint, help, trackChanges = true, alwaysEdit, unit, min, step, className, labels,
}: EditableFieldProps) {
  const L = { ...DEFAULT_EDITABLE_FIELD_LABELS, ...labels };
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [redoValue, setRedoValue] = useState<EditableFieldValue | undefined>(undefined);
  const [confirm, setConfirm] = useState<null | { action: "undo" | "redo"; fromText: string; toText: string; apply: () => void }>(null);
  const changed = trackChanges && !alwaysEdit && !eqValue(value, original);
  const canRedo = !alwaysEdit && !changed && redoValue !== undefined && !eqValue(redoValue, original);
  const showInput = alwaysEdit || editing;

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  // 手動改值（非 undo/redo）→ 使 redo 失效
  useEffect(() => {
    if (redoValue !== undefined && !eqValue(value, original) && !eqValue(value, redoValue)) setRedoValue(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const exit = () => { if (!alwaysEdit) setEditing(false); };
  const ft = (v: EditableFieldValue) => fmtValue(v, kind, format, unit);
  const askUndo = () => setConfirm({
    action: "undo", fromText: ft(value), toText: ft(original),
    apply: () => { setRedoValue(value); onRevert?.(); setEditing(false); },
  });
  const askRedo = () => setConfirm({
    action: "redo", fromText: ft(value), toText: ft(redoValue),
    apply: () => { if (redoValue !== undefined) onChange(redoValue as string | number | boolean | string[]); },
  });

  const shell = (control: ReactNode) => (
    <FieldShell
      label={label} help={help} className={className} changed={changed} labels={L}
      onUndo={!confirm && changed && onRevert ? askUndo : undefined}
      onRedo={!confirm && canRedo ? askRedo : undefined}
    >
      {confirm ? (
        <ConfirmBar
          labels={L}
          action={confirm.action} fromText={confirm.fromText} toText={confirm.toText}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { confirm.apply(); setConfirm(null); }}
        />
      ) : control}
    </FieldShell>
  );

  const optLabel = (v: string) => options?.find((o) => o.value === v)?.label ?? v;
  let display: string;
  if (kind === "select" || kind === "radio") {
    display = value == null || value === "" ? "—" : format ? format(value) : optLabel(String(value));
  } else if (kind === "multiselect") {
    const s = Array.isArray(value) ? value.map(String) : [];
    display = s.length ? s.map(optLabel).join("、") : "—";
  } else if (kind === "checkbox") {
    display = value ? L.yes : L.no;
  } else {
    display = fmtValue(value, kind, format, unit);
  }
  const isEmpty = display === "—";
  const numeric = kind === "money" || kind === "number" || kind === "rate";
  const negMoney = kind === "money" && Number(value) < 0;

  const valueEl = (
    <TruncatedText text={display} numeric={numeric} className={cn(isEmpty && "text-muted-foreground", negMoney && "font-medium text-danger")} />
  );
  const collapsed = (
    <button type="button" onClick={() => setEditing(true)} aria-label={L.editHint(label, display)} className={cn(fieldBtnCls(changed, false), "group")}>
      {valueEl}
      {!changed && <EditPencil />}
    </button>
  );

  // 鎖定：不論型態一律顯示唯讀值＋鎖頭，且**可聚焦**——螢幕報讀者要唸得到「為什麼不能改」
  if (disabled) {
    return shell(
      <div
        role="group"
        tabIndex={0}
        aria-disabled
        aria-label={`${label}，${display}${lockHint ? `（${L.locked}：${lockHint}）` : `（${L.locked}）`}`}
        title={lockHint}
        className={fieldBtnCls(false, true)}
      >
        {valueEl}
        <Lock aria-hidden className="ml-1 size-3.5 shrink-0 opacity-60" />
      </div>,
    );
  }

  if (kind === "checkbox") {
    if (!showInput) return shell(collapsed);
    return shell(
      <SegGroup
        label={label}
        options={[{ value: "true", label: L.yes }, { value: "false", label: L.no }]}
        value={value ? "true" : "false"}
        onPick={(v) => { onChange(v === "true"); exit(); }}
        autoFocus={editing && !alwaysEdit}
        onEscape={exit}
        changed={changed}
      />,
    );
  }

  if (kind === "radio") {
    if (!showInput) return shell(collapsed);
    return shell(
      <SegGroup
        label={label}
        options={options ?? []}
        value={value == null ? "" : String(value)}
        onPick={(v) => { onChange(v); exit(); }}
        autoFocus={editing && !alwaysEdit}
        onEscape={exit}
        changed={changed}
      />,
    );
  }

  if (kind === "multiselect") {
    const sel = Array.isArray(value) ? value.map(String) : [];
    if (!showInput) {
      const preview = sel.slice(0, 2);
      const rest = sel.length - preview.length;
      return shell(
        <button type="button" onClick={() => setEditing(true)} aria-label={L.editHint(label, display)} className={cn(fieldBtnCls(changed, false), "group gap-1")}>
          {sel.length === 0 && <span className="text-muted-foreground">—</span>}
          {preview.map((v) => (
            <Tooltip key={v} content={optLabel(v)}>
              <span className="block max-w-[88px] truncate rounded-full border border-input bg-muted px-2 py-0.5 text-xs">{optLabel(v)}</span>
            </Tooltip>
          ))}
          {rest > 0 && <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{L.more(rest)}</span>}
          {!changed && <EditPencil />}
        </button>,
      );
    }
    return shell(
      <div className="space-y-1.5">
        <Chips
          label={label}
          options={options ?? []}
          selected={sel}
          onToggle={(v) => onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v])}
          autoFocus={editing && !alwaysEdit}
          onEscape={exit}
          changed={changed}
        />
        {!alwaysEdit && (
          <button type="button" onClick={exit} className="tap-target-y rounded border border-input bg-background px-2.5 py-0.5 text-xs hover:bg-accent">{L.done}</button>
        )}
      </div>,
    );
  }

  if (kind === "select") {
    if (!showInput) return shell(collapsed);
    return shell(
      <Select
        open={alwaysEdit ? undefined : true}
        value={value == null || value === "" ? undefined : String(value)}
        onValueChange={(v) => { onChange(v); exit(); }}
        onOpenChange={(o) => { if (!o) exit(); }}
      >
        <SelectTrigger className="h-9"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>,
    );
  }

  // text / number / money / rate / date
  if (showInput) {
    const type = kind === "date" ? "date" : numeric ? "number" : "text";
    // 比率欄位對使用者說的是「%」，存的是比值——輸入時 ×100、送出時 ÷100，別讓使用者去換算
    const editVal = kind === "rate" && value != null && value !== "" ? Number(value) * 100 : (value ?? "");
    const commit = (raw: string) => {
      if (kind === "number" || kind === "money") onChange(raw === "" ? 0 : Number(raw));
      else if (kind === "rate") onChange(raw === "" ? 0 : Number(raw) / 100);
      else onChange(raw);
    };
    return shell(
      <Input
        ref={alwaysEdit ? undefined : inputRef}
        type={type}
        min={min}
        step={step ?? (kind === "rate" ? 0.5 : undefined)}
        className={cn("h-9", numeric && "text-right tabular-nums")}
        value={editVal as string | number}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => commit(e.target.value)}
        onBlur={exit}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); exit(); } }}
      />,
    );
  }
  return shell(collapsed);
}

function fieldBtnCls(changed: boolean, locked: boolean) {
  return cn(
    "flex h-9 w-full items-center gap-2 rounded-md border px-3 text-left text-sm transition-colors duration-fast",
    locked ? "cursor-not-allowed border-input bg-muted/50 text-muted-foreground" : "border-input bg-background hover:bg-accent",
    changed && "border-edit bg-edit-bg text-edit-foreground hover:bg-edit-bg",
  );
}

/** 欄位外殼：標籤 ＋ 控制項（右側預留 undo/redo）＋ 說明。 */
function FieldShell({
  label, help, changed, onUndo, onRedo, children, className, labels,
}: {
  label: string; help?: string; changed: boolean;
  onUndo?: () => void; onRedo?: () => void; children: ReactNode; className?: string; labels: EditableFieldLabels;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-1.5">
        <Label className="text-xs">{label}</Label>
        {changed && <span className="rounded bg-edit-bg px-1 text-micro font-medium text-edit-foreground">{labels.changed}</span>}
      </div>
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">{children}</div>
        {onUndo && (
          <button type="button" onClick={onUndo} title={labels.undoTitle} aria-label={labels.undo} className="tap-target flex shrink-0 items-center justify-center rounded-md p-1.5 text-warning hover:bg-edit-bg">
            <Undo2 className="size-4" aria-hidden />
          </button>
        )}
        {onRedo && (
          <button type="button" onClick={onRedo} title={labels.redoTitle} aria-label={labels.redo} className="tap-target flex shrink-0 items-center justify-center rounded-md p-1.5 text-info hover:bg-info/10">
            <Redo2 className="size-4" aria-hidden />
          </button>
        )}
      </div>
      {help && <p className="text-tiny leading-snug text-muted-foreground">{help}</p>}
    </div>
  );
}

/** undo/redo 前的行內確認：顯示 舊值 → 新值，確認才執行。 */
function ConfirmBar({
  action, fromText, toText, onCancel, onConfirm, labels,
}: {
  action: "undo" | "redo"; fromText: string; toText: string; onCancel: () => void; onConfirm: () => void; labels: EditableFieldLabels;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-edit bg-edit-bg px-2 py-1.5 text-xs">
      <span className="font-medium text-edit-foreground">{action === "undo" ? labels.confirmUndo : labels.confirmRedo}</span>
      <span className="text-muted-foreground line-through">{fromText}</span>
      <ArrowRight className="size-3 shrink-0 text-warning" aria-hidden />
      <span className="font-medium text-edit-foreground">{toText}</span>
      <span className="ml-auto flex gap-1">
        <button type="button" onClick={onCancel} className="rounded border border-input bg-background px-2 py-0.5 hover:bg-accent">{labels.cancel}</button>
        <button type="button" onClick={onConfirm} className="rounded bg-primary px-2 py-0.5 text-primary-foreground">{labels.confirm}</button>
      </span>
    </div>
  );
}

/** 唯讀欄位右側的低調鉛筆：可發現性。桌機 hover 加深、觸控裝置恆微顯（沒有 hover 可用）。 */
function EditPencil() {
  return (
    <Pencil
      aria-hidden
      className="ml-auto size-3.5 shrink-0 text-muted-foreground/30 transition-colors duration-fast group-hover:text-muted-foreground [@media(pointer:coarse)]:text-muted-foreground/50"
    />
  );
}
