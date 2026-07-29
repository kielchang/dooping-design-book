import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import { themeMeta, DEFAULT_THEME } from "@dooping/tokens";
import "./styles.css";

/**
 * 兩個維度都掛在 `document.documentElement`，不是包一層 div：
 * Dialog / Select / Tooltip 走 portal 掛到 body，只切 wrapper 的屬性會讓浮層抓不到樣式。
 *
 * - `.dark` + `data-theme` —— 明暗。同時掛兩個，順便驗證 token 的兩種宿主鉤子都有效。
 * - `data-color-theme` —— 色相主題。與明暗**正交**，六組 × 兩模式共 12 種組合。
 */
function ThemeSwitch({
  theme,
  colorTheme,
  children,
}: {
  theme: "light" | "dark";
  colorTheme: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    // 預設主題直接寫在 :root，不設屬性才是它的原生狀態——
    // 設成 data-color-theme="graphite" 也會對，但那樣就驗不到「宿主什麼都不設」的路徑。
    if (colorTheme === DEFAULT_THEME) root.removeAttribute("data-color-theme");
    else root.setAttribute("data-color-theme", colorTheme);
  }, [colorTheme]);

  return <>{children}</>;
}

// 主題清單直接從 token 讀，不在這裡列舉——加一組主題只要改 generate-theme.mjs，
// 工具列會自己長出來。手動列舉會變成第二份真相，而且一定會忘記同步。
const COLOR_THEMES = themeMeta();

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeSwitch theme={context.globals.theme} colorTheme={context.globals.colorTheme}>
        <div className="bg-background p-4 text-foreground">
          <Story />
        </div>
      </ThemeSwitch>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    options: { storySort: { order: ["基礎", "元件", ["基礎", "表單", "資料", "狀態", "浮層", "引導", "文件示意"]] } },
  },
  globalTypes: {
    theme: {
      description: "淺色／深色版面",
      defaultValue: "light",
      toolbar: {
        title: "主題",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "淺色" },
          { value: "dark", icon: "moon", title: "深色" },
        ],
        dynamicTitle: true,
      },
    },
    colorTheme: {
      description: "色相主題（宿主端設 data-color-theme 切換）",
      defaultValue: DEFAULT_THEME,
      toolbar: {
        title: "色相",
        icon: "paintbrush",
        items: COLOR_THEMES.map((t) => ({
          value: t.name,
          title: `${t.label} ${t.hue}°`,
        })),
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
