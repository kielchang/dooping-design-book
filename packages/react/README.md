# @dooping/react

Dooping 設計語言的 React 參考實作。

## 這個套件**不發佈到 npm**

散佈方式是 shadcn registry —— 把原始碼複製進你的專案：

```bash
npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/data-table.json
```

相依會自動一起裝（DataTable 會帶上 table / input / button / select / tooltip / utils…）。

理由：元件一定會被改，複製走之後它就是你的程式碼，沒有升級壓力、沒有 fork 的必要。

這個 workspace 套件存在的目的是：Storybook、文件站活範例、守衛測試的單一來源。

## 邊界鐵律

元件**只能**依賴：

- 相對路徑的同伴模組
- `@dooping/tokens`
- 白名單外部套件：`react` / `react-dom` / `@radix-ui/*` / `lucide-react` / `clsx` /
  `tailwind-merge` / `class-variance-authority`
- 大型外部套件各自隔離在單一檔案：`@xyflow/react`（`ui/graph-canvas.tsx`）、`cmdk`（`ui/command.tsx`）

**不得**依賴任何應用層概念（狀態管理、路由、API client、業務型別、領域計算）。
由 `tests/boundary.test.ts` 自動守衛。

新增元件時：加進 `src/index.ts` barrel（barrel 覆蓋率也在測試裡）。

## 目錄

```
src/
├── ui/          元件（含 *.stories.tsx）
├── charts/      八種 SVG 圖表（registry 打成單一 item）
├── form/        唯讀逐欄編輯系統
├── lib/         通用工具（cn、useSort、useDialogState、useTableUrlState、nav、csv、download、forms/diff）
├── pages/       五種頁型的組合 story（只放 stories，不發 registry）
├── stress/      壓力測試 story
├── demo/        示範資料（**不發佈**，僅供 stories、文件站與試裝宿主）；
│                play.ts（play function 的輸入工具）、generate-stress.ts（壓力測試資料）
├── index.ts     公開匯出＝元件庫範圍清單
└── version.ts   規範版號（與根 package.json 同步）
```

## 文案在地化

多字串元件吃 `labels` prop，可整包覆寫：

```tsx
<DataTable labels={{ search: "Search…", exportCsv: "Export CSV" }} … />
```

同樣支援的還有 `Coachmark`、`EditableField`、`ChangeSummary`。

## Storybook 設定

本 repo 的 `.storybook/` 照以下規則設定。

- **全域樣式狀態（主題、文字方向、密度）一律掛在 `documentElement`**，主題同時掛 `dark` class 與 `data-theme`
  （token 支援的兩種宿主鉤子，見[基礎 → 主題](https://kielchang.github.io/dooping-design-book/foundations/theming/)）。
  不要包一層 wrapper div 就當作完成：Dialog、Select、Tooltip 用 portal 掛到 `document.body`，拿不到 wrapper 的 class。
- **decorator 只放主題、背景、內距這類純呈現的東西。** 不要塞應用層的狀態容器、路由或示範資料；
  需要狀態的 story，把狀態宣告在該支 story 的 `render` 裡（見下方「互動 playground」）。
- **`viteFinal` 必須手動補**（Storybook 不沿用 app 的 `vite.config`）：
  1. alias `@dooping/react` 直接指到 `packages/react/src`；子路徑 alias（`@dooping/tokens/tailwind.css`）要排在套件 alias 之前——
     Vite 的字串 alias 以前綴比對、先到先得。
  2. Tailwind v4 走 `@tailwindcss/vite` plugin，設定寫在 CSS，不需要 `tailwind.config`。
  3. `base: "./"`，才能發佈在靜態主機的子路徑。
- **`.storybook/styles.css` 用與取用端同一套四行 import，並明示掃描範圍**；Storybook 照
  [AGENTS.md](https://kielchang.github.io/dooping-design-book/AGENTS.md) 的取用契約接，不走捷徑：

  ```css
  @import "tailwindcss" source(none);
  @import "tw-animate-css";
  @import "@dooping/tokens/tokens.css";
  @import "@dooping/tokens/tailwind.css";

  @source "../packages/react/src";
  @source ".";
  ```

- **`storySort.order` 必須涵蓋所有頂層分類**；新增頂層分類時同時更新 `order`。`order` 沒列到的分類會排到最後，順序由檔案系統決定。
  （守衛：`tests/story-sort.test.ts`）
- **title 三段式 `元件/分類/名稱`，斜線前後不加空格**；中文名在前、英文元件名在後（`元件/資料/資料表 DataTable`）。
  不要混用 `元件 / 分類`：Storybook 以字串分組、storySort 逐字比對，多一個空格就長出重複的樹枝，而且不會報錯。

## Story 撰寫規則

### 每個元件要有的 story

| 類型 | 回答什麼 | 一定要有嗎 |
| --- | --- | --- |
| **典型用法** | 這個元件正常長什麼樣 | 必要 |
| **狀態並列** | 它的每一種狀態長什麼樣、彼此差在哪 | 必要 |
| **互動 playground** | 換各種參數會怎樣 | 建議 |
| **壓力測試** | 塞極端值會不會壞 | 見下方「壓力測試 story」 |

### 狀態並列

- 同一個元件的所有狀態放在**一支** story 裡垂直排列，每一列標上狀態名（例：`四態並列`）。不要一個狀態一支 story。
- 驗收時把這一支切到深色模式再看一次、灰階列印一次；三種模式都能分辨每一種狀態才算過。

### 互動 playground：用中文 arg

- 三層：**中文 args 型別 → `argTypes` 指定控制項 → `render` 映射回真實 props**。
- 對外展示用的元件（DataTable、EditableField）都配一支中文 playground。只有兩種變體的元件用並列展示，不做 playground。
- `render` 是函式不是元件，**不得在裡面直接呼叫 hook**。在 `render` 內宣告內部元件，並把會影響結構的 arg 放進 `key` 強制 remount
  （否則改 args 時內部 state 不會重置）；或改用 `render: function Render() { … }` 具名函式元件。同一個 repo 只選一種寫法。

```tsx
render: (a) => {
  const Demo = () => {
    const [v, setV] = useState("0");
    return <TabPills tabs={makeTabs(a.分頁數)} value={v} onChange={setV} />;
  };
  return <Demo key={a.分頁數} />;
},
```

### 命名

- story 的 title、export 名與 storySort 分類**不翻譯**：它們是 `tests/doc-hooks.test.ts`、`tests/story-sort.test.ts`、
  `scripts/verify-storybook.mjs` 的鍵。元件內建文案的預設值同理——英文宿主走 `labels` prop 覆寫，不動預設值。
- 命名一律照下表，不要混用 `按鈕_互動` 和 `互動_按鈕`：

| 場景 | 命名 | 例 |
| --- | --- | --- |
| 一般 story | 中文語意 | `完整功能`、`三種空狀態` |
| 互動 playground | `互動` 或 `⟨元件⟩_互動` | `互動`、`按鈕_互動` |
| 狀態並列 | `⟨N⟩態並列` | `三態並列`、`四態並列` |
| 元件名需要對照 | 中文在前、英文在後 | `資料表 DataTable` |

### story 是規格的證據

- 文件頁寫下的每一條行為規範，都要有一支 story 對得上（例：文件寫「鎖定態仍然可以聚焦」，就要有 story 能當場用 Tab 鍵驗證）。
  不要寫「元件會處理這個情況」卻沒有任何 story 展示它。

### 截圖驗證一定要比對期望值

- 截圖之後**取樣像素、與 token 的期望值逐一比對**，程式判定相符才算通過；不要只把截圖拿來目視。
- **驗到相符為止**：截圖 → 掃描畫面找期望色 → 不符就重截。加長等待無效——無頭瀏覽器的 `--virtual-time-budget` 走虛擬時間，不等非同步工作。
- **掃描整張圖找期望色**，不要用固定的取樣座標。
- alpha 合成會被瀏覽器抖動，比對容差 ±2。
- 量測對象要是實際會被畫出來的那個值。

### play function：有行為規範就要有行為驗證

- 文件頁寫了行為規範的元件，要有一支 play function 把那條規範變成可執行的斷言
  （例：對話框寫了「Esc 關閉、焦點回到觸發鈕」，play 就按一次 Esc 驗一次）。

```tsx
import { within, expect, userEvent, waitFor } from "@storybook/test";

export const 對話框: Story = {
  render: () => ( … ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "作廢這筆" }));
    // …斷言
  },
};
```

- portal 元件（Dialog、Select、Toast、篩選面板）的斷言要查 `canvasElement.ownerDocument.body`。
- 查詢一律走 `getByRole` 帶可及名稱。
- play 結尾不留開著的浮層或改掉的狀態——後面的視覺掃描拍的是 play 跑完的畫面。
- **對輸入框設值一律用 `demo/play.ts` 的 `setInputValue`**，不用 `userEvent.type`／`clear`／`paste`。它一次設整段值；
  要驗中間狀態就分次呼叫、每次給完整目標值。鍵盤與點擊照常用 `userEvent.keyboard`／`click`。（守衛：`tests/play-conventions.test.ts`）
- **會依 media query 切換行為的元件，story 要把 query 釘死**：桌面版釘 `(max-width: 0px)`（永不成立＝強制桌面），
  行動版釘 `(min-width: 0px)`（恆成立＝強制行動）。

### 兩道 Storybook 守衛（CI 自動跑）

| 守衛 | 指令 | 管什麼 | 不管什麼 |
| --- | --- | --- | --- |
| 無障礙行為 | `npm run verify:storybook` | 全部 story 的 axe 掃描（role、名稱、巢狀互動…）＋ play function 全數執行成功 | 顏色對比（`verify:color` 是唯一顏色權威）；`region` 等頁面級規則（story 是片段） |
| 視覺回歸 | `npm run verify:visual` | 全部主題 × 兩模式 × 哨兵 story：截圖掃全圖，驗「期望色存在＋其他主題的外殼色不存在」 | 版面位移（沒有基準圖比對） |

- 兩支都吃建好的 Storybook 產物：本機 `npm run build-storybook` 後直接跑，CI 在建置步驟之後自動接。
- **combobox 的可及名稱不能取自值文字**（值會變，名稱不會）：`SelectTrigger` 一定要用 `<Label htmlFor>` 接 `id`，或給 `aria-label`。

## 壓力測試 story

- 壓力測試獨立成 Storybook 的頂層分類 `壓力測試/`，每一類極端值一支 story（`src/stress/`）。不要混進元件的一般 story。
- 七類極端值：

| 類別 | 測什麼 | 該看什麼 |
| --- | --- | --- |
| **超長文字值** | 內容超出欄寬 | 截斷還是換行？截斷的話有沒有 Tooltip？換行的話同一列其他欄位有沒有跟著變高？ |
| **超長標籤** | 欄位／分頁／徽章的標籤過長 | 標籤可以換行，控制項不該變形 |
| **超大數值** | 13 位數、超長小數 | 千分位還在嗎？不該自動縮小字級；容器是捲動還是撐破？ |
| **超多選項** | 多選 24 項、單選 6 個長標籤 | 換行後高度變化能否接受？換行的分段選擇是不是該改用下拉？ |
| **超多欄位** | 表格 10 欄以上 | 凍結首欄還有效嗎？水平捲動時黏性表頭有沒有透出後面的內容？ |
| **超多筆** | 42 筆（跨越分頁門檻）、200 筆 | 分頁器出現時機、合計是否算全部、捲動是否卡頓 |
| **多類別圖形** | 20 個類別、12 段的堆疊 | 標籤會不會糊成一團？超過色票數量怎麼處理？最窄的那段還點得到嗎？ |

- 每一類都要測兩個極端：「很多」與「沒有」（0 筆、0 個選項、1 個類別且全部為 0）。
- 撞出問題時先問「這是要修元件，還是要寫一條規範？」有些極端值的正確答案是「不要那樣用」——寫進該元件文件的〈何時不要用〉。
- 什麼時候跑：

| 時機 | 做什麼 |
| --- | --- |
| 新增元件時 | 至少補一支「最長／最多」與一支「空」 |
| 改版面相關的樣式時 | 把該元件的壓力測試全部看一遍 |
| 驗收前 | 切深色模式 ＋ 灰階列印各看一次 |

- 壓力測試 story 不需要斷言、不需要自動化；資料用 `src/demo/generate-stress.ts` 產生。
