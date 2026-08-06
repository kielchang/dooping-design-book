import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Delta } from "../ui/delta";
import { SegGroup } from "../ui/seg-group";
import { TrendChart } from "../charts/trend-chart";
import { StackedBar, type StackedBarRow } from "../charts/stacked-bar";
import { STATUS_SERIES } from "../charts/base";
import { formatMoney, formatNumber, formatPercent } from "../lib/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord, type RecordStatus } from "../demo/sample-data";

// 儀表板的組成規格：KPI 磚列 → 圖表區，期間在頁首「一處控全頁」。
// 儀表板唯讀：回答「狀況如何」，不放寫入動作（待辦是工作台的事）。
const meta: Meta = { title: "頁面/儀表板" };
export default meta;
type Story = StoryObj;

const PERIODS = [
  { value: "2024-01", label: "一月" },
  { value: "2024-02", label: "二月" },
  { value: "all", label: "全部" },
];

// 狀態 → 語意系列的對映（判斷樹第 1 層：維度是狀態就用語意色，不照序取分類色）
const STATUS_TO_SERIES: Record<RecordStatus, keyof typeof STATUS_SERIES> = {
  done: "success",
  confirmed: "info",
  draft: "muted",
  void: "danger",
};

const metric = (rows: DemoRecord[]) => {
  const done = rows.filter((r) => r.status === "done").length;
  return {
    amount: rows.reduce((s, r) => s + r.amount, 0),
    done,
    rate: rows.length ? done / rows.length : 0,
    open: rows.filter((r) => r.status === "draft" || r.status === "confirmed").length,
  };
};

function Kpi({ label, value, delta }: { label: string; value: string; delta?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
        <p className="text-sm">{delta ?? <span className="text-muted-foreground">—</span>}</p>
      </CardContent>
    </Card>
  );
}

export const 典型組成: Story = {
  render: function Render() {
    const [period, setPeriod] = useState("2024-02");
    const cur = metric(demoRecords.filter((r) => period === "all" || r.createdAt.startsWith(period)));
    // 只有「二月」有上一期可比；沒得比就不硬擠一個數字出來
    const prev = period === "2024-02"
      ? metric(demoRecords.filter((r) => r.createdAt.startsWith("2024-01")))
      : undefined;

    // 各期金額：依上／下半月彙總（等距期間才可用折線）
    const buckets = new Map<string, number>();
    for (const r of demoRecords) {
      const day = Number(r.createdAt.slice(8, 10));
      const label = `${Number(r.createdAt.slice(5, 7))}月${day <= 15 ? "上" : "下"}`;
      buckets.set(label, (buckets.get(label) ?? 0) + r.amount);
    }
    const trend = [...buckets.entries()].map(([label, value]) => ({ label, value }));

    // 各單位狀態組成：維度是狀態 → STATUS_SERIES（與徽章同一套語意）
    const stacked: StackedBarRow[] = [...new Set(demoRecords.map((r) => r.unit))].map((unit) => ({
      label: unit,
      segments: (Object.keys(STATUS_TO_SERIES) as RecordStatus[]).map((s) => ({
        label: STATUS_LABEL[s],
        value: demoRecords.filter(
          (r) => r.unit === unit && r.status === s && (period === "all" || r.createdAt.startsWith(period)),
        ).length,
        color: STATUS_SERIES[STATUS_TO_SERIES[s]],
      })),
    }));

    const periodLabel = PERIODS.find((p) => p.value === period)?.label;
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：標題＋期間切換。期間只在這裡出現一次，控整頁 */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">成效總覽</h1>
            <p className="text-sm text-muted-foreground">資料期間：{periodLabel}・更新於 2024-02-07</p>
          </div>
          <SegGroup label="期間" options={PERIODS} value={period} onPick={setPeriod} />
        </div>

        {/* KPI 磚列：數字＋期間標籤＋與上期的變異（三重編碼），一排 3–5 磚 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label={`總金額（${periodLabel}）`}
            value={formatMoney(cur.amount)}
            delta={prev && <Delta value={cur.amount - prev.amount} posLabel="增加 " negLabel="減少 " format={formatMoney} />}
          />
          <Kpi
            label={`完成筆數（${periodLabel}）`}
            value={formatNumber(cur.done)}
            delta={prev && <Delta value={cur.done - prev.done} posLabel="增加 " negLabel="減少 " format={(n) => `${formatNumber(n)} 筆`} />}
          />
          <Kpi
            label={`完成率（${periodLabel}）`}
            value={formatPercent(cur.rate, 0)}
            delta={prev && <Delta value={Math.round((cur.rate - prev.rate) * 100)} posLabel="上升 " negLabel="下降 " format={(n) => `${n} 個百分點`} />}
          />
          <Kpi
            label={`待處理（${periodLabel}）`}
            value={formatNumber(cur.open)}
            delta={prev && <Delta value={cur.open - prev.open} goodWhen="negative" posLabel="增加 " negLabel="減少 " format={(n) => `${formatNumber(n)} 筆`} />}
          />
        </div>

        {/* 圖表區：先問題、後圖表——每張圖回答一個寫得出來的問題 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium">金額往哪個方向走？（全期）</p>
            <TrendChart data={trend} title="各期金額" valueFmt={(n) => formatMoney(n)} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">哪個單位卡住了？（{periodLabel}）</p>
            <StackedBar title="各單位狀態組成" rows={stacked} />
            <p className="mt-1 text-xs text-muted-foreground">
              狀態維度用 STATUS_SERIES——「{STATUS_LABEL.done}」在這裡與徽章同一個綠。
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          磚與圖是入口不是終點：點「待處理」應帶著同一組篩選條件進清單頁，數字才對得上。
        </p>
      </div>
    );
  },
};
