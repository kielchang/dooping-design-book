import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-UiW3gZKV.js";import{within as X,expect as N,userEvent as I,waitFor as E}from"./index-DH-M5T-F.js";import{I as _}from"./input-D31gR-xu.js";import{L as l}from"./label-DCW2ivba.js";import{N as De}from"./number-input-w7UrOL80.js";import{C as Me}from"./checkbox-BPXNu1Dg.js";import{S as Q}from"./switch-GP8VNwUU.js";import{c as Y}from"./utils-CMl-9ImW.js";import{d as Ce,f as qe,c as H,P as Ue}from"./Combination-Gi-zDQIY.js";import{u as M}from"./index-VXoYh6zd.js";import{P as q}from"./index-BJ3p15Kd.js";import{c as Ee,R as ze,I as Ke}from"./index-DliohCdJ.js";import{u as $e}from"./index-BHxPrZ82.js";import{u as Qe}from"./index-BmqVfOSQ.js";import{c as We}from"./createLucideIcon-BcR0bl2m.js";import{S as Xe,a as Ye,b as Je,c as Ze,d as et}from"./select-D6_otMdt.js";import{S as W}from"./seg-group-Sx5-rRSE.js";import{C as tt}from"./chips-DJThxGxI.js";import{T as O,C as at}from"./sample-data-DgKbD7zu.js";import"./_commonjsHelpers-CqkleIqs.js";import"./check-CZys2X9e.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=We("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]),D=r.forwardRef(({className:s,...a},n)=>e.jsx("textarea",{className:Y("flex min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors duration-fast placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-subtle disabled:cursor-not-allowed disabled:opacity-50",s),ref:n,...a}));D.displayName="Textarea";D.__docgenInfo={description:"多行文字輸入。樣式逐項鏡射 `Input`（邊框、聚焦環、不合格態、停用態），\n兩者排在同一張表單裡不會出現第二套質感。\n\n`resize-y` 是顯式宣告：只准直向調整，橫向會破壞表單欄寬對齊。\n高度下限 `min-h-16`（約三行）——低於這個高度的自由文字，該用 `Input`。",methods:[],displayName:"Textarea"};var st=Object.defineProperty,u=(s,a)=>st(s,"name",{value:a,configurable:!0}),_e="Radio",[rt,Le]=Ce(_e),[ot,U]=rt(_e);function Fe(s){const{__scopeRadio:a,checked:n=!1,children:t,disabled:o,form:c,name:i,onCheck:m,required:v,value:b="on",internal_do_not_use_render:f}=s,[p,d]=r.useState(null),[g,y]=r.useState(null),h=r.useRef(!1),[j,k]=r.useReducer(S=>S+1,0),R=p?!!c||!!p.closest("form"):!0,x={checked:n,disabled:o,required:v,name:i,form:c,value:b,control:p,setControl:d,hasConsumerStoppedPropagationRef:h,userInteractionCount:j,onUserInteraction:k,isFormControl:R,bubbleInput:g,setBubbleInput:y,onCheck:u(()=>m==null?void 0:m(),"onCheck")};return e.jsx(ot,{scope:a,...x,children:Ge(f)?f(x):t})}u(Fe,"RadioProvider");var it="RadioTrigger",ct=r.forwardRef(u(function({__scopeRadio:a,onClick:n,...t},o){const{checked:c,disabled:i,value:m,setControl:v,onCheck:b,hasConsumerStoppedPropagationRef:f,onUserInteraction:p,isFormControl:d,bubbleInput:g}=U(it,a),y=M(o,v);return e.jsx(q.button,{type:"button",role:"radio","aria-checked":c,"data-state":J(c),"data-disabled":i?"":void 0,disabled:i,value:m,...t,ref:y,onClick:H(n,h=>{c||(p(),b()),g&&d&&(f.current=h.isPropagationStopped(),f.current||h.stopPropagation())})})},"RadioTrigger")),dt="RadioIndicator",lt=r.forwardRef(u(function(a,n){const{__scopeRadio:t,forceMount:o,...c}=a,i=U(dt,t);return e.jsx(Ue,{present:o||i.checked,children:e.jsx(q.span,{"data-state":J(i.checked),"data-disabled":i.disabled?"":void 0,...c,ref:n})})},"RadioIndicator")),ut="RadioBubbleInput",mt=r.forwardRef(u(function({__scopeRadio:a,onClick:n,...t},o){const{control:c,checked:i,required:m,disabled:v,name:b,value:f,form:p,bubbleInput:d,setBubbleInput:g,hasConsumerStoppedPropagationRef:y,userInteractionCount:h}=U(ut,a),j=M(o,g),k=Qe(c),R=r.useRef(!1),x=r.useRef(i),S=r.useRef(h);r.useEffect(()=>{const w=d;if(!w)return;const C=window.HTMLInputElement.prototype,ae=Object.getOwnPropertyDescriptor(C,"checked").set,ne=h!==S.current;S.current=h;const Be=x.current!==i;x.current=i;const Oe=!(ne&&y.current);if(Be&&ae){R.current=!ne;const He=new Event("click",{bubbles:Oe});ae.call(w,i),w.dispatchEvent(He),R.current=!1}},[d,i,y,h]);const K=r.useRef(i);return e.jsx(q.input,{type:"radio","aria-hidden":!0,defaultChecked:K.current,required:m,disabled:v,name:b,value:f,form:p,...t,tabIndex:-1,ref:j,onClick:H(n,w=>{R.current&&w.stopPropagation()}),style:{...t.style,...k,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"RadioBubbleInput"));function Ge(s){return typeof s=="function"}u(Ge,"isFunction");function J(s){return s?"checked":"unchecked"}u(J,"getState");var pt=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],Z="RadioGroup",[xt,Kt]=Ce(Z,[Ee,Le]),Te=Ee(),z=Le(),[vt,ft]=xt(Z),Pe=r.forwardRef(u(function(a,n){const{__scopeRadioGroup:t,name:o,form:c,defaultValue:i,value:m,required:v=!1,disabled:b=!1,orientation:f,dir:p,loop:d=!0,onValueChange:g,...y}=a,h=Te(t),j=$e(p),[k,R]=qe({prop:m,defaultProp:i??null,onChange:g,caller:Z}),[x,S]=r.useState(null),K=M(n,S),w=r.useRef(k);return r.useEffect(()=>{const C=c?x==null?void 0:x.ownerDocument.getElementById(c):x==null?void 0:x.closest("form");if(C instanceof HTMLFormElement){const $=u(()=>R(w.current),"reset");return C.addEventListener("reset",$),()=>C.removeEventListener("reset",$)}},[x,c,R]),e.jsx(vt,{scope:t,name:o,form:c,required:v,disabled:b,value:k,onValueChange:R,children:e.jsx(ze,{asChild:!0,...h,orientation:f,dir:j,loop:d,children:e.jsx(q.div,{role:"radiogroup","aria-required":v,"aria-orientation":f,"data-disabled":b?"":void 0,dir:j,...y,ref:K})})})},"RadioGroup")),bt="RadioGroupItemProvider",ht="RadioGroupItemTrigger";function Ae(s){const{__scopeRadioGroup:a,value:n,disabled:t,children:o,internal_do_not_use_render:c}=s,i=ft(bt,a),m=z(a),v=i.disabled||t;return e.jsx(Fe,{...m,checked:i.value===n,disabled:v,required:i.required,name:i.name,form:i.form,value:n,onCheck:()=>i.onValueChange(n),internal_do_not_use_render:c,children:o})}u(Ae,"RadioGroupItemProvider");var gt=r.forwardRef(u(function(a,n){const{__scopeRadioGroup:t,...o}=a,c=Te(t),i=z(t),{checked:m,disabled:v}=U(ht,i.__scopeRadio),b=r.useRef(null),f=M(n,b),p=r.useRef(!1);return r.useEffect(()=>{const d=u(y=>{pt.includes(y.key)&&(p.current=!0)},"handleKeyDown"),g=u(()=>p.current=!1,"handleKeyUp");return document.addEventListener("keydown",d),document.addEventListener("keyup",g),()=>{document.removeEventListener("keydown",d),document.removeEventListener("keyup",g)}},[]),e.jsx(Ke,{asChild:!0,...c,focusable:!v,active:m,children:e.jsx(ct,{...i,...o,ref:f,onKeyDown:H(o.onKeyDown,d=>{d.key==="Enter"&&d.preventDefault()}),onFocus:H(o.onFocus,()=>{var d;p.current&&((d=b.current)==null||d.click())})})})},"RadioGroupItemTrigger")),Ve=r.forwardRef(u(function(a,n){const{__scopeRadioGroup:t,value:o,disabled:c,...i}=a;return e.jsx(Ae,{__scopeRadioGroup:t,value:o,disabled:c,internal_do_not_use_render:({isFormControl:m})=>e.jsxs(e.Fragment,{children:[e.jsx(gt,{...i,ref:n,__scopeRadioGroup:t}),m&&e.jsx(yt,{__scopeRadioGroup:t})]})})},"RadioGroupItem")),yt=r.forwardRef(u(function(a,n){const{__scopeRadioGroup:t,...o}=a,c=z(t);return e.jsx(mt,{...c,...o,ref:n})},"RadioGroupItemBubbleInput")),Rt=r.forwardRef(u(function(a,n){const{__scopeRadioGroup:t,...o}=a,c=z(t);return e.jsx(lt,{...c,...o,ref:n})},"RadioGroupIndicator"));const ee=r.forwardRef(({className:s,...a},n)=>e.jsx(Pe,{ref:n,className:Y("grid gap-2",s),...a}));ee.displayName=Pe.displayName;const te=r.forwardRef(({className:s,...a},n)=>e.jsx(Ve,{ref:n,className:Y("aspect-square size-4 shrink-0 rounded-full border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50",s),...a,children:e.jsx(Rt,{className:"flex items-center justify-center",children:e.jsx(nt,{className:"size-2.5 fill-primary text-primary","aria-hidden":!0})})}));te.displayName=Ve.displayName;ee.__docgenInfo={description:"單選群（垂直）。選項標籤長、或每個選項需要一行說明時用這個；\n選項 2–5 個且標籤短到能橫排一眼看完，用 `SegGroup`；\n超過 5 個或選項動態增減，用 `Select`；\n在「唯讀 ↔ 編輯」的欄位語境裡，用 `EditableField` 的 `radio` 型態。\n\n鍵盤與焦點行為（roving tabindex、方向鍵移動）由 Radix 提供，\n與 `SegGroup` 的手刻版本一致：整組只佔一個 Tab 停留點。",methods:[]};te.__docgenInfo={description:`單選項圓鈕。選中同時「填實心點」——形狀變化不只靠顏色，
灰階列印與色覺障礙下仍分得出選了哪個。`,methods:[]};const $t={title:"元件/表單/輸入控制項"},L={render:function(){const[a,n]=r.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(_,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"s-code",children:"單位代號"}),e.jsx(_,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(_,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{children:"訂購數量"}),e.jsx(De,{value:a,onChange:n,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},F={render:function(){const[a,n]=r.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(_,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(_,{id:"f-bad",defaultValue:"0","aria-invalid":a,"aria-describedby":"f-bad-err",onChange:t=>n(t.target.value==="0")}),a&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},G={render:function(){const[a,n]=r.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Me,{id:"s-active",checked:a,onCheckedChange:t=>n(t===!0)}),e.jsx(l,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"s-tier",children:"等級"}),e.jsxs(Xe,{defaultValue:"gold",children:[e.jsx(Ye,{id:"s-tier",children:e.jsx(Je,{})}),e.jsx(Ze,{children:O.map(t=>e.jsx(et,{value:t.value,children:t.label},t.value))})]})]})]})},play:async({canvasElement:s})=>{const a=X(s),n=a.getByRole("checkbox",{name:"啟用此單位"});await N(n).toHaveAttribute("aria-checked","true"),n.focus(),await I.keyboard(" "),await E(()=>N(n).toHaveAttribute("aria-checked","false")),await I.keyboard(" "),await E(()=>N(n).toHaveAttribute("aria-checked","true"));const t=a.getByRole("combobox",{name:"等級"});t.focus(),await I.keyboard("{Enter}"),await X(s.ownerDocument.body).findByRole("listbox"),await N(t).toHaveAttribute("aria-expanded","true"),await I.keyboard("{Escape}"),await E(()=>N(t).toHaveAttribute("aria-expanded","false"))}},T={render:function(){const[a,n]=r.useState("gold"),[t]=r.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(W,{label:"等級",options:O,value:a,onPick:n})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(W,{label:"等級（已改動）",options:O,value:a,onPick:n,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(W,{label:"等級（鎖定）",options:O,value:t,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},P={render:function(){const[a,n]=r.useState(!0),[t,o]=r.useState(!1);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(l,{htmlFor:"sw-save",children:"自動儲存"}),e.jsx(Q,{id:"sw-save",checked:a,onCheckedChange:n})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(l,{htmlFor:"sw-dense",children:"密集列表"}),e.jsx(Q,{id:"sw-dense",checked:t,onCheckedChange:o})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(l,{htmlFor:"sw-locked",className:"opacity-60",children:"週報寄送（由管理端統一設定）"}),e.jsx(Q,{id:"sw-locked",checked:!0,disabled:!0})]}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["開關＝",e.jsx("strong",{children:"切了立即生效"}),"（設定頁）；「送出才生效」的表單選項用 Checkbox。 所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。"]})]})},play:async({canvasElement:s})=>{const a=X(s),n=a.getByRole("switch",{name:"自動儲存"});await N(n).toHaveAttribute("aria-checked","true"),n.focus(),await I.keyboard(" "),await E(()=>N(n).toHaveAttribute("aria-checked","false")),await I.keyboard(" "),await E(()=>N(n).toHaveAttribute("aria-checked","true")),await N(a.getByRole("switch",{name:"週報寄送（由管理端統一設定）"})).toBeDisabled()}},A={render:function(){const[a,n]=r.useState(""),t=a.length>200;return e.jsxs("div",{className:"max-w-xl space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"ta-note",children:"備註"}),e.jsx(D,{id:"ta-note",placeholder:"補充說明（選填）",value:a,onChange:o=>n(o.target.value),rows:3,"aria-invalid":t||void 0,"aria-describedby":t?"ta-err":void 0}),t&&e.jsxs("p",{id:"ta-err",className:"text-tiny text-danger",children:["超過 200 字上限（目前 ",a.length," 字）。"]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(l,{htmlFor:"ta-ro",children:"結案原因（停用示意）"}),e.jsx(D,{id:"ta-ro",defaultValue:"重複建立，已併入既有紀錄。",disabled:!0})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y）， 橫向拉寬會破壞表單欄寬對齊。"})]})}},V={render:function(){const[a,n]=r.useState("all");return e.jsxs("div",{className:"max-w-md space-y-3",children:[e.jsx(ee,{value:a,onValueChange:n,"aria-label":"通知範圍",children:[{value:"all",label:"全部動態",hint:"每一筆變更都通知"},{value:"important",label:"重要事項",hint:"只有需要動作的才通知"},{value:"none",label:"暫停通知",hint:"改到站內清單自行查看"}].map(t=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(te,{value:t.value,id:`rg-${t.value}`,className:"mt-0.5"}),e.jsxs(l,{htmlFor:`rg-${t.value}`,className:"font-normal",children:[e.jsx("span",{className:"block text-sm",children:t.label}),e.jsx("span",{className:"block text-tiny text-muted-foreground",children:t.hint})]})]},t.value))}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇； 超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。"})]})}},B={render:function(){const[a,n]=r.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(tt,{label:"下單管道",options:at,selected:a,onToggle:t=>n(o=>o.includes(t)?o.filter(c=>c!==t):[...o,t])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var se,re,oe;L.parameters={...L.parameters,docs:{...(se=L.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(re=L.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var ie,ce,de;F.parameters={...F.parameters,docs:{...(ie=F.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(de=(ce=F.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var le,ue,me;G.parameters={...G.parameters,docs:{...(le=G.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox id="s-active" checked={checked} onCheckedChange={v => setChecked(v === true)} />
          <Label htmlFor="s-active">啟用此單位</Label>
        </div>
        <div className="space-y-1">
          {/* combobox 的名稱不能取自值文字——Label 一定要用 htmlFor 接到觸發鈕的 id */}
          <Label htmlFor="s-tier">等級</Label>
          <Select defaultValue="gold">
            <SelectTrigger id="s-tier"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>;
  },
  // 勾選框：鍵盤 Space 切換 aria-checked；下拉：combobox 名稱來自 Label（不是值文字）、
  // 鍵盤開啟出 listbox（portal 在 body）、Esc 收回且 aria-expanded 連動。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", {
      name: "啟用此單位"
    });
    await expect(box).toHaveAttribute("aria-checked", "true");
    box.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(box).toHaveAttribute("aria-checked", "false"));
    await userEvent.keyboard(" ");
    await waitFor(() => expect(box).toHaveAttribute("aria-checked", "true"));
    const trigger = canvas.getByRole("combobox", {
      name: "等級"
    });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await within(canvasElement.ownerDocument.body).findByRole("listbox");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  }
}`,...(me=(ue=G.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var pe,xe,ve;T.parameters={...T.parameters,docs:{...(pe=T.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
}`,...(ve=(xe=T.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var fe,be,he;P.parameters={...P.parameters,docs:{...(fe=P.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: function Render() {
    const [autoSave, setAutoSave] = useState(true);
    const [dense, setDense] = useState(false);
    return <div className="max-w-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-save">自動儲存</Label>
          <Switch id="sw-save" checked={autoSave} onCheckedChange={setAutoSave} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-dense">密集列表</Label>
          <Switch id="sw-dense" checked={dense} onCheckedChange={setDense} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="sw-locked" className="opacity-60">週報寄送（由管理端統一設定）</Label>
          <Switch id="sw-locked" checked disabled />
        </div>
        <p className="text-tiny text-muted-foreground">
          開關＝<strong>切了立即生效</strong>（設定頁）；「送出才生效」的表單選項用 Checkbox。
          所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。
        </p>
      </div>;
  },
  // 開關：role=switch、Space 切換 aria-checked、disabled 的不動
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole("switch", {
      name: "自動儲存"
    });
    await expect(sw).toHaveAttribute("aria-checked", "true");
    sw.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => expect(sw).toHaveAttribute("aria-checked", "false"));
    await userEvent.keyboard(" ");
    await waitFor(() => expect(sw).toHaveAttribute("aria-checked", "true"));
    await expect(canvas.getByRole("switch", {
      name: "週報寄送（由管理端統一設定）"
    })).toBeDisabled();
  }
}`,...(he=(be=P.parameters)==null?void 0:be.docs)==null?void 0:he.source}}};var ge,ye,Re;A.parameters={...A.parameters,docs:{...(ge=A.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: function Render() {
    const [note, setNote] = useState("");
    const tooLong = note.length > 200;
    return <div className="max-w-xl space-y-4">
        <div className="space-y-1">
          <Label htmlFor="ta-note">備註</Label>
          <Textarea id="ta-note" placeholder="補充說明（選填）" value={note} onChange={e => setNote(e.target.value)} rows={3} aria-invalid={tooLong || undefined} aria-describedby={tooLong ? "ta-err" : undefined} />
          {tooLong && <p id="ta-err" className="text-tiny text-danger">
              超過 200 字上限（目前 {note.length} 字）。
            </p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ta-ro">結案原因（停用示意）</Label>
          <Textarea id="ta-ro" defaultValue="重複建立，已併入既有紀錄。" disabled />
        </div>
        <p className="text-tiny text-muted-foreground">
          與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y），
          橫向拉寬會破壞表單欄寬對齊。
        </p>
      </div>;
  }
}`,...(Re=(ye=A.parameters)==null?void 0:ye.docs)==null?void 0:Re.source}}};var Ne,we,je;V.parameters={...V.parameters,docs:{...(Ne=V.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState("all");
    return <div className="max-w-md space-y-3">
        <RadioGroup value={v} onValueChange={setV} aria-label="通知範圍">
          {[{
          value: "all",
          label: "全部動態",
          hint: "每一筆變更都通知"
        }, {
          value: "important",
          label: "重要事項",
          hint: "只有需要動作的才通知"
        }, {
          value: "none",
          label: "暫停通知",
          hint: "改到站內清單自行查看"
        }].map(o => <div key={o.value} className="flex items-start gap-2">
              <RadioGroupItem value={o.value} id={\`rg-\${o.value}\`} className="mt-0.5" />
              <Label htmlFor={\`rg-\${o.value}\`} className="font-normal">
                <span className="block text-sm">{o.label}</span>
                <span className="block text-tiny text-muted-foreground">{o.hint}</span>
              </Label>
            </div>)}
        </RadioGroup>
        <p className="text-tiny text-muted-foreground">
          選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇；
          超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。
        </p>
      </div>;
  }
}`,...(je=(we=V.parameters)==null?void 0:we.docs)==null?void 0:je.source}}};var ke,Se,Ie;B.parameters={...B.parameters,docs:{...(ke=B.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(Ie=(Se=B.parameters)==null?void 0:Se.docs)==null?void 0:Ie.source}}};const Qt=["文字與數值","欄位狀態","勾選與下拉","分段選擇","開關","長文輸入","單選群","多選標籤片"];export{Qt as __namedExportsOrder,$t as default,T as 分段選擇,G as 勾選與下拉,V as 單選群,B as 多選標籤片,L as 文字與數值,F as 欄位狀態,A as 長文輸入,P as 開關};
