import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{within as d,userEvent as l,expect as m}from"./index-DH-M5T-F.js";import{B as a}from"./button-DyXVXefs.js";import{T as w,u as N}from"./toast-txisWBD3.js";import{S as t,a as k}from"./skeleton-36koZ389.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-BOrUEQ0c.js";import"./utils-CMl-9ImW.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./callout-DtvOEiw4.js";import"./createLucideIcon-BcR0bl2m.js";import"./x-DHctwwaT.js";const G={title:"元件/狀態/操作回饋與載入"};function T(){const{push:s}=N();return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{size:"sm",onClick:()=>s({variant:"success",title:"已儲存",description:"12 個欄位已更新。"}),children:"成功"}),e.jsx(a,{size:"sm",variant:"secondary",onClick:()=>s({variant:"info",title:"已加入排程",description:"匯出完成後會在這裡通知。"}),children:"資訊"}),e.jsx(a,{size:"sm",variant:"secondary",onClick:()=>s({variant:"warning",title:"部分項目已略過",description:"3 筆重複的紀錄未匯入。"}),children:"警示"}),e.jsx(a,{size:"sm",variant:"destructive",onClick:()=>s({variant:"danger",title:"儲存失敗",description:"連線逾時，請再試一次。此訊息不會自動消失。"}),children:"失敗（不自動消失）"})]})}const r={render:()=>e.jsx(w,{children:e.jsxs("div",{className:"max-w-xl space-y-3",children:[e.jsx(T,{}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["去向固定",e.jsx("strong",{children:"右下"}),"、堆疊上限 3（最舊被擠出）。success／info／warning 5 秒自動消失，hover／聚焦時暫停倒數；",e.jsx("strong",{children:"danger 一律手動關閉"}),"。 語彙與 Callout 同源：同一張圖示表、同一組淡底，不靠顏色單獨傳達。"]})]})}),play:async({canvasElement:s})=>{const n=d(s),c=d(s.ownerDocument.body);await l.click(n.getByRole("button",{name:"成功"})),await m(await c.findByRole("status")).toHaveTextContent("已儲存"),await l.click(n.getByRole("button",{name:"失敗（不自動消失）"})),await m(await c.findByRole("alert")).toHaveTextContent("儲存失敗")}};function B(){const{push:s}=N();return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{size:"sm",variant:"secondary",onClick:()=>{for(let n=1;n<=10;n++)s({variant:"info",title:`第 ${n} 則`,description:"連發測試——上限 3，最舊被擠出。"})},children:"連發 10 則"}),e.jsx(a,{size:"sm",variant:"secondary",onClick:()=>s({variant:"warning",title:"超長標題也不會把版面撐破，會自動折行而不是裁掉或推開其他訊息",description:"說明文字同樣可以很長：匯入完成，共 4,820 筆；其中 96 筆因欄位格式不符已略過，明細已寫入匯入紀錄，可於清單頁以「已略過」篩選檢視。"}),children:"超長文字"})]})}const i={render:()=>e.jsx(w,{children:e.jsxs("div",{className:"max-w-xl space-y-3",children:[e.jsx(B,{}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"連發不會疊出一面牆——上限 3 是硬的。重要到不能被擠出的訊息，該用 Dialog 不是 Toast。"})]})})},o={render:()=>e.jsxs("div",{className:"grid max-w-2xl gap-4 md:grid-cols-2",children:[e.jsxs("div",{"aria-busy":"true",className:"space-y-3 rounded-lg border p-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(t,{className:"size-10 rounded-full"}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(t,{className:"h-4 w-2/5"}),e.jsx(t,{className:"h-3 w-3/5"})]})]}),e.jsx(k,{lines:3}),e.jsx(t,{className:"h-8 w-24"})]}),e.jsxs("div",{className:"space-y-2 text-xs text-muted-foreground",children:[e.jsxs("p",{children:["骨架必須",e.jsx("strong",{children:"保留真實版面的高度與形狀"}),"——載入完成的瞬間版面不跳動。"]}),e.jsx("p",{children:"只用於首次載入；重新整理既有畫面時保留舊內容，不要把看得好好的資料閃成灰塊。"}),e.jsxs("p",{children:["骨架本身 ",e.jsx("code",{children:"aria-hidden"}),"，載入語意掛在容器的 ",e.jsx("code",{children:"aria-busy"})," 上； 脈動尊重 ",e.jsx("code",{children:"prefers-reduced-motion"}),"（自動停止）。"]})]})]})};var x,p,u;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <ToastProvider>
      <div className="max-w-xl space-y-3">
        <PushButtons />
        <p className="text-tiny text-muted-foreground">
          去向固定<strong>右下</strong>、堆疊上限 3（最舊被擠出）。success／info／warning
          5 秒自動消失，hover／聚焦時暫停倒數；<strong>danger 一律手動關閉</strong>。
          語彙與 Callout 同源：同一張圖示表、同一組淡底，不靠顏色單獨傳達。
        </p>
      </div>
    </ToastProvider>,
  // 宣告可被讀屏聽到：success 走 role=status（禮貌宣告）、danger 走 role=alert（立即打斷）
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", {
      name: "成功"
    }));
    await expect(await doc.findByRole("status")).toHaveTextContent("已儲存");
    await userEvent.click(canvas.getByRole("button", {
      name: "失敗（不自動消失）"
    }));
    await expect(await doc.findByRole("alert")).toHaveTextContent("儲存失敗");
  }
}`,...(u=(p=r.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var v,h,g;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <ToastProvider>
      <div className="max-w-xl space-y-3">
        <StressButtons />
        <p className="text-tiny text-muted-foreground">
          連發不會疊出一面牆——上限 3 是硬的。重要到不能被擠出的訊息，該用 Dialog 不是 Toast。
        </p>
      </div>
    </ToastProvider>
}`,...(g=(h=i.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var j,y,f;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <div aria-busy="true" className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
        <SkeletonText lines={3} />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>骨架必須<strong>保留真實版面的高度與形狀</strong>——載入完成的瞬間版面不跳動。</p>
        <p>只用於首次載入；重新整理既有畫面時保留舊內容，不要把看得好好的資料閃成灰塊。</p>
        <p>
          骨架本身 <code>aria-hidden</code>，載入語意掛在容器的 <code>aria-busy</code> 上；
          脈動尊重 <code>prefers-reduced-motion</code>（自動停止）。
        </p>
      </div>
    </div>
}`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const I=["操作回饋","回饋壓測","載入佔位"];export{I as __namedExportsOrder,G as default,i as 回饋壓測,r as 操作回饋,o as 載入佔位};
