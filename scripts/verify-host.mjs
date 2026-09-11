// 內部試裝宿主的渲染守衛——token 期望值（主題×模式×頁）＋頁面級 axe＋強制色彩焦點＋行動版外殼＋凍結欄。
//
//   npm run host:build && node scripts/verify-host.mjs
//   HOST_BASE=/dooping-design-book/preview/host/ node scripts/verify-host.mjs   # 建置帶子路徑 base 時
//
// verify:visual 驗 Storybook（本書自己的展示台）、verify:book 驗文件站——兩者都不是「取用端照 AGENTS.md
// 接上來」的樣子。這支驗的是真的走 Tailwind v4 取用路徑的應用（apps/host-v4）：
//   1. 主題真的套上：body 背景＝該主題該模式的 --background、側欄＝--sidebar（tokens.json 反解，±2/channel）。
//      側欄這一步證明 v4 的 bg-sidebar 經 --color-sidebar → hsl(var(--sidebar)) → 主題屬性一路接通。
//   2. color-mix 透明度：設定頁「執行環境」卡的 bg-primary/50 探針，alpha≈0.5。
//   3. 頁面級 axe：Storybook 停用的 region／landmark-one-main／page-has-heading-one／bypass 在這裡**啟用**——
//      宿主是全流水線第一個能驗「一頁一個 h1、內容都在地標裡」的地方。color-contrast 仍歸 verify:color。
//   4. 強制色彩下鍵盤焦點看得見（scripts/lib/forced-colors.mjs，與 verify:storybook 共用）。
//   5. 行動版外殼：窄螢幕側欄轉成抽屜、開得起來、Esc 關閉後焦點回到開關。
//   6. 每一頁零 pageerror、零 console error。
//   7. 凍結欄：窄螢幕水平捲動＋十字對準時，凍結格仍不透明、彼此之間沒有縫（捲過去的欄位不會透出來）。
//
// 讀 computed style 不讀截圖：宿主頁面的實色面積小（卡片、表格），掃圖容易被反鋸齒湊巧命中。
// 主題由 useEffect 非同步套上——驗到相符為止（bounded retry），不靠長等待。
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { hslToRgb8 } from "../packages/tokens/scripts/lib/color.mjs";
import { forcedColorsFocusFailures } from "./lib/forced-colors.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "apps/host-v4/dist");
const BASE = (process.env.HOST_BASE ?? "/").replace(/\/?$/, "/");
const tokens = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));
const THEMES = Object.keys(tokens.themes);
const DEFAULT_THEME = tokens.meta.defaultTheme;
const MODES = ["light", "dark"];
const THEME_KEY = "dooping-host-theme"; // 與 apps/host-v4/src/theme.tsx 同一個儲存鍵

/** 五種頁型的路徑（apps/host-v4/src/app.tsx 的路由表） */
const PAGES = [
  { path: "workbench", kind: "儀表板" },
  { path: "stock-check", kind: "清單頁" },
  { path: "master", kind: "明細頁" },
  { path: "settlement", kind: "表單頁" },
  { path: "settings", kind: "設定頁" },
];
const MIN_PAGES = 5;
const MIN_THEMES = 2;
const TOL = 2;
const RETRIES = 6;
const FORCED_COLORS_PAGES = ["stock-check", "settlement"];

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff": "font/woff", ".woff2": "font/woff2",
};

/** 主題有效值：themes 覆蓋鏈 → color 基準值（與 verify-visual.mjs 同款反解） */
const resolve = (theme, mode, name) => {
  const t = tokens.themes?.[theme]?.[mode]?.[name];
  return hslToRgb8((t ?? tokens.color[mode][name]).value);
};

function serve() {
  const server = createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!path.startsWith(BASE)) { res.writeHead(404); res.end(); return; }
    path = path.slice(BASE.length);
    let file = normalize(join(DIST, path || "index.html"));
    if (!file.startsWith(DIST)) { res.writeHead(403); res.end(); return; }
    // SPA 回退：沒有副檔名的路徑（/stock-check）交給 index.html，由 react-router 接手
    if (!existsSync(file) || statSync(file).isDirectory()) {
      if (extname(path)) { res.writeHead(404); res.end(); return; }
      file = join(DIST, "index.html");
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

async function launch() {
  try {
    return await chromium.launch({ headless: true });
  } catch (e) {
    if (existsSync("/opt/pw-browsers/chromium"))
      return chromium.launch({ headless: true, executablePath: "/opt/pw-browsers/chromium" });
    throw e;
  }
}

const parseAlpha = (s) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));
/**
 * computed color → { rgb, alpha }。實色是 rgb()／rgba()；color-mix 的 computed 值在 Chromium
 * 可能是 oklab()／color()——那種格式不比 rgb（rgb 為 null），alpha 從尾端的「/ x」抓。
 */
function parseColor(str) {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(str ?? "");
  if (m) return { rgb: [m[1], m[2], m[3]].map((v) => Math.round(Number(v))), alpha: m[4] === undefined ? 1 : parseAlpha(m[4]) };
  const tail = /\/\s*([\d.]+%?)\s*\)$/.exec(str ?? "");
  return { rgb: null, alpha: tail ? parseAlpha(tail[1]) : 1 };
}
const near = (a, b) => Array.isArray(a) && a.every((v, i) => Math.abs(v - b[i]) <= TOL);
const rgbStr = (c) => `rgb(${c.join(",")})`;

/** 開一個預先寫好主題的瀏覽器分頁（在 app 讀 localStorage 之前就寫入） */
async function openPage(browser, { theme, mode, contextOptions = {} }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...contextOptions });
  await context.addInitScript(
    ({ key, value }) => {
      try { localStorage.setItem(key, value); } catch { /* 封鎖儲存時用預設值 */ }
    },
    { key: THEME_KEY, value: JSON.stringify({ mode, color: theme, defaultColor: DEFAULT_THEME }) },
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror：${String(e.message).slice(0, 200)}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console error：${m.text().slice(0, 200)}`); });
  return { context, page, errors };
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("apps/host-v4/dist 不存在。先建置：npm run host:build");
    process.exit(1);
  }
  if (PAGES.length < MIN_PAGES || THEMES.length < MIN_THEMES) {
    console.error(`頁數 ${PAGES.length}／主題數 ${THEMES.length} 低於下限——守衛不能空轉。`);
    process.exit(1);
  }

  const axeSource = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = (path) => `${origin}${BASE}${path}`;
  const browser = await launch();
  const fails = [];
  let combos = 0;

  // ── 1＋2＋6：token 期望值（主題 × 模式 × 頁） ────────────────────
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const { context, page, errors } = await openPage(browser, { theme, mode });
      const want = { background: resolve(theme, mode, "background"), sidebar: resolve(theme, mode, "sidebar") };
      for (const p of PAGES) {
        combos++;
        const before = fails.length;
        errors.length = 0;
        await page.goto(url(p.path), { waitUntil: "load" });
        let got = {};
        for (let i = 0; i < RETRIES; i++) {
          await page.waitForTimeout(150 * (i + 1));
          got = await page.evaluate(() => {
            const aside = document.querySelector("aside");
            return {
              body: getComputedStyle(document.body).backgroundColor,
              sidebar: aside ? getComputedStyle(aside).backgroundColor : null,
              h1s: document.querySelectorAll("main h1").length,
            };
          });
          if (near(parseColor(got.body).rgb, want.background) && near(parseColor(got.sidebar).rgb, want.sidebar) && got.h1s === 1) break;
        }
        const tag = `[${theme}/${mode}] ${p.kind} /${p.path}`;
        if (!near(parseColor(got.body).rgb, want.background))
          fails.push(`${tag}  body 背景 ${got.body}，期望 --background ${rgbStr(want.background)}`);
        if (!got.sidebar) fails.push(`${tag}  找不到側欄 <aside>`);
        else if (!near(parseColor(got.sidebar).rgb, want.sidebar))
          fails.push(`${tag}  側欄 ${got.sidebar}，期望 --sidebar ${rgbStr(want.sidebar)}——v4 的 bg-sidebar 沒接到主題`);
        if (got.h1s !== 1) fails.push(`${tag}  main 裡有 ${got.h1s} 個 h1（一頁一個）`);
        if (p.path === "settings") {
          const probe = await page.evaluate(() => {
            const el = document.querySelector('[data-probe="color-mix"]');
            return el ? getComputedStyle(el).backgroundColor : null;
          });
          const alpha = probe ? parseColor(probe).alpha : NaN;
          if (!(Math.abs(alpha - 0.5) <= 0.02)) fails.push(`${tag}  color-mix 探針 ${probe}，期望 alpha≈0.5`);
        }
        for (const e of errors) fails.push(`${tag}  ${e}`);
        process.stdout.write(fails.length > before ? "x" : ".");
      }
      await context.close();
    }
  }
  process.stdout.write("\n");

  // ── 3＋4：頁面級 axe（預設主題淺色）與強制色彩焦點 ──────────────────
  {
    const { context, page } = await openPage(browser, { theme: DEFAULT_THEME, mode: "light" });
    for (const p of PAGES) {
      await page.goto(url(p.path), { waitUntil: "load" });
      await page.waitForSelector("main h1", { timeout: 10000 }).catch(() => fails.push(`[axe] /${p.path}  10s 內沒有 h1`));
      if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          rules: { "color-contrast": { enabled: false } },
          resultTypes: ["violations"],
        });
        return r.violations.map((v) => ({
          id: v.id, impact: v.impact, help: v.help,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        }));
      });
      for (const v of violations)
        fails.push(`[axe] ${p.kind} /${p.path}  ${v.id}（${v.impact}）${v.help} → ${v.targets.join("；")}`);

      if (FORCED_COLORS_PAGES.includes(p.path)) {
        const { visited, fails: focusFails } = await forcedColorsFocusFailures(page, 12);
        if (visited === 0) fails.push(`[強制色彩] /${p.path}  Tab 沒有走到任何可聚焦元素——檢查空轉`);
        for (const m of focusFails) fails.push(`[強制色彩] /${p.path}  焦點看不見：${m}`);
      }
    }
    await context.close();
  }

  // ── 5：行動版外殼（ADR-0011：窄螢幕側欄轉抽屜、焦點歸還） ────────────
  {
    const { context, page, errors } = await openPage(browser, {
      theme: DEFAULT_THEME,
      mode: "light",
      contextOptions: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    });
    await page.goto(url("stock-check"), { waitUntil: "load" });
    await page.waitForSelector("main h1", { timeout: 10000 }).catch(() => fails.push("[行動版] 10s 內沒有 h1"));
    if (await page.evaluate(() => !!document.querySelector("aside")))
      fails.push("[行動版] 窄螢幕仍渲染桌面側欄 <aside>——應轉成抽屜");
    const trigger = page.getByRole("button", { name: /切換側邊欄/ });
    const drawerNav = () => page.getByRole("dialog").getByRole("navigation", { name: "主導覽" });
    try {
      // 觸控：點得開、Esc 關得掉。觸控點擊不保證讓按鈕取得焦點，所以這條路不驗焦點歸還。
      await trigger.tap();
      await drawerNav().waitFor({ timeout: 5000 });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5000 });

      // 鍵盤：焦點歸還是鍵盤使用者的契約——Enter 開、Esc 關，焦點要回到開關上。
      await trigger.focus();
      await page.keyboard.press("Enter");
      await drawerNav().waitFor({ timeout: 5000 });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "detached", timeout: 5000 });
      if (!(await trigger.evaluate((el) => el === document.activeElement))) {
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `<${el.tagName.toLowerCase()}>${(el.getAttribute("aria-label") ?? "").slice(0, 30)}` : "（無）";
        });
        fails.push(`[行動版] 鍵盤開啟、Esc 關閉後焦點沒有回到開關（落在 ${focused}）`);
      }
    } catch (e) {
      fails.push(`[行動版] 抽屜開關流程失敗：${String(e.message).split("\n")[0]}`);
    }
    for (const e of errors) fails.push(`[行動版]  ${e}`);
    await context.close();
  }

  // ── 7：凍結欄在水平捲動＋十字對準下不透明、彼此無縫 ────────────────
  // 2026-09 手機實測（預覽站清單頁）：窄螢幕水平捲動時捲過去的欄位從凍結欄透出來，兩個原因——
  //   (a) 十字對準的 bg-gradient-to-r 經 cn() 合併掉凍結格的 bg-background（tailwind-merge v3 把它當底色）；
  //   (b) 勾選欄被表格自動版面壓到 32px，凍結首欄卻 sticky 在 left: 2.5rem，中間多出 8px 縫。
  // Storybook 與桌面寬度都看不到：表格不需要捲，凍結格底下沒有東西可以透。
  {
    const { context, page, errors } = await openPage(browser, {
      theme: DEFAULT_THEME,
      mode: "light",
      contextOptions: { viewport: { width: 390, height: 844 } },
    });
    try {
      await page.goto(url("stock-check"), { waitUntil: "load" });
      await page.waitForSelector("main tbody tr td", { timeout: 10000 });
      const scrolled = await page.evaluate(() => {
        const table = document.querySelector("main table");
        let sc = table ? table.parentElement : null;
        while (sc && sc !== document.body && sc.scrollWidth <= sc.clientWidth) sc = sc.parentElement;
        if (!sc || sc === document.body) return 0;
        sc.scrollLeft = 150;
        return sc.scrollLeft;
      });
      if (scrolled <= 0) fails.push("[凍結欄] 390px 寬的清單表格沒有水平捲動——情境不成立（檢查空轉）");

      // 指向一個沒被凍結欄蓋住的一般儲存格，觸發十字對準（同一列的凍結格會套上漸層）
      const rowIndex = 2;
      const target = await page.evaluate((ri) => {
        const tr = document.querySelectorAll("main tbody tr")[ri];
        const tds = tr ? [...tr.children] : [];
        return tds.findIndex((td) => {
          if (getComputedStyle(td).position === "sticky") return false;
          const r = td.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return r.width > 0 && hit !== null && td.contains(hit);
        });
      }, rowIndex);
      if (target < 0) throw new Error("找不到沒被蓋住的一般儲存格可以指向");
      await page.locator("main tbody tr").nth(rowIndex).locator("td").nth(target).hover();

      const stickyCells = (selector) =>
        page.evaluate((sel) => {
          const tr = document.querySelector(sel);
          return (tr ? [...tr.children] : [])
            .filter((cell) => getComputedStyle(cell).position === "sticky")
            .map((cell) => {
              const cs = getComputedStyle(cell);
              const r = cell.getBoundingClientRect();
              return { bg: cs.backgroundColor, gradient: cs.backgroundImage.includes("gradient"), left: r.left, right: r.right };
            });
        }, selector);

      let body = [];
      for (let i = 0; i < RETRIES; i++) {
        await page.waitForTimeout(100 * (i + 1));
        body = await stickyCells(`main tbody tr:nth-child(${rowIndex + 1})`);
        if (body.some((c) => c.gradient)) break;
      }
      const head = await stickyCells("main thead tr");
      if (body.length < 2) fails.push(`[凍結欄] 資料列只有 ${body.length} 個凍結格（期望勾選欄＋凍結首欄）——檢查空轉`);
      if (!body.some((c) => c.gradient)) fails.push("[凍結欄] 十字對準沒有套到凍結格——情境不成立（檢查空轉）");
      for (const [where, cells] of [["資料列", body], ["表頭", head]]) {
        cells.forEach((c, k) => {
          if (parseColor(c.bg).alpha < 1)
            fails.push(`[凍結欄] ${where}第 ${k + 1} 個凍結格背景是 ${c.bg}——不透明底被合併掉，捲過去的欄位會透出來`);
          if (k > 0) {
            const gap = Math.round((c.left - cells[k - 1].right) * 10) / 10;
            if (gap > 0.5) fails.push(`[凍結欄] ${where}第 ${k} 與第 ${k + 1} 個凍結格之間有 ${gap}px 縫——捲過去的欄位會從縫裡透出來`);
          }
        });
      }
    } catch (e) {
      fails.push(`[凍結欄] 情境執行失敗：${String(e.message).split("\n")[0]}`);
    }
    for (const e of errors) fails.push(`[凍結欄]  ${e}`);
    await context.close();
  }

  await browser.close();
  server.close();

  console.log(
    `token 期望值 ${combos} 組（${THEMES.length} 主題 × ${MODES.length} 模式 × ${PAGES.length} 頁）；` +
      `頁面級 axe ${PAGES.length} 頁；強制色彩焦點 ${FORCED_COLORS_PAGES.length} 頁；行動版外殼 1 個情境；凍結欄 1 個情境`,
  );
  if (fails.length) {
    console.error(`\n✗ 內部試裝宿主渲染守衛不通過（${fails.length} 條）：\n` + fails.map((f) => "  " + f).join("\n"));
    process.exit(1);
  }
  console.log("✓ 內部試裝宿主渲染守衛通過：主題套上、透明度可用、頁面結構無障礙、強制色彩、行動版外殼與凍結欄行為正確。");
}

main().catch((e) => { console.error(e); process.exit(1); });
