// token 期望值與 computed color 的比對——渲染守衛共用（verify-host、verify-consumer）。
//
// 期望值一律從 tokens.json 反解「主題有效值」：themes 覆蓋鏈 → color 基準值。
// 預設主題會覆蓋中性色，拿 color.* 基準值驗會驗到後備值（verify-visual.mjs 同款反解）。
// 容差 ±2/channel：alpha 合成會被瀏覽器抖動，逐位元比對會假性失敗（治理章〈story 慣例〉的截圖方法論）。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { hslToRgb8 } from "../../packages/tokens/scripts/lib/color.mjs";

export const TOL = 2;

export const loadTokens = (root) => JSON.parse(readFileSync(join(root, "packages/tokens/src/tokens.json"), "utf8"));

/** 主題有效值（0–255 的 [r, g, b]）。 */
export function resolveTokenRgb(tokens, theme, mode, name) {
  const override = tokens.themes?.[theme]?.[mode]?.[name];
  const value = (override ?? tokens.color[mode][name])?.value;
  if (value === undefined) throw new Error(`tokens.json 沒有 ${mode}／${name}`);
  return hslToRgb8(value);
}

/** tokens.json 裡的原始值字串（例如 "220 14% 96%"）——比對 CSS 自訂屬性用。 */
export function tokenValue(tokens, theme, mode, name) {
  return (tokens.themes?.[theme]?.[mode]?.[name] ?? tokens.color[mode][name])?.value;
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
