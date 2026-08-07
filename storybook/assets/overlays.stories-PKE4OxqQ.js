import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{within as p,userEvent as c,waitFor as l,expect as n}from"./index-DH-M5T-F.js";import{T as m,a as D}from"./tooltip-CldeheBp.js";import{B as d}from"./button-BZKmkDjW.js";import{D as B,a as j,b as f,c as N,d as T,e as E,f as b,g as R}from"./dialog-Bk48r2KG.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-pm6Xa0Qd.js";import"./index-C5qX--6C.js";import"./index-rhYpeUg2.js";import"./Combination-BkzcTUOc.js";import"./index-B0PXCDJg.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./x-DHctwwaT.js";import"./createLucideIcon-BcR0bl2m.js";const P={title:"元件/浮層/提示泡泡・對話框"},r={render:()=>e.jsxs("div",{className:"space-y-6 py-8",children:[e.jsxs("p",{className:"text-sm",children:["處理狀態",e.jsx(m,{content:"「已確認」代表已鎖定內容與數量，尚未進入處理。",className:"ml-1",children:e.jsx("span",{className:"cursor-help underline decoration-dotted underline-offset-2",children:"已確認"})})]}),e.jsxs("div",{className:"max-w-[220px] rounded-md border p-2",children:[e.jsx(D,{text:"工業級軸承 6204 / 深溝球 / 雙面防塵蓋 / 內徑 20mm"}),e.jsx("p",{className:"mt-1 text-tiny text-muted-foreground",children:"截斷文字：hover 或長壓看完整內容。"})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(m,{content:"靠右的泡泡會自動夾回視窗內，不會被切掉。",children:e.jsx("span",{className:"cursor-help rounded border px-2 py-1 text-xs",children:"邊緣測試"})})}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"行動裝置沒有 hover：長壓約 0.35 秒顯示。不處理長壓＝所有靠泡泡補充的資訊在手機上等於不存在。"})]}),play:async({canvasElement:o})=>{const t=p(o),a=t.getByText("已確認");await c.hover(a);const i=await t.findByRole("tooltip");await n(i).toHaveTextContent("已鎖定內容與數量"),await c.unhover(a),await l(()=>n(t.queryByRole("tooltip")).toBeNull())}},s={render:()=>e.jsxs(B,{children:[e.jsx(j,{asChild:!0,children:e.jsx(d,{variant:"destructive",children:"作廢這筆"})}),e.jsxs(f,{children:[e.jsxs(N,{children:[e.jsx(T,{children:"確定要作廢 R-2403？"}),e.jsx(E,{children:"作廢後將釋放已保留的配額，且此動作會寫入異動紀錄。已完成的項目不受影響。"})]}),e.jsxs(b,{children:[e.jsx(R,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"返回"})}),e.jsx(d,{variant:"destructive",children:"確定作廢"})]})]})]}),play:async({canvasElement:o})=>{const t=o.ownerDocument,a=p(t.body),i=p(o).getByRole("button",{name:"作廢這筆"});await c.click(i);const w=await a.findByRole("dialog");await l(()=>n(w.contains(t.activeElement)).toBe(!0)),await c.keyboard("{Escape}"),await l(()=>n(a.queryByRole("dialog")).toBeNull()),await l(()=>n(t.activeElement).toBe(i))}};var u,g,x;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-6 py-8">
      <p className="text-sm">
        處理狀態
        <Tooltip content="「已確認」代表已鎖定內容與數量，尚未進入處理。" className="ml-1">
          <span className="cursor-help underline decoration-dotted underline-offset-2">已確認</span>
        </Tooltip>
      </p>
      <div className="max-w-[220px] rounded-md border p-2">
        <TruncatedText text="工業級軸承 6204 / 深溝球 / 雙面防塵蓋 / 內徑 20mm" />
        <p className="mt-1 text-tiny text-muted-foreground">截斷文字：hover 或長壓看完整內容。</p>
      </div>
      <div className="flex justify-end">
        <Tooltip content="靠右的泡泡會自動夾回視窗內，不會被切掉。">
          <span className="cursor-help rounded border px-2 py-1 text-xs">邊緣測試</span>
        </Tooltip>
      </div>
      <p className="text-tiny text-muted-foreground">
        行動裝置沒有 hover：長壓約 0.35 秒顯示。不處理長壓＝所有靠泡泡補充的資訊在手機上等於不存在。
      </p>
    </div>,
  // 泡泡的行為契約：hover 顯示 role=tooltip、移開消失（顯示時機規範的可驗部分）
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText("已確認");
    await userEvent.hover(trigger);
    const tip = await canvas.findByRole("tooltip");
    await expect(tip).toHaveTextContent("已鎖定內容與數量");
    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByRole("tooltip")).toBeNull());
  }
}`,...(x=(g=r.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var v,y,h;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild><Button variant="destructive">作廢這筆</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定要作廢 R-2403？</DialogTitle>
          <DialogDescription>
            作廢後將釋放已保留的配額，且此動作會寫入異動紀錄。已完成的項目不受影響。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">返回</Button></DialogClose>
          <Button variant="destructive">確定作廢</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  // 焦點陷阱三段式：開啟後焦點進對話框、Esc 關閉、焦點回到觸發鈕。
  // Dialog 走 portal 掛在 body——斷言要查 ownerDocument.body，不是 canvas 子樹。
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const trigger = within(canvasElement).getByRole("button", {
      name: "作廢這筆"
    });
    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(doc.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(doc.activeElement).toBe(trigger));
  }
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};const Q=["提示泡泡","對話框"];export{Q as __namedExportsOrder,P as default,s as 對話框,r as 提示泡泡};
