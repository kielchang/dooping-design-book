# 符合性台帳（內部試裝宿主）

上游版本：v0.13.0（tokens 0.7.0）　最後對照日：2026-09-10

這個宿主是範本：**元件全部「遵循」、不允許刻意偏離**——`npm run host:check` 在 CI 擋任何差異。
取用端自己的台帳會有「自製」與「刻意偏離」，格式照 AGENTS.md 的骨架。

| 本地實作 | 狀態 | 上游對應 | 原因（偏離必填） |
| --- | --- | --- | --- |
| 五種頁型與外殼用到的全部元件 | 遵循 | `dooping.install.json` 的 item 與其遞移相依 | — |
| 網址狀態 adapter（`src/url-adapter.ts`） | 自製 | `use-table-url-state` 的 `UrlStateAdapter` 注入點 | 元件庫刻意不綁路由，adapter 本來就由宿主提供 |
| 主題切換（`src/theme.tsx`） | 自製 | 契約：主題掛 `documentElement` | 宿主的責任，元件庫不提供 |

## 不需要對齊

- 路由（react-router）、部署 base、示範資料的頁面組合方式——與上游無關的宿主本地決定。

## 回饋（ADR-0011 的內部補充證據）

> 以下是**內部試裝**的觀察，證據強度低於真實宿主；ADR-0011 判準②仍等真實子系統的導入回報。

1. **BackLink 只渲染真 `<a>`，不吃路由元件。** SPA 宿主點下去是整頁重載，
   而且 `href` 要自己帶上部署 base（預覽站在子路徑下）。範本不改元件，只能照做。
   建議：`BackLink` 比照 `SidebarNav` 提供 `renderLink`。
   **已處理（同版 v0.13.0）**：`BackLink` 與 `Breadcrumb` 都有 `renderLink`；明細頁改注入 react-router 的 `Link`，
   `href` 不再自己補 base。
2. **`useTableUrlState` 的 prefix 只隔離讀、沒有隔離寫。** 預設 `historyAdapter.set` 整串覆寫網址參數，
   同頁的其他參數（清單頁的 `view`）會被洗掉；兩張表各帶 prefix 也會互相覆蓋。
   宿主 adapter 目前自行合併。建議：hook 在寫入前保留非本表的參數，並補一支測試。
   **已處理（同版 v0.13.0）**：hook 寫入改走 `mergeTableSearch`（只替換本表參數），測試含 hook 本身的寫入路徑；
   宿主 adapter 拿掉自行合併、不再需要 prefix 參數。
3. **`FormField` 包不了 Radix `Select`。** FormField 把 `id`／`aria-*` 注入唯一的子元素，
   而 Select 能聚焦的是 `SelectTrigger`、不是根元件——表單頁與設定頁的下拉因此照 Label＋id 手接。
   建議：文件講清楚，或讓 FormField 支援 render prop。
   **已處理（同版 v0.13.0）**：`FormField` 的 `children` 可傳函式；表單頁與設定頁的下拉改走 FormField。
4. **清單頁的兩條規範撞在一起：整列可點＋批次勾選。** 〈清單頁〉同時要求「整列可點」與
   「勾選後出現批次列」；DataTable 同時開 `onRowClick` 與 `selectable` 時，可聚焦的列裡包著勾選框——
   axe `nested-interactive`（serious），螢幕閱讀器把整列當成一個控制項，裡面的勾選框失去獨立語意。
   `verify:host` 第一次跑就抓到；Storybook 沒有同時開兩者的 story，所以一直沒被發現。
   宿主暫時只開整列可點。建議：DataTable 在 `selectable` 時改用首欄連結當列入口（或提供 grid 鍵盤模式），
   〈清單頁〉同步寫清楚兩者怎麼並存，並補一支同時開兩者的 story。
   **已處理（同版 v0.13.0）**：整列可點的鍵盤與讀屏入口改成首欄的真按鈕，列本身不再是 `role="button"`；
   新 story「整列可點與批次勾選」讓 `verify:storybook` 的 axe 照得到這個組合。清單頁恢復批次勾選（匯出所選）。
5. **真的 `npx shadcn add` 會刪掉檔案開頭的註解。** `shadcn@4.21.0` 安裝時，把從第一行起的那段註解整段拿掉——
   command、sidebar、sidebar-nav、csv、download、forms-diff 六個檔的「為什麼這樣設計」說明，
   在走 CLI 的取用端消失；註解寫在 import 之後的其餘 50 個檔逐位元組相同。
   `host-sync` 保留完整內容，所以兩條安裝路徑目前就差這六段註解。
   建議：設計理由一律寫在第一個 import 之後（或改成 export 上的 JSDoc），並加一條 registry 守衛擋「內容以註解開頭」。
   **已處理（同版 v0.13.0）**：以註解開頭的其實是七個檔（另有宿主沒裝的 mockup）。說明移到最後一個 import 之後，
   沒有 import 的 csv／forms-diff 併進後面 export 的 JSDoc、download 寫進函式內；
   新守衛 `tests/registry-content.test.ts` 擋 registry 內容以註解開頭。重跑 CLI 後 56 個檔逐位元組相同。
6. **手機看預覽站：清單表格水平捲動時，捲過去的欄位從凍結欄透出來。** 兩個原因疊在一起：
   十字對準的 `bg-gradient-to-r` 經 `cn()` 合併掉凍結格的 `bg-background`（tailwind-merge v3 把它當底色，v2 不會）；
   勾選欄被表格自動版面壓到 32px，凍結首欄卻 sticky 在 `left: 2.5rem`，中間多出 8px 縫。
   `verify:host` 原本只在桌面寬度看清單頁，表格不必捲，所以沒看見。
   **已處理（同版 v0.13.0）**：`utils` 把 `bg-gradient-to-*` 登記回背景圖片群組、勾選欄加 `min-w-10`；
   `verify:host` 加 390px 寬的「凍結欄」情境，對修正前的宿主跑出 3 條紅。
   宿主照取用端的路更新：`host-add --dry-run data-table` 預覽出 3 個會覆寫的檔（`utils`、`table`、`data-table`，
   其餘相依標 identical 跳過）→ 真的覆寫 → `host-sync` 零差異。

## 工具

| 工具 | 版本 | 最後執行 | 結果 |
| --- | --- | --- | --- |
| shadcn CLI（`scripts/host-add.mjs`） | 4.21.0 | 2026-09-10 | 56 個檔逐位元組相同（第一次跑 50／56：開頭註解被 CLI 刪掉的 6 個已修，見回饋 5）。更新 data-table 時 `--dry-run` 列出 3 個要覆寫的相依檔（見回饋 6） |
| dooping-check（`scripts/dooping-check.mjs`） | 隨 registry | 2026-09-10 | lock 記 35 個 item，全部已是最新。`npm run host:sync` 重建 lock，`npm run host:check` 以 `--strict` 跑例行檢查（ADR-0013 第二層） |
