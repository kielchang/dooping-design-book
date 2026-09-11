# 系統架構

這份文件是**地圖，不是手冊**：給想理解這套系統怎麼組起來、並想對它提出建議的人與 AI。
每一節講「結構＋為什麼＋正本在哪個檔案」，不複寫任何操作規則——
會隨流程調整而改的字句只能活在一個檔案裡，這裡一律用連結指過去。

先分流：

- **取用端**（要在自己的專案引用這套設計）：改讀
  [AGENTS.md](https://kielchang.github.io/dooping-design-book/AGENTS.md)（一頁式取用契約）。
- **要在本 repo 動手開發**：讀 repo 根的 `CLAUDE.md`（環境啟動、驗證指令、實測踩過的坑）。
- **想提出建議、看懂全貌**：往下讀，最後一節是提案的門口。

## 全景資料流

```
packages/tokens/src/tokens.json ◄──(build:theme＝generate-theme.mjs 以目標對比反解生成，不是手挑)
     │
     │ build:tokens＝build-css.mjs ＋ build-tailwind-v4.mjs
     ▼
packages/tokens/dist/tokens.css ＋ dist/tailwind.css ＋ src/tokens.data.ts   （dist/ 不進版控）
     ├── tests/tokens.test.ts 直接讀檔比對
     ├── .storybook/main.ts alias 到它
     └── book/src/css/kit.css @import 它        ◄── 三處硬相依：乾淨 clone 必先 build:tokens
                                                     （.claude/hooks/session-start.sh 會自動處理）

packages/react/src ──(build:registry＝build-registry.mjs)──► registry/*.json（進版控）
                                                                   │ CI 複製
                                                                   ▼
                                                    站上 /r/index.json 與 /r/<name>.json

docs/adr/*.md ──────────(book/scripts/sync-adr.mjs，build 前)──────► book/docs/8-adr/（gitignored）
AGENTS.md、ARCHITECTURE.md ──(book/scripts/sync-root-docs.mjs)──► book/static/、book/docs/7-governance/
```

## 三層結構與改動權

| 層 | 散佈方式 | 改動權 | 為什麼 |
| --- | --- | --- | --- |
| `packages/tokens` | 發佈到 npm（`@dooping/tokens`） | 不可改語意，只可改值 | token 幾乎不會被改，所以它才是契約（[ADR-0005](https://kielchang.github.io/dooping-design-book/adr/tokens-are-the-only-hard-dependency/)） |
| `packages/react` | shadcn registry 複製原始碼，**刻意不發 npm** | 複製走就是取用端的，隨便改 | 元件一定會被改，所以不發套件（[ADR-0004](https://kielchang.github.io/dooping-design-book/adr/registry-over-npm-package/)） |
| `book/docs` 的模式與頁面章 | 讀懂，用自己的技術棧實作 | 不含程式碼 | 操作模式是框架無關的，最值錢也最不該綁實作 |

## Token 管線

- **值是生成的，不要手改。** `packages/tokens/src/tokens.json` 裡的主題色、`-subtle` 淡底、
  `chart-*` 由 `packages/tokens/scripts/generate-theme.mjs` 以目標對比／目標感知量**反解**產生。
  要改就改生成器參數再重跑，不是挑好看的顏色填進去。
- **閘門**：`scripts/verify-color.mjs`（六主題 × 兩模式的對比／色覺／狀態層門檻）。
  門檻優先序寫死：無障礙門檻不得為美感放寬；擠不下去時放寬的是美感約束。
- **五個進入點**：`tokens.css`（純 CSS 變數，值的唯一所在）、`tailwind.css`（Tailwind v4 的
  `@theme inline reference` 名稱對映，`build-tailwind-v4.mjs` 產生）、`tailwind-preset.cjs`（v3，
  覆蓋而非 extend）、TS API、`tokens.json` 正本。v4 與 v3 兩個出口都清空 Tailwind 預設色盤——
  這是取用端的第一道漂移防線；兩者的鍵集由 `tests/tokens.test.ts` 與 tokens.json 三方逐鍵比對。
- **發佈**：唯一路徑是 `tokens-v*` tag → `.github/workflows/publish-tokens.yml`
  （npm Trusted Publishing／OIDC，repo 不存長期 token）。兩道配對硬閘：
  tag 名必須等於 token 版號、tag 必須指向 `main` 上的 commit。
  token 版號**只在 token 內容變更時**動。

## Registry 管線

`scripts/build-registry.mjs` 把 `packages/react/src` 轉成 shadcn registry JSON：

1. **walk 跳過**：`index.ts`、`version.ts`、`demo/`、`*.stories.tsx`；`charts/` 整組打成單一
   多檔 item（八種圖共用底座，拆開會裝到一半）。
2. **import 改寫**：相對路徑 → `@/components/dooping/*`、`@/lib/dooping/*`（落點固定，
   之後同步 diff 才乾淨）。
3. **相依推導**：外部套件走白名單（`NPM_DEPS`）；不在白名單的不會寫進 registry，
   取用端就裝不到——症狀是「畫布整個沒樣式」。大型外部相依有兩個：
   `@xyflow/react`（graph-canvas）與 `cmdk`（command），都由 `tests/boundary.test.ts`
   隔離在各自的一個檔案裡。`lib/` 檔案漏登錄 `LIB_MODULES` 會在產生端直接 throw。
4. **token 相依注入**：每個 item 硬加 `@dooping/tokens@^x`（版號取自
   `packages/react/package.json` 的宣告，不寫第二份真相）。這是 v0.6.0 事故的修正：
   當年 item 沒宣告 token，元件裝進去吃不到變數，**畫面壞掉且不報錯**，漂移了四個版本。
5. **版本戳記與換行正規化**：每個 item 帶規範版號；輸出一律 LF——
   Windows 的 CRLF 會被逐字寫進 JSON，散佈產物就被污染了。

產物 `registry/*.json` **進版控**，CI 有「重跑後 `git diff --exit-code`」的同步閘。
改了 `packages/react/src` 就要重跑 `npm run build:registry` 並一起提交。

## 守衛：同一份事實存在兩個地方，就需要一支

判準與可抄清單的正本在
[治理 → 漂移防護](https://kielchang.github.io/dooping-design-book/governance/drift-guards/)。
這張表是守衛台帳：`npm test` 的每一支測試與 build 後的每一支腳本都要列在這裡，
`tests/guard-ledger.test.ts` 盯著它不漏列（新增守衛沒登記就紅）。理由寫在各守衛的檔頭，失敗訊息會帶規則所在的文件頁。

`npm test`：

| 檔案 | 管什麼 | 不管什麼 |
| --- | --- | --- |
| `tests/boundary.test.ts` | 元件庫只准依賴白名單外部套件；`@xyflow/react`／`cmdk` 只能在指定檔案 import；每個發佈檔都進 barrel；`pages/` 只放組合 story | 相依的版本範圍（package.json） |
| `tests/tokens.test.ts` | tokens.json ↔ CSS 產物 ↔ v3 preset ↔ v4 入口 ↔ 版號四處；淺深成對；預設色盤不外洩；registry 的 tokens 配對 | 色值本身合不合格（`verify:color`） |
| `tests/tokens-v3.test.ts` | 用 Tailwind v3＋preset 真的編一次，語意色與非色彩 token 都產得出來 | 元件有沒有用到 |
| `tests/tokens-v4.test.ts` | 用 Tailwind v4 真的編 `dist/tailwind.css`：色鍵、透明度修飾、預設色盤清空、深色 variant、基座 | 同上 |
| `tests/color.test.ts` | 把 `verify:color` 接進 `npm test`：無不合格項、六主題都在、brand 對比、聚焦環中性 | 門檻本身（在 `scripts/verify-color.mjs`） |
| `tests/cn.test.ts` | `cn()` 的 tailwind-merge 分群：字級與文字色、漸層與底色互不吃 | 元件 class 的內容 |
| `tests/tailwind-compat.test.ts` | 元件只用 v3／v4 語意相同的 utility：禁兩版值不同的裸 utility、v4 限定語法、只靠 hover 揭露 | 兩版共有且同值的 class |
| `tests/de-domain.test.ts` | 全庫文字 ↔ 176 詞領域黑名單，零容忍 | 英文變體以外的拼法（詞表列什麼擋什麼） |
| `tests/demo-data.test.ts` | 示範資料只能來自 `demo/sample-data.ts`（含 `demo/generate.ts`） | 資料值本身 |
| `tests/doc-hooks.test.ts` | 文件的 `<StoryFrame／StoryLink id>` 都對到真的 story | story 內容是否正確 |
| `tests/story-sort.test.ts` | `.storybook/preview.tsx` 的 storySort 涵蓋每個分類且字串逐字吻合 | story 的順序是否合理 |
| `tests/play-conventions.test.ts` | stories 不用 `userEvent.type／clear／paste`（改 `setInputValue`） | play 的斷言內容 |
| `tests/nav.test.ts` | `isNavActive` 的多層 fallback | 側欄的渲染 |
| `tests/table-url-state.test.ts` | 表格狀態 ↔ 網址的 codec、prefix 隔離讀與寫、與 DataTableState 的型別相容 | adapter 的路由整合（宿主） |
| `tests/host-baseline.test.ts` | Tailwind v4 preflight＋tokens 基座 ↔ `book/src/css/demo-base.css`；kit.css 的 import 順序與 layer | 渲染結果（`verify:book`） |
| `tests/host-install-set.test.ts` | 頁面章的 `shadcn add` 指令 ⊆ 宿主安裝集；檔案真的在宿主裡；宿主的 tokens 配對與 workspace 連結 | 宿主頁面的行為（`verify:host`） |
| `tests/registry-content.test.ts` | registry 檔案內容不以註解開頭（shadcn CLI 會刪） | 內容正確性 |
| `tests/registry-fingerprint.test.ts` | `/r/index.json` 的逐 item 指紋＝第二份獨立實作；base 與說明不進指紋；相依變了 closureHash 跟著變 | 指紋的用途（`registry-changes`） |
| `tests/registry-changes.test.ts` | 兩版 registry 的四類異動分類、Markdown 輸出、上一個 tag 照數字大小挑 | 真實歷史（CI 在 dev 預演） |
| `tests/dooping-check.test.ts` | 取用端工具的內容指紋與產生器一致；路徑對應；已是最新／上游有更新／本地改過三態 | PMIS 或 lock 的到期 |
| `tests/changelog.test.ts` | CHANGELOG 每節前是「空行、---、空行」；目前版號的 Release notes 只含自己這一節 | 內容是否回答三問 |
| `tests/guard-ledger.test.ts` | 這張表列出每一支 `tests/*.test.ts` 與 `scripts/verify-*.mjs`、`host-sync.mjs` | 表格描述是否準確 |

build 之後（CI 跑，本機可單獨跑）：

| 指令 | 管什麼 | 不管什麼 |
| --- | --- | --- |
| `npm run verify:color`（`scripts/verify-color.mjs`） | 六主題×兩模式的 WCAG 對比、色覺 ΔE00、狀態層三階、圖表色距離；主題數與圖表色數下限 | 元件有沒有真的用上這些色（`verify:visual`） |
| `npm run verify:storybook`（`scripts/verify-storybook.mjs`） | 全部 story 的 axe＋play 全數執行；強制色彩下焦點看得見 | 顏色對比、頁面級規則 |
| `npm run verify:visual`（`scripts/verify-visual.mjs`） | 六主題×兩模式的截圖掃 token 期望色，其他主題的 brand 不滲入 | 版面位移、像素基準 |
| `npm run verify:book`（`scripts/verify-book-host.mjs`） | 文件站每頁的 computed style 符合 token 有效值（邊框、底色、表格、步驟、portal） | Storybook |
| `npm run verify:host`（`scripts/verify-host.mjs`） | 內部試裝宿主：主題套上、color-mix、頁面級 axe、強制色彩、行動版外殼、凍結欄 | 元件單元行為（story） |
| `npm run host:check`（`scripts/host-sync.mjs --check`） | registry ↔ 宿主檔案逐位元組相同；宿主宣告的 npm 相依；`dooping.lock.json` 與 registry 對得上 | 宿主自己的頁面程式 |

新增守衛的鐵律（`CLAUDE.md`）：**一定要反向驗證**——暫時把值改壞，確認那條真的會紅。

## CI 閘門

`.github/workflows/ci.yml`（push `dev` 與 PR → `main`）依序：

1. typecheck → `npm test`（上表全部）
2. **registry 同步**：重跑 `build:registry` 後 `git diff --exit-code -- registry/`
3. **token 版號閘**：`tokens.json` 內容變了（`del(.meta)` 比對）但版號沒動 → 擋
4. **規範版號閘**：監看清單**逐字等於**「會進 registry 的集合」
   （`packages/react/src` 排除 demo/、stories、index.ts、version.ts，
   加上 tokens 來源與 `templates/`）有變但規範版號沒動 → 擋。
   **純文件變更不觸發**——文件修訂不必進版。
5. **npm 漂移檢查**：宣告的 token 版落後 npm latest → 只警告不擋（發佈順序不該死結）
6. build 後守衛（渲染／a11y／視覺）→ push `dev` 才部署 preview

## 版號模型

- **規範版正本**＝根 `package.json` 的 `version`，四處同步：根、
  `packages/react/package.json`、`packages/react/src/version.ts`、registry 戳記（重跑產生），
  由守衛綁住。
- **配對樞紐**＝`packages/react/package.json` 對 `@dooping/tokens` 的宣告那一行，
  曝露為 `/r/index.json` 的 `tokensVersion`。每版規範恰好配對一個 token 版；
  多版規範對同一 token 版合法，反過來非法。
- **事件鏈**：dev 上 bump＋寫 CHANGELOG（提議）→ 合併進 `main`（確認）→
  `deploy.yml` 自動蓋 `vX.Y.Z` tag ＋ 抽 CHANGELOG 該則全文發 GitHub Release。
  純文件進版不打 tag、不發 Release——**安靜就是「不需要動作」的訊號**。
- **儀表板**：`npm run status`（`scripts/version-status.mjs`）一次印出已發佈／工作中／
  配對／領先 commit。判準正本在
  [治理 → 版本策略](https://kielchang.github.io/dooping-design-book/governance/versioning/)。

## 文件站建置

- `book/` **刻意不是 workspace 成員**：Docusaurus 的相依樹太大，分開安裝避免版本互相牽制。
- prebuild 鏈：`build-css.mjs`（token 產物）→ `sync-adr.mjs`（ADR 副本）→
  `sync-root-docs.mjs`（AGENTS.md／本檔的副本）。
- `kitPipeline` plugin（`book/docusaurus.config.ts`）：webpack alias 直指 `packages/*/src`，
  文件站的活範例渲染**真元件**，不是截圖或複本——元件改了，文件頁自動跟上。
- `onBrokenLinks: "throw"`：站內死鏈直接紅 build。本檔正本因此**只用絕對 URL**，
  相對連結在同步後的副本位置會解析失敗——這是刻意留著的守衛。
- `BOOK_BASE_URL` 注入雙站：正式 `/dooping-design-book/`、預覽 `/dooping-design-book/preview/`
  （預覽站掛不可關的警示橫幅，取用一律以正式站為準）。

## 分支與部署拓樸

```
dev  ──push──► ci.yml     ──► gh-pages 的 preview/   （預覽站，隨時被覆蓋，不得參照）
 │
 └─PR─► main ──► deploy.yml ──► gh-pages 根          （正式站＋tag＋Release）
```

兩支 workflow 共用 concurrency group `gh-pages-write`，寫入序列化——
曾發生 PR 驗證擠掉 dev 部署、預覽站安靜停在上一版的實際事故，
細節寫在 `.github/workflows/ci.yml` 的註解。部署腳本 `scripts/deploy-gh-pages.sh`
用 git worktree 手寫：正式站與預覽站共用同一分支、誰都不能清掉對方。

## 如何提出建議

三條收錄原則（去領域化／通用性／三次法則）與門口的正本在 `CONTRIBUTING.md` 與
[治理 → 回饋與 RFC 流程](https://kielchang.github.io/dooping-design-book/governance/rfc/)，這裡只導流：

| 要提的是 | 門口 |
| --- | --- |
| Bug（行為與規範不符） | [bug.yml](https://github.com/kielchang/dooping-design-book/issues/new?template=bug.yml) |
| 小調整（文案、對比、一個 prop） | 直接開 PR |
| 新元件／新 token／改語意 | [rfc.yml](https://github.com/kielchang/dooping-design-book/issues/new?template=rfc.yml)（五題逐欄） |
| 頁面章缺件表的項目 | [missing-piece.yml](https://github.com/kielchang/dooping-design-book/issues/new?template=missing-piece.yml)（一則＝三次法則的一次證據） |

- **想推翻某條規則**：先讀 [ADR](https://kielchang.github.io/dooping-design-book/adr/)——
  「為什麼當初這樣決定」都在那裡；何時該寫新 ADR 的三判準在 `docs/adr/README.md`。
- **下游唯讀鐵律**：未合併的提案不得在下游先行實作
  （[治理 → 符合性台帳](https://kielchang.github.io/dooping-design-book/governance/conformance-ledger/)）。
- **改動前的驗證指令與環境啟動**：`CLAUDE.md`。
