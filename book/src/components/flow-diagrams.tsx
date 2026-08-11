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
      Loading flow diagram…
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

/** Adoption choice: read the spec for non-React hosts, use the full stack for new React projects, or start with tokens. */
export function FlowThreeWays(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "start", label: "Standardize the design language", position: { x: 0, y: 130 } },
    { id: "react", label: "Does the host use React?", position: { x: 200, y: 130 } },
    { id: "spec", label: "Approach 1: read the spec and implement", position: { x: 430, y: 250 }, category: 1 },
    { id: "fresh", label: "New project?", position: { x: 430, y: 70 } },
    { id: "full", label: "Approaches 2 + 3: adopt tokens and components", position: { x: 660, y: 10 }, category: 2 },
    { id: "token", label: "Approach 3: start with tokens", position: { x: 660, y: 140 }, category: 3 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "start", target: "react" },
    { id: "e2", source: "react", target: "spec", label: "No" },
    { id: "e3", source: "react", target: "fresh", label: "Yes" },
    { id: "e4", source: "fresh", target: "full", label: "New project" },
    { id: "e5", source: "fresh", target: "token", label: "Existing system" },
  ];
  return <Flow nodes={nodes} edges={edges} height={320} label="Decision flow for three adoption approaches" />;
}

/** Three stages: tokens → components for new screens → patterns as needed; stopping at any stage is reasonable. */
export function FlowAdoptionStages(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "s1", label: "Stage 1: tokens only", position: { x: 0, y: 60 }, category: 1 },
    { id: "s2", label: "Stage 2: components for new screens", position: { x: 240, y: 60 }, category: 2 },
    { id: "s3", label: "Stage 3: consult patterns as problems arise", position: { x: 500, y: 60 }, category: 3 },
    { id: "stay", label: "Stopping here is completely reasonable", position: { x: 240, y: 180 } },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "s1", target: "s2", label: "Move forward when the team is ready" },
    { id: "e2", source: "s2", target: "s3" },
    { id: "e3", source: "s1", target: "stay" },
  ];
  return <Flow nodes={nodes} edges={edges} height={280} label="Three adoption stages for an existing project" />;
}

/** Staying current: signal → read the CHANGELOG → compare the ledger → follow, defer, or diverge. */
export function FlowStayingCurrent(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "sig", label: "New release signal", position: { x: 0, y: 130 } },
    { id: "read", label: "Read the CHANGELOG entry", position: { x: 190, y: 130 } },
    { id: "act", label: "Is there an action for me?", position: { x: 420, y: 130 } },
    { id: "done", label: "No action needed", position: { x: 650, y: 250 } },
    { id: "ledger", label: "Is the affected item in the ledger?", position: { x: 650, y: 70 } },
    { id: "decide", label: "Assess gap and impact", position: { x: 920, y: 130 } },
    { id: "follow", label: "Follow the update", position: { x: 1150, y: 30 }, category: 1 },
    { id: "defer", label: "Record in ledger and defer", position: { x: 1150, y: 130 }, category: 3 },
    { id: "diverge", label: "Intentionally diverge and record why", position: { x: 1150, y: 230 }, category: 4 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "sig", target: "read" },
    { id: "e2", source: "read", target: "act" },
    { id: "e3", source: "act", target: "done", label: "No" },
    { id: "e4", source: "act", target: "ledger", label: "Yes" },
    { id: "e5", source: "ledger", target: "done", label: "Not recorded" },
    { id: "e6", source: "ledger", target: "decide", label: "Recorded" },
    { id: "e7", source: "decide", target: "follow", label: "Same problem encountered" },
    { id: "e8", source: "decide", target: "defer", label: "Useful but not urgent" },
    { id: "e9", source: "decide", target: "diverge", label: "Will not adopt" },
  ];
  return <Flow nodes={nodes} edges={edges} height={340} label="Decision flow after receiving a new release signal" />;
}

/** Start a new project from its screens: list → label → copy → verify against the rules. */
export function FlowPageFirstSteps(): ReactNode {
  const nodes: GraphNode[] = [
    { id: "list", label: "List all screens", position: { x: 0, y: 60 } },
    { id: "type", label: "Label each screen with its page type", position: { x: 200, y: 60 }, category: 1 },
    { id: "copy", label: "Copy the skeleton and minimum install set", position: { x: 400, y: 60 }, category: 2 },
    { id: "check", label: "Verify against the page rules", position: { x: 640, y: 60 }, category: 3 },
  ];
  const edges: GraphEdge[] = [
    { id: "e1", source: "list", target: "type" },
    { id: "e2", source: "type", target: "copy" },
    { id: "e3", source: "copy", target: "check" },
  ];
  return <Flow nodes={nodes} edges={edges} height={220} label="Three steps to plan a new project from its screens" />;
}
