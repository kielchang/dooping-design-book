# 內部試裝宿主（apps/host-v4）

> **這不是真實子系統。** 它是本 repo 裡「照取用端的路接上來」的最小應用：
> Vite＋React 19＋Tailwind v4＋shadcn CLI，裝 `@dooping/tokens`、從 registry 抄元件、
> 組出五種頁型並包進 AppShell。與真實宿主唯一的差別，是 `@dooping/tokens` 走 workspace 連結
> ——這一版合併前 npm 上還裝不到。

它同時是三件事：

1. **Tailwind v4 取用路徑的端到端驗證**——AGENTS.md「取 token」的四行 `@import` 在這裡真的跑，
   `src/globals.css` 一行都沒多。
2. **新子系統的起手範本**——整個目錄複製走就能開工（見下方）。
3. **ADR-0011（外殼元件）的內部補充證據**——回饋記在 [LEDGER.md](LEDGER.md)。
   它**不計入**「真實宿主回饋」，那一條要等第一個子系統依文件自行導入。

## 跑起來

在 repo 根目錄：

```bash
npm install
npm run build:tokens
npm run host:dev      # http://localhost:5173
npm run host:build    # 產出 apps/host-v4/dist
```

## 元件怎麼進來的

`src/components/dooping/`、`src/lib/dooping/` 與 `src/demo/sample-data.ts` 都是**產物**，不要手改。

| 指令 | 做什麼 | 用在 |
| --- | --- | --- |
| `npm run host:sync` | `scripts/host-sync.mjs` 直接讀 `registry/*.json` 寫檔 | 日常與 CI：零網路、決定性 |
| `npm run host:check` | 同上但只比對，有差異就失敗 | CI 閘門 |
| `node scripts/host-add.mjs [item…]` | 起本機 registry 伺服器，真的跑 `npx shadcn add`；可加 `--dry-run`、`--diff` 只預覽 | 確認 CLI 行為沒變、看上游改了什麼 |

兩條路的產物必須逐位元組相同。要多裝一個元件：把名字加進 `dooping.install.json`，再跑 `host:sync`。
遞移相依（例如 data-table 帶進來的 table、input）會自動補齊，不必列。

`dooping.lock.json` 是更新檢查的紀錄（ADR-0013 第二層）：`host:sync` 用 `scripts/dooping-check.mjs init` 重建它，
`host:check` 用同一支工具加 `--strict` 做例行檢查。取用端怎麼用這支工具，見文件站〈跟上新版〉。

## 當範本開新系統

1. 複製整個 `apps/host-v4` 到新的 repo。
2. `package.json` 的 `@dooping/tokens` 改成 npm 上的版本；刪掉 `dooping.install.json` 與 `dooping.lock.json`——真實宿主用 CLI 安裝。
3. 用 `npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/<item>.json` 補齊要的元件，
   再跑 `node scripts/dooping-check.mjs init <你裝的 item…>` 重建 lock，把 `node scripts/dooping-check.mjs` 放進每週的 CI。
4. `LEDGER.md` 換成你自己的符合性台帳（骨架見 AGENTS.md）。
5. `src/routes/` 是五種頁型的示範，換成你的畫面；`src/demo/` 換成你的資料來源。

## 檔案地圖

| 檔案 | 是什麼 |
| --- | --- |
| `src/globals.css` | 取用契約的四行 `@import`，不宣告任何色值 |
| `src/theme.tsx` | 明暗與色相主題，掛在 `documentElement` |
| `src/app.tsx` | AppShell＋側欄＋指令面板；`renderLink` 注入 react-router 的 `Link` |
| `src/url-adapter.ts` | `useTableUrlState` 的 react-router adapter |
| `src/routes/*.tsx` | 清單、明細、表單、儀表板、設定五種頁型，外加一個留白分區 |
