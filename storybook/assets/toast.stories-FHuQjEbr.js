import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{within as g,userEvent as j,expect as w}from"./index-DH-M5T-F.js";import{B as l}from"./button-BZKmkDjW.js";import{r as n}from"./index-UiW3gZKV.js";import{r as z}from"./index-3b7XovMV.js";import{c as D}from"./utils-pm6Xa0Qd.js";import{a as A,L as _,T as I,b as L,S as M}from"./callout-9PJf-2LB.js";import{X as U}from"./x-DHctwwaT.js";import{S as m,a as H}from"./skeleton-C5oW7yxH.js";import"./index-C5qX--6C.js";import"./index-rhYpeUg2.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-BA8NevWa.js";import"./createLucideIcon-BcR0bl2m.js";const F={success:L,warning:I,info:_,danger:A},O=5e3,R=n.createContext(null);function P(){const s=n.useContext(R);if(!s)throw new Error("useToast 必須在 <ToastProvider> 之內使用");return s}function h({children:s}){const[t,a]=n.useState([]),i=n.useRef(0),r=n.useCallback(d=>{a(o=>o.filter(f=>f.id!==d))},[]),u=n.useCallback(d=>{const o=++i.current;return a(f=>[...f,{...d,id:o}].slice(-3)),o},[]),c=n.useMemo(()=>({push:u,dismiss:r}),[u,r]);return e.jsxs(R.Provider,{value:c,children:[s,e.jsx(q,{items:t,dismiss:r})]})}function q({items:s,dismiss:t}){const[a,i]=n.useState(!1);return n.useEffect(()=>i(!0),[]),!a||s.length===0?null:z.createPortal(e.jsx("div",{className:"pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2",children:s.map(r=>e.jsx(X,{item:r,onDismiss:()=>t(r.id)},r.id))}),document.body)}function X({item:s,onDismiss:t}){const a=F[s.variant],i=s.variant==="danger",r=n.useRef(s.duration??O),u=n.useRef(0),c=n.useRef(null),d=()=>{c.current&&(clearTimeout(c.current),c.current=null,r.current-=Date.now()-u.current)},o=()=>{i||c.current||(u.current=Date.now(),c.current=setTimeout(t,Math.max(r.current,0)))};return n.useEffect(()=>(o(),d),[]),e.jsxs("div",{role:i?"alert":"status","aria-live":i?"assertive":"polite",onMouseEnter:d,onMouseLeave:o,onFocus:d,onBlur:o,className:D("pointer-events-auto flex items-start gap-2.5 rounded-md border border-l-4 border-l-current p-3 shadow-lg","animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none",M[s.variant]),children:[e.jsx(a,{className:"mt-0.5 size-4 shrink-0","aria-hidden":!0}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-semibold",children:s.title}),s.description&&e.jsx("div",{className:"mt-0.5 text-xs leading-relaxed opacity-90",children:s.description})]}),e.jsx("button",{type:"button","aria-label":"關閉通知",onClick:t,className:"state-layer tap-target -m-1 ml-auto flex shrink-0 items-center justify-center rounded p-1",children:e.jsx(U,{className:"size-4","aria-hidden":!0})})]})}h.__docgenInfo={description:"包在應用最外層（或至少包住會發回饋的區塊）。viewport 由 Provider 自帶，不必另掛。",methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const ie={title:"元件/狀態/操作回饋與載入"};function $(){const{push:s}=P();return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(l,{size:"sm",onClick:()=>s({variant:"success",title:"已儲存",description:"12 個欄位已更新。"}),children:"成功"}),e.jsx(l,{size:"sm",variant:"secondary",onClick:()=>s({variant:"info",title:"已加入排程",description:"匯出完成後會在這裡通知。"}),children:"資訊"}),e.jsx(l,{size:"sm",variant:"secondary",onClick:()=>s({variant:"warning",title:"部分項目已略過",description:"3 筆重複的紀錄未匯入。"}),children:"警示"}),e.jsx(l,{size:"sm",variant:"destructive",onClick:()=>s({variant:"danger",title:"儲存失敗",description:"連線逾時，請再試一次。此訊息不會自動消失。"}),children:"失敗（不自動消失）"})]})}const x={render:()=>e.jsx(h,{children:e.jsxs("div",{className:"max-w-xl space-y-3",children:[e.jsx($,{}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["去向固定",e.jsx("strong",{children:"右下"}),"、堆疊上限 3（最舊被擠出）。success／info／warning 5 秒自動消失，hover／聚焦時暫停倒數；",e.jsx("strong",{children:"danger 一律手動關閉"}),"。 語彙與 Callout 同源：同一張圖示表、同一組淡底，不靠顏色單獨傳達。"]})]})}),play:async({canvasElement:s})=>{const t=g(s),a=g(s.ownerDocument.body);await j.click(t.getByRole("button",{name:"成功"})),await w(await a.findByRole("status")).toHaveTextContent("已儲存"),await j.click(t.getByRole("button",{name:"失敗（不自動消失）"})),await w(await a.findByRole("alert")).toHaveTextContent("儲存失敗")}};function G(){const{push:s}=P();return e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(l,{size:"sm",variant:"secondary",onClick:()=>{for(let t=1;t<=10;t++)s({variant:"info",title:`第 ${t} 則`,description:"連發測試——上限 3，最舊被擠出。"})},children:"連發 10 則"}),e.jsx(l,{size:"sm",variant:"secondary",onClick:()=>s({variant:"warning",title:"超長標題也不會把版面撐破，會自動折行而不是裁掉或推開其他訊息",description:"說明文字同樣可以很長：匯入完成，共 4,820 筆；其中 96 筆因欄位格式不符已略過，明細已寫入匯入紀錄，可於清單頁以「已略過」篩選檢視。"}),children:"超長文字"})]})}const p={render:()=>e.jsx(h,{children:e.jsxs("div",{className:"max-w-xl space-y-3",children:[e.jsx(G,{}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"連發不會疊出一面牆——上限 3 是硬的。重要到不能被擠出的訊息，該用 Dialog 不是 Toast。"})]})})},v={render:()=>e.jsxs("div",{className:"grid max-w-2xl gap-4 md:grid-cols-2",children:[e.jsxs("div",{"aria-busy":"true",className:"space-y-3 rounded-lg border p-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(m,{className:"size-10 rounded-full"}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(m,{className:"h-4 w-2/5"}),e.jsx(m,{className:"h-3 w-3/5"})]})]}),e.jsx(H,{lines:3}),e.jsx(m,{className:"h-8 w-24"})]}),e.jsxs("div",{className:"space-y-2 text-xs text-muted-foreground",children:[e.jsxs("p",{children:["骨架必須",e.jsx("strong",{children:"保留真實版面的高度與形狀"}),"——載入完成的瞬間版面不跳動。"]}),e.jsx("p",{children:"只用於首次載入；重新整理既有畫面時保留舊內容，不要把看得好好的資料閃成灰塊。"}),e.jsxs("p",{children:["骨架本身 ",e.jsx("code",{children:"aria-hidden"}),"，載入語意掛在容器的 ",e.jsx("code",{children:"aria-busy"})," 上； 脈動尊重 ",e.jsx("code",{children:"prefers-reduced-motion"}),"（自動停止）。"]})]})]})};var y,N,T;x.parameters={...x.parameters,docs:{...(y=x.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(T=(N=x.parameters)==null?void 0:N.docs)==null?void 0:T.source}}};var b,C,k;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <ToastProvider>
      <div className="max-w-xl space-y-3">
        <StressButtons />
        <p className="text-tiny text-muted-foreground">
          連發不會疊出一面牆——上限 3 是硬的。重要到不能被擠出的訊息，該用 Dialog 不是 Toast。
        </p>
      </div>
    </ToastProvider>
}`,...(k=(C=p.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var S,E,B;v.parameters={...v.parameters,docs:{...(S=v.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(B=(E=v.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};const ce=["操作回饋","回饋壓測","載入佔位"];export{ce as __namedExportsOrder,ie as default,p as 回饋壓測,x as 操作回饋,v as 載入佔位};
