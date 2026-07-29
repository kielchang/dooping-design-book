// 色彩驗收 —— 六組色相主題 × 淺深兩模式，所有門檻都在這裡擋。
//
//   node scripts/verify-color.mjs        # 印報告，不合格時 exit 1
//
// 同一組檢查也被 tests/color.test.ts 呼叫，所以 `npm test` 一起擋。
//
// 為什麼要有這支：色彩的合規性會**安靜地**失效。改一個背景值、加一個主題、
// 調一階卡片底色——畫面不會壞、測試不會紅、型別不會錯，只有對比悄悄掉到門檻以下。
// 這正是這套 token 上一版踩過的坑：分類色票有兩色的對比餘裕只剩 +0.06 與 +0.16，
// 背景再亮一階就失效，而不會有任何東西告訴你。
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  contrast, hslToRgb8, hexToRgb8, rgb8ToOklch, minSeparation, deltaE00, lab,
} from "../packages/tokens/scripts/lib/color.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));

// ── 門檻（WCAG 2.2 嚴格值，不四捨五入） ──────────────────────
const TEXT = 4.5;          // 一般文字
const NONTEXT = 3.0;       // 色塊、邊框、聚焦環等非文字 UI 元件（1.4.11）
const CHART_FAIL = 10;     // 分類色兩兩感知距離：低於此在紅綠色盲下實務上分不開
const CHART_WARN = 15;     // 低於此算勉強，記為警告不擋
const DANGER_MIN = 18;     // 分類色與 danger 的距離：紅線會被讀成警告
const BRAND_STATUS_MIN = 12; // 主題色與狀態色的感知距離：主色像成功色會讓「綠色＝通過」失效
const BRAND_HUE_GAP = 25;  // 主題色與狀態色的**色相**距離：警報色域（0–95°）是保留區
const SUBTLE_MIN = 6;      // brand-subtle 與 muted 的距離：否則「被選中」看起來只是「有點灰」
const BRAND_DISABLED_MIN = 12; // brand 與停用外觀的距離：近中性的主題色會被讀成 disabled
const CHROMATIC_MIN = 0.04;    // 低於此視為無彩：色相角度在近中性色上沒有感知意義

const MODES = ["light", "dark"];
const STATUS = ["success", "warning", "danger", "info", "destructive", "edit"];

export function runChecks() {
  const fail = [];
  const warn = [];
  const stats = { themes: {}, chart: {} };

  const px = (mode, name) => hslToRgb8(tokens.color[mode][name].value);

  /**
   * 解出「在主題 X 之下，這個 token 實際是什麼顏色」。
   *
   * 中性色（背景、邊框、muted…）現在會被主題層覆蓋，所以拿 `tokens.color` 的基準值去驗
   * 是驗到後備值、不是驗到畫面上的顏色。這正是這支腳本存在的理由，自己更不能犯：
   * 生成器一度就是拿沒轉過色相的 muted 去報告 ring 的對比，數字才會看起來低於門檻。
   */
  const resolve = (themeName, mode, name) => {
    const t = tokens.themes?.[themeName]?.[mode]?.[name];
    return hslToRgb8((t ?? tokens.color[mode][name]).value);
  };
  const hardestOf = (themeName, mode) =>
    mode === "light" ? resolve(themeName, "light", "background") : resolve(themeName, "dark", "muted");
  const pageBgOf = (themeName, mode) => resolve(themeName, mode, "background");

  // 預設主題的表面——圖表與狀態色不隨主題變，用預設主題的表面驗即可
  const DEF = tokens.meta.defaultTheme;
  const pageBg = { light: pageBgOf(DEF, "light"), dark: pageBgOf(DEF, "dark") };

  // ── 1. 色相主題 ────────────────────────────────────────────
  for (const [name, theme] of Object.entries(tokens.themes ?? {})) {
    for (const mode of MODES) {
      const t = theme[mode];
      const at = (k) => hslToRgb8(t[k].value);
      const tag = `${name}/${mode}`;
      const brand = at("brand");
      const push = (ok, msg) => (ok ? null : fail.push(msg));

      const cBrand = contrast(brand, at("brand-foreground"));
      push(cBrand >= TEXT, `${tag} brand 上的文字只有 ${cBrand.toFixed(2)}:1（需 ${TEXT}）`);

      const cSubtle = contrast(at("brand-subtle"), at("brand-subtle-foreground"));
      push(cSubtle >= TEXT, `${tag} brand-subtle 上的文字只有 ${cSubtle.toFixed(2)}:1（需 ${TEXT}）`);

      const cRing = contrast(at("ring"), hardestOf(name, mode));
      push(cRing >= NONTEXT, `${tag} ring 對最亮表面只有 ${cRing.toFixed(2)}:1（需 ${NONTEXT}）`);

      // brand 色塊本身也要看得見，否則按鈕在頁面上「浮不出來」
      const cFill = contrast(brand, pageBgOf(name, mode));
      push(cFill >= NONTEXT, `${tag} brand 色塊對頁面底只有 ${cFill.toFixed(2)}:1（需 ${NONTEXT}）`);

      // brand-subtle 必須與 muted 分得開
      const dMuted = deltaE00(lab(at("brand-subtle")), lab(resolve(name, mode, "muted")));
      push(dMuted >= SUBTLE_MIN, `${tag} brand-subtle 與 muted 只差 ΔE00 ${dMuted.toFixed(1)}（需 ${SUBTLE_MIN}）`);

      // brand 與狀態色的感知距離。主色如果看起來像「成功」，使用者會停止把綠色讀成狀態。
      // 這條擋掉過一組候選：松綠 178° 距 success 162° 只有 16°，量出來 ΔE00 17.4——
      // 數字過得了門檻，但它確實是最像狀態色的一組，因此沒有收進預設清單。
      let nearest = { d: Infinity, s: "" };
      for (const s of STATUS) {
        const d = deltaE00(lab(brand), lab(px(mode, s)));
        if (d < nearest.d) nearest = { d, s };
      }
      push(nearest.d >= BRAND_STATUS_MIN,
        `${tag} brand 與 ${nearest.s} 只差 ΔE00 ${nearest.d.toFixed(1)}（需 ${BRAND_STATUS_MIN}）`);

      // ── 讓紅黃保持「一眼就反應」的兩條結構性規則 ──────────
      //
      // 紅色能讓人瞬間停手，靠的不只是色相，還有「它在畫面上很稀有、而且最搶眼」。
      // 主題色不需要閃避紅色的長相，需要閃避的是**它的位置與份量**。

      // 1. 色相層：警報色域是保留區。
      //    danger 18°／destructive 25°／warning 71°／edit 83° 把 0–95° 整段吃滿。
      //    主題落在那裡就算個別色票分得開（明度差會把 ΔE00 拉大），
      //    也等於把「瞬間反應」這個通道花在品牌上——畫面上到處是暖色，紅色就不再突出。
      //    **色相規則只在顏色真的有彩度時才成立。** 近中性色的色相角度數值上存在、
      //    感知上不存在——一顆近白的按鈕不可能「佔用警報色域」。石墨的 brand 鏡射
      //    primary 之後在深色是近白（chroma 0.0035），量出來距 info 只有 13°，
      //    但那是把一個無意義的角度拿去比。低於這個彩度就跳過色相檢查。
      const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
      const [, brandChroma, bh] = rgb8ToOklch(brand);
      if (brandChroma >= CHROMATIC_MIN) {
        let nearH = { g: 360, s: "" };
        for (const s of STATUS) {
          const g = hueGap(bh, rgb8ToOklch(px(mode, s))[2]);
          if (g < nearH.g) nearH = { g, s };
        }
        push(nearH.g >= BRAND_HUE_GAP,
          `${tag} brand 色相距 ${nearH.s} 只有 ${nearH.g.toFixed(0)}°（需 ${BRAND_HUE_GAP}°）` +
          `——主題不該住進警報色域`);
      }

      // 1b. brand 當實色填底時，不得被讀成**停用**。
      //
      // `Button` 的停用態是 `disabled:opacity-50`，所以使用者看到的「停用外觀」
      // 就是 primary 以 50% 疊在背景上。近中性的主題色做成填色按鈕會正好撞進那個位置——
      // 石墨先前照公式生成的 chroma 0.030 灰藍，距停用外觀只有 ΔE00 8.5／7.9，
      // 使用者實際看 Storybook 時第一眼就說它「像停用」。
      // 修法是讓無彩主題的 brand 直接鏡射 primary（近黑／近白），而不是硬擠出一個灰。
      const disabled = px(mode, "primary").map((v, i) =>
        Math.round(v * 0.5 + pageBgOf(name, mode)[i] * 0.5));
      const dDisabled = deltaE00(lab(brand), lab(disabled));
      push(dDisabled >= BRAND_DISABLED_MIN,
        `${tag} brand 與停用外觀只差 ΔE00 ${dDisabled.toFixed(1)}（需 ${BRAND_DISABLED_MIN}）` +
        `——填色按鈕會被讀成停用`);

      // 2. 飽和度層：警報必須是畫面上最飽和的東西。
      //    danger 的 chroma 若被主題超過，紅色就從「最搶眼」降級成「其中一個彩色」。
      const cBrandChroma = brandChroma;
      const cDanger = rgb8ToOklch(px(mode, "danger"))[1];
      push(cBrandChroma < cDanger,
        `${tag} brand 的 chroma ${cBrandChroma.toFixed(3)} 不低於 danger 的 ${cDanger.toFixed(3)}` +
        `——飽和度階序反過來，紅色會失去優先權`);

      // 中性色跟著主題轉色相之後，這些配對要逐主題重驗——L 與 chroma 沒動，
      // 但 WCAG 的相對亮度跟色相有關，轉一圈下來會有零點幾的位移。
      for (const [fg, bg] of [["muted-foreground", "muted"], ["muted-foreground", "background"]]) {
        const c = contrast(resolve(name, mode, fg), resolve(name, mode, bg));
        if (c < TEXT) warn.push(`${tag} ${fg} 在 ${bg} 上 ${c.toFixed(2)}:1（需 ${TEXT}）`);
      }
      // 刻意不驗 border 對背景。分隔線是裝飾性的細線，WCAG 1.4.11 不涵蓋；
      // 訂一個自己發明的門檻只會產生六組主題各一則的雜訊，而假警報會訓練人忽略真警報。

      stats.themes[tag] = {
        brandText: cBrand, subtleText: cSubtle, ring: cRing, fill: cFill,
        nearestStatus: nearest.s, nearestStatusD: nearest.d,
      };
    }
  }

  // ── 1b. 提醒視窗的低強度層 ─────────────────────────────────
  //
  // 這一層取代了原本的 `bg-{狀態}/10`。舊做法是把實色壓 10% 疊在表面上，
  // 對比完全不可控——實測四種變體在淺色模式的文字只有 1.97–3.98:1。
  const ALERT = ["info", "warning", "danger", "success"];
  for (const mode of MODES) {
    const tints = [];
    for (const s of ALERT) {
      const tint = px(mode, `${s}-subtle`);
      const ink = px(mode, `${s}-subtle-foreground`);
      tints.push(tint);
      const c = contrast(tint, ink);
      if (c < TEXT) fail.push(`${s}-subtle/${mode} 上的文字只有 ${c.toFixed(2)}:1（需 ${TEXT}）`);
      // 低強度用的左粗邊是實色狀態色，要在淡底上看得出來
      const cb = contrast(px(mode, s), tint);
      if (cb < NONTEXT) warn.push(`${s}/${mode} 左邊框對自己的淡底只有 ${cb.toFixed(2)}:1`);
    }
    // 四種淡底必須彼此分得開，否則「注意」和「錯誤」看起來是同一種。
    // 這條擋過事：淡底的 L 拉到 0.955 時 warning↔danger 只差 8.1–9.3——
    // 越接近純白，可用的 chroma 越少，四種 tint 就一起往白色收斂。
    for (let i = 0; i < ALERT.length; i++) {
      for (let j = i + 1; j < ALERT.length; j++) {
        const d = deltaE00(lab(tints[i]), lab(tints[j]));
        if (d < 10) fail.push(`${ALERT[i]}-subtle↔${ALERT[j]}-subtle/${mode} 只差 ΔE00 ${d.toFixed(1)}（需 10）`);
        else if (d < 13) warn.push(`${ALERT[i]}-subtle↔${ALERT[j]}-subtle/${mode} ΔE00 ${d.toFixed(1)}，勉強`);
      }
    }
  }

  // ── 2. 圖表分類色票 ────────────────────────────────────────
  const paletteOf = (mode) =>
    Array.from({ length: 8 }, (_, i) => hexToRgb8(tokens.chart[mode][`chart-${i + 1}`].value));

  for (const mode of MODES) {
    const p = paletteOf(mode);
    const bg = pageBg[mode];
    const danger = px(mode, "danger");

    p.forEach((c, i) => {
      const cc = contrast(c, bg);
      if (cc < NONTEXT) fail.push(`chart-${i + 1}/${mode} 對頁面底只有 ${cc.toFixed(2)}:1（需 ${NONTEXT}）`);
      const dd = deltaE00(lab(c), lab(danger));
      if (dd < DANGER_MIN) fail.push(`chart-${i + 1}/${mode} 與 danger 只差 ΔE00 ${dd.toFixed(1)}（需 ${DANGER_MIN}）`);
    });

    let worst = { d: Infinity, a: 0, b: 0 };
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const d = minSeparation(p[i], p[j]);
        if (d < worst.d) worst = { d, a: i + 1, b: j + 1 };
        if (d < CHART_FAIL) fail.push(`chart-${i + 1}↔chart-${j + 1}/${mode} 感知距離 ΔE00 ${d.toFixed(1)}（需 ${CHART_FAIL}）`);
        else if (d < CHART_WARN) warn.push(`chart-${i + 1}↔chart-${j + 1}/${mode} ΔE00 ${d.toFixed(1)}，勉強`);
      }
    }
    const Ls = p.map((c) => lab(c)[0]);
    stats.chart[mode] = {
      worst: worst.d, worstPair: `${worst.a}↔${worst.b}`,
      lightnessRange: Math.max(...Ls) - Math.min(...Ls),
      minContrast: Math.min(...p.map((c) => contrast(c, bg))),
    };
  }

  // 淺深不得共用色值——共用會把 L 鎖進 [0.49,0.67] 的窄帶，八色擠在中明度，
  // 二色覺下必然糊掉。上一版 8 色裡有 6 色共用，就是這麼壞的。
  const shared = paletteOf("light")
    .map((c, i) => [i, c.join(",")])
    .filter(([i, s]) => paletteOf("dark")[i].join(",") === s);
  if (shared.length) {
    fail.push(`圖表色票有 ${shared.length} 色淺深共用（chart-${shared.map(([i]) => i + 1).join(", chart-")}）——` +
      `共用會把明度鎖在窄帶，二色覺下分不開`);
  }

  // ── 3. 既有語意色的前景／背景配對 ──────────────────────────
  //
  // `X-foreground` 預設配 `X`，但有例外：`edit` 是**邊框**色，`edit-foreground` 實際上
  // 是配 `edit-bg`（見 Badge 的 `border-edit bg-edit-bg text-edit-foreground`）。
  // 照命名硬配會得到 1.24:1 這種假警報——而假警報會訓練人忽略真警報。
  const PAIR_OVERRIDE = { edit: "edit-bg" };
  for (const mode of MODES) {
    for (const [k, v] of Object.entries(tokens.color[mode])) {
      if (k.startsWith("$") || !k.endsWith("-foreground")) continue;
      const named = k.replace(/-foreground$/, "");
      const base = PAIR_OVERRIDE[named] ?? named;
      if (!tokens.color[mode][base]) continue;
      const c = contrast(hslToRgb8(v.value), hslToRgb8(tokens.color[mode][base].value));
      // 這些是元件實際在用的實色填底配對（Badge／Stepper／Button），不是「理論上可能」的組合，
      // 所以低於門檻算不合格而不是警告。
      const isFill = ["success", "warning", "info", "danger", "destructive", "primary", "edit"].includes(named);
      const msg = `${base}/${mode} 上的文字 ${c.toFixed(2)}:1（需 ${TEXT}）`;
      if (c < TEXT) (isFill ? fail : warn).push(msg);
    }
  }

  return { fail, warn, stats };
}

// ── CLI ────────────────────────────────────────────────────
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { fail, warn, stats } = runChecks();

  console.log("色相主題（brand 文字 4.5:1／ring 對最亮表面 3:1／brand 與最近狀態色 ΔE00 ≥12）");
  for (const [tag, s] of Object.entries(stats.themes)) {
    console.log(
      `  ${tag.padEnd(16)} brand字 ${s.brandText.toFixed(2)}  subtle字 ${s.subtleText.toFixed(2)}  ` +
      `ring ${s.ring.toFixed(2)}  色塊 ${s.fill.toFixed(2)}  最近狀態色 ${s.nearestStatus}=${s.nearestStatusD.toFixed(1)}`,
    );
  }
  console.log("\n圖表分類色票");
  for (const [mode, s] of Object.entries(stats.chart)) {
    console.log(
      `  ${mode.padEnd(6)} 最差對 ${s.worstPair} ΔE00 ${s.worst.toFixed(1)}　` +
      `L* 全距 ${s.lightnessRange.toFixed(1)}　最低對比 ${s.minContrast.toFixed(2)}:1`,
    );
  }

  if (warn.length) {
    console.log(`\n⚠ 警告 ${warn.length} 則（不擋）`);
    for (const w of warn) console.log(`  ${w}`);
  }
  if (fail.length) {
    console.log(`\n✗ 不合格 ${fail.length} 則`);
    for (const f of fail) console.log(`  ${f}`);
    process.exit(1);
  }
  console.log("\n✓ 全部通過");
}
