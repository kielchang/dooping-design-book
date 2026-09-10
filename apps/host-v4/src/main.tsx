import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastProvider } from "@/components/dooping/toast";
import { ThemeProvider } from "./theme";
import { App } from "./app";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* basename 跟著 Vite 的 base 走：本機是 /，預覽站是 /dooping-design-book/preview/host/ */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
