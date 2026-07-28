// @dooping/tokens — Tailwind preset（CommonJS，讓 Docusaurus/PostCSS 的 require() 也能吃）
//
// 用法：tailwind.config.js → presets: [require("@dooping/tokens/tailwind-preset")]
//
// 這個 preset 只做「token → utility 名稱」的對映，不決定任何值：值都在 CSS 變數裡，
// 由 @dooping/tokens/tokens.css 提供。因此同一份 class 可以在不同宿主換皮而不重編譯。
const tokens = require("./src/tokens.json");

const isToken = (v) => v && typeof v === "object" && typeof v.value === "string";
const keys = (obj) => Object.keys(obj ?? {}).filter((k) => isToken(obj[k]));

/** 語意色：一律指向 CSS 變數，並保留 `<alpha-value>` 讓 bg-primary/10 這類透明度可用。 */
const hsl = (name) => `hsl(var(--${name}) / <alpha-value>)`;

/** 有 `-foreground` 對應的色彩 → 產出 { DEFAULT, foreground } 巢狀物件 */
function colorScale(names) {
  const out = {};
  for (const n of names) {
    if (n.endsWith("-foreground")) continue;
    const base = out[n] ?? {};
    out[n] = names.includes(`${n}-foreground`) ? { DEFAULT: hsl(n), foreground: hsl(`${n}-foreground`), ...base } : hsl(n);
  }
  return out;
}

const colorNames = keys(tokens.color.light);
const colors = colorScale(colorNames);
// 「已改動未送出」多一層 bg（邊框／文字／底色三件套）
colors.edit = { DEFAULT: hsl("edit"), foreground: hsl("edit-foreground"), bg: hsl("edit-bg") };
// 欄位語意（可編輯 vs 唯讀）
colors.field = {
  editable: hsl("field-editable"),
  "editable-foreground": hsl("field-editable-foreground"),
  readonly: hsl("field-readonly"),
  "readonly-foreground": hsl("field-readonly-foreground"),
  border: hsl("field-border"),
};
// 圖表色票是 hex（SVG 直接吃），不包 hsl()
colors.chart = Object.fromEntries(keys(tokens.chart.light).map((k) => [k.replace(/^chart-/, ""), `var(--${k})`]));

const fontSize = Object.fromEntries(
  keys(tokens.fontSize).map((k) => [k, [`var(--font-size-${k})`, { lineHeight: `var(--line-height-${k})` }]]),
);

module.exports = {
  // 深色兩種鉤子：.dark（Tailwind/shadcn 慣例）＋ [data-theme="dark"]（文件站／後台框架慣例）
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: [`var(--font-family-sans)`],
        mono: [`var(--font-family-mono)`],
      },
      fontSize,
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: Object.fromEntries(keys(tokens.shadow).map((k) => [k, `var(--shadow-${k})`])),
      transitionDuration: Object.fromEntries(keys(tokens.duration).map((k) => [k, `var(--duration-${k})`])),
      transitionTimingFunction: Object.fromEntries(keys(tokens.easing).map((k) => [k, `var(--easing-${k})`])),
      spacing: Object.fromEntries(keys(tokens.size).map((k) => [k, `var(--size-${k})`])),
      keyframes: {
        "dooping-spotlight-pulse": {
          "0%": { boxShadow: "0 0 0 2px hsl(var(--primary)), 0 0 0 4px hsl(var(--primary) / 0.35)" },
          "70%": { boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 14px hsl(var(--primary) / 0)" },
          "100%": { boxShadow: "0 0 0 2px hsl(var(--primary)), 0 0 0 4px hsl(var(--primary) / 0)" },
        },
      },
    },
  },
};
