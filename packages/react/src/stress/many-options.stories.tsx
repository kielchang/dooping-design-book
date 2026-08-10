// 壓力測試／超多選項：多選 24 項、單選 6 個長標籤、零選項。
// 換行後高度變化能否接受？換行的分段選擇是不是該改用下拉？
// 規範出處：book/docs/7-governance/09-stress-stories.mdx
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chips } from "../ui/chips";
import { SegGroup } from "../ui/seg-group";
import { makeOptions } from "../demo/generate-stress";

const meta: Meta = { title: "壓力測試/超多選項" };
export default meta;
type Story = StoryObj;

export const 多選二十四項: Story = {
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["o3", "o11", "o19"]);
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">Chips × 24 個選項</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：換行後整塊的高度能不能接受？已選的那幾顆還找得到嗎？
          Chips 的適用邊界是「選項固定且 ≤ 12」——超過就該改多選下拉，這支 story 是在幫你確認那條線。
        </p>
        <Chips
          options={makeOptions(24)}
          selected={sel}
          onToggle={(v) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]))}
          label="二十四個選項的多選"
        />
      </div>
    );
  },
};

export const 單選六個長標籤: Story = {
  render: function Render() {
    const [v, setV] = useState("o2");
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">SegGroup × 6 個長標籤</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：分段選擇一旦換行，「一眼看完所有選項」的價值就沒了——
          撞出來的規範是「分段選擇換行即失去意義，該改下拉」。
        </p>
        <SegGroup
          options={makeOptions(6, { longLabelRatio: 1 })}
          value={v}
          onPick={setV}
          label="六個長標籤的單選"
        />
      </div>
    );
  },
};

export const 零選項: Story = {
  render: function Render() {
    const [v, setV] = useState("");
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-sm font-medium">「沒有」那一側：options 是空陣列</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：Chips 有 emptyHint 撐住場面；SegGroup 剩一個空殼——
          空清單常常來自「上游還沒建選項」，元件要嘛給提示、要嘛整塊藏起來，不能只剩一個框。
        </p>
        <Chips options={[]} selected={[]} onToggle={() => {}} label="零選項的多選" emptyHint="尚未建立任何選項" />
        <SegGroup options={[]} value={v} onPick={setV} label="零選項的單選" />
      </div>
    );
  },
};
