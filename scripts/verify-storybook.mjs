// 無障礙行為守衛 —— Storybook 全量 story 的 axe 掃描＋play function 執行驗收。
//
//   node scripts/verify-storybook.mjs      # 對 storybook-static 逐 story 驗，不合格 exit 1
//
// 前提：storybook-static 已建置（npm run build-storybook）。
//
// 為什麼要有這支：規範寫了焦點陷阱、鍵盤操作、aria 連動，但行為層此前沒有任何守衛——
// play function 只在瀏覽器手動打開 story 時執行，CI 從來沒跑過它們。這支補兩件事：
//   1. 每支 story 載入後跑 axe-core（停用 color-contrast——顏色的唯一權威是 verify:color，
//      兩套權威會打架；停用 region 等頁面級規則——story 是片段，不是完整頁面）。
//   2. play function 是 Storybook 渲染 story 時**自動執行**的；這裡監聽 preview channel 的
//      失敗事件（playFunctionThrewException 等），任何一支 play 掛掉就紅。
//
// 防空轉雙底線：story 總數下限（守衛不能因掃描壞掉而安靜變綠）；
// 至少一支 play function 被觀測到進入 playing 階段（拿現有的哨兵 story 驗「play 真的有跑」）。
import { readFileSync, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// CI 的建置輸出在 book/build/storybook（-o 指定）；本機預設 storybook-static
const STATIC = join(ROOT, process.env.STORYBOOK_DIR ?? "storybook-static");

// story 總數下限：目前 60 支。掉到 40 以下代表 index.json 讀取或建置壞了，要出聲。
const MIN_STORIES = 40;

// 停用規則與理由（新增前先想清楚屬於哪一類，不要順手關）：
//   color-contrast    顏色歸 verify:color 管（token 反解＋門檻優先序都在那邊）
//   region            story 是片段，內容本來就不在 landmark 裡
//   landmark-one-main / page-has-heading-one / bypass   同上，頁面級結構規則
const DISABLED_RULES = ["color-contrast", "region", "landmark-one-main", "page-has-heading-one", "bypass"];

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".txt": "text/plain",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
};

function serve() {
  const server = createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    if (path === "") path = "index.html";
    let file = normalize(join(STATIC, path));
    if (!file.startsWith(STATIC)) { res.writeHead(403); res.end(); return; }
    if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
    if (statSync(file).isDirectory()) file = join(file, "index.html");
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

// preview channel 可能在我們掛監聽之前就發事件——用 property setter 攔截 channel 的
// **指派瞬間**掛上監聽，不能等 page load 後再找 channel（會漏掉先發的事件）。
const CHANNEL_TAP = `
  window.__SB_EVENTS__ = [];
  (() => {
    let ch;
    const record = (ev) => (payload) => {
      const msg = payload?.message ?? payload?.error?.message ?? payload?.title ?? "";
      window.__SB_EVENTS__.push({ ev, msg: String(msg).slice(0, 300) });
    };
    Object.defineProperty(window, "__STORYBOOK_ADDONS_CHANNEL__", {
      configurable: true,
      get: () => ch,
      set: (v) => {
        ch = v;
        for (const ev of ["storyRendered", "storyErrored", "storyThrewException",
                          "playFunctionThrewException", "storyMissing"]) ch.on(ev, record(ev));
        ch.on("storyRenderPhaseChanged", (p) => {
          if (p?.newPhase === "playing") window.__SB_EVENTS__.push({ ev: "playing", msg: p.storyId ?? "" });
        });
      },
    });
  })();
`;

async function main() {
  const indexFile = join(STATIC, "index.json");
  if (!existsSync(indexFile)) {
    console.error("storybook-static/index.json 不存在。先建置：npm run build-storybook");
    process.exit(1);
  }
  const stories = Object.values(JSON.parse(readFileSync(indexFile, "utf8")).entries)
    .filter((e) => e.type === "story");
  if (stories.length < MIN_STORIES) {
    console.error(`只列出 ${stories.length} 支 story（下限 ${MIN_STORIES}）——index.json 讀取或建置壞了，守衛不能空轉。`);
    process.exit(1);
  }

  const axeSource = readFileSync(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await launch();
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 } });
  const page = await context.newPage();
  await page.addInitScript(CHANNEL_TAP);
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e.message).slice(0, 300)));

  const fails = [];
  let playObserved = 0;

  for (const story of stories) {
    pageErrors.length = 0;
    await page.goto(`${origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, {
      waitUntil: "load",
    });
    // 等到 storyRendered（play 完成後才發）或任一失敗事件——不用固定長等待
    let events = [];
    try {
      await page.waitForFunction(
        () => window.__SB_EVENTS__.some((e) => e.ev !== "playing"),
        undefined,
        { timeout: 20000 },
      );
      events = await page.evaluate(() => window.__SB_EVENTS__);
    } catch {
      fails.push(`${story.id}  渲染逾時（20s 內沒有 storyRendered 或錯誤事件）`);
      process.stdout.write("x");
      continue;
    }
    if (events.some((e) => e.ev === "playing")) playObserved++;
    const bad = events.filter((e) => ["storyErrored", "storyThrewException", "playFunctionThrewException", "storyMissing"].includes(e.ev));
    for (const b of bad) fails.push(`${story.id}  ${b.ev}: ${b.msg}`);
    for (const m of pageErrors) fails.push(`${story.id}  pageerror: ${m}`);
    if (bad.length) { process.stdout.write("x"); continue; }

    // addon-a11y 已把 axe 打包進 preview 並可能正在跑（axe 是全域單例）——
    // 頁內有 window.axe 就直接用，撞到「already running」就等它跑完重試。
    if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async (disabled) => {
      const rules = Object.fromEntries(disabled.map((r) => [r, { enabled: false }]));
      for (let i = 0; ; i++) {
        try {
          const r = await window.axe.run(document.body, { rules, resultTypes: ["violations"] });
          return r.violations.map((v) => ({
            id: v.id, impact: v.impact, help: v.help,
            targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
          }));
        } catch (e) {
          if (i >= 20 || !String(e.message).includes("already running")) throw e;
          await new Promise((ok) => setTimeout(ok, 250));
        }
      }
    }, DISABLED_RULES);
    for (const v of violations)
      fails.push(`${story.id}  axe:${v.id}（${v.impact}）${v.help} → ${v.targets.join("；")}`);
    process.stdout.write(violations.length ? "x" : ".");
  }
  process.stdout.write("\n");

  await browser.close();
  server.close();

  // 防空轉：play function 是這支守衛的存在理由之一，一支都沒觀測到＝驗收機制壞了
  if (playObserved === 0)
    fails.push("沒有觀測到任何 play function 進入 playing 階段——play 驗收空轉了（哨兵：loading-error 的欄位錯誤態）");

  console.log(`掃描 ${stories.length} 支 story（axe ＋ play 執行驗收，觀測到 ${playObserved} 支 play）`);
  if (fails.length) {
    console.error(`\n✗ 無障礙行為守衛不通過（${fails.length} 條）：\n` + fails.map((f) => "  " + f).join("\n"));
    console.error("\n規則分工：顏色歸 verify:color，行為與結構歸這支。停用規則清單見檔頭。");
    process.exit(1);
  }
  console.log("✓ 無障礙行為守衛通過：axe 無違規、play functions 全數執行成功。");
}

main().catch((e) => { console.error(e); process.exit(1); });
