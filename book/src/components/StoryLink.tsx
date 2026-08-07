import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

/**
 * 指向單一 story 的深連結——開**完整的 Storybook UI**，不是嵌入。
 *
 * 與 `<StoryFrame>` 的分工：StoryFrame 嵌的是 `iframe.html?viewMode=story`，
 * 那個視圖**沒有 Controls 面板**——讀者看得到手感，拉不了參數。
 * 「去 Storybook 把資料筆數拉到 0 看空狀態」這種動線，只有完整 UI 做得到，
 * 所以互動 playground 一律用這個元件連過去，而不是嵌進頁面。
 *
 * 路徑用 `useBaseUrl`（與 StoryFrame 的 openSrc 同一套邏輯）：
 * 正式站、preview 站都自動正確。刻意不用 `customFields.storybookUrl`——
 * 本機 build 沒設環境變數時它會組出不存在的網址。
 *
 * 已知的坑（同 StoryFrame）：`npm start` 的本機 dev server 沒有 Storybook 產物，
 * 點了是 404——本機看到 404 是正常的，不是壞了。不做 runtime 偵測
 * （偵測要多發一次探測請求，成本大於價值）；`target="_blank"` 讓 404
 * 不吞掉文件頁本身。id 的合法性由 tests/doc-hooks.test.ts 守衛。
 */
export function StoryLink({
  id,
  children,
}: {
  /** Storybook 的 story id，例如 `元件-資料-資料表-datatable--互動` */
  id: string;
  /** 連結文字。省略時顯示「在 Storybook 開啟」 */
  children?: React.ReactNode;
}) {
  const href = `${useBaseUrl("storybook/")}?path=/story/${encodeURIComponent(id)}`;
  return (
    <a className="story-link" href={href} target="_blank" rel="noreferrer">
      {children ?? "在 Storybook 開啟"}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
