import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as s}from"./index-UiW3gZKV.js";import{B as i}from"./button-BZKmkDjW.js";import{I as L}from"./input-vSeq6R7n.js";import{L as d}from"./label-CcKLfqeY.js";import{N as H}from"./number-input-DJbZuNmz.js";import{S as q}from"./seg-group-D0IDbvdD.js";import{C as V}from"./chips-DzzKURvw.js";import{S as M}from"./stepper-Bl9BkPqb.js";import{C as Q}from"./callout-9PJf-2LB.js";import{C as f,a as b,d as S,b as y,c as T}from"./card-CFhhONKA.js";import{D as A,a as G,b as z,c as J,d as K,e as W,f as X,g as Y}from"./dialog-Bk48r2KG.js";import{S as F,a as P,b as _,c as E,d as R}from"./select-oRfq6VYn.js";import{a as Z}from"./utils-pm6Xa0Qd.js";import{T as $,C as ee,a as ne}from"./sample-data-DlVwqcXX.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-C5qX--6C.js";import"./index-rhYpeUg2.js";import"./index-B0PXCDJg.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./check-CZys2X9e.js";import"./createLucideIcon-BcR0bl2m.js";import"./Combination-BkzcTUOc.js";import"./x-DHctwwaT.js";import"./index-DW-t51uL.js";const ke={title:"頁面/表單頁"},h=[...new Set(ne.map(g=>g.unit))],p={render:function(){const[a,r]=s.useState(""),[o,c]=s.useState(10),[C,m]=s.useState("gold"),[j,u]=s.useState(["online"]),[v,l]=s.useState(!1),n=v&&a.trim()==="";return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"建立項目"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"填完基本資訊即可送出，其餘設定之後隨時可補。"})]}),n&&e.jsx(Q,{variant:"warning",title:"有 1 個欄位待補",live:!0,children:"「項目名稱」未填寫前無法送出。"}),e.jsxs(f,{children:[e.jsxs(b,{children:[e.jsx(S,{className:"text-base",children:"基本資訊"}),e.jsx(y,{children:"這個項目是什麼、屬於誰。"})]}),e.jsxs(T,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(d,{htmlFor:"fp-name",children:"項目名稱（必填）"}),e.jsx(L,{id:"fp-name",value:a,placeholder:"例：甲案 第一階段","aria-invalid":n||void 0,"aria-describedby":n?"fp-name-err":void 0,onChange:t=>r(t.target.value)}),n&&e.jsx("p",{id:"fp-name-err",className:"text-tiny text-danger",children:"請輸入項目名稱。"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(d,{htmlFor:"fp-unit",children:"所屬單位"}),e.jsxs(F,{defaultValue:h[0],children:[e.jsx(P,{id:"fp-unit",children:e.jsx(_,{})}),e.jsx(E,{children:h.map(t=>e.jsx(R,{value:t,children:t},t))})]})]}),e.jsx(q,{label:"等級",options:$,value:C,onPick:m})]})]}),e.jsxs(f,{children:[e.jsxs(b,{children:[e.jsx(S,{className:"text-base",children:"數量與管道"}),e.jsx(y,{children:"之後在明細頁隨時可以調整。"})]}),e.jsxs(T,{className:"space-y-4",children:[e.jsxs("div",{className:"max-w-40 space-y-1",children:[e.jsx(d,{children:"數量"}),e.jsx(H,{value:o,onChange:c,min:1,step:10,"aria-label":"數量"})]}),e.jsx(V,{label:"聯絡管道",options:ee,selected:j,onToggle:t=>u(N=>N.includes(t)?N.filter(U=>U!==t):[...N,t])})]})]}),e.jsxs("div",{className:"flex items-center justify-between border-t pt-4",children:[e.jsxs(A,{children:[e.jsx(G,{asChild:!0,children:e.jsx(i,{variant:"ghost",children:"取消"})}),e.jsxs(z,{children:[e.jsxs(J,{children:[e.jsx(K,{children:"要放棄這份表單？"}),e.jsx(W,{children:"已填的內容不會保留。"})]}),e.jsxs(X,{children:[e.jsx(Y,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"繼續填寫"})}),e.jsx(i,{variant:"destructive",children:"放棄"})]})]})]}),e.jsx(i,{onClick:()=>l(!0),children:"送出"})]})]})}},x={render:function(){const a=[{key:"unit",label:"選擇單位"},{key:"items",label:"加入項目",hint:"名稱與數量"},{key:"review",label:"確認送出"}],[r,o]=s.useState(0),[c,C]=s.useState(h[0]),[m,j]=s.useState("甲案 第一階段"),[u,v]=s.useState(120),l=a[r].key;return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"建立批次"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"三步完成；可以隨時回上一步，已填的內容不會不見。"})]}),e.jsx(M,{current:l,onStep:n=>o(a.findIndex(t=>t.key===n)),completed:Object.fromEntries(a.map((n,t)=>[n.key,t<r])),steps:a}),l==="unit"&&e.jsxs("div",{className:"max-w-sm space-y-1",children:[e.jsx(d,{htmlFor:"ms-unit",children:"所屬單位"}),e.jsxs(F,{value:c,onValueChange:C,children:[e.jsx(P,{id:"ms-unit",children:e.jsx(_,{})}),e.jsx(E,{children:h.map(n=>e.jsx(R,{value:n,children:n},n))})]})]}),l==="items"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(d,{htmlFor:"ms-name",children:"項目名稱"}),e.jsx(L,{id:"ms-name",value:m,onChange:n=>j(n.target.value)})]}),e.jsxs("div",{className:"max-w-40 space-y-1",children:[e.jsx(d,{children:"數量"}),e.jsx(H,{value:u,onChange:v,min:1,step:10,"aria-label":"數量"})]})]}),l==="review"&&e.jsxs(f,{children:[e.jsxs(b,{children:[e.jsx(S,{className:"text-base",children:"最後確認"}),e.jsx(y,{children:"送出後會建立 1 筆批次，內容仍可在明細頁調整。"})]}),e.jsxs(T,{className:"space-y-1 text-sm",children:[e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"所屬單位　"}),c]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"項目名稱　"}),m]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"數量　　　"}),Z(u)]})]})]}),e.jsxs("div",{className:"flex items-center justify-between border-t pt-4",children:[e.jsx(i,{variant:"outline",disabled:r===0,onClick:()=>o(n=>n-1),children:"上一步"}),r<a.length-1?e.jsx(i,{onClick:()=>o(n=>n+1),children:"下一步"}):e.jsx(i,{children:"送出"})]})]})}};var D,I,k;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: function Render() {
    const [name, setName] = useState("");
    const [qty, setQty] = useState(10);
    const [tier, setTier] = useState("gold");
    const [channels, setChannels] = useState<string[]>(["online"]);
    const [submitted, setSubmitted] = useState(false);
    const nameMissing = submitted && name.trim() === "";
    return <div className="mx-auto max-w-2xl space-y-4">
        {/* 頁首區：這一頁只做一件事，標題直接說出那件事 */}
        <div>
          <h1 className="text-2xl font-semibold">建立項目</h1>
          <p className="text-sm text-muted-foreground">填完基本資訊即可送出，其餘設定之後隨時可補。</p>
        </div>

        {/* 頂部彙總：只列「有幾個欄位要補」，錯誤細節在欄位旁邊 */}
        {nameMissing && <Callout variant="warning" title="有 1 個欄位待補" live>
            「項目名稱」未填寫前無法送出。
          </Callout>}

        {/* 內容區：依情境分組，一組一張卡 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本資訊</CardTitle>
            <CardDescription>這個項目是什麼、屬於誰。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fp-name">項目名稱（必填）</Label>
              <Input id="fp-name" value={name} placeholder="例：甲案 第一階段" aria-invalid={nameMissing || undefined} aria-describedby={nameMissing ? "fp-name-err" : undefined} onChange={e => setName(e.target.value)} />
              {nameMissing && <p id="fp-name-err" className="text-tiny text-danger">請輸入項目名稱。</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="fp-unit">所屬單位</Label>
              <Select defaultValue={UNIT_OPTIONS[0]}>
                <SelectTrigger id="fp-unit"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SegGroup label="等級" options={TIER_OPTIONS} value={tier} onPick={setTier} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">數量與管道</CardTitle>
            <CardDescription>之後在明細頁隨時可以調整。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-40 space-y-1">
              <Label>數量</Label>
              <NumberInput value={qty} onChange={setQty} min={1} step={10} aria-label="數量" />
            </div>
            <Chips label="聯絡管道" options={CHANNEL_OPTIONS} selected={channels} onToggle={v => setChannels(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
          </CardContent>
        </Card>

        {/* 動作區：取消在左（有離開防呆）、主要動作在右 */}
        <div className="flex items-center justify-between border-t pt-4">
          <Dialog>
            <DialogTrigger asChild><Button variant="ghost">取消</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>要放棄這份表單？</DialogTitle>
                <DialogDescription>已填的內容不會保留。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">繼續填寫</Button></DialogClose>
                <Button variant="destructive">放棄</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setSubmitted(true)}>送出</Button>
        </div>
      </div>;
  }
}`,...(k=(I=p.parameters)==null?void 0:I.docs)==null?void 0:k.source}}};var w,O,B;x.parameters={...x.parameters,docs:{...(w=x.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
        <div>
          <h1 className="text-2xl font-semibold">建立批次</h1>
          <p className="text-sm text-muted-foreground">三步完成；可以隨時回上一步，已填的內容不會不見。</p>
        </div>

        <Stepper current={cur} onStep={k => setIdx(steps.findIndex(s => s.key === k))} completed={Object.fromEntries(steps.map((s, i) => [s.key, i < idx]))} steps={steps} />

        {cur === "unit" && <div className="max-w-sm space-y-1">
            <Label htmlFor="ms-unit">所屬單位</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="ms-unit"><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>}

        {cur === "items" && <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ms-name">項目名稱</Label>
              <Input id="ms-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
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
}`,...(B=(O=x.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};const we=["典型組成","多步驟"];export{we as __namedExportsOrder,ke as default,p as 典型組成,x as 多步驟};
