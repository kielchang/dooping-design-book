import * as React from "react";

/**
 * 一個畫面裡多種對話框的集中開關（蒸餾自 shadcn-admin 的 dialog-state pattern）。
 *
 * 值是「目前開著哪一種」（union 字串）或 null（全關）。兩條內建規則：
 * - **天然單開**：設新值會自動蓋掉舊值，同時只有一個對話框開著。
 * - **同值再設即關**：`set("delete")` 兩次等於開了再關——觸發端不必自己判斷。
 *
 * 用法：對話框集中掛載在一處，依值決定渲染哪一個；
 * 觸發端（列操作、批次操作、主要按鈕）只呼叫 `set("create")`。
 * 新增一種對話框只改 union 型別與集中掛載點兩處，不會散落在表格列裡。
 *
 * ```tsx
 * const [dialog, setDialog] = useDialogState<"create" | "edit" | "void">();
 * <ConfirmDialog open={dialog === "void"} onOpenChange={(o) => !o && setDialog(null)} … />
 * ```
 */
export function useDialogState<T extends string = string>(
  initial: T | null = null,
): [T | null, (value: T | null) => void] {
  const [open, setOpen] = React.useState<T | null>(initial);
  const set = React.useCallback((value: T | null) => {
    setOpen((prev) => (prev === value ? null : value));
  }, []);
  return [open, set];
}
