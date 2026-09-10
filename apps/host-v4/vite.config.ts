import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// 取用端的標準 Vite 設定——刻意沒有任何「因為在設計書 repo 裡」才有的捷徑：
// 不 alias 到 packages/*/src，元件一律從 src/components/dooping 取（registry 抄進來的那份），
// token 一律從 node_modules/@dooping/tokens 取（workspace 連結，等同 npm 安裝）。
export default defineConfig({
  // 預覽站部署在 /dooping-design-book/preview/host/；本機開發是根目錄
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
