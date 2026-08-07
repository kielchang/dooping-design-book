import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Gantt } from "./gantt";
import { GraphCanvas } from "./graph-canvas";
import { Badge } from "./badge";
import { EmptyState } from "./empty-state";
import { demoPhases, demoGraphNodes, demoGraphEdges } from "../demo/sample-data";
import { makeGraph, makePhases } from "../demo/generate";

const meta: Meta = { title: "元件/特殊介面/時間軸・節點畫布" };
export default meta;
type Story = StoryObj;

export const 時間軸: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | null>("P-02");
    return (
      <div className="max-w-4xl space-y-4">
        <Gantt
          items={demoPhases}
          selectedId={selected}
          onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
          aria-label="各案時間軸"
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
          延誤或需注意的項目<strong>不把長條染紅</strong>，狀態走獨立通道：
          <Badge variant="warning">待補件</Badge>
          <Badge variant="danger">已逾期</Badge>
          ——紅色面積保留給真正的警報。
        </div>
      </div>
    );
  },
};

export const 節點畫布: Story = {
  render: () => (
    <div className="max-w-4xl space-y-4">
      <GraphCanvas
        nodes={demoGraphNodes}
        edges={demoGraphEdges}
        height={360}
        aria-label="階段推進流程"
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
  render: () => (
    <div className="max-w-4xl space-y-3">
      <GraphCanvas
        nodes={demoGraphNodes}
        edges={demoGraphEdges}
        height={300}
        readOnly
        aria-label="階段推進流程（唯讀）"
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

type 時間軸Args = {
  項目數: number;
  跨度天數: 14 | 60 | 240;
  對齊今天: boolean;
  顯示今天線: boolean;
  左欄寬: number;
};

export const 時間軸_互動: StoryObj<時間軸Args> = {
  args: { 項目數: 7, 跨度天數: 60, 對齊今天: false, 顯示今天線: true, 左欄寬: 176 },
  argTypes: {
    項目數: { control: { type: "range", min: 0, max: 40, step: 1 } },
    // 三檔對應刻度的三種粒度：≤21 天→日、≤120 天→週一、更長→月初
    跨度天數: { control: "inline-radio", options: [14, 60, 240] },
    // 生成的日期固定在 2024（確定性），今天線預設不在視窗內——開這個把整批平移到今天附近
    對齊今天: { control: "boolean" },
    顯示今天線: { control: "boolean" },
    左欄寬: { control: { type: "range", min: 120, max: 280, step: 8 } },
  },
  render: function Render(a) {
    const [selected, setSelected] = React.useState<string | null>(null);
    const phases = React.useMemo(() => {
      const raw = makePhases(a.項目數, { spanDays: a.跨度天數 });
      return a.對齊今天 ? shiftToToday(raw, a.跨度天數) : raw;
    }, [a.項目數, a.跨度天數, a.對齊今天]);
    // 空資料由宿主明說（Gantt 的視窗由資料推導，沒有資料就沒有視窗）
    if (a.項目數 === 0) {
      return (
        <div className="max-w-4xl">
          <EmptyState title="尚無項目" hint="把「項目數」拉回 1 以上，或由宿主提供建立入口。" />
        </div>
      );
    }
    return (
      <div className="max-w-4xl">
        <Gantt
          key={`${a.項目數}-${a.跨度天數}-${a.對齊今天}`}
          items={phases}
          selectedId={selected}
          onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
          today={a.顯示今天線}
          labelWidth={a.左欄寬}
          aria-label="各案時間軸（互動）"
        />
      </div>
    );
  },
};

type 節點畫布Args = {
  節點數: number;
  連線密度: "疏" | "中" | "密";
  唯讀: boolean;
  顯示縮圖: boolean;
  畫布高度: number;
};

const DENSITY = { 疏: 1, 中: 1.5, 密: 2 } as const;

export const 節點畫布_互動: StoryObj<節點畫布Args> = {
  args: { 節點數: 5, 連線密度: "中", 唯讀: false, 顯示縮圖: false, 畫布高度: 360 },
  argTypes: {
    節點數: { control: { type: "range", min: 0, max: 24, step: 1 } },
    連線密度: { control: "inline-radio", options: ["疏", "中", "密"] },
    唯讀: { control: "boolean" },
    顯示縮圖: { control: "boolean", description: "節點多到會捲動時才開" },
    畫布高度: { control: { type: "range", min: 240, max: 600, step: 20 } },
  },
  render: (a) => {
    if (a.節點數 === 0) {
      return (
        <div className="max-w-4xl">
          <EmptyState title="尚無節點" hint="把「節點數」拉回 1 以上，流程圖會依層生成。" />
        </div>
      );
    }
    const { nodes, edges } = makeGraph(a.節點數, { density: DENSITY[a.連線密度] });
    return (
      <div className="max-w-4xl">
        <GraphCanvas
          // useNodesState 只吃初始值，nodes/edges 與 readOnly 都烙在初始節點上——必須 remount。
          // 高度與縮圖是活 prop，刻意不進 key
          key={`${a.節點數}-${a.連線密度}-${a.唯讀}`}
          nodes={nodes}
          edges={edges}
          readOnly={a.唯讀}
          minimap={a.顯示縮圖}
          height={a.畫布高度}
          aria-label="階段推進流程（互動）"
        />
      </div>
    );
  },
};
