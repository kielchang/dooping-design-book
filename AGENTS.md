# 取用指南（給其他專案）

這個 repo 是**設計方向的正本**。其他專案不在自己的 repo 裡重新發明按鈕、表格與確認流程，
而是從這裡取用。這份文件是「怎麼取用、什麼不能改」的一頁式契約；
完整說明在文件站 <https://kielchang.github.io/dooping-design-book/>。

給 AI agent：接手一個要遵照本設計語言的專案時，先讀完這頁，再讀文件站對應章節。
**不要憑印象重寫元件**——元件已經存在，用下面的指令裝進來。

## 三層，相依強度刻意遞減

| 層 | 內容 | 取用方式 | 改動權 |
| --- | --- | --- | --- |
| `packages/tokens` | 設計 token（語意色、間距、字級、陰影、動態） | 產物複製／未來 npm | **不可改語意，只可改值** |
| `packages/react` | React 參考實作（29 個 registry 項目） | `npx shadcn add <URL>` | 複製後就是你的，隨便改 |
| `book/docs/4-patterns` | 操作模式（問題→做法→取捨→反例） | 讀懂，用你的技術棧實作 | 不含程式碼 |

理由見 [ADR-0004](docs/adr/0004-registry-over-npm-package.md)（元件一定會被改，所以不發套件）
與 [ADR-0005](docs/adr/0005-tokens-are-the-only-hard-dependency.md)（token 幾乎不會被改，所以它才是契約）。

## 取元件：shadcn registry

```bash
npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/data-table.json
```

相依會自動一起裝——`data-table` 會帶上 `table` / `input` / `button` / `select` / `tooltip` / `utils`。
全部可用項目列在 <https://kielchang.github.io/dooping-design-book/r/index.json>，
單品 URL 一律是 `/r/<name>.json`。

**前置條件**：專案要有 `components.json` 與 `@/*` 路徑別名。沒有的話先 `npx shadcn@latest init`。

**落點是固定的**，不要改：

```
src/
├── components/dooping/    ← 元件（.tsx）
└── lib/dooping/           ← 工具（utils、use-sort、csv、download、forms-diff）
```

放在 `dooping/` 子目錄是為了讓「哪些是設計中心來的」一眼可辨，
之後上游修 bug 時你才找得到要同步哪幾個檔案。

## 取 token

⚠️ **`@dooping/tokens` 尚未發佈到 npm registry**（`npm install @dooping/tokens` 目前會 404）。
發佈流水線已經備妥（`.github/workflows/publish-tokens.yml`，走 npm trusted publishing／OIDC，
repo 裡不存長期 token）；文件站與 `packages/tokens/README.md` 寫的 npm 安裝方式是發佈後的目標狀態。

在發佈之前，可行的做法是把產物複製進你的專案：

```bash
git clone https://github.com/kielchang/dooping-design-book.git
cd dooping-design-book && npm ci && npm run build:tokens
# 產物：packages/tokens/dist/tokens.css（純 CSS 變數）
#       packages/tokens/tailwind-preset.cjs（Tailwind 專案用）
```

```css title="你的全域 CSS"
@import "./tokens.css";

.my-alert {
  background: hsl(var(--danger) / 0.1);
  border: 1px solid hsl(var(--danger) / 0.35);
  color: hsl(var(--danger));
}
```

`tokens.css` 是純 CSS 變數，不含 Tailwind 指令，任何宿主都吃得下。
token 的來源正本是 `packages/tokens/src/tokens.json`，**不要手改 `dist/` 或 `src/tokens.data.ts`**。

## 不可改的契約

複製走的元件原始碼是你的，隨便改。但下面這幾條一改，跨專案的一致性就沒了：

1. **語意色的名稱與意義。** `--danger` 就是危險、`--success` 就是良好。
   換品牌色請改 token 的**值**，不要改名字，也不要拿 `--warning` 去表示別的東西。
2. **琥珀色是「已改動未送出」的保留色**，不作他用。見 [ADR-0002](docs/adr/0002-amber-reserved-for-dirty-state.md)。
3. **深色模式鉤子**掛在 `document.documentElement`，`.dark` class 與 `[data-theme="dark"]` 屬性擇一即可（兩種都內建支援）。
   掛在 wrapper 上會讓 Dialog / Select / Tooltip 這類 portal 浮層抓不到。
4. **不要靠顏色單獨傳達語意。** 狀態要同時有文字或圖示——見[無障礙原則](book/docs/5-accessibility/01-principles.mdx)。

## 想把東西加回這個 repo

三條收錄原則，全過才收：

1. **去領域化** — 拿掉原始產業脈絡還成立嗎？由 `tests/de-domain.test.ts` 自動把關，零容忍。
2. **通用性** — CRM、庫存、工單系統會用到嗎？
3. **三次法則** — 實際用過三次以上且穩定才收。投機性抽象不收。

送出前本機必須全綠：

```bash
npm run build:tokens   # 其他步驟的前提
npm run typecheck
npm test               # 3 支守衛：元件庫邊界、token 一致性、去領域化詞彙
npm run build:registry # 元件改了就要重新產生 registry JSON 並一起提交
```

`npm run build:registry` 的產物 `registry/*.json` 是**進版控的**。
改了 `packages/react/src` 卻沒重跑，線上 registry 就會跟原始碼對不起來。

## 入口

- 📘 文件站 <https://kielchang.github.io/dooping-design-book/>
- 🧩 Storybook <https://kielchang.github.io/dooping-design-book/storybook/>
- 📦 Registry 索引 <https://kielchang.github.io/dooping-design-book/r/index.json>
- 🧭 決策紀錄 [`docs/adr/`](docs/adr/README.md) — 「為什麼是這樣」都寫在這裡
