import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { because, toLines } from "./lib/guard";

// 公開檔自足守衛：repo 裡的每個檔都是公開的，只寫規則與做法，不引用 repo 外查不到的東西。
//
// 管什麼：
// - 不得出現 `ADR-NNNN` 這類決策編號——讀者查不到它指向什麼。規則寫成句子，放在用到它的地方。
// - 元件、template、token 裡還沒清的舊編號列在 PENDING：只改註解也會動 registry 指紋，
//   所以隨該檔下一次實質變更一併改寫。清單只准縮短——檔案清乾淨了就要從清單拿掉。
// - 維護者本機若有 gitignored 的 `.private-terms`（一行一個詞），一併掃，不分大小寫。
//   詞表不進 repo，所以這支守衛本身不會寫出那些詞；CI 上沒有詞表時這一條跳過。
//
// 不管：git 歷史、已發佈的 npm 套件與 Release 內文、建置產物（這些在發版前另外掃）。
const RULE = "CLAUDE.md「repo 只放規則、架構描述與使用說明」";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ADR = /\bADR-\d{3,4}\b/;
const TEXT = /\.(md|mdx|ts|tsx|js|jsx|mjs|cjs|mts|json|ya?ml|css|txt|sh|html)$/;

/** 隨下一次實質變更才清的檔（元件、template、token 與它們的產物或同步副本）。只准縮短。 */
export const PENDING = [
  "apps/host-v4/scripts/dooping-check.mjs",
  "apps/host-v4/src/components/dooping/badge.tsx",
  "apps/host-v4/src/components/dooping/command.tsx",
  "apps/host-v4/src/components/dooping/page-header.tsx",
  "apps/host-v4/src/components/dooping/switch.tsx",
  "packages/react/src/ui/badge.tsx",
  "packages/react/src/ui/coachmark.tsx",
  "packages/react/src/ui/command.tsx",
  "packages/react/src/ui/gantt.tsx",
  "packages/react/src/ui/graph-canvas.tsx",
  "packages/react/src/ui/page-header.tsx",
  "packages/react/src/ui/switch.tsx",
  "packages/tokens/scripts/build-css.mjs",
  "packages/tokens/scripts/build-tailwind-v4.mjs",
  "packages/tokens/scripts/generate-theme.mjs",
  "packages/tokens/src/tokens.data.ts",
  "packages/tokens/src/tokens.json",
  "packages/tokens/tailwind-preset.cjs",
  "registry/badge.json",
  "registry/coachmark.json",
  "registry/command.json",
  "registry/dooping-check.json",
  "registry/gantt.json",
  "registry/graph-canvas.json",
  "registry/page-header.json",
  "registry/switch.json",
  "templates/dooping-check.mjs",
  "templates/eslint.dooping.cjs",
];

/** 追蹤中＋尚未追蹤但沒被忽略的文字檔（repo 相對路徑，正斜線）。 */
function publicFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: ROOT, encoding: "utf8" });
  return [...new Set(out.split("\0"))]
    .filter((f) => TEXT.test(f) && f !== "package-lock.json" && !f.endsWith("/package-lock.json"))
    .filter((f) => existsSync(join(ROOT, f)));
}

describe("公開檔自足：不引用 repo 外查不到的東西", () => {
  const files = publicFiles();
  const read = (f: string) => readFileSync(join(ROOT, f), "utf8");

  it("掃描範圍夠大（防空轉）", () => {
    expect(files.length, because("掃到的檔太少", "git ls-files 失效或副檔名過濾寫錯時，這條先紅", RULE)).toBeGreaterThanOrEqual(300);
  });

  it("清單外的檔不得出現 ADR 編號", () => {
    const pending = new Set(PENDING);
    const hits = files
      .filter((f) => !pending.has(f))
      .flatMap((f) => toLines(read(f)).flatMap((l, i) => (ADR.test(l) ? [`${f}:${i + 1}`] : [])));
    expect(hits, because("把編號改寫成規則句（或刪掉）", "讀者查不到編號指向什麼；規則要寫在用到它的地方", RULE)).toEqual([]);
  });

  it("PENDING 只准縮短：清單上的檔都還有編號", () => {
    const clean = PENDING.filter((f) => !existsSync(join(ROOT, f)) || !ADR.test(read(f)));
    expect(clean, because("這些檔已經清乾淨，從 PENDING 拿掉", "清單留著已清的檔，等於替下一次退步開了後門", RULE)).toEqual([]);
  });

  const termsFile = join(ROOT, ".private-terms");
  it.skipIf(!existsSync(termsFile))("維護者本機詞表（.private-terms）一個都不出現", () => {
    const terms = toLines(readFileSync(termsFile, "utf8")).map((t) => t.trim().toLowerCase()).filter(Boolean);
    expect(terms.length, because(".private-terms 是空的", "詞表存在卻沒有詞，等於沒掃", RULE)).toBeGreaterThan(0);
    const hits = files.flatMap((f) =>
      toLines(read(f)).flatMap((l, i) => {
        const low = l.toLowerCase();
        return terms.some((t) => low.includes(t)) ? [`${f}:${i + 1}`] : [];
      }),
    );
    expect(hits, because("這些行含維護者的內部詞，改寫或移到 CLAUDE.local.md", "公開檔不提內部系統", RULE)).toEqual([]);
  });
});
