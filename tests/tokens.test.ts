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

  // 這一條是「npm 上的 token 落後四個版本都沒人發現」的直接補丁。
  // registry item 要是不寫出 token 相依，`npx shadcn add` 就只複製原始碼、不裝 token，
  // 取用端拿到吃 `var(--brand)` 與 `.state-layer` 的元件卻沒有對應的 token——
  // 畫面壞掉而且不會報錯。相依寫出來之後，這裡再確認它沒有跟宣告值漂移。
  it("每個 registry item 都相依當前宣告的 @dooping/tokens 版本", () => {
    const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
    const indexPath = join(ROOT, "registry/index.json");
    if (!existsSync(indexPath)) return;

    const declared = read("packages/react/package.json").dependencies["@dooping/tokens"];
    const expected = `@dooping/tokens@^${declared.replace(/^[\^~>=<\s]+/, "")}`;

    const stale = read("registry/index.json")
      .items.map((i: { name: string }) => i.name)
      .filter((name: string) => !read(`registry/${name}.json`).dependencies?.includes(expected));

    expect(stale, `這些 item 沒有相依 ${expected}，請重跑 npm run build:registry：${stale.join(", ")}`)
      .toEqual([]);
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
    // 色彩刻意放在 theme.colors（覆蓋）而不是 theme.extend.colors（擴充）——見下一支測試。
    const flat = JSON.stringify(preset.theme.colors);
    const missing = Object.keys(semanticColors("light"))
      .filter((k) => !k.endsWith("-foreground"))
      .filter((k) => !flat.includes(`--${k})`));
    expect(missing, `preset 未對映：${missing.join(", ")}`).toEqual([]);
  });

  // 三道防漂移防線的第一道：清空 Tailwind 預設色盤，讓 bg-red-500 在取用端
  // 編譯期就產不出樣式。這一條一旦被改回 extend，防線會安靜地失效——
  // 畫面不會壞、測試不會紅、只有一致性慢慢流失。所以要有守衛盯著。
  it("編譯層防線：預設色盤已清空，只留結構性色值與語意色", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");

    expect(preset.theme.colors, "色彩必須放在 theme.colors 覆蓋預設色盤").toBeTruthy();
    expect(preset.theme.extend?.colors, "色彩不可放在 theme.extend.colors，那樣預設色盤會留著").toBeUndefined();

    const names = Object.keys(preset.theme.colors);
    const leaked = ["red", "blue", "green", "slate", "gray", "zinc", "amber", "yellow"]
      .filter((c) => names.includes(c));
    expect(leaked, `Tailwind 預設色盤外洩：${leaked.join(", ")}`).toEqual([]);

    // 這五個不承載品牌語意，拿掉只會逼人改用 hex 繞路
    for (const keep of ["transparent", "current", "inherit", "white", "black"]) {
      expect(names, `結構性色值 ${keep} 不應被移除`).toContain(keep);
    }

    // 間距／圓角／字級刻度仍走 extend——那些不需要清空（語意化間距是反模式）
    expect(preset.theme.extend?.spacing, "間距應維持 extend，不要覆蓋 Tailwind 數字刻度").toBeTruthy();
  });

  it("深色模式的鉤子兩者皆生效（darkMode 設定含 class 與 data-theme）", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");
    expect(preset.darkMode).toEqual(["class", '[data-theme="dark"]']);
  });
});
