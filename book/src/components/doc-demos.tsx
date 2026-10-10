// 需要本地狀態的文件活範例。
// MDX 裡不能寫 hook，受控元件（ConfirmDialog 這類）的示範包在這裡，
// 經 MDXComponents 全站註冊——資料仍一律來自 @dooping/react 的示範資料源或就地字面值。
import React from "react";
import { Button, ConfirmDialog, useDialogState } from "@dooping/react";
import { themeColors, themeMeta } from "@dooping/tokens";

/** HSL 三元組字串（"222.2 47.4% 11.2%"）→ #rrggbb，色票上標值用。 */
function hslToHex(triplet: string): string {
  const [h, s, l] = triplet.split(/\s+/).map((v) => parseFloat(v));
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * 環境色票牆：每一格是一個主題島（`data-color-theme` 放在格子上），畫的是那組主題的外殼。
 * 跟著文件站的淺深切換；標出的色值直接讀 tokens，不手抄。
 */
export function EnvironmentPalette() {
  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {themeMeta().map((t) => (
        <div
          key={t.name}
          data-color-theme={t.name}
          className="space-y-1.5 rounded-md border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground"
        >
          <p className="text-xs font-semibold">{t.label}</p>
          <p className="text-tiny text-sidebar-muted-foreground">{t.term}・{t.name}</p>
          <span className="block rounded-sm bg-sidebar-accent px-1.5 py-0.5 text-tiny text-sidebar-accent-foreground">
            選中的項目
          </span>
          <p className="font-mono text-tiny text-sidebar-muted-foreground">
            {hslToHex(themeColors(t.name, "light").sidebar)}／{hslToHex(themeColors(t.name, "dark").sidebar)}
          </p>
        </div>
      ))}
    </div>
  );
}

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
