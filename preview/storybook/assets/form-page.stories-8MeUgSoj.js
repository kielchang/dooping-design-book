import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-UiW3gZKV.js";import{B as i}from"./button-DyXVXefs.js";import{I as P}from"./input-D31gR-xu.js";import{L as B}from"./label-DCW2ivba.js";import{N as E}from"./number-input-w7UrOL80.js";import{S as Q}from"./seg-group-Sx5-rRSE.js";import{C as A}from"./chips-DJThxGxI.js";import{S as G}from"./stepper-95_HYif_.js";import{P as H}from"./page-header-CU3Aot3D.js";import{C as M}from"./callout-DtvOEiw4.js";import{T as $,u as z}from"./toast-txisWBD3.js";import{F as j}from"./form-field-DvmEGf66.js";import{C as v,a as S,d as b,b as y,c as T}from"./card-DlPdB5za.js";import{D as J,a as K,b as W,c as X,d as Y,e as Z,f as ee,g as se}from"./dialog-C82NnX_8.js";import{S as _,a as q,b as U,c as L,d as R}from"./select-D6_otMdt.js";import{a as te}from"./utils-CMl-9ImW.js";import{T as ae,C as ne,a as re}from"./sample-data-DgKbD7zu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-BOrUEQ0c.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./check-CZys2X9e.js";import"./createLucideIcon-BcR0bl2m.js";import"./chevron-right-DWuV1wB0.js";import"./x-DHctwwaT.js";import"./index-C-xWP-pl.js";import"./Combination-Gi-zDQIY.js";import"./index-BHxPrZ82.js";import"./index-BmqVfOSQ.js";const Le={title:"頁面/表單頁"},g=[...new Set(re.map(d=>d.unit))],u={render:()=>e.jsx($,{children:e.jsx(ie,{})})};function ie(){const{push:d}=z(),[a,l]=n.useState(""),[c,m]=n.useState(10),[C,p]=n.useState("gold"),[N,x]=n.useState(["online"]),[f,o]=n.useState(!1),t=f&&a.trim()==="";return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-4",children:[e.jsx(H,{title:"建立項目",meta:"填完基本資訊即可送出，其餘設定之後隨時可補。"}),t&&e.jsx(M,{variant:"warning",title:"有 1 個欄位待補",live:!0,children:"「項目名稱」未填寫前無法送出。"}),e.jsxs(v,{children:[e.jsxs(S,{children:[e.jsx(b,{className:"text-base",children:"基本資訊"}),e.jsx(y,{children:"這個項目是什麼、屬於誰。"})]}),e.jsxs(T,{className:"space-y-4",children:[e.jsx(j,{label:"項目名稱",required:!0,error:t?"請輸入項目名稱。":void 0,children:e.jsx(P,{value:a,placeholder:"例：甲案 第一階段",onChange:s=>l(s.target.value)})}),e.jsx(j,{label:"所屬單位",children:s=>e.jsxs(_,{defaultValue:g[0],children:[e.jsx(q,{...s,children:e.jsx(U,{})}),e.jsx(L,{children:g.map(r=>e.jsx(R,{value:r,children:r},r))})]})}),e.jsx(Q,{label:"等級",options:ae,value:C,onPick:p})]})]}),e.jsxs(v,{children:[e.jsxs(S,{children:[e.jsx(b,{className:"text-base",children:"數量與管道"}),e.jsx(y,{children:"之後在明細頁隨時可以調整。"})]}),e.jsxs(T,{className:"space-y-4",children:[e.jsxs("div",{className:"max-w-40 space-y-1",children:[e.jsx(B,{children:"數量"}),e.jsx(E,{value:c,onChange:m,min:1,step:10,"aria-label":"數量"})]}),e.jsx(A,{label:"聯絡管道",options:ne,selected:N,onToggle:s=>x(r=>r.includes(s)?r.filter(V=>V!==s):[...r,s])})]})]}),e.jsxs("div",{className:"flex items-center justify-between border-t pt-4",children:[e.jsxs(J,{children:[e.jsx(K,{asChild:!0,children:e.jsx(i,{variant:"ghost",children:"取消"})}),e.jsxs(W,{children:[e.jsxs(X,{children:[e.jsx(Y,{children:"要放棄這份表單？"}),e.jsx(Z,{children:"已填的內容不會保留。"})]}),e.jsxs(ee,{children:[e.jsx(se,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"繼續填寫"})}),e.jsx(i,{variant:"destructive",children:"放棄"})]})]})]}),e.jsx(i,{onClick:()=>{o(!0),a.trim()!==""&&d({variant:"success",title:"已建立",description:`「${a.trim()}」已建立。`})},children:"送出"})]})]})}const h={render:function(){const a=[{key:"unit",label:"選擇單位"},{key:"items",label:"加入項目",hint:"名稱與數量"},{key:"review",label:"確認送出"}],[l,c]=n.useState(0),[m,C]=n.useState(g[0]),[p,N]=n.useState("甲案 第一階段"),[x,f]=n.useState(120),o=a[l].key;return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-6",children:[e.jsx(H,{title:"建立批次",meta:"三步完成；可以隨時回上一步，已填的內容不會不見。"}),e.jsx(G,{current:o,onStep:t=>c(a.findIndex(s=>s.key===t)),completed:Object.fromEntries(a.map((t,s)=>[t.key,s<l])),steps:a}),o==="unit"&&e.jsx(j,{label:"所屬單位",className:"max-w-sm",children:t=>e.jsxs(_,{value:m,onValueChange:C,children:[e.jsx(q,{...t,children:e.jsx(U,{})}),e.jsx(L,{children:g.map(s=>e.jsx(R,{value:s,children:s},s))})]})}),o==="items"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx(j,{label:"項目名稱",children:e.jsx(P,{value:p,onChange:t=>N(t.target.value)})}),e.jsxs("div",{className:"max-w-40 space-y-1",children:[e.jsx(B,{children:"數量"}),e.jsx(E,{value:x,onChange:f,min:1,step:10,"aria-label":"數量"})]})]}),o==="review"&&e.jsxs(v,{children:[e.jsxs(S,{children:[e.jsx(b,{className:"text-base",children:"最後確認"}),e.jsx(y,{children:"送出後會建立 1 筆批次，內容仍可在明細頁調整。"})]}),e.jsxs(T,{className:"space-y-1 text-sm",children:[e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"所屬單位　"}),m]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"項目名稱　"}),p]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"數量　　　"}),te(x)]})]})]}),e.jsxs("div",{className:"flex items-center justify-between border-t pt-4",children:[e.jsx(i,{variant:"outline",disabled:l===0,onClick:()=>c(t=>t-1),children:"上一步"}),l<a.length-1?e.jsx(i,{onClick:()=>c(t=>t+1),children:"下一步"}):e.jsx(i,{children:"送出"})]})]})}};var I,k,w;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <ToastProvider>
      <TypicalForm />
    </ToastProvider>
}`,...(w=(k=u.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var F,D,O;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: function Render() {
    const steps = [{
      key: "unit",
      label: "選擇單位"
    }, {
      key: "items",
      label: "加入項目",
      hint: "名稱與數量"
    }, {
      key: "review",
      label: "確認送出"
    }];
    const [idx, setIdx] = useState(0);
    const [unit, setUnit] = useState(UNIT_OPTIONS[0]);
    const [name, setName] = useState("甲案 第一階段");
    const [qty, setQty] = useState(120);
    const cur = steps[idx].key;
    return <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="建立批次" meta="三步完成；可以隨時回上一步，已填的內容不會不見。" />

        <Stepper current={cur} onStep={k => setIdx(steps.findIndex(s => s.key === k))} completed={Object.fromEntries(steps.map((s, i) => [s.key, i < idx]))} steps={steps} />

        {cur === "unit" && <FormField label="所屬單位" className="max-w-sm">
            {control => <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger {...control}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>}
          </FormField>}

        {cur === "items" && <div className="space-y-4">
            <FormField label="項目名稱">
              <Input value={name} onChange={e => setName(e.target.value)} />
            </FormField>
            <div className="max-w-40 space-y-1">
              <Label>數量</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="數量" />
            </div>
          </div>}

        {cur === "review" && <Card>
            <CardHeader>
              <CardTitle className="text-base">最後確認</CardTitle>
              <CardDescription>送出後會建立 1 筆批次，內容仍可在明細頁調整。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">所屬單位　</span>{unit}</p>
              <p><span className="text-muted-foreground">項目名稱　</span>{name}</p>
              <p><span className="text-muted-foreground">數量　　　</span>{formatNumber(qty)}</p>
            </CardContent>
          </Card>}

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
            上一步
          </Button>
          {idx < steps.length - 1 ? <Button onClick={() => setIdx(i => i + 1)}>下一步</Button> : <Button>送出</Button>}
        </div>
      </div>;
  }
}`,...(O=(D=h.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};const Re=["典型組成","多步驟"];export{Re as __namedExportsOrder,Le as default,u as 典型組成,h as 多步驟};
