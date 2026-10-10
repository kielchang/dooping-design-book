// 規則正本：packages/react/src/lib/nav.ts 檔頭、book/docs/4-patterns/11-back-office-ia.mdx。
// isNavActive 的多層 fallback 是純函式——側欄與指令面板共用的 active 判定，
// 在這裡直接驗，不用開瀏覽器。判定錯的症狀是「使用者在 A 頁、側欄亮著 B」，
// 那會直接摧毀「我在哪」的信任。
// safeNavUrl 是導覽連結的網址白名單：導覽資料可能來自後台設定，javascript:／data: 點下去會執行內容。
import { describe, it, expect } from "vitest";
import { findActiveNavLeaf, isNavActive, isNavAction, safeNavUrl, type NavGroup } from "../packages/react/src/lib/nav";
import { because } from "./lib/guard";

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

// 外殼用 findActiveNavLeaf 推「目前在哪個應用／哪一區」——推錯的症狀與 isNavActive 一樣：
// 側欄亮著 A 應用、頂部選單卻是 B 應用的功能。
describe("findActiveNavLeaf", () => {
  const groups: NavGroup[] = [
    {
      title: "每日作業",
      items: [
        { title: "工作台", url: "/workbench" },
        { title: "新增紀錄", action: "new-record", shortcut: "Ctrl N" },
      ],
    },
    {
      title: "主檔與設定",
      items: [
        {
          title: "系統設定",
          items: [
            { title: "一般", url: "/settings" },
            { title: "外觀", url: "/settings/appearance" },
          ],
        },
      ],
    },
    { title: "說明", items: [{ title: "操作手冊", url: "https://example.com/manual", external: true }] },
  ];

  it("找出葉節點與它的分組", () => {
    const hit = findActiveNavLeaf(groups, "/workbench?tab=a");
    expect(hit?.item.title).toBe("工作台");
    expect(hit?.group.title).toBe("每日作業");
    expect(hit?.parent).toBeUndefined();
  });

  it("父子路徑同時符合時取 url 最長者，並帶出兩層的父群組", () => {
    const hit = findActiveNavLeaf(groups, "/settings/appearance");
    expect(hit?.item.title).toBe("外觀");
    expect(hit?.parent?.title).toBe("系統設定");
    expect(findActiveNavLeaf(groups, "/settings/other")?.item.title).toBe("一般");
  });

  it("沒有符合就是 undefined；動作項與外部連結不參與", () => {
    expect(findActiveNavLeaf(groups, "/nowhere")).toBeUndefined();
    expect(findActiveNavLeaf(groups, "https://example.com/manual")).toBeUndefined();
  });

  it("宿主可覆寫 active 判定（跨系統部署的絕對網址靠這個）", () => {
    const apps: NavGroup[] = [
      { title: "常用", items: [{ title: "甲", url: "https://a.example.com/" }, { title: "乙", url: "https://b.example.com/" }] },
    ];
    expect(findActiveNavLeaf(apps, "/anything")).toBeUndefined();
    const hit = findActiveNavLeaf(apps, "/anything", (item) => item.title === "乙");
    expect(hit?.item.title).toBe("乙");
  });
});

describe("isNavAction", () => {
  it("只認帶 action 代號的項目", () => {
    expect(isNavAction({ title: "新增紀錄", action: "new-record" })).toBe(true);
    expect(isNavAction({ title: "工作台", url: "/workbench" })).toBe(false);
    expect(isNavAction({ title: "系統設定", items: [] })).toBe(false);
  });
});

describe("safeNavUrl：導覽連結的網址白名單", () => {
  const RULE = "packages/react/src/lib/nav.ts 的 safeNavUrl 說明";
  const WHY = "導覽資料可能來自後台設定；javascript:、data: 這類網址點下去會執行內容，React 18 不擋";

  it("相對路徑、http、https、mailto、tel 原樣放行", () => {
    for (const url of ["/workbench", "reports?tab=1", "../up", "#section", "?q=1", "//cdn.example.test/x",
      "https://example.test/a", "http://example.test", "mailto:team@example.test", "tel:+886212345678"]) {
      expect(safeNavUrl(url), because(`「${url}」是安全的網址，要原樣放行`, WHY, RULE)).toBe(url);
    }
  });

  it("會執行內容的網址換成 #，含大小寫、開頭空白、夾 Tab 換行的變形", () => {
    for (const url of ["javascript:alert(1)", "JavaScript:alert(1)", " javascript:alert(1)", "java\tscript:alert(1)",
      "java\nscript:alert(1)", "data:text/html,<b>x</b>", "vbscript:msgbox(1)", "file:///etc/passwd"]) {
      expect(safeNavUrl(url), because(`「${JSON.stringify(url)}」要被擋成 #`, WHY, RULE)).toBe("#");
    }
  });
});
