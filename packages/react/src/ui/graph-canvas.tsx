import * as React from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "../lib/utils";

/**
 * 節點畫布（流程圖／關聯圖的薄封裝）。
 *
 * ## 為什麼是薄封裝，不是直接用 React Flow
 *
 * `@xyflow/react` 內部帶著 zustand——邊界守衛明文禁止狀態管理進元件庫
 * （「狀態管理屬於應用層」）。折衷是**把相依關在這一個檔案裡**：
 * 取用端與其他元件依賴 `<GraphCanvas>` 的領域 API（節點／連線），
 * 不依賴 React Flow 本身；升級或抽換的成本永遠只在這裡。
 * `tests/boundary.test.ts` 的隔離守衛保證這件事：任何第二個檔案 import 它就紅。
 *
 * ## 色彩：token 橋接層（ADR-0007 的色相預算）
 *
 * React Flow 自帶一整套 `--xy-*` 視覺變數。下面的 XY_BRIDGE 把它們逐一對映到
 * 本系統的語意 token，**逐層對位**：
 *
 * | 畫布元素 | 介面層 | 吃什麼 | 主題色相 |
 * | --- | --- | --- | --- |
 * | 畫布底、格點 | Layout | `--background`／`--border` | ✅ 帶色調中性 |
 * | 節點框、控制列、minimap | 表面 | `--card` 家族 | ✅ 帶色調中性 |
 * | 連線、handle | 結構 | `--muted-foreground`／`--border` | ❌ 中性 |
 * | hover／已選 | 互動 | 狀態層強度 | ❌ 中性 |
 * | 鍵盤聚焦 | 聚焦 | `--ring` | ❌ 中性 |
 *
 * 因為全部落在既有 token 上，深淺模式與六組色相主題**自動成立**，不用另外做。
 *
 * React Flow 原生把「選中」畫成節點外框陰影。本系統的規則相反：
 * **已選走狀態層**（`data-state="selected"` 的 20% 疊加，與資料表列同一套機制）、
 * **聚焦走「環」這條獨立通道**（ADR-0007）——所以兩者可以同時存在而不打架。
 * 自訂節點不吃 `--xy-node-*`（那組變數只套用在內建節點型別，逐行核對過
 * dist/style.css），表面與狀態都由 CategoryNode 自己畫。
 *
 * ## 用法
 *
 * 三個 React Flow 的地雷已經在這裡處理掉，取用端不必知道：
 * 樣式表（上面那行 import）、wrapper 高度（`height` prop，預設 480px）、
 * `nodeTypes` 定義在模組層（內聯會讓節點每次 render 重掛）。
 */

/** 對外的領域型別：刻意窄。取用端要進階能力時再從這裡擴充，而不是直接去拿 React Flow 的型別。 */
export interface GraphNode {
  id: string;
  /** 節點顯示文字 */
  label: string;
  position: { x: number; y: number };
  /**
   * 分類（1–8，對映 `--chart-N`）。顏色跟資料實體走、不跟狀態走——
   * 與圖表色票同一條規則：分類色與狀態語意脫鉤。省略＝中性節點。
   */
  category?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** 連上一條新線時回呼（唯讀模式下不會發生） */
  onConnect?: (edge: { source: string; target: string }) => void;
  /** 唯讀：不能拖節點、不能連線。文件內嵌示意用這個。 */
  readOnly?: boolean;
  /** 畫布高度。React Flow 的畫布高度為 0 時整個不可見，所以這裡強制有預設值。 */
  height?: number | string;
  /** 顯示 minimap（節點多到會捲動時才開，預設關） */
  minimap?: boolean;
  className?: string;
  "aria-label"?: string;
}

// ── token 橋接層 ──────────────────────────────────────────────
// React Flow 12.11.2 的 43 個可覆寫變數（從 npm tarball 的 dist/style.css 逐一核對，
// 不是憑文件抄的）。對映放在 wrapper 的 style 上而不是 tokens.css：
// build-css.mjs 的產物是框架中立的（原生 CSS、非 React 宿主都要能吃），
// 不該讓 token 層知道某個第三方 React 套件的存在。
//
// 疑問「為什麼不用 colorMode prop」：React Flow 的 colorMode 是它自己的深淺兩套值，
// 跟本系統的 token 是平行世界。橋接到 token 之後深淺與色相主題都自動跟上，
// colorMode 反而會蓋掉橋接，所以完全不用它。
const XY_BRIDGE: React.CSSProperties = {
  // Layout：畫布底與格點（帶色調中性，跟主題）
  "--xy-background-color": "hsl(var(--background))",
  "--xy-background-pattern-color": "hsl(var(--border))",
  // 表面：節點。注意這幾個只影響**內建**節點型別——本元件的 CategoryNode 自己畫表面，
  // 對映仍保留是為了「日後 API 若放行內建型別，它們不會突然變回 React Flow 預設色」。
  "--xy-node-background-color": "hsl(var(--card))",
  "--xy-node-color": "hsl(var(--card-foreground))",
  "--xy-node-border": "1px solid hsl(var(--border))",
  "--xy-node-border-radius": "var(--radius-md)",
  "--xy-node-group-background-color": "hsl(var(--muted) / 0.4)",
  "--xy-node-boxshadow-hover": "0 0 0 1px hsl(var(--border)), var(--shadow-md)",
  "--xy-node-boxshadow-selected": "0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))",
  // 結構：連線與 handle（中性，不吃主題）
  "--xy-edge-stroke": "hsl(var(--muted-foreground))",
  "--xy-edge-stroke-selected": "hsl(var(--foreground))",
  "--xy-edge-stroke-width": "1.5",
  "--xy-connectionline-stroke": "hsl(var(--muted-foreground))",
  "--xy-connectionline-stroke-width": "1.5",
  "--xy-edge-label-background-color": "hsl(var(--card))",
  "--xy-edge-label-color": "hsl(var(--card-foreground))",
  "--xy-handle-background-color": "hsl(var(--background))",
  "--xy-handle-border-color": "hsl(var(--muted-foreground))",
  // 控制列（表面家族；hover 由 React Flow 自己的 hover 變數吃狀態層近似值）
  "--xy-controls-button-background-color": "hsl(var(--card))",
  "--xy-controls-button-background-color-hover": "hsl(var(--muted))",
  "--xy-controls-button-color": "hsl(var(--foreground))",
  "--xy-controls-button-color-hover": "hsl(var(--foreground))",
  "--xy-controls-button-border-color": "hsl(var(--border))",
  "--xy-controls-box-shadow": "var(--shadow-sm)",
  // minimap（表面家族）
  "--xy-minimap-background-color": "hsl(var(--card))",
  "--xy-minimap-mask-background-color": "hsl(var(--background) / 0.6)",
  "--xy-minimap-mask-stroke-color": "hsl(var(--border))",
  "--xy-minimap-node-background-color": "hsl(var(--muted))",
  "--xy-minimap-node-stroke-color": "hsl(var(--border))",
  // 框選（中性：foreground 低 alpha ＋ 虛線邊，不用主題色）
  "--xy-selection-background-color": "hsl(var(--foreground) / 0.06)",
  "--xy-selection-border": "1px dashed hsl(var(--border))",
  // 縮放把手
  "--xy-resize-background-color": "hsl(var(--ring))",
  // attribution 底（MIT 授權要求保留連結；讓它坐在畫布底色上）
  "--xy-attribution-background-color": "hsl(var(--background) / 0.7)",
} as React.CSSProperties;

// ── 自訂節點 ──────────────────────────────────────────────────
// 定義在模組層：內聯在元件裡會讓 React Flow 視為新型別、整批節點重掛（地雷 #1）。
//
// 兩個從 dist/style.css 逐行核對出來的事實，決定了這裡的做法：
// 1. `--xy-node-*` 變數**只套用在內建節點型別**（node-default/input/output/group），
//    自訂型別要自己畫表面——所以這裡明確給 bg-card／border，不依賴橋接層。
// 2. React Flow 對 `.react-flow__node.selectable:focus` 寫死 `outline: none`——
//    鍵盤聚焦預設是隱形的。聚焦環由下面 FOCUS_CSS 補回（WCAG 2.4.7）。
//
// 互動沿用本系統的機制而不是另造：hover／已選都走 `state-layer`
// （data-state="selected" 的 20% 疊加，與資料表列完全同一套）。
// 分類色條：左側 3px，顏色編類別不編狀態（與圖表色票同一條規則）；
// 狀態要另外表達時走徽章或圖示，不把節點染色。
function CategoryNode({ data, selected }: NodeProps) {
  const category = (data as { category?: number }).category;
  const label = (data as { label?: string }).label;
  return (
    <div
      className="state-layer rounded-md border bg-card px-3 py-2 text-sm text-card-foreground"
      data-state={selected ? "selected" : undefined}
      style={category ? { borderLeft: `3px solid var(--chart-${category})` } : undefined}
    >
      <Handle type="target" position={Position.Left} />
      {label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const NODE_TYPES = { category: CategoryNode };

// 聚焦環補回：焦點落在 React Flow 的節點 wrapper 上（不是我們的 div），
// 而它被上游寫死 outline: none。雙層 shadow＝offset（背景色）＋ 環，
// 與全站「環一定要有 offset」同一個畫法——沒有 offset 的環貼著節點邊框，
// 對比要對邊框算而不是對背景算。
// 已選（20% 疊加）與聚焦（環）因此可以同時存在而不打架——ADR-0007 的用意。
const FOCUS_CSS = `
.dooping-graph .react-flow__node:focus-visible > .state-layer {
  box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
}`;

// ── 對映層：領域型別 ↔ React Flow 型別 ────────────────────────
const toFlowNodes = (ns: GraphNode[], readOnly: boolean): Node[] =>
  ns.map((n) => ({
    id: n.id,
    type: "category",
    position: n.position,
    data: { label: n.label, category: n.category },
    draggable: !readOnly,
    connectable: !readOnly,
  }));

const toFlowEdges = (es: GraphEdge[]): Edge[] =>
  es.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label }));

export function GraphCanvas({
  nodes,
  edges,
  onConnect,
  readOnly = false,
  height = 480,
  minimap = false,
  className,
  "aria-label": ariaLabel,
}: GraphCanvasProps) {
  const [flowNodes, , onNodesChange] = useNodesState(toFlowNodes(nodes, readOnly));
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(toFlowEdges(edges));

  const handleConnect: OnConnect = React.useCallback(
    (conn) => {
      if (readOnly || !conn.source || !conn.target) return;
      setFlowEdges((eds) => addEdge(conn, eds));
      onConnect?.({ source: conn.source, target: conn.target });
    },
    [readOnly, setFlowEdges, onConnect],
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("dooping-graph overflow-hidden rounded-md border", className)}
      style={{ height, ...XY_BRIDGE }}
    >
      <style>{FOCUS_CSS}</style>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={handleConnect}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={!readOnly} />
        {minimap && <MiniMap pannable zoomable />}
      </ReactFlow>
    </div>
  );
}
