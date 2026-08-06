import React, { useEffect, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";

/**
 * 嵌入一個 Storybook story，讓讀者不離開文件就能動手操作。
 *
 * 零截圖示意（`Placeholder` / `Spotlight` / `MockScreenFrame`）表達得了「該點哪裡」，
 * 表達不了「點下去的手感」——展開收合、切換狀態、輸入時的即時回饋。
 * 那時候嵌一個**真的元件庫元件**，不是仿製品、也不是圖片。
 *
 * ## story id 怎麼來
 *
 * Storybook 把 `meta.title` 與 export 名各自正規化後用 `--` 接起來：
 * 小寫化、把空白與符號換成 `-`、收合連續的 `-`。CJK 字元會原樣保留。
 * 所以 `title: "元件/資料/資料表 DataTable"` 的 `完整功能` 這一個 export，
 * id 就是 `元件-資料-資料表-datatable--完整功能`。
 *
 * 拿不準的時候不要用推導的——開 Storybook，網址列 `?path=/story/<id>` 那一段就是。
 * `npm run build-storybook` 產物裡的 `index.json` 也列出全部合法 id。
 *
 * ## 兩個已知的坑
 *
 * 1. **`npm start` 的本機 dev server 沒有 Storybook 產物**，iframe 會是 404。
 *    Storybook 是另一條建置線（`build-storybook -o book/build/storybook`），
 *    只有在建置過的站台上才是同層目錄。所以本機看到空白是正常的，不是壞了。
 * 2. **story 改名之後這裡不會報錯**，只會安靜地變成一塊空白。
 *    所以標頭刻意把 id 印出來、並附一個直接開新視窗的連結——
 *    壞掉的嵌入至少要看得出來壞在哪，而且讀者還有一條路走得過去。
 *    真正的解是 `tests/doc-hooks.test.ts`：比對文件引用的 id 與 stories
 *    推導出的合法 id 集合，引用不存在的 story 就紅。
 */
export function StoryFrame({
  id,
  title,
  height = 360,
}: {
  /** Storybook 的 story id，例如 `元件-資料-資料表-datatable--完整功能` */
  id: string;
  /** 標頭顯示的說明。省略時退回顯示 id */
  title?: string;
  /** iframe 高度（px）。內容被切到就加大 */
  height?: number;
}) {
  // iframe 是**獨立的 document**：文件站切深色動的是自己的 <html>，
  // 影響不到裡面的 Storybook——主題必須用 Storybook 的 globals 參數傳進去
  // （`&globals=theme:dark`，對建置產物實測過），否則深色頁面上會嵌著亮色框，
  // 同一頁的活範例（跟文件站主題）與嵌入（不跟）並排成兩種配色。
  //
  // 色相主題刻意**不傳**：文件站不設 data-color-theme（石墨），
  // Storybook 的 colorTheme 預設也是石墨，兩邊本來就一致。
  //
  // 掛載後才套用（Mockup 頁的 SSR 規則：初始畫面不能取決於瀏覽器環境）——
  // SSR 與首次渲染一律用預設淺色的 src，避免 hydration 不一致；
  // 淺色時不帶參數＝Storybook 預設，只有深色（與切換）才改 src 觸發重載。
  const { colorMode } = useColorMode();
  const [mode, setMode] = useState<"light" | "dark" | null>(null);
  useEffect(() => setMode(colorMode), [colorMode]);
  const themeParam = mode === "dark" ? "&globals=theme:dark" : "";

  const iframeSrc = `${useBaseUrl("storybook/iframe.html")}?id=${encodeURIComponent(id)}&viewMode=story${themeParam}`;
  const openSrc = `${useBaseUrl("storybook/")}?path=/story/${encodeURIComponent(id)}${themeParam}`;

  return (
    <div className="story-frame">
      <div className="story-frame-title">
        <span>{title ?? id}</span>
        {/* 開新視窗：iframe 空白時的逃生門，也給想放大看的人用 */}
        <a href={openSrc} target="_blank" rel="noreferrer">
          在 Storybook 開啟
        </a>
      </div>
      <iframe
        src={iframeSrc}
        height={height}
        loading="lazy"
        // iframe 沒有 title 的話，報讀器只會念出「框架」。
        title={title ? `可操作範例：${title}` : `可操作範例：${id}`}
      />
    </div>
  );
}
