# ADR-0013：元件更新訊號——registry 逐 item 指紋、Release 列出受影響的 item、取用端 lock 檢查

- **狀態**：已採用（第一、三層 2026-09 上線；第二層接著做，完成時在本則補記）
- **日期**：2026-09

## 背景

元件以 registry 複製分發（[ADR-0004](0004-registry-over-npm-package.md)），抄走之後就與上游脫鉤。
取用端要跟上，得先知道「上游動了，而且動到我抄的東西」。現有的訊號（文件站〈跟上新版〉）：

| 訊號 | 粒度 |
| --- | --- |
| GitHub Release（`vX.Y.Z`） | 整個規範一個版號 |
| CHANGELOG「我需要做什麼」 | 人讀的散文 |
| `/r/index.json` 的 `version` | 所有 item 共用同一個版號 |
| 符合性台帳記的上游版號 | 手寫 |

2026-09 在手機上看預覽站，抓到 DataTable 水平捲動時凍結欄透出（CHANGELOG v0.13.0 的對應工作項）。
修正主要落在 `utils`——一個取用端從來不會主動去抄的 item。這一例把缺口照得很清楚：

1. **版號太粗**：版號只說「規範動了」，不說「動到哪幾個 item」。
2. **相依是盲點**：只比對自己抄的 `data-table` 找不到問題；要沿相依閉包看，才會發現 `utils` 變了。
3. **沒有機器可讀的安裝紀錄**：台帳是手寫的，工具無從針對「我裝了哪些」去比。

同時實測到一件好消息：shadcn CLI 4.21 的 `add <item> --dry-run --diff` 已經會沿相依列出哪些檔會被覆寫、逐檔差異
（只重抄 `data-table`，它正確列出 `utils`、`table`、`data-table` 三個，其餘 12 個標為相同）。
**缺的不是看差異的工具，是「什麼時候該去看、該看哪幾個」的訊號。**

## 選項

| 選項 | 換到 | 付出 |
| --- | --- | --- |
| A. 每個 item 各自 semver | 人看得懂 | 每次改動都要人判斷 bump；相依變了要不要連帶 bump 又是一次判斷，漏一次訊號就失真 |
| B. 內容指紋（含相依閉包） | 產生器算、零判斷、相依自動傳遞 | 指紋本身沒有語意，要搭配 CHANGELOG 讀 |
| C. 只靠 CLI 的 `--dry-run --diff` | 零開發 | 取用端得對每個 item 定期跑，實際上沒人會做 |
| D. 同步 bot 自動開 PR | 取用端最省事 | ADR-0004 已拒絕自動合併；以一人維護的規模是過度工程 |

## 決定

採 **B**，分三層，依序上線：第一、三層只動上游，先做；第二層需要取用端配合，後做。

### 第一層：registry 發布逐 item 指紋

`build-registry` 在 `/r/index.json` 的每個 item 加上 `meta.hash` 與 `meta.closureHash`
（shadcn 的 registry item schema 允許 `meta`，CLI 不讀它）。

- **`hash`**：取用端抄走的東西的指紋。依序串接下列各行，以換行分隔，取 SHA-256 的前 16 個十六進位字元：
  - `name <名稱>`、`type <型別>`
  - `deps <npm 相依，排序後以空白串接>`
  - `registryDeps <registry 相依的 item 名稱，排序後以空白串接>`
  - 每個檔依 `target` 排序，各一段：`file <target> <type> <內容長度>`，換行後接內容
  - 排序一律照字元碼位（JavaScript 預設排序）。**不含**版號、標題、說明與 URL：
    預覽站與正式站的 base 不同，同一份內容必須同一個指紋；只改說明文字也不該叫取用端重抄。
- **`closureHash`**：自己加上所有遞移 registry 相依的名稱，排序後每行 `<名稱>:<hash>`，同樣取 SHA-256 前 16 字元。
  **任何一個相依變了，這個值就變**——`utils` 修了，`data-table` 的 `closureHash` 跟著變，`hash` 不變。

實作在 `scripts/lib/fingerprint.mjs`；`tests/registry-fingerprint.test.ts` 用獨立寫的第二份實作逐 item 對過。

### 第三層：Release 列出這一版動到的 item

`deploy.yml` 發 Release 時，拿「上一個 `v*` tag 的 registry」與「這一版的 registry」現算指紋
（舊版的 index 沒有 `meta`，所以不讀欄位、一律現算），在 notes 附上四類清單：
**內容有變**、**只因相依變了而受影響**、**新增**、**移除**，並附上看差異的指令。
訂閱 Release 的取用端不必跑任何工具，就知道自己抄的 item 在不在清單裡。

- 腳本：`scripts/registry-changes.mjs`（`npm run registry:changes`），分類邏輯在 `scripts/lib/registry-changes.mjs`。
- `ci.yml` 在 dev 上先算一次寫進 step summary——腳本若壞掉，在 dev 就會知道，不會等到進版當下。
- `npm run status` 在合併前印出四類的數量。
- 算不出來（第一版、tag 抓不到）不擋發佈，只出 warning。

### 第二層：取用端 lock 與例行檢查

- 取用端在專案根目錄記 `dooping.lock.json`：上游 registry 位址，以及每個**主動安裝**的 item 的 `closureHash` 與各檔內容指紋。
- 檢查腳本比對線上的 `/r/index.json`，每個 item 回報三種狀態之一：
  **已是最新**、**上游有更新**（附看差異的指令與 CHANGELOG 連結）、**本地改過**（檔案指紋對不上 lock——台帳「刻意偏離」的機器版）。
- **只提醒，不擋建置**：〈跟上新版〉寫過，升級是決定，不是 CI 事件。
- 檢查腳本本身以 registry item 分發，走同一套 `shadcn add` 與同一套指紋——工具更新了，取用端用同一個訊號知道。
  不放進 `@dooping/tokens`：token 套件的版號只在 token 內容變時才動（[ADR-0005](0005-tokens-are-the-only-hard-dependency.md)），
  不該被工具的更新拖著跑。
- 內部試裝宿主 `apps/host-v4` 是第一個取用端：它的 `dooping.install.json` 就是「主動安裝」清單。

## 理由

- **指紋由產生器算，零人工判斷。** 選項 A 的每一次 bump 都是一次可能出錯的判斷，
  漏判的代價是訊號安靜地失真——「整個規範一個版號」今天付的就是這個代價。
- **相依閉包是這一例的教訓，不是追求理論完整。** 修正落在 `utils`，只看自己抄的檔一定會漏。
- **第一、三層先做**：只動上游，取用端零成本就能受益（讀 Release 就好）；
  第二層要取用端裝東西，等前兩層證明訊號有用再推。

## 影響

- `/r/index.json` 每個 item 多一個 `meta`，既有欄位不變。CI 的「registry 與原始碼一致」一併守住它。
- Release notes 變長。v0.13.0 相對 v0.11.1 幾乎每個 item 都會列出；之後的小版才顯出價值。
- 指紋的串接規則是對外契約：改規則等於讓所有取用端的 lock 一次失效，要走本則的修訂。
- 不做：逐 item semver、自動開 PR 的同步 bot、擋建置的檢查。
