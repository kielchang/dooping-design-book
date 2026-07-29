# CHANGELOG

這份設計規範每次「進版」的紀錄。進版＝`dev` 併進 `main`，其他系統以 `main` 為參照。

每則回答三個問題（格式見[版本策略](book/docs/6-governance/01-versioning.mdx)）：

1. **改了什麼**
2. **我需要做什麼**（不需要就明說）
3. **為什麼改**

條目標題是 `## vX.Y.Z · YYYY-MM-DD · <short-sha>`，`vX.Y.Z` 對應部署自動蓋上的規範版號 tag；
純文件進版（版號未動、無新 tag）標題只寫日期與 SHA。
日常變更先累積在「未發佈（`dev`）」一節，**合併進 `main` 前把該節改名**。

## 兩條散佈通道，版號意義不同

| 通道 | 更新時機 | 怎麼看自己的版本 |
| --- | --- | --- |
| `@dooping/tokens`（npm） | **只在 token 內容變更時** bump | `npm ls @dooping/tokens` |
| registry（元件原始碼） | 每次進版都重新產生 | 比對抄走的 item 與線上 `/r/index.json` 的 `version` |

改文件、CI、重構、改名 → 進 `main`、站台與 registry 更新，但**不 bump npm 版號**。

---

## 未發佈（`dev`）

**改了什麼**

- **編譯層防線生效**：`@dooping/tokens` 的 Tailwind preset 從 `theme.extend.colors`
  改為**覆蓋 `theme.colors`**，套用 preset 後 Tailwind 預設色盤整個消失
- **新增 `templates/eslint.dooping.cjs`**：擋掉繞過編譯層的逃逸路徑——
  Tailwind arbitrary color（`bg-[#fff]`）、inline style 硬編色、深入上游內部路徑
- 治理章「漂移防護」改寫為三道防線（編譯層／lint／測試），並指向可直接複製的產物
- CI 的版號守衛擴大監看範圍，納入 `tailwind-preset.cjs`、`packages/tokens/scripts`、`templates`

**我需要做什麼**：

⚠️ **這是 breaking change。** 若你的專案已套用 `@dooping/tokens/tailwind-preset`
且用到 Tailwind 預設色盤（`bg-red-500`、`text-slate-600`…），升到 `v0.2.0` 後那些 class
會**不再產生樣式**。兩條路：

1. **建議**：改用語意色（`bg-danger/10`、`text-muted-foreground`…）
2. 真的需要額外色階：在自己的 `tailwind.config.js` 用 `theme.extend.colors` 加回去——
   那是明示的例外，會出現在 diff 裡

保留的結構性色值：`transparent`、`current`、`inherit`、`white`、`black`。
間距、圓角、字級刻度**完全不受影響**。

**為什麼改**：先前的守衛全部在保護規範 repo 自己，**沒有一個保護取用端**——
而跨系統一致正是這個 repo 存在的理由。取用端抄走元件後，沒有東西阻止他們硬編顏色。
編譯層是三道防線裡最便宜的一道：違規寫不出來，不必靠 review 或自律。

現在做的成本最低——還沒有任何取用端。

---

- **建立統一的規範版號 `vX.Y.Z`**：正本是根目錄 `package.json` 的 `version`，
  `main` 部署成功後自動蓋成 GitHub tag（版號沒動就不打、重跑不重複打、日期在 tag 描述）；
  registry 戳記改由規範版號產生，`packages/react` 與 `version.ts` 跟隨（守衛強制四處一致）
- 進版流程定為：工程師在 `dev` 依大中小判準 bump 版號＋寫 CHANGELOG（提議）→
  開 `dev` → `main` 的 Pull Request → 在 GitHub 確認後合併 → 部署自動蓋 tag
- CI 新增守衛：元件或 token 相對 `main` 有變、但規範版號沒 bump 就擋下
- `tokens-v*`（npm 發佈）刻意維持人工，補上不用終端機的網頁發佈路徑

**我需要做什麼**：無。沒有 token 值變更，也沒有元件 API 變更；
規範版號維持 `0.1.0`，首次進版會蓋出基準 tag `v0.1.0`。

**為什麼改**：取用端需要一眼判斷「這次進版要不要跟進」——大＝會壞、中＝有新東西、
小＝修正。日期式 tag 回答不了這題；統一成規範版號後，tag、registry 戳記與
`/r/index.json` 的 `version` 是同一個號碼，判斷與比對都只看一處。
版號判斷是工程師的、確認是維護者在 GitHub 上的合併、蓋章是自動的。

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
