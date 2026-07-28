import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "../tailwind.config.cjs";

const config: StorybookConfig = {
  stories: ["../packages/react/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      // 直接指到套件原始碼：改元件立刻可見，不必先 build 一次
      "@doping/react": path.resolve(process.cwd(), "packages/react/src"),
      "@doping/tokens/tokens.css": path.resolve(process.cwd(), "packages/tokens/dist/tokens.css"),
      "@doping/tokens": path.resolve(process.cwd(), "packages/tokens/src/index.ts"),
    };
    // PostCSS 寫在這裡而不是 repo 根的 postcss.config.cjs：根目錄的設定檔會被
    // book/（Docusaurus）沿目錄向上尋找而誤用，讓文件站的 Tailwind 讀到錯的設定檔。
    cfg.css = {
      ...(cfg.css ?? {}),
      postcss: { plugins: [tailwindcss(tailwindConfig as never), autoprefixer()] },
    };
    // 相對 base → 可發佈在 GitHub Pages 子路徑（/doping-design-book/storybook/）
    cfg.base = "./";
    return cfg;
  },
};

export default config;
