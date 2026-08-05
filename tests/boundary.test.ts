// 元件庫邊界守衛 — 這支測試就是「工具箱能被任何專案拿去用」的自動化保證。
//
// 規則：@dooping/react 的每個檔案只能依賴
//   (a) 相對路徑的同伴模組，(b) @dooping/tokens，(c) 白名單內的通用外部套件。
// 任何「應用層概念」（狀態管理、路由、API client、業務型別、領域計算）一旦滲進來，
// 這支測試就會紅——在它變成技術債之前先擋下來。
//
// 這是 drift 防護的範本：把你的設計語言規則寫成測試，規則才不會只是文件裡的一句話。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const KIT = join(ROOT, "packages/react/src");

/** 允許出現在元件庫 import 中的外部套件（前綴比對）。 */
const ALLOWED_EXTERNAL = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "@radix-ui/",
  "lucide-react",
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "@dooping/tokens",
  "@xyflow/react", // 只有 graph-canvas 能碰——見下方的隔離守衛
];

/**
 * 相依隔離：某些套件只允許**一個檔案**碰。
 *
 * `@xyflow/react` 內部帶著 zustand——正是 FORBIDDEN_PATTERNS 裡「狀態管理屬於應用層」
 * 要擋的東西。字面上我們不會 import zustand，但把它放進白名單等於默默放行它的精神。
 * 折衷是把相依關在一個薄封裝裡：取用端與其他元件依賴 `<GraphCanvas>` 的 API，
 * 不依賴 React Flow 本身，升級或抽換的成本永遠只在一個檔案裡。
 *
 * 這條守衛讓「隔離」不是口號：任何第二個檔案 import 它就紅。
 */
const QUARANTINED: Record<string, string[]> = {
  "@xyflow/react": ["packages/react/src/ui/graph-canvas.tsx"],
};

/** 明確禁止的相依類型（出現即代表元件庫被應用層污染）。 */
const FORBIDDEN_PATTERNS = [
  { re: /from\s+["']zustand/, why: "狀態管理屬於應用層" },
  { re: /from\s+["']redux|@reduxjs/, why: "狀態管理屬於應用層" },
  { re: /from\s+["']react-router/, why: "路由屬於應用層" },
  { re: /from\s+["']next\//, why: "框架相依會綁死宿主" },
  { re: /from\s+["']axios|from\s+["']swr|@tanstack\/react-query/, why: "資料抓取屬於應用層" },
  { re: /from\s+["']@\//, why: "@/ 別名指向宿主專案，元件庫不得使用" },
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs)); continue; }
    if (/\.(ts|tsx)$/.test(name)) out.push(abs);
  }
  return out;
}

/** 隨套件發佈的檔案（stories 與 demo 資料不發佈，可用示範資料）。
 *  路徑先正規化成 `/`——`join()` 在 Windows 給的是 `\`，不正規化的話
 *  示範資料不會被排除，於是多出兩則測試、barrel 覆蓋率也會假性失敗。 */
const shipped = (abs: string) =>
  !/\.stories\.tsx$/.test(abs) && !abs.replace(/\\/g, "/").includes(`${"demo"}/`);

function imports(src: string): string[] {
  const out: string[] = [];
  const re = /from\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

const files = walk(KIT);
const shippedFiles = files.filter(shipped);

describe("元件庫邊界", () => {
  it("找得到足夠數量的元件檔（守衛本身沒有空轉）", () => {
    expect(shippedFiles.length).toBeGreaterThan(15);
  });

  for (const abs of shippedFiles) {
    const rel = relative(ROOT, abs);
    const src = readFileSync(abs, "utf8");

    it(`${rel}：只依賴 token、同伴模組與白名單套件`, () => {
      for (const spec of imports(src)) {
        if (spec.startsWith(".")) continue; // 同伴模組
        const ok = ALLOWED_EXTERNAL.some((p) => spec === p || spec.startsWith(p));
        expect(ok, `${rel} 匯入了未經允許的外部相依：${spec}`).toBe(true);
      }
    });

    it(`${rel}：沒有應用層相依`, () => {
      for (const { re, why } of FORBIDDEN_PATTERNS) {
        expect(re.test(src), `${rel} 違反邊界：${why}`).toBe(false);
      }
    });
  }

  it("被隔離的相依只有指定檔案能 import", () => {
    const offenders: string[] = [];
    for (const abs of shippedFiles) {
      const rel = relative(ROOT, abs).replace(/\\/g, "/");
      const src = readFileSync(abs, "utf8");
      for (const spec of imports(src)) {
        for (const [pkg, allowed] of Object.entries(QUARANTINED)) {
          if ((spec === pkg || spec.startsWith(`${pkg}/`)) && !allowed.includes(rel)) {
            offenders.push(`${rel} → ${spec}`);
          }
        }
      }
    }
    expect(offenders, `隔離相依外洩：${offenders.join("、")}`).toEqual([]);
  });
});

describe("barrel 覆蓋率", () => {
  const barrel = readFileSync(join(KIT, "index.ts"), "utf8");

  it("每個發佈的元件檔都有從 index.ts 匯出", () => {
    const missing = shippedFiles
      .map((abs) => relative(KIT, abs).replace(/\\/g, "/").replace(/\.tsx?$/, ""))
      .filter((mod) => mod !== "index" && mod !== "version")
      .filter((mod) => !barrel.includes(`"./${mod}"`));
    expect(missing, `未加入 barrel：${missing.join(", ")}`).toEqual([]);
  });
});
