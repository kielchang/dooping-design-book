// 文件站的流程圖：用元件庫自己的 GraphCanvas（readOnly）畫，不引入 mermaid。
// 理由與零截圖鐵律同源——圖是真元件，token 橋接讓深淺與六色相主題自動成立，
// 而且文件站因此多了一個 GraphCanvas 的驗收場景。
//
// 圖是**輔助**：每張圖旁的正文必須自己講完整個流程，拿掉圖也讀得懂
// （aria-label 只描述圖的主題，內容的文字等價由正文承擔）。
//
// 節點／連線資料就地宣告在這裡而不是 mdx：mdx 受 demo-data 守衛掃描
// （≥4 鍵的物件陣列會紅），book/src 不在它的掃描範圍，且流程結構是文件內容、
// 不是示範資料集。
import React, { type ReactNode } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import type { GraphNode, GraphEdge } from "@dooping/react";

/**
 * GraphCanvas 走 @xyflow/react，文件站原本只透過 StoryFrame 的 iframe 用它，
 * 沒有經過 Docusaurus 的 SSR。BrowserOnly＋函式內 require 讓它完全不進伺服器端
 * 建置，fallback 保留同高度避免版面跳動。
 */
function Flow({ nodes, edges, height = 300, label }: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  height?: number;
  label: string;
}) {
  const fallback = (
    <div
      className="flex items-center justify-center rounded-md border text-sm text-muted-foreground"
      style={{ height }}
    >
      流程圖載入中…
    </div>
  );
  return (
    <div style={{ margin: "1rem 0" }}>
      <BrowserOnly fallback={fallback}>
        {() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { GraphCanvas } = require("@dooping/react") as typeof import("@dooping/react");
          return <GraphCanvas nodes={nodes} edges={edges} readOnly height={height} aria-label={label} />;
        }}
      </BrowserOnly>
    </div>
  );
}

/** 取用方式選擇：非 React 走規範、React 新專案裝好裝滿、既有系統先只導 token。 */
export function FlowThreeWays(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "start", label: "要統一設計語言", position: { x: 0, y: 130 } },
    { id: "react", label: "宿主用 React？", position: { x: 200, y: 130 } },
    { id: "spec", label: "方式一：只讀規範自行實作", position: { x: 430, y: 250 }, category: 1 },
    { id: "fresh", label: "全新開發？", position: { x: 430, y: 70 } },
    { id: "full", label: "方式二＋三：token 與元件一起上", position: { x: 660, y: 10 }, category: 2 },
    { id: "token", label: "方式三：先只導 token", position: { x: 660, y: 140 }, category: 3 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "start", target: "react" },
    { id: "e2", source: "react", target: "spec", label: "不是" },
    { id: "e3", source: "react", target: "fresh", label: "是" },
    { id: "e4", source: "fresh", target: "full", label: "新專案" },
    { id: "e5", source: "fresh", target: "token", label: "既有系統" },
  ];
  return <Flow nodes={nodes} edges={edges} height={320} label="三種取用方式的選擇流程" />;
}

/** 導入三階段：token → 新畫面用元件 → 按需查模式；停在任何一階都合理。 */
export function FlowAdoptionStages(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "s1", label: "階段一：只導 token", position: { x: 0, y: 60 }, category: 1 },
    { id: "s2", label: "階段二：新畫面用元件", position: { x: 240, y: 60 }, category: 2 },
    { id: "s3", label: "階段三：遇到問題查模式", position: { x: 500, y: 60 }, category: 3 },
    { id: "stay", label: "就停在這裡，也完全合理", position: { x: 240, y: 180 } },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "s1", target: "s2", label: "團隊吃得下再前進" },
    { id: "e2", source: "s2", target: "s3" },
    { id: "e3", source: "s1", target: "stay" },
  ];
  return <Flow nodes={nodes} edges={edges} height={280} label="既有專案導入三階段的流程" />;
}

/** 跟上新版：訊號 → 讀 CHANGELOG → 對照台帳 → 依差距決定跟進、延後或偏離。 */
export function FlowStayingCurrent(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "sig", label: "收到新版訊號", position: { x: 0, y: 130 } },
    { id: "read", label: "讀 CHANGELOG 該則", position: { x: 190, y: 130 } },
    { id: "act", label: "有要我做的動作？", position: { x: 420, y: 130 } },
    { id: "done", label: "不需要動作", position: { x: 650, y: 250 } },
    { id: "ledger", label: "台帳裡抄過受影響項目？", position: { x: 650, y: 70 } },
    { id: "decide", label: "衡量差距與影響", position: { x: 920, y: 130 } },
    { id: "follow", label: "跟進更新", position: { x: 1150, y: 30 }, category: 1 },
    { id: "defer", label: "記台帳、延後跟進", position: { x: 1150, y: 130 }, category: 3 },
    { id: "diverge", label: "刻意偏離並寫下原因", position: { x: 1150, y: 230 }, category: 4 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "sig", target: "read" },
    { id: "e2", source: "read", target: "act" },
    { id: "e3", source: "act", target: "done", label: "沒有" },
    { id: "e4", source: "act", target: "ledger", label: "有" },
    { id: "e5", source: "ledger", target: "done", label: "沒抄過" },
    { id: "e6", source: "ledger", target: "decide", label: "抄過" },
    { id: "e7", source: "decide", target: "follow", label: "踩到同一個問題" },
    { id: "e8", source: "decide", target: "defer", label: "有用但不急" },
    { id: "e9", source: "decide", target: "diverge", label: "不打算採用" },
  ];
  return <Flow nodes={nodes} edges={edges} height={340} label="收到新版訊號後的判斷流程" />;
}

/** 新專案從頁面開始：列頁 → 標頁型 → 抄骨架與安裝集 → 照 Rules 驗收。 */
export function FlowPageFirstSteps(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "list", label: "列出所有畫面", position: { x: 0, y: 60 } },
    { id: "type", label: "每頁標上頁型", position: { x: 200, y: 60 }, category: 1 },
    { id: "copy", label: "抄骨架與最小安裝集", position: { x: 400, y: 60 }, category: 2 },
    { id: "check", label: "照各頁 Rules 驗收", position: { x: 640, y: 60 }, category: 3 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "list", target: "type" },
    { id: "e2", source: "type", target: "copy" },
    { id: "e3", source: "copy", target: "check" },
  ];
  return <Flow nodes={nodes} edges={edges} height={220} label="新專案從頁面開始規劃的三步" />;
}
