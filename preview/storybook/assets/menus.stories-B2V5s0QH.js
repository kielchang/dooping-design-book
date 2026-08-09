import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as M}from"./index-UiW3gZKV.js";import{within as r,userEvent as s,waitFor as l,expect as i}from"./index-DH-M5T-F.js";import{B as y}from"./button-PlLiai67.js";import{P as C,a as F,F as P,b as T}from"./popover-CfLROtjL.js";import{D,a as k,b as R,c as N,d as w,e as z,f as I}from"./dropdown-menu-BGKoUATf.js";import{C as L}from"./checkbox-OptVgWvT.js";import{L as H}from"./label-DmCCWqIB.js";import{c as q}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-rhYpeUg2.js";import"./utils-pm6Xa0Qd.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./index-CLEGCNc0.js";import"./check-CZys2X9e.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=q("Ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]),ce={title:"元件/浮層/彈出面板・下拉選單"},d={render:()=>e.jsx("div",{className:"py-8",children:e.jsxs(C,{children:[e.jsx(F,{asChild:!0,children:e.jsxs(y,{variant:"outline",children:[e.jsx(P,{className:"mr-1 size-4"}),"篩選條件"]})}),e.jsxs(T,{children:[e.jsx("p",{className:"text-sm font-medium",children:"顯示範圍"}),e.jsx("div",{className:"mt-3 space-y-2",children:["草稿","已確認","已完成"].map(t=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(L,{id:`pv-${t}`,defaultChecked:t!=="草稿"}),e.jsx(H,{htmlFor:`pv-${t}`,children:t})]},t))}),e.jsx("p",{className:"mt-3 text-tiny text-muted-foreground",children:"彈出面板承載「一小塊就地設定」；要使用者做完整決定的內容請用對話框。"})]})]})}),play:async({canvasElement:t})=>{const o=t.ownerDocument,n=r(o.body),a=r(t).getByRole("button",{name:"篩選條件"});await s.click(a);const c=await n.findByRole("dialog");await i(c).toHaveTextContent("顯示範圍"),await s.keyboard("{Escape}"),await l(()=>i(n.queryByRole("dialog")).toBeNull()),await l(()=>i(o.activeElement).toBe(a))}},u={render:()=>e.jsx("div",{className:"py-8",children:e.jsxs(D,{children:[e.jsx(k,{asChild:!0,children:e.jsx(y,{variant:"outline",size:"icon","aria-label":"更多操作",children:e.jsx(A,{className:"size-4"})})}),e.jsxs(R,{align:"start",children:[e.jsx(N,{children:"R-2403"}),e.jsx(w,{children:"查看明細"}),e.jsx(w,{children:"複製編號"}),e.jsx(z,{}),e.jsx(w,{className:"text-destructive",children:"作廢"})]})]})}),play:async({canvasElement:t})=>{const o=t.ownerDocument,n=r(o.body),a=r(t).getByRole("button",{name:"更多操作"});await s.click(a);const c=await n.findByRole("menu");await s.keyboard("{ArrowDown}"),await l(()=>{const m=r(c).getByRole("menuitem",{name:"查看明細"});i(o.activeElement).toBe(m)}),await s.keyboard("{Escape}"),await l(()=>i(n.queryByRole("menu")).toBeNull()),await l(()=>i(o.activeElement).toBe(a))}};function S(){const[t,o]=M.useState({單位:!0,類別:!0,數量:!1});return e.jsxs("div",{className:"py-8",children:[e.jsxs(D,{children:[e.jsx(k,{asChild:!0,children:e.jsx(y,{variant:"outline",size:"sm",children:"欄位"})}),e.jsxs(R,{align:"start",children:[e.jsx(N,{children:"顯示欄位"}),Object.keys(t).map(n=>e.jsx(I,{checked:t[n],onCheckedChange:a=>o(c=>({...c,[n]:a===!0})),children:n},n))]})]}),e.jsx("p",{className:"mt-3 text-tiny text-muted-foreground",children:"勾選項預設不關閉選單——連續切換多個開關是它存在的理由。"})]})}const p={render:()=>e.jsx(S,{}),play:async({canvasElement:t})=>{const o=t.ownerDocument,n=r(o.body),a=r(t).getByRole("button",{name:"欄位"});await s.click(a);const c=await n.findByRole("menu"),m=r(c).getByRole("menuitemcheckbox",{name:"數量"});await i(m).toHaveAttribute("aria-checked","false"),await s.click(m),await l(()=>i(r(n.getByRole("menu")).getByRole("menuitemcheckbox",{name:"數量"})).toHaveAttribute("aria-checked","true")),await s.keyboard("{Escape}"),await l(()=>i(n.queryByRole("menu")).toBeNull())}};var x,g,v;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="py-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline"><Filter className="mr-1 size-4" />篩選條件</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm font-medium">顯示範圍</p>
          <div className="mt-3 space-y-2">
            {["草稿", "已確認", "已完成"].map(label => <div key={label} className="flex items-center gap-2">
                <Checkbox id={\`pv-\${label}\`} defaultChecked={label !== "草稿"} />
                <Label htmlFor={\`pv-\${label}\`}>{label}</Label>
              </div>)}
          </div>
          <p className="mt-3 text-tiny text-muted-foreground">
            彈出面板承載「一小塊就地設定」；要使用者做完整決定的內容請用對話框。
          </p>
        </PopoverContent>
      </Popover>
    </div>,
  // 行為契約：點開浮層（portal 掛 body）、Esc 關閉、焦點回到觸發鈕。
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "篩選條件"
    });
    await userEvent.click(trigger);
    const panel = await body.findByRole("dialog");
    await expect(panel).toHaveTextContent("顯示範圍");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  }
}`,...(v=(g=d.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var h,b,B;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="py-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="更多操作"><MoreHorizontal className="size-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>R-2403</DropdownMenuLabel>
          <DropdownMenuItem>查看明細</DropdownMenuItem>
          <DropdownMenuItem>複製編號</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">作廢</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>,
  // 鍵盤契約：方向鍵在選項間移動（Radix 把 DOM 焦點移過去）、Esc 關閉、焦點歸還。
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "更多操作"
    });
    await userEvent.click(trigger);
    const menu = await body.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      const first = within(menu).getByRole("menuitem", {
        name: "查看明細"
      });
      expect(doc.activeElement).toBe(first);
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  }
}`,...(B=(b=u.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};var j,E,f;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <ColumnToggleDemo />,
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "欄位"
    });
    await userEvent.click(trigger);
    const menu = await body.findByRole("menu");
    const item = within(menu).getByRole("menuitemcheckbox", {
      name: "數量"
    });
    await expect(item).toHaveAttribute("aria-checked", "false");
    await userEvent.click(item);
    // 勾選後選單仍開著、勾選狀態已翻轉
    await waitFor(() => expect(within(body.getByRole("menu")).getByRole("menuitemcheckbox", {
      name: "數量"
    })).toHaveAttribute("aria-checked", "true"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  }
}`,...(f=(E=p.parameters)==null?void 0:E.docs)==null?void 0:f.source}}};const le=["彈出面板","下拉選單","勾選項不關閉"];export{le as __namedExportsOrder,ce as default,u as 下拉選單,p as 勾選項不關閉,d as 彈出面板};
