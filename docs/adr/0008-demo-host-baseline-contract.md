# ADR-0008：元件的樣式基座是宿主契約——文件站以 scoped preflight 供給，並以渲染守衛驗收

- **狀態**：已採用
- **日期**：2026-08

## 背景

文件站的活範例把**真元件**直接渲染進 Docusaurus 頁面（webpack alias 指向
`packages/react/src`）。v0.10.0 後回報：資料表頁與步驟指示頁出現規範外的外框。
追查結果是**兩個症狀、同一個缺口**：

1. **不該有的框冒出來**——Infima（Docusaurus 底層樣式）的裸元素選擇器
   `table td, table th { border: 1px solid … }`、`table { display: block }` 沒有
   任何 scope，直接命中範例裡的真 `<table>`；瀏覽器對裸 `<button>` 的原生外觀
   （2px outset ＋ 灰底）也原封不動漏出來，因為 Infima 根本沒有 reset 過 `button`。
2. **該有的框消失**——元件的 `border-b`、`border-2` 這類 utility **只宣告
   border-width**；`border-style: solid`、`border-width: 0`、預設邊框色是
   Tailwind preflight 提供的隱含契約。文件站刻意關掉 preflight
   （`book/tailwind.config.js`，理由正當：全站 reset 會打爆站台 chrome），
   卻沒有在別處補上這份契約——於是步驟圓圈的 2px 圈線、表格的列底線、
   卡片的外框，在文件站整批**安靜地**畫不出來。

兩個根因從文件站第一個 commit 就存在。v0.10.0 的「文件庫＝第一個驗收宿主」
把 Infima 的顏色變數橋接到 token（例如 `--ifm-table-border-color`），讓污染的
格線變成 token 色、看起來更像刻意設計——**橋接顏色不等於提供基座**。

同一時間，沒有任何一道防線看得見這件事：既有守衛全是靜態的（token 數值、
原始碼字串），截圖驗證方法論只有文件沒有實作、而且對象是 Storybook——
Storybook 的管線（`@tailwind base` ＋ `* { border-color }`）本來就是對的。
「元件假設的樣式前提」與「宿主實際提供的 reset」是同一份事實的兩個所在，
依治理章的判準本該有一支守衛，但「樣式前提」這一層從來沒被列進判準表。

## 選項

| 選項 | 說明 |
| --- | --- |
| A. iframe 隔離（每個範例一個獨立 document） | 隔離最徹底，但失去 SSR、頁內選字與搜尋、深淺色同步要另接，每頁數十個 iframe 的成本不成比例 |
| B. Shadow DOM 包住範例 | 樣式真隔離，但 Docusaurus 的 MDX 管線不支援，token 變數與 portal 浮層都要另開通道 |
| C. 全站開 preflight | 契約直接成立，但第二套 reset 會打爆 Infima 的站台 chrome——「preflight: false」本來就是刻意決定 |
| D. 只橋接顏色變數 | v0.10.0 已實測：能對色，不能補 border-style、不能擋 UA 按鈕外觀——不足 |
| E. **Scoped preflight**：把 preflight 逐條移植到範例的 scope 內，配 Infima 反制 | 契約在範例內完整成立，站台 chrome 一根汗毛都不動；代價是移植檔要跟著 Tailwind 升版同步——交給守衛盯 |

## 決定

**採 E，並把這件事定成通則：元件的樣式基座是宿主契約。**
任何要渲染這套元件的宿主，要嘛有 Tailwind preflight（標準 shadcn 專案的預設），
要嘛在元件所在的 scope 內提供等價基座。文件站的實作：

- `book/src/css/demo-base.css`——preflight 逐條移植，兩個 scope 並列：
  `.demo-body :where(…)`（範例容器）與 `body > :where(:not(#__docusaurus)) :where(…)`
  （portal 內容：Dialog／Select／Tooltip／資料表篩選面板都掛在 body 直下，
  **逃出範例容器的子樹**，漏掉它們就是漏掉一半）。全部規則用 `:where()` 壓在
  (0,1,0) 以下：蓋得過 Infima 與 UA，又讓元件 utilities 靠「較晚載入」獲勝。
- Infima 的表格污染用**容器級 CSS 變數覆蓋**解（`--ifm-table-*` 歸零）——
  變數靠繼承生效、不吃特異度，不會誤傷元件自己的底色與 padding。
- 驗收雙守衛：
  - `tests/host-baseline.test.ts`（靜態）——移植檔與 node_modules 的 preflight
    **逐條對應**，Tailwind 升版改了 preflight 就紅；同時鎖 kit.css 的引入順序
    （基座必須在 `@tailwind utilities` 之前，同特異度靠順序分勝負）。
  - `scripts/verify-book-host.mjs`（渲染，`npm run verify:book`）——Playwright
    對建置產物逐頁驗 **computed style**：儲存格無格線、列底線 1px solid 且
    顏色等於 token 有效值、按鈕無 UA 外觀、portal 面板有框、深色模式重驗。
    這是全流水線第一道「看得見畫出來的結果」的檢查，接進 ci.yml 與 deploy.yml。

## 理由

1. **「宿主提供基座」比「元件自帶完整宣告」正確。** 把 `border-style` 寫進每個
   元件的 class 可以治標，但那等於放棄 Tailwind 生態的共同契約——取用端從
   shadcn 生態複製任何第三方元件都會再踩一次。契約應該定義在宿主層，一次成立。
2. **scope 化是既有決定的延伸，不是推翻。**「preflight: false 保護站台 chrome」
   仍然成立；本 ADR 只是補上它欠的另一半——關掉全站 reset 的人，有責任在
   元件的地盤把 reset 鋪回來。
3. **守衛必須渲染。** 這次的缺口在 cascade 的交互作用（特異度、載入順序、
   UA 預設、變數繼承），靜態掃描原則上看不見。方法論照治理章「截圖驗證」：
   全部 DOM query 不用座標、期望值來自 token 經預設主題解析的**有效值**、
   非同步（hydration、深色切換）驗到相符為止。兩支守衛都做過反向驗證：
   拔掉基座，渲染守衛在修復前的建置上抓出全部三類症狀；改壞移植檔一條宣告，
   靜態守衛指名那一條。

## 影響

- 範例容器內**只放元件，不放散文**——`a`／`ol`／`ul` 在基座下會被 reset 成
  元件語境（連結繼承文字色、清單無縮排）。散文請寫在 `<Demo>` 外。
- Tailwind 升版時 `host-baseline` 會紅：照紅燈訊息重新移植 demo-base.css，
  這是設計好的維護點，不是誤報。
- 取用端的前置條件寫進 AGENTS.md「宿主前置條件」：標準 Tailwind／shadcn
  專案天然滿足；把元件嵌進自帶 CSS 的既有站台（後台框架、文件站、CMS）時，
  照 demo-base.css 的作法鋪 scoped 基座，**portal 內容一併涵蓋**。
- 已知限制：portal scope 的前綴特異度是 (0,0,1)，輸給 `table td` 這類
  (0,0,2) 的裸元素組合——目前 portal 內容沒有表格，若未來有，要再墊一層。
  Demo 外裸用的 Callout 只補了 `border-style`（以 `[role="note"]`／`[role="alert"]`
  為鉤子），其散文 children 保留站台排版，是刻意取捨。
- 文件站的角色從「肉眼確認」升級為「被驗收的宿主」：預覽站仍供人工確認
  響應式與觸控，但基座正確性從此不靠人眼。
