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
      <p className="max-w-2xl text-sm text-muted-foreground">
        下面這一頁<strong>絕大多數是無彩色</strong>（背景 chroma 0.000、<code>muted</code> 0.007、
        <code>border</code> 0.013），只有約十個帶彩度。這是刻意的：語意系統
        <strong>用彩度編碼重要性</strong>（<code>danger</code> 0.223 &gt; <code>warning</code> 0.165 &gt;{" "}
        <code>brand</code> ≤0.151 &gt; <code>primary</code> 0.040 &gt; 中性 ≤0.013）。
        所以這一頁該讀起來像「一整頁灰，加幾個重點」——與隔壁的<strong>圖表色票</strong>觀感差很多，
        那個落差是兩種色票目的不同的必然結果，
        理由見<a href="/foundations/color#為什麼分類色看起來比語意色吵">為什麼分類色看起來比語意色「吵」</a>。
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list(tokens.color.light as Record<string, unknown>).map(([k, v]) => <Swatch key={k} name={k} entry={v} />)}
      </div>
    </div>
  ),
};

export const 圖表色票: Story = {
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
          分類色票與狀態語意<strong>刻意脫鉤</strong>：換一套分類色票，不會讓「紅＝異常」跟著變。
          它也<strong>不跟著色相主題走</strong>——顏色跟資料實體走，同一個項目在所有圖表、所有主題下都是同一色，
          所以切工具列的「色相」不會影響下面這兩排。
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          排列順序是<strong>最遠點插入</strong>的順序，不是色相環：第 1 色錨在藍，之後每一色都是
          「與已選色感知距離最遠」的那一個。因此取 <code>chart-1</code>…<code>chart-k</code>
          對任何 k 都是近似最佳的 k 色子集。
        </p>
        {(["light", "dark"] as const).map((mode) => (
          <div key={mode} className="space-y-2 rounded-md border p-3" style={{ background: bg(mode), color: fg(mode) }}>
            <p className="text-xs font-semibold">{mode === "light" ? "淺色模式" : "深色模式"}</p>
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
          這一排看起來比<strong>語意色</strong>那一頁「吵」很多，是刻意的。語意系統用彩度編碼重要性，
          所以那一頁絕大多數是無彩色；分類色是<strong>彼此平等的同儕</strong>，
          等亮等飽和才對——如果第 3 條序列比第 5 條飽和，讀者會以為它比較重要。
          兩邊都對，放在一起就會有落差，因為兩種色票回答的是不同問題：
          語意色答「這件事有多重要」，分類色答「這是哪一類」。
          完整說明見<a href="/foundations/color#為什麼分類色看起來比語意色吵">基礎／色彩</a>。
        </p>
        <p className="max-w-2xl text-tiny text-muted-foreground">
          淺深是<strong>兩組獨立的值，沒有任何一色相同</strong>。共用會把 OKLCH 的 L 鎖在
          <code>[0.49, 0.67]</code>（寬度 0.17），八色必然擠在中明度——而二色覺者失去的正是色相辨別、
          保留的是明度。上一版 8 色裡共用了 6 色，最差一對在綠色盲下 ΔE00 只有 2.6。
        </p>
        <p className="max-w-2xl text-tiny text-muted-foreground">
          另一條約束是<strong>分類色不得靠近任何狀態色</strong>（色相差 ≥20° 或 ΔE00 ≥18）——
          否則一條普通序列長得像 <code>danger</code>，讀者會以為那條線有問題。
          這條守衛上一版只擋 <code>danger</code>，於是深色下 <code>chart-5</code> 與{" "}
          <code>warning</code> 只差 ΔE00 7.3 而沒被抓到。
        </p>
      </div>
    );
  },
};

export const 色相主題: Story = {
  render: () => (
    <div className="space-y-5">
      <p className="max-w-2xl text-sm text-muted-foreground">
        用工具列的<strong>色相</strong>切換六組主題，<strong>主題</strong>切換淺深——兩者正交。
        主題只影響 16 個 token：4 個主題色（下方）與 12 個帶色調的中性色（背景、邊框、muted…，
        只轉色相、明度與彩度不動）。
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">主題色</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground">
              關鍵動作
            </span>
            <span className="rounded-md bg-brand-subtle px-3 py-1.5 text-sm font-medium text-brand-subtle-foreground">
              被選中的項目
            </span>
          </div>
        </div>
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">與主題無關</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              一般控制項
            </span>
            <span className="rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-danger-foreground">異常</span>
            <span className="rounded-md bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">注意</span>
          </div>
          {/* 聚焦環自 ADR-0007 起是中性色：不隨主題轉相，才不會和欄位提醒色互相搶語意 */}
          <div className="pt-1">
            <input
              aria-label="聚焦環示意"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-2 ring-ring ring-offset-2 ring-offset-background"
              defaultValue="聚焦環是中性色（ADR-0007）"
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
