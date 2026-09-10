import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{within as o,expect as r,userEvent as s,waitFor as c}from"./index-DH-M5T-F.js";import{A as H,S as N,a as q,b as F,c as T,d as D,e as P,B as O,C as L,f as _,D as V,F as G,g as I,h as Q,L as z,i as K}from"./separator-CkbsE_i-.js";import{B as J}from"./badge-Cl3jk1vO.js";import{C as M,a as U,d as W,c as X}from"./card-B8B3JnhV.js";import{b as Y}from"./sample-data-I9KaR9SF.js";import"./createLucideIcon-BcR0bl2m.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-DBXtLcuW.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./dropdown-menu-Hfmcpkw1.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./index-CLEGCNc0.js";import"./check-CZys2X9e.js";import"./index-C-xWP-pl.js";import"./button-Cw_3_x2n.js";import"./index-C9IEqVQG.js";import"./tooltip-CyZzvjef.js";import"./chevron-right-DWuV1wB0.js";const Ae={title:"元件/外殼/應用外殼・側邊欄"},Z={工作台:K,批次結算:z,存量清查:Q,用量分析:I,報表中心:G,基本資料:V,系統設定:_,使用說明:L,操作手冊:O},$=Y.map(n=>({...n,items:n.items.map(a=>({...a,icon:Z[a.title]}))})),ee=n=>e.jsx("a",{...n,onClick:a=>{var t;a.preventDefault(),(t=n.onClick)==null||t.call(n,a)}}),te="(max-width: 0px)";function g({currentPath:n,mobileQuery:a=te,defaultOpen:t}){return e.jsx(H,{mobileQuery:a,defaultOpen:t,sidebar:e.jsxs(F,{children:[e.jsx(T,{children:e.jsxs("div",{className:"flex h-9 items-center gap-2 px-2 font-semibold",children:[e.jsx("span",{className:"flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground",children:"帳"}),e.jsx("span",{className:"truncate group-data-[state=collapsed]/sidebar:sr-only",children:"內部作業系統"})]})}),e.jsx(D,{children:e.jsx(P,{groups:$,currentPath:n,renderLink:ee})})]}),header:e.jsxs(e.Fragment,{children:[e.jsx(N,{}),e.jsx(q,{orientation:"vertical",className:"h-5"}),e.jsx("span",{className:"text-sm font-medium",children:"工作台"}),e.jsx("a",{href:"#pending",onClick:i=>i.preventDefault(),className:"ml-auto",children:e.jsx(J,{variant:"warning",children:"待處理 3 項"})})]}),children:e.jsxs(M,{children:[e.jsx(U,{children:e.jsx(W,{children:"主內容區"})}),e.jsx(X,{className:"text-sm text-muted-foreground",children:"外殼只管佈局：側欄分區與順序照〈後台系統的資訊架構〉的工作節奏分區， 路由與資料一律由宿主提供。"})]})})}const m={render:()=>e.jsx(g,{currentPath:"/workbench"}),play:async({canvasElement:n})=>{const t=o(n).getByRole("navigation",{name:"主導覽"}),i=o(t).getByRole("link",{name:/工作台/});await r(i).toHaveAttribute("aria-current","page"),await r(o(t).getByText("試算")).toBeVisible(),r(o(t).getAllByText("例行").length).toBeGreaterThanOrEqual(2);const l=o(t).getByRole("link",{name:/操作手冊/});await r(l).toHaveAttribute("target","_blank")}},p={render:()=>e.jsx(g,{currentPath:"/workbench"}),play:async({canvasElement:n})=>{const a=o(n),t=n.ownerDocument,i=a.getByRole("button",{name:"切換側邊欄"});await s.click(i);const l=n.querySelector("aside");await c(()=>r(l).toHaveAttribute("data-state","collapsed")),await r(i).toHaveAttribute("aria-expanded","false");const u=a.getByRole("link",{name:/工作台/});await s.hover(u);const d=await a.findByRole("tooltip");await r(d).toHaveTextContent("工作台"),await s.unhover(u),await s.click(a.getByRole("button",{name:/系統設定/}));const C=await o(t.body).findByRole("menu");await r(o(C).getByRole("menuitem",{name:"外觀"})).toBeInTheDocument(),await s.keyboard("{Escape}"),await c(()=>r(o(t.body).queryByRole("menu")).toBeNull()),await s.click(i),await c(()=>r(l).toHaveAttribute("data-state","expanded"))}},w={render:()=>e.jsx(g,{currentPath:"/settings/appearance"}),play:async({canvasElement:n})=>{const a=o(n),t=a.getByRole("button",{name:/系統設定/});await r(t).toHaveAttribute("aria-expanded","true");const i=a.getByRole("link",{name:"外觀"});await r(i).toHaveAttribute("aria-current","page"),await s.click(t),await c(()=>r(t).toHaveAttribute("aria-expanded","false")),await c(()=>r(a.queryByRole("link",{name:"外觀"})).toBeNull()),await s.click(t),await c(()=>r(a.getByRole("link",{name:"外觀"})).toBeVisible())}},y={render:()=>e.jsx(g,{currentPath:"/workbench",mobileQuery:"(min-width: 0px)"}),play:async({canvasElement:n})=>{const a=n.ownerDocument,t=o(a.body),i=o(n).getByRole("button",{name:"切換側邊欄"});await s.click(i);const l=await t.findByRole("dialog",{name:"主導覽"}),u=Array.from(l.querySelectorAll("[class*='text-xs']")).map(d=>d.textContent).filter(d=>["每日作業","規劃與分析","報表","主檔與設定","說明"].includes(d??""));r(u.slice(0,2)).toEqual(["每日作業","規劃與分析"]),await s.click(o(l).getByRole("link",{name:/批次結算/})),await c(()=>r(t.queryByRole("dialog")).toBeNull()),await s.click(i),await t.findByRole("dialog",{name:"主導覽"}),await s.keyboard("{Escape}"),await c(()=>r(t.queryByRole("dialog")).toBeNull()),await c(()=>r(a.activeElement).toBe(i))}};var x,v,b;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <Shell currentPath="/workbench" />,
  // 契約:導覽地標有名字、目前頁 aria-current、例行/試算標籤是文字不是顏色。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", {
      name: "主導覽"
    });
    const current = within(nav).getByRole("link", {
      name: /工作台/
    });
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByText("試算")).toBeVisible();
    expect(within(nav).getAllByText("例行").length).toBeGreaterThanOrEqual(2);
    // 外連結另開分頁且不參與 active
    const external = within(nav).getByRole("link", {
      name: /操作手冊/
    });
    await expect(external).toHaveAttribute("target", "_blank");
  }
}`,...(b=(v=m.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var h,B,k;p.parameters={...p.parameters,docs:{...(h=p.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Shell currentPath="/workbench" />,
  // 契約：收合後寬度換擋、名稱仍在（sr-only）、hover 圖示出提示、兩層群組改右彈選單。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const trigger = canvas.getByRole("button", {
      name: "切換側邊欄"
    });
    await userEvent.click(trigger);
    const aside = canvasElement.querySelector("aside");
    await waitFor(() => expect(aside).toHaveAttribute("data-state", "collapsed"));
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    // 收合後連結的可及名稱不能消失
    const link = canvas.getByRole("link", {
      name: /工作台/
    });
    await userEvent.hover(link);
    const tip = await canvas.findByRole("tooltip");
    await expect(tip).toHaveTextContent("工作台");
    await userEvent.unhover(link);
    // 兩層群組在收合態改成往右彈出
    await userEvent.click(canvas.getByRole("button", {
      name: /系統設定/
    }));
    const menu = await within(doc.body).findByRole("menu");
    await expect(within(menu).getByRole("menuitem", {
      name: "外觀"
    })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(doc.body).queryByRole("menu")).toBeNull());
    // 收尾：展開回來，別讓視覺掃描拿到收合畫面
    await userEvent.click(trigger);
    await waitFor(() => expect(aside).toHaveAttribute("data-state", "expanded"));
  }
}`,...(k=(B=p.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var R,E,f;w.parameters={...w.parameters,docs:{...(R=w.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <Shell currentPath="/settings/appearance" />,
  // 契約：含 active 子項的群組初始就展開、trigger 的 aria-expanded 跟著開合。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const groupBtn = canvas.getByRole("button", {
      name: /系統設定/
    });
    await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
    const sub = canvas.getByRole("link", {
      name: "外觀"
    });
    await expect(sub).toHaveAttribute("aria-current", "page");
    await userEvent.click(groupBtn);
    await waitFor(() => expect(groupBtn).toHaveAttribute("aria-expanded", "false"));
    await waitFor(() => expect(canvas.queryByRole("link", {
      name: "外觀"
    })).toBeNull());
    await userEvent.click(groupBtn);
    await waitFor(() => expect(canvas.getByRole("link", {
      name: "外觀"
    })).toBeVisible());
  }
}`,...(f=(E=w.parameters)==null?void 0:E.docs)==null?void 0:f.source}}};var j,A,S;y.parameters={...y.parameters,docs:{...(j=y.parameters)==null?void 0:j.docs,source:{originalSource:`{
  // 用 mobileQuery 強制行動版（確定性），不賭 viewport addon 在守衛環境的行為
  render: () => <Shell currentPath="/workbench" mobileQuery="(min-width: 0px)" />,
  // 契約：抽屜有可及名稱、分區順序與桌面一致、點連結即關、Esc 關閉焦點歸還。
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "切換側邊欄"
    });
    await userEvent.click(trigger);
    const drawer = await body.findByRole("dialog", {
      name: "主導覽"
    });
    // 分區與順序完全不變（back-office-ia 的行動版規範）
    const labels = Array.from(drawer.querySelectorAll("[class*='text-xs']")).map(el => el.textContent).filter(t => ["每日作業", "規劃與分析", "報表", "主檔與設定", "說明"].includes(t ?? ""));
    expect(labels.slice(0, 2)).toEqual(["每日作業", "規劃與分析"]);
    // 點選目的地即關抽屜
    await userEvent.click(within(drawer).getByRole("link", {
      name: /批次結算/
    }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    // 重開後 Esc 關閉、焦點回到觸發鈕
    await userEvent.click(trigger);
    await body.findByRole("dialog", {
      name: "主導覽"
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  }
}`,...(S=(A=y.parameters)==null?void 0:A.docs)==null?void 0:S.source}}};const Se=["典型組成","收合成圖示欄","群組展開與鍵盤","行動版抽屜"];export{Se as __namedExportsOrder,Ae as default,m as 典型組成,p as 收合成圖示欄,w as 群組展開與鍵盤,y as 行動版抽屜};
