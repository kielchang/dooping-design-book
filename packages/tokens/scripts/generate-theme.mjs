// 主題色與圖表色票生成器 —— 寫回 src/tokens.json。
//
// 這支不是建置鏈的一環，是**改色票時才手動跑一次**的產生器：
//   node packages/tokens/scripts/generate-theme.mjs
//
// 為什麼不掛進 build：tokens.json 是這套系統的唯一來源（見檔頭 $comment），
// 每次建置都重寫它會讓「來源」變成產物，diff 也會一直有雜訊。
// 生成是一次性的，長期的保證交給 scripts/verify-color.mjs 在 CI 擋。
//
// ── 兩條原則 ────────────────────────────────────────────────
// 1. 對比是生成參數，不是事後檢查。每個值都是「給定目標比值，反解 OKLCH 的 L」，
//    而不是調完再量。換主題色重跑一次，合規性依然成立。
// 2. 一律 round 成 8-bit 再驗。浮點合格但取整後掉線只會在實機出現，不會有東西報錯。
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  contrast, hslToRgb8, rgb8ToHsl, rgb8ToHex, hexToRgb8, oklchToRgb8, rgb8ToOklch,
  maxChroma, solveLightness, minSeparation, deltaE00, lab,
} from "./lib/color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src/tokens.json");
const tokens = JSON.parse(readFileSync(SRC, "utf8"));

const WHITE = [255, 255, 255];
const px = (t) => hslToRgb8(tokens.color[t.mode][t.name].value);

// 每個模式裡「最亮的表面」——聚焦環要在最不利的表面上仍達 3:1，
// 只驗頁面底色會漏掉卡片與浮層。
const HARDEST_SURFACE = {
  light: px({ mode: "light", name: "background" }),   // 純白
  dark: px({ mode: "dark", name: "muted" }),          // 深色裡最亮的一層
};
const PAGE_BG = {
  light: px({ mode: "light", name: "background" }),
  dark: px({ mode: "dark", name: "background" }),
};

// ── 六組主題色 ─────────────────────────────────────────────
// hue 是 OKLCH 角度。狀態色佔用 danger 17.7°／destructive 25.3°／warning 70.6°／
// edit 83.9°／success 162.4°／info 238.1°，主題色相刻意與這些保持距離。
const THEMES = [
  { name: "graphite", label: "石墨", hue: 265, cap: 0.030 },
  { name: "indigo",   label: "靛藍", hue: 272, cap: 0.150 },
  { name: "violet",   label: "藍紫", hue: 292, cap: 0.150 },
  { name: "amethyst", label: "紫晶", hue: 305, cap: 0.150 },
  { name: "teal",     label: "青玉", hue: 195, cap: 0.130 },
  { name: "moss",     label: "苔綠", hue: 135, cap: 0.130 },
];
const DEFAULT_THEME = "graphite";

/** 深色模式的 chroma 折減：高飽和色在暗背景會產生光暈（halation），刺眼且降低可讀性。 */
const DARK_CHROMA_FACTOR = 0.75;

/** brand-subtle 與 muted 的最小感知距離——低於此，「被選中」看起來只是「有點灰」。 */
const SUBTLE_MIN = 8;

// 帶主題色相的中性色。
//
// 這些 token 的 chroma 只有 0.007–0.023——單看一格幾乎分不出來，但它們是畫面上
// 面積最大的那 60%。中性色固定在冷藍（248–267°）而主色是青玉或苔綠時，
// 介面會有一種說不上來的「兩套系統拼裝」感：主色是暖綠，它坐的表面卻是冷藍。
//
// 做法是**只轉色相，L 與 chroma 一律不動**。因此明暗層次、表面抬升階、
// 對比關係全部原封不動，只有色偏跟著主題走。這也是提醒視窗能自動繼承主題的前提：
// tint 疊在這些表面上，一度色相都不用彎。
const NEUTRAL_TINT = [
  "background", "card", "popover",          // 表面（淺色下是純白，chroma 0，轉了也不變）
  "muted", "secondary", "accent",           // 弱化與次要表面
  "border", "input", "field-border",        // 線
  "muted-foreground",                       // 次要文字
  "field-editable", "field-readonly",       // 欄位底
];

function tintNeutral(mode, hue) {
  const out = {};
  for (const name of NEUTRAL_TINT) {
    const base = tokens.color[mode][name];
    if (!base) continue;
    const [L, C] = rgb8ToOklch(hslToRgb8(base.value));
    const rgb = oklchToRgb8(L, Math.min(C, maxChroma(L, hue)), hue);
    out[name] = { value: rgb8ToHsl(rgb), desc: base.desc };
  }

  // muted-foreground 是次要文字，會落在 muted 這種弱化表面上。
  // 基準值對 muted 只有 4.34:1（本來就低於門檻），轉色相後最差掉到 4.25:1。
  // 既然這一格是生成的，就解對而不是留一條警告：對「這個主題的 muted」反解到 4.5:1。
  // 只往暗解，不動色相與 chroma——次要文字變太深會搶掉正文的層次。
  const mutedRgb = hslToRgb8(out.muted.value);
  const [, mfC] = rgb8ToOklch(hslToRgb8(tokens.color[mode]["muted-foreground"].value));
  const solved = mode === "light"
    ? solveLightness(hue, mfC, mutedRgb, 4.5, { from: 0.30, to: 0.62, prefer: "max" })
    : solveLightness(hue, mfC, mutedRgb, 4.5, { from: 0.60, to: 0.90, prefer: "min" });
  if (!solved) throw new Error(`${mode} muted-foreground 對 muted 無解（hue ${hue}）`);
  out["muted-foreground"] = {
    value: rgb8ToHsl(solved.rgb),
    desc: tokens.color[mode]["muted-foreground"].desc,
  };
  return out;
}

function buildTheme({ hue, cap }) {
  const out = { light: {}, dark: {} };

  for (const mode of ["light", "dark"]) {
    const c = mode === "dark" ? cap * DARK_CHROMA_FACTOR : cap;

    // 中性色先算——brand-subtle 要與「這個主題的 muted」拉開距離，
    // ring 要對「這個主題最亮的表面」達 3:1，兩者都得用轉過色相之後的值。
    const neutral = tintNeutral(mode, hue);
    const nx = (name) => hslToRgb8((neutral[name] ?? tokens.color[mode][name]).value);

    // brand：關鍵 CTA 的填色。解 L 使白字達 4.5:1，取最亮的合格解——
    // 最亮＝色彩最鮮明而不過於沉重，且仍留在文字對比門檻內。
    const brand = solveLightness(hue, c, WHITE, 4.5, { from: 0.30, to: 0.80, prefer: "max" });
    if (!brand) throw new Error(`${mode} brand 無解（hue ${hue}）`);

    // brand-subtle：選中的導覽項、分頁底線區的淡底。
    //
    // 這一格不能用固定的 L/C——muted 本身就是帶藍的淺灰（淺色 247.9°、深色 266.8°），
    // 藍紫系主題用固定值產出的淡底會與 muted 幾乎同色（實測石墨只差 ΔE00 3.2），
    // 於是「這一項被選中」看起來只是「這一項有點灰」。
    // 改成解出來：從最淡開始往下探，找第一個與 muted 拉開 SUBTLE_MIN 的值。
    const muted = nx("muted");
    const subtle = (() => {
      const from = mode === "light" ? 0.970 : 0.230;
      const dir = mode === "light" ? -1 : 1;      // 淺色往下探、深色往上探
      const capC = mode === "light" ? 0.075 : 0.060;
      for (let i = 0; i < 60; i++) {
        const L = from + dir * i * 0.004;
        const rgb = oklchToRgb8(L, Math.min(maxChroma(L, hue), capC), hue);
        if (deltaE00(lab(rgb), lab(muted)) >= SUBTLE_MIN) return rgb;
      }
      throw new Error(`${mode} brand-subtle 與 muted 拉不開（hue ${hue}）`);
    })();

    // subtle 上的文字：對該淡底達 4.5:1。淺色往暗解、深色往亮解。
    const onSubtle = mode === "light"
      ? solveLightness(hue, c, subtle, 4.5, { from: 0.20, to: 0.62, prefer: "max" })
      : solveLightness(hue, c, subtle, 4.5, { from: 0.60, to: 0.97, prefer: "min" });
    if (!onSubtle) throw new Error(`${mode} brand-subtle-foreground 無解（hue ${hue}）`);

    // ring：聚焦環是非文字 UI 元件，門檻 3:1（WCAG 1.4.11），
    // 且要對該模式**最亮的表面**成立，不是只對頁面底色。
    const surface = mode === "light" ? nx("background") : nx("muted");
    const ring = mode === "light"
      ? solveLightness(hue, c, surface, 3.0, { from: 0.35, to: 0.75, prefer: "max" })
      : solveLightness(hue, c, surface, 3.0, { from: 0.50, to: 0.92, prefer: "min" });
    if (!ring) throw new Error(`${mode} ring 無解（hue ${hue}）`);

    out[mode] = {
      ...neutral,
      brand: { value: rgb8ToHsl(brand.rgb), desc: "主題色：關鍵動作填色／品牌強調" },
      "brand-foreground": { value: "0 0% 100%", desc: "brand 上的文字" },
      "brand-subtle": { value: rgb8ToHsl(subtle), desc: "主題色淡底：選中的導覽項、分頁底線區" },
      "brand-subtle-foreground": { value: rgb8ToHsl(onSubtle.rgb), desc: "brand-subtle 上的文字" },
      ring: { value: rgb8ToHsl(ring.rgb), desc: "鍵盤聚焦環（吃主題色相）" },
    };
  }
  return out;
}

// ── 既有狀態色的對比修正 ───────────────────────────────────
//
// Badge 跑的是 `bg-success text-success-foreground`、Stepper 的完成態同樣是實色填底、
// Button 的 destructive 也是。實測白字在這些填色上最低只有 **1.99:1**（warning/dark），
// 是已釋出版本裡的 WCAG AA 違規——而且不會有任何東西報錯，畫面「看起來好好的」。
//
// 兩種修法依慣例分開用：
//   淺色調狀態（success / warning / info）→ 改用同色相深墨當前景，**填色一個位元都不動**。
//     這是業界標準做法：Radix 明列 amber/yellow/lime/mint/sky 五個色板配深色前景，
//     因為把琥珀壓到白字能過的程度，它就變成褐色、失去「琥珀」的識別，還會撞到 edit。
//   紅色系（destructive / danger）→ 保留白字，把填色壓深。
//     白字紅底是強到不該打破的慣例，紅色翻成深字反而讓人認不出這是破壞性動作。
//
// 只在低於門檻時才動，所以重跑不會越修越深（冪等）。
const STATUS_TEXT = 4.5;
const INK_STATUSES = ["success", "warning", "info"];
const FILL_STATUSES = ["destructive", "danger"];

function fixStatusContrast() {
  const log = [];
  for (const mode of ["light", "dark"]) {
    for (const name of INK_STATUSES) {
      const fill = px({ mode, name });
      const fgKey = `${name}-foreground`;
      if (contrast(fill, px({ mode, name: fgKey })) >= STATUS_TEXT) continue;
      const hue = rgb8ToOklch(fill)[2];
      const ink = solveLightness(hue, 0.09, fill, STATUS_TEXT, { from: 0.15, to: 0.55, prefer: "max" });
      if (!ink) throw new Error(`${mode} ${fgKey} 無解`);
      const before = contrast(fill, px({ mode, name: fgKey }));
      tokens.color[mode][fgKey].value = rgb8ToHsl(ink.rgb);
      log.push(`  ${fgKey}/${mode}  白字 ${before.toFixed(2)} → 同色相深墨 ${contrast(fill, ink.rgb).toFixed(2)}`);
    }
    for (const name of FILL_STATUSES) {
      const fill = px({ mode, name });
      // 對**實際的前景 token** 解，不是對理想的純白。`destructive-foreground` 是
      // `210 40% 98%`（微藍的白），拿純白去解會讓結果差 0.2 而剛好不過——
      // 這種「驗的顏色不是實際用的顏色」正是這支腳本要擋的東西，自己更不能犯。
      const fg = px({ mode, name: `${name}-foreground` });
      if (contrast(fill, fg) >= STATUS_TEXT) continue;
      const [, C, H] = rgb8ToOklch(fill);
      const fixed = solveLightness(H, C, fg, STATUS_TEXT, { from: 0.35, to: 0.70, prefer: "max" });
      if (!fixed) throw new Error(`${mode} ${name} 壓深後仍無解`);
      const before = contrast(fill, fg);
      tokens.color[mode][name].value = rgb8ToHsl(fixed.rgb);
      log.push(
        `  ${name}/${mode}     前景對比 ${before.toFixed(2)} → 填色壓深 ${contrast(fixed.rgb, fg).toFixed(2)}` +
        `（色偏 ΔE00 ${deltaE00(lab(fill), lab(fixed.rgb)).toFixed(1)}）`,
      );
    }
  }
  return log;
}

// 狀態色要先修好，圖表色票才有正確的 danger 可以拉開距離。
const statusLog = fixStatusContrast();

// ── 提醒視窗的低強度層 ─────────────────────────────────────
//
// Carbon 的雙強度模型：低強度＝淡底＋左邊框＋圖示＋同色系深字（日常提示，
// 大量出現不刺眼）；高強度＝實色滿版＋反白字（阻斷式，出現頻率低才不累積疲勞）。
// 高強度直接用上面修好的 `--{status}` + `--{status}-foreground`，這裡只生低強度那層。
//
// 為什麼不能沿用 `bg-danger/10`：那是把實色壓 10% 疊在表面上，**contrast 不可控**——
// 實測 Callout 現況的文字對比是 1.97–3.98:1，四種變體在淺色下全部不合格。
// 改成生成的實色 token，對比就能在生成時反解保證。
//
// 為什麼四種 tint 不做 harmonization（不往主題色相偏）：實測往主題拉 12°，
// 藍紫系主題的 warning↔danger 兩種 tint 會收斂到 ΔE00 8.8——琥珀和紅都被拉成粉橘，
// 「注意」和「錯誤」看起來變成同一種。提醒視窗的整體感要靠**四種共用同一條構成規則**
// 加上它們坐在帶主題色相的中性表面上，不靠彎色相。
const ALERT_STATUSES = ["info", "warning", "danger", "success"];
// L 不能再高：淡底越接近純白，可用的 chroma 越少，四種 tint 就往白色收斂。
// 實測 L=0.965 時 warning↔danger 只差 ΔE00 8.1、0.955 時 9.3，都低於 10——
// 「注意」和「錯誤」會看起來像同一種。0.935 拉到 13.8，仍然是明確的淡底。
const SUBTLE_L = { light: 0.935, dark: 0.270 };
const SUBTLE_C = { light: 0.060, dark: 0.065 };

function buildAlertSubtle() {
  const log = [];
  for (const mode of ["light", "dark"]) {
    for (const name of ALERT_STATUSES) {
      const hue = rgb8ToOklch(px({ mode, name }))[2];
      const L = SUBTLE_L[mode];
      const tint = oklchToRgb8(L, Math.min(maxChroma(L, hue), SUBTLE_C[mode]), hue);

      // 同色相的文字，對這個淡底反解到 4.5:1。淺色往暗解、深色往亮解。
      const ink = mode === "light"
        ? solveLightness(hue, 0.10, tint, STATUS_TEXT, { from: 0.15, to: 0.60, prefer: "max" })
        : solveLightness(hue, 0.10, tint, STATUS_TEXT, { from: 0.55, to: 0.97, prefer: "min" });
      if (!ink) throw new Error(`${mode} ${name}-subtle-foreground 無解`);

      tokens.color[mode][`${name}-subtle`] = {
        value: rgb8ToHsl(tint), desc: `${name} 低強度提示的底色（Carbon 雙強度的低強度層）`,
      };
      tokens.color[mode][`${name}-subtle-foreground`] = {
        value: rgb8ToHsl(ink.rgb), desc: `${name}-subtle 上的文字`,
      };
      log.push(`  ${name}-subtle/${mode}  ${rgb8ToHex(tint)} → 文字 ${rgb8ToHex(ink.rgb)} ${contrast(ink.rgb, tint).toFixed(2)}:1`);
    }
    // 四種 tint 必須彼此分得開，否則「注意」和「錯誤」看起來一樣
    const tints = ALERT_STATUSES.map((n) => px({ mode, name: `${n}-subtle` }));
    for (let i = 0; i < tints.length; i++) {
      for (let j = i + 1; j < tints.length; j++) {
        const d = deltaE00(lab(tints[i]), lab(tints[j]));
        if (d < 10) throw new Error(`${mode} ${ALERT_STATUSES[i]}↔${ALERT_STATUSES[j]} 的 tint 只差 ΔE00 ${d.toFixed(1)}`);
      }
    }
  }
  return log;
}
const alertLog = buildAlertSubtle();

// ── 圖表分類色票 ───────────────────────────────────────────
//
// 舊色票 8 色中有 6 色淺深共用同一 hex。那不是省事，是**結構性的錯**：
// 一個顏色要同時對白底與深底都達 3:1，L 只能落在 [0.49, 0.67]（寬度 0.17），
// 於是八色必然全部擠在中明度。二色覺者失去色相辨別、保留的正是明度——
// 把唯一還能用的維度放棄掉，色票在紅綠色盲下就會糊成一團。
//
// 因此淺深各生一組，各自吃滿自己的明度空間。
// 純粹的最大化最小距離會挑出數學上最優、視覺上很糟的組合——近黑的墨綠、
// 螢光青、外加四個都是綠的色相。所以在「安全」之上再加三條美感約束：
//   1. 明度不觸底也不觸頂：近黑與近白當色塊都不能看
//   2. chroma 有下限也有上限：太低發灰髒、太高螢光刺眼（深色模式尤其）
//   3. 色相間距下限：逼出一組看起來是「刻意選過」的色票，而不是同一家族的變體
// 加了約束之後最差對會下降，但那是可接受的交換——16 與 20 對使用者沒有差別，
// 「這組色票很醜」對使用者有差別。
const CHART_BAND = { light: [0.42, 0.66], dark: [0.56, 0.86] };
const CHART_CHROMA = {
  light: { min: 0.090, max: 0.155 },
  dark: { min: 0.085, max: 0.135 },
};
const HUE_SPACING = 30;          // 任兩色的 OKLCH 色相至少差這麼多度
const ANCHOR_HUE = 250;          // 第 1 色錨在藍——與既有色票起點一致，取用端既有圖表不會整個換臉

// 「圖表裡的紅線會被讀成警告」這件事，加碼防守是負收益——兩次都實測過：
//   guard 18 → 22           ：最差對 12.2 → 10.1
//   再排除 danger 色相 ±22° ：最差對 12.2 → 10.1（深色 11.1 → 9.6，且出現 1 對 <10）
// 兩次都是拿整組色票的品質去換一點點紅色距離。ΔE00 ≥18 已經是清楚不同的顏色，
// 而分類色票本來就需要一個紅系欄位（Okabe–Ito 自己就含 vermillion 與 reddish-purple）。
// 所以只留這一條，不加碼。
const DANGER_GUARD = 18;         // 分類色與 danger 的最小感知距離

const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

function buildChartPalette(mode, n = 8) {
  const bg = PAGE_BG[mode];
  const [lo, hi] = CHART_BAND[mode];
  const chroma = CHART_CHROMA[mode];
  const danger = hslToRgb8(tokens.color[mode].danger.value);

  // 候選池：固定網格，順序完全決定於迴圈——沒有亂數，重跑必得同一組色票。
  const pool = [];
  for (let i = 0; i <= 24; i++) {
    const L = lo + ((hi - lo) * i) / 24;
    for (let H = 0; H < 360; H += 2) {
      const C = Math.min(maxChroma(L, H), chroma.max);
      if (C < chroma.min) continue;
      const rgb = oklchToRgb8(L, C, H);
      if (contrast(rgb, bg) < 3.0) continue;
      if (deltaE00(lab(rgb), lab(danger)) < DANGER_GUARD) continue;
      pool.push({ rgb, L, H });
    }
  }

  // 最遠點插入：每次挑「與已選色距離最遠、且色相間距合格」的候選。
  // 副作用正是我們要的性質——插入順序即安全性順序，取用端拿 chart-1..chart-k
  // 得到的永遠是近似最佳的 k 色子集，色票隨系列數增加是**優雅劣化**，
  // 而不是在某個 k 忽然斷掉。
  let seed = pool[0];
  let seedBest = Infinity;
  for (const p of pool) {
    const d = hueGap(p.H, ANCHOR_HUE) + Math.abs(p.L - (lo + hi) / 2) * 100;
    if (d < seedBest) { seedBest = d; seed = p; }
  }

  const chosen = [seed];
  while (chosen.length < n) {
    let best = null;
    let bestScore = -1;
    for (const p of pool) {
      if (chosen.some((c) => hueGap(c.H, p.H) < HUE_SPACING)) continue;
      const score = Math.min(...chosen.map((c) => minSeparation(c.rgb, p.rgb)));
      if (score > bestScore) { bestScore = score; best = p; }
    }
    if (!best) throw new Error(`${mode} 色票只湊到 ${chosen.length} 色——色相間距或約束太嚴`);
    chosen.push(best);
  }
  return chosen.map((p) => p.rgb);
}

// ── 產生並寫回 ─────────────────────────────────────────────
const themes = {};
for (const t of THEMES) themes[t.name] = { $label: t.label, $hue: t.hue, ...buildTheme(t) };

const chart = { light: {}, dark: {} };
for (const mode of ["light", "dark"]) {
  const palette = buildChartPalette(mode);
  palette.forEach((rgb, i) => {
    chart[mode][`chart-${i + 1}`] = { value: rgb8ToHex(rgb) };
  });
  // 軸線／格線／文字沿用既有值——那三個是中性 chrome，不參與分類辨識
  for (const k of ["chart-axis", "chart-grid", "chart-text"]) {
    chart[mode][k] = tokens.chart[mode][k];
  }
}
chart.$comment =
  "分類色票（8 色）：淺／深各生一組獨立值，不共用。共用會把 L 鎖在 [0.49,0.67] 的窄帶，" +
  "八色擠在中明度，二色覺下必然糊成一團。順序即安全性順序——最遠點插入的副產物，" +
  "取用端拿 chart-1..chart-k 永遠是近似最佳的 k 色子集。狀態語意與分類色票脫鉤，" +
  "且分類色與 danger 的感知距離硬性 ≥18（紅線會被讀成警告）。";

tokens.chart = chart;
tokens.themes = themes;
tokens.meta.defaultTheme = DEFAULT_THEME;

writeFileSync(SRC, JSON.stringify(tokens, null, 2) + "\n", "utf8");

// ── 報告 ───────────────────────────────────────────────────
console.log(`[generate-theme] 已寫回 ${SRC}\n`);
if (alertLog.length) {
  console.log("提醒視窗低強度層（四種同一條規則生成，文字反解到 4.5:1）");
  for (const l of alertLog) console.log(l);
  console.log("");
}
if (statusLog.length) {
  console.log("既有狀態色的 WCAG AA 修正（已釋出的 Badge／Stepper／Button 有實際違規）");
  for (const l of statusLog) console.log(l);
  console.log("");
}
console.log("主題色（brand 白字 4.5:1／ring 對該模式最亮表面 3:1）");
for (const t of THEMES) {
  const th = themes[t.name];
  const b = { l: hslToRgb8(th.light.brand.value), d: hslToRgb8(th.dark.brand.value) };
  const r = { l: hslToRgb8(th.light.ring.value), d: hslToRgb8(th.dark.ring.value) };
  console.log(
    `  ${t.label} ${t.name.padEnd(9)} H=${String(t.hue).padStart(3)}  ` +
    `brand ${rgb8ToHex(b.l)}/${rgb8ToHex(b.d)} 白字 ${contrast(b.l, WHITE).toFixed(2)}/${contrast(b.d, WHITE).toFixed(2)}  ` +
    `ring ${rgb8ToHex(r.l)}/${rgb8ToHex(r.d)} ${contrast(r.l, HARDEST_SURFACE.light).toFixed(2)}/${contrast(r.d, HARDEST_SURFACE.dark).toFixed(2)}`,
  );
}
console.log("\n圖表色票");
for (const mode of ["light", "dark"]) {
  const p = Array.from({ length: 8 }, (_, i) => hexToRgb8(chart[mode][`chart-${i + 1}`].value));
  const Ls = p.map((c) => lab(c)[0]);
  let worst = Infinity;
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) worst = Math.min(worst, minSeparation(p[i], p[j]));
  const bad = (() => { let n = 0; for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) if (minSeparation(p[i], p[j]) < 10) n++; return n; })();
  console.log(`  ${mode}: ${p.map(rgb8ToHex).join(" ")}`);
  console.log(
    `     最差任意對 ΔE00 ${worst.toFixed(1)}　L* 全距 ${(Math.max(...Ls) - Math.min(...Ls)).toFixed(1)}` +
    `（${Math.min(...Ls).toFixed(0)}–${Math.max(...Ls).toFixed(0)}）　紅綠色盲 <10：${bad}/28`,
  );
  const cum = [];
  for (let k = 2; k <= 8; k++) {
    let w = Infinity;
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) w = Math.min(w, minSeparation(p[i], p[j]));
    cum.push(`k=${k}:${w.toFixed(0)}`);
  }
  console.log(`     用到第 k 色時的最差對：${cum.join("  ")}`);
}
