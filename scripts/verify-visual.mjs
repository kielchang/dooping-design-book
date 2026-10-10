// 視覺回歸守衛 —— token 期望值掃描（全部主題 × 兩模式 × 哨兵 story）。
//
//   node scripts/verify-visual.mjs      # 對 storybook-static 截圖掃色，不合格 exit 1
//
// 前提：storybook-static 已建置（npm run build-storybook）。
//
// 路線決策：**不做**基準圖逐像素比對——跨平台字型渲染差異會假紅、每次有意變更都要
// 更新基準圖（維護成本高）。這裡把packages/react/README.md「截圖驗證一定要比對期望值」的方法論
// 做成 CI 閘門：每張截圖**掃全圖**驗兩件事——
//   1. 期望色存在：該主題該模式的有效值（tokens.json 反解，不是肉眼）必須出現在圖中
//   2. 禁用色不存在：其他主題的外殼色（--sidebar）不得出現——主題只換外殼，
//      外殼色就是「主題沒套上／套錯」的直接指紋（上次文件站配色不符就是這一類，靠肉眼才發現）
// 版面位移這類問題不歸這支管；有三次證據再議像素比對（與 shimmer 動畫同一類「先不做」）。
//
// 上述方法論的法典化：掃全圖不取樣固定座標；驗到相符為止（bounded retry）不靠長等待；
// 容差 ±2/channel 吸收瀏覽器的 alpha 合成抖動。另要求命中 ≥ MIN_PIXELS 像素，
// 而且只數**實色區塊**裡的像素（2×2 鄰格都同色才算）——文字反鋸齒的邊緣像素可能湊巧撞色：
// Windows 的彩色次像素反鋸齒在深色外殼上，淺色字的邊緣會帶出暗紅、暗藍的 1px 色邊，
// 一行群組標題就能湊出上百個「莓紅外殼色」的像素。主題套錯的指紋是一整塊外殼，不是字邊。
import { readFileSync, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { isInside, safeDecode } from "./lib/paths.mjs";
import { chromium } from "playwright";
import { hslToRgb8 } from "../packages/tokens/scripts/lib/color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// CI 的建置輸出在 book/build/storybook（-o 指定）；本機預設 storybook-static
const STATIC = join(ROOT, process.env.STORYBOOK_DIR ?? "storybook-static");
const tokens = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));
const THEMES = Object.keys(tokens.themes);
const MODES = ["light", "dark"];

const TOL = 2;          // ±2/channel：alpha 合成抖動（治理章記載）
const MIN_PIXELS = 50;  // 命中下限：排除反鋸齒邊緣的偶然撞色
const RETRIES = 5;      // 主題切換走 useEffect，非同步——驗到相符為止

/** 主題有效值：主題自己的宣告 → 預設主題（`:root`）→ color 基準值（與 scripts/lib/token-expect.mjs 同款反解） */
const DEF = tokens.meta.defaultTheme;
const resolve = (theme, mode, name) => {
  const t = tokens.themes?.[theme]?.[mode]?.[name] ?? tokens.themes?.[DEF]?.[mode]?.[name];
  return hslToRgb8((t ?? tokens.color[mode][name]).value);
};

// 哨兵 story：以 title+name 在 index.json 找 id（不自己推導 id 演算法）。
// 挑的是**實色面積大**的畫面——掃描驗的是填色，反鋸齒的文字不可靠。
//   按鈕：primary（主要動作）、brand（已淘汰，所有主題都等於 primary）、danger-subtle（警語框）
//   徽章：提醒色四家淡底＋實色兩排——這兩支在每個主題下都必須長得一樣（內容面中性）
const SENTINELS = [
  {
    title: "元件/基礎/按鈕・徽章・提示・卡片", name: "按鈕",
    expect: (theme, mode) => ({
      background: resolve(theme, mode, "background"),
      primary: resolve(theme, mode, "primary"),
      brand: resolve(theme, mode, "brand"),
      "danger-subtle": resolve(theme, mode, "danger-subtle"),
    }),
  },
  {
    title: "元件/基礎/按鈕・徽章・提示・卡片", name: "徽章",
    expect: (theme, mode) => ({
      background: resolve(theme, mode, "background"),
      "success-subtle": resolve(theme, mode, "success-subtle"),
      "warning-subtle": resolve(theme, mode, "warning-subtle"),
      "info-subtle": resolve(theme, mode, "info-subtle"),
      "danger-subtle": resolve(theme, mode, "danger-subtle"),
    }),
  },
  {
    // 外殼：sidebar 是全畫面最大的一塊實色，選中項的 sidebar-accent 是同色相亮一階——
    // 主題只換這一塊，兩者一起構成「主題沒套上」的最強指紋。
    title: "元件/外殼/應用外殼・側邊欄", name: "典型組成",
    expect: (theme, mode) => ({
      background: resolve(theme, mode, "background"),
      sidebar: resolve(theme, mode, "sidebar"),
      "sidebar-accent": resolve(theme, mode, "sidebar-accent"),
    }),
  },
];

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
};

function serve() {
  const server = createServer((req, res) => {
    const decoded = safeDecode(new URL(req.url, "http://x").pathname);
    if (decoded === null) { res.writeHead(400); res.end(); return; }
    let path = decoded.replace(/^\/+/, "");
    if (path === "") path = "index.html";
    let file = normalize(join(STATIC, path));
    if (!isInside(file, STATIC)) { res.writeHead(403); res.end(); return; }
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

/** 全圖掃描：把截圖畫進 canvas 逐像素數命中（在瀏覽器裡跑，零額外相依）。 */
async function scanScreenshot(page, png, targets) {
  return page.evaluate(async ({ b64, targets, tol }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const w = c.width;
    const h = c.height;
    const counts = targets.map(() => 0);
    const hit = (i, [r, g, b]) =>
      Math.abs(d[i] - r) <= tol && Math.abs(d[i + 1] - g) <= tol && Math.abs(d[i + 2] - b) <= tol;
    // 只數實色區塊：這一格、右邊、下面、右下都同色（2×2）。1px 寬的反鋸齒色邊不算。
    for (let y = 0; y < h - 1; y++) {
      for (let x = 0; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        for (let t = 0; t < targets.length; t++) {
          const tg = targets[t];
          if (hit(i, tg) && hit(i + 4, tg) && hit(i + w * 4, tg) && hit(i + w * 4 + 4, tg)) counts[t]++;
        }
      }
    }
    return counts;
  }, { b64: png.toString("base64"), targets, tol: TOL });
}

const rgbStr = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const nearColor = (a, b, tol) =>
  Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol;

async function main() {
  const indexFile = join(STATIC, "index.json");
  if (!existsSync(indexFile)) {
    console.error("storybook-static/index.json 不存在。先建置：npm run build-storybook");
    process.exit(1);
  }
  const entries = Object.values(JSON.parse(readFileSync(indexFile, "utf8")).entries);
  const stories = SENTINELS.map((s) => {
    const hit = entries.find((e) => e.title === s.title && e.name === s.name);
    if (!hit) {
      console.error(`哨兵 story 不存在：${s.title} / ${s.name}——改了 story 名要同步這裡，守衛不能空轉。`);
      process.exit(1);
    }
    return { ...s, id: hit.id };
  });

  const server = await serve();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });

  const fails = [];
  let combos = 0;
  for (const theme of THEMES) {
    for (const mode of MODES) {
      for (const s of stories) {
        combos++;
        const expected = s.expect(theme, mode);
        // 禁用色：其他主題的外殼色。與本組**任何**合法色撞色的先剔除——比對對象是
        // 全 token 色盤（含本主題的外殼鍵）而不是哨兵期望清單，文字的字芯像素會命中近黑近白。
        // 剩不到一個禁用色時要出聲——「不存在」斷言不能安靜空轉。
        const names = new Set([
          ...Object.keys(tokens.color[mode]),
          ...Object.keys(tokens.themes[DEF]?.[mode] ?? {}),
          ...Object.keys(tokens.themes[theme]?.[mode] ?? {}),
        ]);
        const legit = [...names]
          .filter((n) => !n.startsWith("$") && typeof (tokens.color[mode][n] ?? tokens.themes[DEF]?.[mode]?.[n] ?? tokens.themes[theme]?.[mode]?.[n])?.value === "string")
          .map((n) => resolve(theme, mode, n));
        const forbidden = THEMES.filter((t) => t !== theme)
          .map((t) => ({ from: t, rgb: resolve(t, mode, "sidebar") }))
          .filter((f) => !legit.some((l) => nearColor(f.rgb, l, TOL * 2 + 1)));
        if (forbidden.length === 0)
          fails.push(`[${theme}/${mode}] 禁用色全數與合法色撞色——主題間外殼色的區辨度掉了，檢查環境色票`);

        const url = `${origin}/iframe.html?id=${encodeURIComponent(s.id)}&viewMode=story` +
          `&globals=theme:${mode};colorTheme:${theme}`;
        let missing = [];
        let hitForbidden = [];
        for (let i = 0; i < RETRIES; i++) {
          if (i === 0) await page.goto(url, { waitUntil: "load" });
          await page.waitForTimeout(300 * (i + 1));
          const targets = [...Object.values(expected), ...forbidden.map((f) => f.rgb)];
          const counts = await scanScreenshot(page, await page.screenshot({ fullPage: true }), targets);
          const names = Object.keys(expected);
          missing = names.filter((_, idx) => counts[idx] < MIN_PIXELS);
          hitForbidden = forbidden.filter((_, idx) => counts[names.length + idx] >= MIN_PIXELS);
          if (missing.length === 0 && hitForbidden.length === 0) break;
        }
        for (const m of missing)
          fails.push(`[${theme}/${mode}] ${s.name}  缺少期望色 --${m} ${rgbStr(expected[m])}（≥${MIN_PIXELS}px 才算存在）`);
        for (const f of hitForbidden)
          fails.push(`[${theme}/${mode}] ${s.name}  出現 ${f.from} 的外殼色 --sidebar ${rgbStr(f.rgb)}——主題沒套上或套錯`);
        process.stdout.write(missing.length || hitForbidden.length ? "x" : ".");
      }
    }
  }
  process.stdout.write("\n");

  await browser.close();
  server.close();

  console.log(`掃描 ${combos} 個組合（${THEMES.length} 主題 × ${MODES.length} 模式 × ${stories.length} 哨兵）`);
  if (fails.length) {
    console.error(`\n✗ 視覺回歸不通過（${fails.length} 條）：\n` + fails.map((f) => "  " + f).join("\n"));
    console.error("\n期望值來自 tokens.json 反解；主題切換方法見 .storybook/preview.tsx。");
    process.exit(1);
  }
  console.log("✓ 視覺回歸通過：各主題×模式的期望色都在畫面上、其他主題的外殼色沒有滲入。");
}

main().catch((e) => { console.error(e); process.exit(1); });
