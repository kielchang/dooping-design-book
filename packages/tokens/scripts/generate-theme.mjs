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
// `neutralBrand` = 這一組**沒有品牌色**，`--brand` 直接鏡射 `--primary`。
//
// 石墨的定位是「不挑主題時等同現況」，而現況本來就沒有 `--brand`。先前讓它照公式生成
// 一個 chroma 0.030 的灰藍，結果填色按鈕與**停用**按鈕幾乎同色——實測距停用外觀
// 只有 ΔE00 8.5（淺）／7.9（深），低於 10 就是實務上分不開。
// 那不是色相問題，是「用一個近中性色去做實色填底」本身就會撞到 disabled 的視覺位置。
const THEMES = [
  { name: "graphite", label: "石墨", hue: 265, cap: 0.030, neutralBrand: true },
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

function buildTheme({ hue, cap, neutralBrand = false }) {
  const out = { light: {}, dark: {} };

  for (const mode of ["light", "dark"]) {
    const c = mode === "dark" ? cap * DARK_CHROMA_FACTOR : cap;

    // 中性色先算——brand-subtle 要與「這個主題的 muted」拉開距離，
    // 得用轉過色相之後的值。
    const neutral = tintNeutral(mode, hue);
    const nx = (name) => hslToRgb8((neutral[name] ?? tokens.color[mode][name]).value);

    // brand：關鍵 CTA 的填色。解 L 使白字達 4.5:1，取最亮的合格解——
    // 最亮＝色彩最鮮明而不過於沉重，且仍留在文字對比門檻內。
    //
    // 無彩主題例外：鏡射 primary。前景**必須跟著鏡射 primary-foreground**，
    // 不能沿用下面寫死的白——深色模式的 primary 是近白（`210 40% 98%`），
    // 配白字會變成白底白字。
    const brand = neutralBrand
      ? { rgb: px({ mode, name: "primary" }) }
      : solveLightness(hue, c, WHITE, 4.5, { from: 0.30, to: 0.80, prefer: "max" });
    if (!brand) throw new Error(`${mode} brand 無解（hue ${hue}）`);
    const brandFg = neutralBrand
      ? tokens.color[mode]["primary-foreground"].value
      : "0 0% 100%";

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

    // ring 刻意**不**進主題（ADR-0007）：聚焦環回落 :root 的中性基礎值。
    // v0.4.0 曾把它做成吃主題色相，實際使用發現它會與欄位提醒色
    // （edit 琥珀、danger）在同一個輸入框上撞成兩套強調——
    // 提醒色管語意、ring 管焦點，色相分家之後切主題也不會誤讀 ring 的用意。
    // 中性 ring 對各主題表面的 3:1（WCAG 1.4.11）改由 verify-color 驗有效值。

    out[mode] = {
      ...neutral,
      brand: {
        value: rgb8ToHsl(brand.rgb),
        desc: neutralBrand
          ? "主題色：本組無品牌色，鏡射 primary"
          : "主題色：品牌強調與非提交型入口（確認／送出／儲存請用 primary）",
      },
      "brand-foreground": { value: brandFg, desc: "brand 上的文字" },
      "brand-subtle": { value: rgb8ToHsl(subtle), desc: "主題色淡底：選中的導覽項、分頁底線區" },
      "brand-subtle-foreground": { value: rgb8ToHsl(onSubtle.rgb), desc: "brand-subtle 上的文字" },
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

// 目標是「看起來一樣有顏色」，所以參數是**感知量**而不是彩度。
//
// 上一版是「固定 L ＋ 固定 chroma」（0.935 / 0.060），數字整齊但感知不整齊：
// sRGB 色域**不是色相對稱的**，在 L=0.935 那麼亮的地方綠與黃撐得住的 chroma
// 遠高於藍與紅，於是 info／danger 被色域裁到 0.033–0.035，success 保住 0.060。
// 實測 ΔE00(subtle, card)：info 11.0、danger 12.6、warning 14.1、success 18.5——
// 差 1.69 倍（深色 2.13 倍），而且順序是反的：**綠色的「已完成」比紅色的「無法確認」
// 還要搶眼**。四種提示疊成一欄時這件事直接看得到。
//
// 改成逐色相反解 (L, C) 去命中同一個 ΔE00，就與這個檔案其他地方一樣是
// 「目標值反解」而不是「挑完再量」。
//
// 規則是兩段的：**共用一個明度**（所以四種看起來是同一家人），
// 各色相的 chroma 則反解到同一個染色量。
//
// 為什麼 chroma 不能也固定：實測「固定 L ＋ 固定 C」在深色下染色量會差 2.33 倍，
// 因為藍色在深色中性底上**本質上比較不顯眼**（藍對亮度的貢獻最低）。
// 固定 chroma 會讓 info 的淡底看起來比其他三種淡一截——嚴重度階序照樣是壞的。
// 反過來讓 chroma 隨色相補償，深色下 info 需要約 3.3 倍的 chroma 才追得上，
// 這個差距是**對感知不對稱的補償**，不是不一致。
//
// 共用明度的選法：在明度帶內掃，取「chroma 差距最小」且四種仍兩兩分得開的那一個 L。
// 這樣同時兼顧「同一家人」與「盡量等鮮豔」。
const SUBTLE_TINT = { light: 15.0, dark: 17.0 };
const SUBTLE_L_BAND = { light: [0.86, 0.97], dark: [0.14, 0.40] };
const SUBTLE_C_CAP = 0.16;
const SUBTLE_SEP_MIN = 10;

/** 某個 L 上，把每個色相的 chroma 解到命中 target 染色量。解不到就回 null。 */
function tintsAt(L, hues, card, target) {
  const out = [];
  for (const hue of hues) {
    let best = null;
    const cap = Math.min(maxChroma(L, hue), SUBTLE_C_CAP);
    for (let C = 0.004; C <= cap + 1e-9; C += 0.001) {
      const rgb = oklchToRgb8(L, C, hue);
      const err = Math.abs(deltaE00(lab(rgb), lab(card)) - target);
      if (!best || err < best.err) best = { rgb, err, C };
    }
    if (!best || best.err > 0.5) return null; // 這個 L 上這個色相到不了目標
    out.push(best);
  }
  return out;
}

/** 選共用明度：chroma 差距最小、且四種兩兩仍分得開。 */
function solveTintFamily(hues, mode, card) {
  const [lo, hi] = SUBTLE_L_BAND[mode];
  const target = SUBTLE_TINT[mode];
  let best = null;
  for (let L = lo; L <= hi + 1e-9; L += 0.002) {
    const set = tintsAt(L, hues, card, target);
    if (!set) continue;
    let sep = Infinity;
    for (let i = 0; i < set.length; i++)
      for (let j = i + 1; j < set.length; j++)
        sep = Math.min(sep, deltaE00(lab(set[i].rgb), lab(set[j].rgb)));
    if (sep < SUBTLE_SEP_MIN) continue;
    const cs = set.map((s) => s.C);
    const spread = Math.max(...cs) / Math.min(...cs);
    if (!best || spread < best.spread) best = { L, set, spread, sep };
  }
  if (!best) throw new Error(`${mode} 的淡底找不到共用明度（target ΔE00 ${target}）`);
  return best;
}

function buildAlertSubtle() {
  const log = [];
  for (const mode of ["light", "dark"]) {
    const card = px({ mode, name: "card" });
    const hues = ALERT_STATUSES.map((n) => rgb8ToOklch(px({ mode, name: n }))[2]);
    const family = solveTintFamily(hues, mode, card);
    log.push(
      `  ${mode}：共用明度 L=${family.L.toFixed(3)}，chroma 差距 ${family.spread.toFixed(2)}×，` +
      `兩兩最差 Δ${family.sep.toFixed(1)}`,
    );
    for (const [i, name] of ALERT_STATUSES.entries()) {
      const hue = hues[i];
      const tint = family.set[i].rgb;

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
      log.push(
        `  ${name}-subtle/${mode}  ${rgb8ToHex(tint)} 染色量 Δ${deltaE00(lab(tint), lab(card)).toFixed(1)}` +
        ` → 文字 ${rgb8ToHex(ink.rgb)} ${contrast(ink.rgb, tint).toFixed(2)}:1`,
      );
    }
    // 四種 tint 必須彼此分得開，否則「注意」和「錯誤」看起來一樣
    const tints = ALERT_STATUSES.map((n) => px({ mode, name: `${n}-subtle` }));
    for (let i = 0; i < tints.length; i++) {
      for (let j = i + 1; j < tints.length; j++) {
        const d = deltaE00(lab(tints[i]), lab(tints[j]));
        if (d < 10) throw new Error(`${mode} ${ALERT_STATUSES[i]}↔${ALERT_STATUSES[j]} 的 tint 只差 ΔE00 ${d.toFixed(1)}`);
      }
    }
    // 而且四種的「染色量」要相等——這一條才是這次改寫的重點。
    // 不等量會讓嚴重度階序在淡底層失效（上一版綠色比紅色搶眼）。
    const amounts = tints.map((t) => deltaE00(lab(t), lab(card)));
    const ratio = Math.max(...amounts) / Math.min(...amounts);
    if (ratio > 1.3) {
      throw new Error(
        `${mode} 四種 tint 的染色量差 ${ratio.toFixed(2)}× —— ` +
        `目標 ΔE00 ${SUBTLE_TINT[mode]} 有色相解不到（各為 ${amounts.map((a) => a.toFixed(1)).join(", ")}）`,
      );
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
// 明度帶放寬過一次（light 0.42–0.66 → 0.38–0.70、dark 0.56–0.86 → 0.50–0.90）。
// 動機是加入「分類色不得靠近任何狀態色」之後，色相可用區被切碎，原本的窄明度帶
// 湊不出品質：最差對從 12.2／11.8 掉到 10.1／9.4，深色還出現 2 對低於色盲門檻 10。
//
// 放寬的是**美感約束**而不是無障礙門檻——這個順序是寫死的規則。而且結果是雙贏：
// 更寬的明度帶本來就對二色覺者有利（他們失去色相辨別、保留明度），
// 最差對因此反而升到 14.4／12.6，比加守衛之前還好。
//
// 這也解釋了為什麼早先兩次「加碼防守」都是負收益：那兩次只加緊約束、沒有同時
// 給最佳化器更多空間。
const CHART_BAND = { light: [0.40, 0.68], dark: [0.54, 0.88] };
const CHART_CHROMA = {
  light: { min: 0.090, max: 0.155 },
  dark: { min: 0.085, max: 0.135 },
};
// 色相間距從 30° 放寬到 20°，與明度帶放寬是同一次調整、同一個理由（見 CHART_BAND）。
// 間距本身不是目的——真正要保證的是「任兩色在紅綠色盲下 ΔE00 ≥10」，那條由
// verify-color 擋。間距只是幫最佳化器避開「兩個看起來同色系」的啟發式，
// 卡太緊反而讓它找不到好解。
const HUE_SPACING = 22;          // 任兩色的 OKLCH 色相至少差這麼多度
const ANCHOR_HUE = 250;          // 第 1 色錨在藍——與既有色票起點一致，取用端既有圖表不會整個換臉

// 分類色與狀態色的距離。上一版只擋 danger，而且只用單一的 ΔE00 條件——
// 結果深色下 chart-5 與 warning 只差 ΔE00 7.3、chart-1 與 info 7.9，
// 都低於色票自己的「分不開」門檻 10，而守衛全綠（因為它沒在看那兩個）。
//
// 改成對六個狀態色全驗，雙條件滿足其一即可：色相拉開，或感知距離拉開。
// 之所以不是「只用 ΔE00 但把門檻拉高」：曾經實測過兩次加碼，都是負收益——
//   guard 18 → 22           ：最差對 12.2 → 10.1
//   再排除 danger 色相 ±22° ：最差對 12.2 → 10.1（深色 11.1 → 9.6，且出現 1 對 <10）
// 拿整組色票的品質去換一點點紅色距離不划算。改用「色相 OR 距離」的雙條件，
// 才能既擋掉「這條線看起來就是紅色的」又不必把可用色域整段砍掉。
const CHART_STATUS_GUARD = ["success", "warning", "danger", "info", "destructive", "edit"];
const STATUS_HUE_GAP = 20;       // 分類色與狀態色的色相距離
const STATUS_DE_MIN = 18;        // 或者：感知距離拉到這麼遠也算過
const CHROMATIC_MIN = 0.04;      // 低於此視為無彩，色相角度沒有感知意義

const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

function buildChartPalette(mode, n = 8) {
  const bg = PAGE_BG[mode];
  const [lo, hi] = CHART_BAND[mode];
  const chroma = CHART_CHROMA[mode];

  // 分類色不能與**任何**狀態色靠太近。上一版只擋 danger，於是深色下 chart-5 與 warning
  // 只差 ΔE00 7.3、chart-1 與 info 7.9——讀者會把一條普通序列讀成「這條有問題」。
  //
  // 雙條件（滿足其一即可）：色相拉開 ≥STATUS_HUE_GAP，或感知距離拉開 ≥STATUS_DE_MIN。
  // 只用 ΔE00 不夠：同色相但一深一淺的兩色 ΔE00 可以很大，「紅色＝異常」的聯想仍然成立。
  const statusRefs = CHART_STATUS_GUARD.map((name) => {
    const rgb = hslToRgb8(tokens.color[mode][name].value);
    const [, C, H] = rgb8ToOklch(rgb);
    return { name, rgb, C, H };
  });
  const clearsStatus = (rgb, H) => {
    const [, C] = rgb8ToOklch(rgb);
    return statusRefs.every((s) => {
      if (deltaE00(lab(rgb), lab(s.rgb)) >= STATUS_DE_MIN) return true;
      // 近中性色的色相角度沒有感知意義，這種情況只能靠 ΔE00
      if (C < CHROMATIC_MIN || s.C < CHROMATIC_MIN) return false;
      return hueGap(H, s.H) >= STATUS_HUE_GAP;
    });
  };

  // 候選池：固定網格，順序完全決定於迴圈——沒有亂數，重跑必得同一組色票。
  const pool = [];
  for (let i = 0; i <= 24; i++) {
    const L = lo + ((hi - lo) * i) / 24;
    for (let H = 0; H < 360; H += 2) {
      const C = Math.min(maxChroma(L, H), chroma.max);
      if (C < chroma.min) continue;
      const rgb = oklchToRgb8(L, C, H);
      if (contrast(rgb, bg) < 3.0) continue;
      if (!clearsStatus(rgb, H)) continue;
      pool.push({ rgb, L, H });
    }
  }
  if (pool.length < n) {
    throw new Error(`${mode} 候選池只剩 ${pool.length} 個——狀態色保留區加上美感約束太嚴`);
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
console.log("主題色（brand 對其前景 4.5:1／中性 ring 對各主題最亮表面 3:1）");
for (const t of THEMES) {
  const th = themes[t.name];
  // 一律拿**該主題自己的**前景與表面去量，不要拿理想白或未轉色相的基準值——
  // 這支報告先前兩次都犯過：ring 拿沒轉色相的 muted 去比，brand 拿純白去比，
  // 於是印出低於門檻的假數字。報告算錯對象比不印還糟，它會讓人去修沒壞的東西。
  //
  // ring 是全主題共用的中性基礎值（ADR-0007），但表面是各主題帶色相的——
  // 所以每個主題仍要各驗一次：同一個 ring，對象不同。
  const cB = (m) => contrast(hslToRgb8(th[m].brand.value), hslToRgb8(th[m]["brand-foreground"].value));
  const cR = (m) => contrast(
    hslToRgb8(tokens.color[m].ring.value),
    hslToRgb8((th[m][m === "light" ? "background" : "muted"] ?? tokens.color[m][m === "light" ? "background" : "muted"]).value),
  );
  const b = { l: hslToRgb8(th.light.brand.value), d: hslToRgb8(th.dark.brand.value) };
  console.log(
    `  ${t.label} ${t.name.padEnd(9)} H=${String(t.hue).padStart(3)}  ` +
    `brand ${rgb8ToHex(b.l)}/${rgb8ToHex(b.d)} 前景 ${cB("light").toFixed(2)}/${cB("dark").toFixed(2)}  ` +
    `ring(基礎) ${cR("light").toFixed(2)}/${cR("dark").toFixed(2)}`,
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
