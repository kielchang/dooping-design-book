import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Badge } from "./badge";
import { Button } from "./button";

const meta: Meta = { title: "基礎/互動狀態層" };
export default meta;
type Story = StoryObj;

// 靜態展示用：把偽類換成把 alpha 直接寫死，這樣 hover／pressed 能與一般態並排比較，
// 也才截得到圖。實際元件上這三階是 `:hover` / `:active` / `[data-state=selected]`。
const AS = {
  一般: undefined,
  hover: "var(--state-hover-alpha)",
  pressed: "var(--state-pressed-alpha)",
} as const;

export const 資料表列的三種狀態: Story = {
  render: () => (
    <div className="max-w-3xl space-y-4">
      <Table zebra>
        <TableHeader>
          <TableRow>
            <TableHead>狀態</TableHead>
            <TableHead>項目</TableHead>
            <TableHead>標記</TableHead>
            <TableHead className="text-muted-foreground">次要文字</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Object.entries(AS), ...Object.entries(AS)].map(([label, a], i) => (
            <TableRow key={i} style={a ? ({ "--state-layer-alpha": a } as React.CSSProperties) : undefined}>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell>{i < 3 ? "奇數列（無斑馬）" : "偶數列（斑馬底）"}</TableCell>
              <TableCell><Badge variant="success">已完成</Badge></TableCell>
              <TableCell className="text-muted-foreground">2024-02-05</TableCell>
            </TableRow>
          ))}
          <TableRow data-state="selected">
            <TableCell className="font-medium">已選</TableCell>
            <TableCell>data-state=&quot;selected&quot;</TableCell>
            <TableCell><Badge variant="success">已完成</Badge></TableCell>
            <TableCell className="text-muted-foreground">次要文字自動改用正文色</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="max-w-2xl text-xs text-muted-foreground">
        三階都是<strong>疊</strong>在列自己的底色上，不是換一組底色——所以斑馬列被指到時
        一樣是「深了一階」。改版前 hover 用 <code>--accent</code>、已選用{" "}
        <code>--muted</code>，而這兩個 token 的值相同（斑馬列本來就是那個顏色），
        實測一般→hover 只差 ΔE00 <strong>1.6</strong>。
        已選那列的徽章<strong>顏色完全不受影響</strong>（實測填色像素與一般列逐一相符，
        只有與底色交界的抗鋸齒像素不同）：疊加層落在背景層——在 <code>background-color</code>
        之上、內容之下。若改用 <code>::after</code> 蓋在內容上，同一個徽章會被染成
        <code>#abc4b4</code>。
      </p>
    </div>
  ),
};

export const 按鈕的三種狀態: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid max-w-2xl grid-cols-[5rem_repeat(3,1fr)] items-center gap-2 text-xs">
        <span />
        {Object.keys(AS).map((k) => <span key={k} className="font-medium">{k}</span>)}
        {(["default", "secondary", "outline", "destructive"] as const).map((v) => (
          <React.Fragment key={v}>
            <code className="text-xs">{v}</code>
            {Object.values(AS).map((a, i) => (
              <Button
                key={i}
                variant={v}
                size="sm"
                style={a ? ({ "--state-layer-alpha": a } as React.CSSProperties) : undefined}
              >
                套用
              </Button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        六個變體共用同一組強度。改版前每個變體各挑一個透明度（<code>/90</code>、
        <code>/80</code>…），可見度從 ΔE00 <strong>0.6</strong>（secondary，等於沒有 hover）
        到 <strong>7.4</strong>（default，太刻意）差了十倍；現在全部落在 <strong>2.6–4.5</strong>。
        <code>link</code> 變體刻意不套——它是一段文字不是一塊表面。
      </p>
    </div>
  ),
};
