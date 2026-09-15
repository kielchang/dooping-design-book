// 「取用端踩得到的介面」——這些路徑相對 main 有變，規範版號就必須 bump（git pathspec）。
//
// 範圍要**逐字等於**會進 registry 或被取用端 require 的集合：多一個是假警報，少一個是漏訊號。
// 對照 scripts/build-registry.mjs 的 walk() 與 index.ts／version.ts／demo/ 的跳過條件；
// tailwind-preset 與 templates/ 同樣是取用端會複製或 require 的東西。
export const WATCH_PATHS = [
  "packages/react/src",
  "packages/tokens/src/tokens.json",
  "packages/tokens/tailwind-preset.cjs",
  "packages/tokens/scripts",
  "templates",
  ":(exclude)packages/react/src/demo",
  ":(exclude)packages/react/src/index.ts",
  ":(exclude)packages/react/src/version.ts",
  ":(exclude)*.stories.tsx",
];
