# 取用指南（給其他專案）

這個 repo 是**設計方向的正本**。其他專案不在自己的 repo 裡重新發明按鈕、表格與確認流程，
而是從這裡取用。這份文件是「怎麼取用、什麼不能改」的一頁式契約；
完整說明在文件站 <https://kielchang.github.io/dooping-design-book/>。

給 AI agent：接手一個要遵照本設計語言的專案時，先讀完這頁，再讀文件站對應章節。
**不要憑印象重寫元件**——元件已經存在，用下面的指令裝進來。

## 三層，相依強度刻意遞減

| 層 | 內容 | 取用方式 | 改動權 |
| --- | --- | --- | --- |
| `packages/tokens` | 設計 token（語意色、間距、字級、陰影、動態） | `npm install @dooping/tokens` | **不可改語意，只可改值** |
| `packages/react` | React 參考實作（32 個 registry 項目） | `npx shadcn add <URL>` | 複製後就是你的，隨便改 |
| `book/docs`（模式與頁面章） | 操作模式（問題→做法→取捨→反例）＋五種頁型的組成規範 | 讀懂，用你的技術棧實作 | 不含程式碼 |

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

### 宿主前置條件：樣式基座（preflight）

元件的 utility class 只宣告 border-width；「`border-style: solid`、`border-width: 0`、
預設邊框色」由 Tailwind preflight 提供。**宿主沒有這層基座時元件不會報錯，
只會安靜地變形**：邊框整批消失（只有寬度沒有樣式）、裸按鈕露出瀏覽器原生
灰底凸框、表格吃到宿主的格線。看到這三種症狀，先查基座，不是查元件。

- **標準 Tailwind／shadcn 專案**：`shadcn init` 標配 `@tailwind base`，天然滿足。
  建議再加一條（shadcn 慣例，把「不帶色的 border」接到 token）：

  ```css
  @layer base {
    * { border-color: hsl(var(--border)); }
  }
  ```

- **把元件嵌進有自己 CSS 的既有站台**（後台框架、文件站、CMS——關掉 preflight
  的宿主）：不要全站開 preflight（會打爆站台既有樣式），改在元件所在的 scope 內
  鋪等價基座——本 repo 的文件站就是這種宿主，作法照抄
  [`book/src/css/demo-base.css`](book/src/css/demo-base.css)。
  注意 **portal 內容**（Dialog／Select／Tooltip／資料表篩選面板）掛在 `body` 直下，
  逃出容器子樹，scope 必須一併涵蓋。取捨與驗收方式見
  [ADR-0009](docs/adr/0009-demo-host-baseline-contract.md)。

## 取 token

```bash
npm install @dooping/tokens
```

這是**唯一建議的硬相依**。四個進入點，挑你的宿主吃得下的用：

```css title="純 CSS（任何宿主）"
@import "@dooping/tokens/tokens.css";

.my-alert {
  background: hsl(var(--danger) / 0.1);
  border: 1px solid hsl(var(--danger) / 0.35);
  color: hsl(var(--danger));
}
```

```js title="tailwind.config.js"
module.exports = {
  presets: [require("@dooping/tokens/tailwind-preset")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

```ts title="JS API（Canvas 圖表、伺服器端 PDF、Figma plugin…）"
import { semanticColors, chartColors, TOKENS_VERSION } from "@dooping/tokens";

chartColors("dark");   // 8 色色盲友善色票
semanticColors();      // 35 個語意色（HSL 三元組）
```

第四個是 `@dooping/tokens/tokens.json`（來源正本，給非 JS 工具鏈讀）。

`tokens.css` 是純 CSS 變數、不含任何 Tailwind 指令，所以不用 Tailwind 也能用。
深色模式 `.dark` class 與 `[data-theme="dark"]` 屬性兩種鉤子都內建。

要改 token 值請改 `packages/tokens/src/tokens.json`，**不要手改 `dist/` 或 `src/tokens.data.ts`**——那是產物。

## 不可改的契約

複製走的元件原始碼是你的，隨便改。但下面這幾條一改，跨專案的一致性就沒了：

1. **語意色的名稱與意義。** `--danger` 就是危險、`--success` 就是良好。
   換品牌色請改 token 的**值**，不要改名字，也不要拿 `--warning` 去表示別的東西。
2. **琥珀色是「已改動未送出」的保留色**，不作他用。見 [ADR-0002](docs/adr/0002-amber-reserved-for-dirty-state.md)。
3. **深色模式鉤子**掛在 `document.documentElement`，`.dark` class 與 `[data-theme="dark"]` 屬性擇一即可（兩種都內建支援）。
   掛在 wrapper 上會讓 Dialog / Select / Tooltip 這類 portal 浮層抓不到。
4. **不要靠顏色單獨傳達語意。** 狀態要同時有文字或圖示——見[無障礙原則](book/docs/6-accessibility/01-principles.mdx)。

## 相容性與版本

**以 `main` 為參照。** `dev` 是開發中的分支，不要拿它當來源。

兩層的版本模型不同，因為相依模型不同：

| 層 | 怎麼鎖 | 怎麼知道自己落後了 |
| --- | --- | --- |
| token | `"@dooping/tokens": "^0.1.0"` | `npm outdated @dooping/tokens` |
| 元件 | **鎖不了，也不需要**——複製走就是你的程式碼 | 比對戳記（見下） |

元件複製進來時會帶著**規範版號**戳記（與 GitHub 上的 `vX.Y.Z` tag 同一個號碼）。
要知道自己抄的是哪一版、線上又是哪一版：

```bash
# 線上最新
curl -s https://kielchang.github.io/dooping-design-book/r/index.json | jq -r .version

# 你抄走那一版：看安裝當下的 registry JSON，或比對上游 CHANGELOG
```

**兩層的配對也查得到。** 每一版規範恰好宣告一個 tokens 版，
`/r/index.json` 的 `tokensVersion` 就是配對正本：

```bash
npm ls @dooping/tokens; curl -s https://kielchang.github.io/dooping-design-book/r/index.json | jq -r .tokensVersion
```

兩個數字相等＝配對正確；本地落後＝該升級 token；
線上比 npm 能裝到的還新＝上游合併了但還沒發佈（等一下，或提醒維護者）。
配對模型的完整定義見上游文件站「治理 → 版本策略」。

### 怎麼知道有新版

- **推播（建議）**：repo 頁 Watch → Custom → **Releases**。每次進版自動發 Release，
  **notes 就是 CHANGELOG 那一則全文**——通知本身回答三問，不用點連結。
  RSS：`https://github.com/kielchang/dooping-design-book/releases.atom`
- **拉式**：`gh release list -R kielchang/dooping-design-book`，
  或比對線上 `/r/index.json` 的 `version` 與你抄走那份的戳記

純文件進版不打 tag、也不發 Release——**安靜就是「不需要動作」的訊號**。

收到訊號後的判斷流程（讀「我需要做什麼」→ 大中小判準 → 台帳逐列評估 →
配對自查）、每一層的更新程序、以及開發中怎麼跟上游維持節奏，正本在
上游文件站「治理 → [跟上新版](book/docs/7-governance/06-staying-current.mdx)」。

### 0.x 期間的穩定性聲明

現在是 `0.x`，依 SemVer 慣例**任何版本都可能 breaking**。實務上：

- **語意色的名稱**已經穩定，可以放心依賴（改名一律 major，且會先標記棄用）
- 色值、間距、元件 API 在 0.x 期間仍可能調整
- 等第一個專案完整導入過一輪、暴露出命名與缺漏問題並修正後，才會切 1.0.0

變更一律記在 [CHANGELOG](https://github.com/kielchang/dooping-design-book/blob/main/CHANGELOG.md)。
每則都回答「改了什麼／你要做什麼／為什麼改」，不需要調整時會明說。

## 想把東西加回這個 repo

三條收錄原則，全過才收：

1. **去領域化** — 拿掉原始產業脈絡還成立嗎？由 `tests/de-domain.test.ts` 自動把關，零容忍。
2. **通用性** — 換一個後台系統會用到嗎？
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
