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

**新增兩條結構性守衛**，讓「紅黃能瞬間反應」這件事不靠自律：

1. **色相層**——主題色相距任何狀態色須 ≥25°。四個狀態色把 `0°–95°` 整段吃滿，
   掃過整個色相環只剩三段可用（綠 109–137°、青 188–213°、藍紫 264–352°）。
   這就是企業系統主色壓倒性是藍靛青的真正原因：**剩下的地方只有那裡**。
2. **飽和度層**——`--brand` 的 chroma 必須低於 `--danger`。實測 danger 0.223、
   最飽和的主題 0.151、primary 0.040。階序一旦反過來，紅色就從「最搶眼」
   降級成「其中一個彩色」。

反向驗證過：把先前排除的赤陶 45° 加回去，守衛立刻擋下（距 `destructive` 只有 20°）。

### brand 的邊界：石墨改為無品牌色（規範 v0.4.1／`@dooping/tokens` v0.3.1）

**改了什麼**

- **石墨（預設主題）的 `--brand` 改為鏡射 `--primary`**，深色的
  `--brand-foreground` 一併鏡射 `--primary-foreground`
- **`Button` 的 `brand` variant 補上禁用範圍**：確認／送出／儲存一律用 `default`
- Storybook 的 `按鈕` story 把 `<Button variant="brand">送出申請</Button>`
  改成非提交型入口，並補一組**正／誤並列**對照
- 文件新增〈brand 的邊界〉一節（含色相慣例表）與截圖驗證的方法論
- 驗收新增兩條：`ΔE00(brand, 停用外觀) ≥ 12`；色相檢查加上**彩度前提**
  （chroma < 0.04 時跳過——近中性色的色相角度沒有感知意義）

**我需要做什麼**：

不設 `data-color-theme` 的**什麼都不用做**，但預設主題下 `variant="brand"` 的按鈕
會從灰藍變成與 `default` 相同的近黑／近白。若你的專案已經在用 `variant="brand"`
做確認按鈕，建議改回 `default`——理由見下。

**為什麼改**：

使用者實際切過 Storybook 的六組主題後指出「不是每個主題色都適合當確認按鈕」。
截圖逐一比對後，發現那是**兩個不同的問題**：

**一、石墨的 brand 按鈕會被讀成停用（可量測）。** `Button` 的停用態是
`disabled:opacity-50`，所以停用外觀＝`primary` 以 50% 疊在背景上。石墨照公式生成的
chroma 0.030 灰藍距離那個外觀只有 **ΔE00 8.5（淺）／7.9（深）**，低於 10 就是
實務上分不開。修法不是加彩，而是承認「預設主題沒有品牌色」——它的定位本來就是
「不挑主題時等同現況」，而現況沒有 `--brand`。

**二、紫系放在確認按鈕上的違和（量不出來）。** 這不是對比問題，任何對比守衛都抓不到。
色相帶著既成慣例——綠＝通行、藍＝系統預設、紅＝停止、灰＝停用；紫與洋紅
**沒有動作慣例**，放在確認按鈕上會被讀成裝飾。

但根因是**角色錯置，不是色相選錯**：`--brand` 的職責是識別，確認按鈕的職責是指示
可供性。一個 token 同時做兩件事，就是 `destructive` 與 `danger` 當初分家的那個錯。
**本書自己的 story 就是那個壞例子**——把 brand 按鈕標成「送出申請」。
改掉標籤、把邊界寫進元件註解之後，六個色相全部保留，不需要收窄。

**順帶修正了兩處自己的驗證方法**：生成器的報告一度拿理想純白去量 brand 前景對比
（石墨深色因此印出假的 1.05）；截圖驗證則因為 `--virtual-time-budget` 走虛擬時間、
不等非同步工作，單次截圖會拍到別組主題的顏色——加長等待無效，要驗到相符為止。
兩條都寫進了 `07-story-conventions`。

### 互動狀態層：hover／pressed／已選改為疊加（規範 v0.5.0／`@dooping/tokens` v0.4.0）

**改了什麼**

- **新增三個 token**：`--state-hover-alpha` 6%、`--state-pressed-alpha` 14%、
  `--state-selected-alpha` 20%（是**強度**不是顏色，淺深共用一組）
- **新增 `.state-layer` utility**：在元件自己的底色上疊一層 `currentColor`。
  走 `background-image`，落在背景層——在 `background-color` 之上、內容之下
- **十支元件改用狀態層**（Button／Table／Chips／TabPills／SegGroup／Select／
  DataTable／Coachmark／Dialog／Label），16 處 `hover:bg-*` 收成一組強度
- **全系統第一次有 pressed 狀態**——改版前 `active:` 在整個 repo 零命中
- 修掉三處一致性缺陷：`label.tsx` 的停用透明度 70% → 50%（其餘四支都是 50%）；
  `coachmark.tsx` 的聚焦環從 `ring-primary` 改為 `ring-ring`（原本是唯一不跟主題的）；
  `dialog.tsx` 的關閉鈕從 `focus:` 改為 `focus-visible:`，並停用「常駐半透明」的長相
- **驗收新增四道門檻 × 四種底色**（頁面底／卡片／`muted`／浮層）＋最壞情況文字對比，
  另加填色控制項的獨立檢查；`tests/` 新增兩條程式碼守衛

**我需要做什麼**：

**元件的 API 完全沒動**，但互動外觀變了，抄過原始碼的專案需要重抄那十支
（或至少 `Button` 與 `Table`）。同時**必須更新 `@dooping/tokens`**——
`.state-layer` 由 tokens.css 提供，只重抄元件而不更新 token 會讓所有 hover 消失。

自訂元件想接上狀態層：加 `state-layer` class，拿掉自己的 `hover:bg-*` 與
`transition-colors`。唯一的陷阱是 `background` **簡寫**會把 `background-image`
重設成 `none`，狀態層整個消失——用 `background-color`（Tailwind 的 `bg-*` 不受影響）。

**為什麼改**：

使用者要求討論互動配色，並給了一條約束：「不要讓變化太過刻意，或是無法看出變化目的」。
實測之後，本系統**全部落在第二種**——

| | 改版前（淺色 ΔE00） | 現在 |
| --- | --- | --- |
| 一般列 → hover | **1.6** | 3.0 |
| hover → 已選 | **1.6** | 7.8 |

根因不是顏色挑得不好，是**機制**：`--accent`、`--muted`、`--secondary` 目前是同一個值，
而 hover 用 `--accent`、斑馬列用 `--muted`——獨立的實色 token 是「取代」不是「疊加」，
所以它**無法與元件已有的底色組合**。斑馬列本來就是那個顏色，hover 換成同值的另一個
token 等於什麼都沒做。改成疊加之後，「深了一階」在四種底色上都成立（Δ 3.0／10.7–10.8）。

順帶收掉六種各行其是的 hover 透明度（`/90` `/80` `/50` `/40` `/20` `/15`），
可見度從 ΔE00 **0.6**（次要按鈕，等於沒變）到 **7.4**（主按鈕，太刻意）差十倍，
現在全部落在 **2.6–4.5**。

**三個實測逼出來的修正**（原訂做法都會壞）：

1. **疊加色必須取 `currentColor`，不能用單一的 `--foreground`。**
   深色模式下 `--foreground` 與 `--primary` 是同一個近白，拿它疊實色按鈕得到
   **ΔE00 0.0**——按鈕完全沒有 hover 回饋，而四種表面的檢查照樣全綠。
   因此填色控制項要單獨驗一條。
2. **疊加層要落在背景層，不能蓋在內容上。** 原訂用 `::after`，實測會把已選列裡的
   徽章一起染掉（`#dcfce7` → `#abc4b4`）。改用 `background-image` 之後徽章逐像素不變，
   而且不必給元件加 `position: relative`（那會改變絕對定位子元素的容器）。
3. **已選從 22% 降到 20%。** 上限（Δ ≤ 16，防「太刻意」）卡在**深色模式的頁面底色**
   ——全系統最深的表面，同一個 alpha 疊上去的感知落差最大，22% 會衝到 16.1。

還有一條規則是量出來才發現的：**已選的列不得再用弱化文字**。
20% 疊加之後 `--muted-foreground` 掉到 2.77:1／2.96:1，低於 4.5:1。
這不是調數值能解的——已選的列在語意上就是被強調的。

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

### 0.4.0

**改了什麼**：新增 `state` 群組（`--state-hover-alpha` 6%、`--state-pressed-alpha` 14%、
`--state-selected-alpha` 20%）與 `.state-layer` utility；JS API 新增 `state` 匯出。

**我需要做什麼**：純加法，既有 token 一個都沒動。要用互動狀態層就更新到這一版，
否則元件抄過去會沒有 hover。

**為什麼改**：互動狀態需要一組**跨底色成立**的強度，而不是每個角色各生一組 hover 色。
詳見規範 v0.5.0 那則。

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
