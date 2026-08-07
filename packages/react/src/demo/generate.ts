// 示範資料生成器（僅供 Storybook 互動 playground 使用，**不隨套件發佈**）。
//
// sample-data.ts 是示範資料的「靜態典型值」；這裡是同一來源的「參數化衍生值」——
// playground 要讓人把資料筆數拉到 0、200，或是調整狀態比例、摻入極端值，
// 靜態十八筆做不到，逐頁自己宣告資料又會打開新領域溜進來的入口（ADR-0006）。
// 因此衍生邏輯集中在這一檔，詞彙**只能**延伸 sample-data 既有的抽象中性模式
// （天干＋單位／類別／組別／案／項目），de-domain 守衛照掃這個檔案。
//
// 全部函式都是**確定性**的：同樣的參數永遠生出同樣的資料。截圖驗證與守衛測試
// 要能重現，未播種的 Math.random 在這裡是禁用的。
import type { DemoPhase, DemoRecord, RecordStatus } from "./sample-data";

/**
 * 線性同餘亂數（Numerical Recipes 參數）。回傳 [0, 1) 的產生器。
 * 不求統計品質，只求「可重現＋看起來夠亂」——示範資料的需求止於此。
 */
export function rng(seed = 1): () => number {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

// ── 詞彙池：全部延伸自 sample-data 的既有模式，不得加入新領域詞 ──
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const NAME_VARIANTS = [
  "第一階段", "第二階段", "第三階段", "初版", "第二版", "第三版",
  "例行項目", "附屬項目", "基礎項目", "小額項目", "整併", "追蹤",
  "補充", "擴充", "專案型", "附註項目",
];
// 沿用 R-2402 的寫法：長名稱是為了示範截斷與可調欄寬，不是真的敘述
const LONG_SUFFIX = " 這一筆刻意加長，用來示範欄位截斷與可調欄寬";
// 抽象的「階段推進」流程步驟，延伸 demoGraphNodes 的五個節點
const FLOW_STEPS = ["接收", "初審", "複核", "彙整", "確認", "覆核", "建檔", "歸檔", "通知", "結案"];

/** 天干編號：前十個直接用，超過十個補序號（甲單位、…、癸單位、甲單位2）。 */
function stemLabel(i: number, suffix: string): string {
  const stem = STEMS[i % STEMS.length];
  const round = Math.floor(i / STEMS.length);
  return round === 0 ? `${stem}${suffix}` : `${stem}${suffix}${round + 1}`;
}

/** 以 ISO 字串做日期加法，避免時區干擾（一律走 UTC）。 */
function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function pickWeighted<T extends string>(weights: Record<T, number>, r: number): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let acc = 0;
  const target = r * total;
  for (const [key, w] of entries) {
    acc += w;
    if (target < acc) return key;
  }
  return entries[entries.length - 1][0];
}

export interface MakeRecordsOptions {
  seed?: number;
  /** 預設值＝靜態十八筆的實際分布（草稿 4／已確認 8／已完成 5／已作廢 1）。 */
  statusWeights?: Record<RecordStatus, number>;
  /** 0–1，摻入超長名稱的比例（示範截斷與可調欄寬）。 */
  longNameRatio?: number;
  unitCount?: number;
  categoryCount?: number;
  ownerCount?: number;
  qtyRange?: [number, number];
  /** 金額取百元整數，與靜態資料一致。 */
  amountRange?: [number, number];
  /** 起始日期，逐筆遞增 1–3 天。 */
  dateStart?: string;
}

/** 生成 DataTable 用的紀錄。id 從 R-3001 起跳，與靜態的 R-24xx 不相撞，兩者可混用。 */
export function makeRecords(n: number, options: MakeRecordsOptions = {}): DemoRecord[] {
  const {
    seed = 1,
    statusWeights = { draft: 4, confirmed: 8, done: 5, void: 1 },
    longNameRatio = 0,
    unitCount = 5,
    categoryCount = 4,
    ownerCount = 3,
    qtyRange = [2, 12_000],
    amountRange = [18_000, 270_000],
    dateStart = "2024-01-08",
  } = options;
  const r = rng(seed);
  const out: DemoRecord[] = [];
  let date = dateStart;
  for (let i = 0; i < n; i++) {
    const base = `${STEMS[i % STEMS.length]}案 ${NAME_VARIANTS[Math.floor(r() * NAME_VARIANTS.length)]}`;
    out.push({
      id: `R-${3001 + i}`,
      unit: stemLabel(Math.floor(r() * unitCount), "單位"),
      name: r() < longNameRatio ? `${base}${LONG_SUFFIX}` : base,
      category: stemLabel(Math.floor(r() * categoryCount), "類"),
      qty: Math.round(qtyRange[0] + r() * (qtyRange[1] - qtyRange[0])),
      amount: Math.round((amountRange[0] + r() * (amountRange[1] - amountRange[0])) / 100) * 100,
      status: pickWeighted(statusWeights, r()),
      createdAt: date,
      owner: `第${NUMS[Math.floor(r() * ownerCount) % NUMS.length]}組`,
    });
    date = addDays(date, 1 + Math.floor(r() * 3));
  }
  return out;
}

/** 生成下拉／單選／多選用的選項（甲項、乙項、…，超過十個補序號）。 */
export function makeOptions(n: number): { value: string; label: string }[] {
  return Array.from({ length: n }, (_, i) => ({
    value: `opt-${i + 1}`,
    label: stemLabel(i, "項"),
  }));
}

export interface MakePhasesOptions {
  seed?: number;
  dateStart?: string;
  /** 整批項目分布的總跨度（天）。14≈日刻度、60≈週刻度、240≈月刻度。 */
  spanDays?: number;
}

/** 生成 Gantt 用的時間軸項目。category 輪流對映 --chart-1 到 --chart-8 全八色。 */
export function makePhases(n: number, options: MakePhasesOptions = {}): DemoPhase[] {
  const { seed = 1, dateStart = "2024-01-08", spanDays = 60 } = options;
  const r = rng(seed);
  const out: DemoPhase[] = [];
  for (let i = 0; i < n; i++) {
    const duration = 7 + Math.floor(r() * 19);
    const offset = Math.floor(r() * Math.max(1, spanDays - duration));
    out.push({
      id: `P-${String(i + 1).padStart(2, "0")}`,
      label: `${STEMS[i % STEMS.length]}案 ${NAME_VARIANTS[i % NAME_VARIANTS.length]}`,
      start: addDays(dateStart, offset),
      end: addDays(dateStart, offset + duration),
      category: (i % 8) + 1,
      // 每五筆留一筆沒有進度——「進度未回報」也是要示範的狀態
      progress: i % 5 === 4 ? undefined : Math.round(r() * 20) * 5,
    });
  }
  return out.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
}

export interface MakeSeriesOptions {
  seed?: number;
  /** "unit"＝甲單位…（分類語意）；"period"＝第1期…（等距時間語意，趨勢圖用）。 */
  labelKind?: "unit" | "period";
  range?: [number, number];
}

/** 生成長條／柏拉圖／趨勢圖用的單序列資料。 */
export function makeSeries(n: number, options: MakeSeriesOptions = {}): { label: string; value: number }[] {
  const { seed = 1, labelKind = "unit", range = [8, 96] } = options;
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => ({
    label: labelKind === "period" ? `第${i + 1}期` : stemLabel(i, "單位"),
    value: Math.round(range[0] + r() * (range[1] - range[0])),
  }));
}

/**
 * 生成堆疊圖用的列。刻意**不給** color——序列色要跨期穩定、由使用端指定
 * （story 端配 PALETTE），這是 StackedBar 的既有規範，生成器不越權。
 */
export function makeStackedRows(
  rows: number,
  segs: number,
  options: { seed?: number } = {},
): { label: string; segments: { label: string; value: number }[] }[] {
  const { seed = 1 } = options;
  const r = rng(seed);
  return Array.from({ length: rows }, (_, ri) => ({
    label: stemLabel(ri, "單位"),
    segments: Array.from({ length: segs }, (_, ci) => ({
      label: stemLabel(ci, "類"),
      value: Math.round(4 + r() * 44),
    })),
  }));
}

export interface MakeGraphOptions {
  seed?: number;
  /** 平均出邊數：1＝疏、1.5＝中、2＝密。 */
  density?: number;
}

/**
 * 生成 GraphCanvas 用的分層流程圖（DAG）。
 * 每層 1–3 個節點、只做相鄰層的前向連線；座標尺度沿用 demoGraphNodes（層距 180、列距 90）。
 * 同一層同色（category 依層輪替），呼應「同一實體跨畫面同色」的示範。
 */
export function makeGraph(
  nodeCount: number,
  options: MakeGraphOptions = {},
): {
  nodes: { id: string; label: string; position: { x: number; y: number }; category?: number }[];
  edges: { id: string; source: string; target: string; label?: string }[];
} {
  const { seed = 1, density = 1.5 } = options;
  const r = rng(seed);

  // 先切層：每層 1–3 個節點，直到用完
  const layers: number[][] = [];
  let idx = 0;
  while (idx < nodeCount) {
    const size = Math.min(nodeCount - idx, 1 + Math.floor(r() * 3));
    layers.push(Array.from({ length: size }, (_, k) => idx + k));
    idx += size;
  }

  const nodes = layers.flatMap((layer, li) =>
    layer.map((i, k) => ({
      id: `n${i + 1}`,
      label: i < FLOW_STEPS.length
        ? FLOW_STEPS[i]
        : `${FLOW_STEPS[i % FLOW_STEPS.length]}${Math.floor(i / FLOW_STEPS.length) + 1}`,
      position: { x: li * 180, y: k * 90 },
      category: (li % 8) + 1,
    })),
  );

  const edges: { id: string; source: string; target: string; label?: string }[] = [];
  const seen = new Set<string>();
  const link = (from: number, to: number) => {
    const id = `e${from + 1}-${to + 1}`;
    if (seen.has(id)) return;
    seen.add(id);
    // 約每四條有一條帶「通過」標籤，沿用 demoGraphEdges 的示範密度
    edges.push({ id, source: `n${from + 1}`, target: `n${to + 1}`, ...(edges.length % 4 === 2 ? { label: "通過" } : {}) });
  };
  for (let li = 1; li < layers.length; li++) {
    const prev = layers[li - 1];
    const curr = layers[li];
    for (const to of curr) {
      const k = Math.min(prev.length, 1 + Math.floor(r() * density));
      const start = Math.floor(r() * prev.length);
      for (let j = 0; j < k; j++) link(prev[(start + j) % prev.length], to);
    }
    // 上一層若有節點沒接出去，補一條——懸空節點在示範裡看起來像 bug
    for (const from of prev) {
      if (!edges.some((e) => e.source === `n${from + 1}`)) link(from, curr[Math.floor(r() * curr.length)]);
    }
  }
  return { nodes, edges };
}
