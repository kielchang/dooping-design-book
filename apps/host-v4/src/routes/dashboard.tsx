import { useState, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/dooping/card";
import { Delta } from "@/components/dooping/delta";
import { SegGroup } from "@/components/dooping/seg-group";
import { PageHeader } from "@/components/dooping/page-header";
import { TrendChart } from "@/components/dooping/trend-chart";
import { StackedBar, type StackedBarRow } from "@/components/dooping/stacked-bar";
import { STATUS_SERIES } from "@/components/dooping/base";
import { formatMoney, formatNumber, formatPercent } from "@/lib/dooping/utils";
import { demoRecords, STATUS_LABEL, type DemoRecord, type RecordStatus } from "@/demo/sample-data";

// 儀表板：KPI 磚列 → 圖表區，期間在頁首「一處控全頁」。唯讀，不放寫入動作。
// 組成規格正本在文件站〈儀表板〉；這一頁是「照規格組出來」的可執行證據。

const PERIODS = [
  { value: "2024-01", label: "一月" },
  { value: "2024-02", label: "二月" },
  { value: "all", label: "全部" },
];

// 維度是狀態 → 語意系列（與徽章同一套顏色），不照序取分類色
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

function Kpi({ label, value, delta }: { label: string; value: string; delta?: ReactNode }) {
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

export function DashboardPage() {
  const [period, setPeriod] = useState("2024-02");
  const inPeriod = (r: DemoRecord) => period === "all" || r.createdAt.startsWith(period);
  const cur = metric(demoRecords.filter(inPeriod));
  // 只有「二月」有上一期可比；沒得比就不硬擠一個數字出來
  const prev = period === "2024-02" ? metric(demoRecords.filter((r) => r.createdAt.startsWith("2024-01"))) : undefined;

  const buckets = new Map<string, number>();
  for (const r of demoRecords) {
    const day = Number(r.createdAt.slice(8, 10));
    const label = `${Number(r.createdAt.slice(5, 7))}月${day <= 15 ? "上" : "下"}`;
    buckets.set(label, (buckets.get(label) ?? 0) + r.amount);
  }
  const trend = [...buckets.entries()].map(([label, value]) => ({ label, value }));

  const stacked: StackedBarRow[] = [...new Set(demoRecords.map((r) => r.unit))].map((unit) => ({
    label: unit,
    segments: (Object.keys(STATUS_TO_SERIES) as RecordStatus[]).map((s) => ({
      label: STATUS_LABEL[s],
      value: demoRecords.filter((r) => r.unit === unit && r.status === s && inPeriod(r)).length,
      color: STATUS_SERIES[STATUS_TO_SERIES[s]],
    })),
  }));

  const periodLabel = PERIODS.find((p) => p.value === period)?.label;
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="成效總覽"
        meta={`資料期間：${periodLabel}・更新於 2024-02-07`}
        actions={<SegGroup label="期間" options={PERIODS} value={period} onPick={setPeriod} />}
      />

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
          delta={
            prev && (
              <Delta
                value={Math.round((cur.rate - prev.rate) * 100)}
                posLabel="上升 "
                negLabel="下降 "
                format={(n) => `${n} 個百分點`}
              />
            )
          }
        />
        <Kpi
          label={`待處理（${periodLabel}）`}
          value={formatNumber(cur.open)}
          delta={
            prev && (
              <Delta
                value={cur.open - prev.open}
                goodWhen="negative"
                posLabel="增加 "
                negLabel="減少 "
                format={(n) => `${formatNumber(n)} 筆`}
              />
            )
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium">金額往哪個方向走？（全期）</p>
          <TrendChart data={trend} title="各期金額" valueFmt={(n) => formatMoney(n)} />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">哪個單位卡住了？（{periodLabel}）</p>
          <StackedBar title="各單位狀態組成" rows={stacked} />
        </div>
      </div>
    </div>
  );
}
