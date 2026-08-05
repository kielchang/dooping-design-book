import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Gantt } from "./gantt";
import { GraphCanvas } from "./graph-canvas";
import { Badge } from "./badge";
import { demoPhases, demoGraphNodes, demoGraphEdges } from "../demo/sample-data";

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
