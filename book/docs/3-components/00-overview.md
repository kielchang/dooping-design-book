---
title: 元件總覽
---

# 元件總覽

每個元件一頁，格式固定：**用途 → 何時不要用 → 狀態 → 無障礙 → 活範例 → 取用**。

## 收錄範圍

| 類 | 元件 |
| --- | --- |
| 基礎 | Button、Badge、Card、Callout、Separator |
| 表單 | Input、Textarea、NumberInput、Label、Checkbox、RadioGroup、Switch、Select、SegGroup、Chips、DateRange、FormField／FieldError |
| 浮層 | Tooltip、Dialog、Popover、DropdownMenu、ConfirmDialog、Command、Toast |
| 結構 | Collapsible |
| 外殼 | AppShell、Sidebar、SidebarNav、AppMenubar（多應用版型）、CommandPalette、PageHeader／BackLink／Breadcrumb |
| 資料 | Table、DataTable、TabPills、Delta、EmptyState、Skeleton、Stepper |
| 進階表單 | EditableField、ChangeSummary |
| 引導 | Coachmark |
| 圖表 | BarChart、Pareto、StackedBar、TrendChart、Bullet、Scatter、Heatmap、LineChart、Legend |
| 特殊介面 | Gantt（時間軸）、GraphCanvas（節點畫布） |
| 文件用 | Placeholder / Spotlight / MockScreenFrame |

## 不收什麼

- **完整的圖表庫**——[圖表](/components/charts)只收「後台閱讀型」的八種零相依圖，
  不做縮放、刷選、圖內鑽取，資料點只撐到百位數。
  需要分析型互動請直接用成熟圖表庫，不要改造這一組。
- **ErrorBoundary、路由、資料抓取**——外殼元件（AppShell／Sidebar）收的是
  **純呈現**的殼；路由、權限、資料抓取是宿主的職責，
  一律以 `renderLink`／props 注入。導覽層的**規範**正本在
  [後台系統的資訊架構](/patterns/back-office-ia)。
- **任何綁定特定業務流程的複合畫面**——去領域化後仍成立的**頁型組成規範**（清單頁、明細頁、表單頁…）收在[頁面章](/pages)，
  以文件與組合 story 的形式存在，不發元件。**頁首是唯一的例外**：依頁面章的解鎖條件
  （被重複手排就進元件章），以 [PageHeader](/components/page-header) 進元件章；其餘骨架只有組合 story。

## 共同約定

1. **`className` 一律可覆寫**，內部用 `cn()` 合併，後者勝出。
2. **不吞事件**——所有原生 props 透傳。
3. **不自帶資料抓取**——元件只接受 props，狀態由宿主決定。
4. **文案可覆寫**——多字串元件（DataTable、Coachmark、EditableField）都吃 `labels` prop。
5. **不依賴任何應用層概念**——由[守衛測試](/governance/drift-guards)強制。
6. **分類色與狀態語意脫鉤（雙向）**——圖表序列色只表達「這是哪一類」，
   好壞一律走 `success`／`warning`／`danger`；反過來，維度本身是狀態時必須沿用狀態色。
   判斷樹見[圖表的配色策略](/components/charts#配色策略先問資料形態再問維度語意)。
