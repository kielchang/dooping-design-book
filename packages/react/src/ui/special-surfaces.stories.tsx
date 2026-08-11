import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Gantt } from "./gantt";
import { GraphCanvas } from "./graph-canvas";
import { Badge } from "./badge";
import { EmptyState } from "./empty-state";
import { demoPhases, demoGraphNodes, demoGraphEdges } from "../demo/sample-data";
import { makeGraph, makePhases } from "../demo/generate";

const meta: Meta = { title: "Components/Special surfaces/Timeline and graph canvas", id: "元件/特殊介面/時間軸・節點畫布" };
export default meta;
type Story = StoryObj;

export const 時間軸: Story = {
  name: "Timeline",
  render: function Render() {
    const [selected, setSelected] = React.useState<string | null>("P-02");
    return (
      <div className="max-w-4xl space-y-4">
        <Gantt
          items={demoPhases}
          selectedId={selected}
          onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
          aria-label="Timeline by item"
        />
        <p className="max-w-2xl text-xs text-muted-foreground">
          列與資料表列<strong>同一套互動</strong>：hover 6%、按住 14%、已選 20% 狀態層，
          已選的列日期文字自動換回正文色。長條顏色吃 <code>--chart-N</code>——
          顏色編<strong>類別</strong>不編狀態，甲案在時間軸與其他圖表上永遠同色。
          進度用「未完成段蓋一層背景色」表達：實色＝已完成、淡段＝剩餘，
          不換色相，所以對任何分類色與深淺模式都成立。
          今天線是<strong>中性</strong>的（前景色 50%）——結構標記不吃狀態色，
          用 info 藍會被讀成「這裡有提示」。
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          Delayed or attention-needed items <strong>do not turn the bar red</strong>; status uses a separate channel:
          <Badge variant="warning">Needs information</Badge>
          <Badge variant="danger">Overdue</Badge>
          — red area is reserved for real alerts.
        </div>
      </div>
    );
  },
};

export const 節點畫布: Story = {
  name: "Graph canvas",
  render: () => (
    <div className="max-w-4xl space-y-4">
      <GraphCanvas
        nodes={demoGraphNodes}
        edges={demoGraphEdges}
        height={360}
        aria-label="Phase progression flow"
      />
      <p className="max-w-2xl text-xs text-muted-foreground">
        <code>@xyflow/react</code> 的薄封裝——相依被隔離守衛關在一個檔案裡，
        其他元件與取用端只依賴 <code>&lt;GraphCanvas&gt;</code> 的領域 API。
        畫布底與節點吃帶色調中性（跟主題），連線與 handle 中性，
        已選＝狀態層 20%、鍵盤聚焦＝<code>--ring</code> 外環——兩者可疊加（ADR-0007）。
        左側色條沿用 <code>--chart-N</code>：與時間軸同一批資料實體、同一組顏色。
      </p>
    </div>
  ),
};

export const 節點畫布唯讀: Story = {
  name: "Graph canvas read-only",
  render: () => (
    <div className="max-w-4xl space-y-3">
      <GraphCanvas
        nodes={demoGraphNodes}
        edges={demoGraphEdges}
        height={300}
        readOnly
        aria-label="Phase progression flow (read-only)"
      />
      <p className="max-w-2xl text-xs text-muted-foreground">
        <code>readOnly</code>：不能拖、不能連線，仍可選取與縮放。文件內嵌示意用這個模式。
      </p>
    </div>
  ),
};

// ── 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）──
// 一個 meta 裝多個元件，所以命名用「⟨元件⟩_互動」形式。

/** 把生成的日期整批平移到今天附近——生成器保持確定性，平移邏輯留在 story。 */
function shiftToToday(phases: ReturnType<typeof makePhases>, spanDays: number) {
  const today = new Date();
  const anchor = new Date(today.getFullYear(), today.getMonth(), today.getDate() - Math.floor(spanDays / 2));
  const base = new Date(2024, 0, 8); // makePhases 的預設 dateStart
  const offset = Math.round((anchor.getTime() - base.getTime()) / 86_400_000);
  const shift = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + offset));
    return t.toISOString().slice(0, 10);
  };
  return phases.map((p) => ({ ...p, start: shift(p.start), end: shift(p.end) }));
}

type TimelineArgs = {
  itemCount: number;
  spanDays: 14 | 60 | 240;
  alignToday: boolean;
  showToday: boolean;
  labelWidth: number;
};

export const 時間軸_互動: StoryObj<TimelineArgs> = {
  name: "Timeline playground",
  args: { itemCount: 7, spanDays: 60, alignToday: false, showToday: true, labelWidth: 176 },
  argTypes: {
    itemCount: { control: { type: "range", min: 0, max: 40, step: 1 } },
    // 三檔對應刻度的三種粒度：≤21 天→日、≤120 天→週一、更長→月初
    spanDays: { control: "inline-radio", options: [14, 60, 240] },
    // 生成的日期固定在 2024（確定性），今天線預設不在視窗內——開這個把整批平移到今天附近
    alignToday: { control: "boolean" },
    showToday: { control: "boolean" },
    labelWidth: { control: { type: "range", min: 120, max: 280, step: 8 } },
  },
  render: function Render(a) {
    const [selected, setSelected] = React.useState<string | null>(null);
    const phases = React.useMemo(() => {
      const raw = makePhases(a.itemCount, { spanDays: a.spanDays });
      return a.alignToday ? shiftToToday(raw, a.spanDays) : raw;
    }, [a.itemCount, a.spanDays, a.alignToday]);
    // 空資料由宿主明說（Gantt 的視窗由資料推導，沒有資料就沒有視窗）
    if (a.itemCount === 0) {
      return (
        <div className="max-w-4xl">
          <EmptyState title="No items yet" hint="Increase item count to 1 or let the host provide a create entry point." />
        </div>
      );
    }
    return (
      <div className="max-w-4xl">
        <Gantt
          key={`${a.itemCount}-${a.spanDays}-${a.alignToday}`}
          items={phases}
          selectedId={selected}
          onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
          today={a.showToday}
          labelWidth={a.labelWidth}
          aria-label="Timeline by item (interactive)"
        />
      </div>
    );
  },
};

type GraphArgs = {
  nodeCount: number;
  edgeDensity: "Sparse" | "Medium" | "Dense";
  readOnly: boolean;
  showMinimap: boolean;
  canvasHeight: number;
};

const DENSITY = { Sparse: 1, Medium: 1.5, Dense: 2 } as const;

export const 節點畫布_互動: StoryObj<GraphArgs> = {
  name: "Graph canvas playground",
  args: { nodeCount: 5, edgeDensity: "Medium", readOnly: false, showMinimap: false, canvasHeight: 360 },
  argTypes: {
    nodeCount: { control: { type: "range", min: 0, max: 24, step: 1 } },
    edgeDensity: { control: "inline-radio", options: ["Sparse", "Medium", "Dense"] },
    readOnly: { control: "boolean" },
    showMinimap: { control: "boolean", description: "Enable when many nodes require scrolling" },
    canvasHeight: { control: { type: "range", min: 240, max: 600, step: 20 } },
  },
  render: (a) => {
    if (a.nodeCount === 0) {
      return (
        <div className="max-w-4xl">
          <EmptyState title="No nodes yet" hint="Increase node count to 1; the flow will be generated by layer." />
        </div>
      );
    }
    const { nodes, edges } = makeGraph(a.nodeCount, { density: DENSITY[a.edgeDensity] });
    return (
      <div className="max-w-4xl">
        <GraphCanvas
          // useNodesState 只吃初始值，nodes/edges 與 readOnly 都烙在初始節點上——必須 remount。
          // 高度與縮圖是活 prop，刻意不進 key
          key={`${a.nodeCount}-${a.edgeDensity}-${a.readOnly}`}
          nodes={nodes}
          edges={edges}
          readOnly={a.readOnly}
          minimap={a.showMinimap}
          height={a.canvasHeight}
          aria-label="Phase progression flow (interactive)"
        />
      </div>
    );
  },
};
