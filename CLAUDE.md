# 在這個 repo 上工作

> 這份是給**在這個 repo 裡開發**的人與 agent。
> `AGENTS.md` 是另一件事——那是寫給**取用端**（其他專案怎麼抄元件、怎麼裝 token）。

## 先做這一步，否則什麼都跑不起來

```bash
npm install
npm run build:tokens
```

`dist/` 在 `.gitignore` 裡，但 `packages/tokens/dist/` 的兩個 CSS 產物（`tokens.css` 值、
`tailwind.css` v4 名稱對映）是**三個地方的硬相依**：

| 誰 | 怎麼用 |
| --- | --- |
| `tests/tokens.test.ts`、`tests/tokens-v4.test.ts` | 直接讀檔比對、真的用 Tailwind v4 編一次 |
| `.storybook/styles.css`（＋`main.ts` 的 alias） | `@import` 兩個產物——與取用端同一套四行 |
| `book/src/css/kit.css` | `@import` 兩個產物（v4 管線；demo-base 由 `book/scripts/port-preflight.mjs` 產生） |

所以乾淨 clone 之後不先跑 `build:tokens`，`npm test`、Storybook、文件站**三者都會失敗**。
`.claude/hooks/session-start.sh` 會自動處理，手動操作時要自己記得。

## 驗證指令（PR 前四道全過）

```bash
npm run build:tokens       # 其他步驟的前提
npm run typecheck
npm test                   # 守衛測試
npm run verify:color       # 六主題 × 兩模式的對比／色覺／狀態層門檻
```

需要時再跑：

```bash
npm run build:theme        # 重新生成主題色、淡底、圖表色票（會改寫 tokens.json）
npm run build:registry     # registry JSON — 改過元件就要重跑並提交
npm run build-storybook
npm run verify:storybook   # 無障礙行為守衛（axe＋play functions）— 需先 build-storybook
npm run verify:visual      # 視覺回歸：token 期望值掃描 — 需先 build-storybook
npm run host:sync          # 內部試裝宿主：registry → apps/host-v4，並重建它的 dooping.lock.json（改過元件或安裝集要重跑並提交）
npm run registry:changes -- --before vX.Y.Z   # 相對上一個 v* tag 動到哪些 registry item（Release notes 會附同一份）
npm run host:build && npm run verify:host   # 宿主渲染守衛：主題配色、頁面級 axe、強制色彩、行動版外殼
BOOK_BASE_URL=/dooping-design-book/preview/ npm run build:book   # onBrokenLinks: throw
```

改過 stories 或元件行為，CI 會在 Storybook 建置後自動跑上面兩支守衛；
規則分工與 play function 慣例見 `book/docs/7-governance/08-story-conventions.mdx`。

## 色彩：值是**生成**的，不要手改

`packages/tokens/src/tokens.json` 裡的主題色、`-subtle` 淡底、`chart-*` 都由
`packages/tokens/scripts/generate-theme.mjs` 以**目標對比／目標感知量反解**產生，
而不是挑好再量。要改就改生成器的參數再重跑 `npm run build:theme`。

`scripts/verify-color.mjs` 是閘門，也可以單獨跑來看完整報告。
新增守衛時**一定要反向驗證**：暫時把值改回壞的，確認那條真的會紅，不是空轉。

門檻的優先序是寫死的：**無障礙門檻（WCAG 對比、色覺 ΔE00）不得為了美感放寬**；
擠不下去時放寬的是美感約束（明度帶、chroma 上下限、色相間距）。
這條規則來自兩次實測——為了美感動門檻的結果都是品質下降。

## 版號

三個地方要同步：根 `package.json`、`packages/react/package.json`、
`packages/react/src/version.ts`，改完重跑 `npm run build:registry`。
`@dooping/tokens` 的版號**只在 token 內容變更時**動。
判準與「什麼不該發版」見 `book/docs/7-governance/01-versioning.mdx`；
每次進版都要在 `CHANGELOG.md` 回答三個問題（改了什麼／我需要做什麼／為什麼改）。

CI 有守衛：元件或 token 相對 `main` 有變但版號沒動，直接擋 PR。

**版本狀態速查**：`npm run status` 一次印出「已發佈（main）／工作中（dev）／
token 配對／領先 commit／未發佈工作項／合併後會不會蓋 tag 發 Release」。
設計端看的是 dev−main 的差距（提議中的未來）；取用端只看 main
（Releases／`/r/index.json`／npm），他們的正本在文件站「治理 → 跟上新版」。

## 去領域化是硬閘門

`tests/de-domain.test.ts` 掃全庫 176 個領域詞，零容忍。寫範例時用中性詞
（項目／單位／類別／批次／紀錄），示範資料**只能**來自
`packages/react/src/demo/sample-data.ts`，stories 與文件不得自行宣告業務資料集。
理由在 `tests/de-domain.test.ts` 的檔頭。

常見誤觸：一些中性詞含有領域詞的子字串（例如「部門」在「全部門檻」裡）。
換句話說就好，不要為了通過而在詞表開白名單。

## 計畫、規則、決定分三軌（repo 只放規則）

| 軌 | 放哪裡 | 什麼時候寫 |
| --- | --- | --- |
| 計畫 | PMIS feature＋milestone（到期日）。規格寫：問題與假設、時間上限、最小試驗、成功訊號與門檻、這次不做什麼、沒達標時的預設結局 | 要動工但還沒有證據時。到期不原地延長——要繼續就開新 feature 引用舊的；被否決的不刪 |
| 規則 | 守衛測試＋文件頁那一句。理由寫在守衛檔頭，失敗訊息用 `tests/lib/guard.ts` 的 `because()` 帶理由與規則正本 | 同一件事第二次需要人記得時。反向驗證過才算規則；沒有守衛的標「人工：由誰、何時」或「建議」 |
| 決定 | PMIS ADR（context／options／decision／consequences），標題沿用 `ADR-NNNN：…` | 做決定的當下。只有難回頭、會被質疑的決定才記；採納後要改走修訂 |

**agent 不得在 repo 開任何 ADR 或提案檔**（`docs/adr/`、`docs/rfc/`、`proposals/` 之類）。
repo 留三樣東西：規則（守衛＋文件頁那一條）、架構描述（`ARCHITECTURE.md`、`AGENTS.md`、文件站各章）、使用說明。
元件註解裡既有的 `ADR-00xx` 指向 PMIS 同號，不要改——改註解會動 registry 指紋。
守衛的完整台帳在 `ARCHITECTURE.md`「守衛」節，`tests/guard-ledger.test.ts` 會核對它沒漏。

## 換電腦接續

狀態分三層：走 git 的（本 repo，clone `dev` 後 hook 會自動 `npm install && npm run build:tokens`）、
走 PMIS 的（計畫、決定、dev log；MCP 定義在使用者層 `~/.claude.json`，連的是 pmis 專案 `.env` 的 `DATABASE_URL`）、
走 inbox 的（還沒上傳 PMIS 的記錄與研究報告，在 repo 之外的 `pmis-inbox/dooping-design-book/`，讀它的 `HANDOFF.md`）。
Claude 記憶在 `~/.claude/projects/<專案路徑 slug>/memory/`，clone 到不同路徑要把記憶檔搬到新 slug 的目錄。

## Git

- 正式 remote：`https://github.com/kielchang/dooping-design-book.git`
  （**兩個 o**。repo 曾叫 `doping-design-book`，舊名靠 GitHub 轉址還能推，
  但會噴 `This repository moved`；看到就把 origin 換成上面那個。）
- `dev` 推上去會部署預覽站到 `/preview/`；`main` 部署正式站根目錄。
  兩支 workflow 共用同一個 concurrency group，寫入會被序列化。
- 預覽站：<https://kielchang.github.io/dooping-design-book/preview/>

## 截圖驗證的方法論

要用截圖確認顏色時，**一定要比對 token 的期望值**，不要只用肉眼看。
實測過的三個坑，都寫在 `book/docs/7-governance/08-story-conventions.mdx`：

1. `--virtual-time-budget` 走虛擬時間、**不等非同步工作**，單次截圖會拍到
   主題還沒套用的畫面。要驗到相符為止（重試），加長等待無效。
2. 不要取樣固定座標——版面一動就失效。掃描整張圖找期望色。
3. alpha 合成會被瀏覽器**抖動**（同一塊色在相鄰像素間差 1），
   逐字比對 hex 會假性失敗。容差 ±2。
