// 色彩驗收 —— 全部環境色主題 × 淺深兩模式，所有門檻都在這裡擋。
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
// 分類色與**狀態色**的距離。上一版只驗 danger，於是深色模式下 chart-5↔warning 只差
// ΔE00 7.3、chart-1↔info 7.9——都低於色票自己的「分不開」門檻 10，而守衛全綠。
// 雙條件（滿足其一即可）：色相拉得夠開，或者感知距離拉得夠開。
// 只驗 ΔE00 不夠：同色相但一深一淺的兩色 ΔE00 可以很大，讀者仍會覺得「這條線是紅色的＝有問題」。
const STATUS_HUE_GAP = 20;
const STATUS_DE_MIN = 18;
const SUBTLE_TINT_RATIO = 1.3; // 四種淡底的染色量比值上限：不等量會讓嚴重度階序失效
const SUBTLE_MIN = 6;      // brand-subtle 與 muted 的距離：否則「被選中」看起來只是「有點灰」
const CHROMATIC_MIN = 0.04;    // 低於此視為無彩：色相角度在近中性色上沒有感知意義
const SIDEBAR_ZONE_MIN = 2;    // 預設外殼與頁面底的距離：低於此「另一個區」不成立
const SIDEBAR_ZONE_MAX = 6;    // 上限（警告）：預設外殼是安靜區，不該比 muted 還響

// 環境色主題（主題只換外殼）的門檻。
//
// 以前的主題同時是品牌按鈕、選中淡底與中性色的色相來源，所以要守一整套「別像狀態色、
// 別住進警報色域、別像停用、飽和度要低於 danger」的規則。現在主題碰不到內容面，
// 那幾條改由「環境主題只能有外殼鍵」＋「brand 鏡射 primary」兩條結構性規則取代：
// 主題色根本不會出現在提醒、按鈕、欄位旁邊。
const SHELL_ACCENT_MIN = 8;   // 選中項與外殼：低於此「這一項被選中」在外殼上看不出來
const SHELL_FAMILY_MIN = 8;   // 同族兩階外殼：看得出是兩個環境，又像一家人
const SHELL_CROSS_MIN = 10;   // 不同族外殼：一眼分得開
const SHELL_FRAME_MIN = 10;   // 環境外殼與頁面底（深色模式最吃緊）：外框要成立
/** 環境主題可以宣告的鍵：只有外殼。 */
const SHELL_KEYS = new Set([
  "sidebar", "sidebar-foreground", "sidebar-muted-foreground", "sidebar-border",
  "sidebar-accent", "sidebar-accent-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-ring",
]);
/** brand 家族在所有主題都鏡射 primary。brand-subtle 是中性淡底，不在鏡射之列。 */
const BRAND_MIRROR = [["brand", "primary"], ["brand-foreground", "primary-foreground"]];

const MODES = ["light", "dark"];
const STATUS = ["success", "warning", "danger", "info", "destructive", "edit"];

export function runChecks() {
  const fail = [];
  const warn = [];
  const stats = { themes: {}, chart: {} };

  // 防空轉：主題或圖表色票讀不到時，下面的迴圈一次都不跑、fail 是空的、報告全綠。
  // 單獨跑這支也要擋（tests/color.test.ts 的主題數斷言只在 npm test 裡）。現值 18 主題、8 圖表色。
  const themeCount = Object.keys(tokens.themes ?? {}).length;
  const chartCount = Object.keys(tokens.chart?.light ?? {}).filter((k) => k.startsWith("chart-")).length;
  if (themeCount < 18) fail.push(`只讀到 ${themeCount} 組環境色主題（下限 18）——tokens.json 讀錯或結構變了，守衛不能空轉`);
  if (chartCount < 8) fail.push(`只讀到 ${chartCount} 個圖表色（下限 8）——tokens.json 讀錯或結構變了，守衛不能空轉`);

  const px = (mode, name) => hslToRgb8(tokens.color[mode][name].value);

  const DEF = tokens.meta.defaultTheme;

  /**
   * 解出「在主題 X 之下，這個 token 實際是什麼顏色」，照 CSS 的 cascade 走：
   * 主題自己的宣告 → 預設主題（`:root` 就是基準層＋預設主題）→ 基準層。
   *
   * 拿 `tokens.color` 的基準值去驗是驗到後備值、不是驗到畫面上的顏色。這正是這支腳本
   * 存在的理由，自己更不能犯：生成器一度就是拿沒轉過色相的 muted 去報告 ring 的對比。
   */
  const resolve = (themeName, mode, name) => {
    const v = tokens.themes?.[themeName]?.[mode]?.[name]
      ?? tokens.themes?.[DEF]?.[mode]?.[name]
      ?? tokens.color[mode][name];
    if (!v) throw new Error(`${themeName}/${mode} 解不出 ${name}`);
    return hslToRgb8(v.value);
  };
  const at = (group, name) => hslToRgb8(group[name].value);
  const hardestOf = (themeName, mode) =>
    mode === "light" ? resolve(themeName, "light", "background") : resolve(themeName, "dark", "muted");
  const pageBgOf = (themeName, mode) => resolve(themeName, mode, "background");
  /** src-over：不透明的疊加色以 alpha 疊在不透明底色上 */
  const mix = (paint, base, a) => paint.map((c, i) => Math.round(c * a + base[i] * (1 - a)));

  // 預設主題的表面——圖表與狀態色不隨主題變，用預設主題的表面驗即可
  const pageBg = { light: pageBgOf(DEF, "light"), dark: pageBgOf(DEF, "dark") };

  // ── 1. 環境色主題（只換外殼） ──────────────────────────────
  //
  // 主題只換側欄＋表頭的外殼底色，內容面一律中性。這一段擋四件事：
  //   a. 外殼看得清楚：文字、次要文字、選中項、聚焦環、標誌塊
  //   b. 主題碰不到內容面：環境主題只能有外殼鍵；brand 在所有主題都等於 primary
  //   c. 色票分得開：同族 ≥ SHELL_FAMILY_MIN、跨族 ≥ SHELL_CROSS_MIN、家族在色相上連續
  //   d. 外殼和內容面分得開：深色模式下外殼對頁面底 ≥ SHELL_FRAME_MIN
  for (const [name, theme] of Object.entries(tokens.themes ?? {})) {
    const isDefault = name === DEF;
    for (const mode of MODES) {
      const t = theme[mode];
      const tag = `${name}/${mode}`;
      const push = (ok, msg) => (ok ? null : fail.push(msg));
      const r = (k) => resolve(name, mode, k);

      // b. 內容中性：環境主題的鍵集只能是外殼鍵。內容面要是被主題覆蓋，
      //    提醒淡底就不再坐在同一個中性面上，「主題色碰不到辨識色」不成立。
      if (!isDefault) {
        const extra = Object.keys(t).filter((k) => !SHELL_KEYS.has(k));
        push(extra.length === 0,
          `${tag} 覆蓋了外殼以外的鍵（${extra.join("、")}）——主題只能換外殼，內容面必須中性`);
      }
      const brandOk = BRAND_MIRROR.every(([b, p]) => r(b).join() === r(p).join());
      push(brandOk, `${tag} brand 家族沒有鏡射 primary——品牌色不隨主題變，所有主題都等於 primary`);

      // a. 外殼可讀性
      const sb = r("sidebar");
      const sbFg = r("sidebar-foreground");
      const cSbText = contrast(sbFg, sb);
      push(cSbText >= TEXT, `${tag} 外殼上的文字只有 ${cSbText.toFixed(2)}:1（需 ${TEXT}）`);
      const cSbSecondary = contrast(r("sidebar-muted-foreground"), sb);
      push(cSbSecondary >= TEXT,
        `${tag} 外殼上的次要文字（sidebar-muted-foreground）只有 ${cSbSecondary.toFixed(2)}:1（需 ${TEXT}）`);
      const accent = r("sidebar-accent");
      const dAccent = deltaE00(lab(accent), lab(sb));
      push(dAccent >= SHELL_ACCENT_MIN,
        `${tag} 選中項（sidebar-accent）與外殼只差 ΔE00 ${dAccent.toFixed(1)}（需 ${SHELL_ACCENT_MIN}）——選中項浮不出來`);
      const cAccentText = contrast(r("sidebar-accent-foreground"), accent);
      push(cAccentText >= TEXT, `${tag} 選中項上的文字只有 ${cAccentText.toFixed(2)}:1（需 ${TEXT}）`);
      const ring = r("sidebar-ring");
      const cRingShell = contrast(ring, sb);
      const cRingAccent = contrast(ring, accent);
      push(cRingShell >= NONTEXT, `${tag} 外殼聚焦環對外殼只有 ${cRingShell.toFixed(2)}:1（需 ${NONTEXT}）`);
      push(cRingAccent >= NONTEXT, `${tag} 外殼聚焦環對選中項只有 ${cRingAccent.toFixed(2)}:1（需 ${NONTEXT}）`);
      const mark = r("sidebar-primary");
      const cMarkText = contrast(r("sidebar-primary-foreground"), mark);
      const cMarkShell = contrast(mark, sb);
      push(cMarkText >= TEXT, `${tag} 標誌塊上的字只有 ${cMarkText.toFixed(2)}:1（需 ${TEXT}）`);
      push(cMarkShell >= NONTEXT, `${tag} 標誌塊對外殼只有 ${cMarkShell.toFixed(2)}:1（需 ${NONTEXT}）`);

      // d. 外殼與內容面。預設外殼是「比頁面底沉一階的安靜區」，環境外殼是一眼可辨的框。
      const dFrame = deltaE00(lab(sb), lab(pageBgOf(name, mode)));
      if (isDefault) {
        push(dFrame >= SIDEBAR_ZONE_MIN,
          `${tag} 外殼與頁面底只差 ΔE00 ${dFrame.toFixed(1)}（需 ${SIDEBAR_ZONE_MIN}）——「另一個區」不成立`);
        if (dFrame > SIDEBAR_ZONE_MAX) warn.push(`${tag} 預設外殼與頁面底差到 ΔE00 ${dFrame.toFixed(1)}（上限 ${SIDEBAR_ZONE_MAX}）——外殼太響`);
      } else {
        push(dFrame >= SHELL_FRAME_MIN,
          `${tag} 環境外殼與頁面底只差 ΔE00 ${dFrame.toFixed(1)}（需 ${SHELL_FRAME_MIN}）——外框不成立`);
        // 飽和度階序：錯誤紅必須是畫面上最飽和的顏色。外殼是全畫面最大的色塊，
        // 它的彩度一旦追上 danger，紅色就從「最搶眼」降級成「其中一個彩色」。
        const cShell = rgb8ToOklch(sb)[1];
        const cDanger = rgb8ToOklch(px(mode, "danger"))[1];
        push(cShell < cDanger,
          `${tag} 外殼的 chroma ${cShell.toFixed(3)} 不低於 danger 的 ${cDanger.toFixed(3)}——飽和度階序反過來，紅色會失去優先權`);
      }

      // 別名恆等：生成器是唯一寫入者，手改會讓「應該永遠同色」的 token 安靜分家。
      const aliases = isDefault
        ? [["sidebar-primary", "brand"], ["sidebar-primary-foreground", "brand-foreground"],
           ["sidebar-accent", "brand-subtle"], ["sidebar-accent-foreground", "brand-subtle-foreground"],
           ["sidebar-border", "border"], ["sidebar-muted-foreground", "muted-foreground"]]
        : [["sidebar-accent-foreground", "sidebar-foreground"], ["sidebar-ring", "sidebar-foreground"],
           ["sidebar-primary", "sidebar-foreground"], ["sidebar-primary-foreground", "sidebar"]];
      for (const [alias, base] of aliases) {
        push(t[alias]?.value === t[base]?.value,
          `${tag} ${alias} 與 ${base} 的值分家了——這是別名，請重跑 generate-theme 而不是手改`);
      }

      // 預設主題才有的內容面檢查：brand-subtle（中性淡底）與 ring 對最亮表面。
      // 環境主題不覆蓋這些鍵，有效值與預設主題相同，驗一次就夠。
      let cSubtle = null;
      let cRing = null;
      if (isDefault) {
        cSubtle = contrast(at(t, "brand-subtle"), at(t, "brand-subtle-foreground"));
        push(cSubtle >= TEXT, `${tag} brand-subtle 上的文字只有 ${cSubtle.toFixed(2)}:1（需 ${TEXT}）`);
        const dMuted = deltaE00(lab(at(t, "brand-subtle")), lab(r("muted")));
        push(dMuted >= SUBTLE_MIN, `${tag} brand-subtle 與 muted 只差 ΔE00 ${dMuted.toFixed(1)}（需 ${SUBTLE_MIN}）`);
        cRing = contrast(r("ring"), hardestOf(name, mode));
        push(cRing >= NONTEXT, `${tag} ring 對最亮表面只有 ${cRing.toFixed(2)}:1（需 ${NONTEXT}）`);
        for (const [fg, bg] of [["muted-foreground", "muted"], ["muted-foreground", "background"]]) {
          const c = contrast(r(fg), r(bg));
          if (c < TEXT) warn.push(`${tag} ${fg} 在 ${bg} 上 ${c.toFixed(2)}:1（需 ${TEXT}）`);
        }
      }

      stats.themes[tag] = {
        shellText: cSbText, shellSecondary: cSbSecondary, accentDelta: dAccent, accentText: cAccentText,
        ring: cRingShell, frame: dFrame, subtleText: cSubtle, contentRing: cRing,
      };
    }
  }

  // c. 色票結構：同族兩階看得出是一家、跨族一眼分得開、家族在色相上連續。
  //    比的是外殼本身（淺深兩模式取最差），預設主題是淺色外殼、不參與。
  {
    const envs = Object.entries(tokens.themes ?? {}).filter(([n]) => n !== DEF);
    const shellOf = (n, mode) => resolve(n, mode, "sidebar");
    const dist = (a, b) => Math.min(...MODES.map((m) => deltaE00(lab(shellOf(a, m)), lab(shellOf(b, m)))));
    let within = { d: Infinity, p: "" };
    let cross = { d: Infinity, p: "" };
    for (let i = 0; i < envs.length; i++) {
      for (let j = i + 1; j < envs.length; j++) {
        const [a, ta] = envs[i];
        const [b, tb] = envs[j];
        const d = dist(a, b);
        const same = ta.$family === tb.$family;
        const min = same ? SHELL_FAMILY_MIN : SHELL_CROSS_MIN;
        if (d < min) {
          fail.push(`${a}↔${b} 外殼只差 ΔE00 ${d.toFixed(1)}（${same ? "同族" : "跨族"}需 ${min}）`);
        }
        if (same && d < within.d) within = { d, p: `${a}↔${b}` };
        if (!same && d < cross.d) cross = { d, p: `${a}↔${b}` };
      }
    }
    // 家族在色相上連續：任一族的色相範圍內，不得夾著別族的主題（近中性的 slate 不參與色相比較）。
    const hueOf = (n) => rgb8ToOklch(shellOf(n, "light"))[2];
    const chromaOf = (n) => rgb8ToOklch(shellOf(n, "light"))[1];
    const chromatic = envs.filter(([n]) => chromaOf(n) >= CHROMATIC_MIN);
    const families = new Map();
    for (const [n, t] of chromatic) families.set(t.$family, [...(families.get(t.$family) ?? []), hueOf(n)]);
    for (const [fam, hues] of families) {
      if (hues.length < 2) continue;
      // 族內色相的最小覆蓋弧（族內最大缺口的對面）
      const sorted = [...hues].sort((x, y) => x - y);
      let gapAt = 0;
      let gap = sorted[0] + 360 - sorted[sorted.length - 1];
      for (let k = 1; k < sorted.length; k++) {
        if (sorted[k] - sorted[k - 1] > gap) { gap = sorted[k] - sorted[k - 1]; gapAt = k; }
      }
      const start = sorted[gapAt];
      const span = 360 - gap;
      for (const [n, t] of chromatic) {
        if (t.$family === fam) continue;
        const off = (hueOf(n) - start + 360) % 360;
        if (off > 0.5 && off < span - 0.5) {
          fail.push(`${n}（${t.$family}）夾在 ${fam} 族的色相範圍裡——家族在色相上要連續`);
        }
      }
    }
    stats.palette = { within: within.d, withinPair: within.p, cross: cross.d, crossPair: cross.p, count: envs.length };
  }

  // ── 1a. 側邊欄基準層的別名恆等 ─────────────────────────────
  // 主題層的別名在上面逐主題驗過；基準層（color.*）的三個別名在這裡驗一次。
  // sidebar-ring ≡ ring：聚焦環中性、不進主題。
  for (const mode of MODES) {
    for (const [alias, base] of [
      ["sidebar-foreground", "foreground"],
      ["sidebar-muted-foreground", "muted-foreground"],
      ["sidebar-border", "border"],
      ["sidebar-ring", "ring"],
    ]) {
      const a = tokens.color[mode][alias]?.value;
      const b = tokens.color[mode][base]?.value;
      if (a === undefined) fail.push(`${mode} 缺 ${alias}——請重跑 generate-theme`);
      else if (a !== b) fail.push(`${mode} ${alias} 與 ${base} 的值分家了——sidebar-* 是別名，請重跑 generate-theme 而不是手改`);
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
      // 左粗邊現在用 `border-l-current`＝與文字同色，所以它的對比就是上面那個值。
      // 改版前用實色狀態色，實測 1.60–5.43:1，八組裡有四組低於 3:1 的非文字門檻。
      if (c < NONTEXT) fail.push(`${s}/${mode} 左粗邊（＝文字色）對淡底只有 ${c.toFixed(2)}:1`);
    }

    // 欄位錯誤態（aria-invalid）：danger **邊框**（欄位底不變）。
    // 這條門檻第一次跑就抓到過真實違規：先前的實作把錯誤欄整格染 danger-subtle，
    // 深色下邊框對那個底只有 2.42:1。修法不是放寬門檻也不是動全域淡底
    // （會破壞染色量等量），而是拿掉整格染紅——錯誤的主訊號是邊框＋文字＋圖示，
    // 整格淡底還會吃掉高飽和面積預算（十個錯誤欄＝十塊紅底）。
    // 邊框對「欄位可能坐的兩種底」都要 ≥3:1，只驗一邊會有一側隱形而守衛照樣綠。
    {
      const dBorder = px(mode, "danger");
      for (const [surfName, surf] of [
        ["background（一般欄位底）", px(mode, "background")],
        ["field-editable（可編輯欄位底）", px(mode, "field-editable")],
      ]) {
        const c = contrast(dBorder, surf);
        if (c < NONTEXT) fail.push(`欄位錯誤邊框 danger/${mode} 對 ${surfName} 只有 ${c.toFixed(2)}:1（需 ${NONTEXT}）`);
      }
    }
    // 四種淡底的「染色量」要相等——這一條擋的是嚴重度階序在淡底層失效。
    // 改版前是「固定 L ＋ 固定 chroma」，但 sRGB 色域不是色相對稱的，於是 info／danger
    // 被色域裁切、success 沒有：實測 ΔE00(subtle, card) 是 11.0/12.6/14.1/18.5，
    // 差 1.69 倍（深色 2.13 倍），而且**綠色比紅色搶眼**。
    const cardSurface = px(mode, "card");
    const amounts = tints.map((t) => deltaE00(lab(t), lab(cardSurface)));
    const ratio = Math.max(...amounts) / Math.min(...amounts);
    if (ratio > SUBTLE_TINT_RATIO) {
      fail.push(
        `${mode} 四種淡底的染色量差 ${ratio.toFixed(2)}×（上限 ${SUBTLE_TINT_RATIO}）：` +
        ALERT.map((s, i) => `${s} Δ${amounts[i].toFixed(1)}`).join("、"),
      );
    }
    stats.subtle ??= {};
    stats.subtle[mode] = { ratio, amounts };
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

    p.forEach((c, i) => {
      const cc = contrast(c, bg);
      if (cc < NONTEXT) fail.push(`chart-${i + 1}/${mode} 對頁面底只有 ${cc.toFixed(2)}:1（需 ${NONTEXT}）`);
      // 對六個狀態色全驗，不是只驗 danger
      const [, cChroma, cHue] = rgb8ToOklch(c);
      for (const s of STATUS) {
        const sc = px(mode, s);
        const [, sChroma, sHue] = rgb8ToOklch(sc);
        // 近中性色的色相角度沒有感知意義，這種情況只看 ΔE00
        const hueMeaningful = cChroma >= CHROMATIC_MIN && sChroma >= CHROMATIC_MIN;
        let hueGap = Math.abs(cHue - sHue);
        if (hueGap > 180) hueGap = 360 - hueGap;
        const de = deltaE00(lab(c), lab(sc));
        const ok = de >= STATUS_DE_MIN || (hueMeaningful && hueGap >= STATUS_HUE_GAP);
        if (!ok) {
          fail.push(
            `chart-${i + 1}/${mode} 與 ${s} 太近：色相差 ${hueGap.toFixed(0)}°（需 ${STATUS_HUE_GAP}）` +
            `且 ΔE00 ${de.toFixed(1)}（需 ${STATUS_DE_MIN}）`,
          );
        }
      }
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

  // ── 4. 互動狀態層 ──────────────────────────────────────────
  //
  // 狀態層是**疊加**不是換色，所以不能只對一種底色驗——它的全部意義就在於
  // 「深了一階」這件事要在每一種表面上都成立。改版前的 hover 是 `bg-muted/50`，
  // 對白底看得見、對斑馬列（本來就是 muted）等於沒變，一種底色驗不出這件事。
  //
  // 疊加色取該表面自己的內容色（元件上的 currentColor），不是統一的 `foreground`：
  // 深色模式下 `foreground` 與 `primary` 是同一個近白，拿它疊實色按鈕會得到 ΔE00 0.0。
  const alpha = (n) => parseFloat(tokens.state[n].value) / 100;
  const A = { hover: alpha("hover-alpha"), pressed: alpha("pressed-alpha"), selected: alpha("selected-alpha") };

  const STATE_HOVER_MIN = 2.5;    // 低於此看不出「這個可以互動」
  const STATE_PRESSED_MIN = 2.5;  // 按下要能與 hover 分開
  const STATE_SELECTED_MIN = 4;   // 已選要能與 hover 分開——舊值實測只有 1.6
  const STATE_SELECTED_MAX = 16;  // 上限，防「太刻意」

  // 表面 → 那個表面上的內容色。這四個是狀態層**實際會落在**的底色：
  // 資料表列（頁面底／卡片／斑馬列的 muted）、下拉與篩選選單（popover）。
  // muted 當斑馬列用時字是 `foreground`，不是 `muted-foreground`（後者是同一列裡的次要文字）。
  //
  // 不驗 `field-editable`／`field-readonly`：那兩個是**輸入框**的底色（見 number-input、
  // coachmark 的 textarea），沒有任何帶狀態層的元件坐在上面。欄位的回饋走聚焦環與邊框，
  // 不走狀態層——驗一組不存在的組合只會製造假警報。
  //
  // 外殼（側欄、表頭）上的選單項、表頭按鈕也走狀態層，而外殼每個主題都不一樣——
  // 所以外殼這一組**逐主題**驗，內容面四種表面在所有主題下同值，驗預設主題即可。
  const SURFACES = [
    ["background", "foreground"],
    ["card", "card-foreground"],
    ["muted", "foreground"],
    ["popover", "popover-foreground"],
  ];
  const surfaceRuns = [
    ...SURFACES.map(([surface, onColor]) => ({ theme: DEF, surface, onColor, label: surface })),
    ...Object.keys(tokens.themes ?? {}).map((theme) => ({
      theme, surface: "sidebar", onColor: "sidebar-foreground", label: `sidebar（${theme}）`,
    })),
  ];
  for (const mode of MODES) {
    const s = { hover: Infinity, pressed: Infinity, selected: Infinity, loudest: 0, text: Infinity, sec: Infinity };
    for (const { theme, surface, onColor, label } of surfaceRuns) {
      const base = resolve(theme, mode, surface);
      const paint = resolve(theme, mode, onColor);
      const hov = mix(paint, base, A.hover);
      const prs = mix(paint, base, A.pressed);
      const sel = mix(paint, base, A.selected);
      const d = (a, b) => deltaE00(lab(a), lab(b));
      const [dh, dp, ds, dmax] = [d(base, hov), d(hov, prs), d(hov, sel), d(base, sel)];
      const tag = `${label}/${mode}`;
      if (dh < STATE_HOVER_MIN) fail.push(`hover 對 ${tag} 只差 ΔE00 ${dh.toFixed(1)}（需 ${STATE_HOVER_MIN}）`);
      if (dp < STATE_PRESSED_MIN) fail.push(`pressed 對 hover 在 ${tag} 只差 ΔE00 ${dp.toFixed(1)}（需 ${STATE_PRESSED_MIN}）`);
      if (ds < STATE_SELECTED_MIN) fail.push(`已選對 hover 在 ${tag} 只差 ΔE00 ${ds.toFixed(1)}（需 ${STATE_SELECTED_MIN}）`);
      if (dmax > STATE_SELECTED_MAX) fail.push(`已選對 ${tag} 差到 ΔE00 ${dmax.toFixed(1)}（上限 ${STATE_SELECTED_MAX}，過於刻意）`);
      // 最壞情況的文字對比：最深的疊加層（已選）之上，正文仍須合格。
      const ct = contrast(paint, sel);
      if (ct < TEXT) fail.push(`已選的 ${tag} 上正文只有 ${ct.toFixed(2)}:1（需 ${TEXT}）`);
      s.hover = Math.min(s.hover, dh); s.pressed = Math.min(s.pressed, dp);
      s.selected = Math.min(s.selected, ds); s.loudest = Math.max(s.loudest, dmax);
      s.text = Math.min(s.text, ct);
      // 弱化文字：內容面是 muted-foreground，外殼上是 sidebar-muted-foreground
      const secondary = resolve(theme, mode, surface === "sidebar" ? "sidebar-muted-foreground" : "muted-foreground");
      s.sec = Math.min(s.sec, contrast(secondary, sel));
    }
    stats.state ??= {};
    stats.state[mode] = s;
  }

  // 實色按鈕上的狀態層。這條擋的是「疊加色挑錯」：若改用單一的 `foreground` 當疊加色，
  // 深色模式的 primary 按鈕會得到 ΔE00 0.0——按下去與沒按完全一樣，而四種表面那組檢查
  // 全部照樣通過。所以填色控制項必須單獨驗。
  const FILLS = [["primary", "primary-foreground"], ["brand", "brand-foreground"],
                 ["destructive", "destructive-foreground"], ["secondary", "secondary-foreground"]];
  for (const name of Object.keys(tokens.themes ?? {})) {
    for (const mode of MODES) {
      for (const [surface, onColor] of FILLS) {
        const base = resolve(name, mode, surface);
        const paint = resolve(name, mode, onColor);
        const dh = deltaE00(lab(base), lab(mix(paint, base, A.hover)));
        if (dh < STATE_HOVER_MIN) {
          fail.push(`hover 對 ${surface} 填色（${name}/${mode}）只差 ΔE00 ${dh.toFixed(1)}（需 ${STATE_HOVER_MIN}）`);
        }
      }
    }
  }

  return { fail, warn, stats };
}

// ── CLI ────────────────────────────────────────────────────
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { fail, warn, stats } = runChecks();

  console.log("環境色主題（外殼文字與次要文字 4.5:1／選中項 ΔE00 ≥8／聚焦環 3:1／外框 ΔE00 ≥10）");
  for (const [tag, s] of Object.entries(stats.themes)) {
    console.log(
      `  ${tag.padEnd(18)} 字 ${s.shellText.toFixed(1)}  次要 ${s.shellSecondary.toFixed(1)}  ` +
      `選中Δ ${s.accentDelta.toFixed(1)}（字 ${s.accentText.toFixed(1)}）  環 ${s.ring.toFixed(1)}  外框Δ ${s.frame.toFixed(1)}`,
    );
  }
  const p = stats.palette;
  console.log(
    `  色票 ${p.count} 組：同族最近 ${p.withinPair} ΔE00 ${p.within.toFixed(1)}（需 ${SHELL_FAMILY_MIN}）　` +
    `跨族最近 ${p.crossPair} ΔE00 ${p.cross.toFixed(1)}（需 ${SHELL_CROSS_MIN}）`,
  );
  console.log("\n圖表分類色票");
  for (const [mode, s] of Object.entries(stats.chart)) {
    console.log(
      `  ${mode.padEnd(6)} 最差對 ${s.worstPair} ΔE00 ${s.worst.toFixed(1)}　` +
      `L* 全距 ${s.lightnessRange.toFixed(1)}　最低對比 ${s.minContrast.toFixed(2)}:1`,
    );
  }

  console.log("\n互動狀態層（四種底色取最差；已選對底色取最大）");
  for (const [mode, s] of Object.entries(stats.state ?? {})) {
    console.log(
      `  ${mode.padEnd(6)} hover-底 ${s.hover.toFixed(1)}　pressed-hover ${s.pressed.toFixed(1)}　` +
      `已選-hover ${s.selected.toFixed(1)}　已選-底 ${s.loudest.toFixed(1)}（上限 16）　` +
      `正文 ${s.text.toFixed(2)}:1　弱化文字 ${s.sec.toFixed(2)}:1`,
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
