// Tailwind v3 可編譯守衛 —— 本書的 Storybook 與文件站改跑 v4 之後，v3 preset 沒有任何日常使用者：
// 壞了沒人看得見，直到某個 v3 宿主抄走元件才安靜變形。這支用 v3（npm alias：tailwindcss3）
// 帶 preset 真的編一次，斷言與 v4 可編譯守衛同一組 class 產得出來、值指向同一批 CSS 變數。
import { describe, it, expect, beforeAll } from "vitest";
import { createRequire } from "node:module";
import postcss from "postcss";
import { expectedColorKeys, chartKeys, ruleFor } from "./lib/token-keys";

const require = createRequire(import.meta.url);
const tailwind3 = require("tailwindcss3");
const preset = require("../packages/tokens/tailwind-preset.cjs");

/** 與 tokens-v4.test.ts 同一組：兩版必須讀到同一批 CSS 變數 */
const NON_COLOR: Record<string, string> = {
  "duration-fast": "transition-duration: var(--duration-fast)",
  "ease-standard": "transition-timing-function: var(--easing-standard)",
  "text-tiny": "font-size: var(--font-size-tiny)",
  "h-control": "height: var(--size-control)",
  "size-tap-target": "width: var(--size-tap-target)",
  "shadow-sm": "--tw-shadow: var(--shadow-sm)",
  "rounded-sm": "border-radius: var(--radius-sm)",
  "font-sans": "font-family: var(--font-family-sans)",
  "font-mono": "font-family: var(--font-family-mono)",
};

let css = "";

beforeAll(async () => {
  const classes = [
    ...expectedColorKeys().map((k) => `bg-${k}`),
    "bg-primary/50", "bg-red-500", "bg-white", "bg-black", "dark:bg-card",
    ...Object.keys(NON_COLOR),
  ];
  const result = await postcss([
    tailwind3({
      presets: [preset],
      corePlugins: { preflight: false },
      content: [{ raw: classes.join(" "), extension: "html" }],
    }),
  ]).process("@tailwind utilities;", { from: undefined });
  css = result.css;
});

describe("Tailwind v3 可編譯守衛（用 tailwindcss v3 帶 preset 編一次）", () => {
  it("跑的真的是 v3（alias 沒有被解析成根目錄的 v4）", () => {
    expect(require("tailwindcss3/package.json").version).toMatch(/^3\./);
  });

  it("每個色鍵都產得出 bg-*，值指向同名 CSS 變數", () => {
    const chart = new Set(chartKeys());
    const wrong = expectedColorKeys().filter((k) => {
      const rule = ruleFor(css, `bg-${k}`) ?? "";
      return chart.has(k) ? !rule.includes(`var(--${k})`) : !rule.includes(`hsl(var(--${k}) /`);
    });
    expect(wrong, `產不出或值不對：${wrong.join(", ")}`).toEqual([]);
  });

  it("透明度修飾可用（bg-primary/50 → hsl(var(--primary) / 0.5)）", () => {
    expect(ruleFor(css, "bg-primary/50")).toContain("hsl(var(--primary) / 0.5)");
  });

  it("預設色盤已清空、white／black 保留", () => {
    expect(ruleFor(css, "bg-red-500"), "bg-red-500 不該產得出來").toBeNull();
    expect(ruleFor(css, "bg-white")).not.toBeNull();
    expect(ruleFor(css, "bg-black")).not.toBeNull();
  });

  it('dark: variant 認 [data-theme="dark"]', () => {
    const selector = css.split("{").find((s) => s.includes(".dark\\:bg-card")) ?? "";
    expect(selector, "產不出 dark:bg-card").not.toBe("");
    expect(selector).toContain('[data-theme="dark"]');
  });

  it("非色彩 utility 讀到與 v4 相同的 token 變數", () => {
    const wrong = Object.entries(NON_COLOR).filter(([c, decl]) => !ruleFor(css, c)?.includes(decl)).map(([c]) => c);
    expect(wrong, `沒讀到 token：${wrong.join(", ")}`).toEqual([]);
    expect(ruleFor(css, "text-tiny"), "字級要帶行高").toContain("var(--line-height-tiny)");
  });
});
