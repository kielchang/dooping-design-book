import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{within as s,expect as a}from"./index-DH-M5T-F.js";import{P as m,a as H,B as R}from"./page-header-BOlFrVHG.js";import{B as v}from"./badge-B-Xe92Tx.js";import{B as w}from"./button-PlLiai67.js";import{d as o,a as P}from"./sample-data-I9KaR9SF.js";import{P as j}from"./plus-Bz5CK1Id.js";import"./utils-pm6Xa0Qd.js";import"./chevron-right-DWuV1wB0.js";import"./createLucideIcon-BcR0bl2m.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-rhYpeUg2.js";import"./index-VXoYh6zd.js";const D={title:"元件/外殼/頁首 PageHeader"},i={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(m,{title:"項目清單",meta:`共 ${P.length} 筆・最後更新 2024-02-07`,actions:e.jsxs(w,{children:[e.jsx(j,{})," 新增項目"]})})}),play:async({canvasElement:r})=>{const t=s(r),n=t.getAllByRole("heading",{level:1});a(n).toHaveLength(1),await a(n[0]).toHaveTextContent("項目清單"),await a(t.getByRole("button",{name:/新增項目/})).toBeVisible()}},l={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(m,{nav:e.jsx(R,{href:"#/records"}),title:o.name,badges:e.jsxs(e.Fragment,{children:[e.jsx(v,{variant:"outline",children:o.code}),e.jsx(v,{variant:"success",children:"啟用中"})]}),actions:e.jsx(w,{variant:"outline",size:"sm",children:"匯出"})})}),play:async({canvasElement:r})=>{const t=s(r),n=t.getByRole("link",{name:/返回清單/});await a(n).toHaveAttribute("href","#/records"),a(n.tagName).toBe("A"),a(t.queryByRole("button",{name:/返回清單/})).toBeNull(),a(t.getAllByRole("heading",{level:1})).toHaveLength(1)}},c={render:()=>e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsx(m,{nav:e.jsx(H,{items:[{label:"基本資料",href:"#/master"},{label:"單位",href:"#/master/units"},{label:o.name}]}),title:o.name,meta:`代號 ${o.code}`})}),play:async({canvasElement:r})=>{const n=s(r).getByRole("navigation",{name:"所在位置"}),d=s(n).getAllByRole("link");a(d).toHaveLength(2),await a(d[0]).toHaveTextContent("基本資料");const k=s(n).getByText(o.name);await a(k).toHaveAttribute("aria-current","page"),a(s(n).queryByRole("link",{name:o.name})).toBeNull()}};var u,x,g;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(g=(x=i.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var p,B,h;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(h=(B=l.parameters)==null?void 0:B.docs)==null?void 0:h.source}}};var y,b,f;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(f=(b=c.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const G=["典型組成","明細頁的返回入口","三層以上用麵包屑"];export{G as __namedExportsOrder,D as default,c as 三層以上用麵包屑,i as 典型組成,l as 明細頁的返回入口};
