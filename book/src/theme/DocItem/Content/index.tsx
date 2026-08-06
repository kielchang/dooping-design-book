// DocItem/Content swizzle：每頁頂部加「列印此頁」與「回報這一頁」。
// 列印搭配 custom.css 的 @media print，一鍵印出／另存 PDF 就是一份乾淨的規範文件——
// 設計規範最常見的落地方式仍然是「印出來貼在牆上」或「附在需求文件後面」。
// 回報鈕把目前頁面網址預填進 Bug 表單（bug.yml 的 `page` 欄位）——
// 讀者發現規範問題的當下，畫面上就要有可點的出口，不必自己去找 issue 頁。
import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useLocation } from "@docusaurus/router";

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  // pathname 已含 baseUrl（本地 /、正式站 /dooping-design-book/）
  const pageUrl = siteConfig.url + pathname;
  const reportHref =
    "https://github.com/kielchang/dooping-design-book/issues/new?template=bug.yml" +
    `&title=${encodeURIComponent(`[規範頁] ${pathname}`)}` +
    `&page=${encodeURIComponent(pageUrl)}`;
  return (
    <>
      <div className="doc-print-bar">
        <a href={reportHref} target="_blank" rel="noopener noreferrer" title="開 Bug 表單，自動帶入本頁網址">
          💬 回報這一頁
        </a>
        <button type="button" onClick={() => window.print()} title="列印或另存 PDF">🖨 列印此頁</button>
      </div>
      <Content {...props} />
    </>
  );
}
