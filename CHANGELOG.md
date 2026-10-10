# CHANGELOG

這份設計規範每次「進版」的紀錄。進版＝核准版（`main`）前進一次：dev → staging（套用驗收）→ main。
其他系統以 `main` 為參照。流程正本：[ARCHITECTURE.md「分支與部署拓樸」](ARCHITECTURE.md#分支與部署拓樸)。

每則的格式：

- 標題之後先寫一行「對你的意義」：一句話說這一版對取用端代表什麼，有變就附規範／tokens 版號。
- 每個 `###` 工作項只回答兩題：
  1. **改了什麼**
  2. **我需要做什麼**（不需要就明說）

格式規則（`scripts/release-gate.mjs` 與 `tests/changelog.test.ts` 檢查）：

- 標題兩種：有 bump 寫 `## vX.Y.Z · YYYY-MM-DD`（對應自動蓋上的 tag，後面可選填 merge commit 的 short SHA）；
  版號沒動寫 `## YYYY-MM-DD（說明）`。
- 日常變更先累積在「未發佈（`dev`）」一節，**開 dev → staging 的 PR 之前改名**。
- 每一節結尾是「空行、`---`、空行」——Release notes 抽到第一條 `---` 就停。
- 一次進版只蓋一個 tag，工作項用 `###` 記在同一則裡。

## 兩條散佈通道，版號意義不同

| 通道 | 更新時機 | 怎麼看自己的版本 |
| --- | --- | --- |
| `@dooping/tokens`（npm） | **只在 token 內容變更時** bump | `npm ls @dooping/tokens` |
| registry（元件原始碼） | 每次進版都重新產生 | 比對抄走的 item 與線上 `/r/index.json` 的 `version` |

改文件、CI、重構、改名 → 進 `main`、站台與 registry 更新，但**不 bump npm 版號**。

訂閱新版訊號、判斷要不要跟、每層怎麼跟：見文件站的[跟上新版](book/docs/7-governance/06-staying-current.mdx)。

---

## 未發佈（`dev`）

側欄收合改成右緣拉環（要重抄 `sidebar`）；另有文件改版：回饋改走 GitHub、公開文件只留規則與做法。token 不動。

### 側欄收合改成右緣拉環（minor → 0.15.0）

1. **改了什麼**：桌面版的側欄收合入口改成側欄右緣、固定在底部的小拉環——點一下或左右拖拉切換（往左拖收合、往右拖展開），
   鍵盤 Enter／空白鍵也能切換，滑鼠移上去有「收合側邊欄」／「展開側邊欄」提示。`collapsible="offcanvas"` 收合時拉環留在視窗左緣底部。
   `SidebarTrigger` 在桌面版不再渲染，只在行動版出現，負責開抽屜。
2. **我需要做什麼**：重抄 `sidebar` 與 `app-shell`（`sidebar-nav`、`app-menubar` 自己的檔沒變，重抄它們會一起帶到新的 `sidebar`）。頂列的 `<SidebarTrigger />` 不用拿掉——桌面版會自動消失；
   緊跟在它後面的分隔線在桌面版會落單在最左邊，移到後面或拿掉。用 `useSidebar().toggle()` 掛快捷鍵的不受影響。

### 回饋到上游改開 GitHub issue

1. **改了什麼**：AGENTS.md「回饋到上游」改成開標題 `[回饋]` 的 GitHub issue（`gh issue create`；八段骨架不變，「來源」改填專案名稱或泛稱）；
   專案設定另有指定回饋管道的照它。安全問題改走 SECURITY.md 的 GitHub 私密回報。〈回饋與 RFC 流程〉改為單一入口，並補上「送出之後」。
2. **我需要做什麼**：取用端 agent 之後照 AGENTS.md 開 issue，送出前給使用者看過，不寫內部系統名稱或連線資訊；台帳「上游對應」記 issue 編號。

### 文件依現況更新

1. **改了什麼**：README 重寫；AGENTS.md、元件總覽、〈三種取用方式〉、〈漂移防護〉的數字與清單照現況更正
   （語意色 47 個、lib 清單、圖表色範例）；CHANGELOG 精簡為取用端版；文件與註解不再引用外部決策編號。
2. **我需要做什麼**：不需要。

### 治理章只留取用端的頁

1. **改了什麼**：〈版本策略〉只留取用端內容（只參照正式站、兩個對外訊號、配對模型、SemVer 判準與其後各節），
   發佈流程移到 GitHub 上的 ARCHITECTURE.md「分支與部署拓樸」。〈Storybook 設定〉〈Story 撰寫慣例〉〈壓力測試 Story〉的規則
   移到 `packages/react/README.md`；〈系統架構〉不再放在文件站，改看 GitHub 上的 ARCHITECTURE.md。四個舊網址留轉址頁。
2. **我需要做什麼**：不需要。舊書籤會經過轉址頁。

### 色票配色策略與淡底範例

1. **改了什麼**：基礎章〈怎麼選一組分類色票〉改為〈色票配色策略〉（網址不變），一頁寫完選色方法、驗證門檻、排序與新增主題／分類色票的步驟。
   AGENTS.md、tokens README、〈三種取用方式〉〈導入三階段〉〈漂移防護〉的淡底範例，從 `bg-danger/10`（實色壓透明）改成 `bg-danger-subtle`。
2. **我需要做什麼**：照舊範例寫過 `bg-danger/10` 這類淡底的，改用 `bg-{狀態}-subtle` 與 `text-{狀態}-subtle-foreground`。元件與 token 不動。

### 頁面章改用已收錄的元件

1. **改了什麼**：〈表單頁〉〈儀表板〉〈設定頁〉不再寫 Toast、Switch、Skeleton、DateRange、`FormField`「尚未收錄」：
   表單送出回饋照〈Toast〉的分工、設定頁立即生效的開關用 Switch、儀表板期間切換用 DateRange（固定報表期如月份才用 SegGroup）、
   KPI 磚首次載入用 Skeleton；三頁的安裝指令補上對應 item，範例畫面一併更新。〈Charts〉散點圖參數表的 `xLabel`／`yLabel` 改標必填，與同頁內文一致。
2. **我需要做什麼**：照舊頁面章拿 Checkbox 當開關、`Callout live` 當動作回饋、SegGroup 當「近 7 日」這類期間選擇的，新畫面改用上述元件。元件與 token 不動。

---

## v0.14.0 · 2026-10-08

多應用外殼上線（側欄切應用、頂部 `AppMenubar` 切功能），單應用宿主不需要動；AGENTS.md 新增「回饋到上游」。規範 0.13.0 → 0.14.0；tokens 不動（0.7.0）。

### 多應用外殼：側欄切應用、頂部選單切功能（minor → 0.14.0）

1. **改了什麼**：
   - 新元件 **`AppMenubar` 功能選單列**（`app-menubar`，Radix Menubar）：吃同一份 `NavGroup[]`，一組一個頂層選單，
     行為像 macOS 的選單列（左右鍵在頂層間移動並循環、開著時滑過另一個標題就切換、Esc 歸還焦點）。
     兩層群組渲染成「分區標題＋子項」，不做子選單；行動版或頂層標題擠不下時收成單一「選單」鈕，依原順序列出每一區。
   - `nav` 導覽契約新增**動作項 `NavAction`**（`{ title, action, shortcut? }`：不導航，把代號交回 `onAction`，例如開對話框）
     與 `findActiveNavLeaf()`（找出所在項與它的分組，父子都符合時取最長的）。
     `SidebarNav`、`CommandPalette` 都接 `onAction`——側欄、頂部選單、⌘K 三個出口吃同一份資料。
   - `Sidebar` 新增 `collapsible="offcanvas"`：收合時整塊移出畫面（`inert`），工作區拿回整個寬度；
     滑鼠碰左緣**窺看**（浮在內容上、不推版面，滑鼠離開／Esc／選了目的地就收）；鍵盤與觸控走 SidebarTrigger 釘選展開。
     圖示欄的提示泡泡改到圖示右側（`Tooltip` 新增 `side="right"`）；`collapsible="none"` 時不再誤用收合態的右彈選單。
   - `AppShell` 頂列與側欄貼著視窗頂端（sticky），頂列 `h-14` → `h-12`；`DropdownMenu` 匯出共用的選單樣式
     `menuItemClass`／`menuContentClass`。
   - 模式章〈後台系統的資訊架構〉新增「多應用系統」一節：兩層導覽各放一處、工作節奏分區原封不動搬到頂部、
     **頂列左右兩段留給系統**（左＝側欄開關＋目前應用，右＝搜尋・通知・使用者）、頂層選單最多六個、
     待處理數改成通知鈴鐺的未讀徽章。
2. **我需要做什麼**：
   - 單應用的宿主**不需要**動：`AppShell`／`Sidebar`／`SidebarNav` 的既有用法照舊（頂列矮了 8px）。
   - 要換成多應用版型：`npx shadcn add …/r/app-menubar.json`，照〈AppShell／Sidebar〉的「多應用外殼的組法」接；
     `renderLink` 要回傳先呼叫轉發來的 `onClick` 再導航的元件（react-router 的 `Link` 本來就是）。
   - 自己 `switch` 過 `NavItem` 的程式要多處理一種 `NavAction`（`isNavAction()` 判斷）——TS 會在漏掉的地方報錯。

### 回饋入口：AGENTS.md 新增「回饋到上游」（不動元件與 token）

1. **改了什麼**：
   - `AGENTS.md` 新增「回饋到上游」：一份可照抄的八段骨架（來源／對象／類型／目前處置＋台帳四題）。
     台帳記「自製」或「刻意偏離」、或發現行為與規範不符時就送一則，不必等用到第三次。
   - 〈符合性台帳〉的順序改為「**先在宿主做，同時回饋上游**」。
   - 送件方式已改為 GitHub issue，見「未發佈（`dev`）」那一則。
2. **我需要做什麼**：這一項不動元件與 token，**不必為它重抄或升級**。
   之後台帳記「自製」或「刻意偏離」、或發現行為與規範不符時，照 AGENTS.md「回饋到上游」送一則，
   並把編號記進台帳那一列的「上游對應」。

---

## 2026-09-15（三段式發布，版號未動）

新增候選版 `/staging/`；取用端仍只參照正式站，不需要動作。

### 三段式發布：dev → staging（套用驗收）→ main（核准版）

1. **改了什麼**：新增候選版 `staging`，部署到 `/staging/`（文件站、Storybook，以及可以真的安裝的 registry）；
   `main` 只收 staging 的核准合併。候選版先經套用驗收（repo 外的乾淨專案從 registry 實裝、建置、量顏色）。
   預覽站與候選版掛橫幅並加 noindex。
2. **我需要做什麼**：取用端不需要。仍然只參照正式站（`/r/`、npm、Releases）；`/staging/` 可以在自己的分支試裝回報，但它不是核准版。

---

## v0.13.0 · 2026-09-11

Tailwind v4 成為主要取用路徑（v3 相容），新增應用外殼、指令面板、浮層與頁首元件，DataTable 強化；v4 宿主改用四行 `@import`，用凍結欄的要連同 `utils` 重抄。規範 0.11.1 → 0.13.0；tokens 0.6.0 → 0.7.0。

### Token：Tailwind v4 入口＋強制色彩模式的焦點備援（tokens 0.7.0）

1. **改了什麼**：`@dooping/tokens` 新增第五個進入點 `@dooping/tokens/tailwind.css`——從 tokens.json 生成的
   `@theme inline reference` 名稱對映，定位與 v3 preset 相同（只對映名稱，值一律 `var()` 回 `tokens.css`）：
   清空預設色盤、`@custom-variant dark` 同認 `.dark` 與 `[data-theme="dark"]`、`@layer base` 補 v4 preflight
   拿掉的邊框預設色與按鈕游標。`tokens.css` 另加強制色彩模式的焦點備援。
2. **我需要做什麼**：v3 宿主不需要。v4 宿主改用四行 `@import`（見 AGENTS.md「取 token」），
   並刪掉 `shadcn init` 產生的 `:root`／`.dark` 色值與 `@theme inline` 的 `--color-*`。

### Tailwind v3／v4 相容：元件圓角改 `rounded-sm`、`cn()` 認得 token 字級

1. **改了什麼**：元件內所有裸 `rounded`／`rounded-b` 改成 `rounded-sm`／`rounded-b-sm`（兩版值相同，0.25rem；
   之後調 `--radius` 圓角會跟著走）。`cn()` 把 `text-micro`／`text-tiny` 登記進 tailwind-merge 的字級群組
   （原本 `cn("text-sm", "text-tiny")` 會兩者並存）。元件原始碼只用兩版語意相同的 utility：
   不用兩版值不同的裸 utility、不用 v4 限定語法、不只靠 hover 揭露功能。
2. **我需要做什麼**：v4 宿主不需要。已抄走 callout／change-summary／coachmark／data-table／
   editable-field／gantt／seg-group／toast／utils 的取用端，外觀不變、不必重抄；
   想讓這些元件的圓角跟著 `--radius` 走時再重抄。`cn()` 的新寫法用 `classGroups`，
   tailwind-merge v2 與 v3 是同一套 API。

### 新子系統的起手範本：`apps/host-v4`

1. **改了什麼**：新增 `apps/host-v4`（Vite＋React 19＋Tailwind v4），`src/globals.css` 就是 AGENTS.md 的四行 `@import`；
   五種頁型各一頁組進 AppShell，側欄 `renderLink` 注入 react-router，表格狀態經宿主 adapter 寫進網址。
2. **我需要做什麼**：不需要。要開新子系統時，可以把 `apps/host-v4` 整個目錄複製走當起手範本（見其 README）。

### 文件站升 Tailwind v4：demo 宿主基座改由產生器移植

1. **改了什麼**：文件站改用 Tailwind v4。`kit.css` 的順序改為 tokens → demo-base → `tailwindcss/theme.css`（layer）→
   tokens 的 `tailwind.css` → `tailwindcss/utilities.css`（不進 layer），並明示 `@source`。
   `demo-base.css` 改由 `book/scripts/port-preflight.mjs` 從 v4 preflight＋tokens 基座機械產生。
2. **我需要做什麼**：不需要。照抄 `demo-base.css` 當宿主基座的取用端，下次重抄會拿到 v4 版本
   （全元素 margin／padding 歸零、placeholder 改用 currentcolor 50%）。

### Token：`--sidebar-*` 八件組（tokens 0.7.0）

1. **改了什麼**：新增 shadcn 相容的 `--sidebar-*` 八個 token。只有 `--sidebar` 是新顏色（比頁面底沉一階的安靜區）；
   其餘七個是別名——`sidebar-ring ≡ ring`、`sidebar-foreground ≡ foreground`、`sidebar-border ≡ border`、
   `sidebar-primary/accent 家族 ≡ brand/brand-subtle 家族`。主題層 token 每組 16 → 22。
2. **我需要做什麼**：不需要。Sidebar 家族會用到它們，`@dooping/tokens` 要 ≥ 0.7.0。

### 浮層基座：Popover／DropdownMenu 自缺件表畢業＋ConfirmDialog

1. **改了什麼**：新收六件——Popover、DropdownMenu（單層，勾選項預設不關閉）、Collapsible、Separator、
   ConfirmDialog（確認不自動關、loading 鎖全部出口、typeToConfirm 硬確認）、
   useDialogState（多對話框集中開關：天然單開、同值再設即關）。缺件表「Drawer／Popover／DropdownMenu」列改為「Drawer」單獨一列。
2. **我需要做什麼**：不需要。全部是新增，既有元件 API 零變更。

### 指令面板：cmdk 單檔隔離＋導覽契約

1. **改了什麼**：新收 Command（cmdk 薄封裝，對話框殼組合本書 Dialog）、CommandPalette（⌘K、執行即關、兩層項顯示「父 › 子」）、
   `lib/nav`（NavGroup discriminated union＋isNavActive 多層 fallback）。cmdk 只在 `command.tsx` 單檔 import。
2. **我需要做什麼**：不需要。裝 `command-palette` 會自動帶 cmdk——大相依提醒見 AGENTS.md。

### 應用外殼：Sidebar 家族＋SidebarNav＋AppShell

1. **改了什麼**：新收外殼三件——Sidebar 家族（Provider／Trigger／結構件／選單鈕；桌面 icon 收合、
   行動版自動轉左滑抽屜＝既有 Radix Dialog 組成，焦點歸還開啟者）、SidebarNav（NavGroup[] 三態渲染：
   連結／展開 Collapsible／收合態右彈 DropdownMenu，〔例行〕〔試算〕標籤、renderLink 注入、收合態名稱走 sr-only）、
   AppShell（純佈局，刻意小到宿主可自行重寫）。相對 shadcn 上游不收 floating/inset variant、SidebarRail、cookie、Ctrl+B。
2. **我需要做什麼**：可以採用。若日後決定退場，走〈版本策略〉的棄用流程
   （`@deprecated` → 保留至少一個 minor → 下個 major 移除），不會無預警消失。

### DataTable 強化＋狀態同步網址

1. **改了什麼**：DataTable 新增四能力——`selectable`＋`bulkActions`（表頭勾選只切當頁、選取跨頁保留、
   批次列 role=toolbar＋方向鍵）、`facets`（faceted 鈕與表頭篩選共用同一份狀態、逐值計數排除本欄）、
   `columnVisibility`（配 Column.hideable/defaultHidden，凍結欄不可隱藏）、**逐鍵受控** `state`／`onStateChange`。
   新增 `useTableUrlState`（框架無關：預設 history adapter 可注入、預設值不進網址、條件變更回第 1 頁、
   prefix 隔離同頁多表；selection/hiddenColumns 不進網址）。useSort 加可選受控參數（非破壞性）。
2. **我需要做什麼**：不需要。全部是新增 props，預設行為與舊版完全相同；
   已抄走 data-table 的取用端要吃新能力請重抄並比對自己的修改。

### 再查詢載入態：變暗＋資料列脈動

1. **改了什麼**：DataTable `loading` 且已有資料時，在既有「就地變暗＋鎖互動＋`aria-busy`」之上，
   資料列加上與骨架同一套 `animate-pulse` 脈動（表頭與工具列不動）；`motion-reduce` 停動畫、變暗仍在。
   色彩頁、DataTable 頁、Skeleton 檔頭的載入手段分工同步改寫。
2. **我需要做什麼**：不需要。視覺語彙變更，API 與語意（`aria-busy`／`role="status"`）不變；
   已抄走 data-table 的取用端重抄即得。

### Gantt 空資料內建空狀態

1. **改了什麼**：`items=[]` 時直接出內建 `EmptyState`、不畫空刻度（`viewStart`／`viewEnd` 有給也一樣），
   不再整個版面變 `NaN`；新增 `empty` prop（與 `DataTable` 同形）與 `labels.emptyTitle`。
2. **我需要做什麼**：不需要。純修正，`empty` 是新增的可選 prop，預設行為（顯示「尚無資料」空狀態）零破壞。

### 壓力測試 Story：七類極端值＋兩處元件無障礙修正

1. **改了什麼**：Storybook 補上七類極端值 story（超長文字值／超長標籤／超大數值／超多選項／超多欄位／超多筆／多類別圖形），
   每類都含「很多」與「沒有」兩個極端。兩處元件修正：`TabPills` 的 `label` 為空字串時補序數當可及名稱（分頁 N）；
   `BarChart` 類別一多觸發水平捲動時，捲動容器補 `tabIndex`＋`role="group"`，鍵盤碰得到捲出畫面的內容。
2. **我需要做什麼**：不需要。新增的都是 story 層；兩處元件修正是無障礙保底，預設行為與既有 API 零變更。

### 頁首元件化：PageHeader／BackLink／Breadcrumb（缺件表第一列，minor → 0.13.0）

1. **改了什麼**：新收頁首骨架三件——`PageHeader`（五個 slot：`nav`／`title`／`badges`／`meta`／`actions`；
   渲染整頁唯一的 h1，版型固定不留給呼叫端決定）、`BackLink`（兩層 IA 的返回，渲染**真 `<a href>`**）、
   `Breadcrumb`（三層以上，末項 `aria-current="page"` 且不可點）。頁面章的組合 story 改用這三件；
   缺件表劃掉第一列，補登 `DefinitionList`（只登記不實作）。
2. **我需要做什麼**：不需要。全部是新增，既有元件 API 零變更。想把自己的頁首換過來就抄 `page-header`——
   `href` 由你給，`<a>` 換成自家 Link 是預期改法。

### SPA 宿主的三個接縫：頁首連結注入、FormField 包複合控制項、表格網址狀態只寫本表參數

1. **改了什麼**：
   - `BackLink`／`Breadcrumb` 新增 `renderLink`（比照 `SidebarNav`），預設仍是真 `<a href>`；
     匯出注入端收到的 `PageLinkProps`。麵包屑末項不經注入。
   - `FormField` 的 `children` 可以傳函式：收到 `id`／`aria-describedby`／`aria-invalid`，展開到真正可聚焦的元素
     （Radix Select 的 `SelectTrigger`）。
   - `useTableUrlState` 寫入時只替換本表的參數（新增並匯出 `mergeTableSearch`），同頁其他參數與另一張表的參數不再被洗掉；
     `UrlStateAdapter.set` 從此收到整串 search。
2. **我需要做什麼**：不需要，三項都是新增或修正，既有寫法照常可用。自訂 `UrlStateAdapter` 若自己合併過參數，
   可以拿掉合併、直接寫回收到的字串（留著也不會錯）。

### DataTable：整列可點與批次勾選並存——列入口改成首欄的真按鈕

1. **改了什麼**：`onRowClick` 的鍵盤與讀屏入口從「整列 `role="button"`＋`tabIndex`」改成**首個可見欄的真 `<button>`**
   （Tab 得到、Enter／Space 觸發、名字就是首欄內容）。列本身只保留滑鼠點擊，點到列裡的控制項
   （勾選框、入口按鈕、欄內按鈕與連結）交給控制項自己。`selectable` 與 `onRowClick` 從此可以同時開。
   〈清單頁〉與 DataTable 文件的無障礙段同步改寫。
2. **我需要做什麼**：props 不變。首欄的 `cell` 若自己渲染了連結或按鈕，開了 `onRowClick` 之後會被包進入口按鈕——
   改成純文字，或把那個動作移到明細頁。測試若用整列文字當名字找 `button`，改用首欄內容找。

### DataTable：窄螢幕水平捲動時，捲過去的欄位不再從凍結欄透出來

1. **改了什麼**：
   - `cn()`（`utils`）把 `bg-gradient-to-*` 登記回 tailwind-merge 的背景圖片群組，不再合併掉凍結格的 `bg-background`。
   - 勾選欄固定 `w-10 min-w-10`，凍結首欄與勾選欄之間不再有縫。
2. **我需要做什麼**：用了 DataTable 凍結欄（`freeze`）的取用端，重抄 `data-table` 時**連同 `utils` 與 `table` 一起覆寫**——
   主要的修正在 `utils`，只重抄 `data-table` 修不到。自己換掉 `cn` 的宿主，照 `utils` 檔內的註解補登記。

### 元件更新訊號（一）：registry 逐 item 指紋＋Release 列出這一版動到的 item

1. **改了什麼**：
   - `/r/index.json` 每個 item 多了 `meta.hash`（抄走的內容與相依）與 `meta.closureHash`（再把遞移相依的指紋算進去）。
     版號、標題、說明與 base 不進指紋——預覽站與正式站的同一份內容，同一個指紋。
   - 發 Release 時自動附上「這一版動到的 registry item」，相對上一個 `v*` tag 分四類：內容有變、只因相依變了而受影響、新增、移除。
2. **我需要做什麼**：不需要。訂閱了 Release 的話，之後每一版的通知會直接列出動到哪些 item，對照自己抄過的就知道要不要重抄。

### 元件更新訊號（二）：取用端的 dooping-check——lock＋例行檢查

1. **改了什麼**：新增 registry item `dooping-check`（`registry:file`，裝進專案根目錄的 `scripts/dooping-check.mjs`，零相依）。
   - `init <item…>`：剛 `npx shadcn add` 完，以這幾個 item 建立 `dooping.lock.json`——記上游的 `closureHash`，
     以及它（含相依）寫進專案的每個檔的內容指紋。
   - 不帶參數＝例行檢查：每個 item 回報「已是最新／上游有更新／本地改過」，上游有更新時印出看差異與跟進的指令；
     預設只提醒，加 `--strict` 才以結束碼 1 結束。
   - `update [item…]`：重抄完更新紀錄。路徑對應照 `components.json` 的 aliases 與 tsconfig 的 `@/*`，與 shadcn CLI 同一套。
2. **我需要做什麼**：可選。想讓 CI 在上游動到你抄過的 item 時提醒你，照文件站〈跟上新版〉的「例行檢查」裝一次、
   列出你主動裝過的 item，之後每週在 CI 跑一次。

---

## v0.11.1 · 2026-08-08

元件無障礙修正（DataTable、GraphCanvas），文件站新增 AI 取用入口 `/llms.txt`。規範 0.11.0 → 0.11.1；tokens 不動（0.6.0）。

### 文件體系：AI 取用入口＋Storybook 互動 playground

1. **改了什麼**：
   - 文件站新增 `/llms.txt`（機器地圖）；`AGENTS.md` 同步上站（`/AGENTS.md`），並補強內容
     （元件清單指向 `/r/index.json`、五種頁型最小安裝集入口、`@xyflow/react` 大相依提醒、深色切換一行示範、
     可抄的符合性台帳骨架、連結全面改絕對 URL）。
   - Storybook 新增五支中文 args 互動 playground（資料表、唯讀逐欄編輯、圖表、時間軸、節點畫布）——
     Controls 面板可調資料筆數、狀態比例、極端值，筆數拉到 0 直接驗空狀態。
   - 元件章 28 頁逐頁掛「在 Storybook 開啟」深連結。
2. **我需要做什麼**：不需要。全是文件與示範層；元件 API、token、registry 內容零變更。AI agent 可改用 `/llms.txt` 當入口。

### 元件無障礙修正

1. **改了什麼**：`DataTable` 每頁筆數下拉補可及名稱、篩選面板補 Esc 關閉；`GraphCanvas` 容器 `role="img"` 改 `role="group"`；
   示範頁的 `SelectTrigger` 全數接上 `Label htmlFor`——**combobox 的可及名稱不能取自值文字**。
2. **我需要做什麼**：用到 `DataTable` 自訂 `labels` 的宿主可加 `perPageLabel`（不加就用預設「每頁筆數」）；
   其他修正重抄元件即得，無 API 變更。

---

## v0.11.0 · 2026-08-06

新增載入態與欄位錯誤態（`Skeleton`、`FormField`、DataTable `loading`），收錄 Toast／Switch／Textarea／RadioGroup／DateRange；錯誤欄不再整格染紅。規範 0.10.0 → 0.11.0；tokens 不動（0.6.0）。

### 載入態與欄位錯誤態

1. **改了什麼**：
   - **載入態規範〈載入中〉**（[色彩語意](book/docs/2-foundations/01-color.mdx)新節）：首載＝**Skeleton**（版面已知不跳動）、
     重查＝**就地變暗保留舊內容**、提交＝disabled＋圖示＋文案（按鈕沒有 loading 變體）。
     載入一律中性（`--muted`），不進提醒色彩色家族。
   - **新增 `Skeleton`／`SkeletonText`**；**`DataTable` 加 `loading`**：首載渲染骨架列（列數＝每頁筆數、上限 15），
     已有資料就地變暗＋`aria-busy`；讀屏出口由容器宣告一次（`role="status"`），骨架塊 `aria-hidden`。
   - **新增 `FormField`／`FieldError`**：「Label＋`aria-describedby`＋`aria-invalid`＋錯誤小字」的固定寫法元件化，
     id 連動自動接好；錯誤三重編碼（色＋圖示＋文字）；與區塊層 Callout 彙總是分工不是取代。
   - **錯誤欄不再整格染紅**：錯誤主訊號是邊框＋文字＋圖示。欄位狀態三層表同步修正。
   - 缺件表劃掉 Skeleton 與 Form 兩列；輸入、資料表、空狀態、按鈕、提醒色辭典、表單頁的文件同步。
2. **我需要做什麼**：想用的專案：`npx shadcn add …/r/skeleton.json`／`…/r/form-field.json`。
   **已在用 `aria-invalid` 樣式鉤子的**：錯誤欄不再整格染紅（深色違規修正）——重抄 Input／Select 兩支，
   或自行拿掉 `aria-[invalid=true]:bg-danger-subtle`。其餘零影響；DataTable 的 `loading` 是新增 prop，不傳＝現況。

### 缺件表六件收錄：Toast、Switch、Textarea、RadioGroup、Skeleton、DateRange

1. **改了什麼**：
   - 頁面章缺件表的前六列全數收錄，替代方案退場；表與認領模板同步刪除六個選項。
   - **Toast 操作回饋**（[27-toast](book/docs/3-components/27-toast.mdx)）：全站固定一種去向——右下、堆疊上限 3、
     success/info/warning 5 秒自動消失（hover/聚焦暫停）、**danger 一律手動關閉**、讀屏 status/alert 分級、z-[70]；
     表單驗證錯誤不進 Toast（貼欄位）。淡底表面與 Callout 共用 `STATUS_SUBTLE_SURFACE`。
   - **Switch**：切了立即生效；送出才生效用 Checkbox，因此沒有「已改動未送出」琥珀態。
   - **Textarea**：逐項鏡射 Input（邊框/聚焦環/aria-invalid/停用）；只准直向調整大小。
   - **RadioGroup**：垂直、每項可帶說明；選中填實心點不只靠顏色；文件附單選四載體分工表（SegGroup/RadioGroup/Select/EditableField）。
   - **Skeleton**：保留真實版面形狀、只用於首載、aria-hidden＋容器 aria-busy、尊重 prefers-reduced-motion。
   - **DateRange 期間選擇 v1**：檔位一等公民（今日/近 7 日/近 30 日/本月）＋自訂起訖；反序自動修正；不做日曆格。
   - Stepper 步驟按鈕補標準聚焦環四件組。
2. **我需要做什麼**：要用就抄：`npx shadcn add <站台>/r/{toast,switch,textarea,radio-group,skeleton,date-range}.json`。
   Switch/RadioGroup 會自動帶入兩個新的 radix 相依。**tokens 維持 0.6.0**——六件全部使用既有 token，npm 端零動作。
   已在用替代方案的畫面不必立刻改，但新畫面請直接用正式件；操作回饋請照 Toast 頁的全站規則收斂。

---

## 2026-08-06（純文件進版，版號未動）

新增頁面章、〈跟上新版〉與回饋入口；元件與 token 不動，不需要重抄。版號維持 0.10.0；tokens 0.6.0。

### 頁面章：元件之上、站台 IA 之下的那一階

1. **改了什麼**：
   - **新章「頁面」（`/pages`，7 頁）**：頁面總覽（五頁型選型表、六條跨頁一致性守則、
     「新專案從頁面開始規劃」三步起手、缺件與替代表）、頁面解剖（頁首→工具→內容→動作的四區骨架），
     與**清單頁、明細頁、表單頁（含多步驟）、儀表板、設定頁**五種頁型——每頁固定骨架：
     一句話定義 → 何時用 → 組成對照表 → 行為規範 → 無障礙 → 活範例 → 最小安裝集 → 缺件與替代。
   - **Storybook 新增「頁面/」頂層分類**：各頁型的典型組成用現有元件組出整頁，文件章各頁直接內嵌。
   - 文件站用 `GraphCanvas`（readOnly）畫四張流程圖（取用方式選擇、導入三階段、更新判斷、新專案起手）。
   - 章節重新編號（無障礙 5→6、治理 6→7）——**所有網址不變**，只有 repo 內檔案路徑改變。
   - 頁面章不發頁面級 registry item。
2. **我需要做什麼**：不用。registry 與 tokens 逐位元不變。新開專案建議從[頁面章](book/docs/5-pages/00-overview.mdx)選頁型起手。

### 預覽站橫幅

1. **改了什麼**：`/preview/` 建置時掛常駐橫幅「dev 預覽站——非發佈版」並連回正式站；正式站與本機不出現。
2. **我需要做什麼**：不用。

### 跟上新版：取用端的更新通知、判斷與程序

1. **改了什麼**：
   - **新頁「跟上新版」（`/governance/staying-current`）**：訊號通道表（Release 通知／CHANGELOG／`npm outdated`／
     `/r/index.json` 檢查片段）、收到訊號後的判斷流程（讀「我需要做什麼」→ 對照台帳 → 衡量差距與影響 →
     跟進／延後／偏離）、每層的更新程序（元件走「重抄＋diff 審查」）、開發中的四個節奏習慣。
   - **打完規範版 tag 後自動建立 GitHub Release**，notes 直接抽 CHANGELOG 該則全文；
     純文件進版不打 tag、也就不發 Release——沒有通知就代表不需要動作。
   - AGENTS.md「相容性與版本」補上通知管道與判斷入口的連結；導入三階段末尾接上「導入之後的每個月」。
2. **我需要做什麼**：想收到新版通知的話：repo 頁 Watch → Custom → Releases（一次設定）。
   建議順手把「跟上新版」頁裡的版本檢查片段放進宿主 CI。

### 文件站 demo 宿主基座：修外框不一致＋宿主的樣式基座

1. **改了什麼**：
   - 修正資料表頁、步驟指示頁的外框不一致：新增 `book/src/css/demo-base.css`，把 preflight 逐條移植到 `.demo-body`
     與 portal 兩個 scope，並反制 Infima 的表格變數。
   - **[Table](book/docs/3-components/12-table.mdx)／[DataTable](book/docs/3-components/13-data-table.mdx)／[Stepper](book/docs/3-components/17-stepper.mdx)
     補「外觀不變量」**：只有列底線、無格線無外框；步驟是無框透明按鈕。
   - **AGENTS.md 新增「宿主前置條件：樣式基座」**：標準 shadcn 宿主天然滿足；嵌進自帶 CSS 的站台照 demo-base.css 的
     scoped 作法，portal 一併涵蓋。
2. **我需要做什麼**：標準 Tailwind／shadcn 宿主**零動作**（你的 preflight 本來就在）。
   只有把元件嵌進關 preflight 的既有站台的取用端，照 AGENTS.md 新節檢查基座。
   tokens 與元件原始碼零變更——npm 不發版、registry 內容不變。

### 回饋入口：三分流接上實際門口

1. **改了什麼**：
   - **三個 Issue 表單**：Bug 回報（最小重現＋規範版號必填）、RFC 提案（五題逐欄、三次法則證據必填）、
     **缺件認領**（下拉列頁面章缺件表，一則＝三次法則的一次證據）；空白 issue 關閉，導向文件站判準。
   - **[回饋與 RFC 流程](book/docs/7-governance/02-rfc.mdx)改版**：三分流表加「入口」欄、守門人具名（@kielchang）、
     提案狀態 `rfc:討論中／已接受／已婉拒／已擱置`（只有守門人動）。
   - **文件站出口**：每頁「編輯此頁」與「回報這一頁」鈕（自動帶頁面網址進 Bug 表單）；navbar「提出建議」；footer 回饋與版本連結。
   - **缺件表可認領**：[頁面總覽](book/docs/5-pages/00-overview.mdx)缺件表加「認領」欄，每列一鍵預填認領表單。
   - **`CONTRIBUTING.md`／`SECURITY.md`**：貢獻操作版一頁；安全回報通道，不必等三次法則。
2. **我需要做什麼**：想提建議的話：repo 的 Issues → New issue 就有三個表單；文件站每頁右上也有「回報這一頁」。

---

## v0.10.0 · 2026-08-06

圖表配色有了單一判斷樹與兩個配色工具（`STATUS_SERIES`、`colorByKey`），文件站的 Storybook 嵌入跟著明暗切換。規範 0.9.0 → 0.10.0；tokens 不動（0.6.0）。

### 圖表配色策略：資料形態前置分支＋三層判斷樹

1. **改了什麼**：
   - **[Charts 圖表](book/docs/3-components/23-charts.mdx)的〈色票〉重構為〈配色策略〉**：一棵判斷樹成為單一入口——
     連續數值先分 Sequential（單色相染色量）／Diverging（`danger-subtle ← muted → success-subtle`，語意色相淡階、
     中性中點、對稱值域）；離散類別走三層：**語意 → 身分 → 區辨**。
   - 判斷樹的紀律：連續數值不套分類色盤；狀態色進圖表用淡底；超過封頂或要強調走 highlight＋mute
     （`capItems` 彙總、`selectedIndex` 淡化），不加色相。
   - **新增兩個配色工具**（`charts/base.tsx`，隨 `charts` registry item 散佈）：
     - `STATUS_SERIES`／`STATUS_SERIES_STRONG`：語意維度的現成色表，與 Badge 同一套語意、同一條強度語法
       （預設淡底，實色只給線與點）。
     - `colorByKey(key, keys)`：以宿主宣告一次的固定鍵清單決定色索引——顏色跟實體走，不跟排序走；
       超出封頂或找不到的鍵退 `muted`。
   - Storybook 新增「語意維度的堆疊」story（正誤並列）。
   - [01-color](book/docs/2-foundations/01-color.mdx)〈分類色票與狀態語意脫鉤〉補上**雙向**敘述（維度是狀態時必須沿用狀態色）；
     [提醒色辭典](book/docs/2-foundations/08-alert-colors.mdx)連到判斷樹。
2. **我需要做什麼**：已抄走 `charts` 的專案想用新工具就重抄一次 `base.tsx`；不用的話零影響。
   畫圖前照判斷樹走一次——特別是**狀態組成的堆疊圖**：維度是狀態就用 `STATUS_SERIES`，不要照序取 `PALETTE`。

### 文件站成為第一個驗收宿主：站台 chrome 橋接 token、嵌入跟主題

1. **改了什麼**：文件站的主色、頁面底、navbar／card／footer、邊框、程式碼底、字體全部改為引用 token，深色自動跟著翻；
   嵌入的 Storybook 帶上文件站的明暗（色相主題不傳，兩邊預設都是石墨）。
2. **我需要做什麼**：不用。純文件站變更，token 與元件零改動。

---

## v0.9.0 · 2026-08-06

收錄八種圖表（`charts` 單一 registry item，一個指令帶走整組）。規範 0.8.0 → 0.9.0；tokens 不動（0.6.0）。

### Charts 圖表實作收錄

1. **改了什麼**：
   - **八種圖＋`Legend`＋共同底座**：`BarChart`／`Pareto`／`StackedBar`／`TrendChart`／`Bullet`／`Scatter`／`Heatmap`／`LineChart`，
     加 `PALETTE`（`var(--chart-N)` 引用）、`capItems`（類別封頂彙總「其他」）、`ChartDataTable`（文字／鍵盤等價表）。
   - **無障礙**：五種座標圖 `role="img"`＋自動生成的 `aria-label` 摘要＋`sr-only` 資料表；`StackedBar`／`Bullet`
     數值在鄰近可見文字、圖形 `aria-hidden`；`Heatmap` 就是真表格（`caption`／`scope`／列標頭）。
   - **鍵盤等價**：有 `onSelect` 的圖，等價表的每一列是真按鈕、Enter 觸發同一個鑽取回呼；表平常 `sr-only`，
     鍵盤焦點進入時現形（skip-link 慣例）。
   - **registry 新增 `charts` 單一多檔 item**：八種圖互相引用共同底座，一個指令帶走整組，相依只有 `@dooping/tokens@^0.6.0` 與 `utils`。
   - 文件頁補活範例與 Storybook 嵌入，〈取用〉改為真實指令。
2. **我需要做什麼**：想用圖表的專案：`npx shadcn add …/r/charts.json` 一次帶走整組。
   已在用色票 token 自己畫圖的：**不受影響**，`--chart-*` 的值沒有任何變動；之後要換成參考實作時再抄。

---

## v0.8.0 · 2026-08-06

新增 `Gantt` 時間軸與 `GraphCanvas` 節點畫布，純加法。規範 0.7.0 → 0.8.0；tokens 不動（0.6.0）。

### 特殊介面：時間軸與節點畫布

1. **改了什麼**：
   - **新增 `Gantt` 時間軸**：檢視與選取用的精簡實作——左欄項目、分類色長條（`--chart-N`）、進度（未完成段蓋
     `--background/45%`）、中性今天線、列選取走 `state-layer`；延誤不把長條染紅（狀態走徽章）。
     零外部相依，不含拖拉排程（改期走「選取＋表單」）。
   - **新增 `GraphCanvas` 節點畫布**：`@xyflow/react` 12.11.2 的薄封裝。43 個 `--xy-*` 變數逐一橋接到語意 token；
     已選＝狀態層 20%、鍵盤聚焦＝`--ring` 外環。
   - `@xyflow/react` 只准在 `graph-canvas.tsx` 裡 import；`graph-canvas.json` 會幫取用端裝它
     （全 registry 唯一帶第三方 UI 套件的 item）。
   - 文件 `24-gantt.mdx`、`25-graph-canvas.mdx`，各嵌活範例。
2. **我需要做什麼**：純加法，既有元件與 token 一個都沒動。要用節點畫布的專案會由 registry item 自動裝上 `@xyflow/react`；
   抄走之後不要在其他檔案 import 它（建議連隔離守衛一起抄）。

---

## v0.7.0 · 2026-08-05

聚焦環改中性，設了 `data-color-theme` 的宿主要更新 `@dooping/tokens` 到 0.6.0；`/r/index.json` 新增 `tokensVersion`。規範 0.6.1 → 0.7.0；tokens 0.5.0 → 0.6.0。

### 版號配對模型：規範 ↔ tokens 的對應寫進 `/r/index.json`

1. **改了什麼**：
   - **`registry/index.json` 新增 `tokensVersion` 欄位**——「這一版規範配哪一版 token」的機器可讀正本。
   - `v*` tag 訊息帶「tokens 配對版：x.y.z」（`git tag -n9` 看得到配對史）。
   - **[版本策略](book/docs/7-governance/01-versioning.mdx)新增〈三層版號的對應關係（配對模型）〉**：規範與 tokens 各自 SemVer，
     對應靠宣告、不靠同號；多對一合法（同一版 tokens 可配多版規範）。`AGENTS.md` 補取用端自查指令。
2. **我需要做什麼**：不用。`tokensVersion` 是新增欄位，既有取用流程不受影響。
   想確認自己的 token 與設計書配不配：`npm ls @dooping/tokens` 對照 `/r/index.json` 的 `tokensVersion`。

### 聚焦環改中性、主題色相預算定案

1. **改了什麼**：
   - **`--ring` 改回中性**：主題層不再覆蓋聚焦環，六個主題全部回落 `:root` 的中性基礎值
     （淺 `222.2 84% 4.9%`／深 `210 30% 80%`）；其餘值零變動。
   - **色相預算**：主題色相只進識別層——動作、互動、聚焦一律中性。
     [深淺主題](book/docs/2-foundations/06-theming.mdx)加〈色相預算〉速查表。
   - **新增[提醒色辭典](book/docs/2-foundations/08-alert-colors.mdx)**：八個提醒色（四狀態 × 兩強度、destructive、edit 琥珀、
     兩種欄位色）每色一節固定格式——定義／token 家族／使用場景／反例／對比保證，
     外加「同框互動」（提醒色 × 聚焦環 × 選取層的分工）與「擴充程序」（有限枚舉，新增走 RFC）。
2. **我需要做什麼**：**元件不用重抄**（只有 coachmark 的註解變了），但**要更新 `@dooping/tokens` 到 0.6.0**。
   設了 `data-color-theme` 的宿主，聚焦環會從主題色變成中性——這是刻意的視覺變更；
   沒設主題的（石墨）**什麼都不會變**，石墨的 ring 本來就是這個中性值。

### 零截圖文件示意與 Mockup：多步流程播放器、何時嵌 Storybook

1. **改了什麼**：
   - **[零截圖文件示意](book/docs/4-patterns/10-zero-screenshot-docs.mdx)**改寫〈取捨〉，並新增〈多步流程播放器〉與
     〈互動示意：什麼時候該嵌 Storybook〉兩節。
   - **[Mockup](book/docs/3-components/21-mockup.mdx) 新增〈播放器的元件層規約〉**（減少動態偏好／控制項尺寸／小螢幕橫向捲動／字幕格式）。
   - [漂移防護](book/docs/7-governance/03-drift-guards.mdx)逐支標明「在本 repo 跑不跑」。
2. **我需要做什麼**：**不用做任何事。** 沒有動 `packages/react`、token 值，或任何會進 registry 的檔案。

---

## v0.6.1 · 2026-07-30

registry item 開始帶 `@dooping/tokens` 相依，`npx shadcn add` 會順手裝對 token；新增四份知識頁與圖表規範。規範 0.6.0 → 0.6.1；tokens 不動（0.5.0，已發佈 npm）。

### registry item 帶上 token 相依

1. **改了什麼**：registry 每個 item 的 `dependencies` 補上 `@dooping/tokens@^<宣告版>`（目前是 `^0.5.0`，29 個 item 全部）。
   `^0.5.0` 在 0.x 等於 `>=0.5.0 <0.6.0`：同 minor 的修補自動吃，跨 minor 要重抄元件。
2. **我需要做什麼**：**不用改任何程式碼**——這一版沒有動元件原始碼，也沒有動任何 token 值。
   但下一次 `npx shadcn add` 會**順手把 `@dooping/tokens@^0.5.0` 裝上**。

### 四份新知識頁＋圖表規範

1. **改了什麼**：
   - [怎麼選一組分類色票](book/docs/2-foundations/07-choosing-a-palette.mdx)：換品牌色時選出分類色票的程序。
   - [後台系統的資訊架構](book/docs/4-patterns/11-back-office-ia.mdx)：整個系統的骨架。
   - [功能開關](book/docs/4-patterns/12-feature-flags.mdx)：「做好了但還不能給人看」的標準解。
   - [符合性台帳](book/docs/7-governance/05-conformance-ledger.mdx)：導入之後每個月怎麼跟上游走。
   - [Charts 圖表](book/docs/3-components/23-charts.mdx)：八種後台閱讀型零相依 SVG 圖的**規範**
     （邊界／資料形狀／參數／無障礙義務），實作後收。
   - 文件可用 `StoryFrame` 把 Storybook 的 story 以 `iframe` 嵌進來；元件總覽〈不收什麼〉改寫；〈導入〉末段連到符合性台帳。
2. **我需要做什麼**：**取用端不用做任何事。** 沒有動 `packages/react`、token 值、或任何會進 registry 的檔案。

---

## v0.6.0 · 2026-07-30

有視覺變更：互動狀態層、徽章改淡底、淡底與圖表色重新生成、石墨無品牌色；重抄元件時必須同時把 `@dooping/tokens` 更新到 ≥ 0.5.0。規範 0.4.0 → 0.6.0；tokens 0.3.0 → 0.5.0。

### brand 的邊界：石墨改為無品牌色

1. **改了什麼**：
   - **石墨（預設主題）的 `--brand` 改為鏡射 `--primary`**，深色的 `--brand-foreground` 一併鏡射 `--primary-foreground`。
   - **`Button` 的 `brand` variant 補上禁用範圍**：確認／送出／儲存一律用 `default`；`brand` 只做識別。
   - 文件新增〈brand 的邊界〉一節（含色相慣例表）；Storybook 的按鈕 story 補一組正／誤並列對照。
2. **我需要做什麼**：不設 `data-color-theme` 的**什麼都不用做**，但預設主題下 `variant="brand"` 的按鈕
   會從灰藍變成與 `default` 相同的近黑／近白。若你的專案已經在用 `variant="brand"` 做確認按鈕，建議改回 `default`。

### 互動狀態層：hover／pressed／已選改為疊加

1. **改了什麼**：
   - **新增三個 token**：`--state-hover-alpha` 6%、`--state-pressed-alpha` 14%、`--state-selected-alpha` 20%
     （是**強度**不是顏色，淺深共用一組）。
   - **新增 `.state-layer` utility**：在元件自己的底色上疊一層 `currentColor`，走 `background-image`
     （在 `background-color` 之上、內容之下）。
   - **十支元件改用狀態層**（Button／Table／Chips／TabPills／SegGroup／Select／DataTable／Coachmark／Dialog／Label），
     16 處 `hover:bg-*` 收成一組強度；全系統第一次有 pressed 狀態。
   - 三處一致性修正：`label.tsx` 的停用透明度 70% → 50%；`coachmark.tsx` 的聚焦環 `ring-primary` → `ring-ring`；
     `dialog.tsx` 的關閉鈕 `focus:` → `focus-visible:`。
   - 已選的列不得再用弱化文字（`--muted-foreground`）。
2. **我需要做什麼**：**元件的 API 完全沒動**，但互動外觀變了，抄過原始碼的專案需要重抄那十支
   （或至少 `Button` 與 `Table`）。同時**必須更新 `@dooping/tokens`**——
   `.state-layer` 由 tokens.css 提供，只重抄元件而不更新 token 會讓所有 hover 消失。

   自訂元件想接上狀態層：加 `state-layer` class，拿掉自己的 `hover:bg-*` 與 `transition-colors`。
   唯一的陷阱是 `background` **簡寫**會把 `background-image` 重設成 `none`，狀態層整個消失——
   用 `background-color`（Tailwind 的 `bg-*` 不受影響）。

### 淡底改用等染色量、徽章改走淡底層、分類色不得靠近狀態色

1. **改了什麼**：
   - **四個 `-subtle` 淡底重新生成**：參數從「固定明度＋固定彩度」改為**固定染色量**，四種淡底看起來等量。
   - **狀態徽章預設改走淡底層**：`success`／`warning`／`info`／`danger` 從實色填底改為 `--{狀態}-subtle`＋
     `--{狀態}-subtle-foreground`；新增 `intensity="high"` 逃生門保留實色（與 `Callout` 同一套語彙）。
   - **`Callout` 低強度的左粗邊改用 `border-l-current`**（＝與內文同色），三邊細邊框的透明度統一為 `/30`。
   - **圖表 8 色重新生成**：分類色不得靠近任何狀態色（色相 ≥20° 或 ΔE00 ≥18）。
2. **我需要做什麼**：⚠️ **這一版有視覺變更，三類。**
   1. **狀態徽章從實色變淡底。** 抄走 `Badge` 的要重抄。若某處確實需要實色，
      傳 `intensity="high"`——但**不要用在資料表裡**。
   2. **四種提示框的淡底換值**，左粗邊從全飽和狀態色變成與內文同色的中間階。抄走 `Callout` 的要重抄。
   3. **圖表 8 色整組換值**，淺深都換。直接吃 `var(--chart-N)` 的不用動；把 hex 抄進程式碼的要重抄。

---

## v0.4.0 · 2026-07-29 · 3a9e78a

色彩系統重建：六組色相主題、`--brand`、提醒視窗雙強度、欄位驗證狀態；有視覺變更（圖表色、狀態徽章字色、提示框）。規範 0.2.1 → 0.4.0；tokens 0.1.2 → 0.3.0。

### 色彩系統重建

1. **改了什麼**：
   - **新增多色相主題**：六組（石墨／靛藍／藍紫／紫晶／青玉／苔綠），宿主在 `<html>` 設 `data-color-theme="<name>"` 切換，
     與既有的深淺模式正交。
   - **新增 `--brand` 三件組**（`--brand`、`--brand-subtle` 與各自的 `-foreground`）。`--primary` 不變——維持中性近黑，
     承擔絕大多數控制項；`--brand` 只給一頁一顆的關鍵動作。`Button` 新增 `variant="brand"`。
   - **`--ring` 改吃主題色相**（原本是中性近黑）。
   - **圖表 8 色全部重新生成，淺深各一組獨立值**；紅綠色盲下任兩色 ΔE00 不低於 10。
   - **修正八處 WCAG AA 違規**：`success`／`warning`／`info` 的前景改為同色相深墨（填色不動），
     `destructive`（淺）與 `danger`（深）的填色壓深（保留白字）。
2. **我需要做什麼**：⚠️ **這一版有視覺變更，三類。**
   1. **圖表色票整組換值。** 直接吃 `var(--chart-N)` 的不用動；把 hex 抄進程式碼的要重抄。
      舊值與新值沒有任何一色相同。
   2. **`success`／`warning`／`info` 徽章的文字從白色變成同色相深墨。**
      填色沒變，所以徽章看起來還是原本那個顏色，只有字色變深。這是無障礙修正，不是改風格。
   3. **`destructive` 刪除鈕（淺色）與 `danger` 徽章（深色）的紅色略深**（並排才看得出來）。

   不想要色相主題的**什麼都不用做**：不設 `data-color-theme` 時預設是石墨，
   `--brand` 是中性灰藍，觀感與原本一致。

### 提醒視窗雙強度、欄位驗證狀態、中性色帶主題色相

1. **改了什麼**：
   - **中性色跟著主題轉色相**：`background`／`card`／`popover`／`muted`／`secondary`／`accent`／`border`／`input`／
     `field-*`／`muted-foreground` 共 12 個，只轉色相、L 與 chroma 不動。
   - **提醒視窗改雙強度**：新增 `--{狀態}-subtle` 與 `-subtle-foreground` 共 8 個 token；
     `Callout` 新增 `intensity`（`low` 預設／`high` 實色）與 `live`（是否即時播報）。
   - **欄位驗證狀態**：`Input`／`Select` 支援 `aria-invalid`（`--danger` 邊框＋`--danger-subtle` 底），
     `Checkbox` 支援不合格邊框；三支同時補上 `ring-offset`。用了 `ring-ring` 就必須有 `ring-offset`。
   - **`Callout` 的 `role`**：預設 `note`；只有傳 `live` 才成為 live region。
   - 狀態色的色相不隨主題調整；主題色相須距任何狀態色 ≥25°，`--brand` 的 chroma 須低於 `--danger`。
2. **我需要做什麼**：⚠️ **`Callout` 的四種變體外觀改變。** 低強度從「實色壓 10%」改為實色淡底＋左粗邊，
   文字色從實色狀態色改為對淡底反解的深墨。API 相容（既有用法不必改），但畫面會不一樣。

   抄走 `Input`／`Select`／`Checkbox` 的要重抄——聚焦環從 `ring-1` 無 offset 改為 `ring-2` + `ring-offset-2`。

---

## v0.2.1 · 2026-07-29 · 45cc104

示範資料改為抽象中性；只有 `Delta`、`Badge` 兩支的註解文字有變，不需要動作。規範 0.2.0 → 0.2.1。

1. **改了什麼**：示範情境整套改為抽象中性（`項目／單位／類別／負責組別／狀態`，值用甲乙丙丁），不綁死任何產業；
   `Delta`、`Badge` 兩支元件的註解文字跟著改。
2. **我需要做什麼**：**不用做任何事。** 元件的 API 與行為完全沒動，只有 `Delta` 與 `Badge` 兩支的
   **註解文字**有變（registry 逐字複製檔案內容，所以仍給了版號訊號）。重抄那兩支或不抄，都不影響行為。

---

## v0.2.0 · 2026-07-29 · da80faa

⚠️ breaking：套用 `@dooping/tokens/tailwind-preset` 後 Tailwind 預設色盤消失；新增可複製的 `templates/eslint.dooping.cjs`。規範 0.1.0 → 0.2.0。

1. **改了什麼**：
   - **編譯層防線**：`@dooping/tokens` 的 Tailwind preset 從 `theme.extend.colors` 改為**覆蓋 `theme.colors`**，
     套用 preset 後 Tailwind 預設色盤整個消失。
   - **新增 `templates/eslint.dooping.cjs`**：擋掉繞過編譯層的逃逸路徑——Tailwind arbitrary color（`bg-[#fff]`）、
     inline style 硬編色、深入上游內部路徑。
   - 治理章「漂移防護」改寫為三道防線（編譯層／lint／測試），並指向可直接複製的產物。
2. **我需要做什麼**：⚠️ **這是 breaking change。** 若你的專案已套用 `@dooping/tokens/tailwind-preset`
   且用到 Tailwind 預設色盤（`bg-red-500`、`text-slate-600`…），升到 `v0.2.0` 後那些 class 會**不再產生樣式**。兩條路：
   1. **建議**：改用語意色（`bg-danger/10`、`text-muted-foreground`…）
   2. 真的需要額外色階：在自己的 `tailwind.config.js` 用 `theme.extend.colors` 加回去——那是明示的例外，會出現在 diff 裡

   保留的結構性色值：`transparent`、`current`、`inherit`、`white`、`black`。
   間距、圓角、字級刻度**完全不受影響**。

---

## v0.1.0 · 2026-07-29

規範版號 `vX.Y.Z` 統一成一個號碼：GitHub tag、registry 戳記與 `/r/index.json` 的 `version` 相同；大＝會壞、中＝有新東西、小＝修正。不需要動作。

1. **改了什麼**：建立統一的規範版號 `vX.Y.Z`：正本是根目錄 `package.json` 的 `version`，`main` 部署成功後自動蓋成 GitHub tag
   （版號沒動就不打、日期在 tag 描述）；registry 戳記改由規範版號產生。`@dooping/tokens` 的 npm 版號維持獨立。
2. **我需要做什麼**：無。沒有 token 值變更，也沒有元件 API 變更；規範版號維持 `0.1.0`，首次進版會蓋出基準 tag `v0.1.0`。

---

## 2026-07-29 · fdda051

registry item 與 `index.json` 開始帶 `version` 戳記；`/preview/` 預覽站不可參照。不需要動作。

1. **改了什麼**：
   - **新增 `dev` 預覽站**：推 `dev` 即部署到 `/preview/`（含 Storybook）；預覽站隨時會被覆蓋，不是進版，不可被其他系統參照。
   - registry 的每個 item 與 `index.json` 加上 `version` 戳記。
   - 版本策略補上「什麼不該發版」；`AGENTS.md` 補上「相容性與版本」。
2. **我需要做什麼**：無。沒有 token 值變更，也沒有元件 API 變更。

---

## `@dooping/tokens` 版本

0.6.0 起，tokens 的變更記在各規範版那一則（標題下一行寫出 tokens 版號）；本節保留 0.5.0 以前的獨立紀錄。

### 0.5.0

1. **改了什麼**：四個 `-subtle` 淡底與 8 色分類色票（淺深兩組）全部重新生成。沒有新增或刪除任何 token 名稱。
2. **我需要做什麼**：直接吃 CSS 變數的不用動，但**畫面會變**——提示框的淡底、圖表的每一色都是新值。
   把 hex 抄進程式碼的要重抄。

### 0.4.0

1. **改了什麼**：新增 `state` 群組（`--state-hover-alpha` 6%、`--state-pressed-alpha` 14%、`--state-selected-alpha` 20%）
   與 `.state-layer` utility；JS API 新增 `state` 匯出。
2. **我需要做什麼**：純加法，既有 token 一個都沒動。要用互動狀態層就更新到這一版，否則元件抄過去會沒有 hover。

### 0.1.2

1. **改了什麼**：`exports` 開放 `./package.json` 子路徑，`require("@dooping/tokens/package.json")` 不再噴 `ERR_PACKAGE_PATH_NOT_EXPORTED`。
2. **我需要做什麼**：無須調整。

### 0.1.1

1. **改了什麼**：**沒有內容變更。**
2. **我需要做什麼**：無須調整。可直接使用 0.1.2。

### 0.1.0

1. **改了什麼**：首次發佈。35 個語意色（淺／深成對）、8 色色盲友善圖表色票、圓角／間距／字級／陰影／動態、
   互動尺寸（WCAG 2.5.5 觸控目標）。產物皆框架中立：`tokens.css` 為純 CSS 變數（不含 Tailwind 指令），
   另附 Tailwind preset 與型別化 JS API。深色同時支援 `.dark` 與 `[data-theme="dark"]` 兩種宿主鉤子。
2. **我需要做什麼**：見[導入三階段](book/docs/7-governance/04-adoption.mdx)。
