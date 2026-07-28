import { useState } from "react";
import { Undo2, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip } from "../ui/tooltip";
import type { Change } from "../lib/forms/diff";

type Pending = { field: string; from: string; to: string } | { all: true };

export interface ChangeSummaryLabels {
  empty: string;
  title: (n: number) => string;
  revertAll: string;
  revertField: (label: string) => string;
  revertFieldTitle: string;
  confirmRevert: string;
  cancel: string;
  confirm: string;
  allChanges: (n: number) => string;
  allOriginal: string;
}

export const DEFAULT_CHANGE_SUMMARY_LABELS: ChangeSummaryLabels = {
  empty: "尚無變更",
  title: (n) => `本次變更（${n}）`,
  revertAll: "全部還原",
  revertField: (l) => `還原 ${l}`,
  revertFieldTitle: "還原此欄",
  confirmRevert: "還原？",
  cancel: "取消",
  confirm: "確定",
  allChanges: (n) => `${n} 項變更`,
  allOriginal: "全部原始值",
};

function RevertConfirm({
  from, to, onCancel, onConfirm, labels,
}: { from: string; to: string; onCancel: () => void; onConfirm: () => void; labels: ChangeSummaryLabels }) {
  return (
    <span className="flex flex-1 flex-wrap items-center gap-1.5 rounded border border-edit bg-edit-bg px-2 py-1">
      <span className="font-medium text-edit-foreground">{labels.confirmRevert}</span>
      <span className="text-muted-foreground line-through">{from}</span>
      <ArrowRight className="size-3 shrink-0 text-warning" aria-hidden />
      <span className="font-medium text-edit-foreground">{to}</span>
      <span className="ml-auto flex gap-1">
        <button type="button" onClick={onCancel} className="tap-target-y rounded border border-input bg-background px-2 py-0.5 hover:bg-accent">{labels.cancel}</button>
        <button type="button" onClick={onConfirm} className="tap-target-y rounded bg-primary px-2 py-0.5 text-primary-foreground">{labels.confirm}</button>
      </span>
    </span>
  );
}

export interface ChangeSummaryProps {
  changes: Change[];
  onRevertField?: (field: string) => void;
  onRevertAll?: () => void;
  className?: string;
  labels?: Partial<ChangeSummaryLabels>;
}

/**
 * 送出前的變更摘要：逐列「舊值 → 新值」，可逐欄或整批還原（都會先確認）。
 *
 * 為什麼值得為它做一個元件：使用者在一張 30 欄的主檔表單上改了 3 個欄位，
 * 送出前唯一想知道的就是「我到底改了哪 3 個」。沒有這塊，他只能靠記憶或整頁重掃。
 * 而這份清單的資料結構（`Change[]`）跟寫進稽核記錄的 before/after **完全同一份**——
 * 使用者送出前看到的，就是稽核記錄之後會呈現的。
 */
export function ChangeSummary({ changes, onRevertField, onRevertAll, className, labels }: ChangeSummaryProps) {
  const L = { ...DEFAULT_CHANGE_SUMMARY_LABELS, ...labels };
  const [pending, setPending] = useState<Pending | null>(null);

  if (changes.length === 0) {
    return (
      <div className={cn("rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground", className)}>
        {L.empty}
      </div>
    );
  }
  const allPending = pending != null && "all" in pending;
  return (
    <div className={cn("rounded-md border border-edit bg-edit-bg/60 p-3", className)}>
      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
        <p className="text-sm font-medium text-edit-foreground">{L.title(changes.length)}</p>
        {onRevertAll && (allPending ? (
          <RevertConfirm
            labels={L}
            from={L.allChanges(changes.length)}
            to={L.allOriginal}
            onCancel={() => setPending(null)}
            onConfirm={() => { onRevertAll(); setPending(null); }}
          />
        ) : (
          <button type="button" onClick={() => setPending({ all: true })} className="tap-target-y flex items-center gap-1 text-edit-foreground hover:underline">
            <Undo2 className="size-3.5" aria-hidden /> {L.revertAll}
          </button>
        ))}
      </div>
      <ul className={cn("space-y-1", changes.length > 8 && "max-h-56 overflow-y-auto pr-1")}>
        {changes.map((c) => {
          const fieldPending = pending != null && "field" in pending && pending.field === c.field;
          return (
            <li key={c.field} className="flex items-center gap-2 text-xs">
              {fieldPending ? (
                <RevertConfirm
                  labels={L}
                  from={c.afterText}
                  to={c.beforeText}
                  onCancel={() => setPending(null)}
                  onConfirm={() => { onRevertField?.(c.field); setPending(null); }}
                />
              ) : (
                <>
                  <Tooltip content={c.label} className="w-24 shrink-0" focusable><span className="block truncate text-muted-foreground">{c.label}</span></Tooltip>
                  <Tooltip content={c.beforeText} className="min-w-0" focusable><span className="block truncate text-muted-foreground line-through">{c.beforeText}</span></Tooltip>
                  <ArrowRight className="size-3 shrink-0 text-warning" aria-hidden />
                  <Tooltip content={c.afterText} className="min-w-0" focusable><span className="block truncate font-medium text-edit-foreground">{c.afterText}</span></Tooltip>
                  {onRevertField && (
                    <button
                      type="button"
                      onClick={() => setPending({ field: c.field, from: c.afterText, to: c.beforeText })}
                      title={L.revertFieldTitle}
                      aria-label={L.revertField(c.label)}
                      className="tap-target ml-auto flex shrink-0 items-center justify-center rounded p-0.5 text-warning hover:bg-edit-bg"
                    >
                      <Undo2 className="size-3.5" aria-hidden />
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
