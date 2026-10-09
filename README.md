# Dooping Design Book

**一本可以被實作的設計語言**：跨專案共用的設計 token、通用元件的參考實作，
以及後台系統的操作模式與頁型規範。

- 📘 文件站：<https://kielchang.github.io/dooping-design-book/>
- 🧩 Storybook：<https://kielchang.github.io/dooping-design-book/storybook/>
- 📦 Registry 索引：<https://kielchang.github.io/dooping-design-book/r/index.json>（單品 `/r/<name>.json`）
- 🤖 給 AI 的取用契約：[AGENTS.md](https://kielchang.github.io/dooping-design-book/AGENTS.md)；機器地圖：[llms.txt](https://kielchang.github.io/dooping-design-book/llms.txt)

## 這是什麼

與產業無關的設計語言、通用元件與後台操作模式。分三層，相依強度遞減：

| 層 | 內容 | 取用方式 |
| --- | --- | --- |
| `packages/tokens` | 設計 token：語意色、間距、字級、陰影、動態 | npm `@dooping/tokens`——Tailwind v4（`tailwind.css`，建議）／v3（preset）／純 CSS（`tokens.css`）／TS API |
| `packages/react` | React 參考實作（元件、hook、工具） | `npx shadcn add <registry URL>` 複製原始碼進你的專案；項目以 `/r/index.json` 為準 |
| 文件站的模式與頁面章 | 操作模式、五種頁型的組成規範 | 讀完用你自己的技術棧實作 |

- **token 是唯一的 npm 相依**：只改值、不改語意名稱。
- **元件複製走就是你的程式碼**，固定落在 `components/dooping/`、`lib/dooping/`。

## 怎麼取用

1. 讀 [AGENTS.md](AGENTS.md)（一頁式契約：怎麼裝、什麼不能改）與文件站〈[三種取用方式](https://kielchang.github.io/dooping-design-book/start/three-ways/)〉。
2. 裝 token：`npm install @dooping/tokens`，全域 CSS 照 AGENTS.md「取 token」的四行 `@import`。
3. 裝元件：`npx shadcn@latest add https://kielchang.github.io/dooping-design-book/r/data-table.json`
   （每種頁型的文件末尾有一次裝齊的「最小安裝集」）。
4. 在自己的 repo 記[符合性台帳](https://kielchang.github.io/dooping-design-book/governance/conformance-ledger/)。

## 版本與新版訊號

- **只參照 `main`／正式站**（最新核准版）。`/staging/`（候選版）與 `/preview/`（開發中）不得當來源。
- 兩個版號：規範版 `vX.Y.Z`（GitHub tag＋registry 戳記），與 `@dooping/tokens` 的 npm 版號；
  `/r/index.json` 的 `tokensVersion` 是兩者的配對。
- 新版訊號：repo 頁 Watch → Custom → **Releases**；例行檢查用 registry 的 `dooping-check`。
  做法見文件站〈[跟上新版](https://kielchang.github.io/dooping-design-book/governance/staying-current/)〉；
  變更見 [CHANGELOG](CHANGELOG.md)。

## 在本 repo 開發

需求：Node 20 以上（`.nvmrc`：22）。

```bash
npm install                  # workspace 相依（packages/*、apps/*）
npm run build:tokens         # token 產物——測試、Storybook、文件站的前提，不能跳過
npm run storybook            # http://localhost:6006
npm --prefix book install    # 文件站不是 workspace 成員，另外安裝
npm run book                 # 文件站 http://localhost:3000
npm run host:dev             # 內部試裝宿主（apps/host-v4）
```

開 PR 前四道全綠：

```bash
npm run build:tokens && npm run typecheck && npm test && npm run verify:color
```

完整約定與其他驗證指令見 [CLAUDE.md](CLAUDE.md)；管線、守衛台帳與分支部署見 [ARCHITECTURE.md](ARCHITECTURE.md)。

### 目錄

```
packages/
├── tokens/        @dooping/tokens：tokens.json（來源）→ tokens.css、tailwind.css（v4）、tailwind-preset（v3）、TS API
└── react/         @dooping/react：元件、stories、示範資料（不發 npm，產生 registry）
registry/          shadcn registry JSON（scripts/build-registry.mjs 產生，進版控）
apps/host-v4/      內部試裝宿主（Vite＋Tailwind v4），也是新專案的起手範本
book/              Docusaurus 文件站（不是 workspace 成員）
templates/         取用端工具：dooping-check（更新檢查）、eslint.dooping.cjs
scripts/           建置、驗證、發版閘、部署
tests/             守衛測試（每支管什麼、不管什麼：ARCHITECTURE.md「守衛」）
fixtures/          套用驗收用的乾淨專案範本
.storybook/        Storybook 設定
```

### 分支與發布

功能分支 → PR 到 `dev`（預覽站 `/preview/`）→ PR `dev → staging`（候選版 `/staging/`，跑套用驗收）
→ PR `staging → main`（核准後部署正式站、自動蓋 tag 與 Release）。

## 收錄三原則

1. **去領域化**：拿掉原始產業脈絡還成立。由 `tests/de-domain.test.ts` 把關，零容忍。
2. **通用性**：換一個後台系統也會用到。
3. **三次法則**：實際用過三次以上且穩定才收；不收投機性抽象。

## 回饋與貢獻

- **人**：<https://github.com/kielchang/dooping-design-book/issues/new/choose>（Bug／RFC／缺件認領），小調整直接開 PR 到 `dev`——見 [CONTRIBUTING.md](CONTRIBUTING.md)。
- **取用端的 AI agent**：照 AGENTS.md「回饋到上游」開標題 `[回饋]` 的 issue。
- **安全問題**：照 [SECURITY.md](SECURITY.md) 私密回報，不開 issue。

流程正本：文件站〈[回饋與 RFC 流程](https://kielchang.github.io/dooping-design-book/governance/rfc/)〉。

## 授權

MIT
