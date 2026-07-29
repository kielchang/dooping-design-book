// 色彩數學：OKLCH ↔ sRGB、WCAG 2.2 對比、CIEDE2000、二色覺模擬。
//
// 這一層是 generate-theme.mjs（生成）與 scripts/verify-color.mjs（驗收）的共同底座。
// 刻意不依賴任何套件——token 生成是建置鏈最上游，這裡多一個相依，
// 取用端就多一個可能裝不起來的理由。
//
// 為什麼是 OKLCH 不是 HSL：HSL 的 L 在不同色相間感知不一致（同一個 L 值的黃與藍
// 亮度差很多），調整會意外破壞對比。OKLCH 的 L 是感知亮度，可預測，
// 因此「解一個 L 使對比達標」這件事才有意義。
//
// 釋出格式仍是 HSL 三元組（見 tokens.json 的 $comment）——OKLCH 只用於**生成過程**，
// 最後一律落地成既有慣例，取用端無感。

// ── sRGB 傳遞函數 ──────────────────────────────────────────────
export const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const toGamma = (c) => {
  const x = Math.min(1, Math.max(0, c));
  return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
};

// ── OKLCH → 線性 sRGB（Björn Ottosson） ───────────────────────
export function oklchToLinear(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export const inGamut = (L, C, H, eps = 1e-4) =>
  oklchToLinear(L, C, H).every((v) => v >= -eps && v <= 1 + eps);

/** 8-bit sRGB → OKLCH `[L, C, H]`。用來問「這個既有顏色的色相是幾度」。 */
export function rgb8ToOklch(rgb8) {
  const [r, g, b] = rgb8.map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}

/** 該 (L,H) 在 sRGB 色域內能達到的最大 chroma。 */
export function maxChroma(L, H, hi = 0.45) {
  let lo = 0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** OKLCH → 8-bit sRGB（0–255 整數三元組）。這是實際會被瀏覽器畫出來的顏色。 */
export function oklchToRgb8(L, C, H) {
  return oklchToLinear(L, C, H).map((v) => Math.round(toGamma(v) * 255));
}

// ── 格式轉換 ──────────────────────────────────────────────────
export const rgb8ToHex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

export function hexToRgb8(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** HSL 三元組字串（`"222 22% 8%"`）→ 8-bit sRGB。 */
export function hslToRgb8(str) {
  const [hs, ss, ls] = str.trim().split(/\s+/);
  const h = parseFloat(hs);
  const s = parseFloat(ss) / 100;
  const l = parseFloat(ls) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const seg = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][
    Math.floor(h / 60) % 6
  ];
  return seg.map((v) => Math.round((v + m) * 255));
}

/**
 * 8-bit sRGB → HSL 三元組字串，並保證 `hslToRgb8()` 轉得回原值。
 *
 * 為什麼要保證回轉：token 釋出的是 HSL 字串，瀏覽器拿它算回 RGB。若精度不足，
 * 生成時驗過的對比與實際畫面上的顏色會**不是同一個顏色**——這種偏差不會有任何東西報錯。
 * 因此這裡從最短表示開始試，直到回轉相符為止。
 */
export function rgb8ToHsl(rgb8) {
  const [r, g, b] = rgb8.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  for (const dp of [0, 1, 2, 3]) {
    const str = `${+h.toFixed(dp)} ${+(s * 100).toFixed(dp)}% ${+(l * 100).toFixed(dp)}%`;
    const back = hslToRgb8(str);
    if (back.every((v, i) => v === rgb8[i])) return str;
  }
  // 四位小數仍無法回轉的情況不存在於 8-bit 空間，但留一條明路而不是回傳謊言
  throw new Error(`HSL 無法無損表示 rgb(${rgb8.join(",")})`);
}

// ── WCAG 2.2 對比 ─────────────────────────────────────────────
export function luminance(rgb8) {
  const [r, g, b] = rgb8.map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 對比比值。門檻採嚴格值不四捨五入：文字 4.5、大字與非文字 3。 */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * 解一個 L 使 `oklch(L, min(maxChroma, cap), hue)` 對 `ref` 達到目標對比。
 *
 * 關鍵：候選色一律先 round 成 8-bit 再驗。浮點合格但取整後掉到門檻以下是真實風險，
 * 而且只會在實機上出現。`prefer: "max"` 取最亮的合格解（色彩最鮮明）、
 * `"min"` 取最暗的合格解。找不到回傳 null，由呼叫端決定怎麼辦——不要默默回傳一個不合格的值。
 */
export function solveLightness(hue, cap, ref, target, { from = 0.2, to = 0.95, prefer = "max", steps = 1200 } = {}) {
  let found = null;
  for (let i = 0; i < steps; i++) {
    const L = from + ((to - from) * i) / (steps - 1);
    const C = Math.min(maxChroma(L, hue), cap);
    const rgb = oklchToRgb8(L, C, hue);
    if (contrast(rgb, ref) >= target) {
      if (prefer === "max") found = { L, C, rgb };
      else if (!found) found = { L, C, rgb };
    }
  }
  return found;
}

// ── 二色覺模擬（Machado et al. 2009，severity 1.0） ────────────
const DICHROMAT = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};

export function simulate(rgb8, kind) {
  if (kind === "normal") return rgb8;
  const m = DICHROMAT[kind];
  const v = rgb8.map((c) => toLinear(c / 255));
  return m.map((row) => Math.round(toGamma(row[0] * v[0] + row[1] * v[1] + row[2] * v[2]) * 255));
}

// ── CIELAB 與 CIEDE2000 ───────────────────────────────────────
export function lab(rgb8) {
  const [r, g, b] = rgb8.map((v) => toLinear(v / 255));
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

/** CIEDE2000 感知色差。經驗門檻：<10 實務上分不開、<15 勉強、≥15 安全。 */
export function deltaE00(p, q) {
  const [L1, a1, b1] = p;
  const [L2, a2, b2] = q;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cb = (C1 + C2) / 2;
  const G = Cb > 0 ? 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))) : 0.5;
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h1 = a1p === 0 && b1 === 0 ? 0 : (deg(Math.atan2(b1, a1p)) + 360) % 360;
  const h2 = a2p === 0 && b2 === 0 ? 0 : (deg(Math.atan2(b2, a2p)) + 360) % 360;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    if (Math.abs(h2 - h1) <= 180) dhp = h2 - h1;
    else dhp = h2 > h1 ? h2 - h1 - 360 : h2 - h1 + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2);
  const Lb = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp;
  if (C1p * C2p === 0) hbp = h1 + h2;
  else if (Math.abs(h1 - h2) <= 180) hbp = (h1 + h2) / 2;
  else hbp = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  const T =
    1 - 0.17 * Math.cos(rad(hbp - 30)) + 0.24 * Math.cos(rad(2 * hbp)) +
    0.32 * Math.cos(rad(3 * hbp + 6)) - 0.2 * Math.cos(rad(4 * hbp - 63));
  const Rc = Cbp > 0 ? 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) : 0;
  const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(rad(2 * (30 * Math.exp(-(((hbp - 275) / 25) ** 2))))) * Rc;
  return Math.sqrt(
    (dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh),
  );
}

/**
 * 兩色在「正常視覺 + 紅綠色盲」下的**最小**感知距離。
 *
 * 取最小值而不是平均：一組色票只要在任何一種常見色覺下糊在一起，對那群使用者就是壞的。
 * 只算 protan/deutan 是因為它們合計約占男性 8%；tritan 罕見（約萬分之一）另計。
 */
export function minSeparation(rgbA, rgbB, kinds = ["normal", "protan", "deutan"]) {
  return Math.min(...kinds.map((k) => deltaE00(lab(simulate(rgbA, k)), lab(simulate(rgbB, k)))));
}
