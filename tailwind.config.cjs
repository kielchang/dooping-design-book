// 根 Tailwind 設定（Storybook 用）。
// 值全部來自 @doping/tokens 的 preset；這裡只指定要掃哪些檔案產生 utilities。
const preset = require("@doping/tokens/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    "./packages/react/src/**/*.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}",
  ],
  plugins: [require("tailwindcss-animate")],
};
