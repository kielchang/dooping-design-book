// 套用驗收：從乾淨的取用端專案裝一次——證明別的系統照 AGENTS.md 的步驟，真的裝得起來、建得過、畫得對。
//
//   npm run build:tokens && npm run verify:consumer
//   KEEP_CONSUMER=1 npm run verify:consumer                   # 保留暫存專案（路徑印在最後）
//   CONSUMER_DIR=<repo 外、不存在或空的目錄> npm run verify:consumer
//
// 其他守衛都在 monorepo 裡驗（workspace 連結、hoist 過的 node_modules、預先抄好的元件），取用端不會有那些。
// 這支在 repo 外的暫存目錄，用 fixtures/consumer-vite-v4 建一個 Vite＋React＋Tailwind v4 專案，然後：
//   1. token：`npm pack` 出 tarball，由本機 npm 端點供應——staging 在 npm 發佈之前，npm 上可能還沒有這一版
//   2. 元件：真的 `npx shadcn add` 內部試裝宿主的安裝集；registry 由本機伺服器以本機 base 重建
//   3. 靜態：裝進來的每個檔＝registry 內容；globals.css 與 components.json 沒被 CLI 改寫；
//      token 的版本、實體位置、lockfile 來源、exports 可解析；item 宣告的 npm 相依都進了 package.json
//   4. 建置：`tsc -b && vite build`（create-vite 的嚴格設定，每個裝進來的檔都要過型別檢查）
//   5. dooping-check：lock 初始化後 `--strict` 結束碼 0（走本機 HTTP）
//   6. 瀏覽器：三組主題×模式對 token 期望值（Card、Button、color-mix、Dialog 與 Select 的 portal 面板）、
//      零 pageerror／console error、axe（color-contrast 歸 verify:color）
//
// 不涵蓋：Next.js App Router、Tailwind v3、Base UI 共存——各自另案評估。
// 規則正本：book/docs/7-governance/01-versioning.mdx「三段式發布」；範本說明見 fixtures/consumer-vite-v4/README.md。
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { chromium } from "playwright";
import { contentHash, resolveTargets } from "../templates/dooping-check.mjs";
import { ROOT, SHADCN, buildRegistry, run, startRegistryServer } from "./lib/serve-registry.mjs";
import { loadTokens, near, parseColor, resolveTokenRgb, rgbStr, tokenValue } from "./lib/token-expect.mjs";

const TEMPLATE = join(ROOT, "fixtures/consumer-vite-v4");
const REGISTRY_OUT = "registry-consumer";
const MIN_ITEMS = 20;
const ALPHA_TOL = 0.05;
const MINUTE = 60_000;

const failures = [];
const fail = (msg) => failures.push(msg);
const step = (msg) => console.log(`\n[verify-consumer] ${msg}`);
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const isInside = (child, parent) => {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
};

const tokens = loadTokens(ROOT);
const DEFAULT_THEME = tokens.meta.defaultTheme;
const OTHER_THEME = Object.keys(tokens.themes).find((t) => t !== DEFAULT_THEME);
const tokensPkg = readJson(join(ROOT, "packages/tokens/package.json"));
const installSet = readJson(join(ROOT, "apps/host-v4/dooping.install.json")).items;
const lockPackages = readJson(join(ROOT, "package-lock.json")).packages;
const pin = (name) => {
  const version = lockPackages[`node_modules/${name}`]?.version;
  if (!version) throw new Error(`根 package-lock.json 找不到 ${name}`);
  return version;
};
const packageName = (spec) => spec.replace(/^(@[^/]+\/[^@]+|[^@]+)@.*$/, "$1");

function prepareDir() {
  if (!existsSync(join(ROOT, "packages/tokens/dist/tokens.css"))) throw new Error("packages/tokens/dist 不存在——先跑 npm run build:tokens");
  const dir = process.env.CONSUMER_DIR ? resolve(process.env.CONSUMER_DIR) : mkdtempSync(join(tmpdir(), "dooping-consumer-"));
  if (isInside(dir, ROOT)) throw new Error(`暫存專案不能在 repo 裡（${dir}）——會吃到 monorepo 的 node_modules，驗不出取用端的樣子`);
  if (existsSync(dir) && readdirSync(dir).length > 0) throw new Error(`CONSUMER_DIR 不是空目錄：${dir}`);
  mkdirSync(dir, { recursive: true });
  for (let p = dirname(dir); p !== dirname(p); p = dirname(p))
    if (existsSync(join(p, "node_modules"))) console.warn(`[verify-consumer] 注意：上層目錄有 node_modules（${p}），解析可能漏進去`);
  return dir;
}

function packTokens(dir) {
  const vendor = join(dir, "vendor");
  mkdirSync(vendor, { recursive: true });
  const out = execFileSync("npm", ["pack", "--workspace", "@dooping/tokens", "--pack-destination", vendor, "--json"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const info = JSON.parse(out.slice(out.indexOf("[")))[0];
  const files = new Set(info.files.map((f) => f.path));
  for (const required of ["dist/tokens.css", "dist/tailwind.css", "dist/index.js", "src/tokens.json", "tailwind-preset.cjs"])
    if (!files.has(required)) fail(`npm pack 的 tarball 少了 ${required}——packages/tokens/package.json 的 files 漏列`);
  return join(vendor, info.filename);
}

function writeProject(dir, base) {
  cpSync(TEMPLATE, dir, { recursive: true, filter: (src) => !src.endsWith("README.md") });
  const dev = ["@tailwindcss/vite", "@types/node", "@types/react", "@types/react-dom", "@vitejs/plugin-react", "tailwindcss", "typescript", "vite"];
  writeFileSync(
    join(dir, "package.json"),
    `${JSON.stringify(
      {
        name: "dooping-consumer-check",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: { build: "tsc -b && vite build" },
        dependencies: { react: pin("react"), "react-dom": pin("react-dom"), "tw-animate-css": pin("tw-animate-css") },
        devDependencies: Object.fromEntries(dev.map((n) => [n, pin(n)])),
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(join(dir, ".npmrc"), `@dooping:registry=${base}/npm/\nfund=false\naudit=false\nfetch-retries=4\n`);
}

/** 安裝集＋遞移 registry 相依：`shadcn add` 會寫進專案的，就是這些 item 的檔。 */
function closure(names) {
  const seen = new Map();
  const queue = [...names];
  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    const item = readJson(join(ROOT, REGISTRY_OUT, `${name}.json`));
    seen.set(name, item);
    for (const ref of item.registryDependencies ?? []) queue.push(ref.split("/").pop().replace(/\.json$/, ""));
  }
  return [...seen.values()];
}

function staticChecks(dir, base) {
  // CLI 不准改寫取用端的全域樣式與設定：改寫＝取用端照做會被蓋掉自己的東西
  for (const file of ["src/globals.css", "components.json"])
    if (!readFileSync(join(dir, file)).equals(readFileSync(join(TEMPLATE, file)))) fail(`${file} 被 shadcn CLI 改寫了（與範本不同）`);

  const items = closure(installSet);
  const mapTarget = resolveTargets(dir);
  let fileCount = 0;
  const npmDeps = new Set();
  for (const item of items) {
    for (const dep of item.dependencies ?? []) npmDeps.add(packageName(dep));
    for (const file of item.files ?? []) {
      const path = mapTarget(file.target ?? file.path);
      fileCount++;
      const abs = join(dir, path);
      if (!existsSync(abs)) fail(`${item.name}：${path} 沒有被裝進專案`);
      else if (contentHash(readFileSync(abs, "utf8")) !== contentHash(file.content ?? "")) fail(`${item.name}：${path} 與 registry 內容不同（CLI 改寫了檔案）`);
    }
  }
  if (fileCount < MIN_ITEMS) fail(`只比對到 ${fileCount} 個檔——安裝集或 registry 讀壞了，驗收不能空轉`);

  const pkg = readJson(join(dir, "package.json"));
  const declared = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const dep of npmDeps) if (!declared[dep]) fail(`item 宣告的 npm 相依 ${dep} 沒有進 package.json`);

  const installed = join(dir, "node_modules/@dooping/tokens");
  if (!existsSync(installed)) {
    fail("node_modules/@dooping/tokens 不存在——shadcn 沒有裝到 token");
    return fileCount;
  }
  const installedPkg = readJson(join(installed, "package.json"));
  if (installedPkg.version !== tokensPkg.version) fail(`裝到的 @dooping/tokens 是 ${installedPkg.version}，repo 是 ${tokensPkg.version}`);
  if (!isInside(realpathSync(installed), realpathSync(dir))) fail(`@dooping/tokens 實體不在專案裡（${realpathSync(installed)}）——是連結不是安裝`);
  const resolved = readJson(join(dir, "package-lock.json")).packages?.["node_modules/@dooping/tokens"]?.resolved ?? "";
  if (!resolved.startsWith(`${base}/npm/`)) fail(`@dooping/tokens 不是從受測的 tarball 裝的（lockfile resolved＝${resolved || "空"}）`);
  if (!readFileSync(join(installed, "dist/tokens.css")).equals(readFileSync(join(ROOT, "packages/tokens/dist/tokens.css"))))
    fail("裝到的 dist/tokens.css 與 repo 建置產物不同");
  const targets = (value) => (typeof value === "string" ? [value] : Object.values(value ?? {}).flatMap(targets));
  for (const [subpath, value] of Object.entries(installedPkg.exports ?? {}))
    for (const target of targets(value)) if (!existsSync(join(installed, target))) fail(`exports「${subpath}」指向不存在的 ${target}`);
  return fileCount;
}

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json" };

function serveDist(dist) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = normalize(join(dist, path === "/" ? "index.html" : path));
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(dist, "index.html");
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

async function launch() {
  try {
    return await chromium.launch({ headless: true });
  } catch (e) {
    if (existsSync("/opt/pw-browsers/chromium")) return chromium.launch({ headless: true, executablePath: "/opt/pw-browsers/chromium" });
    throw e;
  }
}

/** 元素本身或最近的祖先中第一個不透明的底色（portal 面板的底色可能掛在外層） */
const panelBackground = (selector) =>
  (sel) => {
    let el = document.querySelector(sel);
    for (let i = 0; el && i < 4; i++, el = el.parentElement) {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== "transparent" && !/rgba\(0, 0, 0, 0\)/.test(bg)) return bg;
    }
    return null;
  };

async function browserChecks(dir) {
  const server = await serveDist(join(dir, "dist"));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await launch();
  const axeSource = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
  const combos = [[DEFAULT_THEME, "light"], [DEFAULT_THEME, "dark"], [OTHER_THEME, "dark"]];
  try {
    for (const [theme, mode] of combos) {
      const label = `${theme}／${mode}`;
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(`pageerror：${String(e.message).slice(0, 200)}`));
      page.on("console", (m) => m.type() === "error" && errors.push(`console error：${m.text().slice(0, 200)}`));
      const query = new URLSearchParams({ ...(theme === DEFAULT_THEME ? {} : { theme }), ...(mode === "dark" ? { mode } : {}) });
      await page.goto(`${origin}/?${query}`, { waitUntil: "load" });
      await page.waitForSelector("h1", { timeout: 15_000 });

      const expect = (name) => resolveTokenRgb(tokens, theme, mode, name);
      let probe = null;
      for (let attempt = 0; attempt < 6; attempt++) {
        probe = await page.evaluate(() => {
          const bg = (sel) => (document.querySelector(sel) ? getComputedStyle(document.querySelector(sel)).backgroundColor : null);
          return {
            backgroundVar: getComputedStyle(document.documentElement).getPropertyValue("--background").trim(),
            card: bg('[data-probe="card"]'),
            primary: bg('[data-probe="primary"]'),
            mix: bg('[data-probe="color-mix"]'),
          };
        });
        if (near(parseColor(probe.card).rgb, expect("card")) && near(parseColor(probe.primary).rgb, expect("primary"))) break;
        await sleep(250 * (attempt + 1));
      }
      const wantVar = tokenValue(tokens, theme, mode, "background");
      if (probe.backgroundVar.replace(/\s+/g, " ") !== wantVar) fail(`[${label}] --background＝「${probe.backgroundVar}」，tokens.json 是「${wantVar}」`);
      if (!near(parseColor(probe.card).rgb, expect("card"))) fail(`[${label}] Card 底色 ${probe.card} ≠ --card ${rgbStr(expect("card"))}`);
      if (!near(parseColor(probe.primary).rgb, expect("primary"))) fail(`[${label}] Button 底色 ${probe.primary} ≠ --primary ${rgbStr(expect("primary"))}`);
      if (Math.abs(parseColor(probe.mix).alpha - 0.5) > ALPHA_TOL) fail(`[${label}] bg-primary/50 的 alpha 不是 0.5（${probe.mix}）`);

      await page.click('[data-probe="primary"]');
      await page.waitForSelector('[role="dialog"]', { timeout: 10_000 }).catch(() => fail(`[${label}] Dialog 沒有開起來`));
      const dialogBg = await page.evaluate(panelBackground(), '[role="dialog"]');
      if (!near(parseColor(dialogBg).rgb, expect("background"))) fail(`[${label}] Dialog 面板底色 ${dialogBg} ≠ --background ${rgbStr(expect("background"))}`);
      await page.keyboard.press("Escape");
      await page.waitForSelector('[role="dialog"]', { state: "detached", timeout: 10_000 }).catch(() => fail(`[${label}] Dialog 按 Esc 沒有關閉`));

      await page.click('[data-probe="select-trigger"]');
      await page.waitForSelector('[role="listbox"]', { timeout: 10_000 }).catch(() => fail(`[${label}] Select 清單沒有開起來`));
      const listBg = await page.evaluate(panelBackground(), '[role="listbox"]');
      if (!near(parseColor(listBg).rgb, expect("popover"))) fail(`[${label}] Select 清單底色 ${listBg} ≠ --popover ${rgbStr(expect("popover"))}`);
      await page.keyboard.press("Escape");

      if (theme === DEFAULT_THEME && mode === "light") {
        await page.addScriptTag({ content: axeSource });
        const violations = await page.evaluate(async () => {
          const result = await window.axe.run(document, { rules: { "color-contrast": { enabled: false } } });
          return result.violations.map((v) => `${v.id}（${v.nodes.length} 處）`);
        });
        for (const v of violations) fail(`[${label}] axe：${v}`);
      }
      for (const e of errors) fail(`[${label}] ${e}`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  return combos.length;
}

async function main() {
  const started = Date.now();
  if (installSet.length < MIN_ITEMS) throw new Error(`安裝集只有 ${installSet.length} 個 item（下限 ${MIN_ITEMS}）——驗收不能空轉`);
  const dir = prepareDir();
  step(`暫存專案：${dir}`);

  step("npm pack @dooping/tokens");
  const tarball = packTokens(dir);

  const { type, main: entry, types, exports } = tokensPkg;
  const server = await startRegistryServer({
    registryDir: join(ROOT, REGISTRY_OUT),
    npmPackage: { name: tokensPkg.name, version: tokensPkg.version, tarball, manifest: { type, main: entry, types, exports } },
  });
  let fileCount = 0;
  let combos = 0;
  try {
    const { base } = server;
    step(`registry（base ${base}）`);
    await buildRegistry({ base, out: REGISTRY_OUT });
    writeProject(dir, base);

    step("npm install");
    await run("npm", ["install", "--no-audit", "--no-fund"], { cwd: dir, timeoutMs: 10 * MINUTE });

    step(`npx ${SHADCN} add（${installSet.length} 個 item）`);
    await run("npx", ["--yes", SHADCN, "add", "--yes", "--overwrite", ...installSet.map((n) => `${base}/r/${n}.json`)], {
      cwd: dir,
      env: { CI: "1" },
      timeoutMs: 15 * MINUTE,
      stdio: ["ignore", "inherit", "inherit"],
    });

    step("靜態比對");
    fileCount = staticChecks(dir, base);

    step("建置（tsc -b && vite build）");
    await run("npm", ["run", "build"], { cwd: dir, timeoutMs: 10 * MINUTE }).catch((e) => fail(`建置失敗：${e.message}`));

    step("dooping-check（lock 初始化 → --strict）");
    await run("node", ["scripts/dooping-check.mjs", "init", ...installSet, "--registry", `${base}/r`], { cwd: dir })
      .then(() => run("node", ["scripts/dooping-check.mjs", "--strict"], { cwd: dir }))
      .catch((e) => fail(`dooping-check：${e.message}`));
  } finally {
    await server.close();
  }

  if (existsSync(join(dir, "dist/index.html"))) {
    step("瀏覽器（主題×模式、portal 面板、console、axe）");
    combos = await browserChecks(dir);
  }

  const seconds = Math.round((Date.now() - started) / 1000);
  const keep = process.env.KEEP_CONSUMER === "1" || Boolean(process.env.CONSUMER_DIR);
  if (!keep) rmSync(dir, { recursive: true, force: true });
  if (failures.length) {
    console.error(`\n✗ 套用驗收不通過（${failures.length} 項，${seconds} 秒）：\n${failures.map((f) => `  ${f}`).join("\n")}`);
    console.error("\n規則正本：book/docs/7-governance/01-versioning.mdx「三段式發布」；範本：fixtures/consumer-vite-v4/README.md");
    if (keep) console.error(`暫存專案保留在：${dir}`);
    process.exitCode = 1;
    return;
  }
  console.log(`\n✓ 套用驗收通過：${installSet.length} 個 item（${fileCount} 個檔）、tsc＋vite build、dooping-check、${combos} 組主題×模式（${seconds} 秒）`);
  if (keep) console.log(`暫存專案保留在：${dir}`);
}

main().catch((e) => {
  console.error(`[verify-consumer] ${e.message}`);
  process.exitCode = 1;
});
