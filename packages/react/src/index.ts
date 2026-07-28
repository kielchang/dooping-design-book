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
export * from "./ui/select";
export * from "./ui/dialog";
export * from "./ui/tooltip";
export * from "./ui/number-input";

// 選擇
export * from "./ui/seg-group";
export * from "./ui/chips";

// 資料呈現
export * from "./ui/table";
export * from "./ui/data-table";
export * from "./ui/tab-pills";
export * from "./ui/delta";
export * from "./ui/empty-state";
export * from "./ui/stepper";

// 引導
export * from "./ui/coachmark";

// 文件示意積木（寫文件用，不是產品元件）
export * from "./ui/mockup";

// 表單：唯讀逐欄編輯系統
export * from "./form/editable-field";
export * from "./form/change-summary";
export * from "./form/use-record-diff";

// 通用工具（隨元件庫一起出貨）
export * from "./lib/utils";
export * from "./lib/use-sort";
export * from "./lib/csv";
export * from "./lib/download";
export * from "./lib/forms/diff";
