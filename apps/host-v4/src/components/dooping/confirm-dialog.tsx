import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dooping/dialog";
import { Button } from "@/components/dooping/button";
import { Input } from "@/components/dooping/input";
import { Label } from "@/components/dooping/label";

export interface ConfirmDialogProps {
  /** 受控開關——搭配 `useDialogState` 或宿主自己的狀態。 */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 額外內容（影響範圍清單、警示框…），插在描述與按鈕之間。 */
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /**
   * 破壞性確認：確認鈕改走 `destructive`。這是**控制項語意**（這顆按下去會刪東西），
   * 與狀態語意 `danger` 分家——同 Button 的原則。
   */
  destructive?: boolean;
  /**
   * 操作進行中：確認鈕 `aria-busy` 且全部出口（確認、取消、Esc、點遮罩、右上關閉）
   * 一律鎖住。進行中關掉對話框會讓使用者以為取消了——實際上沒有。
   */
  loading?: boolean;
  disabled?: boolean;
  /**
   * 確認後**不會自動關閉**：成功才關、失敗留在原地顯示錯誤，時機由宿主決定。
   * 刻意不吃 Promise——async 編排與錯誤呈現是應用層的事，元件不吞錯誤。
   */
  onConfirm: () => void;
  /**
   * 硬確認：輸入指定字串才解鎖確認鈕。「把危險操作變成刻意的決定」
   * （硬鎖定模式）在對話框層的落地——用在影響半徑大、無法還原的操作。
   */
  typeToConfirm?: { expected: string; label?: string; placeholder?: string };
}

/**
 * 確認對話框。破壞性操作的固定寫法：標題講動作、描述講後果、
 * 確認鈕的字是動詞（「作廢」「刪除」），不是「確定」二字打發。
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmText = "確定",
  cancelText = "取消",
  destructive = false,
  loading = false,
  disabled = false,
  onConfirm,
  typeToConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = React.useState("");
  const inputId = React.useId();

  // 關閉即重置硬確認輸入——下次打開不能繼承上次打了一半的字
  React.useEffect(() => {
    if (!open) setTyped("");
  }, [open]);

  const typeLocked = typeToConfirm ? typed.trim() !== typeToConfirm.expected : false;
  const confirmDisabled = disabled || loading || typeLocked;

  // 進行中鎖住所有出口：Esc、遮罩、右上關閉鈕都經過 onOpenChange，一個口子擋完
  const handleOpenChange = (next: boolean) => {
    if (loading && !next) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {typeToConfirm ? (
          <div className="space-y-1.5">
            <Label htmlFor={inputId}>
              {typeToConfirm.label ?? `請輸入「${typeToConfirm.expected}」以確認`}
            </Label>
            <Input
              id={inputId}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={typeToConfirm.placeholder}
              disabled={loading}
              autoComplete="off"
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={confirmDisabled}
            aria-busy={loading || undefined}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
