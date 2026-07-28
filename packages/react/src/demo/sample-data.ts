// 示範資料（僅供 Storybook 與文件站活範例使用，**不隨套件出貨**）。
//
// 一律使用中性商業情境：訂單、客戶、庫存品項、工單。
// 這不是潔癖——示範資料會被複製貼上。一旦示範裡出現特定產業的欄位，
// 抄過去的人就會連那個產業的資料模型一起抄走。
export type OrderStatus = "draft" | "confirmed" | "shipped" | "cancelled";

export interface DemoOrder {
  id: string;
  customer: string;
  item: string;
  category: string;
  qty: number;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  owner: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "草稿",
  confirmed: "已確認",
  shipped: "已出貨",
  cancelled: "已取消",
};

export const demoOrders: DemoOrder[] = [
  { id: "SO-2401", customer: "遠東貿易", item: "工業級軸承 6204", category: "零件", qty: 120, amount: 84_000, status: "shipped", createdAt: "2024-01-08", owner: "業務一課" },
  { id: "SO-2402", customer: "宏昌實業", item: "不鏽鋼板 304 2mm", category: "原料", qty: 40, amount: 156_400, status: "confirmed", createdAt: "2024-01-11", owner: "業務二課" },
  { id: "SO-2403", customer: "台興機械", item: "伺服馬達 750W", category: "設備", qty: 6, amount: 213_000, status: "confirmed", createdAt: "2024-01-12", owner: "業務一課" },
  { id: "SO-2404", customer: "遠東貿易", item: "潤滑油 20L", category: "耗材", qty: 80, amount: 32_800, status: "draft", createdAt: "2024-01-15", owner: "業務三課" },
  { id: "SO-2405", customer: "永盛五金", item: "六角螺栓 M10", category: "零件", qty: 5_000, amount: 47_500, status: "shipped", createdAt: "2024-01-16", owner: "業務二課" },
  { id: "SO-2406", customer: "中鼎工程", item: "控制箱 IP65", category: "設備", qty: 12, amount: 268_800, status: "confirmed", createdAt: "2024-01-18", owner: "業務一課" },
  { id: "SO-2407", customer: "宏昌實業", item: "鋁擠型 40x40", category: "原料", qty: 300, amount: 91_200, status: "cancelled", createdAt: "2024-01-19", owner: "業務三課" },
  { id: "SO-2408", customer: "台興機械", item: "減速機 1:20", category: "設備", qty: 4, amount: 128_000, status: "draft", createdAt: "2024-01-22", owner: "業務二課" },
  { id: "SO-2409", customer: "永盛五金", item: "束帶 300mm", category: "耗材", qty: 12_000, amount: 18_600, status: "shipped", createdAt: "2024-01-23", owner: "業務三課" },
  { id: "SO-2410", customer: "中鼎工程", item: "感測器 PNP NO", category: "零件", qty: 250, amount: 137_500, status: "confirmed", createdAt: "2024-01-25", owner: "業務一課" },
  { id: "SO-2411", customer: "遠東貿易", item: "工業級軸承 6206", category: "零件", qty: 90, amount: 76_500, status: "confirmed", createdAt: "2024-01-26", owner: "業務二課" },
  { id: "SO-2412", customer: "永盛五金", item: "砂輪片 4 吋", category: "耗材", qty: 2_000, amount: 24_000, status: "shipped", createdAt: "2024-01-29", owner: "業務三課" },
  { id: "SO-2413", customer: "宏昌實業", item: "碳鋼圓棒 Ø25", category: "原料", qty: 150, amount: 64_500, status: "draft", createdAt: "2024-01-30", owner: "業務一課" },
  { id: "SO-2414", customer: "台興機械", item: "變頻器 2.2kW", category: "設備", qty: 8, amount: 184_000, status: "confirmed", createdAt: "2024-02-01", owner: "業務二課" },
  { id: "SO-2415", customer: "中鼎工程", item: "電纜線 3C x 2.0", category: "耗材", qty: 600, amount: 42_000, status: "shipped", createdAt: "2024-02-02", owner: "業務三課" },
  { id: "SO-2416", customer: "遠東貿易", item: "油封 TC 型", category: "零件", qty: 400, amount: 28_800, status: "confirmed", createdAt: "2024-02-05", owner: "業務一課" },
  { id: "SO-2417", customer: "永盛五金", item: "手動堆高機 2T", category: "設備", qty: 2, amount: 96_000, status: "draft", createdAt: "2024-02-06", owner: "業務二課" },
  { id: "SO-2418", customer: "宏昌實業", item: "銅排 T2 5x30", category: "原料", qty: 60, amount: 110_400, status: "confirmed", createdAt: "2024-02-07", owner: "業務三課" },
];

/** 單筆客戶主檔（示範「唯讀逐欄編輯」用）。 */
export interface DemoCustomer extends Record<string, unknown> {
  name: string;
  code: string;
  tier: string;
  creditLimit: number;
  discountRate: number;
  channels: string[];
  active: boolean;
  contact: string;
  since: string;
}

export const demoCustomer: DemoCustomer = {
  name: "遠東貿易股份有限公司",
  code: "C-1042",
  tier: "gold",
  creditLimit: 1_500_000,
  discountRate: 0.08,
  channels: ["web", "phone"],
  active: true,
  contact: "採購部 分機 214",
  since: "2019-04-01",
};

export const TIER_OPTIONS = [
  { value: "bronze", label: "銅級" },
  { value: "silver", label: "銀級" },
  { value: "gold", label: "金級" },
  { value: "platinum", label: "白金級" },
];

export const CHANNEL_OPTIONS = [
  { value: "web", label: "線上下單" },
  { value: "phone", label: "電話" },
  { value: "email", label: "電子郵件" },
  { value: "onsite", label: "業務到府" },
];
