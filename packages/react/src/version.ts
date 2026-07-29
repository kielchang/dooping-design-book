// 元件庫版號 — 與宿主應用的版號**獨立**。
//
// 元件的公開 API 或視覺／互動行為變動時 bump，與任何一個使用它的產品的發佈週期脫鉤。
// 版本策略見文件站「治理」章：token 破壞性變更＝major，元件行為變更＝minor。
export const KIT_VERSION = {
  name: "@dooping/react",
  version: "0.3.0",
} as const;
