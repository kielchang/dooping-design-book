// ─────────────────────────────────────────────────────────────────────────
// @dooping/react — 公開匯出。這份 barrel 即「元件庫範圍清單」與對外邊界。
//
// 邊界鐵律：此處列出的所有模組**只能**依賴設計 token、彼此、以及少數通用工具
// （clsx / tailwind-merge / cva / lucide / radix）。**不得** import 任何應用層概念
// （狀態管理、路由、業務型別、API client、領域計算）。
// 由 tests/boundary.test.ts 自動守衛——新增元件請一併加進這份 barrel。
// ─────────────────────────────────────────────────────────────────────────

export { KIT_VERSION } from "./version";

// 基礎
export * from "./ui/button";
export * from "./ui/badge";
export * from "./ui/card";
export * from "./ui/callout";
export * from "./ui/input";
export * from "./ui/label";
export * from "./ui/checkbox";
export * from "./ui/switch";
export * from "./ui/textarea";
export * from "./ui/radio-group";
export * from "./ui/select";
export * from "./ui/dialog";
export * from "./ui/tooltip";
export * from "./ui/number-input";
export * from "./ui/separator";

// 浮層（Popover／DropdownMenu 自缺件表畢業，ADR-0011 批次收錄）
export * from "./ui/popover";
export * from "./ui/dropdown-menu";
export * from "./ui/collapsible";
export * from "./ui/confirm-dialog";

// 指令面板——cmdk 相依被隔離守衛關在 command.tsx 一個檔案裡
export * from "./ui/command";
export * from "./ui/command-palette";

// 應用外殼（ADR-0011，評估中）：純呈現、不綁路由與資料
export * from "./ui/sidebar";
export * from "./ui/sidebar-nav";
export * from "./ui/app-shell";

// 頁面骨架（ADR-0008 解鎖：PageHeader 被重複手排八次，走解鎖條件進元件章）
export * from "./ui/page-header";

// 選擇
export * from "./ui/seg-group";
export * from "./ui/chips";
export * from "./ui/date-range";

// 資料呈現
export * from "./ui/table";
export * from "./ui/data-table";
export * from "./ui/tab-pills";
export * from "./ui/delta";
export * from "./ui/empty-state";
export * from "./ui/stepper";

// 回饋（Toast 的全站規則見文件〈Toast 操作回饋〉）
export * from "./ui/toast";

// 引導
export * from "./ui/coachmark";

// 特殊介面：時間軸與節點畫布
export * from "./ui/gantt";
// @xyflow/react 的薄封裝——相依被隔離守衛關在那一個檔案裡
export * from "./ui/graph-canvas";

// 載入中（骨架屏；三種載入手段的分工見文件〈載入中〉）
export * from "./ui/skeleton";

// 文件示意積木（寫文件用，不是產品元件）
export * from "./ui/mockup";

// 圖表：後台閱讀型（八種圖＋圖例＋色票工具，見文件〈Charts 圖表〉的邊界）
export * from "./charts/base";
export * from "./charts/bar-chart";
export * from "./charts/pareto";
export * from "./charts/stacked-bar";
export * from "./charts/trend-chart";
export * from "./charts/bullet";
export * from "./charts/scatter";
export * from "./charts/heatmap";
export * from "./charts/line-chart";
export * from "./charts/legend";

// 表單：欄位包裝（Label＋aria 連動＋錯誤態）
export * from "./form/form-field";

// 表單：唯讀逐欄編輯系統
export * from "./form/editable-field";
export * from "./form/change-summary";
export * from "./form/use-record-diff";

// 通用工具（隨元件庫一起發佈）
export * from "./lib/utils";
export * from "./lib/use-sort";
export * from "./lib/use-dialog-state";
export * from "./lib/nav";
export * from "./lib/use-table-url-state";
export * from "./lib/csv";
export * from "./lib/download";
export * from "./lib/forms/diff";
