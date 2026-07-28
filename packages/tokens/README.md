# @dooping/tokens

框架中立的設計 token：**JSON 是來源，CSS 與 Tailwind preset 是產物。**

## 安裝

```bash
npm install @dooping/tokens
```

## 用法

### 純 CSS（任何宿主）

```css
@import "@dooping/tokens/tokens.css";

.my-alert {
  background: hsl(var(--danger) / 0.1);
  border: 1px solid hsl(var(--danger) / 0.35);
  color: hsl(var(--danger));
}
```

### Tailwind

```js title="tailwind.config.js"
module.exports = {
  presets: [require("@dooping/tokens/tailwind-preset")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

```tsx
<div className="bg-danger/10 border-danger/30 text-danger" />
```

### JavaScript（Canvas 圖表、伺服器端 PDF、Figma plugin…）

```ts
import { semanticColors, chartColors, chartChrome, TOKENS_VERSION } from "@dooping/tokens";

chartColors("dark");   // ["#2a5ae5", "#0e9488", …]
semanticColors();      // { primary: "222.2 47.4% 11.2%", … }（HSL 三元組）
```

## 深色模式

同時提供兩種宿主鉤子，兩者共用同一組規則：

```css
.dark,
[data-theme="dark"] { /* … */ }
```

切換請掛在 `document.documentElement` 上——portal 浮層（Dialog / Select / Tooltip）
掛在 `<body>`，只切 wrapper 的 class 它們抓不到。

## 內容

| 群組 | 說明 |
| --- | --- |
| 語意色 | 表面／文字、動作、狀態（success/warning/info/danger）、欄位（可編輯 vs 唯讀）、保留色（已改動未送出） |
| 圖表色票 | 8 色分類色票（色盲友善）＋軸線／格線／文字 |
| 圓角・間距・字級・字體 | 單一基準推導 |
| 陰影 | 3 階（＝表面抬升層級） |
| 動態 | 時長與 easing，含 `prefers-reduced-motion` 降級 |
| 互動尺寸 | 控制項高度、觸控目標（WCAG 2.5.5） |

另附語意 utility class：`.field-editable` `.field-readonly` `.tap-target` `.spotlight-ring`
`.print-only` `.print-hidden` `.print-block`，以及一組列印預設規則。

## 開發

```bash
npm run build   # tokens.json → dist/tokens.css ＋ src/tokens.data.ts ＋ dist/*.d.ts
```

**不要手改 `dist/` 或 `src/tokens.data.ts`**，它們是產物；來源是 `src/tokens.json`。

## 版本策略

移除或改名 token、改變 token 語意 → **major**。新增 → minor。色值微調（語意不變）→ patch。
