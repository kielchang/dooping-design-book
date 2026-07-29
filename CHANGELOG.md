# CHANGELOG

這份設計規範每次「進版」的紀錄。進版＝`dev` 併進 `main`，其他系統以 `main` 為參照。

每則回答三個問題（格式見[版本策略](book/docs/6-governance/01-versioning.mdx)）：

1. **改了什麼**
2. **我需要做什麼**（不需要就明說）
3. **為什麼改**

條目標題是 `## release-YYYY-MM-DD · <short-sha>`，對應部署自動蓋上的進版 tag。
日常變更先累積在「未發佈（`dev`）」一節，**合併進 `main` 前把該節改名成當天日期**。

## 兩條散佈通道，版號意義不同

| 通道 | 更新時機 | 怎麼看自己的版本 |
| --- | --- | --- |
| `@dooping/tokens`（npm） | **只在 token 內容變更時** bump | `npm ls @dooping/tokens` |
| registry（元件原始碼） | 每次進版都重新產生 | 比對抄走的 item 與線上 `/r/index.json` 的 `version` |

改文件、CI、重構、改名 → 進 `main`、站台與 registry 更新，但**不 bump npm 版號**。

---

## 未發佈（`dev`）

**改了什麼**

- 進版 tag（`release-YYYY-MM-DD`）改由 `deploy.yml` 在部署成功後自動蓋上——
  annotated、帶 commit 與部署 run 連結、同日多次進版自動加 `-2`、重跑不重複打
- 版本策略同步改寫：`release-*` 不再是手動步驟；`tokens-v*`（npm 發佈）刻意維持人工，
  並補上不用終端機的網頁發佈路徑

**我需要做什麼**：無。沒有 token 值變更，也沒有元件 API 變更。

**為什麼改**：tag 是「要記得的手動步驟」就一定會有忘記的一天；改成部署的自動紀錄後，
tag 永遠代表「真的上線過」。發佈閘門不變——進版由人決定，npm 由人觸發，
tag 只是把已發生的事蓋上座標。

## 2026-07-29 · fdda051

> 早於自動 tag 機制的進版，沒有對應的 `release-*` tag，座標以 commit 為準。

**改了什麼**

- 建立 `dev` → `main` 的分支模型；新增 `.github/workflows/ci.yml`，讓 `dev` 上的變更在併入正本前就被驗證
- **新增 `dev` 預覽站**：推 `dev` 即部署到 `/preview/`（含 Storybook），可在手機上確認 UI；
  預覽站隨時會被覆蓋，不是進版，不可被其他系統參照
- 部署從 Pages artifact 模式改為 `gh-pages` 分支模式（`scripts/deploy-gh-pages.sh`），
  正式站與預覽站共用分支、互不覆蓋
- registry 的每個 item 與 `index.json` 加上 `version` 戳記
- 版號守衛從三處擴充到涵蓋元件庫版號（`react/package.json` ↔ `version.ts` ↔ registry 戳記）；
  CI 另擋「token 內容變了但版號沒 bump」
- 版本策略補上「什麼不該發版」；`AGENTS.md` 補上「相容性與版本」

**我需要做什麼**：無。沒有 token 值變更，也沒有元件 API 變更。
（維護者注意：Pages 的 Source 已切換為 `Deploy from a branch` → `gh-pages`。）

**為什麼改**：先前沒有定義過「進版」是什麼事件，發版的判準退化成「管線有沒有通」——
結果是三個 npm 版本沒有帶來任何設計決策（見下方 0.1.1）。
`version.ts` 的註解寫著版號是為了「讓人知道自己抄的是哪一版」，但 registry 輸出裡沒有這個欄位，
承諾等於空的。

---

## `@dooping/tokens` 版本

### 0.1.2

**改了什麼**：`exports` 開放 `./package.json` 子路徑。

**我需要做什麼**：無須調整。

**為什麼改**：宣告 `exports` 後，未列出的子路徑一律封死，`package.json` 也不例外，
`require("@dooping/tokens/package.json")` 會噴 `ERR_PACKAGE_PATH_NOT_EXPORTED`。
版本偵測與 bundler 分析會走這條路徑。

> 依現行規則，這種封裝層修正**不該單獨佔一個版號**，應該躺在 `main` 等下次 token 變更順路帶出去。
> 它會變成獨立版本，是因為當時還沒有「什麼不該發版」的規則。

### 0.1.1

**改了什麼**：**沒有內容變更。** 這是為了驗證 CI 發佈管線（trusted publishing / OIDC）而發的版本，
順帶補上 token 版號的一致性守衛。

**我需要做什麼**：無須調整。可直接使用 0.1.2。

**為什麼改**：不該改。這一版違反[版本策略](book/docs/6-governance/01-versioning.mdx)對 patch 的定義
（「色值微調」或「修正 CSS 產物的 bug」，兩者皆非），是「為了測試發佈而發佈」。
保留紀錄而不 unpublish，是因為 npm 永久保留用過的版號——拿掉只會讓歷史不完整。
**現行規則就是為了不再發生這件事而寫的。**

### 0.1.0

首次發佈。35 個語意色（淺／深成對）、8 色色盲友善圖表色票、圓角／間距／字級／陰影／動態、
互動尺寸（WCAG 2.5.5 觸控目標）。

產物皆框架中立：`tokens.css` 為純 CSS 變數（不含 Tailwind 指令），
另附 Tailwind preset 與型別化 JS API。深色同時支援 `.dark` 與 `[data-theme="dark"]` 兩種宿主鉤子。

**我需要做什麼**：見[導入三階段](book/docs/6-governance/04-adoption.mdx)。
