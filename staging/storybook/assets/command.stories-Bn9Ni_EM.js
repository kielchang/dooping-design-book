import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as E}from"./index-UiW3gZKV.js";import{within as r,userEvent as d,waitFor as s,expect as o,fn as j}from"./index-DH-M5T-F.js";import{B as R}from"./button-DyXVXefs.js";import{C as I,a as M,b as A,c as D,d as L,e as h,f as N}from"./command-palette-C22ka9b1.js";import{b as y}from"./sample-data-DgKbD7zu.js";import{s as S}from"./play-B_tfD0rJ.js";import{c as H}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-BOrUEQ0c.js";import"./utils-CMl-9ImW.js";import"./nav-9Puf6Yd8.js";import"./index-C-xWP-pl.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./dialog-C82NnX_8.js";import"./x-DHctwwaT.js";import"./search-CZ8TAUj0.js";import"./chevron-right-DWuV1wB0.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=H("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=H("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),le={title:"元件/浮層/指令面板 Command"},l={render:()=>t.jsx("div",{className:"max-w-md rounded-md border py-0",children:t.jsxs(I,{children:[t.jsx(M,{placeholder:"搜尋頁面…"}),t.jsxs(A,{children:[t.jsx(D,{children:"查無符合的結果"}),y.slice(0,3).map(a=>t.jsx(L,{heading:a.title,children:a.items.flatMap(e=>e.items?e.items.map(n=>t.jsx(h,{value:`${e.title} ${n.title}`,children:n.title},n.title)):[t.jsx(h,{value:e.title,children:e.title},e.title)])},a.title))]})]})}),play:async({canvasElement:a})=>{const e=r(a),n=e.getByPlaceholderText("搜尋頁面…");S(n,"報表"),await s(()=>{const i=e.getAllByRole("option");o(i).toHaveLength(1),o(i[0]).toHaveTextContent("報表中心"),o(i[0]).toHaveAttribute("aria-selected","true")})}},u=j();function G(){const[a,e]=E.useState(!1);return t.jsxs("div",{className:"space-y-3 py-8",children:[t.jsxs(R,{variant:"outline",onClick:()=>e(!0),children:["開啟指令面板 ",t.jsx("kbd",{className:"ml-2 rounded-sm border px-1.5 text-xs text-muted-foreground",children:"Ctrl K"})]}),t.jsx("p",{className:"text-tiny text-muted-foreground",children:"導覽項來自與側邊欄同一份 demoNavGroups——單一來源，兩個出口。"}),t.jsx(N,{open:a,onOpenChange:e,groups:y,onNavigate:n=>u(n)})]})}const m={render:()=>t.jsx(G,{}),play:async({canvasElement:a})=>{u.mockClear();const e=a.ownerDocument,n=r(e.body);await d.keyboard("{Control>}k{/Control}");const i=await n.findByPlaceholderText("搜尋頁面或指令…");await s(()=>o(e.activeElement).toBe(i)),S(i,"批次"),await s(()=>o(n.getAllByRole("option")).toHaveLength(1)),await d.keyboard("{Enter}"),await o(u).toHaveBeenCalledWith("/settlement"),await s(()=>o(n.queryByRole("dialog")).toBeNull())}},p=j();function T(){const[a,e]=E.useState(!1);return t.jsxs("div",{className:"py-8",children:[t.jsx(R,{variant:"outline",onClick:()=>e(!0),children:"開啟（含自訂指令群）"}),t.jsx(N,{open:a,onOpenChange:e,hotkey:!1,groups:y.slice(0,1),actions:[{heading:"外觀",items:[{id:"light",label:"切換淺色模式",icon:P,run:()=>p("light")},{id:"dark",label:"切換深色模式",icon:F,run:()=>p("dark")}]}]})]})}const c={render:()=>t.jsx(T,{}),play:async({canvasElement:a})=>{p.mockClear();const e=a.ownerDocument,n=r(e.body);await d.click(r(a).getByRole("button",{name:/開啟（含自訂指令群）/}));const i=await n.findByRole("dialog");await d.click(r(i).getByRole("option",{name:"切換深色模式"})),await o(p).toHaveBeenCalledWith("dark"),await s(()=>o(n.queryByRole("dialog")).toBeNull())}};var v,x,w;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="max-w-md rounded-md border py-0">
      <Command>
        <CommandInput placeholder="搜尋頁面…" />
        <CommandList>
          <CommandEmpty>查無符合的結果</CommandEmpty>
          {demoNavGroups.slice(0, 3).map(group => <CommandGroup key={group.title} heading={group.title}>
              {group.items.flatMap(item => item.items ? item.items.map(sub => <CommandItem key={sub.title} value={\`\${item.title} \${sub.title}\`}>{sub.title}</CommandItem>) : [<CommandItem key={item.title} value={item.title}>{item.title}</CommandItem>])}
            </CommandGroup>)}
        </CommandList>
      </Command>
    </div>,
  // 過濾契約：輸入後只剩符合項，且目前項有 aria-selected。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("搜尋頁面…");
    setInputValue(input, "報表");
    await waitFor(() => {
      const options = canvas.getAllByRole("option");
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("報表中心");
      expect(options[0]).toHaveAttribute("aria-selected", "true");
    });
  }
}`,...(w=(x=l.parameters)==null?void 0:x.docs)==null?void 0:w.source}}};var g,C,k;m.parameters={...m.parameters,docs:{...(g=m.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <PaletteDemo />,
  // 契約：Ctrl+K 開啟、輸入過濾、Enter 導航（執行即關閉）、Esc 關閉。
  play: async ({
    canvasElement
  }) => {
    navigateSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.keyboard("{Control>}k{/Control}");
    const input = await body.findByPlaceholderText("搜尋頁面或指令…");
    await waitFor(() => expect(doc.activeElement).toBe(input));
    setInputValue(input, "批次");
    await waitFor(() => expect(body.getAllByRole("option")).toHaveLength(1));
    await userEvent.keyboard("{Enter}");
    await expect(navigateSpy).toHaveBeenCalledWith("/settlement");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  }
}`,...(k=(C=m.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var b,B,f;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ActionsDemo />,
  // 契約：自訂指令選中即執行、面板關閉。主題切換由宿主提供——元件不內建任何指令。
  play: async ({
    canvasElement
  }) => {
    themeSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", {
      name: /開啟（含自訂指令群）/
    }));
    const dialog = await body.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("option", {
      name: "切換深色模式"
    }));
    await expect(themeSpy).toHaveBeenCalledWith("dark");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  }
}`,...(f=(B=c.parameters)==null?void 0:B.docs)==null?void 0:f.source}}};const me=["清單模式","對話框與快捷鍵","自訂指令群"];export{me as __namedExportsOrder,le as default,m as 對話框與快捷鍵,l as 清單模式,c as 自訂指令群};
