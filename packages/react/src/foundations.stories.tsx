import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@dooping/tokens";

const meta: Meta = { title: "基礎/設計 Token" };
export default meta;
type Story = StoryObj;

type Entry = { value: string; desc?: string };
const list = (g: Record<string, unknown>) =>
  Object.entries(g).filter(([, v]) => typeof v === "object" && v !== null && "value" in (v as object)) as [string, Entry][];

function Swatch({ name, entry }: { name: string; entry: Entry }) {
  const isHex = entry.value.startsWith("#");
  return (
    <div className="flex items-center gap-3 rounded-md border p-2">
      <span
        className="size-9 shrink-0 rounded border"
        style={{ background: isHex ? entry.value : `hsl(var(--${name}))` }}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="truncate font-mono text-xs">--{name}</p>
        {entry.desc && <p className="truncate text-tiny text-muted-foreground">{entry.desc}</p>}
      </div>
    </div>
  );
}

export const 語意色: Story = {
  render: () => (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        命名說的是「這個顏色代表什麼意思」，不是「這是什麼顏色」。因此換色票時只改值、不改任何一行使用它的程式碼。
        用 Storybook 工具列切換淺／深色，同一個 token 名稱會給出兩套值。
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list(tokens.color.light as Record<string, unknown>).map(([k, v]) => <Swatch key={k} name={k} entry={v} />)}
      </div>
    </div>
  ),
};

export const 圖表色票: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        分類色票與狀態語意<strong>刻意脫鉤</strong>：換一套分類色票，不會讓「紅＝異常」跟著變。
        8 色沿色相環排序，最不安全的相鄰組合（藍↔紫）被拆到陣列兩端。
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list(tokens.chart.light as Record<string, unknown>).map(([k, v]) => <Swatch key={k} name={k} entry={v} />)}
      </div>
    </div>
  ),
};

export const 字級與間距: Story = {
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">字級（只有 7 階，刻意少）</h3>
        {list(tokens.fontSize as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-3 border-b pb-1">
            <span className="w-16 shrink-0 font-mono text-tiny text-muted-foreground">{k}</span>
            <span style={{ fontSize: v.value }}>資訊密度高的介面靠字重與顏色分層</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">間距（4px 基準）</h3>
        {list(tokens.space as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-tiny text-muted-foreground">{k}</span>
            <span className="h-3 bg-primary/70" style={{ width: v.value }} aria-hidden />
            <span className="text-tiny text-muted-foreground">{v.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const 欄位語意: Story = {
  render: () => (
    <div className="max-w-lg space-y-3">
      <p className="text-sm text-muted-foreground">欄位只有兩種語意：<strong>可編輯</strong>與<strong>唯讀</strong>。</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium">可編輯</p>
          <div className="field-editable rounded-md border px-3 py-2 text-sm">1,500,000</div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium">唯讀／計算值</p>
          <div className="field-readonly rounded-md border px-3 py-2 text-sm">1,380,000</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium">已改動未送出（保留色，不得挪作他用）</p>
        <div className="rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground">1,650,000</div>
      </div>
    </div>
  ),
};
