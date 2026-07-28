// @dooping/tokens — 型別化的 token 讀取入口。
//
// 這一層存在的理由：JSON 是來源、CSS 是產物，但「非 CSS 的宿主」（React Native、Canvas 圖表、
// 產生 PDF 的伺服器端、Figma plugin）需要在 JS 裡拿到值。因此提供一組小而穩定的讀取 API，
// 而不是讓每個宿主自己 parse JSON。
import raw from "./tokens.data.js";

type TokenEntry = { value: string; lineHeight?: string; desc?: string };
type TokenGroup = Record<string, TokenEntry | string | undefined>;

const isToken = (v: unknown): v is TokenEntry =>
  typeof v === "object" && v !== null && typeof (v as TokenEntry).value === "string";

/** 取一組 token 的 name→value 對映（自動略過 `$comment` 之類的註記欄）。 */
function flatten(group: TokenGroup): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(group)) if (isToken(v)) out[k] = v.value;
  return out;
}

export type ThemeMode = "light" | "dark";

/** 語意色（HSL 三元組字串，如 `"222.2 47.4% 11.2%"`）。要拿成 CSS 值請用 `hsl()` 包起來。 */
export function semanticColors(mode: ThemeMode = "light"): Record<string, string> {
  return flatten(raw.color[mode] as TokenGroup);
}

/** 圖表分類色票（hex），依序即建議的系列指派順序。 */
export function chartColors(mode: ThemeMode = "light"): string[] {
  const all = flatten(raw.chart[mode] as TokenGroup);
  return Object.keys(all)
    .filter((k) => /^chart-\d+$/.test(k))
    .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))
    .map((k) => all[k]);
}

/** 圖表輔助色（軸線／格線／文字）。 */
export function chartChrome(mode: ThemeMode = "light"): { axis: string; grid: string; text: string } {
  const all = flatten(raw.chart[mode] as TokenGroup);
  return { axis: all["chart-axis"], grid: all["chart-grid"], text: all["chart-text"] };
}

export const radius = flatten(raw.radius as TokenGroup);
export const space = flatten(raw.space as TokenGroup);
export const fontSize = flatten(raw.fontSize as TokenGroup);
export const fontFamily = flatten(raw.fontFamily as TokenGroup);
export const shadow = flatten(raw.shadow as TokenGroup);
export const duration = flatten(raw.duration as TokenGroup);
export const easing = flatten(raw.easing as TokenGroup);
export const size = flatten(raw.size as TokenGroup);

/** token 版本（破壞性變更＝major，見治理章）。 */
export const TOKENS_VERSION: string = raw.meta.version;

/** 完整原始 token 樹（含 desc 說明），文件站用來自動產生 token 表。 */
export const tokens = raw;
