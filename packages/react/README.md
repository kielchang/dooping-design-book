# @doping/react

Doping 設計語言的 React 參考實作。

## 這個套件**不發佈到 npm**

散佈方式是 shadcn registry —— 把原始碼複製進你的專案：

```bash
npx shadcn@latest add https://kielchang.github.io/doping-design-book/r/data-table.json
```

相依會自動一起裝（DataTable 會帶上 table / input / button / select / tooltip / utils…）。

理由見 [ADR-0004](../../docs/adr/0004-registry-over-npm-package.md)：
元件一定會被改，複製走之後它就是你的程式碼，沒有升級壓力、沒有 fork 的必要。

這個 workspace 套件存在的目的是：Storybook、文件站活範例、守衛測試的單一來源。

## 邊界鐵律

元件**只能**依賴：

- 相對路徑的同伴模組
- `@doping/tokens`
- 白名單外部套件：`react` / `react-dom` / `@radix-ui/*` / `lucide-react` / `clsx` /
  `tailwind-merge` / `class-variance-authority`

**不得**依賴任何應用層概念（狀態管理、路由、API client、業務型別、領域計算）。
由 `tests/boundary.test.ts` 自動守衛。

新增元件時：加進 `src/index.ts` barrel（barrel 覆蓋率也在測試裡）。

## 目錄

```
src/
├── ui/          基礎元件（含 *.stories.tsx）
├── form/        唯讀逐欄編輯系統
├── lib/         通用工具（cn、useSort、csv、download、forms/diff）
├── demo/        示範資料（**不出貨**，僅供 stories 與文件站）
└── index.ts     公開匯出＝元件庫範圍清單
```

## 文案在地化

多字串元件吃 `labels` prop，可整包覆寫：

```tsx
<DataTable labels={{ search: "Search…", exportCsv: "Export CSV" }} … />
```

同樣支援的還有 `Coachmark`、`EditableField`、`ChangeSummary`。
