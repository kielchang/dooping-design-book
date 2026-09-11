import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, userEvent } from "@storybook/test";
import { Plus } from "lucide-react";
import { PageHeader, BackLink, Breadcrumb, type PageLinkProps } from "./page-header";
import { Badge } from "./badge";
import { Button } from "./button";
import { demoProfile, demoRecords } from "../demo/sample-data";

// 頁首是「頁面解剖」第①區的元件化。四支 story 各驗一條規範：
// 一頁一個 h1、返回是真連結、麵包屑末項是目前頁、SPA 宿主注入的連結真的接得上。
const meta: Meta = { title: "元件/外殼/頁首 PageHeader" };
export default meta;
type Story = StoryObj;

export const 典型組成: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="項目清單"
        meta={`共 ${demoRecords.length} 筆・最後更新 2024-02-07`}
        actions={<Button><Plus /> 新增項目</Button>}
      />
    </div>
  ),
  // 契約：h1 恰一個（標題階層的可執行斷言）、主要動作在頁首而不是內容區。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    await expect(headings[0]).toHaveTextContent("項目清單");
    await expect(canvas.getByRole("button", { name: /新增項目/ })).toBeVisible();
  },
};

export const 明細頁的返回入口: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        nav={<BackLink href="#/records" />}
        title={demoProfile.name}
        badges={
          <>
            <Badge variant="outline">{demoProfile.code}</Badge>
            <Badge variant="success">啟用中</Badge>
          </>
        }
        actions={<Button variant="outline" size="sm">匯出</Button>}
      />
    </div>
  ),
  // 契約：返回是真 <a href>，不是 <button> 加 history.back()——
  // 直接開連結進來的人沒有「上一頁」可回。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const back = canvas.getByRole("link", { name: /返回清單/ });
    await expect(back).toHaveAttribute("href", "#/records");
    expect(back.tagName).toBe("A");
    // 反向：同一個名字查不到 button，證明它真的不是按鈕
    expect(canvas.queryByRole("button", { name: /返回清單/ })).toBeNull();
    expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  },
};

export const 三層以上用麵包屑: Story = {
  render: () => (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        nav={
          <Breadcrumb
            items={[
              { label: "基本資料", href: "#/master" },
              { label: "單位", href: "#/master/units" },
              { label: demoProfile.name },
            ]}
          />
        }
        title={demoProfile.name}
        meta={`代號 ${demoProfile.code}`}
      />
    </div>
  ),
  // 契約：導覽地標有名字、末項是目前頁（aria-current）且不可點、上層仍是連結。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "所在位置" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(2);
    await expect(links[0]).toHaveTextContent("基本資料");
    const current = within(nav).getByText(demoProfile.name);
    await expect(current).toHaveAttribute("aria-current", "page");
    // 目前頁做成連結就會多一個 link——反向斷言擋住這種回歸
    expect(within(nav).queryByRole("link", { name: demoProfile.name })).toBeNull();
  },
};

function RouterLinkDemo() {
  // 模擬 SPA 路由：攔下點擊、只改內部路徑。真實宿主換成 react-router 的
  // `({ href, ...props }) => <Link to={href} {...props} />`。
  const [path, setPath] = useState("/detail/R-2401");
  const renderLink = ({ href, ...props }: PageLinkProps) => (
    <a
      {...props}
      href={href}
      data-router-link=""
      onClick={(e) => {
        e.preventDefault();
        setPath(href);
      }}
    />
  );
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader nav={<BackLink href="/records" renderLink={renderLink} />} title={demoProfile.name} />
      <div className="space-y-2 border-t pt-4">
        <p className="text-xs text-muted-foreground">三層以上的頁面換成麵包屑，同一個注入點：</p>
        <Breadcrumb
          items={[
            { label: "基本資料", href: "/master" },
            { label: "單位", href: "/master/units" },
            { label: demoProfile.name },
          ]}
          renderLink={renderLink}
        />
      </div>
      <p className="text-sm">
        目前路徑：<code data-testid="router-path">{path}</code>
      </p>
    </div>
  );
}

export const 注入路由連結: Story = {
  render: () => <RouterLinkDemo />,
  // 契約：renderLink 注入的元件拿到 href 與內容、按鈕外觀照樣經 asChild 合併進去；
  // 點擊交給注入端處理（SPA 不整頁重載）；麵包屑末項仍不經注入、不是連結。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const path = canvas.getByTestId("router-path");
    const back = canvas.getByRole("link", { name: /返回清單/ });
    await expect(back).toHaveAttribute("href", "/records");
    await expect(back).toHaveAttribute("data-router-link");
    await expect(back).toHaveClass("text-muted-foreground");
    await userEvent.click(back);
    await expect(path).toHaveTextContent(/^\/records$/);

    const nav = canvas.getByRole("navigation", { name: "所在位置" });
    const crumb = within(nav).getByRole("link", { name: "基本資料" });
    await expect(crumb).toHaveAttribute("data-router-link");
    await userEvent.click(crumb);
    await expect(path).toHaveTextContent(/^\/master$/);
    expect(within(nav).queryByRole("link", { name: demoProfile.name })).toBeNull();
  },
};
