import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as a}from"./index-BFQ_Q9OP.js";import{I as j,u as he,S as be,a as ve,b as ge,c as ke,d as Ne}from"./select-D988jbOE.js";import{S as q,L as x,C as ye}from"./chips-CibIAlL-.js";import{c as oe}from"./utils-Cn0sxhoU.js";import{u as ce}from"./index-DdXKfkXy.js";import{d as Ce,P as je,b as B,c as V,g as Se}from"./Combination-CbO2dC2d.js";import{C as Ie}from"./check-SsieMrcg.js";import{T as O,C as Re}from"./sample-data-CuD78HeR.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./createLucideIcon-DDRU598s.js";function de({value:n,onChange:t,className:r,step:s,min:d,max:l,disabled:o,...u}){return e.jsx(j,{type:"number",inputMode:"numeric",step:s,min:d,max:l,disabled:o,value:Number.isFinite(n)?n:0,onChange:c=>t(c.target.value===""?0:Number(c.target.value)),className:oe("field-editable h-8 w-28 text-right tabular-nums",r),...u})}de.__docgenInfo={description:'數值輸入。\n\n三件小事，但每一件漏了都會被使用者罵：`inputMode="numeric"`（手機直接出數字鍵盤）、\n`tabular-nums`（等寬數字，上下對齊才看得出位數）、右對齊（數字靠右才好比大小）。\n底色套 `.field-editable`＝可編輯欄位的統一長相。',methods:[],displayName:"NumberInput",props:{value:{required:!0,tsType:{name:"number"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(v: number) => void",signature:{arguments:[{type:{name:"number"},name:"v"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},step:{required:!1,tsType:{name:"number"},description:""},min:{required:!1,tsType:{name:"number"},description:""},max:{required:!1,tsType:{name:"number"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}}};var Te=Object.defineProperty,b=(n,t)=>Te(n,"name",{value:t,configurable:!0}),M="Checkbox",[_e,Je]=Ce(M),[Pe,A]=_e(M);function ie(n){const{__scopeCheckbox:t,checked:r,children:s,defaultChecked:d,disabled:l,form:o,name:u,onCheckedChange:c,required:m,value:N="on",internal_do_not_use_render:v}=n,[f,g]=Se({prop:r,defaultProp:d??!1,onChange:c,caller:M}),[y,C]=a.useState(null),[S,I]=a.useState(null),R=a.useRef(!1),[i,p]=a.useReducer(k=>k+1,0),T=y?!!o||!!y.closest("form"):!0,_={checked:f,disabled:l,setChecked:g,control:y,setControl:C,name:u,form:o,value:N,hasConsumerStoppedPropagationRef:R,userInteractionCount:i,onUserInteraction:p,required:m,defaultChecked:h(d)?!1:d,isFormControl:T,bubbleInput:S,setBubbleInput:I};return e.jsx(Pe,{scope:t,..._,children:ue(v)?v(_):s})}b(ie,"CheckboxProvider");var Ee="CheckboxTrigger",Le=a.forwardRef(b(function({__scopeCheckbox:t,onKeyDown:r,onClick:s,...d},l){const{control:o,value:u,disabled:c,checked:m,required:N,setControl:v,setChecked:f,hasConsumerStoppedPropagationRef:g,onUserInteraction:y,isFormControl:C,bubbleInput:S}=A(Ee,t),I=ce(l,v),R=a.useRef(m);return a.useEffect(()=>{const i=o==null?void 0:o.form;if(i){const p=b(()=>f(R.current),"reset");return i.addEventListener("reset",p),()=>i.removeEventListener("reset",p)}},[o,f]),e.jsx(B.button,{type:"button",role:"checkbox","aria-checked":h(m)?"mixed":m,"aria-required":N,"data-state":H(m),"data-disabled":c?"":void 0,disabled:c,value:u,...d,ref:I,onKeyDown:V(r,i=>{i.key==="Enter"&&i.preventDefault()}),onClick:V(s,i=>{y(),f(p=>h(p)?!0:!p),S&&C&&(g.current=i.isPropagationStopped(),g.current||i.stopPropagation())})})},"CheckboxTrigger")),le=a.forwardRef(b(function(t,r){const{__scopeCheckbox:s,name:d,checked:l,defaultChecked:o,required:u,disabled:c,value:m,onCheckedChange:N,form:v,...f}=t;return e.jsx(ie,{__scopeCheckbox:s,checked:l,defaultChecked:o,disabled:c,required:u,onCheckedChange:N,name:d,form:v,value:m,internal_do_not_use_render:({isFormControl:g})=>e.jsxs(e.Fragment,{children:[e.jsx(Le,{...f,ref:r,__scopeCheckbox:s}),g&&e.jsx(qe,{__scopeCheckbox:s})]})})},"Checkbox")),we="CheckboxIndicator",Fe=a.forwardRef(b(function(t,r){const{__scopeCheckbox:s,forceMount:d,...l}=t,o=A(we,s);return e.jsx(je,{present:d||h(o.checked)||o.checked===!0,children:e.jsx(B.span,{"data-state":H(o.checked),"data-disabled":o.disabled?"":void 0,...l,ref:r,style:{pointerEvents:"none",...t.style}})})},"CheckboxIndicator")),Oe="CheckboxBubbleInput",qe=a.forwardRef(b(function({__scopeCheckbox:t,onClick:r,...s},d){const{control:l,hasConsumerStoppedPropagationRef:o,userInteractionCount:u,checked:c,defaultChecked:m,required:N,disabled:v,name:f,value:g,form:y,bubbleInput:C,setBubbleInput:S}=A(Oe,t),I=ce(d,S),R=he(l),i=a.useRef(!1),p=a.useRef(c),T=a.useRef(u);a.useEffect(()=>{const k=C;if(!k)return;const me=window.HTMLInputElement.prototype,U=Object.getOwnPropertyDescriptor(me,"checked").set,z=u!==T.current;T.current=u;const pe=p.current!==c;p.current=c;const xe=!(z&&o.current);if(pe&&U){i.current=!z;const fe=new Event("click",{bubbles:xe});k.indeterminate=h(c),U.call(k,h(c)?!1:c),k.dispatchEvent(fe),i.current=!1}},[C,c,o,u]);const _=a.useRef(h(c)?!1:c);return e.jsx(B.input,{type:"checkbox","aria-hidden":!0,defaultChecked:m??_.current,required:N,disabled:v,name:f,value:g,form:y,...s,tabIndex:-1,ref:I,onClick:V(r,k=>{i.current&&k.stopPropagation()}),style:{...s.style,...R,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"CheckboxBubbleInput"));function ue(n){return typeof n=="function"}b(ue,"isFunction");function h(n){return n==="indeterminate"}b(h,"isIndeterminate");function H(n){return h(n)?"indeterminate":n?"checked":"unchecked"}b(H,"getState");const G=a.forwardRef(({className:n,...t},r)=>e.jsx(le,{ref:r,className:oe("peer size-4 shrink-0 rounded-sm border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",n),...t,children:e.jsx(Fe,{className:"flex items-center justify-center text-current",children:e.jsx(Ie,{className:"size-3.5"})})}));G.displayName=le.displayName;G.__docgenInfo={description:"",methods:[]};const We={title:"元件/表單/輸入控制項"},P={render:function(){const[t,r]=a.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(j,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"s-code",children:"單位代號"}),e.jsx(j,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(j,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{children:"訂購數量"}),e.jsx(de,{value:t,onChange:r,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},E={render:function(){const[t,r]=a.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(j,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(j,{id:"f-bad",defaultValue:"0","aria-invalid":t,"aria-describedby":"f-bad-err",onChange:s=>r(s.target.value==="0")}),t&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},L={render:function(){const[t,r]=a.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(G,{id:"s-active",checked:t,onCheckedChange:s=>r(s===!0)}),e.jsx(x,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(x,{children:"等級"}),e.jsxs(be,{defaultValue:"gold",children:[e.jsx(ve,{children:e.jsx(ge,{})}),e.jsx(ke,{children:O.map(s=>e.jsx(Ne,{value:s.value,children:s.label},s.value))})]})]})]})}},w={render:function(){const[t,r]=a.useState("gold"),[s]=a.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(q,{label:"等級",options:O,value:t,onPick:r})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(q,{label:"等級（已改動）",options:O,value:t,onPick:r,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(q,{label:"等級（鎖定）",options:O,value:s,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},F={render:function(){const[t,r]=a.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(ye,{label:"下單管道",options:Re,selected:t,onToggle:s=>r(d=>d.includes(s)?d.filter(l=>l!==s):[...d,s])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var D,Q,K;P.parameters={...P.parameters,docs:{...(D=P.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(K=(Q=P.parameters)==null?void 0:Q.docs)==null?void 0:K.source}}};var X,$,J;E.parameters={...E.parameters,docs:{...(X=E.parameters)==null?void 0:X.docs,source:{originalSource:`{
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
}`,...(J=($=E.parameters)==null?void 0:$.docs)==null?void 0:J.source}}};var W,Y,Z;L.parameters={...L.parameters,docs:{...(W=L.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(Z=(Y=L.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,se;w.parameters={...w.parameters,docs:{...(ee=w.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(se=(te=w.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var ne,re,ae;F.parameters={...F.parameters,docs:{...(ne=F.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(ae=(re=F.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};const Ye=["文字與數值","欄位狀態","勾選與下拉","分段選擇","多選標籤片"];export{Ye as __namedExportsOrder,We as default,w as 分段選擇,L as 勾選與下拉,F as 多選標籤片,P as 文字與數值,E as 欄位狀態};
