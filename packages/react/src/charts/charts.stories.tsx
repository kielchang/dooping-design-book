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
import { PALETTE, type BarDatum } from "./base";
import { formatMoney, formatNumber } from "../lib/utils";
import { demoRecords } from "../demo/sample-data";

const meta: Meta = { title: "元件/資料/圖表 Charts" };
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
  render: () => {
    const [sel, setSel] = useState<number | undefined>();
    return (
      <div className="max-w-2xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">各單位金額（BarChart，點長條或進資料表鑽取）</p>
          <BarChart
            data={byUnit}
            title="各單位金額"
            showValues
            valueFmt={(n) => formatMoney(n)}
            onSelect={(i) => setSel(i === sel ? undefined : i)}
            selectedIndex={sel}
          />
          {sel != null && (
            <p className="mt-1 text-xs text-muted-foreground">
              已選：{byUnit[sel].label}——明細清單由宿主渲染，元件只回報 index
            </p>
          )}
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">集中度（Pareto，元件自行排序＋累積線）</p>
          <Pareto data={byUnit} title="各單位金額集中度" valueFmt={(n) => formatMoney(n)} />
        </div>
      </div>
    );
  },
};

export const 堆疊與圖例: Story = {
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
        <p className="text-sm font-medium">各單位的分類組成（StackedBar＋Legend）</p>
        <Legend items={cats.map((c, i) => ({ label: c, color: PALETTE[i] }))} />
        <StackedBar rows={rows} title="各單位分類組成" valueFmt={(n) => formatMoney(n)} />
      </div>
    );
  },
};

export const 趨勢與累積: Story = {
  render: () => {
    // 依建立週彙總（等距時間才可用折線）
    const weeks = new Map<string, number>();
    for (const r of demoRecords) {
      const day = Number(r.createdAt.slice(8, 10));
      const label = `${r.createdAt.slice(5, 7)}月${day <= 15 ? "上" : "下"}`;
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
          <p className="mb-1 text-sm font-medium">各期金額（TrendChart，zeroBased 預設開）</p>
          <TrendChart data={trend} title="各期金額" valueFmt={(n) => formatMoney(n)} />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">累積分布（LineChart，離對角線越遠越集中）</p>
          <LineChart points={points} title="金額累積分布" />
        </div>
      </div>
    );
  },
};

export const 散布與熱圖: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">數量 × 金額（Scatter，軸範圍取 min/max）</p>
        <Scatter
          points={demoRecords.map((r) => ({ x: r.qty, y: r.amount, label: r.id }))}
          title="數量與金額的關係"
          xLabel="數量"
          yLabel="金額"
          valueFmt={(n) => formatNumber(n)}
        />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">單位 × 分類（Heatmap，null＝無資料不是 0）</p>
        <Heatmap
          title="單位 × 分類金額"
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

export const 子彈圖: Story = {
  render: () => {
    const done = demoRecords.filter((r) => r.status === "done").reduce((s, r) => s + r.amount, 0);
    const all = demoRecords.reduce((s, r) => s + r.amount, 0);
    return (
      <div className="max-w-sm space-y-4">
        <Bullet label="已完成金額（目標＝上限）" value={done} target={all * 0.3} valueFmt={(n) => formatMoney(n)} />
        <Bullet label="批次數（未超出）" value={12} target={20} />
        <p className="text-xs text-muted-foreground">
          超出目標走 danger、未超出走 success——這是唯一使用狀態色的圖。
        </p>
      </div>
    );
  },
};
