// 壓力測試資料生成器（僅供 Storybook 與文件站使用，**不隨套件發佈**）。
//
// 與 sample-data.ts 的分工：那邊是手挑的「乖」資料——長度剛好、沒有 0 也沒有負數；
// 這裡照參數量產「不乖」的資料——超長名稱、13 位數金額、200 筆、0 筆。
// 用途見〈壓力測試 Story〉（book/docs/7-governance/09-stress-stories.mdx）。
// 詞彙沿用同一套抽象中性情境（項目／單位／類別／組別），de-domain 守衛同樣適用。
//
// 確定性：固定種子的 PRNG。同一組參數永遠生出同一批資料——
// 截圖驗證靠「掃描整張圖找期望值」（見〈Story 撰寫慣例〉），資料會動的話什麼都比不了。
import { formatMoney } from "../lib/utils";
import type { DemoRecord, RecordStatus } from "./sample-data";

/** mulberry32：32-bit 種子化 PRNG。夠均勻、四行寫完，示範資料不需要更好的。 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number, decimals: number) => {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
};

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"];
const PHASES = ["一", "二", "三", "四", "五"];
const STATUSES: RecordStatus[] = ["draft", "confirmed", "done", "void"];

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * 一段中性的長文字。內容刻意「像真的資料、又明顯是測試」——
 * 截圖裡一眼認得出這是壓力值，不會被當成正常示範抄走。
 */
const LONG_FILLER =
  "跨單位彙整後之延伸批次紀錄，內容刻意加長，用於驗證截斷、換行與列高在極端長度下的表現，";

export function makeLongText(chars: number): string {
  let s = "";
  while (s.length < chars) s += LONG_FILLER;
  return s.slice(0, chars);
}

export interface MakeRecordsOptions {
  count: number;
  /** 換一批不同的資料時才需要動；預設 42。 */
  seed?: number;
  /**
   * 0–1：這個比例的筆數改用約 40 字的超長名稱（預設 0）。
   * 配額制而不是逐筆抽亂數——0.5 就**保證**恰好一半，且長短交錯。
   * 壓力測試要的是保證出現的極端；小樣本抽亂數會抽偏（6 筆抽 0.5 實測只中 1 筆）。
   */
  longNameRatio?: number;
  /** 數量範圍（預設 [1, 500]）。[0, 0] 造全零、負下限造負值。 */
  qtyRange?: [number, number];
  /** 金額範圍（預設 [8_000, 300_000]）。拉到 [1e12, 9.9e12] 就是 13 位數。 */
  amountRange?: [number, number];
  /** 小數位數（預設 0＝整數）。搭配 formatNumber 的「不四捨五入」測超長小數。 */
  qtyDecimals?: number;
  amountDecimals?: number;
}

/** 量產 DemoRecord。欄位形狀與 sample-data 完全相同，資料表 stories 的欄位定義兩邊通用。 */
export function makeRecords({
  count,
  seed = 42,
  longNameRatio = 0,
  qtyRange = [1, 500],
  amountRange = [8_000, 300_000],
  qtyDecimals = 0,
  amountDecimals = 0,
}: MakeRecordsOptions): DemoRecord[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const stem = STEMS[i % STEMS.length];
    // 每筆固定抽三次亂數——調 longNameRatio 不會讓後面所有筆的數值跟著洗牌
    const statusDraw = rng();
    const qty = round(qtyRange[0] + rng() * (qtyRange[1] - qtyRange[0]), qtyDecimals);
    const amount = round(amountRange[0] + rng() * (amountRange[1] - amountRange[0]), amountDecimals);
    // Bresenham 式配額：整批恰好 floor(count × ratio) 筆是長名稱，均勻分佈
    const isLong = Math.floor((i + 1) * longNameRatio) > Math.floor(i * longNameRatio);
    const name = isLong
      ? `${stem}案 ${makeLongText(38 + (i % 9))}`
      : `${stem}案 第${PHASES[i % PHASES.length]}階段`;
    return {
      id: `S-${String(i + 1).padStart(4, "0")}`,
      unit: `${stem}單位`,
      name,
      category: `${STEMS[i % 4]}類`,
      qty,
      amount,
      status: STATUSES[Math.floor(statusDraw * STATUSES.length)],
      createdAt: fmtDate(new Date(2024, 0, 1 + ((i * 3) % 88))),
      owner: `第${PHASES[i % 4]}組`,
    };
  });
}

export interface DemoOption {
  value: string;
  label: string;
}

/**
 * 選項清單（Chips／SegGroup／Select 通吃）。longLabelRatio=1 全部換成約 28 字的長標籤。
 * 比例一樣是配額制（理由見 MakeRecordsOptions.longNameRatio）。
 */
export function makeOptions(
  count: number,
  { longLabelRatio = 0 }: { longLabelRatio?: number } = {},
): DemoOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: `o${i + 1}`,
    label:
      Math.floor((i + 1) * longLabelRatio) > Math.floor(i * longLabelRatio)
        ? `選項${i + 1}：${makeLongText(20 + (i % 6))}`
        : `選項${i + 1}`,
  }));
}

/**
 * 變更清單（ChangeSummary 用）。形狀同 lib/forms/diff 的 Change。
 * longTextRatio 是配額制（理由見 MakeRecordsOptions.longNameRatio）。
 */
export function makeChanges(
  count: number,
  { seed = 42, longTextRatio = 0 }: { seed?: number; longTextRatio?: number } = {},
) {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const long = Math.floor((i + 1) * longTextRatio) > Math.floor(i * longTextRatio);
    const before = Math.round(10_000 + rng() * 990_000);
    const after = Math.round(10_000 + rng() * 990_000);
    return {
      field: `f${i + 1}`,
      label: long ? `欄位${i + 1}（${makeLongText(16)}）` : `欄位${i + 1}`,
      before,
      after,
      beforeText: long ? `${formatMoney(before)}（${makeLongText(14)}）` : formatMoney(before),
      afterText: long ? `${formatMoney(after)}（${makeLongText(14)}）` : formatMoney(after),
    };
  });
}

/** 分類資料（BarChart／StackedBar／Legend 用）。valueRange [0,0] 造全零。 */
export function makeCategories(
  count: number,
  { seed = 42, valueRange = [10_000, 300_000] }: { seed?: number; valueRange?: [number, number] } = {},
): { label: string; value: number }[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    label: `第${i + 1}類`,
    value: Math.round(valueRange[0] + rng() * (valueRange[1] - valueRange[0])),
  }));
}
