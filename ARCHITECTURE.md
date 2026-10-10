# 系統架構

這份文件是**地圖**：給想理解這套系統怎麼組起來、並想對它提出建議的人與 AI。
每一節講「結構＋為什麼＋正本在哪個檔案」，不複寫操作規則——
會隨流程調整而改的字句只能活在一個檔案裡，這裡一律用連結指過去。
**例外**：「分支與部署拓樸」一節是維護者發佈流程的規則正本。

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

AGENTS.md ──(book/scripts/sync-root-docs.mjs)──► book/static/AGENTS.md
```

## 三層結構與改動權

| 層 | 散佈方式 | 改動權 | 為什麼 |
| --- | --- | --- | --- |
| `packages/tokens` | 發佈到 npm（`@dooping/tokens`） | 不可改語意，只可改值 | token 幾乎不會被改，所以它才是契約 |
| `packages/react` | shadcn registry 複製原始碼，**刻意不發 npm** | 複製走就是取用端的，隨便改 | 元件一定會被改，所以不發套件 |
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
  tag 名必須等於 token 版號、tag 必須指向 `main` 上的 commit。發佈身分只在不跑專案程式的 `publish` job（見「權限：寫入權只在部署那一步」）。
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
| `tests/csv.test.ts` | `csvEscape` 公式開頭的文字補 `'`、數字與純數字文字不補；序列化與解析往返 | 試算表軟體實際怎麼開檔、下載觸發（`saveBlob`） |
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
| `tests/dooping-check.test.ts` | 取用端工具的內容指紋與產生器一致；路徑對應；已是最新／上游有更新／本地改過三態 | lock 的到期 |
| `tests/feedback-intake.test.ts` | 取用端回饋的格式正本只在 AGENTS.md「回饋到上游」一份：送出指令是單行 `gh issue create`（`--repo` 本 repo、`[回饋]` 前綴、`--body-file`）、骨架八段依序；台帳四題各處同一說法；流程頁指向正本；別處沒有第二份 | issue 實際寫了什麼；守門人的分流節奏（人工） |
| `tests/self-contained-refs.test.ts` | 公開檔（追蹤中＋未追蹤未忽略的文字檔）不得出現 `ADR-NNNN` 決策編號；尚未清的元件／token／template 檔列在 PENDING，清單只准縮短；維護者本機若有 gitignored 的 `.private-terms`，一併掃內部詞 | git 歷史、已發佈的套件與 Release 內文、建置產物 |
| `tests/rule-pointers.test.ts` | 寫著「規則正本：」「流程正本：」的 `<路徑>「<標題>」` 都指到存在的檔與標題（標題相同，或以它開頭後接「：」「（」） | 沒有「」的指向、`because()` 的第三個參數；指向的內容是否還寫著那條規則 |
| `tests/changelog.test.ts` | CHANGELOG 每節前是「空行、---、空行」；目前版號的 Release notes 只含自己這一節（測的是 deploy 實際呼叫的 `scripts/lib/changelog.mjs`） | 內容是否寫明對你的意義與兩問 |
| `tests/deploy-gh-pages.test.ts` | 部署腳本對臨時 bare repo 實跑：根目錄部署保留 `preview/`、`staging/`；段部署只動自己的目錄；目標不在清單上就拒絕；push 被拒時重抓重套再推 | Pages 有沒有真的建置出來（部署後冒煙） |
| `tests/workflow-contract.test.ts` | `.github/rulesets/` 要求的必過檢查都對得到真的 job 與觸發事件；檢查名不重複；必過 job 不會被 `if:` 跳過（staging 一定傳 `consumer`／`deploy`）；沒有 paths 過濾；concurrency 每段一組；手動觸發有分支守門；publish-tokens 手動發佈過配對閘；部署目錄＝`STAGE_DIRS`；寫入權只在 `deploy` job（其餘唯讀、簽出不留憑證、冒煙要求部署成功、release 只認 main 上的 tag）；npm 發佈身分只在不跑專案程式的 `publish` job | GitHub 上的 ruleset 有沒有真的套用（`gh api …/rules/branches/main`） |
| `tests/release-gate.test.ts` | 發版閘每條規則各轉紅一次：版號遞增、tag 未被佔、CHANGELOG 已改名且標題對得上版號、分支只准 staging←dev／main←staging、合併後樹＝來源、核准清單勾完；抓不到 main 時 release 失敗 | git 那一層（CI 實跑）；CHANGELOG 內容是否寫明對你的意義與兩問 |
| `tests/guard-ledger.test.ts` | 這張表列出每一支 `tests/*.test.ts` 與 `scripts/verify-*.mjs`、`host-sync.mjs` | 表格描述是否準確 |

build 之後（CI 跑，本機可單獨跑）：

| 指令 | 管什麼 | 不管什麼 |
| --- | --- | --- |
| `npm run verify:color`（`scripts/verify-color.mjs`） | 六主題×兩模式的 WCAG 對比、色覺 ΔE00、狀態層三階、圖表色距離；主題數與圖表色數下限 | 元件有沒有真的用上這些色（`verify:visual`） |
| `npm run verify:storybook`（`scripts/verify-storybook.mjs`） | 全部 story 的 axe＋play 全數執行；強制色彩下焦點看得見 | 顏色對比、頁面級規則 |
| `npm run verify:visual`（`scripts/verify-visual.mjs`） | 六主題×兩模式的截圖掃 token 期望色，其他主題的 brand 不滲入 | 版面位移、像素基準 |
| `npm run verify:book`（`scripts/verify-book-host.mjs`） | 文件站每頁的 computed style 符合 token 有效值（邊框、底色、表格、步驟、portal） | Storybook |
| `npm run verify:host`（`scripts/verify-host.mjs`） | 內部試裝宿主：主題套上、color-mix、頁面級 axe、強制色彩、行動版外殼、凍結欄、多應用外殼（切應用換選單、選單鍵盤路、接真路由後選了就關） | 元件單元行為（story） |
| `npm run host:check`（`scripts/host-sync.mjs --check`） | registry ↔ 宿主檔案逐位元組相同；宿主宣告的 npm 相依；`dooping.lock.json` 與 registry 對得上 | 宿主自己的頁面程式 |
| `npm run verify:consumer`（`scripts/verify-consumer.mjs`） | 套用驗收：repo 外的乾淨 Vite＋Tailwind v4 專案（`fixtures/consumer-vite-v4`），token 用 `npm pack` 的 tarball、元件用真的 shadcn CLI 從本機 registry 裝宿主安裝集；檔案＝registry、globals.css／components.json 沒被改寫、`tsc -b`＋`vite build`、dooping-check `--strict`、三組主題×模式的 token 期望值與 portal 面板、零 console error、axe | Next.js App Router、Tailwind v3、Base UI 共存；npm 上已發佈的版本 |
| `npm run verify:deployed`（`scripts/verify-deployed.mjs`） | 部署後冒煙（對真的網址）：`deploy.json` 的 sha 對上才算上線；`/r/index.json` 版號、tokensVersion、homepage＝本段；每個 item 指紋＝repo、相依都指向本段且 200；非正式站有 noindex＋橫幅、正式站沒有；dooping-check 走 HTTP 讀得到一致的指紋 | 瀏覽器渲染（部署前的 `verify:book`／`verify:host`／`verify:consumer`） |
| `npm run release:gate`（`scripts/release-gate.mjs`） | dev push 的 bump 守衛；staging 與 PR 的發版閘（規則見 `tests/release-gate.test.ts` 那一列） | 候選版裝不裝得起來（套用驗收） |

新增守衛的鐵律（`CLAUDE.md`）：**一定要反向驗證**——暫時把值改壞，確認那條真的會紅。

## CI 閘門

三段共用 `.github/workflows/_pipeline.yml`，呼叫端各一支：`preview.yml`（push `dev`）、`pr-verify.yml`（PR → `dev`）、
`staging.yml`（push `staging`）、`deploy.yml`（push `main`，另有 `release` job 蓋 tag 發 Release）；
`pr-gate.yml` 把關開到 `staging`／`main` 的 PR；`publish-tokens.yml` 發 npm。`_pipeline.yml` 的 `build` 依序：

1. typecheck → `npm test`（上表全部）
2. **registry 同步**：重跑 `build:registry` 後 `git diff --exit-code -- registry/`
3. **版號閘**（`scripts/release-gate.mjs`）：dev 上是 bump 守衛——token 內容或「會進 registry 的集合」
   （`scripts/lib/release-watch.mjs`）有變但版號沒動 → 擋，**純文件變更不觸發**；staging 上是發版閘——版號遞增、tag 未佔、CHANGELOG 已改名
4. **npm 漂移檢查**：宣告的 token 版落後 npm latest → 只警告不擋（發佈順序不該死結）
5. 這一段自己的 registry（base＝本段網址）→ build 後守衛（渲染／a11y／視覺／宿主）→ `deploy.json` 戳記 → 交出產物

另三個 job：`deploy`（下載 `build` 的產物、執行部署腳本，唯一有寫入權）、`consumer`（套用驗收，只有 staging 傳開）
與 `smoke`（部署後冒煙，staging 與 main；`deploy` 沒成功時明確紅）。
必過檢查的名字是「呼叫端 job / `_pipeline.yml` 的 job」（例如 `staging / consumer`）；
ruleset 在 `.github/rulesets/`，`tests/workflow-contract.test.ts` 核對兩邊對得上。

## 版號模型

- **規範版正本**＝根 `package.json` 的 `version`，四處同步：根、
  `packages/react/package.json`、`packages/react/src/version.ts`、registry 戳記（重跑產生），
  由守衛綁住。
- **配對樞紐**＝`packages/react/package.json` 對 `@dooping/tokens` 的宣告那一行，
  曝露為 `/r/index.json` 的 `tokensVersion`。每版規範恰好配對一個 token 版；
  多版規範對同一 token 版合法，反過來非法。
- **事件鏈**：dev 上 bump＋寫 CHANGELOG → 候選版進 `staging` 跑套用驗收 → 核准合併進 `main` →
  `deploy.yml` 的 `release` job 蓋 `vX.Y.Z` tag、以 `scripts/lib/changelog.mjs` 抽 CHANGELOG 該則發 GitHub Release。
- **儀表板**：`npm run status`（`scripts/version-status.mjs`）印出 main／staging／dev 三欄、配對與下一步。
  流程正本在本檔「分支與部署拓樸」；版號判準（SemVer 表、配對模型）在
  [治理 → 版本策略](https://kielchang.github.io/dooping-design-book/governance/versioning/)。

## 文件站建置

- `book/` **刻意不是 workspace 成員**：Docusaurus 的相依樹太大，分開安裝避免版本互相牽制。
- prebuild 鏈：`build-css.mjs` → `build-tailwind-v4.mjs`（token 產物）→ `sync-root-docs.mjs`（AGENTS.md 的副本）。
- `kitPipeline` plugin（`book/docusaurus.config.ts`）：webpack alias 直指 `packages/*/src`，
  文件站的活範例渲染**真元件**，不是截圖或複本——元件改了，文件頁自動跟上。
- `onBrokenLinks: "throw"`：站內死鏈直接紅 build。本檔只放在 GitHub 上、不同步進文件站；
  連到文件站一律用絕對 URL。
- `BOOK_BASE_URL`／`BOOK_STAGE` 注入三站：正式 `/dooping-design-book/`、候選版 `/dooping-design-book/staging/`、
  預覽 `/dooping-design-book/preview/`。後兩者掛不可關的橫幅並加 noindex；`verify:book` 驗段標記。

## 分支與部署拓樸

```
dev ─push─► preview.yml ─► gh-pages 的 preview/        （預覽站）
 │
 └─PR（pr-gate）─► staging ─push─► staging.yml ─► gh-pages 的 staging/   （候選版＋套用驗收＋冒煙）
                      │
                      └─PR（pr-gate＋核准清單）─► main ─push─► deploy.yml ─► gh-pages 根（正式站）＋tag＋Release
```

每段各自一個 concurrency group（`pages-preview`／`pages-staging`／`pages-production`）——以前共用一組，
GitHub 一組只留一個等待中的 run，dev 連推會取消等待中的 main 部署。部署腳本 `scripts/deploy-gh-pages.sh`
用 git worktree 手寫：三段共用 gh-pages 分支，`STAGE_DIRS` 列的段目錄在根目錄部署時保留，同時推的衝突靠重抓、重套、再推。
取用端只需要知道「只參照正式站」與版號怎麼讀，見[治理 → 版本策略](https://kielchang.github.io/dooping-design-book/governance/versioning/)。

### 權限：寫入權只在部署那一步

- 呼叫端（`preview.yml`、`staging.yml`、`deploy.yml`）整份 `contents: read`，只有呼叫 `_pipeline.yml` 的 job 給 `contents: write`。
- `_pipeline.yml` 的 `build`、`consumer`、`smoke` 自己寫 `permissions: contents: read`，簽出時 `persist-credentials: false`。
  dev 合進來的程式與現抓的第三方套件都在這三個 job 裡執行，手上沒有能改正式站與 tag 的權杖。
- `deploy` 不寫 `permissions`，繼承呼叫端給的 `contents: write`；被呼叫的流程不能要求比呼叫端更多的權限，寫死會讓唯讀的 `pr-verify.yml` 起不來。
  `pr-verify.yml` 整份唯讀，也不部署。
- `deploy` 不跑 npm、npx、node，只下載 `build` 交出的產物、執行 `scripts/deploy-gh-pages.sh`。
- `deploy` 不是必過檢查，所以 `smoke` 在 `deploy` 沒成功時明確失敗，不靠 `if:` 跳過。
- `deploy.yml` 的 `release` job 有寫入權（蓋 `v*` tag、建立 Release），只承認在 `main` 歷史上的既有 tag。
- `publish-tokens.yml` 分兩個 job：`build` 唯讀、沒有 `id-token`，跑配對檢查、建置、守衛並打出 tarball；
  `publish` 才有 `id-token: write`，不簽出、不跑專案腳本，只送出那個 tarball。試跑不執行 `publish`。
- `publish` 掛 `environment: npm-publish`。人工：維護者設定一次——GitHub Settings → Environments 把它的部署規則限定在 `tokens-v*` tag，
  npm 的 trusted publisher 填上這個 environment。
- 守衛：`tests/workflow-contract.test.ts`。

### 三段的意義

| 分支 | 代表什麼 | 部署到 | 誰讓它前進 |
| --- | --- | --- | --- |
| `dev` | 最新功能開發 | `/preview/` | 功能分支開 PR 進來，PR 檢查綠了才合併；外部 PR 也開到這裡 |
| `staging` | 候選版，正在做套用驗收 | `/staging/`（registry 可試裝） | 只收 dev 的 PR |
| `main` | **最新核准版** | 正式站根目錄、`/r/`、npm、tag／Release | 只收 staging 的 PR，守門人核准後合併 |

**進版＝核准版前進一次。** 一次 staging → main 的合併就是一次進版，對應
[CHANGELOG](https://github.com/kielchang/dooping-design-book/blob/main/CHANGELOG.md) 的一則。
寫不出「取用者要做什麼」的變更，就不是一次進版，繼續留在 `dev`。

### 三個詞各一個意思

| 詞 | 意思 | 在哪一段 |
| --- | --- | --- |
| **檢查** | CI 守衛全綠：測試、渲染、無障礙、視覺、內部試裝宿主 | 每一段都跑 |
| **驗收** | 候選版真的能被其他系統套用：自動的套用驗收，加上人工的核准清單 | staging |
| **核准** | 守門人 [@kielchang](https://github.com/kielchang) 在 staging → main 的 PR 上勾完核准清單、必過檢查全綠後合併 | main |

### 流程

```
① dev 上開發：功能分支開 PR 到 dev，PR 檢查（pr-verify）綠了才合併；改到元件或 token 就依判準表 bump 版號（CI 擋漏 bump）
② 切候選版：守門人先分流新進的 `[回饋]` issue（見〈回饋與 RFC 流程〉）；
   在 dev 把 CHANGELOG「## 未發佈」改名——有 bump 寫「## vX.Y.Z · 日期」，
   版號沒動寫「## 日期（說明）」——然後開 dev → staging 的 PR
     └ pr-gate：只准 staging ← dev、版號遞增、tag 未被佔、CHANGELOG 標題對得上
③ 合併 → staging 建置、發版閘、套用驗收、部署 /staging/、部署後冒煙
④ 開 staging → main 的 PR，照 PR 模板的「核准清單」逐項驗收並打勾
     └ pr-gate：只准 main ← staging、合併後內容＝staging、核准清單勾完
⑤ 合併＝核准 → 部署正式站、冒煙、自動蓋 tag vX.Y.Z、發 GitHub Release（版號沒動就不打、不發）
```

- **套用驗收**（`npm run verify:consumer`）在 repo 外建一個乾淨的 Vite＋Tailwind v4 專案：token 用 `npm pack` 出來的套件、
  元件用真的 shadcn CLI 從候選版的 registry 裝，型別檢查、建置，再到瀏覽器量顏色——證明別的系統照
  [AGENTS.md](https://kielchang.github.io/dooping-design-book/AGENTS.md) 做真的接得上。
  還**不涵蓋** Next.js App Router、Tailwind v3 宿主、Base UI 共存。
- **驗收沒過**：修在 dev、推上去，再開一次 dev → staging 的 PR，staging 會重跑全部驗收。不在 staging 上直接改；
  版號不必再 bump，除非那個 tag 已經被佔。
- **dev 永遠是可發布的狀態**——這是「修在 dev 再送一次」成立的前提。做到一半的東西留在功能分支。
- **進 dev 也走 PR，不在本機合併後直接推。** PR 檢查（`pr-verify`）跑的是與預覽站同一套守衛、在同一種 Linux 環境，只是不部署；
  本機（尤其 Windows）綠不代表 CI 綠——真游標、焦點歸還時機、逾時這類差異只在 CI 出現。
  （人工：由合併的人遵守；dev 的 ruleset 目前不強制 PR。）
- **部署失敗的窗口**：合併進 main 但部署紅了＝main 已含內容、正式站還沒動。修好原因後重跑 deploy（手動觸發只能對 main），不是 revert。
- **強制**：main 與 staging 由 GitHub ruleset 保護（必須 PR、只允許 merge commit、必過檢查、禁止強推與刪除），來源分支由 pr-gate 擋。
  設定正本在 `.github/rulesets/`，`tests/workflow-contract.test.ts` 核對它與 workflow 對得上。

### 配對的四道保證

規範版與 tokens 版的配對（定義見[治理 → 版本策略「三層版號的對應關係（配對模型）」](https://kielchang.github.io/dooping-design-book/governance/versioning/)）由四道保證釘住：

| 保證 | 擋什麼 |
| --- | --- |
| 測試守衛（處內一致＋index 配對） | 七處版號任何一處漂移、`tokensVersion` 與宣告不符 |
| CI 兩硬閘（內容變了版號要跟） | 改了 token／元件卻忘記 bump——擋 PR |
| **發佈硬閘**（tag 名＝package.json 版本、commit 在 main 上） | 推錯 tag 發出錯的版本；對未進版的 commit 發佈 |
| 兩處軟閘（PR 與進版當下的漂移提示） | 宣告了卻忘記發佈——不擋，但一直出聲到發為止 |

### tag 與 Release：核准之後的自動蓋章

- tag 是**自動蓋章**，不是閘門——閘門是核准（流程第 ⑤ 步的合併）。日期不佔 tag 名稱，在 tag 描述與 CHANGELOG 裡。
- GitHub Release 的 notes 直接是 CHANGELOG 該則全文；版號沒動的進版不發 Release。
- **一次進版只會蓋一個 tag**：蓋 tag 讀的是合併進 main 當下根目錄 `package.json` 的 `version`，
  `dev` 上累積好幾次 bump 才送出候選版時，只有最後那個版號有 tag。CHANGELOG 照這個事實寫：**一次進版一則**，
  底下用 `###` 分工作項，不要把中間版號寫成好幾則發佈。
- **CHANGELOG 標題裡的 SHA 是選填的**：標題格式是 `## vX.Y.Z · YYYY-MM-DD`，後面可以再加 merge commit 的 short SHA，
  但它不能是改名的前置條件——改名時（開 dev → staging 的 PR 之前）那個 merge commit 還不存在。commit 記在 tag 描述裡。
- **`tokens-v*` 刻意維持人工**，它是 npm 發佈的第二道閘門。兩條對等的路：
  本機 `git tag -a tokens-v0.1.3 -m "tokens 0.1.3" && git push origin tokens-v0.1.3`（推上去即觸發 `publish-tokens.yml`）；
  或 GitHub 網頁 → Actions → **Publish tokens** → Run workflow → 取消勾選 `dry_run`。
- 自動蓋的 `v*` 不會誤觸發發佈：它不符合 `tokens-v*` 的比對模式，
  而且 GITHUB_TOKEN 建立的 ref 依 GitHub 的防遞迴機制本來就不會觸發其他 workflow。
- **不要為了驗證發佈管線而發版**：沒有內容變更的版本會稀釋「token 幾乎不會被改，所以它才是契約」這個主張。
  要驗證管線請用 `--dry-run`。

## 如何提出建議

三條收錄原則（去領域化／通用性／三次法則）、入口與分流的正本在
[治理 → 回饋與 RFC 流程](https://kielchang.github.io/dooping-design-book/governance/rfc/)，這裡只導流：

- **取用端的 AI agent**：照 [AGENTS.md「回饋到上游」](https://kielchang.github.io/dooping-design-book/AGENTS.md)開標題 `[回饋]` 的 GitHub issue。
- **人**：GitHub 表單或 PR，門口列在 [CONTRIBUTING.md](https://github.com/kielchang/dooping-design-book/blob/main/CONTRIBUTING.md)。
- **安全問題**：照 [SECURITY.md](https://github.com/kielchang/dooping-design-book/blob/main/SECURITY.md) 私密回報，不開 issue。
- **想推翻某條規則**：開 RFC issue。規則寫在守衛與文件頁那一句；本 repo 不放決策紀錄。
- **下游唯讀鐵律**：先在宿主做、台帳記自製，同時回饋；三次法則由上游數
  （[治理 → 符合性台帳](https://kielchang.github.io/dooping-design-book/governance/conformance-ledger/)）。
- **改動前的驗證指令與環境啟動**：`CLAUDE.md`。
