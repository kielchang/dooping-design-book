// 色彩守衛：六組色相主題 × 淺深兩模式的對比與色覺障礙門檻。
//
// 檢查邏輯放在 scripts/verify-color.mjs（也可以單獨跑來看完整報告），
// 這裡只把它接進 `npm test`，讓它跟其他守衛一起擋 PR。
//
// 為什麼色彩需要專門的守衛：它會**安靜地**失效。改一個背景值、加一個主題、
// 調一階卡片底色——畫面不會壞、型別不會錯、其他測試不會紅，只有對比悄悄掉到門檻以下。
// 這一版就是這樣抓到已釋出版本裡的 WCAG AA 違規：Badge 的 warning 變體在深色模式下
// 白字只有 1.99:1，而它已經這樣釋出了。
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error -- 純 JS 驗收腳本，與 CLI 共用同一份檢查邏輯
import { runChecks } from "../scripts/verify-color.mjs";

const { fail, warn, stats } = runChecks() as {
  fail: string[];
  warn: string[];
  stats: {
    themes: Record<string, { brandText: number; subtleText: number; ring: number; nearestStatusD: number }>;
    chart: Record<string, { worst: number; lightnessRange: number; minContrast: number }>;
  };
};

describe("色彩", () => {
  it("沒有任何不合格項（門檻見 scripts/verify-color.mjs）", () => {
    expect(fail, `\n${fail.join("\n")}\n`).toEqual([]);
  });

  it("六組色相主題都在", () => {
    expect(Object.keys(stats.themes)).toHaveLength(12); // 6 主題 × 2 模式
  });

  it("每組主題的 brand 與 brand-subtle 文字都過 4.5:1", () => {
    for (const [tag, s] of Object.entries(stats.themes)) {
      expect(s.brandText, `${tag} brand 文字`).toBeGreaterThanOrEqual(4.5);
      expect(s.subtleText, `${tag} subtle 文字`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("每組主題的 ring 對該模式最亮表面都過 3:1（WCAG 1.4.11 非文字）", () => {
    for (const [tag, s] of Object.entries(stats.themes)) {
      expect(s.ring, `${tag} ring`).toBeGreaterThanOrEqual(3);
    }
  });

  // 主題色如果看起來像某個狀態色，使用者會停止把那個顏色讀成狀態。
  // 這條擋掉過一組候選：松綠 178° 距 success 162° 只有 16°，量出來 ΔE00 17.4，
  // 數字過得了但確實最像狀態色，因此沒有收進預設清單。
  it("每組主題的 brand 與最近的狀態色至少差 ΔE00 12", () => {
    for (const [tag, s] of Object.entries(stats.themes)) {
      expect(s.nearestStatusD, `${tag} brand 與最近狀態色`).toBeGreaterThanOrEqual(12);
    }
  });

  // 這是上一版的實際缺陷：8 色裡 6 色淺深共用值，把 L 鎖進 [0.49,0.67] 的窄帶，
  // 最差一對在紅綠色盲下只有 ΔE00 2.6——實質同色。
  it("圖表色票任兩色在紅綠色盲下都不低於 ΔE00 10", () => {
    for (const [mode, s] of Object.entries(stats.chart)) {
      expect(s.worst, `${mode} 最差對`).toBeGreaterThanOrEqual(10);
    }
  });

  it("圖表色票有足夠的明度分佈（二色覺者靠明度分辨）", () => {
    for (const [mode, s] of Object.entries(stats.chart)) {
      expect(s.lightnessRange, `${mode} L* 全距`).toBeGreaterThan(28);
    }
  });

  it("每個圖表色對頁面底色都過 3:1", () => {
    for (const [mode, s] of Object.entries(stats.chart)) {
      expect(s.minContrast, `${mode} 最低對比`).toBeGreaterThanOrEqual(3);
    }
  });

  // 警告不擋 PR，但數量爆增通常代表有人動了背景或加了主題卻沒重新生成。
  it("警告數量沒有失控", () => {
    expect(warn.length, `\n${warn.join("\n")}\n`).toBeLessThanOrEqual(15);
  });

  // 這一條擋的不是顏色，是**畫法**：`ring-offset` 決定聚焦環貼在誰身上。
  //
  // 沒有 offset 時環直接畫在元件邊框外緣，於是它的對比要對「邊框」算。
  // 實測環對 danger 邊框在深色下只有 1.04:1——不合格欄位一變紅框，聚焦環當場隱形。
  // 有 offset 時中間隔一圈背景色，環是對「背景」算，也就是上面那些 3:1 的數字才算數。
  it("用了 ring-ring 的元件都必須有 ring-offset（否則環會貼在邊框上）", () => {
    const dir = fileURLToPath(new URL("../packages/react/src/ui", import.meta.url));
    const offenders: string[] = [];
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".tsx") && !n.includes(".stories."))) {
      const src = readFileSync(join(dir, f), "utf8");
      if (src.includes("ring-ring") && !src.includes("ring-offset")) offenders.push(f);
    }
    expect(offenders, `這些元件的聚焦環沒有 offset：${offenders.join(", ")}`).toEqual([]);
  });

  // 下面兩條與 ring-offset 那條同類：擋的是**畫法**，不是顏色值。
  // verify-color 驗的是「狀態層的三階拉不拉得開」，但它看不到元件有沒有真的用上狀態層——
  // 一個還寫著 `hover:bg-accent` 的元件，門檻全綠而畫面上依然是舊的 ΔE00 1.6。
  const uiFiles = () => {
    const dir = fileURLToPath(new URL("../packages/react/src/ui", import.meta.url));
    return readdirSync(dir)
      .filter((n) => n.endsWith(".tsx") && !n.includes(".stories."))
      .map((n) => [n, readFileSync(join(dir, n), "utf8")] as const);
  };

  it("元件不得再用 hover:bg-accent／hover:bg-muted 當互動回饋", () => {
    // `--accent`、`--muted`、`--secondary` 目前是同一個值，於是「被 hover 的列」與
    // 「斑馬列」「唯讀區」完全同色——換色就是換不掉的那種失效。互動回饋改走狀態層。
    // 例外：data-table 的欄寬把手用 `hover:bg-primary/40`，那是「讓透明的控制項現形」，
    // 不是幫既有表面加一階，狀態層在它上面沒有東西可疊。
    const offenders: string[] = [];
    for (const [name, src] of uiFiles()) {
      for (const m of src.matchAll(/hover:bg-(accent|muted)\b\S*/g)) offenders.push(`${name}: ${m[0]}`);
    }
    expect(offenders, `改走 state-layer：${offenders.join("、")}`).toEqual([]);
  });

  it("狀態徽章的預設變體必須走淡底層，不得用實色填底", () => {
    // 實色填底會讓一排徽章有兩種極性：success／warning／info 的前景是同色相深墨、
    // danger 的是反白，底色 L* 全距 23.5。眼睛把極性反轉讀成「不同種類」而不是
    // 「不同嚴重度」。實色只保留給 `intensity="high"`，走 compoundVariants。
    const src = readFileSync(
      fileURLToPath(new URL("../packages/react/src/ui/badge.tsx", import.meta.url)),
      "utf8",
    );
    // 只看 `variant:` 那一段（compoundVariants 裡的實色是刻意的）
    const variantBlock = src.slice(src.indexOf("variant: {"), src.indexOf("intensity:"));
    const offenders = ["success", "warning", "info", "danger"].filter((s) =>
      new RegExp(`bg-${s}\\b(?!-subtle)`).test(variantBlock),
    );
    expect(offenders, `這些變體還在用實色填底：${offenders.join("、")}`).toEqual([]);
  });

  it("用了 state-layer 的元件不得同時寫 transition-colors（會蓋掉狀態層的過渡）", () => {
    // Tailwind 的 utility 排在 tokens.css 之後，`transition-colors` 這個簡寫會覆寫
    // `.state-layer` 的 transition-property，狀態層就只會瞬間切換而不是淡入。
    // `.state-layer` 自己的 transition 已經涵蓋 color／background-color／border-color，
    // 拿掉那個 utility 不會少任何東西。
    const offenders: string[] = [];
    for (const [name, src] of uiFiles()) {
      for (const line of src.split("\n")) {
        if (line.includes("//")) continue; // 註解裡提到這兩個詞不算
        if (line.includes("state-layer") && line.includes("transition-colors")) offenders.push(`${name}: ${line.trim().slice(0, 60)}…`);
      }
    }
    expect(offenders, `拿掉 transition-colors：${offenders.join("、")}`).toEqual([]);
  });
});
