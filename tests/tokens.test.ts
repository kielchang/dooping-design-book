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
import { tokensJson, tokenKeys, expectedColorKeys } from "./lib/token-keys";

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

    // registry:file（取用端工具，例如 dooping-check）不是元件、不吃 token，放行（ADR-0013 第二層）
    const stale = read("registry/index.json")
      .items.filter((i: { type: string }) => i.type !== "registry:file")
      .map((i: { name: string }) => i.name)
      .filter((name: string) => !read(`registry/${name}.json`).dependencies?.includes(expected));

    expect(stale, `這些 item 沒有相依 ${expected}，請重跑 npm run build:registry：${stale.join(", ")}`)
      .toEqual([]);
  });

  // 配對模型的守衛：registry index 的 tokensVersion 是「規範 ↔ tokens」配對的
  // 機器可讀正本，必須恆等於 react/package.json 宣告的相依版。
  // 它漂移的話，取用端從 /r/index.json 讀到的配對就是謊——
  // 而那正是它存在的唯一目的。
  it("registry index 的 tokensVersion 等於宣告的相依版", () => {
    const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
    const indexPath = join(ROOT, "registry/index.json");
    if (!existsSync(indexPath)) return;

    const declared = read("packages/react/package.json")
      .dependencies["@dooping/tokens"].replace(/^[\^~>=<\s]+/, "");
    expect(
      read("registry/index.json").tokensVersion,
      "registry/index.json 的 tokensVersion 與宣告不符，請重跑 npm run build:registry",
    ).toBe(declared);
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

  // 上一支只掃 color.*（semanticColors 的來源）。只存在於主題層的 token
  // （brand 家族、sidebar-primary/accent 家族）不在其中，漏了對映不會有任何測試紅——
  // 元件寫 bg-sidebar-accent 時 Tailwind 直接產不出樣式，安靜壞掉。
  it("Tailwind preset 對映主題層 token（brand 與 sidebar-primary/accent 家族）", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");
    const flat = JSON.stringify(preset.theme.colors);
    const missing = [
      "brand", "brand-foreground", "brand-subtle", "brand-subtle-foreground",
      "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground",
    ].filter((k) => !flat.includes(`--${k})`));
    expect(missing, `preset 未對映主題層 token：${missing.join(", ")}`).toEqual([]);
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

// ── Tailwind v4 入口（dist/tailwind.css） ────────────────────────────────
// 同一份事實（tokens.json 的鍵集）現在有兩個出口：v3 的 preset 與 v4 的 @theme。
// 任何一邊漏鍵，那個版本的宿主寫 bg-sidebar-accent 就安靜地產不出樣式——不報錯、測試不紅。
// 所以三方比對：JSON 推導的鍵集 ＝ v4 檔的 --color-* ＝ v3 preset 攤平後的 class 名。
const V4_PATH = join(ROOT, "packages/tokens/dist/tailwind.css");

const readV4 = () => readFileSync(V4_PATH, "utf8");
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** @theme 區塊內的宣告（去註解）→ name→value。區塊內沒有大括號，[^}]* 夠用。 */
function v4ThemeDecls(css: string): Map<string, string> {
  const block = /@theme\s+inline\s+reference\s*\{([^}]*)\}/.exec(stripComments(css))?.[1] ?? "";
  const out = new Map<string, string>();
  for (const m of block.matchAll(/(--[\w*-]+)\s*:\s*([^;]+);/g)) out.set(m[1], m[2].trim());
  return out;
}

const v4ColorNames = (decls: Map<string, string>) =>
  [...decls.keys()].filter((k) => k.startsWith("--color-") && k !== "--color-*").map((k) => k.slice("--color-".length));

/** v3 preset 的 theme.colors 攤平成 class 名（DEFAULT → 本名；子鍵 → 本名-子鍵） */
function flattenPresetColors(colors: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(colors)) {
    if (typeof v === "string") out.push(k);
    else for (const sub of Object.keys(v as object)) out.push(sub === "DEFAULT" ? k : `${k}-${sub}`);
  }
  return out;
}

describe("Tailwind v4 入口（dist/tailwind.css）", () => {
  it("產物存在", () => {
    expect(existsSync(V4_PATH), "請先執行 npm run build:tokens").toBe(true);
  });

  it("色鍵集合＝tokens.json 推導（語意層 ∪ 主題層獨有 ∪ 圖表），不多不少", () => {
    const actual = v4ColorNames(v4ThemeDecls(readV4()))
      .filter((k) => k !== "white" && k !== "black")
      .sort();
    expect(actual, "dist/tailwind.css 與 tokens.json 不同步，請重跑 npm run build:tokens").toEqual(expectedColorKeys());
  });

  it("v3 preset 與 v4 入口對映同一組 class 名（同一份事實的兩個出口）", () => {
    const preset = require("../packages/tokens/tailwind-preset.cjs");
    const v3 = new Set(flattenPresetColors(preset.theme.colors));
    // 這三個在 v4 是內建靜態 utility，不經 @theme
    for (const s of ["transparent", "current", "inherit"]) v3.delete(s);
    const v4 = new Set(v4ColorNames(v4ThemeDecls(readV4())));
    expect({
      onlyInV3: [...v3].filter((k) => !v4.has(k)),
      onlyInV4: [...v4].filter((k) => !v3.has(k)),
    }).toEqual({ onlyInV3: [], onlyInV4: [] });
  });

  it("色值一律 var() 回 tokens.css：語意色包 hsl()、圖表色不包，檔內不含字面色值", () => {
    const decls = v4ThemeDecls(readV4());
    const chart = new Set(tokenKeys(tokensJson.chart.light));
    const wrong = v4ColorNames(decls)
      .filter((k) => k !== "white" && k !== "black")
      .filter((k) => decls.get(`--color-${k}`) !== (chart.has(k) ? `var(--${k})` : `hsl(var(--${k}))`));
    expect(wrong, `對映值不符：${wrong.join(", ")}`).toEqual([]);
  });

  it("編譯層防線①：清空預設色盤，只補回 white／black", () => {
    const decls = v4ThemeDecls(readV4());
    expect(decls.get("--color-*"), "少了 --color-*: initial，Tailwind 預設色盤會留著").toBe("initial");
    expect(decls.get("--color-white")).toBe("#fff");
    expect(decls.get("--color-black")).toBe("#000");
  });

  // 實測（tailwindcss 4.3.3）：只寫 inline 時，被 utility 用到的主題變數會吐進
  // `@layer theme { :root, :host { … } }`。圓角與陰影與 tokens.css 同名，吐出來就是
  // `--shadow-sm: var(--shadow-sm)`——一般頁面被 unlayered 的 tokens.css 蓋掉看不出來，
  // shadow DOM 裡直接失效。reference 讓它不吐。
  it("用 @theme inline reference（缺 reference 會吐出同名自我參照變數）", () => {
    const css = stripComments(readV4());
    expect(css).toMatch(/@theme\s+inline\s+reference\s*\{/);
    expect(css).not.toMatch(/@theme\s+inline\s*\{/);
  });

  it("非色彩 token 逐鍵對映（圓角、陰影、字級含行高、字體、動態、互動尺寸）", () => {
    const decls = v4ThemeDecls(readV4());
    const want: [string, string][] = [
      ...tokenKeys(tokensJson.radius)
        .filter((k) => k !== "base" && k !== "full")
        .map((k): [string, string] => [`--radius-${k}`, `var(--radius-${k})`]),
      ...tokenKeys(tokensJson.shadow).map((k): [string, string] => [`--shadow-${k}`, `var(--shadow-${k})`]),
      ...tokenKeys(tokensJson.fontSize).flatMap((k): [string, string][] => [
        [`--text-${k}`, `var(--font-size-${k})`],
        [`--text-${k}--line-height`, `var(--line-height-${k})`],
      ]),
      ...tokenKeys(tokensJson.fontFamily).map((k): [string, string] => [`--font-${k}`, `var(--font-family-${k})`]),
      ...tokenKeys(tokensJson.duration).map((k): [string, string] => [`--transition-duration-${k}`, `var(--duration-${k})`]),
      ...tokenKeys(tokensJson.easing).map((k): [string, string] => [`--ease-${k}`, `var(--easing-${k})`]),
      ...tokenKeys(tokensJson.size).map((k): [string, string] => [`--spacing-${k}`, `var(--size-${k})`]),
    ];
    const missing = want.filter(([name, value]) => decls.get(name) !== value).map(([name]) => name);
    expect(missing, `v4 入口缺少或對映錯誤：${missing.join(", ")}`).toEqual([]);
  });

  it('深色 variant 同時認 .dark 與 [data-theme="dark"]；基座補邊框預設色與按鈕游標', () => {
    const css = stripComments(readV4());
    const variant = /@custom-variant\s+dark\s*\(([^;]*)\);/.exec(css)?.[1] ?? "";
    expect(variant).toContain(".dark");
    expect(variant).toContain('[data-theme="dark"]');
    const base = css.slice(css.indexOf("@layer base"));
    expect(base, "v4 preflight 的邊框色是 currentColor，基座必須接回 token").toContain("border-color: hsl(var(--border))");
    expect(base, "v4 preflight 拿掉了按鈕游標").toContain("cursor: pointer");
  });
});

describe("tokens.css：強制色彩模式的焦點備援", () => {
  // v4 的 outline-none 是 outline-style: none；強制色彩模式又會移除 box-shadow（聚焦環）。
  // 沒有這段，Windows 高對比下鍵盤使用者看不到焦點在哪。
  it("forced-colors 下 :focus-visible 有透明 outline（由系統色顯形）", () => {
    const css = readFileSync(CSS_PATH, "utf8");
    const at = css.indexOf("@media (forced-colors: active)");
    expect(at, "tokens.css 缺少強制色彩模式的焦點備援").toBeGreaterThanOrEqual(0);
    const block = css.slice(at, css.indexOf("}\n}", at) + 3);
    expect(block).toContain(":focus-visible");
    expect(block).toMatch(/outline:\s*2px solid transparent !important/);
  });
});
