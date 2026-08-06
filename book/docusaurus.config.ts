// Dooping Design Book — 設計語言文件站。
//
// 兩個關鍵設定：
// 1. kitPipeline：讓文件站直接編譯並渲染 repo 內的**真元件**（不是截圖、不是複製一份）。
//    元件改了，文件裡的活範例當場跟著改，沒有東西會過期。
// 2. baseUrl 由環境變數注入：本地 `/`、GitHub Pages `/dooping-design-book/`。
import path from "node:path";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const BASE_URL = process.env.BOOK_BASE_URL ?? "/";
const SITE_URL = process.env.BOOK_SITE_URL ?? "https://kielchang.github.io";
// 預覽站＝dev 的工作狀態，不是發佈。文件寫了「不可參照」，但誤入的人不會先讀文件——
// 站台自己要說。用 baseUrl 判斷：只有 /preview/ 建置掛橫幅，正式站與本機都不出現。
const IS_PREVIEW = BASE_URL.includes("/preview/");
const PROD_URL = "https://kielchang.github.io/dooping-design-book/";
const STORYBOOK_URL = `${SITE_URL.replace(/\/$/, "")}${BASE_URL}storybook/`;
const REGISTRY_BASE = `${SITE_URL.replace(/\/$/, "")}${BASE_URL}r`;

const config: Config = {
  title: "Dooping Design Book",
  tagline: "跨專案設計語言、操作模式與參考實作",
  favicon: "img/favicon.svg",
  url: SITE_URL,
  baseUrl: BASE_URL,
  organizationName: "kielchang",
  projectName: "dooping-design-book",
  trailingSlash: true,
  onBrokenLinks: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },
  i18n: { defaultLocale: "zh-Hant", locales: ["zh-Hant"] },

  customFields: { storybookUrl: STORYBOOK_URL, registryBase: REGISTRY_BASE },

  plugins: [
    function kitPipeline() {
      return {
        name: "kit-pipeline",
        configureWebpack(
          _config: unknown,
          isServer: boolean,
          utils: { getJSLoader: (o: { isServer: boolean }) => unknown },
        ) {
          const pkgs = path.resolve(__dirname, "../packages");
          return {
            resolve: {
              alias: {
                "@dooping/react": path.resolve(pkgs, "react/src"),
                "@dooping/tokens": path.resolve(pkgs, "tokens/src/index.ts"),
              },
            },
            module: {
              rules: [
                {
                  // siteDir 之外的 TSX 也要走 Docusaurus 官方 babel loader
                  test: /\.(t|j)sx?$/,
                  include: [pkgs],
                  use: [utils.getJSLoader({ isServer })],
                },
              ],
            },
          };
        },
        configurePostCss(opts: { plugins: unknown[] }) {
          opts.plugins.push(
            require("tailwindcss")(require(path.resolve(__dirname, "tailwind.config.js"))),
            require("autoprefixer"),
          );
          return opts;
        },
      };
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        pages: false,
        theme: { customCss: ["./src/css/custom.css", "./src/css/kit.css"] },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      { hashed: true, language: ["en", "zh"], indexBlog: false, docsRouteBasePath: "/" },
    ],
  ],

  themeConfig: {
    // 常駐、不可關——它就是提醒色辭典「低強度提醒」的用例（warning 淡底＋同色相深墨），
    // 站台自己是驗收宿主，橫幅顏色也吃 token。
    ...(IS_PREVIEW && {
      announcementBar: {
        id: "dev-preview",
        content: `dev 預覽站——非發佈版、隨時被下一次 push 覆蓋。取用一律以 <a href="${PROD_URL}"><b>正式站</b></a> 為準。`,
        backgroundColor: "hsl(var(--warning-subtle))",
        textColor: "hsl(var(--warning-subtle-foreground))",
        isCloseable: false,
      },
    }),
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: "Dooping Design Book",
      items: [
        { href: STORYBOOK_URL, label: "Storybook ↗", position: "right" },
        { href: "https://github.com/kielchang/dooping-design-book", label: "GitHub ↗", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      copyright: "Dooping Design Book · 設計語言與模式手冊 · MIT",
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
