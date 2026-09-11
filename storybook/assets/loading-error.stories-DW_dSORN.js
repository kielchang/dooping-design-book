import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-UiW3gZKV.js";import{within as q,expect as s}from"./index-DH-M5T-F.js";import{S as B,a as R}from"./skeleton-36koZ389.js";import{D as E}from"./data-table-CVaqZJok.js";import{B as y}from"./button-DyXVXefs.js";import{I as f}from"./input-D31gR-xu.js";import{N as k}from"./number-input-w7UrOL80.js";import{a as I,C as A}from"./callout-DtvOEiw4.js";import{S as H,a as z,b as L,c as D,d as $}from"./select-CtC8ydIk.js";import{c as F,a as P}from"./utils-CMl-9ImW.js";import{L as _}from"./label-DCW2ivba.js";import{a as C}from"./sample-data-I9KaR9SF.js";import{c as V}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-BoO4nXaP.js";import"./empty-state-KwOlHdIt.js";import"./tooltip-wQla93iR.js";import"./checkbox-BPXNu1Dg.js";import"./index-VXoYh6zd.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./popover-D_gDLSMC.js";import"./index-Btum-Xq9.js";import"./dropdown-menu-DIIbaxa5.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./index-BOrUEQ0c.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=V("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);function l({label:t,hint:r,error:a,required:n,children:i,className:c}){const o=d.useId(),m=r?`${o}-hint`:void 0,u=a?`${o}-error`:void 0,h={id:`${o}-control`,"aria-describedby":[m,u].filter(Boolean).join(" ")||void 0,"aria-invalid":a?!0:void 0};return e.jsxs("div",{className:F("space-y-1.5",c),children:[e.jsxs(_,{htmlFor:h.id,children:[t,n&&e.jsx("span",{className:"ml-0.5 text-danger",title:"必填","aria-label":"必填",children:"*"})]}),typeof i=="function"?i(h):d.isValidElement(i)?d.cloneElement(i,{...h}):i,r&&e.jsx("p",{id:m,className:"text-xs text-muted-foreground",children:r}),a&&e.jsx(b,{id:u,children:a})]})}function b({id:t,children:r,className:a}){return e.jsxs("p",{id:t,className:F("flex items-start gap-1 text-xs text-danger",a),children:[e.jsx(I,{className:"mt-0.5 size-3.5 shrink-0","aria-hidden":!0}),e.jsx("span",{children:r})]})}l.__docgenInfo={description:"",methods:[],displayName:"FormField",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""},hint:{required:!1,tsType:{name:"ReactNode"},description:"常駐說明（格式、範例）。錯誤出現時仍保留——錯誤是加上去的，不是換掉說明。"},error:{required:!1,tsType:{name:"ReactNode"},description:"錯誤訊息。有值＝欄位進入錯誤態（控制項自動接到 `aria-invalid` 與 describedby）。\n讀屏在聚焦欄位時會念到它；「操作後即時播報」是表單層 Callout（`live`）的職責。"},required:{required:!1,tsType:{name:"boolean"},description:"必填星號＋文字說明（顏色不是唯一線索，星號本身帶 title）。"},children:{required:!0,tsType:{name:"union",raw:"ReactElement<Record<string, unknown>> | ((control: FormFieldControlProps) => ReactNode)",elements:[{name:"ReactElement",elements:[{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>"}],raw:"ReactElement<Record<string, unknown>>"},{name:"unknown"}]},description:"單一控制項（Input／NumberInput／Checkbox…）：aria 由本元件注入到這個元素上。\n\n可聚焦的不是根元素時（Radix `Select` 能聚焦的是 `SelectTrigger`），改傳函式，\n把收到的屬性展開到那個元素上：\n`{(control) => <Select …><SelectTrigger {...control}>…</SelectTrigger>…</Select>}`"},className:{required:!1,tsType:{name:"string"},description:""}}};b.__docgenInfo={description:"欄位錯誤小字：色＋圖示＋文字三重編碼（WCAG 1.4.1）。\n可獨立使用（自組表單時），但記得自己接 `aria-describedby`——\n或直接用 FormField，它會接好。",methods:[],displayName:"FieldError",props:{id:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const Ne={title:"元件/狀態/載入與錯誤"},K=[{key:"id",header:"編號",cell:t=>t.id},{key:"unit",header:"單位",cell:t=>t.unit},{key:"qty",header:"數量",numeric:!0,cell:t=>P(t.qty)}],p={render:()=>{const[t,r]=d.useState("first");d.useEffect(()=>{if(t==="first"){const n=setTimeout(()=>r("loaded"),3e3);return()=>clearTimeout(n)}if(t==="refetch"){const n=setTimeout(()=>r("loaded"),2e3);return()=>clearTimeout(n)}},[t]);const a=t!=="loaded";return e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"1・首載＝骨架（版面已知不跳動）　2・重查＝變暗＋列脈動（舊資料仍可讀）"}),e.jsx(E,{rows:t==="first"?[]:C.slice(0,5),columns:K,getRowKey:n=>n.id,pageSize:5,searchable:!1,loading:a}),e.jsxs(y,{size:"sm",variant:"outline",className:"mt-2",disabled:a,onClick:()=>r("refetch"),children:[e.jsx(g,{className:"mr-1 size-3.5","aria-hidden":!0}),"重新查詢（看變暗＋脈動態）"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"3・提交中＝disabled＋圖示＋文案（按鈕沒有 loading 變體）"}),e.jsxs(y,{disabled:!0,children:[e.jsx(g,{className:"mr-1.5 size-4 animate-spin","aria-hidden":!0}),"處理中…"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"骨架積木（Skeleton／SkeletonText）"}),e.jsxs("div",{className:"max-w-sm space-y-3 rounded-lg border p-4",children:[e.jsx(B,{className:"h-5 w-2/5"}),e.jsx(R,{})]})]})]})}},x={render:()=>e.jsxs("div",{className:"max-w-sm space-y-5",children:[e.jsx(l,{label:"名稱",hint:"2–20 個字",required:!0,children:e.jsx(f,{placeholder:"輸入名稱"})}),e.jsx(l,{label:"數量",required:!0,error:"必須大於 0",children:e.jsx(k,{value:0,onChange:()=>{}})}),e.jsx(l,{label:"所屬單位",required:!0,error:"請選擇單位",children:t=>e.jsxs(H,{children:[e.jsx(z,{...t,children:e.jsx(L,{placeholder:"選擇單位"})}),e.jsx(D,{children:[...new Set(C.map(r=>r.unit))].map(r=>e.jsx($,{value:r,children:r},r))})]})}),e.jsx(l,{label:"備註（獨立 FieldError 的長相）",children:e.jsx(f,{defaultValue:"！！！","aria-invalid":!0})}),e.jsx(b,{children:"含有不允許的字元"}),e.jsx(A,{variant:"danger",title:"有 3 個欄位需要修正",live:!0,children:"錯誤欄位已就地標示——這一層是彙總，不取代欄位下的訊息。"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"聚焦錯誤欄位：danger 邊框（語意）與中性聚焦環（焦點）同框不打架—— 提醒色辭典同框分工的欄位落地。"})]}),play:async({canvasElement:t})=>{const r=q(t),a=r.getByLabelText(/數量/);await s(a).toHaveAttribute("aria-invalid","true");const n=a.getAttribute("aria-describedby");await s(n).toBeTruthy();const i=t.querySelector(`#${CSS.escape(n.split(" ").pop())}`);await s(i).toHaveTextContent("必須大於 0");const c=r.getByRole("combobox",{name:/所屬單位/});await s(c).toHaveAttribute("aria-invalid","true");const o=c.getAttribute("aria-describedby");await s(o).toBeTruthy();const m=t.querySelector(`#${CSS.escape(o)}`);await s(m).toHaveTextContent("請選擇單位");const u=r.getByLabelText(/名稱/);await s(u).not.toHaveAttribute("aria-invalid")}};var v,S,T;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
            1・首載＝骨架（版面已知不跳動）　2・重查＝變暗＋列脈動（舊資料仍可讀）
          </p>
          <DataTable rows={phase === "first" ? [] : demoRecords.slice(0, 5)} columns={cols} getRowKey={r => r.id} pageSize={5} searchable={false} loading={loading} />
          <Button size="sm" variant="outline" className="mt-2" disabled={loading} onClick={() => setPhase("refetch")}>
            <RotateCw className="mr-1 size-3.5" aria-hidden />
            重新查詢（看變暗＋脈動態）
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
}`,...(T=(S=p.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var j,w,N;x.parameters={...x.parameters,docs:{...(j=x.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm space-y-5">
      <FormField label="名稱" hint="2–20 個字" required>
        <Input placeholder="輸入名稱" />
      </FormField>
      <FormField label="數量" required error="必須大於 0">
        <NumberInput value={0} onChange={() => {}} />
      </FormField>
      {/* 可聚焦的是 SelectTrigger、不是 Select 根元件：children 傳函式，把 id／aria 展開到 trigger 上 */}
      <FormField label="所屬單位" required error="請選擇單位">
        {control => <Select>
            <SelectTrigger {...control}>
              <SelectValue placeholder="選擇單位" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(demoRecords.map(r => r.unit))].map(u => <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>)}
            </SelectContent>
          </Select>}
      </FormField>
      <FormField label="備註（獨立 FieldError 的長相）">
        <Input defaultValue="！！！" aria-invalid />
      </FormField>
      <FieldError>含有不允許的字元</FieldError>
      <Callout variant="danger" title="有 3 個欄位需要修正" live>
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
    // 複合控制項（render prop）：Label 指向可聚焦的 SelectTrigger，aria 也接在它身上
    const unit = canvas.getByRole("combobox", {
      name: /所屬單位/
    });
    await expect(unit).toHaveAttribute("aria-invalid", "true");
    const unitDescribedBy = unit.getAttribute("aria-describedby");
    await expect(unitDescribedBy).toBeTruthy();
    const unitError = canvasElement.querySelector(\`#\${CSS.escape(unitDescribedBy!)}\`);
    await expect(unitError).toHaveTextContent("請選擇單位");
    // 沒有錯誤的欄位不得帶 aria-invalid
    const name = canvas.getByLabelText(/名稱/);
    await expect(name).not.toHaveAttribute("aria-invalid");
  }
}`,...(N=(w=x.parameters)==null?void 0:w.docs)==null?void 0:N.source}}};const Fe=["載入的三種手段","欄位錯誤態"];export{Fe as __namedExportsOrder,Ne as default,x as 欄位錯誤態,p as 載入的三種手段};
