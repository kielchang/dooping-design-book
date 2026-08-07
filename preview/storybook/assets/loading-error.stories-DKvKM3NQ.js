import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-UiW3gZKV.js";import{within as k,expect as o}from"./index-DH-M5T-F.js";import{S as C,a as E}from"./skeleton-C5oW7yxH.js";import{D as B}from"./data-table-BWSuqf5m.js";import{B as b}from"./button-BZKmkDjW.js";import{I as v}from"./input-vSeq6R7n.js";import{N as R}from"./number-input-DJbZuNmz.js";import{a as I,C as z}from"./callout-9PJf-2LB.js";import{c as q,a as A}from"./utils-pm6Xa0Qd.js";import{L}from"./label-CcKLfqeY.js";import{a as H}from"./sample-data-DlVwqcXX.js";import{c as _}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./select-oRfq6VYn.js";import"./Combination-BkzcTUOc.js";import"./index-B0PXCDJg.js";import"./index-C5qX--6C.js";import"./index-DW-t51uL.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./index-rhYpeUg2.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=_("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);function c({label:t,hint:a,error:r,required:s,children:n,className:m}){const p=i.useId(),x=`${p}-control`,h=a?`${p}-hint`:void 0,f=r?`${p}-error`:void 0,S=[h,f].filter(Boolean).join(" ")||void 0;return e.jsxs("div",{className:q("space-y-1.5",m),children:[e.jsxs(L,{htmlFor:x,children:[t,s&&e.jsx("span",{className:"ml-0.5 text-danger",title:"必填","aria-label":"必填",children:"*"})]}),i.isValidElement(n)?i.cloneElement(n,{id:x,"aria-describedby":S,"aria-invalid":r?!0:void 0}):n,a&&e.jsx("p",{id:h,className:"text-xs text-muted-foreground",children:a}),r&&e.jsx(u,{id:f,children:r})]})}function u({id:t,children:a,className:r}){return e.jsxs("p",{id:t,className:q("flex items-start gap-1 text-xs text-danger",r),children:[e.jsx(I,{className:"mt-0.5 size-3.5 shrink-0","aria-hidden":!0}),e.jsx("span",{children:a})]})}c.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""},hint:{required:!1,tsType:{name:"ReactNode"},description:"常駐說明（格式、範例）。錯誤出現時仍保留——錯誤是加上去的，不是換掉說明。"},error:{required:!1,tsType:{name:"ReactNode"},description:"錯誤訊息。有值＝欄位進入錯誤態（控制項自動接到 `aria-invalid` 與 describedby）。\n讀屏在聚焦欄位時會念到它；「操作後即時播報」是表單層 Callout（`live`）的職責。"},required:{required:!1,tsType:{name:"boolean"},description:"必填星號＋文字說明（顏色不是唯一線索，星號本身帶 title）。"},children:{required:!0,tsType:{name:"ReactElement",elements:[{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>"}],raw:"ReactElement<Record<string, unknown>>"},description:"單一控制項（Input／Select／NumberInput／Checkbox…），aria 由本元件注入。"},className:{required:!1,tsType:{name:"string"},description:""}}};u.__docgenInfo={description:"欄位錯誤小字：色＋圖示＋文字三重編碼（WCAG 1.4.1）。\n可獨立使用（自組表單時），但記得自己接 `aria-describedby`——\n或直接用 FormField，它會接好。",methods:[],displayName:"FieldError",props:{id:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const xe={title:"元件/狀態/載入與錯誤"},P=[{key:"id",header:"編號",cell:t=>t.id},{key:"unit",header:"單位",cell:t=>t.unit},{key:"qty",header:"數量",numeric:!0,cell:t=>A(t.qty)}],d={render:()=>{const[t,a]=i.useState("first");i.useEffect(()=>{if(t==="first"){const s=setTimeout(()=>a("loaded"),3e3);return()=>clearTimeout(s)}if(t==="refetch"){const s=setTimeout(()=>a("loaded"),2e3);return()=>clearTimeout(s)}},[t]);const r=t!=="loaded";return e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"1・首載＝骨架（版面已知不跳動）　2・重查＝就地變暗（舊資料仍可讀）"}),e.jsx(B,{rows:t==="first"?[]:H.slice(0,5),columns:P,getRowKey:s=>s.id,pageSize:5,searchable:!1,loading:r}),e.jsxs(b,{size:"sm",variant:"outline",className:"mt-2",disabled:r,onClick:()=>a("refetch"),children:[e.jsx(y,{className:"mr-1 size-3.5","aria-hidden":!0}),"重新查詢（看變暗態）"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"3・提交中＝disabled＋圖示＋文案（按鈕沒有 loading 變體）"}),e.jsxs(b,{disabled:!0,children:[e.jsx(y,{className:"mr-1.5 size-4 animate-spin","aria-hidden":!0}),"處理中…"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"骨架積木（Skeleton／SkeletonText）"}),e.jsxs("div",{className:"max-w-sm space-y-3 rounded-lg border p-4",children:[e.jsx(C,{className:"h-5 w-2/5"}),e.jsx(E,{})]})]})]})}},l={render:()=>e.jsxs("div",{className:"max-w-sm space-y-5",children:[e.jsx(c,{label:"名稱",hint:"2–20 個字",required:!0,children:e.jsx(v,{placeholder:"輸入名稱"})}),e.jsx(c,{label:"數量",required:!0,error:"必須大於 0",children:e.jsx(R,{value:0,onChange:()=>{}})}),e.jsx(c,{label:"備註（獨立 FieldError 的長相）",children:e.jsx(v,{defaultValue:"！！！","aria-invalid":!0})}),e.jsx(u,{children:"含有不允許的字元"}),e.jsx(z,{variant:"danger",title:"有 2 個欄位需要修正",live:!0,children:"錯誤欄位已就地標示——這一層是彙總，不取代欄位下的訊息。"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"聚焦錯誤欄位：danger 邊框（語意）與中性聚焦環（焦點）同框不打架—— 提醒色辭典同框分工的欄位落地。"})]}),play:async({canvasElement:t})=>{const a=k(t),r=a.getByLabelText(/數量/);await o(r).toHaveAttribute("aria-invalid","true");const s=r.getAttribute("aria-describedby");await o(s).toBeTruthy();const n=t.querySelector(`#${CSS.escape(s.split(" ").pop())}`);await o(n).toHaveTextContent("必須大於 0");const m=a.getByLabelText(/名稱/);await o(m).not.toHaveAttribute("aria-invalid")}};var g,N,j;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    // 模擬「首載 3 秒後資料到」與「重查 2 秒」——展示兩種長相怎麼切換
    const [phase, setPhase] = useState<"first" | "loaded" | "refetch">("first");
    useEffect(() => {
      if (phase === "first") {
        const t = setTimeout(() => setPhase("loaded"), 3000);
        return () => clearTimeout(t);
      }
      if (phase === "refetch") {
        const t = setTimeout(() => setPhase("loaded"), 2000);
        return () => clearTimeout(t);
      }
    }, [phase]);
    const loading = phase !== "loaded";
    return <div className="max-w-xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">
            1・首載＝骨架（版面已知不跳動）　2・重查＝就地變暗（舊資料仍可讀）
          </p>
          <DataTable rows={phase === "first" ? [] : demoRecords.slice(0, 5)} columns={cols} getRowKey={r => r.id} pageSize={5} searchable={false} loading={loading} />
          <Button size="sm" variant="outline" className="mt-2" disabled={loading} onClick={() => setPhase("refetch")}>
            <RotateCw className="mr-1 size-3.5" aria-hidden />
            重新查詢（看變暗態）
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">3・提交中＝disabled＋圖示＋文案（按鈕沒有 loading 變體）</p>
          <Button disabled>
            <RotateCw className="mr-1.5 size-4 animate-spin" aria-hidden />
            處理中…
          </Button>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">骨架積木（Skeleton／SkeletonText）</p>
          <div className="max-w-sm space-y-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-2/5" />
            <SkeletonText />
          </div>
        </div>
      </div>;
  }
}`,...(j=(N=d.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var w,T,F;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm space-y-5">
      <FormField label="名稱" hint="2–20 個字" required>
        <Input placeholder="輸入名稱" />
      </FormField>
      <FormField label="數量" required error="必須大於 0">
        <NumberInput value={0} onChange={() => {}} />
      </FormField>
      <FormField label="備註（獨立 FieldError 的長相）">
        <Input defaultValue="！！！" aria-invalid />
      </FormField>
      <FieldError>含有不允許的字元</FieldError>
      <Callout variant="danger" title="有 2 個欄位需要修正" live>
        錯誤欄位已就地標示——這一層是彙總，不取代欄位下的訊息。
      </Callout>
      <p className="text-xs text-muted-foreground">
        聚焦錯誤欄位：danger 邊框（語意）與中性聚焦環（焦點）同框不打架——
        提醒色辭典同框分工的欄位落地。
      </p>
    </div>,
  // 第一支 play function：驗 FormField 的 aria 連動——這正是它存在的理由，
  // 而且是改版時最容易安靜壞掉的部分（樣式看起來都對，讀屏卻接不到訊息）。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const qty = canvas.getByLabelText(/數量/);
    await expect(qty).toHaveAttribute("aria-invalid", "true");
    const describedBy = qty.getAttribute("aria-describedby");
    await expect(describedBy).toBeTruthy();
    const errorEl = canvasElement.querySelector(\`#\${CSS.escape(describedBy!.split(" ").pop()!)}\`);
    await expect(errorEl).toHaveTextContent("必須大於 0");
    // 沒有錯誤的欄位不得帶 aria-invalid
    const name = canvas.getByLabelText(/名稱/);
    await expect(name).not.toHaveAttribute("aria-invalid");
  }
}`,...(F=(T=l.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};const he=["載入的三種手段","欄位錯誤態"];export{he as __namedExportsOrder,xe as default,l as 欄位錯誤態,d as 載入的三種手段};
