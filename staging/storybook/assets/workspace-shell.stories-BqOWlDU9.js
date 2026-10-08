import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as R}from"./index-UiW3gZKV.js";import{within as t,expect as a,userEvent as l,waitFor as c}from"./index-DH-M5T-F.js";import{A as Y,S as Z,a as ee}from"./separator-CFL0eNUs.js";import{A as te}from"./app-menubar-ZaB16_Tq.js";import{S as ne,a as ae,b as ie,c as oe}from"./sidebar-COgXC6tD.js";import{f as se}from"./command-palette-C22ka9b1.js";import{P as re}from"./page-header-CU3Aot3D.js";import{B}from"./button-DyXVXefs.js";import{C as le,c as ce}from"./card-DlPdB5za.js";import{P as me,a as de,b as ue}from"./popover-DMZdog4n.js";import{D as pe,a as he,b as ye,c as xe,e as q,d as S}from"./dropdown-menu-q4BwFbGE.js";import{D as we,b as ge,c as Be,d as be,e as ve,f as fe}from"./dialog-C82NnX_8.js";import{f as A,a as Re}from"./nav-9Puf6Yd8.js";import{c as ke}from"./utils-CMl-9ImW.js";import{c as X,e as F,f as je}from"./sample-data-DgKbD7zu.js";import{S as Ne}from"./search-CZ8TAUj0.js";import{c as b}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./badge-BUiC31UU.js";import"./index-BOrUEQ0c.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./chevron-right-DWuV1wB0.js";import"./index-BHxPrZ82.js";import"./index-BmqVfOSQ.js";import"./index-DliohCdJ.js";import"./index-C-xWP-pl.js";import"./tooltip-BWkzAh2F.js";import"./check-CZys2X9e.js";import"./x-DHctwwaT.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=b("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=b("Briefcase",[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=b("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=b("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=b("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),xt={title:"頁面/多應用外殼"},Me={作業中心:Ee,文件庫:Ae,排程:Se,系統管理:Ce},C=je.map(n=>({...n,items:n.items.map(o=>({...o,icon:Me[o.title]}))})),O=C.flatMap(n=>n.items),L=(n,o)=>Re(n.url,o)||!!A(X[n.url]??[],o),z="(max-width: 0px)",Te="(min-width: 0px)",He="min-w-[1100px]",k={name:"使用者甲",account:"user-a"};function Pe({onClick:n,onNavigate:o,...i}){return e.jsx("a",{...i,onClick:r=>{n==null||n(r),!r.defaultPrevented&&(r.preventDefault(),i.target||o(i.href))}})}function M({collapsible:n,mobileQuery:o=z,defaultOpen:i}){var P,I;const[r,h]=R.useState("/workbench"),[m,d]=R.useState(!1),[w,v]=R.useState(!1),[u,y]=R.useState(null),p=((P=A(C,r,L))==null?void 0:P.item)??O[0],x=X[p.url]??[],E=(I=A(x,r))==null?void 0:I.item,T=p.icon,f=F.filter(s=>s.unread).length,H=s=>e.jsx(Pe,{...s,onNavigate:h});return e.jsxs(Y,{mobileQuery:o,defaultOpen:i,className:o===z?He:void 0,sidebar:e.jsxs(ae,{label:"應用程式",collapsible:n,children:[e.jsx(ie,{children:e.jsxs("div",{className:"flex h-9 items-center gap-2 px-2 font-semibold",children:[e.jsx("span",{className:"flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground",children:"D"}),e.jsx("span",{className:"truncate group-data-[state=collapsed]/sidebar:sr-only",children:"工作平台"})]})}),e.jsx(oe,{children:e.jsx(ee,{groups:C,currentPath:r,isActive:L,renderLink:H})})]}),header:e.jsxs(e.Fragment,{children:[e.jsx(ne,{}),e.jsxs("div",{className:"flex shrink-0 items-center gap-2 text-sm font-semibold",children:[T?e.jsx(T,{"aria-hidden":!0,className:"size-4"}):null,e.jsx("span",{className:"sr-only sm:not-sr-only",children:p.title})]}),e.jsx(Z,{orientation:"vertical",className:"h-5"}),e.jsx(te,{groups:x,currentPath:r,renderLink:H,onAction:(s,g)=>y(g)}),e.jsxs("div",{className:"flex shrink-0 items-center gap-1",children:[e.jsxs(B,{variant:"outline",size:"sm",className:"h-8 w-8 px-0 sm:w-auto sm:px-3",onClick:()=>d(!0),children:[e.jsx(Ne,{"aria-hidden":!0}),e.jsx("span",{className:"sr-only sm:not-sr-only",children:"搜尋"}),e.jsx("kbd",{className:"ml-1 hidden rounded-sm border px-1 text-tiny text-muted-foreground md:inline",children:"Ctrl K"})]}),e.jsxs(me,{open:w,onOpenChange:v,children:[e.jsx(de,{asChild:!0,children:e.jsxs(B,{variant:"ghost",size:"icon",className:"relative size-8","aria-label":`通知，${f} 則未讀`,children:[e.jsx(De,{}),f>0?e.jsx("span",{"aria-hidden":!0,className:"absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground",children:f}):null]})}),e.jsxs(ue,{align:"end",className:"w-80 p-0",children:[e.jsxs("div",{className:"flex items-center justify-between border-b px-4 py-2.5",children:[e.jsx("p",{className:"text-sm font-semibold",children:"通知"}),e.jsxs("span",{className:"text-xs text-muted-foreground",children:[f," 則未讀"]})]}),e.jsx("ul",{className:"max-h-80 overflow-y-auto py-1",children:F.map(s=>e.jsx("li",{children:e.jsxs("a",{href:s.url,onClick:g=>{g.preventDefault(),v(!1),h(s.url)},className:"state-layer flex gap-3 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",children:[e.jsx("span",{"aria-hidden":!0,className:ke("mt-1.5 size-2 shrink-0 rounded-full",s.unread&&"bg-primary")}),e.jsxs("span",{className:"min-w-0 flex-1",children:[e.jsxs("span",{className:"block",children:[s.title,s.unread?e.jsx("span",{className:"sr-only",children:"（未讀）"}):null]}),e.jsx("span",{className:"block text-xs text-muted-foreground",children:s.time})]})]})},s.id))})]})]}),e.jsxs(pe,{children:[e.jsx(he,{asChild:!0,children:e.jsx(B,{variant:"ghost",size:"icon",className:"size-8 rounded-full","aria-label":`使用者選單：${k.name}`,children:e.jsx("span",{"aria-hidden":!0,className:"flex size-7 items-center justify-center rounded-full bg-brand text-xs font-medium text-brand-foreground",children:k.name.slice(-1)})})}),e.jsxs(ye,{align:"end",className:"w-52",children:[e.jsxs(xe,{children:[e.jsx("span",{className:"block text-sm text-foreground",children:k.name}),e.jsx("span",{className:"block",children:k.account})]}),e.jsx(q,{}),e.jsx(S,{children:"個人設定"}),e.jsx(S,{children:"外觀"}),e.jsx(q,{}),e.jsx(S,{children:"登出"})]})]})]}),e.jsx(se,{groups:[{title:"切換應用",items:O},...x],open:m,onOpenChange:d,onNavigate:s=>h(s),onAction:(s,g)=>y(g)})]}),children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx(re,{title:(E==null?void 0:E.title)??p.title,meta:`${p.title}・${r}`}),e.jsx(le,{children:e.jsx(ce,{className:"pt-6 text-sm text-muted-foreground",children:"應用內容區。側欄切應用、頂部選單切這個應用裡的功能；收合側欄時工作區拿回整個寬度。"})})]}),e.jsx(we,{open:u!==null,onOpenChange:s=>!s&&y(null),children:e.jsxs(ge,{children:[e.jsxs(Be,{children:[e.jsx(be,{children:u==null?void 0:u.title.replace(/…$/,"")}),e.jsx(ve,{children:"動作項不導航：選單把代號交回 onAction，由宿主決定開什麼。"})]}),e.jsxs(fe,{children:[e.jsx(B,{variant:"outline",onClick:()=>y(null),children:"取消"}),e.jsx(B,{onClick:()=>y(null),children:"建立"})]})]})})]})}const j={render:()=>e.jsx(M,{}),play:async({canvasElement:n})=>{const o=t(n),i=t(n.ownerDocument.body),r=n.querySelector("header"),h=n.querySelector("main"),m=o.getByRole("navigation",{name:"應用程式"}),d=()=>o.getByRole("menubar",{name:"應用功能"}),w=async p=>{await c(()=>{const x=o.getAllByRole("heading",{level:1});a(x).toHaveLength(1),a(x[0]).toHaveTextContent(p),a(h.contains(x[0])).toBe(!0)}),a(r.textContent).not.toContain(p)};await w("工作台"),await a(t(m).getByRole("link",{name:/作業中心/})).toHaveAttribute("aria-current","page"),await a(t(d()).getByRole("menuitem",{name:"每日作業"})).toBeInTheDocument(),await l.click(t(m).getByRole("link",{name:/文件庫/})),await w("全部文件"),await a(t(m).getByRole("link",{name:/文件庫/})).toHaveAttribute("aria-current","page"),await c(()=>a(t(d()).getByRole("menuitem",{name:"整理"})).toBeInTheDocument()),a(t(d()).queryByRole("menuitem",{name:"每日作業"})).toBeNull(),await l.click(t(d()).getByRole("menuitem",{name:"整理"})),await l.click(t(await i.findByRole("menu")).getByRole("menuitem",{name:"新增資料夾…"}));const v=await i.findByRole("dialog",{name:"新增資料夾"});await l.click(t(v).getByRole("button",{name:"取消"})),await c(()=>a(i.queryByRole("dialog")).toBeNull()),await l.click(o.getByRole("button",{name:/搜尋/}));const u=await i.findByRole("dialog",{name:"指令面板"});await a(t(u).getByRole("option",{name:/最近開啟/})).toBeInTheDocument(),await a(t(u).getByRole("option",{name:/新增資料夾/})).toBeInTheDocument(),await l.click(t(u).getByRole("option",{name:/作業中心/})),await c(()=>a(i.queryByRole("dialog")).toBeNull()),await w("工作台"),await c(()=>a(t(d()).getByRole("menuitem",{name:"每日作業"})).toBeInTheDocument()),await l.click(o.getByRole("button",{name:"通知，2 則未讀"}));const y=await i.findByRole("dialog");await l.click(t(y).getByRole("link",{name:/B-0217/})),await c(()=>a(i.queryByRole("dialog")).toBeNull()),await w("批次結算")}},N={render:()=>e.jsx(M,{collapsible:"offcanvas",defaultOpen:!1}),play:async({canvasElement:n})=>{const o=t(n),i=n.querySelector("aside");await a(i).toHaveAttribute("inert"),await l.hover(n.querySelector("[data-sidebar-edge]")),await c(()=>a(i).toHaveAttribute("data-peek")),await l.click(t(i).getByRole("link",{name:/排程/})),await c(()=>a(i).toHaveAttribute("inert"));const r=o.getByRole("menubar",{name:"應用功能"});await c(()=>a(t(r).getByRole("menuitem",{name:"檢視"})).toBeInTheDocument())}},D={render:()=>e.jsx(M,{mobileQuery:Te}),play:async({canvasElement:n})=>{const o=t(n),i=t(n.ownerDocument.body),r=o.getByRole("menubar",{name:"應用功能"});a(t(r).getAllByRole("menuitem")).toHaveLength(1),await l.click(o.getByRole("button",{name:"切換側邊欄"}));const h=await i.findByRole("dialog",{name:"應用程式"});await l.click(t(h).getByRole("link",{name:/排程/})),await c(()=>a(i.queryByRole("dialog")).toBeNull()),await l.click(t(r).getByRole("menuitem",{name:"選單"}));const m=await i.findByRole("menu");await a(t(m).getByText("檢視")).toBeVisible(),await a(t(m).getByRole("menuitem",{name:/新增排程/})).toBeInTheDocument(),await l.keyboard("{Escape}"),await c(()=>a(i.queryByRole("menu")).toBeNull())}};var _,K,V;j.parameters={...j.parameters,docs:{...(_=j.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <Workspace />,
  // 契約：換應用 → 頂部選單整組換掉、側欄標出目前應用；一頁一個 h1、頂列不重複頁面標題；
  // 動作項開對話框；⌘K 同時找得到應用與功能；通知可點、直接到目的地。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const header = canvasElement.querySelector("header") as HTMLElement;
    const main = canvasElement.querySelector("main") as HTMLElement;
    const nav = canvas.getByRole("navigation", {
      name: "應用程式"
    });
    const bar = () => canvas.getByRole("menubar", {
      name: "應用功能"
    });
    const expectPage = async (title: string) => {
      await waitFor(() => {
        const h1s = canvas.getAllByRole("heading", {
          level: 1
        });
        expect(h1s).toHaveLength(1);
        expect(h1s[0]).toHaveTextContent(title);
        expect(main.contains(h1s[0])).toBe(true);
      });
      expect(header.textContent).not.toContain(title);
    };
    await expectPage("工作台");
    await expect(within(nav).getByRole("link", {
      name: /作業中心/
    })).toHaveAttribute("aria-current", "page");
    await expect(within(bar()).getByRole("menuitem", {
      name: "每日作業"
    })).toBeInTheDocument();

    // ① 換應用：選單整組換掉
    await userEvent.click(within(nav).getByRole("link", {
      name: /文件庫/
    }));
    await expectPage("全部文件");
    await expect(within(nav).getByRole("link", {
      name: /文件庫/
    })).toHaveAttribute("aria-current", "page");
    await waitFor(() => expect(within(bar()).getByRole("menuitem", {
      name: "整理"
    })).toBeInTheDocument());
    expect(within(bar()).queryByRole("menuitem", {
      name: "每日作業"
    })).toBeNull();

    // 動作項 → 對話框
    await userEvent.click(within(bar()).getByRole("menuitem", {
      name: "整理"
    }));
    await userEvent.click(within(await body.findByRole("menu")).getByRole("menuitem", {
      name: "新增資料夾…"
    }));
    const dialog = await body.findByRole("dialog", {
      name: "新增資料夾"
    });
    await userEvent.click(within(dialog).getByRole("button", {
      name: "取消"
    }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());

    // ⌘K：應用與目前應用的功能都在
    await userEvent.click(canvas.getByRole("button", {
      name: /搜尋/
    }));
    const palette = await body.findByRole("dialog", {
      name: "指令面板"
    });
    await expect(within(palette).getByRole("option", {
      name: /最近開啟/
    })).toBeInTheDocument();
    await expect(within(palette).getByRole("option", {
      name: /新增資料夾/
    })).toBeInTheDocument();
    await userEvent.click(within(palette).getByRole("option", {
      name: /作業中心/
    }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expectPage("工作台");
    await waitFor(() => expect(within(bar()).getByRole("menuitem", {
      name: "每日作業"
    })).toBeInTheDocument());

    // 通知：未讀數在名字裡（不只靠徽章的顏色），點一則直接到目的地
    await userEvent.click(canvas.getByRole("button", {
      name: "通知，2 則未讀"
    }));
    const notice = await body.findByRole("dialog");
    await userEvent.click(within(notice).getByRole("link", {
      name: /B-0217/
    }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expectPage("批次結算");
  }
}`,...(V=(K=j.parameters)==null?void 0:K.docs)==null?void 0:V.source}}};var W,$,Q;N.parameters={...N.parameters,docs:{...(W=N.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <Workspace collapsible="offcanvas" defaultOpen={false} />,
  // 契約：offcanvas 收合是工作區最大的形態；碰左緣叫出應用清單（浮層），選了就收、頂部選單跟著換。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const aside = canvasElement.querySelector("aside") as HTMLElement;
    await expect(aside).toHaveAttribute("inert");
    await userEvent.hover(canvasElement.querySelector("[data-sidebar-edge]") as HTMLElement);
    await waitFor(() => expect(aside).toHaveAttribute("data-peek"));
    await userEvent.click(within(aside).getByRole("link", {
      name: /排程/
    }));
    await waitFor(() => expect(aside).toHaveAttribute("inert"));
    const bar = canvas.getByRole("menubar", {
      name: "應用功能"
    });
    await waitFor(() => expect(within(bar).getByRole("menuitem", {
      name: "檢視"
    })).toBeInTheDocument());
  }
}`,...(Q=($=N.parameters)==null?void 0:$.docs)==null?void 0:Q.source}}};var U,G,J;D.parameters={...D.parameters,docs:{...(U=D.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Workspace mobileQuery={FORCE_MOBILE} />,
  // 契約：行動版側欄是抽屜（應用清單同一份、同順序），功能選單收成單一「選單」鈕，右段工具剩圖示。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", {
      name: "應用功能"
    });
    expect(within(bar).getAllByRole("menuitem")).toHaveLength(1);
    await userEvent.click(canvas.getByRole("button", {
      name: "切換側邊欄"
    }));
    const drawer = await body.findByRole("dialog", {
      name: "應用程式"
    });
    await userEvent.click(within(drawer).getByRole("link", {
      name: /排程/
    }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await userEvent.click(within(bar).getByRole("menuitem", {
      name: "選單"
    }));
    const menu = await body.findByRole("menu");
    await expect(within(menu).getByText("檢視")).toBeVisible();
    await expect(within(menu).getByRole("menuitem", {
      name: /新增排程/
    })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  }
}`,...(J=(G=D.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};const wt=["切換應用","收合到零","行動版"];export{wt as __namedExportsOrder,xt as default,j as 切換應用,N as 收合到零,D as 行動版};
