// isNavActive 的多層 fallback 是純函式——側欄與指令面板共用的 active 判定，
// 在這裡直接驗，不用開瀏覽器。判定錯的症狀是「使用者在 A 頁、側欄亮著 B」，
// 那會直接摧毀「我在哪」的信任。
import { describe, it, expect } from "vitest";
import { isNavActive } from "../packages/react/src/lib/nav";

describe("isNavActive", () => {
  it("完整相符", () => {
    expect(isNavActive("/workbench", "/workbench")).toBe(true);
    expect(isNavActive("/workbench", "/reports")).toBe(false);
  });

  it("去 query/hash 與尾斜線後相符", () => {
    expect(isNavActive("/master", "/master?tab=records&id=C-1043")).toBe(true);
    expect(isNavActive("/master", "/master#section")).toBe(true);
    expect(isNavActive("/master/", "/master")).toBe(true);
    expect(isNavActive("/master", "/master/")).toBe(true);
  });

  it("路徑邊界上的父路徑相符（子頁時父項也亮）", () => {
    expect(isNavActive("/settings", "/settings/appearance")).toBe(true);
    expect(isNavActive("/settings", "/settings/appearance?tab=a")).toBe(true);
  });

  it("不在邊界上的前綴不算（/master 不因 /master-data 而亮）", () => {
    expect(isNavActive("/master", "/master-data")).toBe(false);
  });

  it("exact 模式關掉父路徑比對", () => {
    expect(isNavActive("/settings", "/settings/appearance", { exact: true })).toBe(false);
    expect(isNavActive("/settings", "/settings", { exact: true })).toBe(true);
  });

  it("根路徑只完整相符，不做前綴比對（否則永遠 active）", () => {
    expect(isNavActive("/", "/")).toBe(true);
    expect(isNavActive("/", "/workbench")).toBe(false);
  });

  it("外部連結不參與 active", () => {
    expect(isNavActive("https://example.com/manual", "https://example.com/manual")).toBe(false);
    expect(isNavActive("", "/workbench")).toBe(false);
  });
});
