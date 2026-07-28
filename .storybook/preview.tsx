import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "./styles.css";

/**
 * 主題切換掛在 `document.documentElement` 而不是包一層 div：
 * Dialog / Select / Tooltip 走 portal 掛到 body，只切 wrapper 的 class 會讓浮層抓不到深色樣式。
 * 同時掛 `.dark` 與 `data-theme`，順便驗證 token 的兩種宿主鉤子都有效。
 */
function ThemeSwitch({ theme, children }: { theme: "light" | "dark"; children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
  }, [theme]);
  return <>{children}</>;
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeSwitch theme={context.globals.theme}>
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
  },
};

export default preview;
