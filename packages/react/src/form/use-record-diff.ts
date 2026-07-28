import { useMemo, useCallback } from "react";
import { diffRecord, type FieldSpec } from "../lib/forms/diff";

/**
 * 表單草稿 vs 原始值的變更追蹤：回傳變更清單與逐欄／整批還原。
 *
 * `specs` 建議宣告成**模組常數**（穩定參考），否則每次 render 都是新陣列，
 * memo 失效、變更清單每次重算——欄位一多就會在打字時卡頓。
 */
export function useRecordDiff<T extends Record<string, unknown>>(
  original: T | undefined,
  draft: T,
  setDraft: (updater: (d: T) => T) => void,
  specs: FieldSpec[],
) {
  const changes = useMemo(() => diffRecord(original, draft, specs), [original, draft, specs]);

  const revertField = useCallback(
    (key: string) => {
      setDraft((d) => ({ ...d, [key]: original ? original[key] : undefined }));
    },
    [original, setDraft],
  );

  const revertAll = useCallback(() => {
    setDraft((d) => {
      const next = { ...d } as T;
      for (const s of specs) (next as Record<string, unknown>)[s.key] = original ? original[s.key] : undefined;
      return next;
    });
  }, [original, setDraft, specs]);

  return { changes, revertField, revertAll };
}
