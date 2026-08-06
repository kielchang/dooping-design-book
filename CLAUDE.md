# 在這個 repo 上工作

> 這份是給**在這個 repo 裡開發**的人與 agent。
> `AGENTS.md` 是另一件事——那是寫給**取用端**（其他專案怎麼抄元件、怎麼裝 token）。

## 先做這一步，否則什麼都跑不起來

```bash
npm install
npm run build:tokens
```

`dist/` 在 `.gitignore` 裡，但 `packages/tokens/dist/tokens.css` 是**三個地方的硬相依**：

| 誰 | 怎麼用 |
| --- | --- |
| `tests/tokens.test.ts` | 直接讀檔比對 |
| `.storybook/main.ts` | alias 到它 |
| `book/src/css/kit.css` | `@import` 它 |

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
BOOK_BASE_URL=/dooping-design-book/preview/ npm run build:book   # onBrokenLinks: throw
```

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

## 去領域化是硬閘門

`tests/de-domain.test.ts` 掃全庫 176 個領域詞，零容忍。寫範例時用中性詞
（項目／單位／類別／批次／紀錄），示範資料**只能**來自
`packages/react/src/demo/sample-data.ts`，stories 與文件不得自行宣告業務資料集。
理由見 `docs/adr/0006-de-domainization-as-hard-gate.md`。

常見誤觸：一些中性詞含有領域詞的子字串（例如「部門」在「全部門檻」裡）。
換句話說就好，不要為了通過而在詞表開白名單。

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
