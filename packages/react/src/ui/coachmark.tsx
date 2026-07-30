import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { X, Minus, Maximize2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "../lib/utils";

/**
 * 引導聚光框（**純呈現原語**）。
 *
 * 邊界：目標矩形、內容、步進狀態與回呼全由外部傳入。它不知道有幾支導覽、目前走到哪、
 * 錨點怎麼找——那是宿主應用的事。這條界線讓同一個元件可以被「新手導覽」「功能公告」
 * 「驗收清單」三種完全不同的流程共用。
 *
 * 三個關鍵決定：
 * 1. **聚光洞 `pointer-events: none`**——使用者仍能點到被圈起來的控制項。導覽是教人操作，不是代替他操作。
 * 2. **可縮小**——需要實際操作（開對話框、切分頁）時，導覽卡收成右下角小膠囊，整個畫面恢復可用。
 *    這是最常被忽略、也最常被抱怨的一點：導覽卡擋住了它正在叫你點的東西。
 * 3. **鍵盤可走完**——←→ 換步、Esc 略過、Enter 前進，每步自動把焦點移入卡片讓螢幕報讀器唸出內容。
 */
export interface CoachmarkProps {
  /** 目標元素的矩形；`null`＝置中卡（歡迎頁或找不到錨點時的降級） */
  targetRect: DOMRect | null;
  title: string;
  body: ReactNode;
  /** 0-based */
  stepIndex: number;
  stepCount: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  finishLabel?: string;
  /** 末步的次要動作（如「接著看下一支導覽」） */
  secondaryAction?: { label: string; onClick: () => void };
  /** 此步需要使用者實際操作才前進時的提示（如「👆 點上方圈起來的按鈕」） */
  actionHint?: ReactNode;
  /** 前置條件未滿足的警示（如「此筆已確認，需先解除鎖定」） */
  warning?: ReactNode;
  /** 驗收模式：顯示「通過／有問題＋備註」標記列。純呈現，狀態由宿主保存。 */
  showVerdict?: boolean;
  verdict?: "pass" | "issue" | null;
  onVerdict?: (v: "pass" | "issue") => void;
  note?: string;
  onNote?: (s: string) => void;
  labels?: Partial<CoachmarkLabels>;
}

export interface CoachmarkLabels {
  skip: string;
  prev: string;
  next: string;
  finish: string;
  collapse: string;
  expand: string;
  guide: string;
  keyboardHint: string;
  verdictTitle: string;
  pass: string;
  issue: string;
  notePlaceholder: string;
  dialogLabel: string;
}

export const DEFAULT_COACHMARK_LABELS: CoachmarkLabels = {
  skip: "略過",
  prev: "上一步",
  next: "下一步",
  finish: "完成",
  collapse: "縮小（騰出空間操作，之後可展開）",
  expand: "展開",
  guide: "導引",
  keyboardHint: "· ← → 換步 · Esc 略過",
  verdictTitle: "驗收此步：",
  pass: "✅ 通過",
  issue: "❌ 有問題",
  notePlaceholder: "（選填）問題描述，會寫進驗收報告",
  dialogLabel: "操作導引",
};

const PAD = 12;
const GAP = 12;
const HOLE = 6;

export function Coachmark({
  targetRect, title, body, stepIndex, stepCount, isFirst, isLast, onNext, onPrev, onSkip,
  finishLabel, secondaryAction, actionHint, warning,
  showVerdict, verdict, onVerdict, note, onNote, labels,
}: CoachmarkProps) {
  const L = { ...DEFAULT_COACHMARK_LABELS, ...labels };
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // 換步一律先展開並把焦點移入卡片：否則上一步縮小後，下一步的說明沒人看見也沒人唸。
  useEffect(() => { setCollapsed(false); popRef.current?.focus(); }, [stepIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { e.preventDefault(); onSkip(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
    else if (e.key === "ArrowLeft") { if (!isFirst) { e.preventDefault(); onPrev(); } }
    // Enter 只在焦點落在卡片本體（非內部按鈕）時前進，避免與按鈕預設行為重複觸發
    else if (e.key === "Enter" && e.target === popRef.current) { e.preventDefault(); onNext(); }
  };

  useLayoutEffect(() => {
    const el = popRef.current;
    if (!el) return;
    const pw = el.offsetWidth;
    const ph = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!targetRect) {
      setPos({ top: Math.max(PAD, (vh - ph) / 2), left: Math.max(PAD, (vw - pw) / 2) });
      return;
    }
    let top = targetRect.bottom + GAP;
    if (top + ph > vh - PAD) top = Math.max(PAD, targetRect.top - ph - GAP);
    let left = targetRect.left + targetRect.width / 2 - pw / 2;
    left = Math.min(Math.max(PAD, left), Math.max(PAD, vw - pw - PAD));
    setPos({ top, left });
  }, [targetRect, title, body, stepIndex, stepCount]);

  if (collapsed) {
    return createPortal(
      <div className="pointer-events-none fixed inset-0 z-[200]">
        <div className="pointer-events-auto fixed bottom-4 right-4 flex items-center gap-2 rounded-full border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
          <span className="tabular-nums text-muted-foreground">{L.guide} {stepIndex + 1}/{stepCount}</span>
          <Button size="sm" variant="outline" onClick={() => setCollapsed(false)}><Maximize2 className="size-3.5" /> {L.expand}</Button>
          <button type="button" onClick={onSkip} className="text-tiny text-muted-foreground underline underline-offset-2">{L.skip}</button>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200]" role="dialog" aria-modal="false" aria-label={L.dialogLabel}>
      {targetRect ? (
        <>
          {/* 挖洞暗罩：巨大 spread box-shadow 罩住洞外，洞本身透明且可點穿 */}
          <div
            className="pointer-events-none fixed rounded-md"
            style={{
              top: targetRect.top - HOLE,
              left: targetRect.left - HOLE,
              width: targetRect.width + HOLE * 2,
              height: targetRect.height + HOLE * 2,
              boxShadow: "0 0 0 9999px rgba(15,23,42,0.55)",
            }}
          />
          <div
            className="spotlight-ring pointer-events-none fixed rounded-md"
            style={{
              top: targetRect.top - HOLE,
              left: targetRect.left - HOLE,
              width: targetRect.width + HOLE * 2,
              height: targetRect.height + HOLE * 2,
            }}
          />
        </>
      ) : (
        <div className="pointer-events-none fixed inset-0 bg-foreground/60" />
      )}

      <div
        ref={popRef}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        aria-live="polite"
        style={pos ? { top: pos.top, left: pos.left } : { opacity: 0 }}
        // 聚焦環用 `ring-ring`（跟著色相主題）而不是 `ring-primary`——這支原本是全 repo
        // 唯一不跟主題的聚焦環。換過來之後就受 ring-offset 那條守衛管：沒有 offset 的環
        // 是貼著卡片邊框畫的，對比要對邊框算而不是對背景算。
        className="pointer-events-auto fixed w-[min(340px,calc(100vw-24px))] rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none ring-1 ring-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">{title}</p>
          <div className="-m-1 flex items-center gap-0.5">
            <button type="button" onClick={() => setCollapsed(true)} aria-label={L.collapse} title={L.collapse} className="tap-target rounded p-1 text-muted-foreground hover:text-foreground">
              <Minus className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={onSkip} aria-label={L.skip} className="tap-target rounded p-1 text-muted-foreground hover:text-foreground">
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground [&_strong]:text-foreground">{body}</div>
        {warning && (
          <p className="mt-2 rounded-md border border-danger/40 bg-danger/10 px-2 py-1.5 text-xs text-danger [&_strong]:text-danger">{warning}</p>
        )}
        {actionHint && (
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary">
            <span className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-primary" aria-hidden />
            {actionHint}
          </p>
        )}
        {showVerdict && (
          <div className="mt-2 rounded-md border bg-muted/40 p-2">
            <p className="mb-1.5 text-tiny font-medium text-muted-foreground">{L.verdictTitle}</p>
            <div className="flex gap-2" role="radiogroup" aria-label={L.verdictTitle}>
              <button
                type="button" role="radio" aria-checked={verdict === "pass"} onClick={() => onVerdict?.("pass")}
                className={cn("state-layer tap-target flex-1 rounded-md border px-2 py-1 text-xs font-medium", verdict === "pass" ? "border-success bg-success/15 text-success" : "text-muted-foreground")}
              >{L.pass}</button>
              <button
                type="button" role="radio" aria-checked={verdict === "issue"} onClick={() => onVerdict?.("issue")}
                className={cn("state-layer tap-target flex-1 rounded-md border px-2 py-1 text-xs font-medium", verdict === "issue" ? "border-danger bg-danger/15 text-danger" : "text-muted-foreground")}
              >{L.issue}</button>
            </div>
            {verdict === "issue" && (
              <textarea
                value={note ?? ""} onChange={(e) => onNote?.(e.target.value)} rows={2}
                placeholder={L.notePlaceholder}
                className="field-editable mt-2 w-full resize-none rounded-md border px-2 py-1 text-xs"
              />
            )}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs tabular-nums text-muted-foreground">
            {stepIndex + 1} / {stepCount}
            <span className="ml-1.5 hidden text-micro text-muted-foreground/70 sm:inline" aria-hidden>{L.keyboardHint}</span>
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onSkip} className="text-tiny text-muted-foreground underline underline-offset-2">{L.skip}</button>
            {!isFirst && <Button variant="outline" size="sm" onClick={onPrev}>{L.prev}</Button>}
            {isLast && secondaryAction && <Button variant="outline" size="sm" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
            <Button size="sm" onClick={onNext}>{isLast ? finishLabel ?? L.finish : L.next}</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
