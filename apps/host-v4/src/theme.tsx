import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, themeMeta } from "@dooping/tokens";

export type Mode = "light" | "dark";
export interface ThemeState {
  mode: Mode;
  color: string;
}

/** 與 index.html 首繪前的那段腳本共用同一個儲存鍵 */
const KEY = "dooping-host-theme";

/** 主題清單從 token 讀——加一組主題只要改 tokens，這裡不必動（手列就是第二份真相）。 */
export const COLOR_THEMES = themeMeta();

function readSaved(): ThemeState {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<ThemeState> | null;
    if (v) {
      return {
        mode: v.mode === "dark" ? "dark" : "light",
        color: COLOR_THEMES.some((t) => t.name === v.color) ? (v.color as string) : DEFAULT_THEME,
      };
    }
  } catch {
    // 私密視窗或瀏覽器封鎖儲存：用預設值
  }
  return { mode: "light", color: DEFAULT_THEME };
}

/**
 * 明暗與色相主題都掛在 documentElement（AGENTS.md 不可改的契約第 3 條）：
 * Dialog／Select／Tooltip 走 portal 掛到 body，只切 wrapper 的屬性它們抓不到。
 * 預設主題不設 data-color-theme——那是「宿主什麼都不設」的原生狀態。
 */
function apply({ mode, color }: ThemeState) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-theme", mode);
  if (color === DEFAULT_THEME) root.removeAttribute("data-color-theme");
  else root.setAttribute("data-color-theme", color);
}

type ThemeContextValue = readonly [ThemeState, (next: ThemeState) => void];
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(readSaved);
  useEffect(() => {
    apply(state);
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...state, defaultColor: DEFAULT_THEME }));
    } catch {
      // 同上
    }
  }, [state]);
  return <ThemeContext.Provider value={[state, setState]}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme 必須在 ThemeProvider 之內使用");
  return value;
}
