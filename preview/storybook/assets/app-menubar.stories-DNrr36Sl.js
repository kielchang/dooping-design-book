import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./index-UiW3gZKV.js";import{within as t,expect as e,userEvent as s,waitFor as d}from"./index-DH-M5T-F.js";import{A as M}from"./app-menubar-ZaB16_Tq.js";import{d as S}from"./sidebar-COgXC6tD.js";import{c as _}from"./sample-data-DgKbD7zu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-BHxPrZ82.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./index-BmqVfOSQ.js";import"./dropdown-menu-q4BwFbGE.js";import"./index-DliohCdJ.js";import"./utils-CMl-9ImW.js";import"./check-CZys2X9e.js";import"./createLucideIcon-BcR0bl2m.js";import"./nav-9Puf6Yd8.js";import"./index-C-xWP-pl.js";import"./button-DyXVXefs.js";import"./index-BOrUEQ0c.js";import"./tooltip-BWkzAh2F.js";const we={title:"元件/外殼/功能選單列"},L=_["/workbench"],P="(max-width: 0px)",C="(min-width: 0px)",V=760;function Q({onClick:r,onNavigate:o,...a}){return n.jsx("a",{...a,onClick:i=>{r==null||r(i),!i.defaultPrevented&&(i.preventDefault(),a.target||o(a.href))}})}function y({mobileQuery:r=P,width:o=V}){const[a,i]=x.useState("/workbench"),[m,c]=x.useState(null);return n.jsx(S,{mobileQuery:r,children:n.jsxs("div",{className:"space-y-3 overflow-x-auto",children:[n.jsxs("div",{className:"flex h-12 shrink-0 items-center gap-2 rounded-md border bg-background px-3",style:{width:o},children:[n.jsx("span",{className:"shrink-0 text-sm font-semibold",children:"作業中心"}),n.jsx(M,{groups:L,currentPath:a,renderLink:l=>n.jsx(Q,{...l,onNavigate:i}),onAction:l=>c(l)})]}),n.jsxs("p",{className:"text-sm text-muted-foreground",children:["目前路徑：",n.jsx("span",{"data-testid":"path",children:a}),m?n.jsxs(n.Fragment,{children:["・已執行動作：",n.jsx("span",{"data-testid":"action",children:m})]}):null]})]})})}const w={render:()=>n.jsx(y,{}),play:async({canvasElement:r})=>{const o=t(r),a=t(r.ownerDocument.body),i=o.getByRole("menubar",{name:"應用功能"}),m=t(i).getByRole("menuitem",{name:"每日作業"});await e(m).toHaveAttribute("data-current"),await s.click(m);const c=await a.findByRole("menu");await e(t(c).getByRole("menuitem",{name:"工作台"})).toHaveAttribute("aria-current","page"),await e(t(c).getByText("Ctrl N")).toBeVisible(),await s.click(t(c).getByRole("menuitem",{name:/存量清查/})),await d(()=>e(a.queryByRole("menu")).toBeNull()),await e(o.getByTestId("path")).toHaveTextContent("/stock-check"),await s.click(m),await s.click(t(await a.findByRole("menu")).getByRole("menuitem",{name:/^新增紀錄…\s*Ctrl N$/})),await d(()=>e(a.queryByRole("menu")).toBeNull()),await e(o.getByTestId("action")).toHaveTextContent("new-record");const l=t(i).getByRole("menuitem",{name:"主檔與設定"});await s.click(l);const u=await a.findByRole("menu");await e(t(u).getByText("系統設定")).toBeVisible(),e(t(u).queryByRole("menuitem",{name:"系統設定"})).toBeNull(),await s.click(t(u).getByRole("menuitem",{name:"外觀"})),await d(()=>e(a.queryByRole("menu")).toBeNull()),await d(()=>e(l).toHaveAttribute("data-current")),await e(m).not.toHaveAttribute("data-current"),await s.click(t(i).getByRole("menuitem",{name:"說明"}));const D=await a.findByRole("menu");await e(t(D).getByRole("menuitem",{name:/操作手冊/})).toHaveAttribute("target","_blank"),await s.keyboard("{Escape}"),await d(()=>e(a.queryByRole("menu")).toBeNull())}},p={render:()=>n.jsx(y,{}),play:async({canvasElement:r})=>{const o=t(r),a=r.ownerDocument,i=t(a.body),m=o.getByRole("menubar",{name:"應用功能"}),c=l=>t(m).getByRole("menuitem",{name:l});c("每日作業").focus(),await s.keyboard("{Enter}"),await i.findByRole("menu"),await e(c("每日作業")).toHaveAttribute("aria-expanded","true"),await s.keyboard("{ArrowRight}"),await d(()=>e(c("規劃與分析")).toHaveAttribute("aria-expanded","true")),await e(c("每日作業")).toHaveAttribute("aria-expanded","false"),await s.keyboard("{ArrowLeft}{ArrowLeft}"),await d(()=>e(c("說明")).toHaveAttribute("aria-expanded","true")),await s.keyboard("{Escape}"),await d(()=>e(i.queryByRole("menu")).toBeNull()),await d(()=>e(a.activeElement).toBe(c("說明")))}},B={render:()=>n.jsx(y,{mobileQuery:C}),play:async({canvasElement:r})=>{const o=t(r),a=t(r.ownerDocument.body),i=o.getByRole("menubar",{name:"應用功能"});e(t(i).getAllByRole("menuitem")).toHaveLength(1),await s.click(t(i).getByRole("menuitem",{name:"選單"}));const m=await a.findByRole("menu"),l=L.map(u=>u.title).map(u=>t(m).getByText(u,{selector:"[role=menu] > [role=group] > div"}));for(let u=1;u<l.length;u++)e(l[u-1].compareDocumentPosition(l[u])&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();await s.click(t(m).getByRole("menuitem",{name:/報表中心/})),await d(()=>e(a.queryByRole("menu")).toBeNull()),await e(o.getByTestId("path")).toHaveTextContent("/reports")}},b={render:()=>n.jsx(y,{width:360}),play:async({canvasElement:r})=>{const o=t(r).getByRole("menubar",{name:"應用功能"});await d(()=>e(t(o).getByRole("menuitem",{name:"選單"})).toBeVisible()),e(t(o).queryByRole("menuitem",{name:"每日作業"})).toBeNull()}},g={render:()=>n.jsxs("div",{className:"space-y-6",children:[n.jsxs("section",{className:"space-y-2",children:[n.jsx("h2",{className:"text-sm text-muted-foreground",children:"完整（所在分區加粗＋底線）"}),n.jsx(y,{})]}),n.jsxs("section",{className:"space-y-2",children:[n.jsx("h2",{className:"text-sm text-muted-foreground",children:"收合成單一選單（行動版或擠不下）"}),n.jsx(y,{mobileQuery:C})]})]})};var h,v,R;w.parameters={...w.parameters,docs:{...(h=w.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Bar />,
  // 契約：menubar 有名字；所在分區的標題被標出、所在項 aria-current；
  // 選連結即導航並關選單；動作項把代號交回 onAction；兩層群組是「分區標題＋子項」不是子選單。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", {
      name: "應用功能"
    });
    const daily = within(bar).getByRole("menuitem", {
      name: "每日作業"
    });
    await expect(daily).toHaveAttribute("data-current");
    await userEvent.click(daily);
    const menu = await body.findByRole("menu");
    await expect(within(menu).getByRole("menuitem", {
      name: "工作台"
    })).toHaveAttribute("aria-current", "page");
    await expect(within(menu).getByText("Ctrl N")).toBeVisible();
    await userEvent.click(within(menu).getByRole("menuitem", {
      name: /存量清查/
    }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("path")).toHaveTextContent("/stock-check");

    // 動作項：不導航，把代號交回宿主
    await userEvent.click(daily);
    // 快捷鍵提示是名稱的一部分（「新增紀錄… Ctrl N」）——讀屏使用者一樣該知道有快捷鍵
    await userEvent.click(within(await body.findByRole("menu")).getByRole("menuitem", {
      name: /^新增紀錄…\\s*Ctrl N$/
    }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("action")).toHaveTextContent("new-record");

    // 兩層群組：分區標題＋子項，沒有往右彈的子選單
    const settings = within(bar).getByRole("menuitem", {
      name: "主檔與設定"
    });
    await userEvent.click(settings);
    const settingsMenu = await body.findByRole("menu");
    await expect(within(settingsMenu).getByText("系統設定")).toBeVisible();
    expect(within(settingsMenu).queryByRole("menuitem", {
      name: "系統設定"
    })).toBeNull();
    await userEvent.click(within(settingsMenu).getByRole("menuitem", {
      name: "外觀"
    }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    // 所在分區跟著換——斷言放在選單關閉之後（Radix 選單開著時外部內容是 aria-hidden）
    await waitFor(() => expect(settings).toHaveAttribute("data-current"));
    await expect(daily).not.toHaveAttribute("data-current");

    // 外部連結另開分頁
    await userEvent.click(within(bar).getByRole("menuitem", {
      name: "說明"
    }));
    const help = await body.findByRole("menu");
    await expect(within(help).getByRole("menuitem", {
      name: /操作手冊/
    })).toHaveAttribute("target", "_blank");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  }
}`,...(R=(v=w.parameters)==null?void 0:v.docs)==null?void 0:R.source}}};var E,f,N;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <Bar />,
  // 契約（macOS 選單列的行為）：整條 menubar 一個 Tab 停駐點；Enter 開、左右鍵在頂層選單間移動
  // 並循環；Esc 關閉、焦點回到那一個標題。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const bar = canvas.getByRole("menubar", {
      name: "應用功能"
    });
    const trigger = (name: string) => within(bar).getByRole("menuitem", {
      name
    });
    trigger("每日作業").focus();
    await userEvent.keyboard("{Enter}");
    await body.findByRole("menu");
    await expect(trigger("每日作業")).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(trigger("規劃與分析")).toHaveAttribute("aria-expanded", "true"));
    await expect(trigger("每日作業")).toHaveAttribute("aria-expanded", "false");

    // 從第一個往左循環到最後一個
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await waitFor(() => expect(trigger("說明")).toHaveAttribute("aria-expanded", "true"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger("說明")));
  }
}`,...(N=(f=p.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var k,A,H;B.parameters={...B.parameters,docs:{...(k=B.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <Bar mobileQuery={FORCE_MOBILE} />,
  // 契約：行動版全部收進一個「選單」鈕，裡面依原順序列出每一區——不為手機另設計一套導覽。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const bar = canvas.getByRole("menubar", {
      name: "應用功能"
    });
    expect(within(bar).getAllByRole("menuitem")).toHaveLength(1);
    await userEvent.click(within(bar).getByRole("menuitem", {
      name: "選單"
    }));
    const menu = await body.findByRole("menu");
    const order = menus.map(g => g.title);
    const labels = order.map(t => within(menu).getByText(t, {
      selector: "[role=menu] > [role=group] > div"
    }));
    // 分區標題在 DOM 上的先後＝原順序
    for (let i = 1; i < labels.length; i++) {
      expect(labels[i - 1].compareDocumentPosition(labels[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    await userEvent.click(within(menu).getByRole("menuitem", {
      name: /報表中心/
    }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await expect(canvas.getByTestId("path")).toHaveTextContent("/reports");
  }
}`,...(H=(A=B.parameters)==null?void 0:A.docs)==null?void 0:H.source}}};var T,j,O;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <Bar width={360} />,
  // 契約：桌面寬度但頂層標題擠不下（例如平板、或右段工具較多）時也收成單一鈕，不讓標題被裁掉。
  play: async ({
    canvasElement
  }) => {
    const bar = within(canvasElement).getByRole("menubar", {
      name: "應用功能"
    });
    await waitFor(() => expect(within(bar).getByRole("menuitem", {
      name: "選單"
    })).toBeVisible());
    expect(within(bar).queryByRole("menuitem", {
      name: "每日作業"
    })).toBeNull();
  }
}`,...(O=(j=b.parameters)==null?void 0:j.docs)==null?void 0:O.source}}};var F,q,I;g.parameters={...g.parameters,docs:{...(F=g.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-sm text-muted-foreground">完整（所在分區加粗＋底線）</h2>
        <Bar />
      </section>
      <section className="space-y-2">
        <h2 className="text-sm text-muted-foreground">收合成單一選單（行動版或擠不下）</h2>
        <Bar mobileQuery={FORCE_MOBILE} />
      </section>
    </div>
}`,...(I=(q=g.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};const pe=["典型組成","鍵盤操作","窄版收成單一選單","擠不下時自動收合","兩態並列"];export{pe as __namedExportsOrder,we as default,g as 兩態並列,w as 典型組成,b as 擠不下時自動收合,B as 窄版收成單一選單,p as 鍵盤操作};
