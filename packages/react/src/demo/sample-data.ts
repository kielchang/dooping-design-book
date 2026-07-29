// 示範資料（僅供 Storybook 與文件站活範例使用，**不隨套件發佈**）。
//
// 一律使用**抽象中性**情境：項目、單位、類別、負責組別、狀態。
// 這不是潔癖——示範資料會被複製貼上。一旦示範裡出現特定產業的欄位，
// 抄過去的人就會連那個產業的資料模型一起抄走。
//
// v0.2.1 之前這裡用的是一整套交易型系統的欄位，並自稱「中性商業情境」——
// 其實只是把原本的領域換成了另一個領域（見 ADR-0006）。現在的欄位刻意不對應任何真實業務：
// 甲乙丙丁只是標籤，`name` 的長短差異純粹是為了示範截斷與可調欄寬。
export type RecordStatus = "draft" | "confirmed" | "done" | "void";

export interface DemoRecord {
  id: string;
  unit: string;
  name: string;
  category: string;
  qty: number;
  amount: number;
  status: RecordStatus;
  createdAt: string;
  owner: string;
}

export const STATUS_LABEL: Record<RecordStatus, string> = {
  draft: "草稿",
  confirmed: "已確認",
  done: "已完成",
  void: "已作廢",
};

export const demoRecords: DemoRecord[] = [
  { id: "R-2401", unit: "甲單位", name: "甲案 第一階段", category: "甲類", qty: 120, amount: 84_000, status: "done", createdAt: "2024-01-08", owner: "第一組" },
  { id: "R-2402", unit: "乙單位", name: "乙案 追加規格 這一筆刻意加長，用來示範欄位截斷與可調欄寬", category: "乙類", qty: 40, amount: 156_400, status: "confirmed", createdAt: "2024-01-11", owner: "第二組" },
  { id: "R-2403", unit: "丙單位", name: "丙案 初版", category: "丙類", qty: 6, amount: 213_000, status: "confirmed", createdAt: "2024-01-12", owner: "第一組" },
  { id: "R-2404", unit: "甲單位", name: "甲案 第二階段", category: "丁類", qty: 80, amount: 32_800, status: "draft", createdAt: "2024-01-15", owner: "第三組" },
  { id: "R-2405", unit: "丁單位", name: "丁案 例行項目", category: "甲類", qty: 5_000, amount: 47_500, status: "done", createdAt: "2024-01-16", owner: "第二組" },
  { id: "R-2406", unit: "戊單位", name: "戊案 整併", category: "丙類", qty: 12, amount: 268_800, status: "confirmed", createdAt: "2024-01-18", owner: "第一組" },
  { id: "R-2407", unit: "乙單位", name: "乙案 附屬項目", category: "乙類", qty: 300, amount: 91_200, status: "void", createdAt: "2024-01-19", owner: "第三組" },
  { id: "R-2408", unit: "丙單位", name: "丙案 第二版", category: "丙類", qty: 4, amount: 128_000, status: "draft", createdAt: "2024-01-22", owner: "第二組" },
  { id: "R-2409", unit: "丁單位", name: "丁案 小額項目", category: "丁類", qty: 12_000, amount: 18_600, status: "done", createdAt: "2024-01-23", owner: "第三組" },
  { id: "R-2410", unit: "戊單位", name: "戊案 追蹤", category: "甲類", qty: 250, amount: 137_500, status: "confirmed", createdAt: "2024-01-25", owner: "第一組" },
  { id: "R-2411", unit: "甲單位", name: "甲案 第三階段", category: "甲類", qty: 90, amount: 76_500, status: "confirmed", createdAt: "2024-01-26", owner: "第二組" },
  { id: "R-2412", unit: "丁單位", name: "丁案 例行項目（續）", category: "丁類", qty: 2_000, amount: 24_000, status: "done", createdAt: "2024-01-29", owner: "第三組" },
  { id: "R-2413", unit: "乙單位", name: "乙案 基礎項目", category: "乙類", qty: 150, amount: 64_500, status: "draft", createdAt: "2024-01-30", owner: "第一組" },
  { id: "R-2414", unit: "丙單位", name: "丙案 第三版", category: "丙類", qty: 8, amount: 184_000, status: "confirmed", createdAt: "2024-02-01", owner: "第二組" },
  { id: "R-2415", unit: "戊單位", name: "戊案 補充", category: "丁類", qty: 600, amount: 42_000, status: "done", createdAt: "2024-02-02", owner: "第三組" },
  { id: "R-2416", unit: "甲單位", name: "甲案 附註項目", category: "甲類", qty: 400, amount: 28_800, status: "confirmed", createdAt: "2024-02-05", owner: "第一組" },
  { id: "R-2417", unit: "丁單位", name: "丁案 專案型", category: "丙類", qty: 2, amount: 96_000, status: "draft", createdAt: "2024-02-06", owner: "第二組" },
  { id: "R-2418", unit: "乙單位", name: "乙案 擴充", category: "乙類", qty: 60, amount: 110_400, status: "confirmed", createdAt: "2024-02-07", owner: "第三組" },
];

/** 單筆主檔（示範「唯讀逐欄編輯」用）。欄位一樣刻意抽象，不對應任何真實業務物件。 */
export interface DemoProfile extends Record<string, unknown> {
  name: string;
  code: string;
  tier: string;
  quota: number;
  adjustRate: number;
  channels: string[];
  active: boolean;
  contact: string;
  since: string;
}

export const demoProfile: DemoProfile = {
  name: "甲單位（示範用抽象名稱）",
  code: "U-1042",
  tier: "gold",
  quota: 1_500_000,
  adjustRate: 0.08,
  channels: ["online", "phone"],
  active: true,
  contact: "第一組 分機 214",
  since: "2019-04-01",
};

export const TIER_OPTIONS = [
  { value: "bronze", label: "銅級" },
  { value: "silver", label: "銀級" },
  { value: "gold", label: "金級" },
  { value: "platinum", label: "白金級" },
];

export const CHANNEL_OPTIONS = [
  { value: "online", label: "線上" },
  { value: "phone", label: "電話" },
  { value: "email", label: "電子郵件" },
  { value: "onsite", label: "現場" },
];

/**
 * 一組已完成的變更（示範 ChangeSummary 用）。
 *
 * 放在這裡而不是各文件頁自己寫一份：示範資料只能有一個來源，
 * 否則每一份複本都是新領域可以溜進來的入口。守衛見 tests/demo-data.test.ts。
 */
export const demoChanges = [
  {
    field: "quota",
    label: "上限額度",
    before: demoProfile.quota,
    after: 1_650_000,
    beforeText: "$1,500,000",
    afterText: "$1,650,000",
  },
  {
    field: "tier",
    label: "等級",
    before: demoProfile.tier,
    after: "platinum",
    beforeText: "金級",
    afterText: "白金級",
  },
  {
    field: "contact",
    label: "聯絡方式",
    before: demoProfile.contact,
    after: "第一組 分機 220",
    beforeText: "第一組 分機 214",
    afterText: "第一組 分機 220",
  },
];
