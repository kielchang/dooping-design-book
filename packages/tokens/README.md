# @dooping/tokens

框架中立的設計 token：**JSON 是來源；CSS 變數、Tailwind 對映（v4／v3）與 TS API 都是產物。**

## 安裝

```bash
npm install @dooping/tokens
```

> **0.x 期間 `^` 不跨 minor**：`^0.5.0` 裝不到 0.6.0。跟上新版要手動改版號範圍。

## 用法

### Tailwind v4（建議）

```css title="全域 CSS（順序是承重結構）"
@import "tailwindcss";
@import "tw-animate-css";              /* 動畫 class，對應 v3 的 tailwindcss-animate */
@import "@dooping/tokens/tokens.css";  /* 值 */
@import "@dooping/tokens/tailwind.css"; /* token → utility 名稱對映 */
```

`tailwind.css` 只做名稱對映，本身不含任何色值：

1. `@theme` 把語意色、圓角、陰影、字級、字體、動態、互動尺寸對映成 utility
   （`bg-danger/10`、`rounded-md`、`shadow-sm`、`text-tiny`、`duration-fast`、`h-control`），
   值一律 `var()` 回 `tokens.css`。
2. `--color-*: initial` 清空 Tailwind 預設色盤——`bg-red-500` 產不出樣式（漂移防線①）。
3. `@custom-variant dark` 同時認 `.dark` 與 `[data-theme="dark"]`；
   `@layer base` 補上 v4 preflight 拿掉的邊框預設色與按鈕游標。

從 `npx shadcn init` 起手的專案，**刪掉**它產生的 `:root`／`.dark` 色值區塊、
`@theme inline` 裡的 `--color-*` 對映與 `@custom-variant dark`——留著就是兩份真相，後宣告者蓋前者。

`tokens.css` 在 v4 宿主裡是 unlayered，它的語意 class（`.field-editable`、`.state-layer`、
`.tap-target`…）會壓過 utilities（v3 剛好相反）。元件已避開同屬性衝突；自己組合時留意。

### Tailwind v3

```js title="tailwind.config.js"
module.exports = {
  presets: [require("@dooping/tokens/tailwind-preset")],
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [require("tailwindcss-animate")],
};
```

```css title="全域 CSS"
@import "@dooping/tokens/tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
```

兩個版本產出的 class 名稱逐字相同，元件原始碼不必分版：

```tsx
<div className="bg-danger/10 border-danger/30 text-danger" />
```

### 純 CSS（任何宿主）

```css
@import "@dooping/tokens/tokens.css";

.my-alert {
  background: hsl(var(--danger) / 0.1);
  border: 1px solid hsl(var(--danger) / 0.35);
  color: hsl(var(--danger));
}
```

### JavaScript（Canvas 圖表、伺服器端 PDF、Figma plugin…）

```ts
import { semanticColors, chartColors, chartChrome, themeMeta, TOKENS_VERSION } from "@dooping/tokens";

chartColors("dark");   // ["#2a5ae5", "#0e9488", …]
semanticColors();      // { primary: "222.2 47.4% 11.2%", … }（HSL 三元組）
themeMeta();           // [{ name, label, hue }, …]（主題切換器用）
```

## 深色模式與色相主題

深色同時提供兩種宿主鉤子，兩者共用同一組規則：

```css
.dark,
[data-theme="dark"] { /* … */ }
```

色相主題與明暗**正交**：在 `<html>` 設 `data-color-theme="<name>"` 切換，不設就是預設主題。
可用名稱以 `themeNames()`／`themeMeta()` 為準（這裡刻意不列舉，免得多一份會過期的清單）。
主題只覆蓋 brand 家族、帶色調的中性色與側欄家族；狀態色、圖表色票、`--ring` 在所有主題之間完全相同。

```js
document.documentElement.classList.toggle("dark");
document.documentElement.setAttribute("data-color-theme", "teal");
```

兩個維度都請掛在 `document.documentElement` 上——portal 浮層（Dialog / Select / Tooltip）
掛在 `<body>`，只切 wrapper 的屬性它們抓不到。

## 內容

| 群組 | 說明 |
| --- | --- |
| 語意色 | 表面／文字、動作、狀態（success/warning/info/danger 與 `-subtle` 低強度層）、欄位（可編輯 vs 唯讀）、保留色（已改動未送出）、側欄表面 |
| 色相主題 | 每組主題的淺深兩套覆蓋值，由 `scripts/generate-theme.mjs` 以目標對比反解生成 |
| 圖表色票 | 8 色分類色票（色盲友善）＋軸線／格線／文字 |
| 圓角・間距・字級・字體 | 單一基準推導 |
| 陰影 | 3 階（＝表面抬升層級） |
| 動態 | 時長與 easing，含 `prefers-reduced-motion` 降級 |
| 互動尺寸 | 控制項高度、觸控目標（WCAG 2.5.5） |
| 互動狀態層強度 | hover／pressed／selected 三級 alpha，疊在元件自己的底色上（`.state-layer`） |

另附語意 utility class：`.field-editable` `.field-readonly` `.state-layer` `.tap-target` `.spotlight-ring`
`.print-only` `.print-hidden` `.print-block`、一組列印預設規則，
以及強制色彩模式（Windows 高對比）的焦點備援。

## 開發

```bash
npm run build   # tokens.json → dist/tokens.css ＋ dist/tailwind.css ＋ src/tokens.data.ts ＋ dist/*.d.ts
```

**不要手改 `dist/` 或 `src/tokens.data.ts`**，它們是產物；來源是 `src/tokens.json`。

## 版本策略

移除或改名 token、改變 token 語意 → **major**。新增 token 或新增可 import 的入口檔 → minor。
色值微調（語意不變）→ patch。
