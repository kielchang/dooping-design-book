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

export const 語意維度的堆疊: Story = {
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
            ✅ 狀態維度用 STATUS_SERIES——與徽章同一套語意
          </p>
          <div className="mb-2 flex gap-2">
            <Badge variant="success">{STATUS_LABEL.done}</Badge>
            <Badge variant="info">{STATUS_LABEL.confirmed}</Badge>
            <Badge variant="danger">{STATUS_LABEL.void}</Badge>
          </div>
          <StackedBar
            title="各單位狀態組成（語意色）"
            rows={rowsWith((s) => STATUS_SERIES[STATUS_TO_SERIES[s]])}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            「{STATUS_LABEL.done}」在徽章上是綠的，在圖表裡也是綠的——語意記憶不被拆掉。
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            🚫 同一份資料照序取 PALETTE——「{STATUS_LABEL.done}」變藍、與徽章打架
          </p>
          <StackedBar
            title="各單位狀態組成（誤：分類色）"
            rows={rowsWith((_s, i) => PALETTE[i])}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            第 2 層【身分】：colorByKey——「{units[1]}」在所有圖表、所有期別同一色
          </p>
          <BarChart
            title="依固定鍵清單取色"
            data={units.map((u) => ({ label: u, value: demoRecords.filter((r) => r.unit === u).length }))}
            color={colorByKey(units[1], units)}
            showValues
          />
          <p className="mt-1 text-xs text-muted-foreground">
            鍵清單是維度的定義（宿主宣告一次、所有圖表共用），不是當期資料的排序。
          </p>
        </div>
      </div>
    );
  },
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

// 互動 playground：中文 arg 三層映射（規範見治理章〈Story 撰寫慣例〉）。
// 圖表全是純 props，不需要 remount；資料出自 demo/generate 的確定性生成器。
// 驗收動線：資料點數拉到 0 看「無資料」；長條把點數拉超過類別上限看「其他（N 項）」封頂。
type 互動Args = {
  圖表類型: "長條" | "柏拉圖" | "趨勢" | "堆疊";
  資料點數: number;
  段數: number;
  顯示數值: boolean;
  類別上限: number;
  從零起算: boolean;
};

export const 互動: StoryObj<互動Args> = {
  args: {
    圖表類型: "長條",
    資料點數: 6,
    段數: 4,
    顯示數值: true,
    類別上限: 12,
    從零起算: true,
  },
  argTypes: {
    圖表類型: { control: "select", options: ["長條", "柏拉圖", "趨勢", "堆疊"] },
    資料點數: { control: { type: "range", min: 0, max: 30, step: 1 } },
    段數: { control: { type: "range", min: 1, max: 12, step: 1 }, if: { arg: "圖表類型", eq: "堆疊" } },
    顯示數值: { control: "boolean", if: { arg: "圖表類型", eq: "長條" } },
    類別上限: { control: { type: "range", min: 3, max: 12, step: 1 }, if: { arg: "圖表類型", eq: "長條" } },
    從零起算: { control: "boolean", if: { arg: "圖表類型", eq: "趨勢" } },
  },
  render: (a) => {
    const chart = () => {
      switch (a.圖表類型) {
        case "柏拉圖":
          return <Pareto data={makeSeries(a.資料點數)} title="集中度" valueFmt={(n) => formatNumber(n)} />;
        case "趨勢":
          // 趨勢的 x 軸必須是等距時間，所以用「第N期」而不是單位
          return (
            <TrendChart
              data={makeSeries(a.資料點數, { labelKind: "period" })}
              title="各期數值"
              zeroBased={a.從零起算}
              valueFmt={(n) => formatNumber(n)}
            />
          );
        case "堆疊":
          // 序列色要跨期穩定、由使用端指定——生成器不給色，story 端照序配 PALETTE
          return (
            <StackedBar
              rows={makeStackedRows(a.資料點數, a.段數).map((row) => ({
                ...row,
                segments: row.segments.map((s, ci) => ({ ...s, color: PALETTE[ci % PALETTE.length] })),
              }))}
              title="分類組成"
              valueFmt={(n) => formatNumber(n)}
            />
          );
        default:
          return (
            <BarChart
              data={makeSeries(a.資料點數)}
              title="各單位數值"
              showValues={a.顯示數值}
              maxItems={a.類別上限}
              valueFmt={(n) => formatNumber(n)}
            />
          );
      }
    };
    return <div className="max-w-2xl">{chart()}</div>;
  },
};
