import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./bar-chart";
import { Pareto } from "./pareto";
import { StackedBar, type StackedBarRow } from "./stacked-bar";
import { TrendChart } from "./trend-chart";
import { Bullet } from "./bullet";
import { Scatter } from "./scatter";
import { Heatmap } from "./heatmap";
import { LineChart } from "./line-chart";
import { Legend } from "./legend";
import { PALETTE, STATUS_SERIES, colorByKey, type BarDatum } from "./base";
import { Badge } from "../ui/badge";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoRecords, STATUS_LABEL } from "../demo/sample-data";
import { makeSeries, makeStackedRows } from "../demo/generate";

const meta: Meta = { title: "Components/Data/Charts", id: "元件/資料/圖表-charts" };
export default meta;
type Story = StoryObj;

// 全部資料由 demoRecords 彙總而來（示範資料單一來源守衛）。
// 圖表資料形狀只有 {label, value}——彙總邏輯屬於宿主，元件只吃結果。
const sumBy = (key: "unit" | "category"): BarDatum[] => {
  const m = new Map<string, number>();
  for (const r of demoRecords) m.set(r[key], (m.get(r[key]) ?? 0) + r.amount);
  return [...m.entries()].map(([label, value]) => ({ label, value }));
};

const byUnit = sumBy("unit");

export const 長條與柏拉圖: Story = {
  name: "Bar and Pareto",
  render: () => {
    const [sel, setSel] = useState<number | undefined>();
    return (
      <div className="max-w-2xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">Amount by unit (BarChart; select a bar to drill into the table)</p>
          <BarChart
            data={byUnit}
            title="Amount by unit"
            showValues
            valueFmt={(n) => formatMoney(n)}
            onSelect={(i) => setSel(i === sel ? undefined : i)}
            selectedIndex={sel}
          />
          {sel != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              Selected: {byUnit[sel].label} — the host renders the detail list; the component only reports the index
            </p>
          )}
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Concentration (Pareto sorts and draws the cumulative line)</p>
          <Pareto data={byUnit} title="Amount concentration by unit" valueFmt={(n) => formatMoney(n)} />
        </div>
      </div>
    );
  },
};

export const 堆疊與圖例: Story = {
  name: "Stacked bars and legend",
  render: () => {
    const rows: StackedBarRow[] = [...new Set(demoRecords.map((r) => r.unit))].map((unit) => ({
      label: unit,
      segments: [...new Set(demoRecords.map((r) => r.category))].map((cat, ci) => ({
        label: cat,
        value: demoRecords
          .filter((r) => r.unit === unit && r.category === cat)
          .reduce((s, r) => s + r.amount, 0),
        color: PALETTE[ci],
      })),
    }));
    const cats = [...new Set(demoRecords.map((r) => r.category))];
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">Category composition by unit (StackedBar + Legend)</p>
        <Legend items={cats.map((c, i) => ({ label: c, color: PALETTE[i] }))} />
        <StackedBar rows={rows} title="Category composition by unit" valueFmt={(n) => formatMoney(n)} />
      </div>
    );
  },
};

export const 趨勢與累積: Story = {
  name: "Trend and cumulative distribution",
  render: () => {
    // 依建立週彙總（等距時間才可用折線）
    const weeks = new Map<string, number>();
    for (const r of demoRecords) {
      const day = Number(r.createdAt.slice(8, 10));
      const label = `${r.createdAt.slice(5, 7)}-${day <= 15 ? "01" : "16"}`;
      weeks.set(label, (weeks.get(label) ?? 0) + r.amount);
    }
    const trend = [...weeks.entries()].map(([label, value]) => ({ label, value }));

    // 累積分布：金額由大到小的累積佔比（前 20% 的紀錄佔多少金額）
    const sorted = [...demoRecords].sort((a, b) => b.amount - a.amount);
    const total = sorted.reduce((s, r) => s + r.amount, 0);
    let acc = 0;
    const points = sorted.map((r, i) => ({
      x: (i + 1) / sorted.length,
      y: (acc += r.amount) / total,
    }));

    return (
      <div className="max-w-2xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">Amount by period (TrendChart, zero-based by default)</p>
          <TrendChart data={trend} title="Amount by period" valueFmt={(n) => formatMoney(n)} />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Cumulative distribution (LineChart; farther from the diagonal means more concentration)</p>
          <LineChart points={points} title="Cumulative amount distribution" />
        </div>
      </div>
    );
  },
};

export const 散布與熱圖: Story = {
  name: "Scatter and heatmap",
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">Quantity × amount (Scatter; axes use min/max)</p>
        <Scatter
          points={demoRecords.map((r) => ({ x: r.qty, y: r.amount, label: r.id }))}
          title="Relationship between quantity and amount"
          xLabel="Quantity"
          yLabel="Amount"
          valueFmt={(n) => formatNumber(n)}
        />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Unit × category (Heatmap; null means no data, not zero)</p>
        <Heatmap
          title="Amount by unit and category"
          rowLabels={[...new Set(demoRecords.map((r) => r.unit))]}
          colLabels={[...new Set(demoRecords.map((r) => r.category))]}
          cells={[...new Set(demoRecords.map((r) => r.unit))].map((unit) =>
            [...new Set(demoRecords.map((r) => r.category))].map((cat) => {
              const hit = demoRecords.filter((r) => r.unit === unit && r.category === cat);
              return hit.length ? hit.reduce((s, r) => s + r.amount, 0) : null;
            }),
          )}
          fmt={(n) => formatNumber(Math.round(n / 1000)) + "K"}
        />
      </div>
    </div>
  ),
};

export const 語意維度的堆疊: Story = {
  name: "Semantic status colors",
  render: () => {
    // 維度＝狀態：這不是「分類」，是系統已有語意色的維度（判斷樹第 1 層）
    const STATUS_TO_SERIES = { done: "success", confirmed: "info", draft: "muted", void: "danger" } as const;
    const units = [...new Set(demoRecords.map((r) => r.unit))].slice(0, 4);
    const rowsWith = (color: (s: keyof typeof STATUS_TO_SERIES, i: number) => string) =>
      units.map((unit) => ({
        label: unit,
        segments: (Object.keys(STATUS_TO_SERIES) as (keyof typeof STATUS_TO_SERIES)[]).map((s, i) => ({
          label: STATUS_LABEL[s],
          value: demoRecords.filter((r) => r.unit === unit && r.status === s).length,
          color: color(s, i),
        })),
      }));

    return (
      <div className="max-w-xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">
            ✅ Status uses STATUS_SERIES—the same semantic colors as badges
          </p>
          <div className="mb-2 flex gap-2">
            <Badge variant="success">{STATUS_LABEL.done}</Badge>
            <Badge variant="info">{STATUS_LABEL.confirmed}</Badge>
            <Badge variant="danger">{STATUS_LABEL.void}</Badge>
          </div>
          <StackedBar
            title="Status by unit (semantic colors)"
            rows={rowsWith((s) => STATUS_SERIES[STATUS_TO_SERIES[s]])}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            “{STATUS_LABEL.done}” is green in the badge and in the chart—the semantic memory stays consistent.
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            🚫 Applying PALETTE by position turns “{STATUS_LABEL.done}” blue and conflicts with the badge
          </p>
          <StackedBar
            title="Status by unit (incorrect category colors)"
            rows={rowsWith((_s, i) => PALETTE[i])}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            Layer 2, identity: colorByKey—“{units[1]}” keeps one color across every chart and period
          </p>
          <BarChart
            title="Color from the fixed key list"
            data={units.map((u) => ({ label: u, value: demoRecords.filter((r) => r.unit === u).length }))}
            color={colorByKey(units[1], units)}
            showValues
          />
          <p className="mt-1 text-xs text-muted-foreground">
            The key list defines the dimension (declared once by the host and shared by every chart), not the current data order.
          </p>
        </div>
      </div>
    );
  },
};

export const 子彈圖: Story = {
  name: "Bullet chart",
  render: () => {
    const done = demoRecords.filter((r) => r.status === "done").reduce((s, r) => s + r.amount, 0);
    const all = demoRecords.reduce((s, r) => s + r.amount, 0);
    return (
      <div className="max-w-sm space-y-4">
        <Bullet label="Completed amount (target = limit)" value={done} target={all * 0.3} valueFmt={(n) => formatMoney(n)} />
        <Bullet label="Batch count (within target)" value={12} target={20} />
        <p className="text-xs text-muted-foreground">
          Over target uses danger and within target uses success—the only chart that uses status colors.
        </p>
      </div>
    );
  },
};

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 圖表全是純 props，不需要 remount；資料出自 demo/generate 的確定性生成器。
// 驗收動線：資料點數拉到 0 看「無資料」；長條把點數拉超過類別上限看「其他（N 項）」封頂。
type InteractiveArgs = {
  chartType: "Bar" | "Pareto" | "Trend" | "Stacked";
  dataPoints: number;
  segments: number;
  showValues: boolean;
  itemLimit: number;
  zeroBased: boolean;
};

export const 互動: StoryObj<InteractiveArgs> = {
  name: "Interactive playground",
  args: {
    chartType: "Bar",
    dataPoints: 6,
    segments: 4,
    showValues: true,
    itemLimit: 12,
    zeroBased: true,
  },
  argTypes: {
    chartType: { control: "select", options: ["Bar", "Pareto", "Trend", "Stacked"] },
    dataPoints: { control: { type: "range", min: 0, max: 30, step: 1 } },
    segments: { control: { type: "range", min: 1, max: 12, step: 1 }, if: { arg: "chartType", eq: "Stacked" } },
    showValues: { control: "boolean", if: { arg: "chartType", eq: "Bar" } },
    itemLimit: { control: { type: "range", min: 3, max: 12, step: 1 }, if: { arg: "chartType", eq: "Bar" } },
    zeroBased: { control: "boolean", if: { arg: "chartType", eq: "Trend" } },
  },
  render: (a) => {
    const chart = () => {
      switch (a.chartType) {
        case "Pareto":
          return <Pareto data={makeSeries(a.dataPoints)} title="Concentration" valueFmt={(n) => formatNumber(n)} />;
        case "Trend":
          return (
            <TrendChart
              data={makeSeries(a.dataPoints, { labelKind: "period" })}
              title="Values by period"
              zeroBased={a.zeroBased}
              valueFmt={(n) => formatNumber(n)}
            />
          );
        case "Stacked":
          return (
            <StackedBar
              rows={makeStackedRows(a.dataPoints, a.segments).map((row) => ({
                ...row,
                segments: row.segments.map((s, ci) => ({ ...s, color: PALETTE[ci % PALETTE.length] })),
              }))}
              title="Category composition"
              valueFmt={(n) => formatNumber(n)}
            />
          );
        default:
          return (
            <BarChart
              data={makeSeries(a.dataPoints)}
              title="Values by unit"
              showValues={a.showValues}
              maxItems={a.itemLimit}
              valueFmt={(n) => formatNumber(n)}
            />
          );
      }
    };
    return <div className="max-w-2xl">{chart()}</div>;
  },
};
