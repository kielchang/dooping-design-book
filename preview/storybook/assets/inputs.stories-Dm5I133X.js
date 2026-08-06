import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-BFQ_Q9OP.js";import{I as d}from"./index-Cz5Sp9I-.js";import{L as n,C as O}from"./chips-tkc4FdaB.js";import{N as E}from"./number-input-CdIvF63-.js";import{C as P}from"./checkbox-DZv7zCq2.js";import{S as w,a as _,b as G,c as H,d as q}from"./select-BnSxgMTA.js";import{S as v}from"./seg-group-C31EXuC6.js";import{T as p,C as Q}from"./sample-data-DlVwqcXX.js";import"./utils-pm6Xa0Qd.js";import"./Combination-DsSBML8Q.js";import"./index-DdXKfkXy.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./check-SsieMrcg.js";import"./createLucideIcon-DDRU598s.js";const te={title:"元件/表單/輸入控制項"},c={render:function(){const[a,t]=r.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(d,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"s-code",children:"單位代號"}),e.jsx(d,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(d,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{children:"訂購數量"}),e.jsx(E,{value:a,onChange:t,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},o={render:function(){const[a,t]=r.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(d,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(d,{id:"f-bad",defaultValue:"0","aria-invalid":a,"aria-describedby":"f-bad-err",onChange:s=>t(s.target.value==="0")}),a&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},i={render:function(){const[a,t]=r.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(P,{id:"s-active",checked:a,onCheckedChange:s=>t(s===!0)}),e.jsx(n,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{children:"等級"}),e.jsxs(w,{defaultValue:"gold",children:[e.jsx(_,{children:e.jsx(G,{})}),e.jsx(H,{children:p.map(s=>e.jsx(q,{value:s.value,children:s.label},s.value))})]})]})]})}},m={render:function(){const[a,t]=r.useState("gold"),[s]=r.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(v,{label:"等級",options:p,value:a,onPick:t})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(v,{label:"等級（已改動）",options:p,value:a,onPick:t,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(v,{label:"等級（鎖定）",options:p,value:s,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},u={render:function(){const[a,t]=r.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(O,{label:"下單管道",options:Q,selected:a,onToggle:s=>t(x=>x.includes(s)?x.filter(V=>V!==s):[...x,s])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var h,g,b;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: function Render() {
    const [qty, setQty] = useState(120);
    return <div className="max-w-sm space-y-4">
        <div className="space-y-1">
          <Label htmlFor="s-name">單位名稱</Label>
          <Input id="s-name" defaultValue="遠東貿易股份有限公司" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="s-code">單位代號</Label>
          <Input id="s-code" placeholder="例：C-1042" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="s-locked">建立日期</Label>
          <Input id="s-locked" defaultValue="2019-04-01" disabled />
        </div>
        <div className="space-y-1">
          <Label>訂購數量</Label>
          <NumberInput value={qty} onChange={setQty} min={0} step={10} aria-label="訂購數量" />
          <p className="text-tiny text-muted-foreground">數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。</p>
        </div>
      </div>;
  }
}`,...(b=(g=c.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var f,N,j;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [invalid, setInvalid] = useState(true);
    return <div className="max-w-xl space-y-5">
        <p className="text-sm text-muted-foreground">
          一格欄位可以<strong>同時</strong>是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道，
          疊起來互不干涉——<strong>聚焦環永遠是同一個顏色</strong>，邊框與底色管狀態。
        </p>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="f-ro">唯讀／計算值</Label>
            <div className="field-readonly rounded-md border border-transparent px-3 py-2 text-sm">1,380,000</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-ok">可編輯（優先序 0）</Label>
            <Input id="f-ok" defaultValue="1,500,000" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-edit">已改動未送出（優先序 1）</Label>
            <div className="rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground">
              1,650,000
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-bad">不合格（優先序 2，最高）</Label>
            <Input id="f-bad" defaultValue="0" aria-invalid={invalid} aria-describedby="f-bad-err" onChange={e => setInvalid(e.target.value === "0")} />
            {invalid && <p id="f-bad-err" className="text-tiny text-danger">
                數值必須大於 0。改成別的值就會恢復。
              </p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          用 Tab 鍵走過上面四格，注意<strong>聚焦環不隨狀態變色</strong>。
          若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。
          環與邊框之間有一圈背景色（<code>ring-offset</code>）：少了它，環會直接畫在紅框上，
          實測深色模式下兩者對比只有 <strong>1.04:1</strong>，聚焦環等於隱形。
        </p>
        <p className="text-xs text-muted-foreground">
          「<strong>必填未填</strong>」是不合格的一種，但它的問題是<strong>時機</strong>不是顏色——
          不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。
        </p>
      </div>;
  }
}`,...(j=(N=o.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};var y,S,k;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox id="s-active" checked={checked} onCheckedChange={v => setChecked(v === true)} />
          <Label htmlFor="s-active">啟用此單位</Label>
        </div>
        <div className="space-y-1">
          <Label>等級</Label>
          <Select defaultValue="gold">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>;
  }
}`,...(k=(S=i.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var I,C,L;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState("gold");
    const [locked] = useState("silver");
    return <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">選項少、標籤短、要一眼看完 → 分段選擇</p>
          <SegGroup label="等級" options={TIER_OPTIONS} value={v} onPick={setV} />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">已改動未送出（琥珀）</p>
          <SegGroup label="等級（已改動）" options={TIER_OPTIONS} value={v} onPick={setV} changed />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">鎖定：可聚焦、有鎖頭、hover 有原因</p>
          <SegGroup label="等級（鎖定）" options={TIER_OPTIONS} value={locked} onPick={() => {}} disabled lockHint="此筆已結案，需先解除鎖定" />
        </div>
        <p className="text-tiny text-muted-foreground">鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。</p>
      </div>;
  }
}`,...(L=(C=m.parameters)==null?void 0:C.docs)==null?void 0:L.source}}};var T,F,R;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(R=(F=u.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};const ne=["文字與數值","欄位狀態","勾選與下拉","分段選擇","多選標籤片"];export{ne as __namedExportsOrder,te as default,m as 分段選擇,i as 勾選與下拉,u as 多選標籤片,c as 文字與數值,o as 欄位狀態};
