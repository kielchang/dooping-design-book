import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@dooping/tokens";

const meta: Meta = { title: "Foundations/Design tokens", id: "基礎/設計-token" };
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
  name: "Semantic colors",
  render: () => (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Names describe what a color means, not what hue it is. Changing the palette changes values, not the code that uses them.
        Switch light and dark themes in the Storybook toolbar to see two values for the same token.
      </p>
      <p className="max-w-2xl text-sm text-muted-foreground">
        This page is <strong>mostly neutral</strong> (background chroma 0.000, <code>muted</code> 0.007,
        <code>border</code> 0.013), with only about ten chromatic roles. This is deliberate: the semantic system
        <strong>uses chroma to encode importance</strong> (<code>danger</code> 0.223 &gt; <code>warning</code> 0.165 &gt;{" "}
        <code>brand</code> ≤0.151 &gt; <code>primary</code> 0.040 &gt; neutral ≤0.013).
        The page should feel like “a page of gray with a few points of emphasis,” unlike the <strong>chart palette</strong>.
        See <a href="/foundations/color">why categorical colors feel louder than semantic colors</a>.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list(tokens.color.light as Record<string, unknown>).map(([k, v]) => <Swatch key={k} name={k} entry={v} />)}
      </div>
    </div>
  ),
};

export const 圖表色票: Story = {
  name: "Chart palette",
  render: () => {
    const pal = (mode: "light" | "dark") =>
      Array.from({ length: 8 }, (_, i) => (tokens.chart[mode] as Record<string, Entry>)[`chart-${i + 1}`].value);
    const bg = (mode: "light" | "dark") =>
      `hsl(${(tokens.color[mode] as Record<string, Entry>).background.value})`;
    const fg = (mode: "light" | "dark") =>
      `hsl(${(tokens.color[mode] as Record<string, Entry>).foreground.value})`;

    return (
      <div className="space-y-5">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Categorical palettes and status semantics are <strong>deliberately independent</strong>: changing the palette does not change “red = danger”.
          It also <strong>does not follow the hue theme</strong>; an entity keeps the same color across charts and themes.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The order uses <strong>farthest-point insertion</strong>, not a hue wheel. Each next color is perceptually farthest from those already selected.
          Therefore <code>chart-1</code> through <code>chart-k</code> are an approximately optimal k-color subset.
        </p>
        {(["light", "dark"] as const).map((mode) => (
          <div key={mode} className="space-y-2 rounded-md border p-3" style={{ background: bg(mode), color: fg(mode) }}>
            <p className="text-xs font-semibold">{mode === "light" ? "Light theme" : "Dark theme"}</p>
            <div className="flex gap-1.5">
              {pal(mode).map((c, i) => (
                <div key={i} className="flex-1 space-y-1">
                  <div className="h-10 rounded" style={{ background: c }} aria-hidden />
                  <p className="text-center font-mono text-tiny opacity-70">{i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="max-w-2xl text-sm text-muted-foreground">
          This row is intentionally louder than the <strong>semantic colors</strong>. Semantic colors encode importance;
          categorical colors are <strong>equal peers</strong>, so equal lightness and saturation are appropriate.
          The two palettes answer different questions: “how important is this?” versus “which category is this?”
          See <a href="/foundations/color">the color foundation</a> for the full rationale.
        </p>
        <p className="max-w-2xl text-tiny text-muted-foreground">
          Light and dark use <strong>two independent value sets with no shared colors</strong>. Sharing values compresses OKLCH lightness
          and makes the palette harder to distinguish for color-vision differences.
        </p>
        <p className="max-w-2xl text-tiny text-muted-foreground">
          Another constraint is that <strong>categorical colors must stay away from status colors</strong> (hue difference ≥20° or ΔE00 ≥18),
          otherwise an ordinary series can look like <code>danger</code>.
        </p>
      </div>
    );
  },
};

export const 色相主題: Story = {
  name: "Hue themes",
  render: () => (
    <div className="space-y-5">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Use the toolbar's <strong>hue</strong> control to switch six themes and the <strong>theme</strong> control to switch light/dark; they are independent.
        The hue theme affects 16 tokens: four identity colors and twelve tinted neutrals.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">Theme colors</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground">
              Key action
            </span>
            <span className="rounded-md bg-brand-subtle px-3 py-1.5 text-sm font-medium text-brand-subtle-foreground">
              Selected item
            </span>
          </div>
        </div>
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">Theme-independent</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              Standard control
            </span>
            <span className="rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-danger-foreground">Danger</span>
            <span className="rounded-md bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">Warning</span>
          </div>
          {/* 聚焦環自 ADR-0007 起是中性色：不隨主題轉相，才不會和欄位提醒色互相搶語意 */}
          <div className="pt-1">
            <input
              aria-label="Focus ring example"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-2 ring-ring ring-offset-2 ring-offset-background"
              defaultValue="The focus ring is neutral (ADR-0007)"
              readOnly
            />
          </div>
          <p className="text-tiny text-muted-foreground">
            <code>--primary</code> 維持中性近黑、狀態色色相鎖死、聚焦環中性。切色相時這一欄應該<strong>幾乎不動</strong>。
          </p>
        </div>
      </div>
      <p className="max-w-2xl text-tiny text-muted-foreground">
        為什麼狀態色不跟著主題微調：往主題偏 15° 會讓淺色模式六組裡有四組的分類色守衛破掉；
        只彎淡底層則讓藍紫系的 warning／danger 淡底收斂到 ΔE00 8.8——琥珀和紅都變粉橘。
        整體感靠「四種提示共用同一條構成規則」加「坐在帶主題色相的中性表面上」，不靠彎色相。
      </p>
    </div>
  ),
};

export const 字級與間距: Story = {
  name: "Type and spacing",
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Type scale (seven steps by design)</h3>
        {list(tokens.fontSize as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-3 border-b pb-1">
            <span className="w-16 shrink-0 font-mono text-tiny text-muted-foreground">{k}</span>
            <span style={{ fontSize: v.value }}>Dense interfaces use weight and color for hierarchy</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Spacing (4px base)</h3>
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
  name: "Field semantics",
  render: () => (
    <div className="max-w-lg space-y-3">
      <p className="text-sm text-muted-foreground">Fields have two semantic states: <strong>editable</strong> and <strong>read-only</strong>.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium">Editable</p>
          <div className="field-editable rounded-md border px-3 py-2 text-sm">1,500,000</div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium">Read-only / calculated</p>
          <div className="field-readonly rounded-md border px-3 py-2 text-sm">1,380,000</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium">Unsaved changes (reserved color)</p>
        <div className="rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground">1,650,000</div>
      </div>
    </div>
  ),
};
