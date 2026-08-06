import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{T as n,a as m}from"./tooltip-1GOoMEVs.js";import{B as s}from"./button-i72Edb48.js";import{D as p,a as x,b as u,c as g,d as h,e as D,f as j,g as v}from"./dialog-xzhddh7c.js";import"./index-BFQ_Q9OP.js";import"./utils-pm6Xa0Qd.js";import"./index-DdXKfkXy.js";import"./index-rhYpeUg2.js";import"./Combination-DbYkIDSq.js";import"./index-BTi5fV8z.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./x-C3WrzgWc.js";import"./createLucideIcon-DDRU598s.js";const O={title:"元件/浮層/提示泡泡・對話框"},t={render:()=>e.jsxs("div",{className:"space-y-6 py-8",children:[e.jsxs("p",{className:"text-sm",children:["處理狀態",e.jsx(n,{content:"「已確認」代表已鎖定內容與數量，尚未進入處理。",className:"ml-1",children:e.jsx("span",{className:"cursor-help underline decoration-dotted underline-offset-2",children:"已確認"})})]}),e.jsxs("div",{className:"max-w-[220px] rounded-md border p-2",children:[e.jsx(m,{text:"工業級軸承 6204 / 深溝球 / 雙面防塵蓋 / 內徑 20mm"}),e.jsx("p",{className:"mt-1 text-tiny text-muted-foreground",children:"截斷文字：hover 或長壓看完整內容。"})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx(n,{content:"靠右的泡泡會自動夾回視窗內，不會被切掉。",children:e.jsx("span",{className:"cursor-help rounded border px-2 py-1 text-xs",children:"邊緣測試"})})}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"行動裝置沒有 hover：長壓約 0.35 秒顯示。不處理長壓＝所有靠泡泡補充的資訊在手機上等於不存在。"})]})},r={render:()=>e.jsxs(p,{children:[e.jsx(x,{asChild:!0,children:e.jsx(s,{variant:"destructive",children:"作廢這筆"})}),e.jsxs(u,{children:[e.jsxs(g,{children:[e.jsx(h,{children:"確定要作廢 R-2403？"}),e.jsx(D,{children:"作廢後將釋放已保留的配額，且此動作會寫入異動紀錄。已完成的項目不受影響。"})]}),e.jsxs(j,{children:[e.jsx(v,{asChild:!0,children:e.jsx(s,{variant:"outline",children:"返回"})}),e.jsx(s,{variant:"destructive",children:"確定作廢"})]})]})]})};var o,a,i;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
    </div>
}`,...(i=(a=t.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};var l,d,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
    </Dialog>
}`,...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const k=["提示泡泡","對話框"];export{k as __namedExportsOrder,O as default,r as 對話框,t as 提示泡泡};
