// Token 一致性守衛：淺／深色成對、CSS 產物與來源同步、Tailwind preset 覆蓋完整。
//
// 最容易發生的漂移是「加了一個淺色 token 但忘了配深色」——深色模式當場破一個洞，
// 而且通常要等到有人切到深色才會發現。
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createRequire } from "node:module";
import { semanticColors, chartColors, TOKENS_VERSION } from "@dooping/tokens";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const CSS_PATH = join(ROOT, "packages/tokens/dist/tokens.css");

describe("設計 token", () => {
  it("版號為 SemVer", () => {
    expect(TOKENS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  // 版號散落在三個檔案：npm 看 package.json，取用端讀到的 TOKENS_VERSION 來自
  // tokens.json 的 meta，而 @dooping/react 另外釘一次相依版本。
  // 發版時 `npm version` 只會動第一個，另外兩個要手動跟上——漏了就會出現
  // 「npm 上是 0.1.1、程式裡回報 0.1.0」這種對不起來的狀況，而且不會有任何東西報錯。
  it("三處版號一致（package.json／tokens.json meta／react 的相依）", () => {
    const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
    const pkg = read("packages/tokens/package.json").version;
    const meta = read("packages/tokens/src/tokens.json").meta.version;
    const dep = read("packages/react/package.json").dependencies["@dooping/tokens"];

    expect(meta, "tokens.json 的 meta.version 與 package.json 不一致").toBe(pkg);
    expect(dep, "@dooping/react 釘的 tokens 版本與 package.json 不一致").toBe(pkg);
    expect(TOKENS_VERSION, "請重新執行 npm run build:tokens").toBe(pkg);
  });

  // 規範版號的正本是根目錄 package.json 的 version——進版時部署照它蓋 vX.Y.Z tag，
  // registry 產生器也把它戳進每個 item。packages/react 與 version.ts 的 KIT_VERSION
  // 是跟隨它的複本。任何一處漂移，取用端看到的「我抄的是哪一版」就會說謊，
  // 或者 tag 蓋出來跟戳記對不上。
  it("規範版號一致（root package.json／react package.json／version.ts／registry 戳記）", () => {
    const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
    const spec = read("package.json").version;

    expect(read("packages/react/package.json").version,
      "react/package.json 未跟隨根目錄的規範版號").toBe(spec);

    const src = readFileSync(join(ROOT, "packages/react/src/version.ts"), "utf8");
    const kit = src.match(/version:\s*"([^"]+)"/)?.[1];
    expect(kit, "version.ts 的 KIT_VERSION 未跟隨規範版號").toBe(spec);

    const indexPath = join(ROOT, "registry/index.json");
    if (existsSync(indexPath)) {
      const index = read("registry/index.json");
      expect(index.version, "registry/index.json 的戳記過期，請重跑 npm run build:registry").toBe(spec);
      expect(read("registry/button.json").version, "registry item 的戳記過期").toBe(spec);
    }
  });

  it("每個淺色語意 token 都有對應的深色值", () => {
    const light = Object.keys(semanticColors("light"));
    const dark = new Set(Object.keys(semanticColors("dark")));
    const missing = light.filter((k) => !dark.has(k));
    expect(missing, `深色缺少：${missing.join(", ")}`).toEqual([]);
  });

  it("圖表色票淺／深各 8 色", () => {
    expect(chartColors("light")).toHaveLength(8);
    expect(chartColors("dark")).toHaveLength(8);
  });

  it("圖表色票在同一主題內沒有重複色（相鄰系列才分得開）", () => {
    for (const mode of ["light", "dark"] as const) {
      const c = chartColors(mode);
      expect(new Set(c).size, `${mode} 有重複色`).toBe(c.length);
    }
  });

  it("CSS 產物存在，且同時提供 .dark 與 [data-theme=\"dark\"] 兩種宿主鉤子", () => {
    expect(existsSync(CSS_PATH), "請先執行 npm run build:tokens").toBe(true);
    const css = readFileSync(CSS_PATH, "utf8");
    expect(css).toContain(".dark,");
    expect(css).toContain('[data-theme="dark"]');
  });

  it("CSS 產物與來源同步（每個語意 token 都出現在 :root）", () => {
    const css = readFileSync(CSS_PATH, "utf8");
    const missing = Object.keys(semanticColors("light")).filter((k) => !css.includes(`--${k}:`));
    expect(missing, `CSS 未包含：${missing.join(", ")}。請重新 npm run build:tokens`).toEqual([]);
  });

  it("Tailwind preset 對映到每個語意色（少一個就會有人回頭硬編色）", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");
    const flat = JSON.stringify(preset.theme.extend.colors);
    const missing = Object.keys(semanticColors("light"))
      .filter((k) => !k.endsWith("-foreground"))
      .filter((k) => !flat.includes(`--${k})`));
    expect(missing, `preset 未對映：${missing.join(", ")}`).toEqual([]);
  });

  it("深色模式的鉤子兩者皆生效（darkMode 設定含 class 與 data-theme）", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");
    expect(preset.darkMode).toEqual(["class", '[data-theme="dark"]']);
  });
});
