import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-UiW3gZKV.js";import{within as r,expect as o,userEvent as c,waitFor as P}from"./index-DH-M5T-F.js";import{A as E,S as L,a as H,b as T,c as A,d as D,e as F,B as M,C as O,f as z,D as V,F as _,g as $,h as q,L as G,i as I}from"./separator-CkbsE_i-.js";import{P as m,B as K}from"./page-header-DitvXJdl.js";import{B as C}from"./badge-Cl3jk1vO.js";import{B as h}from"./button-Cw_3_x2n.js";import{C as d,a as v,d as J,b as f,c as x}from"./card-B8B3JnhV.js";import{D as Q}from"./data-table-CMjlPUn2.js";import{S as U}from"./seg-group-DXjbX0o5.js";import{T as W}from"./tab-pills-BWBDaVy_.js";import{f as R}from"./utils-DBXtLcuW.js";import{d as g,a as p,S as w,b as X}from"./sample-data-I9KaR9SF.js";import{P as Y}from"./plus-Bz5CK1Id.js";import"./_commonjsHelpers-CqkleIqs.js";import"./createLucideIcon-BcR0bl2m.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./dropdown-menu-Hfmcpkw1.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./index-CLEGCNc0.js";import"./check-CZys2X9e.js";import"./index-C-xWP-pl.js";import"./tooltip-CyZzvjef.js";import"./chevron-right-DWuV1wB0.js";import"./index-C9IEqVQG.js";import"./table-BjHUlWCA.js";import"./empty-state-99jlnPRN.js";import"./skeleton-CpwypqWR.js";import"./input-kuo8quod.js";import"./select-BbRzm7y4.js";import"./checkbox-B4Z_93Kg.js";import"./popover-CK_dJ5Ux.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";const Ge={title:"頁面/五種頁型組進外殼"},Z={工作台:I,批次結算:G,存量清查:q,用量分析:$,報表中心:_,基本資料:V,系統設定:z,使用說明:O,操作手冊:M},ee=X.map(a=>({...a,items:a.items.map(i=>({...i,icon:Z[i.title]}))})),k=[{value:"2024-01",label:"一月"},{value:"2024-02",label:"二月"}],ae=[{key:"id",header:"編號",freeze:!0,cell:a=>a.id,sortValue:a=>a.id},{key:"unit",header:"單位",cell:a=>a.unit,sortValue:a=>a.unit},{key:"amount",header:"金額",numeric:!0,cell:a=>R(a.amount),sortValue:a=>a.amount},{key:"status",header:"狀態",cell:a=>w[a.status],sortValue:a=>w[a.status]}];function te({path:a}){const[i,l]=y.useState(k[1].value),[t,s]=y.useState("basic");return a.startsWith("/settings")?e.jsxs("div",{className:"space-y-4",children:[e.jsx(m,{title:"系統設定",meta:`${g.name}・${g.code}`}),e.jsxs(d,{children:[e.jsxs(v,{children:[e.jsx(J,{className:"text-base",children:"顯示偏好"}),e.jsx(f,{children:"變更立即生效，只影響你自己的畫面。"})]}),e.jsx(x,{className:"text-sm text-muted-foreground",children:"設定頁的分區規格見〈設定頁〉。"})]})]}):a==="/master"?e.jsxs("div",{className:"space-y-4",children:[e.jsx(m,{nav:e.jsx(K,{href:"#/records"}),title:g.name,badges:e.jsx(C,{variant:"success",children:"啟用中"}),actions:e.jsx(h,{variant:"outline",size:"sm",children:"匯出"})}),e.jsx(W,{label:"明細分區",value:t,onChange:s,tabs:[{key:"basic",label:"基本資料"},{key:"related",label:"關聯清單"}]}),e.jsx(d,{children:e.jsx(x,{className:"pt-6 text-sm text-muted-foreground",children:"明細頁的組成規格見〈明細頁〉。"})})]}):a==="/settlement"?e.jsxs("div",{className:"max-w-2xl space-y-4",children:[e.jsx(m,{title:"建立批次",meta:"三步完成；可以隨時回上一步，已填的內容不會不見。"}),e.jsx(d,{children:e.jsx(x,{className:"pt-6 text-sm text-muted-foreground",children:"表單頁的組成規格見〈表單頁〉。"})}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(h,{variant:"outline",children:"取消"}),e.jsx(h,{children:"送出"})]})]}):a==="/workbench"?e.jsxs("div",{className:"space-y-4",children:[e.jsx(m,{title:"成效總覽",meta:"資料期間：二月・更新於 2024-02-07",actions:e.jsx(U,{label:"期間",options:k,value:i,onPick:l})}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs(d,{children:[e.jsx(v,{className:"pb-2",children:e.jsx(f,{children:"總金額"})}),e.jsx(x,{children:e.jsx("p",{className:"text-3xl font-semibold tabular-nums",children:R(p.reduce((n,j)=>n+j.amount,0))})})]}),e.jsxs(d,{children:[e.jsx(v,{className:"pb-2",children:e.jsx(f,{children:"總筆數"})}),e.jsx(x,{children:e.jsx("p",{className:"text-3xl font-semibold tabular-nums",children:p.length})})]})]})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsx(m,{title:"存量清查",meta:`共 ${p.length} 筆・最後更新 2024-02-07`,actions:e.jsxs(h,{children:[e.jsx(Y,{})," 新增項目"]})}),e.jsx(Q,{rows:p,columns:ae,getRowKey:n=>n.id,dense:!0,pageSize:10})]})}const ne="(max-width: 0px)";function se(){const[a,i]=y.useState("/workbench"),l=t=>e.jsx("a",{...t,onClick:s=>{var n;s.preventDefault(),(n=t.onClick)==null||n.call(t,s),t.target||i(t.href)}});return e.jsx(E,{mobileQuery:ne,sidebar:e.jsxs(T,{children:[e.jsx(A,{children:e.jsxs("div",{className:"flex h-9 items-center gap-2 px-2 font-semibold",children:[e.jsx("span",{className:"flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand text-xs text-brand-foreground",children:"帳"}),e.jsx("span",{className:"truncate group-data-[state=collapsed]/sidebar:sr-only",children:"內部作業系統"})]})}),e.jsx(D,{children:e.jsx(F,{groups:ee,currentPath:a,renderLink:l})})]}),header:e.jsxs(e.Fragment,{children:[e.jsx(L,{}),e.jsx(H,{orientation:"vertical",className:"h-5"}),e.jsx("a",{href:"#pending",onClick:t=>t.preventDefault(),className:"ml-auto",children:e.jsx(C,{variant:"warning",children:"待處理 3 項"})})]}),children:e.jsx(te,{path:a})})}const u={render:()=>e.jsx(se,{}),play:async({canvasElement:a})=>{const i=r(a),l=a.querySelector("main");o(l).not.toBeNull();const t=r(l),s=async j=>{await P(()=>{const b=t.getAllByRole("heading",{level:1});o(b).toHaveLength(1),o(b[0]).toHaveTextContent(j)}),o(i.getAllByRole("heading",{level:1})).toHaveLength(1)},n=i.getByRole("navigation",{name:"主導覽"});await s("成效總覽"),await c.click(r(n).getByRole("link",{name:/存量清查/})),await s("存量清查"),await c.click(r(n).getByRole("link",{name:/批次結算/})),await s("建立批次"),await c.click(r(n).getByRole("link",{name:/基本資料/})),await s(g.name),await o(t.getByRole("link",{name:/返回清單/})).toHaveAttribute("href","#/records"),await c.click(r(n).getByRole("button",{name:/系統設定/})),await c.click(await r(n).findByRole("link",{name:"一般"})),await s("系統設定")}};var S,B,N;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <Composed />,
  // 契約：五種頁型在同一副外殼下切換，每一次都只有一個 h1、
  // 頂列不重複頁面標題、主內容留在 <main> 裡（不被側欄蓋掉）。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const main = canvasElement.querySelector("main");
    expect(main).not.toBeNull();
    const inMain = within(main as HTMLElement);
    const expectSinglePage = async (heading: string) => {
      await waitFor(() => {
        const h1s = inMain.getAllByRole("heading", {
          level: 1
        });
        expect(h1s).toHaveLength(1);
        expect(h1s[0]).toHaveTextContent(heading);
      });
      // 整個外殼範圍內也只有這一個 h1——頂列重複一份會被螢幕閱讀器唸兩次
      expect(canvas.getAllByRole("heading", {
        level: 1
      })).toHaveLength(1);
    };
    const nav = canvas.getByRole("navigation", {
      name: "主導覽"
    });
    await expectSinglePage("成效總覽"); // 儀表板（初始）

    await userEvent.click(within(nav).getByRole("link", {
      name: /存量清查/
    }));
    await expectSinglePage("存量清查"); // 清單頁

    await userEvent.click(within(nav).getByRole("link", {
      name: /批次結算/
    }));
    await expectSinglePage("建立批次"); // 表單頁

    await userEvent.click(within(nav).getByRole("link", {
      name: /基本資料/
    }));
    await expectSinglePage(demoProfile.name); // 明細頁
    // 明細頁的返回是真連結（BackLink），不是 JS 後退
    await expect(inMain.getByRole("link", {
      name: /返回清單/
    })).toHaveAttribute("href", "#/records");
    await userEvent.click(within(nav).getByRole("button", {
      name: /系統設定/
    }));
    await userEvent.click(await within(nav).findByRole("link", {
      name: "一般"
    }));
    await expectSinglePage("系統設定"); // 設定頁
  }
}`,...(N=(B=u.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};const Ie=["切換分區"];export{Ie as __namedExportsOrder,Ge as default,u as 切換分區};
