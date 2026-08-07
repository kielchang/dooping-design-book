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
     │ build:tokens＝build-css.mjs
     ▼
packages/tokens/dist/tokens.css ＋ src/tokens.data.ts   （dist/ 不進版控）
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
- **四個進入點**：`tokens.css`（純 CSS 變數）、`tailwind-preset.cjs`（覆蓋而非 extend，
  清空 Tailwind 預設色盤——這是取用端的第一道漂移防線）、TS API、`tokens.json` 正本。
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
   取用端就裝不到——症狀是「畫布整個沒樣式」。`@xyflow/react` 是唯一的大型外部相依，
   由 `tests/boundary.test.ts` 隔離在一個檔案裡。
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
`npm test` 的七支：

| 檔案 | 守住的兩個所在 | 壞掉時的症狀 |
| --- | --- | --- |
| `tests/boundary.test.ts` | 元件庫 ↔ 應用層／第三方相依 | `@xyflow/react` 滲出隔離檔，取用端被迫吞大相依 |
| `tests/tokens.test.ts` | tokens.json ↔ CSS 產物 ↔ preset ↔ 版號四處 | 淺深不成對、產物過期、版號漂移 |
| `tests/color.test.ts` | 色彩生成參數 ↔ 無障礙門檻 | 對比不足、色覺混淆（接 `verify:color`） |
| `tests/de-domain.test.ts` | 全庫文字 ↔ 176 詞黑名單 | 領域語彙被複製到取用端 |
| `tests/demo-data.test.ts` | 示範資料 ↔ 唯一來源 `demo/sample-data.ts`（含 `demo/generate.ts`） | 各頁自己長出資料集，新領域從入口溜進來 |
| `tests/doc-hooks.test.ts` | 文件引用的 story id ↔ stories 推導的合法集合 | 嵌入變空白 iframe、深連結 404，安靜無紅燈 |
| `tests/host-baseline.test.ts` | Tailwind preflight ↔ `book/src/css/demo-base.css` | 文件站的活範例安靜變形 |

build 之後另有三支（CI 跑，本機可單獨跑）：`verify:storybook`（axe＋play 全量）、
`verify:visual`（截圖掃 token 期望值，不是肉眼看）、`verify:book`（文件站渲染層驗
computed style，[ADR-0010](https://kielchang.github.io/dooping-design-book/adr/demo-host-baseline-contract/)）。

新增守衛的鐵律（`CLAUDE.md`）：**一定要反向驗證**——暫時把值改壞，確認那條真的會紅。

## CI 閘門

`.github/workflows/ci.yml`（push `dev` 與 PR → `main`）依序：

1. typecheck → `npm test`（上表七支）
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
