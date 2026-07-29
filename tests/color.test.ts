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
});
