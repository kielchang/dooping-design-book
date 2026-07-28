import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * 顯示時機：桌機 hover／鍵盤聚焦；行動裝置**長壓約 0.35 秒**，放開後短暫保留再消失。
 * 行動端沒有 hover，若不處理長壓，所有靠 tooltip 補充的資訊在手機上等於不存在。
 */
function useHoverTouch() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onTouchStart: () => { clear(); timer.current = setTimeout(() => setOpen(true), 350); },
    onTouchEnd: () => { clear(); timer.current = setTimeout(() => setOpen(false), 1500); },
    onTouchMove: () => clear(),
  };
  return { open, setOpen, handlers };
}

const bubbleCls =
  "pointer-events-none absolute bottom-full left-0 z-50 mb-1 w-max max-w-[260px] whitespace-normal break-words rounded-md bg-foreground px-2 py-1 text-xs font-normal leading-snug text-background shadow-lg";

/** 泡泡：掛載後量測自身，溢出視窗左右緣就水平夾擠、上緣不足就翻到下方。 */
function Bubble({ id, children }: { id?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    let dx = 0;
    if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
    if (r.left + dx < pad) dx = pad - r.left;
    const flipDown = r.top < pad;
    setStyle({
      visibility: "visible",
      transform: dx ? `translateX(${dx}px)` : undefined,
      ...(flipDown ? { top: "100%", bottom: "auto", marginTop: 4, marginBottom: 0 } : {}),
    });
  }, []);
  return (
    <span ref={ref} role="tooltip" id={id} style={style} className={bubbleCls}>
      {children}
    </span>
  );
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  /**
   * 讓觸發器本身可被 Tab 聚焦並以 `aria-describedby` 關聯。
   * 用於「非互動但內容被截斷」的地方（表格儲存格）；**不要**用在已是互動元素的內部，
   * 否則會產生巢狀可聚焦元素，鍵盤使用者要多按一次 Tab 才走得掉。
   */
  focusable?: boolean;
}

export function Tooltip({ content, children, className, focusable }: TooltipProps) {
  const { open, setOpen, handlers } = useHoverTouch();
  const id = useId();
  if (content == null || content === "") return <>{children}</>;
  return (
    <span
      className={cn("relative inline-flex max-w-full select-none", className)}
      {...handlers}
      {...(focusable
        ? { tabIndex: 0, onFocus: () => setOpen(true), onBlur: () => setOpen(false), "aria-describedby": open ? id : undefined }
        : {})}
    >
      {children}
      {open && <Bubble id={focusable ? id : undefined}>{content}</Bubble>}
    </span>
  );
}

/** 單行截斷文字＋提示泡泡：超出以 … 表示，hover／長壓看完整內容。 */
export function TruncatedText({ text, className, numeric }: { text: string; className?: string; numeric?: boolean }) {
  const { open, handlers } = useHoverTouch();
  const hasTip = Boolean(text) && text !== "—";
  return (
    <span className={cn("relative block min-w-0 flex-1 select-none", numeric && "text-right")} {...handlers}>
      <span className={cn("block truncate", numeric && "tabular-nums", className)}>{text}</span>
      {open && hasTip && <Bubble>{text}</Bubble>}
    </span>
  );
}
