# Doping Design Book

**一本可以被實作的設計語言。** 跨專案共用的設計 token、通用元件參考實作，
以及後台系統的操作模式手冊。

- 📘 文件站：<https://kielchang.github.io/doping-design-book/>
- 🧩 Storybook：<https://kielchang.github.io/doping-design-book/storybook/>
- 📦 Registry：`https://kielchang.github.io/doping-design-book/r/<name>.json`

## 這是什麼

萃取自一套真實運作的內部後台系統，只保留**與產業無關**的部分：
設計語言、通用元件、以及那些「每個系統都會遇到、而且通常會想錯一次」的操作邏輯。

三層，相依強度刻意遞減：

| 層 | 內容 | 取用方式 |
| --- | --- | --- |
| `packages/tokens` | 設計 token（色彩語意、間距、字級、動態…） | **唯一建議 npm 安裝的一層** |
| `packages/react` | React 參考實作（20+ 元件） | registry 複製原始碼進你的專案 |
| `book/docs/4-patterns` | 操作模式（問題→做法→取捨→反例） | 讀懂，用你自己的技術棧實作 |

理由：**元件一定會被改，token 幾乎不會。** 詳見 [ADR-0004](docs/adr/0004-registry-over-npm-package.md)
與 [ADR-0005](docs/adr/0005-tokens-are-the-only-hard-dependency.md)。

## 快速開始

```bash
npm install                # 安裝 workspace 相依
npm run build:tokens       # 產生 tokens.css 與 tokens.data.ts（後續步驟的前提）
npm run storybook          # http://localhost:6006
npm --prefix book start    # 文件站 http://localhost:3000
```

## 目錄

```
packages/
├── tokens/        @dooping/tokens — tokens.json（來源）→ CSS 變數 ＋ Tailwind preset ＋ TS API
└── react/         @dooping/react  — React 參考實作（元件 ＋ stories ＋ 示範資料）
registry/          shadcn registry JSON（由 scripts/build-registry.mjs 產生）
book/              Docusaurus 文件站（中文搜尋、可列印、內嵌真元件）
docs/adr/          決策紀錄正本（build 時同步到文件站）
tests/             守衛測試：元件庫邊界、token 一致性、去領域化詞彙
.storybook/        Storybook 設定
```

## 驗證指令

```bash
npm run build:tokens       # token 產物（其他步驟的前提）
npm run typecheck          # TypeScript
npm test                   # 守衛測試（3 檔 74 項）
npm run build-storybook    # Storybook
npm run build:registry     # registry JSON
npm --prefix book run build  # 文件站（onBrokenLinks: throw）
```

## 為什麼用 npm workspaces（而不是 pnpm）

`packages/react` 的元件走 registry 複製散佈，不會被大量 `npm install`；
workspace 的功能需求只有「本地 symlink ＋ 一次安裝」。
npm workspaces 已經滿足，而且**不需要在每個 CI／每台機器多裝一個套件管理器**。

`book/` 刻意**不是** workspace 成員：Docusaurus 與 Storybook 的相依樹很大，
分開安裝可以避免版本互相牽制，也讓文件站能單獨建置。

## 三條收錄原則

1. **去領域化** —— 拿掉原始產業脈絡還成立嗎？
2. **通用性** —— CRM、庫存、工單系統會用到嗎？
3. **三次法則** —— 實際用過三次以上且穩定才收。投機性抽象不收。

第 1 條由 `tests/de-domain.test.ts` 自動把關，零容忍。
見 [ADR-0006](docs/adr/0006-de-domainization-as-hard-gate.md)。

## 授權

MIT
