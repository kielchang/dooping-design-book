// Tailwind v4 可編譯守衛 —— tokens.test.ts 驗 dist/tailwind.css「寫得對」（字串層級），
// 這支驗它「編得出來」：用 repo 裝的 tailwindcss v4 真的編一次，對產出的 CSS 斷言。
//
// 字串守衛看不到的是 Tailwind 自己的命名空間。例如 duration-* 讀的是 --transition-duration-*——
// 官方文件沒列，是從原始碼確認的。Tailwind 升版改掉它時，字串守衛照樣綠、宿主的 duration-fast
// 安靜失效，只有這支會紅。reference 那條同理：「會不會往 :root 吐變數」只有真的編過才知道。
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";
import { expectedColorKeys, chartKeys, ruleFor } from "./lib/token-keys";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const DIST = join(ROOT, "packages/tokens/dist");
const TW_INDEX = join(dirname(require.resolve("tailwindcss/package.json")), "index.css");

/** 非色彩 utility → 產出規則裡必須出現的宣告 */
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

async function build(candidates: string[]): Promise<string> {
  const files: Record<string, string> = {
    tailwindcss: TW_INDEX,
    "@dooping/tokens/tokens.css": join(DIST, "tokens.css"),
    "@dooping/tokens/tailwind.css": join(DIST, "tailwind.css"),
  };
  const input = [
    '@import "tailwindcss";',
    '@import "@dooping/tokens/tokens.css";',
    '@import "@dooping/tokens/tailwind.css";',
  ].join("\n");
  const compiler = await compile(input, {
    base: DIST,
    loadStylesheet: async (id: string, base: string) => {
      const path = files[id] ?? resolve(base, id);
      return { path, base: dirname(path), content: readFileSync(path, "utf8") };
    },
  });
  return compiler.build(candidates);
}

let css = "";

beforeAll(async () => {
  css = await build([
    ...expectedColorKeys().map((k) => `bg-${k}`),
    "bg-primary/50", "bg-red-500", "bg-white", "bg-black", "dark:bg-card",
    ...Object.keys(NON_COLOR),
  ]);
});

describe("Tailwind v4 可編譯守衛（真的用 tailwindcss v4 編 dist/tailwind.css）", () => {
  it("跑的真的是 v4", () => {
    expect(require("tailwindcss/package.json").version).toMatch(/^4\./);
  });

  it("每個色鍵都產得出 bg-*，值指向同名 CSS 變數", () => {
    const chart = new Set(chartKeys());
    const wrong = expectedColorKeys().filter((k) => {
      const want = chart.has(k) ? `var(--${k})` : `hsl(var(--${k}))`;
      return !ruleFor(css, `bg-${k}`)?.includes(`background-color: ${want}`);
    });
    expect(wrong, `產不出或值不對：${wrong.join(", ")}\n為什麼：dist/tailwind.css 是取用端的四行 @import 之一，真的用 v4 編不出來就是契約壞了\n規則正本：packages/tokens/README.md「v4 入口」、AGENTS.md「取 token」`).toEqual([]);
  });

  it("透明度修飾可用（bg-primary/50 → color-mix）", () => {
    expect(ruleFor(css, "bg-primary/50")).toContain("color-mix(in oklab, hsl(var(--primary)) 50%, transparent)");
  });

  it("預設色盤已清空、white／black 補回", () => {
    expect(ruleFor(css, "bg-red-500"), "bg-red-500 不該產得出來").toBeNull();
    expect(ruleFor(css, "bg-white")).toContain("#fff");
    expect(ruleFor(css, "bg-black")).toContain("#000");
  });

  it('dark: variant 同時認 .dark 與 [data-theme="dark"]', () => {
    const rule = ruleFor(css, "dark:bg-card") ?? "";
    expect(rule).toContain(".dark");
    expect(rule).toContain('[data-theme="dark"]');
  });

  it("非色彩 utility 讀到 token 變數（含未文件化的 --transition-duration-* 命名空間）", () => {
    const wrong = Object.entries(NON_COLOR).filter(([c, decl]) => !ruleFor(css, c)?.includes(decl)).map(([c]) => c);
    expect(wrong, `沒讀到 token：${wrong.join(", ")}`).toEqual([]);
    expect(ruleFor(css, "text-tiny"), "字級要帶行高").toContain("var(--line-height-tiny)");
  });

  it("reference 生效：theme layer 不吐同名自我參照變數", () => {
    const theme = css.slice(css.indexOf("@layer theme {"), css.indexOf("@layer base {"));
    expect(theme.length, "找不到 theme layer——Tailwind 輸出結構變了，守衛要跟著改").toBeGreaterThan(0);
    expect(theme).not.toContain("--shadow-sm: var(--shadow-sm)");
    expect(theme).not.toContain("--radius-sm: var(--radius-sm)");
  });

  it("基座進得了 base layer（邊框預設色、按鈕游標）", () => {
    expect(css).toContain("border-color: hsl(var(--border))");
    expect(css).toMatch(/\[role="button"\]:not\(:disabled\)\s*\{\s*cursor: pointer;/);
  });
});
