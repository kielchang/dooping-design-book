# 套用驗收用的乾淨取用端專案

`scripts/verify-consumer.mjs`（`npm run verify:consumer`）把這個目錄複製到 **repo 外**的暫存目錄，
當成「另一個系統照 AGENTS.md 導入設計書」的起點：裝 token、用真的 shadcn CLI 抄元件、建置、在瀏覽器量顏色。

## 為什麼要有它

repo 裡其他守衛都在 monorepo 裡驗：workspace 連結的 token、hoist 過的 `node_modules`、預先抄好的元件。
取用端不會有那些。凡是「只有在乾淨專案才會壞」的問題——套件 `files` 漏檔、CLI 改寫檔案、
item 沒宣告的 npm 相依、嚴格 TypeScript 設定下編不過——只有從這裡裝起才看得到。

## 內容與來源

| 檔案 | 來源 |
| --- | --- |
| `index.html`、`tsconfig*.json`、`src/vite-env.d.ts`、`src/main.tsx` 骨架 | create-vite 的 react-ts 範本（對照 Vite 6.4、TypeScript 5.9：含 `verbatimModuleSyntax`、`erasableSyntaxOnly`） |
| `vite.config.ts`、tsconfig 的 `@/*` paths | shadcn 官方 Vite 安裝步驟 |
| `src/globals.css` | **只有** AGENTS.md「取 token」那四行 |
| `components.json` | 與內部試裝宿主相同，但不含 `registries` |
| `src/App.tsx` | 一頁中性示範，`data-probe` 是驗收量測點 |

`package.json` 不放在這裡：驗收時由腳本產生，版本抄 repo 根 `package-lock.json` 的精確版號，
這樣 CI 的 npm 快取大多命中，也不會因為範本裡的版本過期而假性失敗。

**不要**為了讓驗收通過而放寬這裡的設定——這些設定就是取用端會有的樣子。放寬任何一條，要在這一節寫明原因。

## 本機跑一次

```powershell
npm run build:tokens
npx playwright install chromium
npm run verify:consumer
$env:KEEP_CONSUMER='1'; npm run verify:consumer   # 保留暫存專案，路徑印在最後
```

不涵蓋：Next.js App Router、Tailwind v3、Base UI 共存（各自另案評估）。
