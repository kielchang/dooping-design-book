// 渲染守衛 —— 文件站 demo 宿主基座的驗收（ADR-0008）。
//
//   node scripts/verify-book-host.mjs      # 對 book/build 逐頁驗 computed style，不合格 exit 1
//
// 前提：book/build 已建置（本機 `BOOK_BASE_URL=/ npm run build:book`；CI 直接吃該輪建置產物）。
// 環境變數：
//   BOOK_BASE_URL   站台 base（預設從 build 產物自動偵測）
//   SCREENSHOT_DIR  有值時，另存 data-table 與 stepper 兩頁的全頁截圖（深淺各一），不影響判定
//
// 為什麼要有這支：文件站是把**真元件**渲染進 Docusaurus 頁面的宿主，但這裡的
// 其他守衛全是靜態的（token 數值、原始碼字串）——沒有任何一道看得見「畫出來的結果」。
// 實際踩過的坑：Infima 的裸元素規則把 demo 裡的表格畫成整片格線＋外框、
// 裸按鈕吃瀏覽器原生灰底凸框、元件自畫的邊框因缺 border-style 整批安靜消失。
// 三者都不會報錯、不會紅燈，只能在渲染層驗。
//
// 方法論承自治理章「截圖驗證一定要比對期望值」：
//   1) 全部用 DOM query 找目標，不用固定座標——版面一動座標就失效；
//   2) 期望值來自 tokens.json 經 resolve(defaultTheme) 的**有效值**，不是肉眼；
//   3) hydration 與深色切換是非同步的——驗到相符為止（bounded retry），不靠「等久一點」。
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { hslToRgb8 } from "../packages/tokens/scripts/lib/color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = join(ROOT, "book/build");
const tokens = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));
const DEF = tokens.meta.defaultTheme;

// 頁數下限：目前 31 頁含 demo。掉到 20 以下代表掃描壞了或文件被大改，守衛要出聲，不能安靜變空轉。
const MIN_PAGES = 20;
// 顏色容差 ±2/channel：alpha 合成會被瀏覽器抖動（治理章記載），逐位元比對會假性失敗。
const TOL = 2;
const ALPHA_TOL = 0.05;

/** 主題有效值：graphite 會覆蓋中性色，拿 color.* 基準值驗是驗到後備值（verify-color.mjs 同款）。 */
const resolve = (mode, name) => {
  const t = tokens.themes?.[DEF]?.[mode]?.[name];
  return hslToRgb8((t ?? tokens.color[mode][name]).value);
};

const parseColor = (str) => {
  const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(str ?? "");
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
};
const near = (str, rgb8, alpha = 1) => {
  const c = parseColor(str);
  if (!c) return false;
  return (
    Math.abs(c.r - rgb8[0]) <= TOL && Math.abs(c.g - rgb8[1]) <= TOL &&
    Math.abs(c.b - rgb8[2]) <= TOL && Math.abs(c.a - alpha) <= ALPHA_TOL
  );
};
const isTransparent = (str) => str === "transparent" || parseColor(str)?.a === 0;

// ── 找頁與起站 ────────────────────────────────────────────────
function findDemoPages() {
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      // 比對 class 屬性而不是裸字串——ADR 的內文也會提到 .demo-body，那種頁不是範例頁
      else if (name === "index.html" && readFileSync(p, "utf8").includes('class="demo-body"')) {
        pages.push(dirname(p).slice(BUILD.length).replaceAll("\\", "/") + "/");
      }
    }
  };
  walk(BUILD);
  return pages.sort();
}

function detectBase() {
  if (process.env.BOOK_BASE_URL) return process.env.BOOK_BASE_URL;
  const html = readFileSync(join(BUILD, "index.html"), "utf8");
  const m = /href="([^"]*?)assets\/css\/styles\.[^"]+?\.css"/.exec(html);
  if (!m) throw new Error("無法從 book/build/index.html 偵測 baseUrl，請設 BOOK_BASE_URL");
  return m[1];
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".txt": "text/plain",
  ".xml": "application/xml", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
};

function serve(base) {
  const server = createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!path.startsWith(base)) { res.writeHead(404); res.end(); return; }
    path = path.slice(base.length).replace(/^\/+/, "");
    if (path === "" || path.endsWith("/")) path += "index.html";
    let file = normalize(join(BUILD, path));
    if (!file.startsWith(BUILD)) { res.writeHead(403); res.end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// ── 頁內斷言（在瀏覽器裡執行；回傳失敗訊息陣列） ──────────────
// exp 帶進主題有效值的 rgb 與容差；比對函式要在頁內重建（無法傳 closure）。
function pageChecks(exp) {
  const fails = [];
  const near = (str, rgb, alpha = 1) => {
    const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(str ?? "");
    if (!m) return false;
    const a = m[4] === undefined ? 1 : +m[4];
    return Math.abs(+m[1] - rgb[0]) <= exp.tol && Math.abs(+m[2] - rgb[1]) <= exp.tol &&
      Math.abs(+m[3] - rgb[2]) <= exp.tol && Math.abs(a - alpha) <= exp.alphaTol;
  };
  const transparent = (str) =>
    str === "transparent" || /^rgba\([\d.]+,\s*[\d.]+,\s*[\d.]+,\s*0\)$/.test(str ?? "");
  const label = (el) => `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 60)}">`;

  // 1) demo 內的按鈕：不帶邊框寬度 class 的，四邊必須 0；任何按鈕都不得出現 UA 的
  //    outset 樣式或 ButtonFace 灰底（那是「宿主沒鋪基座」的直接指紋）。
  const hasWidthClass = (el) =>
    [...el.classList].some((c) => c === "border" || /^border-(\d+)$/.test(c) || /^border-[xytrbls](-\d+)?$/.test(c));
  const UA_GREYS = ["rgb(239, 239, 239)", "rgb(240, 240, 240)", "rgb(107, 107, 107)", "rgb(59, 59, 59)", "buttonface"];
  for (const b of document.querySelectorAll(".demo-body button")) {
    const s = getComputedStyle(b);
    if (!hasWidthClass(b)) {
      const w = [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth];
      if (w.some((v) => v !== "0px")) fails.push(`${label(b)} 邊框應為 0，實際 ${w.join("/")}`);
    }
    if (s.borderTopStyle === "outset" || s.borderTopStyle === "inset")
      fails.push(`${label(b)} 出現 UA ${s.borderTopStyle} 邊框樣式`);
    if (UA_GREYS.includes(s.backgroundColor))
      fails.push(`${label(b)} 出現 UA 按鈕灰底 ${s.backgroundColor}`);
  }

  // 2) demo 內的表格。兩層斷言：
  //    宿主污染指紋（所有表）——Infima 會把裸 <table> 打成 display:block；
  //    元件規範（僅 Table 元件，指紋是 caption-bottom class）——「只有列底線」：格線為 0、
  //    列底線 1px solid 且顏色等於 --border 的有效值、表頭與列的底色不得吃到宿主斑馬。
  //    圖表的文字等價表是**另一個物種**（外框、線畫在 th、熱圖用底色當格線間隙），
  //    不套 Table 的規範——它的慣例是否收斂，列在治理側的後續清單，不歸這支守衛。
  for (const t of document.querySelectorAll(".demo-body table")) {
    const ts = getComputedStyle(t);
    if (ts.display !== "table") fails.push(`table display=${ts.display}（宿主把它打成 block）`);
    if (!t.classList.contains("caption-bottom")) continue;
    if (ts.borderCollapse !== "collapse") fails.push(`table border-collapse=${ts.borderCollapse}`);
    for (const cell of t.querySelectorAll("td, th")) {
      const s = getComputedStyle(cell);
      const w = [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth];
      if (w.some((v) => v !== "0px")) {
        fails.push(`${label(cell)} 出現格線 ${w.join("/")}（規範是儲存格無邊框）`);
        break; // 一張表回報一次就夠
      }
    }
    for (const tr of t.querySelectorAll("tbody tr:not(:last-child)")) {
      const s = getComputedStyle(tr);
      if (s.borderBottomWidth !== "1px" || s.borderBottomStyle !== "solid")
        fails.push(`列底線應為 1px solid，實際 ${s.borderBottomWidth} ${s.borderBottomStyle}`);
      else if (!near(s.borderBottomColor, exp.border))
        fails.push(`列底線顏色 ${s.borderBottomColor} ≠ --border 有效值 rgb(${exp.border})`);
      break; // 驗一列即可，其餘同構
    }
    const thead = t.querySelector("thead");
    if (thead) {
      const bg = getComputedStyle(thead).backgroundColor;
      if (!transparent(bg) && !near(bg, exp.background))
        fails.push(`表頭底色 ${bg} 非 transparent／--background（宿主斑馬滲入）`);
    }
    for (const even of t.querySelectorAll("tbody tr:nth-child(even)")) {
      const bg = getComputedStyle(even).backgroundColor;
      if (!transparent(bg) && !near(bg, exp.muted, 0.3))
        fails.push(`偶數列底色 ${bg} 非 transparent／muted 30%（宿主斑馬滲入）`);
      break;
    }
  }

  // 3) stepper：步驟按鈕無框透明、圓圈 2px solid、todo 圈色 = muted-foreground 30%、
  //    <ol> 不吃宿主的清單縮排。
  for (const ol of document.querySelectorAll(".demo-body ol")) {
    const s = getComputedStyle(ol);
    if (s.paddingLeft !== "0px" || s.listStyleType !== "none")
      fails.push(`ol padding-left=${s.paddingLeft} list-style=${s.listStyleType}（宿主清單樣式滲入）`);
    const circles = [...ol.querySelectorAll("li > button > span:first-child")];
    for (const c of circles) {
      const cs = getComputedStyle(c);
      if (cs.borderTopWidth !== "2px" || cs.borderTopStyle !== "solid") {
        fails.push(`步驟圓圈應為 2px solid，實際 ${cs.borderTopWidth} ${cs.borderTopStyle}`);
        break;
      }
    }
    const todo = circles[circles.length - 1];
    if (todo && !near(getComputedStyle(todo).borderTopColor, exp.mutedForeground, 0.3))
      fails.push(`todo 圓圈邊框 ${getComputedStyle(todo).borderTopColor} ≠ muted-foreground 30%`);
  }
  return fails;
}

// 篩選面板（portal 到 body 直下，逃出 .demo-body 子樹——基座 scope B 的驗收點）
function portalChecks(exp) {
  const fails = [];
  const near = (str, rgb, alpha = 1) => {
    const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(str ?? "");
    if (!m) return false;
    const a = m[4] === undefined ? 1 : +m[4];
    return Math.abs(+m[1] - rgb[0]) <= exp.tol && Math.abs(+m[2] - rgb[1]) <= exp.tol &&
      Math.abs(+m[3] - rgb[2]) <= exp.tol && Math.abs(a - alpha) <= exp.alphaTol;
  };
  const panel = [...document.body.children].find((el) => el.classList?.contains("bg-popover"));
  if (!panel) return { fails: ["篩選面板未出現在 body 直下"], hasCheckbox: false };
  const s = getComputedStyle(panel);
  if (s.borderTopWidth !== "1px" || s.borderTopStyle !== "solid")
    fails.push(`面板邊框應為 1px solid，實際 ${s.borderTopWidth} ${s.borderTopStyle}`);
  else if (!near(s.borderTopColor, exp.border))
    fails.push(`面板邊框顏色 ${s.borderTopColor} ≠ --border 有效值`);
  if (!near(s.backgroundColor, exp.popover))
    fails.push(`面板底色 ${s.backgroundColor} ≠ --popover 有效值`);
  for (const b of panel.querySelectorAll("button")) {
    const bs = getComputedStyle(b);
    if (bs.borderTopStyle === "outset" || bs.backgroundColor === "rgb(239, 239, 239)") {
      fails.push("面板內按鈕吃到 UA 外觀（portal 逃出了基座 scope）");
      break;
    }
  }
  const boxes = panel.querySelectorAll('button[role="checkbox"] > span:first-child');
  for (const box of boxes) {
    const bs = getComputedStyle(box);
    if (bs.borderTopWidth !== "1px" || bs.borderTopStyle !== "solid") {
      fails.push(`面板勾選框應為 1px solid，實際 ${bs.borderTopWidth} ${bs.borderTopStyle}`);
      break;
    }
  }
  return { fails, hasCheckbox: boxes.length > 0 };
}

// ── 主流程 ────────────────────────────────────────────────────
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function checkPage(page, url, exp, { retries = 4 } = {}) {
  let fails = [];
  for (let i = 0; i < retries; i++) {
    if (i === 0) await page.goto(url, { waitUntil: "load" });
    await sleep(250 * (i + 1)); // hydration 是非同步的：驗到相符為止，不靠一次長等待
    fails = await page.evaluate(pageChecks, exp);
    if (fails.length === 0) return [];
  }
  return fails;
}

async function main() {
  if (!existsSync(join(BUILD, "index.html"))) {
    console.error("book/build 不存在。先建置：BOOK_BASE_URL=/ npm run build:book");
    process.exit(1);
  }
  const base = detectBase();
  const pages = findDemoPages();
  if (pages.length < MIN_PAGES) {
    console.error(`只掃到 ${pages.length} 頁含 demo（下限 ${MIN_PAGES}）——掃描或建置壞了，守衛不能空轉。`);
    process.exit(1);
  }

  const exp = (mode) => ({
    tol: TOL, alphaTol: ALPHA_TOL,
    border: resolve(mode, "border"),
    background: resolve(mode, "background"),
    popover: resolve(mode, "popover"),
    muted: resolve(mode, "muted"),
    mutedForeground: resolve(mode, "muted-foreground"),
  });

  const server = await serve(base);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const shotDir = process.env.SCREENSHOT_DIR;
  if (shotDir) mkdirSync(shotDir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    // 本機瀏覽器 revision 與 playwright 小版不合時，退回環境提供的固定執行檔
    if (existsSync("/opt/pw-browsers/chromium")) {
      browser = await chromium.launch({ headless: true, executablePath: "/opt/pw-browsers/chromium" });
    } else throw e;
  }

  const allFails = [];
  const record = (page, fails) => { for (const f of fails) allFails.push(`${page}  ${f}`); };

  // 淺色：全部 demo 頁
  const light = await browser.newContext({ colorScheme: "light" });
  const lp = await light.newPage();
  for (const p of pages) {
    record(`[light] ${p}`, await checkPage(lp, origin + base.replace(/\/$/, "") + p, exp("light")));
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  // 淺色：portal（篩選面板）——逐顆篩選鈕試到出現勾選框那一種為止
  {
    const url = origin + base.replace(/\/$/, "") + "/components/data-table/";
    await lp.goto(url, { waitUntil: "load" });
    await sleep(400);
    const n = await lp.locator(".demo-body thead button.tap-target").count();
    let panelSeen = false, checkboxSeen = false;
    const fails = [];
    for (let i = 0; i < n && !checkboxSeen; i++) {
      await lp.locator(".demo-body thead button.tap-target").nth(i).click();
      let r = { fails: ["篩選面板未出現在 body 直下"], hasCheckbox: false };
      for (let a = 0; a < 4; a++) {
        await sleep(150);
        r = await lp.evaluate(portalChecks, exp("light"));
        if (!r.fails.includes("篩選面板未出現在 body 直下")) break;
      }
      if (!r.fails.includes("篩選面板未出現在 body 直下")) {
        panelSeen = true;
        fails.push(...r.fails);
        if (r.hasCheckbox) checkboxSeen = true;
      }
      await lp.keyboard.press("Escape").catch(() => {});
      await lp.locator("body > div.fixed").first().click({ force: true }).catch(() => {});
      await sleep(100);
    }
    if (!panelSeen) fails.push("沒有任何篩選鈕能開出面板（互動壞了或選擇器失效）");
    else if (!checkboxSeen) fails.push("沒有找到含勾選框的篩選面板（勾選框斷言空轉）");
    record("[light] /components/data-table/ (portal)", [...new Set(fails)]);
  }

  if (shotDir) {
    for (const p of ["/components/data-table/", "/components/stepper/"]) {
      await lp.goto(origin + base.replace(/\/$/, "") + p, { waitUntil: "load" });
      await sleep(500);
      await lp.screenshot({ path: join(shotDir, `light${p.replaceAll("/", "-")}.png`), fullPage: true });
    }
  }
  await light.close();

  // 深色：驗切換後的邊框有效值（Docusaurus respectPrefersColorScheme + hydration 非同步，驗到就位為止）
  const dark = await browser.newContext({ colorScheme: "dark" });
  const dp = await dark.newPage();
  {
    const url = origin + base.replace(/\/$/, "") + "/components/table/";
    await dp.goto(url, { waitUntil: "load" });
    let ready = false;
    for (let i = 0; i < 20 && !ready; i++) {
      await sleep(200);
      ready = await dp.evaluate(() => document.documentElement.dataset.theme === "dark");
    }
    if (!ready) record("[dark] /components/table/", ["深色主題一直沒就位（data-theme ≠ dark）"]);
    else record("[dark] /components/table/", await dp.evaluate(pageChecks, exp("dark")));
    if (shotDir) {
      for (const p of ["/components/data-table/", "/components/stepper/"]) {
        await dp.goto(origin + base.replace(/\/$/, "") + p, { waitUntil: "load" });
        await sleep(600);
        await dp.screenshot({ path: join(shotDir, `dark${p.replaceAll("/", "-")}.png`), fullPage: true });
      }
    }
  }
  await dark.close();
  await browser.close();
  server.close();

  console.log(`\n掃描 ${pages.length} 頁（淺色全頁 + 深色抽驗 + portal 互動）`);
  if (allFails.length) {
    console.error(`\n✗ 渲染守衛不通過（${allFails.length} 條）：\n` + allFails.map((f) => "  " + f).join("\n"));
    console.error("\n宿主基座說明見 ADR-0008 與 book/src/css/demo-base.css。");
    process.exit(1);
  }
  console.log("✓ demo 宿主基座驗收通過：邊框、底色、表格與步驟的渲染結果符合 token 有效值。");
}

main().catch((e) => { console.error(e); process.exit(1); });
