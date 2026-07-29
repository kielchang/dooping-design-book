import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export type CalloutVariant = "success" | "warning" | "info" | "danger";

/**
 * 強度。豐富度來源是「同一語意色的兩種強度」，不是加色相——四種語意封頂，不再擴充。
 *
 * - `low`（預設）：淡底＋左粗邊＋圖示＋同色系深字。日常與次要提示，大量出現也不刺眼。
 * - `high`：實色滿版＋反白字。**阻斷式**訊息專用（必須停下來決定的操作）。
 *
 * 有疑慮就用 `low`。高強度出現頻率一高，色彩疲勞的預算會瞬間爆掉——
 * 疲勞管的是高飽和色的面積 × 頻率，不是色相的種類數。
 */
export type CalloutIntensity = "low" | "high";

const ICON: Record<CalloutVariant, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Lightbulb,
  danger: AlertCircle,
};

// 低強度不再用 `bg-{狀態}/10`：那是把實色壓 10% 疊上去，對比不可控——
// 實測四種變體在淺色模式的文字對比只有 1.97–3.98:1，全部低於 4.5。
// 改吃生成的 `--{狀態}-subtle` 三件組，對比在生成時就反解保證。
const LOW: Record<CalloutVariant, string> = {
  success: "border-success/30 border-l-success bg-success-subtle text-success-subtle-foreground",
  warning: "border-warning/40 border-l-warning bg-warning-subtle text-warning-subtle-foreground",
  info: "border-info/30 border-l-info bg-info-subtle text-info-subtle-foreground",
  danger: "border-danger/30 border-l-danger bg-danger-subtle text-danger-subtle-foreground",
};

const HIGH: Record<CalloutVariant, string> = {
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  info: "border-transparent bg-info text-info-foreground",
  danger: "border-transparent bg-danger text-danger-foreground",
};

export interface CalloutProps {
  variant: CalloutVariant;
  /** 視覺強度。預設 `low`；`high` 只給阻斷式訊息。 */
  intensity?: CalloutIntensity;
  /**
   * 這則訊息是「操作之後才出現」的嗎？
   *
   * 預設 `false`＝靜態旁註，讀屏照文件順序讀到才念。
   * 設 `true` 才成為 live region 即時播報（`high` 用 assertive、`low` 用 polite）。
   * 靜態內容誤設 true 會讓讀屏在載入時把整頁提示框念一遍。
   */
  live?: boolean;
  title: ReactNode;
  /** 短標籤（如規則代號、分類），顯示在標題前 */
  tag?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}

/**
 * 狀態提示框（良好／警示／提醒／危險）。
 *
 * 走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
 * 因此「這是什麼等級的訊息」不是只靠顏色傳達。
 */
export function Callout({
  variant,
  intensity = "low",
  live = false,
  title,
  tag,
  icon,
  children,
  className,
}: CalloutProps) {
  const Icon = icon ?? ICON[variant];
  const high = intensity === "high";
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border p-3",
        // 左邊框加粗是低強度的識別特徵：不靠顏色也看得出這是一則提示，
        // 而且在灰階列印下仍然成立。
        high ? HIGH[variant] : cn(LOW[variant], "border-l-4"),
        className,
      )}
      // 預設是 `note`（旁註），**不是** live region。提示框大多是靜態內容，
      // 套上 `status`／`alert` 會讓讀屏在頁面載入時把每一則都念一遍。
      // 只有「操作之後才出現」的訊息才該即時播報——那種情況傳 `live`。
      role={live ? "alert" : "note"}
      aria-live={live ? (high ? "assertive" : "polite") : undefined}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {tag && (
            <span className="mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium">
              {tag}
            </span>
          )}
          {title}
        </p>
        {/* 內文沿用容器的文字色（已對底色反解到 4.5:1）。
            低強度不能改用 muted-foreground——那是對「中性表面」解的，放在帶色的淡底上不成立。 */}
        {children && <div className="mt-0.5 text-xs leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
}
