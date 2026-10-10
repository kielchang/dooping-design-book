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

乾淨 clone 之後不先跑 `build:tokens`，`npm test`、Storybook、文件站**三者都會失敗**。
`.claude/hooks/session-start.sh` 會自動處理（含 `book/` 的安裝），手動操作時要自己記得。

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
npm run verify:consumer    # 套用驗收：repo 外的乾淨 Vite＋v4 專案用 tarball＋真的 shadcn CLI 裝起、建置、量顏色（約 2 分鐘，要網路）
npm run release:gate -- release   # 發版閘：候選版能不能發（版號、tag、CHANGELOG 標題）；bump-guard 是 dev 上的版號守衛
BOOK_BASE_URL=/dooping-design-book/preview/ npm run build:book   # onBrokenLinks: throw
```

改過 stories 或元件行為，CI 會在 Storybook 建置後自動跑上面兩支守衛；
規則分工與 play function 慣例見 `packages/react/README.md`「Story 撰寫規則」。

## 色彩：值是**生成**的，不要手改

`packages/tokens/src/tokens.json` 裡的主題色、`-subtle` 淡底、`chart-*` 都由
`packages/tokens/scripts/generate-theme.mjs` 以**目標對比／目標感知量反解**產生，
而不是挑好再量。要改就改生成器的參數再重跑 `npm run build:theme`。

`scripts/verify-color.mjs` 是閘門，也可以單獨跑來看完整報告。
新增守衛時**一定要反向驗證**：暫時把值改回壞的，確認那條真的會紅，不是空轉。

門檻的優先序是寫死的：**無障礙門檻（WCAG 對比、色覺 ΔE00）不得為了美感放寬**；
擠不下去時放寬的是美感約束（明度帶、chroma 上下限、色相間距）。

## 版號

三個地方要同步：根 `package.json`、`packages/react/package.json`、
`packages/react/src/version.ts`，改完重跑 `npm run build:registry`。
`@dooping/tokens` 的版號**只在 token 內容變更時**動。
判準與「什麼不該發版」見 `book/docs/7-governance/01-versioning.mdx`；
每次進版都要在 `CHANGELOG.md` 寫一句對取用端的意義，並回答改了什麼／我需要做什麼（格式見 CHANGELOG 檔頭）。

CI 有守衛（`scripts/release-gate.mjs`）：dev 上元件或 token 相對 `main` 有變但版號沒動就紅；
候選版（staging）還要版號遞增、tag 未被佔、CHANGELOG「未發佈」已改名。

**版本狀態速查**：`npm run status` 印出 main（核准版）／staging（候選版）／dev（工作中）三欄、
token 配對與下一步。取用端只看 main（Releases／`/r/index.json`／npm），他們的正本在文件站「治理 → 跟上新版」。

## 去領域化是硬閘門

`tests/de-domain.test.ts` 掃全庫 176 個領域詞，零容忍。寫範例時用中性詞
（項目／單位／類別／批次／紀錄），示範資料**只能**來自
`packages/react/src/demo/sample-data.ts`，stories 與文件不得自行宣告業務資料集。
詞表與掃描範圍見 `tests/de-domain.test.ts`。

常見誤觸：一些中性詞含有領域詞的子字串（例如「部門」在「全部門檻」裡）。
換句話說就好，不要為了通過而在詞表開白名單。

## repo 只放規則、架構描述與使用說明

- **不得在 repo 開 ADR、提案或計畫檔**（`docs/adr/`、`docs/rfc/`、`proposals/` 之類）。
  公開檔只寫規則與做法，不寫決策過程，也不引用 repo 外查不到的編號——`tests/self-contained-refs.test.ts` 擋。
- **規則＝守衛＋文件頁那一句。** 同一件事第二次需要人記得時，寫成守衛：說明寫在檔頭，失敗訊息用
  `tests/lib/guard.ts` 的 `because()` 帶上規則所在；**反向驗證過才算規則**。沒有守衛的規則在文件上標「人工：由誰、何時」或「建議」。
- **守衛紅了就修程式**，不放寬守衛、不開白名單。標「保留」「不得」的規則要改，先開 RFC issue。
- 元件、template、token 註解裡殘留的舊編號，隨該檔下一次實質變更改寫成規則句——只改註解也會動 registry 指紋，不為它單獨發版。
- 守衛的完整台帳在 `ARCHITECTURE.md`「守衛」節，`tests/guard-ledger.test.ts` 會核對它沒漏。
- 註解或文件用「規則正本」「流程正本」指向某檔的某個標題時，檔案與標題都要存在；內容搬家或標題改名要一起改指向——`tests/rule-pointers.test.ts` 擋。
- 取用端的回饋與提案走 GitHub（正本：文件站〈回饋與 RFC 流程〉）。
- 維護者的私人工作流程放 `CLAUDE.local.md`（已 gitignore，不進 repo）。

## Git

- 正式 remote：`https://github.com/kielchang/dooping-design-book.git`
  （**兩個 o**。repo 曾叫 `doping-design-book`，舊名靠 GitHub 轉址還能推，
  但會噴 `This repository moved`；看到就把 origin 換成上面那個。）
- **三段式發布**：功能分支 → PR 到 `dev`（`pr-verify` 綠了才合併）→ PR `dev → staging`（候選版，跑套用驗收）→ PR `staging → main`（勾完核准清單、填上核准版本＝核准；之後再推 commit 要重新驗收）。
  流程正本：`ARCHITECTURE.md`「分支與部署拓樸」。`main` 與 `staging` 受 ruleset 保護，不要直接 push。
- **進 dev 也走 PR，不要本機合併後直接推 dev**：本機（Windows）綠不代表 CI（Linux）綠。
  人工規則——dev 的 ruleset 目前不強制 PR。
- `dev` push 部署預覽站 `/preview/`；`staging` push 部署候選版 `/staging/`；`main` push 部署正式站根目錄並蓋 tag。
  每段各自一個 concurrency group；三段共用 gh-pages 分支，由 `scripts/deploy-gh-pages.sh` 的 `STAGE_DIRS` 劃界。
- 預覽站：<https://kielchang.github.io/dooping-design-book/preview/>；候選版：<https://kielchang.github.io/dooping-design-book/staging/>

## 截圖驗證的方法論

要用截圖確認顏色時，**一定要比對 token 的期望值**，不要只用肉眼看。
三條規則（細節在 `packages/react/README.md`「Story 撰寫規則」）：

1. `--virtual-time-budget` 走虛擬時間、**不等非同步工作**，單次截圖會拍到
   主題還沒套用的畫面。要驗到相符為止（重試），加長等待無效。
2. 不要取樣固定座標——版面一動就失效。掃描整張圖找期望色。
3. alpha 合成會被瀏覽器**抖動**（同一塊色在相鄰像素間差 1），
   逐字比對 hex 會假性失敗。容差 ±2。
