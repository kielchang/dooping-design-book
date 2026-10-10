// token 期望值與 computed color 的比對——渲染守衛共用（verify-host、verify-consumer）。
//
// 期望值一律從 tokens.json 反解「主題有效值」，照 CSS 的 cascade 走：
// 主題自己的宣告 → 預設主題（`:root` 就是基準層＋預設主題）→ color 基準值。
// 預設主題覆蓋內容面的中性色、環境主題只覆蓋外殼鍵，所以環境主題的內容面要回到預設主題找，
// 拿 color.* 基準值驗會驗到後備值（verify-visual.mjs 同款反解）。
// 容差 ±2/channel：alpha 合成會被瀏覽器抖動，逐位元比對會假性失敗（packages/react/README.md「截圖驗證一定要比對期望值」）。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { hslToRgb8 } from "../../packages/tokens/scripts/lib/color.mjs";

export const TOL = 2;

export const loadTokens = (root) => JSON.parse(readFileSync(join(root, "packages/tokens/src/tokens.json"), "utf8"));

/** tokens.json 裡的原始值字串（例如 "220 14% 96%"）——比對 CSS 自訂屬性用。 */
export function tokenValue(tokens, theme, mode, name) {
  const def = tokens.meta?.defaultTheme;
  return (tokens.themes?.[theme]?.[mode]?.[name]
    ?? tokens.themes?.[def]?.[mode]?.[name]
    ?? tokens.color[mode][name])?.value;
}

/** 主題有效值（0–255 的 [r, g, b]）。 */
export function resolveTokenRgb(tokens, theme, mode, name) {
  const value = tokenValue(tokens, theme, mode, name);
  if (value === undefined) throw new Error(`tokens.json 沒有 ${mode}／${name}`);
  return hslToRgb8(value);
}

const parseAlpha = (s) => (s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));

/**
 * computed color → { rgb, alpha }。實色是 rgb()／rgba()；color-mix 的 computed 值在 Chromium
 * 可能是 oklab()／color()——那種格式不比 rgb（rgb 為 null），alpha 從尾端的「/ x」抓。
 */
export function parseColor(str) {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(str ?? "");
  if (m) return { rgb: [m[1], m[2], m[3]].map((v) => Math.round(Number(v))), alpha: m[4] === undefined ? 1 : parseAlpha(m[4]) };
  const tail = /\/\s*([\d.]+%?)\s*\)$/.exec(str ?? "");
  return { rgb: null, alpha: tail ? parseAlpha(tail[1]) : 1 };
}

export const near = (a, b, tol = TOL) => Array.isArray(a) && a.every((v, i) => Math.abs(v - b[i]) <= tol);
export const rgbStr = (c) => `rgb(${c.join(",")})`;
