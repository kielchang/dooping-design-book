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

- **去領域化守衛從「不留來源語彙」擴為「不綁死任何產業」**：詞表 43 → 176 詞，
  新增企業系統（ERP／CRM／BPM／MES）與六類其他產業；掃描範圍補上 `templates/`、
  `scripts/`、`tests/`、`AGENTS.md`、`CHANGELOG.md`、文件站設定與側欄
- **示範情境整套改為抽象中性**（`項目／單位／類別／負責組別／狀態`，值用甲乙丙丁），
  清掉全庫 189 處領域詞——包含**兩處已經漏進會發佈的元件註解**的（`delta.tsx`、`badge.tsx`）
- **新增 `tests/demo-data.test.ts`**：示範資料只能有一個來源，
  stories 與文件不得自行宣告業務資料集（頂層鍵 ≥4 即判定；圍籬內的 API 示意不算）
- **兩支守衛都補了自我驗證**：證明比對邏輯真的會紅，而不是空轉
- CI 的規範版號守衛監看範圍改為**逐字等於「會進 registry 的集合」**，
  排除 `demo/`、`index.ts`、`version.ts`、`*.stories.tsx`

**我需要做什麼**：

**不用做任何事。** 元件的 API 與行為完全沒動，只有 `Delta` 與 `Badge` 兩支的
**註解文字**有變（registry 逐字複製檔案內容，所以仍給了版號訊號）。
重抄那兩支或不抄，都不影響行為。

**為什麼改**：`demo/sample-data.ts` 的檔頭寫著「一律使用中性商業情境」，
而它挑的那一套其實是一整組交易型系統的欄位——**它把 ERP 當成中性**。依 ADR-0006 自己的理由
（示範資料會被複製貼上，抄過去的人會連資料模型一起抄走），這與原本要清掉的
領域語彙是同一個失敗模式，只是不在詞表上，所以三個版本都沒被發現。

守衛只認得它被教過的那一個領域——這是黑名單的通病，補救方式是把「什麼算領域」
的定義擴大，而不是等下一個領域自己冒出來。詳見 ADR-0006 的修訂節。

### 色彩系統重建（規範 v0.3.0／`@dooping/tokens` v0.2.0）

**改了什麼**

- **新增多色相主題**：六組（石墨／靛藍／藍紫／紫晶／青玉／苔綠），
  宿主在 `<html>` 設 `data-color-theme="<name>"` 切換，與既有的深淺模式正交
- **新增 `--brand` 三件組**（`--brand`、`--brand-subtle` 與各自的 `-foreground`）。
  `--primary` **一個字都沒改**——維持中性近黑，承擔絕大多數控制項；
  `--brand` 只給一頁一顆的關鍵動作。`Button` 新增 `variant="brand"`
- **`--ring` 改吃主題色相**（原本是中性近黑）
- **圖表 8 色全部重新生成，淺深各一組獨立值**（原本 8 色裡有 6 色淺深共用同一 hex）
- **修正八處 WCAG AA 違規**：`success`／`warning`／`info` 的前景改為同色相深墨
  （填色不動），`destructive`（淺）與 `danger`（深）的填色壓深（保留白字）
- **新增 `npm run build:theme`（生成）與 `npm run verify:color`（驗收）**，
  驗收接進 `npm test`，共 9 則色彩守衛

**我需要做什麼**：

⚠️ **這一版有視覺變更，三類。**

1. **圖表色票整組換值。** 直接吃 `var(--chart-N)` 的不用動；把 hex 抄進程式碼的要重抄。
   舊值與新值沒有任何一色相同。
2. **`success`／`warning`／`info` 徽章的文字從白色變成同色相深墨。**
   填色沒變，所以徽章看起來還是原本那個顏色，只有字色變深。這是無障礙修正，不是改風格。
3. **`destructive` 刪除鈕（淺色）與 `danger` 徽章（深色）的紅色略深**
   （色偏 ΔE00 6.3 與 3.7，並排才看得出來）。

不想要色相主題的**什麼都不用做**：不設 `data-color-theme` 時預設是石墨，
`--brand` 是中性灰藍，觀感與原本一致。

**為什麼改**：

實際去量既有色票，查出兩件事。

**一、分類色票在紅綠色盲下是壞的。** 8 色的 L\* 全距只有 26，最差一對
（`chart-1`↔`chart-8`）在 deuteranopia 下 ΔE00 只有 **2.6**——實質同色。
根因不是選色品味，是**淺深共用值**：一個顏色要同時對白底與深底都達 3:1，
OKLCH 的 L 只能落在 `[0.49, 0.67]`，寬度 0.17，八色必然擠在中明度。
而二色覺者失去色相辨別、保留的正是明度。

當時文件的說法是「把最難分辨的藍↔紫拆到陣列兩端，讓相鄰系列永遠安全」，
但**陣列距離只防相鄰**，而相鄰只在堆疊長條與圓餅圖有意義——本書明訂不做圓餅圖。
折線／散點／分組長條的任兩系列都會被並置比較，緩解措施沒有作用在它要保護的圖型上。
改成淺深各生一組後，最差一對從 2.6 提升到 12.2／11.1，與業界基準
Okabe–Ito（11.6）同級，紅綠色盲下沒有任何一對低於 10。

**二、狀態色的白字從來沒過關。** `Badge` 跑的是 `bg-warning text-warning-foreground`，
而白字在 `--warning` 上只有 **1.99:1**（需 4.5）。`success` 2.59、`info` 2.86、
`destructive` 3.60——全部是已經發佈的元件。這類問題不會有任何東西報錯：
畫面不壞、型別不錯、測試不紅，只有對比悄悄不合格。

所以這一版同時把「怎麼產生」與「怎麼守住」一起做掉：值由
`packages/tokens/scripts/generate-theme.mjs` **以目標對比反解 OKLCH 的 L** 產生
（而不是調完再量），`scripts/verify-color.mjs` 在 CI 擋。加主題、改背景、
調卡片底色時只要有一項掉線就過不了 PR。

### 提醒視窗雙強度、欄位驗證狀態、中性色帶主題色相（規範 v0.4.0／`@dooping/tokens` v0.3.0）

**改了什麼**

- **中性色跟著主題轉色相**：`background`／`card`／`popover`／`muted`／`secondary`／
  `accent`／`border`／`input`／`field-*`／`muted-foreground` 共 12 個，
  **只轉色相、L 與 chroma 不動**。主題影響的 token 從 5 個變成 17 個
- **提醒視窗改雙強度**：新增 `--{狀態}-subtle` 與 `-subtle-foreground` 共 8 個 token；
  `Callout` 新增 `intensity`（`low` 預設／`high` 實色）與 `live`（是否即時播報）
- **欄位驗證狀態**：`Input`／`Select` 支援 `aria-invalid`（`--danger` 邊框＋`--danger-subtle` 底），
  `Checkbox` 支援不合格邊框；三支同時補上 `ring-offset`
- **`Callout` 的 `role` 修正**：原本沒有 role，現在預設 `note`；只有傳 `live` 才成為
  live region——靜態提示框套 live region 會讓讀屏在載入時把整頁念一遍
- 驗收新增：四種淡底兩兩 ΔE00、淡底文字 4.5:1、逐主題重驗 `muted-foreground`，
  以及一條**程式碼層**守衛「用了 `ring-ring` 就必須有 `ring-offset`」

**我需要做什麼**：

⚠️ **`Callout` 的四種變體外觀改變。** 低強度從「實色壓 10%」改為實色淡底＋左粗邊，
文字色從實色狀態色改為對淡底反解的深墨。API 相容（既有用法不必改），但畫面會不一樣。

抄走 `Input`／`Select`／`Checkbox` 的要重抄——聚焦環從 `ring-1` 無 offset 改為
`ring-2` + `ring-offset-2`。

**為什麼改**：

**一、`Callout` 的文字對比從來沒過關。** 四種變體在淺色模式只有 **1.97–3.98:1**。
根因是 `bg-danger/10` 這種寫法——把實色壓 10% 疊在表面上，結果取決於底下是什麼，
**對比不可控**。改成生成的實色 token，文字對底色反解到 4.5:1。

**二、聚焦環貼在邊框上。** `Input`／`Checkbox`／`Select` 用 `ring-1` 且沒有 `ring-offset`，
環直接畫在邊框外緣，對比要對邊框算——實測環對 `--danger` 邊框在深色下只有 **1.04:1**。
這在加上驗證狀態（不合格＝紅框）之後會從「小瑕疵」變成「聚焦環隱形」，
所以它是驗證狀態的前置條件，不是順手修的。

**三、中性色固定在冷藍，主色卻可能是青玉或苔綠。** chroma 只有 0.007–0.023，
單看一格分不出來，但那是畫面 60% 的面積——介面會有一種說不上來的「兩套系統拼裝」感。

**為什麼狀態色的色相仍然鎖死**：使用者問過能不能讓藍黃紅跟著主題微調（harmonization）。
實測兩條路都不行：往主題偏 15° 會讓**淺色模式六組裡有四組**的分類色守衛破掉
（ΔE00 17.6 < 18）；只彎淡底層則會讓藍紫系主題的 `warning`／`danger` 淡底
收斂到 ΔE00 8.8——琥珀和紅都變粉橘，「注意」和「錯誤」看起來一樣。
整體感改從兩個地方拿：四種提示共用同一條構成規則，加上它們坐在帶主題色相的中性表面上。

---

## v0.2.0 · 2026-07-29 · da80faa

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
