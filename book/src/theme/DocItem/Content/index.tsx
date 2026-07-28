// DocItem/Content swizzle：每頁頂部加「列印此頁」。
// 搭配 custom.css 的 @media print，一鍵印出／另存 PDF 就是一份乾淨的規範文件——
// 設計規範最常見的落地方式仍然是「印出來貼在牆上」或「附在需求文件後面」。
import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): React.ReactElement {
  return (
    <>
      <div className="doc-print-bar">
        <button type="button" onClick={() => window.print()} title="列印或另存 PDF">🖨 列印此頁</button>
      </div>
      <Content {...props} />
    </>
  );
}
