import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// Radix Collapsible 原樣輸出：它沒有自己的視覺，樣式由組合它的元件決定
// （側欄群組的展開／收合、明細頁的區塊摺疊）。aria-expanded 與鍵盤行為由 Radix 保證。
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
