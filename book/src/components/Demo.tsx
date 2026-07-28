import React, { type ReactNode } from "react";

/** 活範例外框：文件裡的每個範例都是**真元件**，不是圖片。 */
export function Demo({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="demo">
      <div className="demo-title">{title ?? ""}</div>
      <div className="demo-body">{children}</div>
    </div>
  );
}

/** 規範條目：做什麼 / 不做什麼。成對出現才有資訊量——只講「要怎麼做」的規範沒人記得住。 */
export function Rules({ children }: { children: ReactNode }) {
  return <div className="rule-grid">{children}</div>;
}
export function Do({ children }: { children: ReactNode }) {
  return <div className="rule-do"><strong>✅ 這樣做</strong>{children}</div>;
}
export function Dont({ children }: { children: ReactNode }) {
  return <div className="rule-dont"><strong>🚫 不要這樣</strong>{children}</div>;
}
