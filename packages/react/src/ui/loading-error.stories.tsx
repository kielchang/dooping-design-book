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

const meta: Meta = { title: "元件/狀態/載入與錯誤" };
export default meta;
type Story = StoryObj;

const cols: Column<DemoRecord>[] = [
  { key: "id", header: "編號", cell: (r) => r.id },
  { key: "unit", header: "單位", cell: (r) => r.unit },
  { key: "qty", header: "數量", numeric: true, cell: (r) => formatNumber(r.qty) },
];

export const 載入的三種手段: Story = {
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
            1・首載＝骨架（版面已知不跳動）　2・重查＝就地變暗（舊資料仍可讀）
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
            重新查詢（看變暗態）
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">3・提交中＝disabled＋圖示＋文案（按鈕沒有 loading 變體）</p>
          <Button disabled>
            <RotateCw className="mr-1.5 size-4 animate-spin" aria-hidden />
            處理中…
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">骨架積木（Skeleton／SkeletonText）</p>
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
  render: () => (
    <div className="max-w-sm space-y-5">
      <FormField label="名稱" hint="2–20 個字" required>
        <Input placeholder="輸入名稱" />
      </FormField>
      <FormField label="數量" required error="必須大於 0">
        <NumberInput value={0} onChange={() => {}} />
      </FormField>
      <FormField label="備註（獨立 FieldError 的長相）">
        <Input defaultValue="！！！" aria-invalid />
      </FormField>
      <FieldError>含有不允許的字元</FieldError>
      <Callout variant="danger" title="有 2 個欄位需要修正" live>
        錯誤欄位已就地標示——這一層是彙總，不取代欄位下的訊息。
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
    await expect(errorEl).toHaveTextContent("必須大於 0");
    // 沒有錯誤的欄位不得帶 aria-invalid
    const name = canvas.getByLabelText(/名稱/);
    await expect(name).not.toHaveAttribute("aria-invalid");
  },
};
