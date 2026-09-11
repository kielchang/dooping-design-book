// 需要本地狀態的文件活範例。
// MDX 裡不能寫 hook，受控元件（ConfirmDialog 這類）的示範包在這裡，
// 經 MDXComponents 全站註冊——資料仍一律來自 @dooping/react 的示範資料源或就地字面值。
import React from "react";
import { Button, ConfirmDialog, useDialogState } from "@dooping/react";

export function ConfirmDialogDemo() {
  const [dialog, setDialog] = useDialogState<"void">();
  const [done, setDone] = React.useState(false);
  return (
    <div className="space-y-2">
      <Button variant="destructive" onClick={() => setDialog("void")}>作廢 R-2403</Button>
      {done ? <p className="text-sm text-muted-foreground">（示範：已確認。重新點按鈕再試一次。）</p> : null}
      <ConfirmDialog
        open={dialog === "void"}
        onOpenChange={(o) => { if (!o) setDialog(null); }}
        title="作廢 R-2403？"
        description="作廢會釋放已保留的配額並寫入異動紀錄，且無法還原。"
        confirmText="作廢"
        destructive
        typeToConfirm={{ expected: "R-2403" }}
        onConfirm={() => { setDone(true); setDialog(null); }}
      />
    </div>
  );
}
