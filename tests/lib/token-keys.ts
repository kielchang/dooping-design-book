// tokens.json 的鍵集推導與 CSS 規則擷取——守衛共用的唯一一份。
//
// 同一份推導原本要散在三支測試裡（字串守衛、v4 可編譯、v3 可編譯），任何一支寫錯，
// 「三方比對」就退化成「兩方比對加一個跟著錯的第三方」。所以抽成一處。
//
// 刻意**不 import** packages/tokens/scripts/build-tailwind-v4.mjs 的推導：
// 守衛拿產生器自己的函式來驗產生器，等於沒驗。這裡是獨立寫的第二份實作。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

type Group = Record<string, unknown>;

export const tokensJson = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/tokens.json"), "utf8"));

/** 一組 token 裡真正的 token 鍵（略過 $comment、$label 之類的註記欄）。 */
export const tokenKeys = (obj: Group | undefined): string[] =>
  Object.keys(obj ?? {}).filter((k) => {
    const v = (obj as Group)[k] as { value?: unknown } | null;
    return typeof v === "object" && v !== null && typeof v.value === "string";
  });

export const chartKeys = (): string[] => tokenKeys(tokensJson.chart.light);

/**
 * 對映成 utility 的全部色鍵：語意層 ∪ 只存在於主題層的鍵 ∪ 圖表，排序後回傳。
 *
 * 下限 40 是防空轉：tokens.json 的結構一改（例如 `value` 改名），tokenKeys 會安靜地回空陣列，
 * 靠這份鍵集比對的三支守衛（tokens、tokens-v3、tokens-v4）就會「零鍵全對」而綠。
 * 現值 47＋8＋11＝66；真的要砍到 40 以下，先來改這個數字並在 CHANGELOG 說明。
 */
export function expectedColorKeys(): string[] {
  const semantic = tokenKeys(tokensJson.color.light);
  const set = new Set(semantic);
  const themes = Object.values(tokensJson.themes as Record<string, { light: Group }>);
  const themeOnly = [...new Set(themes.flatMap((t) => tokenKeys(t.light)))].filter((k) => !set.has(k));
  const keys = [...semantic, ...themeOnly, ...chartKeys()].sort();
  if (keys.length < 40) {
    throw new Error(`expectedColorKeys 只推導出 ${keys.length} 個色鍵（下限 40）——tokens.json 的結構壞了或讀錯檔，守衛不能空轉`);
  }
  return keys;
}

/** Tailwind 產出的 class selector 跳脫：/ : . [ ] ( ) % 前面加反斜線。 */
export const escapeClass = (c: string): string => c.replace(/[/:.[\]()%]/g, (ch) => "\\" + ch);

/**
 * 取出某個 class 的第一條規則（從 selector 到對應的右大括號），找不到回傳 null。
 * 前綴相同的其他 class（bg-card vs bg-card-foreground）靠「selector 之後緊接的字元」排除。
 */
export function ruleFor(css: string, cls: string): string | null {
  const needle = "." + escapeClass(cls);
  let at = css.indexOf(needle);
  while (at >= 0 && !" {:,)".includes(css[at + needle.length] ?? "")) at = css.indexOf(needle, at + 1);
  if (at < 0) return null;
  const open = css.indexOf("{", at);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(at, i + 1);
  }
  return null;
}
