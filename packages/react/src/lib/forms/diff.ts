// 表單欄位比對：一份宣告同時餵給「變更偵測 → 送出前摘要 → 稽核 before/after」三個地方。
//
// 這是「稽核與回復」模式的資料骨架：只要每個表單都用 FieldSpec 描述欄位，
// 稽核記錄就能自動帶結構化的 before/after，回復功能不必為每張表單各寫一次。

export type FieldKind =
  | "text" | "number" | "money" | "rate" | "date"
  | "select" | "checkbox" | "radio" | "multiselect";

/** 一個欄位的中繼資料（各表單宣告，驅動比對與顯示）。 */
export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  /** 顯示格式覆寫（如 select 值→標籤）；優先於 kind 預設格式 */
  format?: (v: unknown) => string;
  /** 單位（如 h、kg、件）；接於數字後 */
  unit?: string;
}

/** 一筆欄位變更（含格式化字串，摘要與稽核可直接顯示，不必各自再格式化一次）。 */
export interface Change {
  field: string;
  label: string;
  before: unknown;
  after: unknown;
  beforeText: string;
  afterText: string;
}

/** 空值：`null` / `undefined` / `""` 視為等價。 */
export function isEmptyValue(v: unknown): boolean {
  return v === null || v === undefined || v === "";
}

/**
 * 欄位等值判定。陣列比集合（順序不算差異）、空值等價、數字以數值比較。
 * 這條規則決定「什麼算改動」——寬鬆一點可以避免大量假變更（例如 `""` vs `null` 被記成一筆稽核）。
 */
export function eqValue(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    const sa = (Array.isArray(a) ? [...a] : []).map(String).sort();
    const sb = (Array.isArray(b) ? [...b] : []).map(String).sort();
    return sa.length === sb.length && sa.every((x, i) => x === sb[i]);
  }
  if (isEmptyValue(a) && isEmptyValue(b)) return true;
  if (typeof a === "number" || typeof b === "number") {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb;
  }
  return a === b;
}

/** 千分位、不四捨五入。 */
export function formatPlainNumber(n: number, locale = "en-US"): string {
  if (!Number.isFinite(n)) return String(n);
  return n.toLocaleString(locale, { maximumFractionDigits: 10 });
}

/** 金額：符號＋千分位，負值用會計括號。 */
export function formatFieldMoney(n: number, symbol = "$"): string {
  if (!Number.isFinite(n)) return String(n);
  return n < 0 ? `(${symbol}${formatPlainNumber(-n)})` : `${symbol}${formatPlainNumber(n)}`;
}

/** 依 kind 產生顯示字串（空值→「—」）。 */
export function fmtValue(v: unknown, kind: FieldKind, format?: (v: unknown) => string, unit?: string): string {
  if (format) return format(v);
  if (Array.isArray(v)) return v.length ? v.join("、") : "—";
  if (isEmptyValue(v)) return "—";
  const withUnit = (s: string) => (unit ? `${s} ${unit}` : s);
  switch (kind) {
    case "money":
      return formatFieldMoney(Number(v));
    case "rate":
      // 比率一律以百分比呈現；清掉浮點雜訊但不做語意進位
      return `${(Number(v) * 100).toLocaleString("en-US", { maximumFractionDigits: 6 })}%`;
    case "number":
      return withUnit(formatPlainNumber(Number(v)));
    case "checkbox":
      return v ? "是" : "否";
    default:
      return withUnit(String(v));
  }
}

/** 比對原始物件與草稿，回傳有變更的欄位（依 specs 宣告順序，不是物件 key 順序）。 */
export function diffRecord<T extends Record<string, unknown>>(
  original: T | undefined,
  draft: T,
  specs: FieldSpec[],
): Change[] {
  const out: Change[] = [];
  for (const s of specs) {
    const before = original ? original[s.key] : undefined;
    const after = draft[s.key];
    if (eqValue(before, after)) continue;
    out.push({
      field: s.key,
      label: s.label,
      before,
      after,
      beforeText: fmtValue(before, s.kind, s.format, s.unit),
      afterText: fmtValue(after, s.kind, s.format, s.unit),
    });
  }
  return out;
}
