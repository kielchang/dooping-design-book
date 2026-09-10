import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../packages/react/src/**/*.stories.@(ts|tsx)"],
  // addon-a11y：開發時面板即時看 axe 結果，與 CI 的 verify:storybook 同一套規則語言
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      // 直接指到套件原始碼：改元件立刻可見，不必先 build 一次
      "@dooping/react": path.resolve(process.cwd(), "packages/react/src"),
      // 子路徑必須排在 "@dooping/tokens" 之前：Vite 的字串 alias 以前綴比對、先到先得，
      // 順序反過來，"@dooping/tokens/tailwind.css" 會被改寫成 index.ts/tailwind.css。
      "@dooping/tokens/tokens.css": path.resolve(process.cwd(), "packages/tokens/dist/tokens.css"),
      "@dooping/tokens/tailwind.css": path.resolve(process.cwd(), "packages/tokens/dist/tailwind.css"),
      "@dooping/tokens": path.resolve(process.cwd(), "packages/tokens/src/index.ts"),
    };
    // Tailwind v4 走 Vite plugin：設定全在 .storybook/styles.css（CSS-first），
    // 沒有 tailwind.config、也沒有 postcss.config——舊版「PostCSS 設定寫在這裡，
    // 免得被文件站沿目錄向上找到」的顧慮因此一併消失。
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    cfg.plugins = [...(cfg.plugins ?? []), tailwindcss()];
    // 相對 base → 可發佈在 GitHub Pages 子路徑（/dooping-design-book/storybook/）
    cfg.base = "./";
    return cfg;
  },
};

export default config;
