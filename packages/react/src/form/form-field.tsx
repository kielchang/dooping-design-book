import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "../lib/utils";
import { Label } from "../ui/label";

// 欄位層的錯誤態＝「Label＋aria-describedby＋aria-invalid＋錯誤小字」這套固定寫法的
// 元件化。控制項的視覺鉤子已內建（Input／Select／Checkbox 的
// `aria-[invalid=true]:border-danger`），這支負責把三條 aria 接對——
// 取用端不再手寫 id 連動，也就不會漏。
//
// 同框分工（提醒色辭典）在欄位上的完整落地：
//   錯誤＝danger **邊框＋淡底**（語意，持續狀態）
//   聚焦＝中性 ring（焦點，與錯誤同時出現也不打架）
//   已改動＝琥珀（edit 保留色，另一個通道）
//
// 錯誤訊息**就地**顯示在欄位下；多欄錯誤的彙總仍由區塊層的 Callout（live）負責——
// 兩層分工，不是取代。

/** FormField 要接到控制項上的屬性。render prop 形式收到的就是這一包，展開到真正可聚焦的元素上。 */
export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FormFieldProps {
  label: ReactNode;
  /** 常駐說明（格式、範例）。錯誤出現時仍保留——錯誤是加上去的，不是換掉說明。 */
  hint?: ReactNode;
  /**
   * 錯誤訊息。有值＝欄位進入錯誤態（控制項自動接到 `aria-invalid` 與 describedby）。
   * 讀屏在聚焦欄位時會念到它；「操作後即時播報」是表單層 Callout（`live`）的職責。
   */
  error?: ReactNode;
  /** 必填星號＋文字說明（顏色不是唯一線索，星號本身帶 title）。 */
  required?: boolean;
  /**
   * 單一控制項（Input／NumberInput／Checkbox…）：aria 由本元件注入到這個元素上。
   *
   * 可聚焦的不是根元素時（Radix `Select` 能聚焦的是 `SelectTrigger`），改傳函式，
   * 把收到的屬性展開到那個元素上：
   * `{(control) => <Select …><SelectTrigger {...control}>…</SelectTrigger>…</Select>}`
   */
  children: ReactElement<Record<string, unknown>> | ((control: FormFieldControlProps) => ReactNode);
  className?: string;
}

export function FormField({ label, hint, error, required, children, className }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const control: FormFieldControlProps = {
    id: `${id}-control`,
    "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
    "aria-invalid": error ? true : undefined,
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={control.id}>
        {label}
        {required && (
          <span className="ml-0.5 text-danger" title="必填" aria-label="必填">
            *
          </span>
        )}
      </Label>
      {typeof children === "function"
        ? children(control)
        : isValidElement(children)
          ? cloneElement(children, { ...control })
          : children}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/**
 * 欄位錯誤小字：色＋圖示＋文字三重編碼（WCAG 1.4.1）。
 * 可獨立使用（自組表單時），但記得自己接 `aria-describedby`——
 * 或直接用 FormField，它會接好。
 */
export function FieldError({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <p id={id} className={cn("flex items-start gap-1 text-xs text-danger", className)}>
      <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
