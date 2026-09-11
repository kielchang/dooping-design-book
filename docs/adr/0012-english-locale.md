# ADR-0012：收英文為完整第二語系——正本仍是繁中，元件庫不翻譯

- **狀態**：提議中（實作＝PR #21 收斂後合併＋對等守衛上線，屆時改「已採用」）
- **日期**：2026-08

## 背景

2026-08-11 外部貢獻者送來 [PR #21](https://github.com/kielchang/dooping-design-book/pull/21)：
為文件站加一個英文語系，+7676／−1423，100 個檔。CI 卡在「首次貢獻者需人工放行」
八天沒動——**擋住它的不是 CI，是這件事沒有決策**。

多語系從來沒有被決定過。文件站現在是 `i18n: { defaultLocale: "zh-Hant", locales: ["zh-Hant"] }`
（`book/docusaurus.config.ts:39`），單語是預設值而不是選擇。

**流程上的偏離，記錄下來**：[ADR-0009](0009-feedback-via-issue-forms.md) 定的路徑是
RFC issue →（守門人標 `rfc:已接受`）→ 開 ADR（提議中）→ 實作 PR 合併時改「已採用」。
這一則反過來——PR 先到，ADR 後補。原因是外部貢獻者不會知道這裡的流程，
而把一份已經做完的工作退回去要求先開 RFC，是拿流程懲罰善意。
補寫 ADR 是為了讓**決定**留在決策紀錄裡，不是為了追認流程。

### PR #21 實際改了什麼（不是「只加一個語系」）

100 個檔裡 88 個是 `book/i18n/en/` 的新譯文，剩下 12 個動到中文正本與元件庫：

| 檔案 | 變動 | 性質 |
| --- | --- | --- |
| `AGENTS.md` | +102／−172（淨刪 70 行） | **正本被英文版覆蓋**，不是新增譯文 |
| `book/static/llms.txt` | +52／−50 | 同上 |
| `.storybook/preview.tsx` | +7／−7 | storySort 的**分類名稱** |
| `packages/react/src/charts/charts.stories.tsx` | +71／−66 | **story 的 title 與 export 名** |
| `packages/react/src/charts/{bar-chart,base,bullet}.tsx` | +7／−7 | 元件原碼的內建文案 |
| `book/src/components/{Demo,flow-diagrams}.tsx`、`theme/DocItem/Content` | +51／−51 | 文件站元件的內嵌字串 |

## 選項

| 選項 | 說明 |
| --- | --- |
| A. 維持單語 | 婉拒 PR，留一句可被推翻的理由 |
| **B. 收 `en` 為完整第二語系** | `book/docs/` 仍是正本，`book/i18n/en/` 是譯文；補對等守衛 |
| C. 只英譯取用入口三頁 | `1-start/*`＋`AGENTS.md`＋`llms.txt`，規範本文維持中文 |

## 決定

**採 B，但收斂範圍，並且守衛先行。**

### 1. 正本語言是 `zh-Hant`，英文是譯文

`book/docs/**` 是規範的唯一正本。`book/i18n/en/**` 是它的譯文——
譯文落後不擋建置（那會讓每一次改中文都被英文卡住，結果是沒人敢改規範），
但**落後必須看得見**（見第 3 點的守衛）。

### 2. 元件庫與 story 一個字都不翻

`packages/react/src/**` 的 story `title`／export 名、`.storybook/preview.tsx` 的
storySort 分類、元件內建文案的**預設值**——全部維持中文，不在本則的收錄範圍內。

不是美學偏好，是這些字串是三支守衛的**鍵**：

- `tests/doc-hooks.test.ts`：中文文件裡每一個 `<StoryFrame id="元件-基礎-…">`
  都由 story title 推導。翻譯 title＝中文文件的嵌入範例全部變成空白 iframe，
  而且**不會報錯**（那正是這支守衛存在的理由）。
- `tests/story-sort.test.ts`：storySort 的 order 字串與實際分類必須逐字吻合。
- `scripts/verify-storybook.mjs`：play function 用中文可及名稱查詢元素。

**取用端要英文介面走既有的路**：元件的共同約定第 4 條「文案可覆寫」——
多字串元件（DataTable、Coachmark、EditableField…）都吃 `labels` prop。
英文宿主傳自己的 `labels`，這條路早就在，不必動預設值。

### 3. 對等守衛先於譯文合併

新增 `tests/i18n-parity.test.ts`：

| 檢查 | 嚴重度 |
| --- | --- |
| `book/i18n/en/docusaurus-plugin-content-docs/current/**` 的相對路徑集合 ⊆ `book/docs/**` | **紅**（幽靈譯文＝正本已刪／改名，沒同步） |
| 每個譯文檔有 front matter `title` | **紅** |
| 尚未翻譯的頁 | 列成清單輸出，**不擋** |
| `de-domain.test.ts` 的 `SCAN_DIRS` 加入 `book/i18n` | **紅**（詞表第四層本來就是英文領域詞，英譯更容易踩到） |

沒有守衛的兩份規範一定漂移，而漂移在文件上是安靜的——這與治理章〈漂移防護〉
的其餘七支是同一條規則，不因為「只是翻譯」而放寬。

### 4. `AGENTS.md` 與 `llms.txt` 是正本，不是譯文落點

兩者都由 `book/scripts/sync-root-docs.mjs` 在 build 前同步上站。
英文版走**新增**：`AGENTS.en.md`、`book/static/llms-en.txt`，
中文正本一行都不刪。PR #21 對這兩個檔的修改不收。

### 5. 退場

`locales` 收回 `["zh-Hant"]`、刪 `book/i18n/en/`、移除守衛。
零取用端影響——文件站沒有 API 契約，registry 與 npm 完全不碰。
這是本則風險最低的一點，也是敢收的原因。

## 理由

1. **這套系統的取用端已經包含 AI**（`llms.txt`、`AGENTS.md` 是 v0.11.1 就有的入口）。
   英文是 AI 取用的最短路徑，也是唯一一次有外部貢獻者主動投入的方向——
   治理章〈回饋與 RFC 流程〉（正本 `book/docs/7-governance/02-rfc.mdx`）的三次法則管的是**元件收錄**，
   不管文件語系；語系沒有「抽錯介面就沒人敢改」的風險，錯了刪掉就好。
2. **選 B 而不是 C，因為 C 的邊界守不住。** 「只英譯入口三頁」聽起來便宜，
   但入口頁的職責就是把人導向規範本文——導過去是中文，等於沒有英文。
   真正的成本不在頁數，在**維護兩份的紀律**，而那個成本 C 一樣要付。
   既然要付，就付在完整的那一份上。
3. **但拒收元件庫的翻譯，因為那裡的字串是守衛的鍵。** 文件翻錯了讀者看得到；
   story title 翻了，中文文件會安靜地變成一排空白 iframe。
   兩者的失敗代價差一個量級。
4. **不因為 PR 已經做完就整包收下。** 「別人花了力氣」不是收錄理由——
   這與三次法則要防的是同一種壓力。收斂範圍要在 PR 上講清楚理由，不是默默改掉。

## 影響

- `book/docusaurus.config.ts` 的 `locales` 加 `en`；建置時間約翻倍
  （`onBrokenLinks: throw` 兩個語系各跑一次），CI 要接受這個成本。
- 新增守衛 `tests/i18n-parity.test.ts`；`de-domain` 的 `SCAN_DIRS` 加 `book/i18n`。
  依 CLAUDE.md 的規矩，兩者都要**反向驗證**（先造一個幽靈譯文、先塞一個英文領域詞，
  確認真的會紅）。
- 治理章〈漂移防護〉新增一條（語系對等），〈回饋與 RFC 流程〉補一句：
  文件語系不走三次法則，走本則。
- PR #21 需要收斂：保留 88 個 `book/i18n/en/**` 譯文與 `docusaurus.config.ts` 的
  `locales`，撤回對 `AGENTS.md`／`llms.txt`／`.storybook/preview.tsx`／
  `packages/react/src/**`／`book/src/components/**` 的修改。
- 規範版號**不動**——文件語系不是元件或 token 的變更（見治理章〈版本策略〉：
  改文件進 `main`、站台更新，但不 bump npm 版號）。
