import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as a}from"./index-BFQ_Q9OP.js";import{I as L,u as pe,T as O,S as me,a as he,b as fe,c as xe,d as be,C as ve}from"./sample-data-BFt1Hhpq.js";import{S as q,L as N,C as ge}from"./chips-BTZvBi4q.js";import{c as se,u as ne}from"./utils-C1k7i5aj.js";import{d as ke,P as Ce,b as V,c as F,g as ye}from"./Combination-BwnRTv8f.js";import{C as Ne}from"./check-SsieMrcg.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./createLucideIcon-DDRU598s.js";function re({value:n,onChange:s,className:r,step:t,min:i,max:l,disabled:c,...u}){return e.jsx(L,{type:"number",inputMode:"numeric",step:t,min:i,max:l,disabled:c,value:Number.isFinite(n)?n:0,onChange:o=>s(o.target.value===""?0:Number(o.target.value)),className:se("field-editable h-8 w-28 text-right tabular-nums",r),...u})}re.__docgenInfo={description:'數值輸入。\n\n三件小事，但每一件漏了都會被使用者罵：`inputMode="numeric"`（手機直接出數字鍵盤）、\n`tabular-nums`（等寬數字，上下對齊才看得出位數）、右對齊（數字靠右才好比大小）。\n底色套 `.field-editable`＝可編輯欄位的統一長相。',methods:[],displayName:"NumberInput",props:{value:{required:!0,tsType:{name:"number"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(v: number) => void",signature:{arguments:[{type:{name:"number"},name:"v"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},step:{required:!1,tsType:{name:"number"},description:""},min:{required:!1,tsType:{name:"number"},description:""},max:{required:!1,tsType:{name:"number"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""}}};var Se=Object.defineProperty,x=(n,s)=>Se(n,"name",{value:s,configurable:!0}),B="Checkbox",[je,ze]=ke(B),[Ie,M]=je(B);function ae(n){const{__scopeCheckbox:s,checked:r,children:t,defaultChecked:i,disabled:l,form:c,name:u,onCheckedChange:o,required:p,value:k="on",internal_do_not_use_render:b}=n,[h,v]=ye({prop:r,defaultProp:i??!1,onChange:o,caller:B}),[C,y]=a.useState(null),[S,j]=a.useState(null),I=a.useRef(!1),[d,m]=a.useReducer(g=>g+1,0),R=C?!!c||!!C.closest("form"):!0,T={checked:h,disabled:l,setChecked:v,control:C,setControl:y,name:u,form:c,value:k,hasConsumerStoppedPropagationRef:I,userInteractionCount:d,onUserInteraction:m,required:p,defaultChecked:f(i)?!1:i,isFormControl:R,bubbleInput:S,setBubbleInput:j};return e.jsx(Ie,{scope:s,...T,children:oe(b)?b(T):t})}x(ae,"CheckboxProvider");var Re="CheckboxTrigger",Te=a.forwardRef(x(function({__scopeCheckbox:s,onKeyDown:r,onClick:t,...i},l){const{control:c,value:u,disabled:o,checked:p,required:k,setControl:b,setChecked:h,hasConsumerStoppedPropagationRef:v,onUserInteraction:C,isFormControl:y,bubbleInput:S}=M(Re,s),j=ne(l,b),I=a.useRef(p);return a.useEffect(()=>{const d=c==null?void 0:c.form;if(d){const m=x(()=>h(I.current),"reset");return d.addEventListener("reset",m),()=>d.removeEventListener("reset",m)}},[c,h]),e.jsx(V.button,{type:"button",role:"checkbox","aria-checked":f(p)?"mixed":p,"aria-required":k,"data-state":A(p),"data-disabled":o?"":void 0,disabled:o,value:u,...i,ref:j,onKeyDown:F(r,d=>{d.key==="Enter"&&d.preventDefault()}),onClick:F(t,d=>{C(),h(m=>f(m)?!0:!m),S&&y&&(v.current=d.isPropagationStopped(),v.current||d.stopPropagation())})})},"CheckboxTrigger")),ce=a.forwardRef(x(function(s,r){const{__scopeCheckbox:t,name:i,checked:l,defaultChecked:c,required:u,disabled:o,value:p,onCheckedChange:k,form:b,...h}=s;return e.jsx(ae,{__scopeCheckbox:t,checked:l,defaultChecked:c,disabled:o,required:u,onCheckedChange:k,name:i,form:b,value:p,internal_do_not_use_render:({isFormControl:v})=>e.jsxs(e.Fragment,{children:[e.jsx(Te,{...h,ref:r,__scopeCheckbox:t}),v&&e.jsx(we,{__scopeCheckbox:t})]})})},"Checkbox")),_e="CheckboxIndicator",Pe=a.forwardRef(x(function(s,r){const{__scopeCheckbox:t,forceMount:i,...l}=s,c=M(_e,t);return e.jsx(Ce,{present:i||f(c.checked)||c.checked===!0,children:e.jsx(V.span,{"data-state":A(c.checked),"data-disabled":c.disabled?"":void 0,...l,ref:r,style:{pointerEvents:"none",...s.style}})})},"CheckboxIndicator")),Ee="CheckboxBubbleInput",we=a.forwardRef(x(function({__scopeCheckbox:s,onClick:r,...t},i){const{control:l,hasConsumerStoppedPropagationRef:c,userInteractionCount:u,checked:o,defaultChecked:p,required:k,disabled:b,name:h,value:v,form:C,bubbleInput:y,setBubbleInput:S}=M(Ee,s),j=ne(i,S),I=pe(l),d=a.useRef(!1),m=a.useRef(o),R=a.useRef(u);a.useEffect(()=>{const g=y;if(!g)return;const ie=window.HTMLInputElement.prototype,G=Object.getOwnPropertyDescriptor(ie,"checked").set,U=u!==R.current;R.current=u;const de=m.current!==o;m.current=o;const le=!(U&&c.current);if(de&&G){d.current=!U;const ue=new Event("click",{bubbles:le});g.indeterminate=f(o),G.call(g,f(o)?!1:o),g.dispatchEvent(ue),d.current=!1}},[y,o,c,u]);const T=a.useRef(f(o)?!1:o);return e.jsx(V.input,{type:"checkbox","aria-hidden":!0,defaultChecked:p??T.current,required:k,disabled:b,name:h,value:v,form:C,...t,tabIndex:-1,ref:j,onClick:F(r,g=>{d.current&&g.stopPropagation()}),style:{...t.style,...I,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"CheckboxBubbleInput"));function oe(n){return typeof n=="function"}x(oe,"isFunction");function f(n){return n==="indeterminate"}x(f,"isIndeterminate");function A(n){return f(n)?"indeterminate":n?"checked":"unchecked"}x(A,"getState");const H=a.forwardRef(({className:n,...s},r)=>e.jsx(ce,{ref:r,className:se("peer size-4 shrink-0 rounded-sm border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",n),...s,children:e.jsx(Pe,{className:"flex items-center justify-center text-current",children:e.jsx(Ne,{className:"size-3.5"})})}));H.displayName=ce.displayName;H.__docgenInfo={description:"",methods:[]};const De={title:"元件/表單/輸入控制項"},_={render:function(){const[s,r]=a.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(L,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-code",children:"單位代號"}),e.jsx(L,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(L,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{children:"訂購數量"}),e.jsx(re,{value:s,onChange:r,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},P={render:function(){const[s,r]=a.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(H,{id:"s-active",checked:s,onCheckedChange:t=>r(t===!0)}),e.jsx(N,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{children:"等級"}),e.jsxs(me,{defaultValue:"gold",children:[e.jsx(he,{children:e.jsx(fe,{})}),e.jsx(xe,{children:O.map(t=>e.jsx(be,{value:t.value,children:t.label},t.value))})]})]})]})}},E={render:function(){const[s,r]=a.useState("gold"),[t]=a.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(q,{label:"等級",options:O,value:s,onPick:r})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(q,{label:"等級（已改動）",options:O,value:s,onPick:r,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(q,{label:"等級（鎖定）",options:O,value:t,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},w={render:function(){const[s,r]=a.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(ge,{label:"下單管道",options:ve,selected:s,onToggle:t=>r(i=>i.includes(t)?i.filter(l=>l!==t):[...i,t])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var z,D,Q;_.parameters={..._.parameters,docs:{...(z=_.parameters)==null?void 0:z.docs,source:{originalSource:`{
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
}`,...(Q=(D=_.parameters)==null?void 0:D.docs)==null?void 0:Q.source}}};var K,X,$;P.parameters={...P.parameters,docs:{...(K=P.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...($=(X=P.parameters)==null?void 0:X.docs)==null?void 0:$.source}}};var J,W,Y;E.parameters={...E.parameters,docs:{...(J=E.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Y=(W=E.parameters)==null?void 0:W.docs)==null?void 0:Y.source}}};var Z,ee,te;w.parameters={...w.parameters,docs:{...(Z=w.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(te=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};const Qe=["文字與數值","勾選與下拉","分段選擇","多選標籤片"];export{Qe as __namedExportsOrder,De as default,E as 分段選擇,P as 勾選與下拉,w as 多選標籤片,_ as 文字與數值};
