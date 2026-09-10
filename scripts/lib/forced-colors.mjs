// 強制色彩模式（Windows 高對比）的焦點可見性檢查——verify-storybook 與 verify-host 共用。
//
// 為什麼要驗：強制色彩模式會移除 box-shadow，而元件的聚焦環（ring-*）本質上就是 box-shadow，
// 在那個模式下整個消失。Tailwind v3 的 outline-none 留了一條 2px 透明 outline，強制色彩會用系統色
// 把它畫出來，所以 v3 宿主「剛好」還看得見焦點；v4 的 outline-none 是 outline-style: none，連這條都沒了。
// tokens.css 因此補上 `@media (forced-colors: active) { :focus-visible { outline: 2px solid transparent !important } }`。
// 這裡驗它在真的瀏覽器裡生效：模擬強制色彩、用鍵盤 Tab 走過可聚焦元素，每一個的 outline 都不能是 none。
//
// 用鍵盤走而不是 element.focus()：:focus-visible 只保證在鍵盤導覽時成立。

/**
 * 在已載入的頁面上模擬強制色彩並按 Tab `steps` 次。
 * @returns {Promise<{ visited: number, fails: string[] }>} visited＝實際落到的可聚焦元素數（0 代表檢查空轉）
 */
export async function forcedColorsFocusFailures(page, steps = 8) {
  await page.emulateMedia({ forcedColors: "active" });
  const fails = [];
  let visited = 0;
  try {
    // 從文件開頭起算，避免上一次導覽殘留的焦點位置影響走訪順序
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    for (let i = 0; i < steps; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          label: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30),
          style: cs.outlineStyle,
          width: cs.outlineWidth,
          focusVisible: el.matches(":focus-visible"),
        };
      });
      if (!info) continue;
      visited++;
      if (info.focusVisible && (info.style === "none" || info.width === "0px"))
        fails.push(`<${info.tag}>「${info.label}」outline-style=${info.style}、outline-width=${info.width}`);
    }
  } finally {
    await page.emulateMedia({ forcedColors: "none" });
  }
  return { visited, fails };
}
