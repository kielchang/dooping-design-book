// 文件站 Tailwind：吃 @doping/tokens 的 preset（與 Storybook、與任何宿主同一套 token）。
// - preflight 關閉：Docusaurus/Infima 有自己的 reset，注入第二套會打爆全站樣式。
// - darkMode 由 preset 提供，已含 [data-theme="dark"]（Docusaurus 的深色開關）。
// - content 用絕對路徑：這份設定是以「物件」而非「路徑」交給 postcss 外掛的，
//   相對路徑會以執行時的 CWD 解讀，在 CI 上容易失準。
const path = require("node:path");
const preset = require("../packages/tokens/tailwind-preset.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  corePlugins: { preflight: false },
  content: [
    path.resolve(__dirname, "../packages/react/src/**/*.{ts,tsx}"),
    path.resolve(__dirname, "./src/**/*.{ts,tsx}"),
    path.resolve(__dirname, "./docs/**/*.{md,mdx}"),
  ],
  plugins: [require("tailwindcss-animate")],
};
