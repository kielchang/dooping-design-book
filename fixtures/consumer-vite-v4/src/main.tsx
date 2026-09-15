import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./globals.css";

// 驗收用的主題切換：?theme=<主題名>（預設主題不必設）、?mode=dark。
// 取用端自己的主題切換怎麼做不在驗收範圍——這裡只負責在渲染前把兩個屬性掛上 <html>。
const params = new URLSearchParams(window.location.search);
const theme = params.get("theme");
if (theme) document.documentElement.setAttribute("data-color-theme", theme);
if (params.get("mode") === "dark") document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
