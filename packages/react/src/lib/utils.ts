import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * twMerge 的預設分群有兩處對不上本書的 class，登記在這裡。用 classGroups（tailwind-merge v2／v3
 * 同一套 API），不用 v3 才有的 theme 鍵——registry 抄走的宿主可能還在 v2。
 *
 * 1. token 自訂字級：預設表只有 xs…9xl，未登記的 `text-tiny` 會被當成**文字色**，
 *    於是 `cn("text-sm", "text-tiny")` 兩者並存、誰贏看 CSS 產出順序。登記進 font-size 群組。
 * 2. `bg-gradient-to-*`：tailwind-merge v3 只認 v4 的 `bg-linear-*`，把 `bg-gradient-to-r` 當成**底色**。
 *    DataTable 的十字對準疊在凍結格上時，會把凍結格的 `bg-background` 合併掉，捲過去的欄位從凍結欄透出來
 *    （2026-09 手機實測）。元件要相容 v3 宿主所以寫 `bg-gradient-to-*`，在這裡登記回背景圖片群組。
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "tiny"] }],
      "bg-image": [{ bg: [{ "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }] }],
    },
  },
});

/** class 合併：後者覆蓋前者的同類 Tailwind utility（避免 `p-2 p-4` 這種順序賭博）。 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 數字顯示：千分位、**不四捨五入**。
 *
 * 「顯示端不進位」是刻意的：一旦顯示層偷偷 round，使用者就會拿畫面上的數字去對帳、
 * 然後發現對不起來。要進位請在計算層明確進位，顯示層只負責忠實呈現。
 */
export function formatNumber(n: number, locale = "en-US"): string {
  if (!Number.isFinite(n)) return String(n);
  return n.toLocaleString(locale, { maximumFractionDigits: 10 });
}

/**
 * 金額顯示：符號＋千分位；負值採會計慣例的括號（`($2,000)`）。
 * 紅字由 UI 決定（顏色不是唯一線索——括號本身就已經表達負值）。
 */
export function formatMoney(n: number, opts?: { symbol?: string; locale?: string }): string {
  if (!Number.isFinite(n)) return String(n);
  const symbol = opts?.symbol ?? "$";
  const body = formatNumber(Math.abs(n), opts?.locale);
  return n < 0 ? `(${symbol}${body})` : `${symbol}${body}`;
}

/** 比率→百分比字串。`0.085` → `"8.5%"`。比值一律以百分比呈現，見 ADR-0003 的顯示規約。 */
export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/**
 * 比較基準值→百分比（`1.05` → `"105%"`）。
 * 與 `formatPercent` 分開命名，是因為兩者語意不同：一個是「佔比」，一個是「相對於基準的倍數」。
 */
export function formatRatio(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/** 帶正負號的數字（差異欄用）：`1234` → `"+1,234"`、`-1234` → `"−1,234"`（真減號 U+2212）。 */
export function formatSigned(n: number, format: (v: number) => string = formatNumber): string {
  if (n === 0) return format(0);
  return `${n > 0 ? "+" : "−"}${format(Math.abs(n))}`;
}
