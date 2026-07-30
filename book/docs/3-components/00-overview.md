---
title: 元件總覽
---

# 元件總覽

每個元件一頁，格式固定：**用途 → 何時不要用 → 狀態 → 無障礙 → 活範例 → 取用**。

「何時不要用」是刻意放在第二段的。設計系統失敗最常見的原因不是元件不夠多，
是元件被用在不對的地方——然後大家開始 fork，然後就沒有系統了。

## 收錄範圍

| 類 | 元件 |
| --- | --- |
| 基礎 | Button、Badge、Card、Callout |
| 表單 | Input、NumberInput、Label、Checkbox、Select、SegGroup、Chips |
| 浮層 | Tooltip、Dialog |
| 資料 | Table、DataTable、TabPills、Delta、EmptyState、Stepper |
| 進階表單 | EditableField、ChangeSummary |
| 引導 | Coachmark |
| 文件用 | Placeholder / Spotlight / MockScreenFrame |

## 不收什麼

- **完整的圖表庫**——[圖表](/components/charts)的**規範已經定稿**
  （八種後台閱讀型的零相依 SVG 圖：邊界、資料形狀、參數、無障礙義務），
  但參考實作還沒進 registry，所以這一版仍只提供[圖表色票 token](/foundations/color)。
  規範本身刻意不做縮放、刷選、圖內鑽取，資料點也只撐到百位數——
  需要分析型互動請直接用成熟圖表庫，不要改造那一組。
- **ErrorBoundary、Layout、Sidebar**——這些是應用外殼的職責，不是設計語言。
- **任何綁定特定業務流程的複合畫面**——它們在原專案裡是對的，抄到別的產業就是錯的。

## 共同約定

1. **`className` 一律可覆寫**，內部用 `cn()` 合併，後者勝出。
2. **不吞事件**——所有原生 props 透傳。
3. **不自帶資料抓取**——元件只接受 props，狀態由宿主決定。
4. **文案可覆寫**——多字串元件（DataTable、Coachmark、EditableField）都吃 `labels` prop。
5. **不依賴任何應用層概念**——由[守衛測試](/governance/drift-guards)強制。
