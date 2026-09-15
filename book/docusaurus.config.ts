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
const PROD_URL = "https://kielchang.github.io/dooping-design-book/";

// 三段式發布：preview＝dev 的工作狀態、staging＝候選版（驗收中）、production＝核准版（main）。
// 文件寫了「只參照正式站」，但誤入的人不會先讀文件——站台自己要說它是哪一段，而且不給搜尋引擎收錄。
// BOOK_STAGE 由 workflow 明確設定；本機沒設時由 baseUrl 推斷。規則正本：治理章〈版本策略〉「三段式發布」。
const STAGES = ["preview", "staging", "production"] as const;
type Stage = (typeof STAGES)[number];
const STAGE = (process.env.BOOK_STAGE ??
  (BASE_URL.includes("/preview/") ? "preview" : BASE_URL.includes("/staging/") ? "staging" : "production")) as Stage;
if (!STAGES.includes(STAGE)) throw new Error(`BOOK_STAGE 只能是 ${STAGES.join("／")}（收到：${STAGE}）`);
const SPEC_VERSION: string = require("../package.json").version;
const COMMIT = (process.env.BOOK_COMMIT ?? "").slice(0, 7);
const BANNERS: Partial<Record<Stage, { id: string; content: string }>> = {
  preview: {
    id: "dev-preview",
    content: `dev 預覽站——非發佈版、隨時被下一次 push 覆蓋。取用一律以 <a href="${PROD_URL}"><b>正式站</b></a> 為準。`,
  },
  staging: {
    id: "staging-candidate",
    content: `候選版 v${SPEC_VERSION}${COMMIT ? `・${COMMIT}` : ""} 驗收中、尚未核准，隨時被下一個候選版取代。取用一律以 <a href="${PROD_URL}"><b>正式站</b></a> 為準。`,
  },
};
const BANNER = BANNERS[STAGE];
// Storybook 與 registry 都不在文件站的 dev server 裡——本機 build/start（BASE_URL 為 `/`）
// 時照 SITE_URL+BASE_URL 組出來的是 https://kielchang.github.io/storybook/ 這種不存在的
// 網址，所以外連一律退回正式站。
const IS_LOCAL = !process.env.BOOK_SITE_URL && BASE_URL === "/";
const PUBLIC_BASE = IS_LOCAL
  ? PROD_URL
  : `${SITE_URL.replace(/\/$/, "")}${BASE_URL}`;
const STORYBOOK_URL = `${PUBLIC_BASE}storybook/`;
const REGISTRY_BASE = `${PUBLIC_BASE}r`;

const config: Config = {
  title: "Dooping Design Book",
  tagline: "跨專案設計語言、操作模式與參考實作",
  favicon: "img/favicon.svg",
  url: SITE_URL,
  baseUrl: BASE_URL,
  organizationName: "kielchang",
  projectName: "dooping-design-book",
  trailingSlash: true,
  // 預覽站與候選版不給搜尋引擎收錄：搜尋進來的人只該落在核准版
  noIndex: STAGE !== "production",
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
        // Tailwind v4：設定全在 src/css/kit.css（CSS-first），這裡只掛 PostCSS 外掛。
        // 外掛只處理含 Tailwind 指令的檔案（kit.css），Infima 與 custom.css 原樣通過；
        // 瀏覽器前綴由 Tailwind 內建的 Lightning CSS 處理，不再需要 autoprefixer。
        configurePostCss(opts: { plugins: unknown[] }) {
          opts.plugins.push(require("@tailwindcss/postcss")());
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
          // 每頁的「編輯此頁」。治理章的架構頁是 sync script 的建置產物
          // （gitignored），對它的編輯要導向正本，否則連到一個不存在的檔案。
          // 指向 dev：日常修訂都在 dev 累積；staging 只收 dev、main 只收 staging 的核准合併。
          editUrl: ({ docPath }) =>
            docPath === "7-governance/10-architecture.md"
              ? "https://github.com/kielchang/dooping-design-book/edit/dev/ARCHITECTURE.md"
              : `https://github.com/kielchang/dooping-design-book/edit/dev/book/docs/${docPath}`,
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
    // 站台自己是驗收宿主，橫幅顏色也吃 token。正式站沒有橫幅。
    ...(BANNER && {
      announcementBar: {
        ...BANNER,
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
        {
          href: "https://github.com/kielchang/dooping-design-book/issues/new/choose",
          label: "提出建議 ↗",
          position: "right",
        },
        { href: "https://github.com/kielchang/dooping-design-book", label: "GitHub ↗", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "回饋",
          items: [
            { label: "提出建議（三分流表單）", href: "https://github.com/kielchang/dooping-design-book/issues/new/choose" },
            { label: "回饋與 RFC 流程", to: "/governance/rfc" },
          ],
        },
        {
          title: "版本",
          items: [
            { label: "CHANGELOG", href: "https://github.com/kielchang/dooping-design-book/blob/main/CHANGELOG.md" },
            { label: "Releases（訂閱新版通知）", href: "https://github.com/kielchang/dooping-design-book/releases" },
          ],
        },
      ],
      copyright: "Dooping Design Book · 設計語言與模式手冊 · MIT",
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
