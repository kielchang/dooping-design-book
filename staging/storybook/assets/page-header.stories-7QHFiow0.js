import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as L}from"./index-UiW3gZKV.js";import{within as i,expect as a,userEvent as p}from"./index-DH-M5T-F.js";import{P as x,a as N,B as E}from"./page-header-CU3Aot3D.js";import{B as g}from"./badge-BUiC31UU.js";import{B as C}from"./button-DyXVXefs.js";import{d as o,a as T}from"./sample-data-I9KaR9SF.js";import{P as $}from"./plus-Bz5CK1Id.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-CMl-9ImW.js";import"./chevron-right-DWuV1wB0.js";import"./createLucideIcon-BcR0bl2m.js";import"./index-BOrUEQ0c.js";import"./index-VXoYh6zd.js";const W={title:"元件/外殼/頁首 PageHeader"},m={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(x,{title:"項目清單",meta:`共 ${T.length} 筆・最後更新 2024-02-07`,actions:e.jsxs(C,{children:[e.jsx($,{})," 新增項目"]})})}),play:async({canvasElement:s})=>{const n=i(s),t=n.getAllByRole("heading",{level:1});a(t).toHaveLength(1),await a(t[0]).toHaveTextContent("項目清單"),await a(n.getByRole("button",{name:/新增項目/})).toBeVisible()}},d={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(x,{nav:e.jsx(E,{href:"#/records"}),title:o.name,badges:e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"outline",children:o.code}),e.jsx(g,{variant:"success",children:"啟用中"})]}),actions:e.jsx(C,{variant:"outline",size:"sm",children:"匯出"})})}),play:async({canvasElement:s})=>{const n=i(s),t=n.getByRole("link",{name:/返回清單/});await a(t).toHaveAttribute("href","#/records"),a(t.tagName).toBe("A"),a(n.queryByRole("button",{name:/返回清單/})).toBeNull(),a(n.getAllByRole("heading",{level:1})).toHaveLength(1)}},u={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(x,{nav:e.jsx(N,{items:[{label:"基本資料",href:"#/master"},{label:"單位",href:"#/master/units"},{label:o.name}]}),title:o.name,meta:`代號 ${o.code}`})}),play:async({canvasElement:s})=>{const t=i(s).getByRole("navigation",{name:"所在位置"}),r=i(t).getAllByRole("link");a(r).toHaveLength(2),await a(r[0]).toHaveTextContent("基本資料");const c=i(t).getByText(o.name);await a(c).toHaveAttribute("aria-current","page"),a(i(t).queryByRole("link",{name:o.name})).toBeNull()}};function q(){const[s,n]=L.useState("/detail/R-2401"),t=({href:r,...c})=>e.jsx("a",{...c,href:r,"data-router-link":"",onClick:l=>{l.preventDefault(),n(r)}});return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-6",children:[e.jsx(x,{nav:e.jsx(E,{href:"/records",renderLink:t}),title:o.name}),e.jsxs("div",{className:"space-y-2 border-t pt-4",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"三層以上的頁面換成麵包屑，同一個注入點："}),e.jsx(N,{items:[{label:"基本資料",href:"/master"},{label:"單位",href:"/master/units"},{label:o.name}],renderLink:t})]}),e.jsxs("p",{className:"text-sm",children:["目前路徑：",e.jsx("code",{"data-testid":"router-path",children:s})]})]})}const v={render:()=>e.jsx(q,{}),play:async({canvasElement:s})=>{const n=i(s),t=n.getByTestId("router-path"),r=n.getByRole("link",{name:/返回清單/});await a(r).toHaveAttribute("href","/records"),await a(r).toHaveAttribute("data-router-link"),await a(r).toHaveClass("text-muted-foreground"),await p.click(r),await a(t).toHaveTextContent(/^\/records$/);const c=n.getByRole("navigation",{name:"所在位置"}),l=i(c).getByRole("link",{name:"基本資料"});await a(l).toHaveAttribute("data-router-link"),await p.click(l),await a(t).toHaveTextContent(/^\/master$/),a(i(c).queryByRole("link",{name:o.name})).toBeNull()}};var h,B,y;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="mx-auto max-w-5xl">
      <PageHeader title="項目清單" meta={\`共 \${demoRecords.length} 筆・最後更新 2024-02-07\`} actions={<Button><Plus /> 新增項目</Button>} />
    </div>,
  // 契約：h1 恰一個（標題階層的可執行斷言）、主要動作在頁首而不是內容區。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading", {
      level: 1
    });
    expect(headings).toHaveLength(1);
    await expect(headings[0]).toHaveTextContent("項目清單");
    await expect(canvas.getByRole("button", {
      name: /新增項目/
    })).toBeVisible();
  }
}`,...(y=(B=m.parameters)==null?void 0:B.docs)==null?void 0:y.source}}};var b,k,w;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="mx-auto max-w-5xl">
      <PageHeader nav={<BackLink href="#/records" />} title={demoProfile.name} badges={<>
            <Badge variant="outline">{demoProfile.code}</Badge>
            <Badge variant="success">啟用中</Badge>
          </>} actions={<Button variant="outline" size="sm">匯出</Button>} />
    </div>,
  // 契約：返回是真 <a href>，不是 <button> 加 history.back()——
  // 直接開連結進來的人沒有「上一頁」可回。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const back = canvas.getByRole("link", {
      name: /返回清單/
    });
    await expect(back).toHaveAttribute("href", "#/records");
    expect(back.tagName).toBe("A");
    // 反向：同一個名字查不到 button，證明它真的不是按鈕
    expect(canvas.queryByRole("button", {
      name: /返回清單/
    })).toBeNull();
    expect(canvas.getAllByRole("heading", {
      level: 1
    })).toHaveLength(1);
  }
}`,...(w=(k=d.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var f,H,R;u.parameters={...u.parameters,docs:{...(f=u.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="mx-auto max-w-5xl">
      <PageHeader nav={<Breadcrumb items={[{
      label: "基本資料",
      href: "#/master"
    }, {
      label: "單位",
      href: "#/master/units"
    }, {
      label: demoProfile.name
    }]} />} title={demoProfile.name} meta={\`代號 \${demoProfile.code}\`} />
    </div>,
  // 契約：導覽地標有名字、末項是目前頁（aria-current）且不可點、上層仍是連結。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", {
      name: "所在位置"
    });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(2);
    await expect(links[0]).toHaveTextContent("基本資料");
    const current = within(nav).getByText(demoProfile.name);
    await expect(current).toHaveAttribute("aria-current", "page");
    // 目前頁做成連結就會多一個 link——反向斷言擋住這種回歸
    expect(within(nav).queryByRole("link", {
      name: demoProfile.name
    })).toBeNull();
  }
}`,...(R=(H=u.parameters)==null?void 0:H.docs)==null?void 0:R.source}}};var j,P,A;v.parameters={...v.parameters,docs:{...(j=v.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <RouterLinkDemo />,
  // 契約：renderLink 注入的元件拿到 href 與內容、按鈕外觀照樣經 asChild 合併進去；
  // 點擊交給注入端處理（SPA 不整頁重載）；麵包屑末項仍不經注入、不是連結。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const path = canvas.getByTestId("router-path");
    const back = canvas.getByRole("link", {
      name: /返回清單/
    });
    await expect(back).toHaveAttribute("href", "/records");
    await expect(back).toHaveAttribute("data-router-link");
    await expect(back).toHaveClass("text-muted-foreground");
    await userEvent.click(back);
    await expect(path).toHaveTextContent(/^\\/records$/);
    const nav = canvas.getByRole("navigation", {
      name: "所在位置"
    });
    const crumb = within(nav).getByRole("link", {
      name: "基本資料"
    });
    await expect(crumb).toHaveAttribute("data-router-link");
    await userEvent.click(crumb);
    await expect(path).toHaveTextContent(/^\\/master$/);
    expect(within(nav).queryByRole("link", {
      name: demoProfile.name
    })).toBeNull();
  }
}`,...(A=(P=v.parameters)==null?void 0:P.docs)==null?void 0:A.source}}};const X=["典型組成","明細頁的返回入口","三層以上用麵包屑","注入路由連結"];export{X as __namedExportsOrder,W as default,u as 三層以上用麵包屑,m as 典型組成,d as 明細頁的返回入口,v as 注入路由連結};
