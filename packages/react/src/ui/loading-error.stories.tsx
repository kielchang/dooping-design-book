import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import { RotateCw } from "lucide-react";
import { Skeleton, SkeletonText } from "./skeleton";
import { DataTable, type Column } from "./data-table";
import { Button } from "./button";
import { Input } from "./input";
import { NumberInput } from "./number-input";
import { Callout } from "./callout";
import { FormField, FieldError } from "../form/form-field";
import { formatNumber } from "../lib/utils";
import { demoRecords, type DemoRecord } from "../demo/sample-data";

const meta: Meta = { title: "Components/States/Loading and errors", id: "元件/狀態/載入與錯誤" };
export default meta;
type Story = StoryObj;

const cols: Column<DemoRecord>[] = [
  { key: "id", header: "ID", cell: (r) => r.id },
  { key: "unit", header: "Unit", cell: (r) => r.unit },
  { key: "qty", header: "Quantity", numeric: true, cell: (r) => formatNumber(r.qty) },
];

export const 載入的三種手段: Story = {
  name: "Three loading strategies",
  render: () => {
    // 模擬「首載 3 秒後資料到」與「重查 2 秒」——展示兩種長相怎麼切換
    const [phase, setPhase] = useState<"first" | "loaded" | "refetch">("first");
    useEffect(() => {
      if (phase === "first") {
        const t = setTimeout(() => setPhase("loaded"), 3000);
        return () => clearTimeout(t);
      }
      if (phase === "refetch") {
        const t = setTimeout(() => setPhase("loaded"), 2000);
        return () => clearTimeout(t);
      }
    }, [phase]);
    const loading = phase !== "loaded";

    return (
      <div className="max-w-xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">
            1 · First load = skeleton (known layout, no jump)　2 · Refresh = dim in place (old data stays readable)
          </p>
          <DataTable
            rows={phase === "first" ? [] : demoRecords.slice(0, 5)}
            columns={cols}
            getRowKey={(r) => r.id}
            pageSize={5}
            searchable={false}
            loading={loading}
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            disabled={loading}
            onClick={() => setPhase("refetch")}
          >
            <RotateCw className="mr-1 size-3.5" aria-hidden />
            Refresh (see dimmed state)
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">3 · Submitting = disabled + icon + copy (the button has no loading variant)</p>
          <Button disabled>
            <RotateCw className="mr-1.5 size-4 animate-spin" aria-hidden />
            Processing…
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Skeleton blocks (Skeleton / SkeletonText)</p>
          <div className="max-w-sm space-y-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-2/5" />
            <SkeletonText />
          </div>
        </div>
      </div>
    );
  },
};

export const 欄位錯誤態: Story = {
  name: "Field errors",
  render: () => (
    <div className="max-w-sm space-y-5">
      <FormField label="Name" hint="2–20 characters" required>
        <Input placeholder="Enter a name" />
      </FormField>
      <FormField label="Quantity" required error="Must be greater than 0">
        <NumberInput value={0} onChange={() => {}} />
      </FormField>
      <FormField label="Notes (standalone FieldError)">
        <Input defaultValue="！！！" aria-invalid />
      </FormField>
      <FieldError>Contains an unsupported character</FieldError>
      <Callout variant="danger" title="2 fields need attention" live>
        Invalid fields are marked in place; this summary does not replace their local messages.
      </Callout>
      <p className="text-xs text-muted-foreground">
        聚焦錯誤欄位：danger 邊框（語意）與中性聚焦環（焦點）同框不打架——
        提醒色辭典同框分工的欄位落地。
      </p>
    </div>
  ),
  // 第一支 play function：驗 FormField 的 aria 連動——這正是它存在的理由，
  // 而且是改版時最容易安靜壞掉的部分（樣式看起來都對，讀屏卻接不到訊息）。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const qty = canvas.getByLabelText(/數量/);
    await expect(qty).toHaveAttribute("aria-invalid", "true");
    const describedBy = qty.getAttribute("aria-describedby");
    await expect(describedBy).toBeTruthy();
    const errorEl = canvasElement.querySelector(`#${CSS.escape(describedBy!.split(" ").pop()!)}`);
    await expect(errorEl).toHaveTextContent("Must be greater than 0");
    // 沒有錯誤的欄位不得帶 aria-invalid
    const name = canvas.getByLabelText(/名稱/);
    await expect(name).not.toHaveAttribute("aria-invalid");
  },
};
