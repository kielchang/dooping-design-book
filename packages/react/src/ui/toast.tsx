import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, Lightbulb, AlertCircle, X } from "lucide-react";
import { cn } from "../lib/utils";
import { STATUS_SUBTLE_SURFACE, type CalloutVariant } from "./callout";

/**
 * Toast 操作回饋——「操作回饋的去向全站固定一種」（頁面章守則）的載體。
 * 固定的那一種就寫在這裡，改規則先改文件頁再改這些常數：
 *
 * - 去向：**視窗右下**，不遮頁首動作列與側欄導覽
 * - 堆疊上限 3，最舊的被擠出（重要到不能被擠出的訊息，該用 Dialog 不是 Toast）
 * - `success`／`info`／`warning` 5 秒自動消失，hover／聚焦時暫停倒數
 * - **`danger` 不自動消失**——錯誤要使用者親手關掉，不能自己溜走
 * - 語彙與 Callout 同源：同一張圖示表、同一組淡底表面，不靠顏色單獨傳達
 * - 讀屏：`status`／`polite`（一般）、`alert`／`assertive`（danger）
 * - z-[70]：高於 Dialog（z-50）與資料表篩選面板（z-[60]）
 *
 * 邊界：Toast **不承載表單驗證錯誤**——錯誤訊息貼著欄位（`aria-describedby`），
 * 跨欄彙總用頁內 Callout。Toast 只回答「你剛剛那個動作，成了沒」。
 */
export type ToastVariant = CalloutVariant;

export interface ToastInput {
  variant: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  /** 自動消失毫秒數（預設 5000）。`danger` 一律手動關閉，此值被忽略。 */
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: number;
}

const ICON: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Lightbulb,
  danger: AlertCircle,
};

const MAX_STACK = 3;
const DEFAULT_DURATION = 5000;

interface ToastApi {
  /** 送出一則回饋，回傳 id（要提前關掉時用）。 */
  push: (t: ToastInput) => number;
  dismiss: (id: number) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast 必須在 <ToastProvider> 之內使用");
  return ctx;
}

/** 包在應用最外層（或至少包住會發回饋的區塊）。viewport 由 Provider 自帶，不必另掛。 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const dismiss = useCallback((id: number) => {
    setItems((s) => s.filter((t) => t.id !== id));
  }, []);
  const push = useCallback((t: ToastInput) => {
    const id = ++seq.current;
    setItems((s) => [...s, { ...t, id }].slice(-MAX_STACK));
    return id;
  }, []);
  const api = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <Toaster items={items} dismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

function Toaster({ items, dismiss }: { items: ToastItem[]; dismiss: (id: number) => void }) {
  // portal 目標是 document.body——SSR 期間沒有 document，掛載後才渲染
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || items.length === 0) return null;
  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {items.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>,
    document.body,
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const Icon = ICON[item.variant];
  const danger = item.variant === "danger";

  // 倒數可暫停：hover／聚焦時停表，離開時以**剩餘時間**續走——
  // 直接 setTimeout 重來會讓每次 hover 都把 5 秒重數一遍。
  const remain = useRef(item.duration ?? DEFAULT_DURATION);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pause = () => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    remain.current -= Date.now() - startedAt.current;
  };
  const resume = () => {
    if (danger || timer.current) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(onDismiss, Math.max(remain.current, 0));
  };
  useEffect(() => {
    resume();
    return pause;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role={danger ? "alert" : "status"}
      aria-live={danger ? "assertive" : "polite"}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className={cn(
        "pointer-events-auto flex items-start gap-2.5 rounded-md border border-l-4 border-l-current p-3 shadow-lg",
        "animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
        STATUS_SUBTLE_SURFACE[item.variant],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description && (
          <div className="mt-0.5 text-xs leading-relaxed opacity-90">{item.description}</div>
        )}
      </div>
      <button
        type="button"
        aria-label="關閉通知"
        onClick={onDismiss}
        className="state-layer tap-target -m-1 ml-auto flex shrink-0 items-center justify-center rounded p-1"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
