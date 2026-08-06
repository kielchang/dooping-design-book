import type { ReactNode } from "react";
import { cn, formatNumber } from "../lib/utils";

// 圖表家族的共同底座：型別、色票取用、彙總工具、文字／鍵盤等價表。
//
// 這一組是「後台閱讀型」圖表（見文件〈Charts 圖表〉的邊界）：
// 零相依、資料點百位數以內、只有 hover 提示與 onSelect 鑽取。
// 縮放、刷選、圖內鑽取刻意不做——需要分析型互動請用成熟圖表庫。

/** 單序列資料點（BarChart／Pareto／TrendChart）。 */
export type BarDatum = { label: string; value: number; id?: string };
/** 堆疊分段（StackedBar）。顏色由宿主指定——序列色要跨期穩定，元件不猜。 */
export type Segment = { label: string; value: number; color: string };
/** 座標點（Scatter／LineChart）。 */
export type Point = { x: number; y: number; label?: string; id?: string };

/**
 * 分類色票。`PALETTE[n]` 只代表「這是哪一類」——類別身分，沒有好壞。
 * 值是 CSS 變數引用：換色票、切深淺模式都由 token 層決定，這裡永遠不需要動。
 * 順序即安全順序（相鄰取用永遠是近似最佳的 k 色子集），所以不要重排、不要循環。
 */
export const PALETTE = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);

/**
 * 類別數封頂：取值最大的 `max - 1` 名（維持原本相對順序），其餘彙總成「其他（N 項）」。
 *
 * 不循環取色的配套——第 9 類拿到跟第 1 類一樣的顏色，圖例會出現兩個同色不同名的項目。
 */
export function capItems(data: BarDatum[], max: number): BarDatum[] {
  if (data.length <= max) return data;
  const keep = new Set(
    [...data].sort((a, b) => b.value - a.value).slice(0, max - 1),
  );
  const kept = data.filter((d) => keep.has(d));
  const rest = data.filter((d) => !keep.has(d));
  return [
    ...kept,
    { label: `其他（${rest.length} 項）`, value: rest.reduce((s, d) => s + d.value, 0) },
  ];
}

export type ValueFmt = (n: number) => string;
export const defaultFmt: ValueFmt = (n) => formatNumber(n);

// ── 配色策略的三層工具（判斷樹見文件〈Charts 圖表 → 配色策略〉）──
//
// 離散類別的顏色只有三種來源，依序判斷：
//   ① 語意：維度值本身已有系統語意（狀態、好壞、變更）→ STATUS_SERIES。
//      Badge 教會使用者「已完成＝綠」，圖表不得把它變成別的顏色。
//   ② 身分：維度會跨圖表、跨期別反覆出現 → colorByKey。顏色跟實體走。
//   ③ 區辨：一次性比較 → PALETTE 照序取用。
// 連續數值不套分類色盤（sequential／diverging 的構造規則在文件裡）。

/**
 * 第 1 層【語意】：維度值已有系統語意時的現成色表。
 *
 * 鍵是提醒色辭典的合法語意，值一律引用語意 token——換主題、切深淺自動跟。
 * **預設淡底**（`-subtle`）：語意堆疊是大面積色，而提醒視窗與圖表重點色
 * 共用同一份高飽和面積預算；實色版（STRONG）只給線、點、細分段這類小面積。
 * 這與 Badge「預設淡底、實色給阻斷」是同一條強度語法。
 */
export const STATUS_SERIES = {
  success: "hsl(var(--success-subtle))",
  warning: "hsl(var(--warning-subtle))",
  info: "hsl(var(--info-subtle))",
  danger: "hsl(var(--danger-subtle))",
  muted: "hsl(var(--muted))",
} as const;

/** 語意色表的實色版：小面積（折線、資料點、細分段）才用。 */
export const STATUS_SERIES_STRONG = {
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  info: "hsl(var(--info))",
  danger: "hsl(var(--danger))",
  muted: "hsl(var(--muted-foreground))",
} as const;

/**
 * 第 2 層【身分】：以**宿主宣告一次的固定鍵清單**決定色索引。
 *
 * 「顏色跟實體走，不跟排序走」的機制化——最自然的寫法（照當期資料順序取
 * `PALETTE[i]`）恰好是錯的：上月排第一的類別這月排第三，顏色就換了，
 * 使用者會以為在看不同的東西。鍵清單是維度的定義（例如全部單位的固定順序），
 * 寫在宿主的常數裡，所有圖表共用同一份。
 *
 * 超過 8 個鍵的部份與找不到的鍵一律退 `--muted`（不拋錯）——
 * 分類色盤封頂是刻意的，第 9 個實體該進「其他」，不該搶到會撞色的新顏色。
 */
export function colorByKey(key: string, keys: readonly string[]): string {
  const i = keys.indexOf(key);
  return i >= 0 && i < PALETTE.length ? PALETTE[i] : "hsl(var(--muted))";
}

/**
 * 文字等價 ＋ 鍵盤等價，一張表兩個職責（見〈Charts 圖表〉的無障礙一節與
 * 無障礙四原則的「文字等價用表格」）：
 *
 * - **報讀器**：圖形掛 `role="img"` 後子樹被隱藏，精確數值由這張表補回
 *   （`<caption>` ＋ `scope`，報讀器有專門的表格瀏覽指令）。
 * - **鍵盤**：hover 提示與點擊鑽取對鍵盤使用者不可達——這張表兼任操作介面，
 *   有 `onSelect` 時每一列是一顆真按鈕。表平常 `sr-only`，**鍵盤焦點進入時現形**
 *   （同 skip-link 的慣例），明眼的鍵盤使用者才不會把焦點丟進看不見的地方。
 */
export function ChartDataTable({
  caption,
  head,
  rows,
  onSelect,
  selectedIndex,
  className,
}: {
  /** 表格標題＝這張圖在講什麼。報讀器靠它定位，所以必填。 */
  caption: string;
  head: string[];
  /** 每列＝[label, ...值們]（已格式化成字串）。 */
  rows: string[][];
  onSelect?: (index: number) => void;
  selectedIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sr-only focus-within:not-sr-only focus-within:mt-2 focus-within:block",
        className,
      )}
    >
      <table className="w-full border-collapse rounded-md border text-xs">
        <caption className="p-1 text-left font-medium">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="border-b px-2 py-1 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className={cn(selectedIndex === i && "bg-muted")}>
              <th scope="row" className="px-2 py-1 text-left font-normal">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-pressed={selectedIndex === i}
                    className="underline decoration-dotted underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {cells[0]}
                  </button>
                ) : (
                  cells[0]
                )}
              </th>
              {cells.slice(1).map((c, j) => (
                <td key={j} className="px-2 py-1 tabular-nums">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 空資料的統一出口：一行「無資料」，不畫空白座標軸（見文件〈空資料、單點、全零〉）。 */
export function ChartEmpty({ children }: { children?: ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      {children ?? "無資料"}
    </p>
  );
}
