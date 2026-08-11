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
          Rows use<strong> the same interaction model as the data table</strong>: hover 6%, pressed 14%, selected 20% state layers,
          with selected-row dates returning to body text color. Bars use <code>--chart-N</code>—
          color encodes<strong> category</strong>, not status, so Alpha Phase 1 is always the same color across the timeline and charts.
          Progress uses a background layer for the unfinished segment: solid means complete and tinted means remaining.
          It never changes hue, so it works across categories and light/dark modes.
          The today line is<strong> neutral</strong> (foreground at 50%): structural markers do not consume status colors,
          because an info-blue line would read as “there is an alert here.”
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
        <code>@xyflow/react</code> is wrapped thinly, with the dependency isolated behind one guarded file;
        other components and consumers depend only on the <code>&lt;GraphCanvas&gt;</code> domain API.
        The canvas and nodes use tinted neutrals that follow the theme, while connections and handles stay neutral.
        Selected is a 20% state layer and keyboard focus is a <code>--ring</code> outline; they can stack (ADR-0007).
        The left color rail uses <code>--chart-N</code>, keeping the same entities and colors as the timeline.
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
        <code>readOnly</code>: dragging and connecting are disabled, while selection and zoom remain available.
        Embedded documentation illustrations use this mode.
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
