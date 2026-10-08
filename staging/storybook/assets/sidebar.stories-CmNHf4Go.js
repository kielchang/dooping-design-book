import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{within as l,expect as e,userEvent as s,waitFor as o}from"./index-DH-M5T-F.js";import{A as P,S as O,a as _}from"./separator-CFL0eNUs.js";import{S as M,a as V,b as G,c as I}from"./sidebar-COgXC6tD.js";import{B as Q}from"./badge-BUiC31UU.js";import{C as z,a as K,d as J,c as U}from"./card-DlPdB5za.js";import{b as W}from"./sample-data-DgKbD7zu.js";import{B as X,C as Y,S as Z,D as $,F as ee,a as te,b as ae,L as ne,c as ie}from"./settings-k-6vWlhd.js";import"./utils-CMl-9ImW.js";import"./nav-9Puf6Yd8.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./dropdown-menu-q4BwFbGE.js";import"./index-BHxPrZ82.js";import"./index-BmqVfOSQ.js";import"./index-DliohCdJ.js";import"./check-CZys2X9e.js";import"./createLucideIcon-BcR0bl2m.js";import"./chevron-right-DWuV1wB0.js";import"./index-C-xWP-pl.js";import"./button-DyXVXefs.js";import"./index-BOrUEQ0c.js";import"./tooltip-BWkzAh2F.js";const Pe={title:"元件/外殼/應用外殼・側邊欄"},re={工作台:ie,批次結算:ne,存量清查:ae,用量分析:te,報表中心:ee,基本資料:$,系統設定:Z,使用說明:Y,操作手冊:X},oe=W.map(t=>({...t,items:t.items.map(i=>({...i,icon:re[i.title]}))})),se=t=>a.jsx("a",{...t,onClick:i=>{var n;i.preventDefault(),(n=t.onClick)==null||n.call(t,i)}}),ce="(max-width: 0px)";function m({currentPath:t,mobileQuery:i=ce,defaultOpen:n,collapsible:c}){return a.jsx(P,{mobileQuery:i,defaultOpen:n,sidebar:a.jsxs(V,{collapsible:c,children:[a.jsx(G,{children:a.jsxs("div",{className:"flex h-9 items-center gap-2 px-2 font-semibold",children:[a.jsx("span",{className:"flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground",children:"帳"}),a.jsx("span",{className:"truncate group-data-[state=collapsed]/sidebar:sr-only",children:"內部作業系統"})]})}),a.jsx(I,{children:a.jsx(_,{groups:oe,currentPath:t,renderLink:se})})]}),header:a.jsxs(a.Fragment,{children:[a.jsx(M,{}),a.jsx(O,{orientation:"vertical",className:"h-5"}),a.jsx("span",{className:"text-sm font-medium",children:"工作台"}),a.jsx("a",{href:"#pending",onClick:r=>r.preventDefault(),className:"ml-auto",children:a.jsx(Q,{variant:"warning",children:"待處理 3 項"})})]}),children:a.jsxs(z,{children:[a.jsx(K,{children:a.jsx(J,{children:"主內容區"})}),a.jsx(U,{className:"text-sm text-muted-foreground",children:"外殼只管佈局：側欄分區與順序照〈後台系統的資訊架構〉的工作節奏分區， 路由與資料一律由宿主提供。"})]})})}const w={render:()=>a.jsx(m,{currentPath:"/workbench"}),play:async({canvasElement:t})=>{const n=l(t).getByRole("navigation",{name:"主導覽"}),c=l(n).getByRole("link",{name:/工作台/});await e(c).toHaveAttribute("aria-current","page"),await e(l(n).getByText("試算")).toBeVisible(),e(l(n).getAllByText("例行").length).toBeGreaterThanOrEqual(2);const r=l(n).getByRole("link",{name:/操作手冊/});await e(r).toHaveAttribute("target","_blank")}},g={render:()=>a.jsx(m,{currentPath:"/workbench"}),play:async({canvasElement:t})=>{const i=l(t),n=t.ownerDocument,c=i.getByRole("button",{name:"切換側邊欄"});await s.click(c);const r=t.querySelector("aside");await o(()=>e(r).toHaveAttribute("data-state","collapsed")),await e(c).toHaveAttribute("aria-expanded","false");const u=i.getByRole("link",{name:/工作台/});await s.hover(u);const d=await i.findByRole("tooltip");await e(d).toHaveTextContent("工作台"),await s.unhover(u),await s.click(i.getByRole("button",{name:/系統設定/}));const p=await l(n.body).findByRole("menu");await e(l(p).getByRole("menuitem",{name:"外觀"})).toBeInTheDocument(),await s.keyboard("{Escape}"),await o(()=>e(l(n.body).queryByRole("menu")).toBeNull()),await s.click(c),await o(()=>e(r).toHaveAttribute("data-state","expanded"))}},v={render:()=>a.jsx(m,{currentPath:"/workbench",collapsible:"offcanvas"}),play:async({canvasElement:t})=>{const i=l(t),n=t.ownerDocument,c=i.getByRole("button",{name:"切換側邊欄"}),r=t.querySelector("aside"),u=t.querySelector("main"),d=()=>u.getBoundingClientRect().left,p=d();await s.click(c),await o(()=>e(r).toHaveAttribute("inert")),await o(()=>e(r.getBoundingClientRect().right).toBeLessThanOrEqual(0)),await o(()=>e(d()).toBeLessThan(p));const N=d(),x=l(r).getByRole("link",{name:/工作台/,hidden:!0});x.focus(),await e(n.activeElement).not.toBe(x);const D=t.querySelector("[data-sidebar-edge]");await s.hover(D),await o(()=>e(r).toHaveAttribute("data-peek")),await e(r).not.toHaveAttribute("inert"),await o(()=>e(r.getBoundingClientRect().left).toBe(0)),e(d()).toBe(N),await e(c).toHaveAttribute("aria-expanded","false"),await s.keyboard("{Escape}"),await o(()=>e(r).toHaveAttribute("inert")),await s.hover(t.querySelector("[data-sidebar-edge]")),await o(()=>e(r).toHaveAttribute("data-peek")),await s.unhover(r),await o(()=>e(r).not.toHaveAttribute("data-peek")),await e(r).toHaveAttribute("inert"),await s.click(c),await o(()=>e(r).not.toHaveAttribute("inert")),await o(()=>e(d()).toBe(p))}},y={render:()=>a.jsx(m,{currentPath:"/settings/appearance"}),play:async({canvasElement:t})=>{const i=l(t),n=i.getByRole("button",{name:/系統設定/});await e(n).toHaveAttribute("aria-expanded","true");const c=i.getByRole("link",{name:"外觀"});await e(c).toHaveAttribute("aria-current","page"),await s.click(n),await o(()=>e(n).toHaveAttribute("aria-expanded","false")),await o(()=>e(i.queryByRole("link",{name:"外觀"})).toBeNull()),await s.click(n),await o(()=>e(i.getByRole("link",{name:"外觀"})).toBeVisible())}},b={render:()=>a.jsx(m,{currentPath:"/workbench",mobileQuery:"(min-width: 0px)"}),play:async({canvasElement:t})=>{const i=t.ownerDocument,n=l(i.body),c=l(t).getByRole("button",{name:"切換側邊欄"});await s.click(c);const r=await n.findByRole("dialog",{name:"主導覽"}),u=Array.from(r.querySelectorAll("[class*='text-xs']")).map(d=>d.textContent).filter(d=>["每日作業","規劃與分析","報表","主檔與設定","說明"].includes(d??""));e(u.slice(0,2)).toEqual(["每日作業","規劃與分析"]),await s.click(l(r).getByRole("link",{name:/批次結算/})),await o(()=>e(n.queryByRole("dialog")).toBeNull()),await s.click(c),await n.findByRole("dialog",{name:"主導覽"}),await s.keyboard("{Escape}"),await o(()=>e(n.queryByRole("dialog")).toBeNull()),await o(()=>e(i.activeElement).toBe(c))}};var B,h,k;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(k=(h=w.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var f,E,R;g.parameters={...g.parameters,docs:{...(f=g.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(R=(E=g.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var H,A,S;v.parameters={...v.parameters,docs:{...(H=v.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <Shell currentPath="/workbench" collapsible="offcanvas" />,
  // 契約：offcanvas 收合後側欄整塊移出畫面與 Tab 順序（inert）；滑鼠碰左緣窺看——
  // 浮在內容上、不推版面；Esc 或滑鼠離開就收；釘選展開走 SidebarTrigger（鍵盤與觸控的路）。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const trigger = canvas.getByRole("button", {
      name: "切換側邊欄"
    });
    const aside = canvasElement.querySelector("aside") as HTMLElement;
    const main = canvasElement.querySelector("main") as HTMLElement;
    const mainLeft = () => main.getBoundingClientRect().left;
    const pinnedLeft = mainLeft();
    await userEvent.click(trigger);
    await waitFor(() => expect(aside).toHaveAttribute("inert"));
    await waitFor(() => expect(aside.getBoundingClientRect().right).toBeLessThanOrEqual(0));
    // 工作區拿回整個寬度
    await waitFor(() => expect(mainLeft()).toBeLessThan(pinnedLeft));
    const collapsedLeft = mainLeft();
    // 移出畫面不等於鍵盤走不進去——inert 要真的擋住焦點
    const link = within(aside).getByRole("link", {
      name: /工作台/,
      hidden: true
    });
    link.focus();
    await expect(doc.activeElement).not.toBe(link);

    // 碰左緣窺看：浮層、不推版面
    const edge = canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement;
    await userEvent.hover(edge);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await expect(aside).not.toHaveAttribute("inert");
    await waitFor(() => expect(aside.getBoundingClientRect().left).toBe(0));
    expect(mainLeft()).toBe(collapsedLeft);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Esc 收（焦點不在側欄裡也要收得掉）
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(aside).toHaveAttribute("inert"));

    // 再叫出來，滑鼠離開就收
    await userEvent.hover(canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await userEvent.unhover(aside);
    await waitFor(() => expect(aside).not.toHaveAttribute("data-peek"));
    await expect(aside).toHaveAttribute("inert");

    // 收尾：釘選展開回來（推開內容），別讓視覺掃描拿到收合畫面
    await userEvent.click(trigger);
    await waitFor(() => expect(aside).not.toHaveAttribute("inert"));
    await waitFor(() => expect(mainLeft()).toBe(pinnedLeft));
  }
}`,...(S=(A=v.parameters)==null?void 0:A.docs)==null?void 0:S.source}}};var L,j,C;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(C=(j=y.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var q,F,T;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(T=(F=b.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};const Oe=["典型組成","收合成圖示欄","收合成完全隱藏","群組展開與鍵盤","行動版抽屜"];export{Oe as __namedExportsOrder,Pe as default,w as 典型組成,g as 收合成圖示欄,v as 收合成完全隱藏,y as 群組展開與鍵盤,b as 行動版抽屜};
