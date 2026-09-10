import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r}from"./index-UiW3gZKV.js";import{within as ne,expect as I,userEvent as P,waitFor as A}from"./index-DH-M5T-F.js";import{I as B}from"./input-kuo8quod.js";import{L as y}from"./label-BJyaxRcC.js";import{N as Ye}from"./number-input-Dl8WS-DZ.js";import{C as Je}from"./checkbox-B4Z_93Kg.js";import{d as re,c as T,f as Ae,P as Ze}from"./Combination-Gi-zDQIY.js";import{u as F}from"./index-VXoYh6zd.js";import{u as Be}from"./index-BmqVfOSQ.js";import{P as E}from"./index-BJ3p15Kd.js";import{c as X}from"./utils-DBXtLcuW.js";import{c as Ve,R as et,I as tt}from"./index-CLEGCNc0.js";import{u as at}from"./index-Btum-Xq9.js";import{c as nt}from"./createLucideIcon-BcR0bl2m.js";import{S as rt,a as st,b as ot,c as it,d as ct}from"./select-BbRzm7y4.js";import{S as ae}from"./seg-group-DXjbX0o5.js";import{C as dt}from"./chips-mSw_l9hW.js";import{T as Q,C as lt}from"./sample-data-I9KaR9SF.js";import"./_commonjsHelpers-CqkleIqs.js";import"./check-CZys2X9e.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=nt("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var pt=Object.defineProperty,_=(s,t)=>pt(s,"name",{value:t,configurable:!0}),se="Switch",[mt,ca]=re(se),[ft,oe]=mt(se);function He(s){const{__scopeSwitch:t,checked:n,children:a,defaultChecked:c,disabled:o,form:i,name:l,onCheckedChange:u,required:f,value:h="on",internal_do_not_use_render:m}=s,[d,b]=Ae({prop:n,defaultProp:c??!1,onChange:u,caller:se}),[v,x]=r.useState(null),[N,S]=r.useState(null),R=r.useRef(!1),[p,g]=r.useReducer(k=>k+1,0),C=v?!!i||!!v.closest("form"):!0,j={checked:d,setChecked:b,disabled:o,control:v,setControl:x,name:l,form:i,value:h,hasConsumerStoppedPropagationRef:R,userInteractionCount:p,onUserInteraction:g,required:f,defaultChecked:c,isFormControl:C,bubbleInput:N,setBubbleInput:S};return e.jsx(ft,{scope:t,...j,children:De(m)?m(j):a})}_(He,"SwitchProvider");var ht="SwitchTrigger",bt=r.forwardRef(_(function({__scopeSwitch:t,onClick:n,...a},c){const{control:o,form:i,value:l,disabled:u,checked:f,required:h,setControl:m,setChecked:d,hasConsumerStoppedPropagationRef:b,onUserInteraction:v,isFormControl:x,bubbleInput:N}=oe(ht,t),S=F(c,m),R=r.useRef(f);return r.useEffect(()=>{const p=i?o==null?void 0:o.ownerDocument.getElementById(i):o==null?void 0:o.form;if(p instanceof HTMLFormElement){const g=_(()=>d(R.current),"reset");return p.addEventListener("reset",g),()=>p.removeEventListener("reset",g)}},[o,i,d]),e.jsx(E.button,{type:"button",role:"switch","aria-checked":f,"aria-required":h,"data-state":ie(f),"data-disabled":u?"":void 0,disabled:u,value:l,...a,ref:S,onClick:T(n,p=>{v(),d(g=>!g),N&&x&&(b.current=p.isPropagationStopped(),b.current||p.stopPropagation())})})},"SwitchTrigger")),Oe=r.forwardRef(_(function(t,n){const{__scopeSwitch:a,name:c,checked:o,defaultChecked:i,required:l,disabled:u,value:f,onCheckedChange:h,form:m,...d}=t;return e.jsx(He,{__scopeSwitch:a,checked:o,defaultChecked:i,disabled:u,required:l,onCheckedChange:h,name:c,form:m,value:f,internal_do_not_use_render:({isFormControl:b})=>e.jsxs(e.Fragment,{children:[e.jsx(bt,{...d,ref:n,__scopeSwitch:a}),b&&e.jsx(yt,{__scopeSwitch:a})]})})},"Switch")),vt="SwitchThumb",xt=r.forwardRef(_(function(t,n){const{__scopeSwitch:a,...c}=t,o=oe(vt,a);return e.jsx(E.span,{"data-state":ie(o.checked),"data-disabled":o.disabled?"":void 0,...c,ref:n})},"SwitchThumb")),gt="SwitchBubbleInput",yt=r.forwardRef(_(function({__scopeSwitch:t,onClick:n,...a},c){const{control:o,hasConsumerStoppedPropagationRef:i,userInteractionCount:l,checked:u,defaultChecked:f,required:h,disabled:m,name:d,value:b,form:v,bubbleInput:x,setBubbleInput:N}=oe(gt,t),S=F(c,N),R=Be(o),p=r.useRef(!1),g=r.useRef(u),C=r.useRef(l);r.useEffect(()=>{const k=x;if(!k)return;const L=window.HTMLInputElement.prototype,G=Object.getOwnPropertyDescriptor(L,"checked").set,H=l!==C.current;C.current=l;const ee=g.current!==u;g.current=u;const te=!(H&&i.current);if(ee&&G){p.current=!H;const Xe=new Event("click",{bubbles:te});G.call(k,u),k.dispatchEvent(Xe),p.current=!1}},[x,u,i,l]);const j=r.useRef(u);return e.jsx(E.input,{type:"checkbox","aria-hidden":!0,defaultChecked:f??j.current,required:h,disabled:m,name:d,value:b,form:v,...a,tabIndex:-1,ref:S,onClick:T(n,k=>{p.current&&k.stopPropagation()}),style:{...a.style,...R,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"SwitchBubbleInput"));function De(s){return typeof s=="function"}_(De,"isFunction");function ie(s){return s?"checked":"unchecked"}_(ie,"getState");const V=r.forwardRef(({className:s,...t},n)=>e.jsx(Oe,{ref:n,className:X("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",s),...t,children:e.jsx(xt,{className:"pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform duration-fast data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"})}));V.displayName=Oe.displayName;V.__docgenInfo={description:`開關：切了**立即生效**。

與 Checkbox 的分工是語意不是外觀——「送出才生效」的表單選項用 Checkbox，
設定頁那種切下去就儲存的用 Switch。因此 Switch 刻意沒有「已改動未送出」
的琥珀態：立即生效的控制項不存在未送出狀態（ADR-0002 的保留色也就用不上）。

必須配可見的文字標籤（\`<Label htmlFor>\`）：開／關語意不靠位置與顏色單獨傳達，
標籤同時擴大點擊面積（軌道本身只有 20px 高）。`,methods:[]};const W=r.forwardRef(({className:s,...t},n)=>e.jsx("textarea",{className:X("flex min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors duration-fast placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-subtle disabled:cursor-not-allowed disabled:opacity-50",s),ref:n,...t}));W.displayName="Textarea";W.__docgenInfo={description:"多行文字輸入。樣式逐項鏡射 `Input`（邊框、聚焦環、不合格態、停用態），\n兩者排在同一張表單裡不會出現第二套質感。\n\n`resize-y` 是顯式宣告：只准直向調整，橫向會破壞表單欄寬對齊。\n高度下限 `min-h-16`（約三行）——低於這個高度的自由文字，該用 `Input`。",methods:[],displayName:"Textarea"};var wt=Object.defineProperty,w=(s,t)=>wt(s,"name",{value:t,configurable:!0}),Me="Radio",[Rt,Ue]=re(Me),[kt,Y]=Rt(Me);function qe(s){const{__scopeRadio:t,checked:n=!1,children:a,disabled:c,form:o,name:i,onCheck:l,required:u,value:f="on",internal_do_not_use_render:h}=s,[m,d]=r.useState(null),[b,v]=r.useState(null),x=r.useRef(!1),[N,S]=r.useReducer(g=>g+1,0),R=m?!!o||!!m.closest("form"):!0,p={checked:n,disabled:c,required:u,name:i,form:o,value:f,control:m,setControl:d,hasConsumerStoppedPropagationRef:x,userInteractionCount:N,onUserInteraction:S,isFormControl:R,bubbleInput:b,setBubbleInput:v,onCheck:w(()=>l==null?void 0:l(),"onCheck")};return e.jsx(kt,{scope:t,...p,children:$e(h)?h(p):a})}w(qe,"RadioProvider");var Nt="RadioTrigger",St=r.forwardRef(w(function({__scopeRadio:t,onClick:n,...a},c){const{checked:o,disabled:i,value:l,setControl:u,onCheck:f,hasConsumerStoppedPropagationRef:h,onUserInteraction:m,isFormControl:d,bubbleInput:b}=Y(Nt,t),v=F(c,u);return e.jsx(E.button,{type:"button",role:"radio","aria-checked":o,"data-state":ce(o),"data-disabled":i?"":void 0,disabled:i,value:l,...a,ref:v,onClick:T(n,x=>{o||(m(),f()),b&&d&&(h.current=x.isPropagationStopped(),h.current||x.stopPropagation())})})},"RadioTrigger")),jt="RadioIndicator",It=r.forwardRef(w(function(t,n){const{__scopeRadio:a,forceMount:c,...o}=t,i=Y(jt,a);return e.jsx(Ze,{present:c||i.checked,children:e.jsx(E.span,{"data-state":ce(i.checked),"data-disabled":i.disabled?"":void 0,...o,ref:n})})},"RadioIndicator")),Ct="RadioBubbleInput",_t=r.forwardRef(w(function({__scopeRadio:t,onClick:n,...a},c){const{control:o,checked:i,required:l,disabled:u,name:f,value:h,form:m,bubbleInput:d,setBubbleInput:b,hasConsumerStoppedPropagationRef:v,userInteractionCount:x}=Y(Ct,t),N=F(c,b),S=Be(o),R=r.useRef(!1),p=r.useRef(i),g=r.useRef(x);r.useEffect(()=>{const j=d;if(!j)return;const k=window.HTMLInputElement.prototype,Z=Object.getOwnPropertyDescriptor(k,"checked").set,G=x!==g.current;g.current=x;const H=p.current!==i;p.current=i;const ee=!(G&&v.current);if(H&&Z){R.current=!G;const te=new Event("click",{bubbles:ee});Z.call(j,i),j.dispatchEvent(te),R.current=!1}},[d,i,v,x]);const C=r.useRef(i);return e.jsx(E.input,{type:"radio","aria-hidden":!0,defaultChecked:C.current,required:l,disabled:u,name:f,value:h,form:m,...a,tabIndex:-1,ref:N,onClick:T(n,j=>{R.current&&j.stopPropagation()}),style:{...a.style,...S,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"RadioBubbleInput"));function $e(s){return typeof s=="function"}w($e,"isFunction");function ce(s){return s?"checked":"unchecked"}w(ce,"getState");var Et=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],de="RadioGroup",[Pt,da]=re(de,[Ve,Ue]),ze=Ve(),J=Ue(),[Tt,Ft]=Pt(de),Ke=r.forwardRef(w(function(t,n){const{__scopeRadioGroup:a,name:c,form:o,defaultValue:i,value:l,required:u=!1,disabled:f=!1,orientation:h,dir:m,loop:d=!0,onValueChange:b,...v}=t,x=ze(a),N=at(m),[S,R]=Ae({prop:l,defaultProp:i??null,onChange:b,caller:de}),[p,g]=r.useState(null),C=F(n,g),j=r.useRef(S);return r.useEffect(()=>{const k=o?p==null?void 0:p.ownerDocument.getElementById(o):p==null?void 0:p.closest("form");if(k instanceof HTMLFormElement){const L=w(()=>R(j.current),"reset");return k.addEventListener("reset",L),()=>k.removeEventListener("reset",L)}},[p,o,R]),e.jsx(Tt,{scope:a,name:c,form:o,required:u,disabled:f,value:S,onValueChange:R,children:e.jsx(et,{asChild:!0,...x,orientation:h,dir:N,loop:d,children:e.jsx(E.div,{role:"radiogroup","aria-required":u,"aria-orientation":h,"data-disabled":f?"":void 0,dir:N,...v,ref:C})})})},"RadioGroup")),Lt="RadioGroupItemProvider",Gt="RadioGroupItemTrigger";function Qe(s){const{__scopeRadioGroup:t,value:n,disabled:a,children:c,internal_do_not_use_render:o}=s,i=Ft(Lt,t),l=J(t),u=i.disabled||a;return e.jsx(qe,{...l,checked:i.value===n,disabled:u,required:i.required,name:i.name,form:i.form,value:n,onCheck:()=>i.onValueChange(n),internal_do_not_use_render:o,children:c})}w(Qe,"RadioGroupItemProvider");var At=r.forwardRef(w(function(t,n){const{__scopeRadioGroup:a,...c}=t,o=ze(a),i=J(a),{checked:l,disabled:u}=Y(Gt,i.__scopeRadio),f=r.useRef(null),h=F(n,f),m=r.useRef(!1);return r.useEffect(()=>{const d=w(v=>{Et.includes(v.key)&&(m.current=!0)},"handleKeyDown"),b=w(()=>m.current=!1,"handleKeyUp");return document.addEventListener("keydown",d),document.addEventListener("keyup",b),()=>{document.removeEventListener("keydown",d),document.removeEventListener("keyup",b)}},[]),e.jsx(tt,{asChild:!0,...o,focusable:!u,active:l,children:e.jsx(St,{...i,...c,ref:h,onKeyDown:T(c.onKeyDown,d=>{d.key==="Enter"&&d.preventDefault()}),onFocus:T(c.onFocus,()=>{var d;m.current&&((d=f.current)==null||d.click())})})})},"RadioGroupItemTrigger")),We=r.forwardRef(w(function(t,n){const{__scopeRadioGroup:a,value:c,disabled:o,...i}=t;return e.jsx(Qe,{__scopeRadioGroup:a,value:c,disabled:o,internal_do_not_use_render:({isFormControl:l})=>e.jsxs(e.Fragment,{children:[e.jsx(At,{...i,ref:n,__scopeRadioGroup:a}),l&&e.jsx(Bt,{__scopeRadioGroup:a})]})})},"RadioGroupItem")),Bt=r.forwardRef(w(function(t,n){const{__scopeRadioGroup:a,...c}=t,o=J(a);return e.jsx(_t,{...o,...c,ref:n})},"RadioGroupItemBubbleInput")),Vt=r.forwardRef(w(function(t,n){const{__scopeRadioGroup:a,...c}=t,o=J(a);return e.jsx(It,{...o,...c,ref:n})},"RadioGroupIndicator"));const le=r.forwardRef(({className:s,...t},n)=>e.jsx(Ke,{ref:n,className:X("grid gap-2",s),...t}));le.displayName=Ke.displayName;const ue=r.forwardRef(({className:s,...t},n)=>e.jsx(We,{ref:n,className:X("aspect-square size-4 shrink-0 rounded-full border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50",s),...t,children:e.jsx(Vt,{className:"flex items-center justify-center",children:e.jsx(ut,{className:"size-2.5 fill-primary text-primary","aria-hidden":!0})})}));ue.displayName=We.displayName;le.__docgenInfo={description:"單選群（垂直）。選項標籤長、或每個選項需要一行說明時用這個；\n選項 2–5 個且標籤短到能橫排一眼看完，用 `SegGroup`；\n超過 5 個或選項動態增減，用 `Select`；\n在「唯讀 ↔ 編輯」的欄位語境裡，用 `EditableField` 的 `radio` 型態。\n\n鍵盤與焦點行為（roving tabindex、方向鍵移動）由 Radix 提供，\n與 `SegGroup` 的手刻版本一致：整組只佔一個 Tab 停留點。",methods:[]};ue.__docgenInfo={description:`單選項圓鈕。選中同時「填實心點」——形狀變化不只靠顏色，
灰階列印與色覺障礙下仍分得出選了哪個。`,methods:[]};const la={title:"元件/表單/輸入控制項"},O={render:function(){const[t,n]=r.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(B,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"s-code",children:"單位代號"}),e.jsx(B,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(B,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{children:"訂購數量"}),e.jsx(Ye,{value:t,onChange:n,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},D={render:function(){const[t,n]=r.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(B,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(B,{id:"f-bad",defaultValue:"0","aria-invalid":t,"aria-describedby":"f-bad-err",onChange:a=>n(a.target.value==="0")}),t&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},M={render:function(){const[t,n]=r.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Je,{id:"s-active",checked:t,onCheckedChange:a=>n(a===!0)}),e.jsx(y,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"s-tier",children:"等級"}),e.jsxs(rt,{defaultValue:"gold",children:[e.jsx(st,{id:"s-tier",children:e.jsx(ot,{})}),e.jsx(it,{children:Q.map(a=>e.jsx(ct,{value:a.value,children:a.label},a.value))})]})]})]})},play:async({canvasElement:s})=>{const t=ne(s),n=t.getByRole("checkbox",{name:"啟用此單位"});await I(n).toHaveAttribute("aria-checked","true"),n.focus(),await P.keyboard(" "),await A(()=>I(n).toHaveAttribute("aria-checked","false")),await P.keyboard(" "),await A(()=>I(n).toHaveAttribute("aria-checked","true"));const a=t.getByRole("combobox",{name:"等級"});a.focus(),await P.keyboard("{Enter}"),await ne(s.ownerDocument.body).findByRole("listbox"),await I(a).toHaveAttribute("aria-expanded","true"),await P.keyboard("{Escape}"),await A(()=>I(a).toHaveAttribute("aria-expanded","false"))}},U={render:function(){const[t,n]=r.useState("gold"),[a]=r.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(ae,{label:"等級",options:Q,value:t,onPick:n})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(ae,{label:"等級（已改動）",options:Q,value:t,onPick:n,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(ae,{label:"等級（鎖定）",options:Q,value:a,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},q={render:function(){const[t,n]=r.useState(!0),[a,c]=r.useState(!1);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(y,{htmlFor:"sw-save",children:"自動儲存"}),e.jsx(V,{id:"sw-save",checked:t,onCheckedChange:n})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(y,{htmlFor:"sw-dense",children:"密集列表"}),e.jsx(V,{id:"sw-dense",checked:a,onCheckedChange:c})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(y,{htmlFor:"sw-locked",className:"opacity-60",children:"週報寄送（由管理端統一設定）"}),e.jsx(V,{id:"sw-locked",checked:!0,disabled:!0})]}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["開關＝",e.jsx("strong",{children:"切了立即生效"}),"（設定頁）；「送出才生效」的表單選項用 Checkbox。 所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。"]})]})},play:async({canvasElement:s})=>{const t=ne(s),n=t.getByRole("switch",{name:"自動儲存"});await I(n).toHaveAttribute("aria-checked","true"),n.focus(),await P.keyboard(" "),await A(()=>I(n).toHaveAttribute("aria-checked","false")),await P.keyboard(" "),await A(()=>I(n).toHaveAttribute("aria-checked","true")),await I(t.getByRole("switch",{name:"週報寄送（由管理端統一設定）"})).toBeDisabled()}},$={render:function(){const[t,n]=r.useState(""),a=t.length>200;return e.jsxs("div",{className:"max-w-xl space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"ta-note",children:"備註"}),e.jsx(W,{id:"ta-note",placeholder:"補充說明（選填）",value:t,onChange:c=>n(c.target.value),rows:3,"aria-invalid":a||void 0,"aria-describedby":a?"ta-err":void 0}),a&&e.jsxs("p",{id:"ta-err",className:"text-tiny text-danger",children:["超過 200 字上限（目前 ",t.length," 字）。"]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(y,{htmlFor:"ta-ro",children:"結案原因（停用示意）"}),e.jsx(W,{id:"ta-ro",defaultValue:"重複建立，已併入既有紀錄。",disabled:!0})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y）， 橫向拉寬會破壞表單欄寬對齊。"})]})}},z={render:function(){const[t,n]=r.useState("all");return e.jsxs("div",{className:"max-w-md space-y-3",children:[e.jsx(le,{value:t,onValueChange:n,"aria-label":"通知範圍",children:[{value:"all",label:"全部動態",hint:"每一筆變更都通知"},{value:"important",label:"重要事項",hint:"只有需要動作的才通知"},{value:"none",label:"暫停通知",hint:"改到站內清單自行查看"}].map(a=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(ue,{value:a.value,id:`rg-${a.value}`,className:"mt-0.5"}),e.jsxs(y,{htmlFor:`rg-${a.value}`,className:"font-normal",children:[e.jsx("span",{className:"block text-sm",children:a.label}),e.jsx("span",{className:"block text-tiny text-muted-foreground",children:a.hint})]})]},a.value))}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇； 超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。"})]})}},K={render:function(){const[t,n]=r.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(dt,{label:"下單管道",options:lt,selected:t,onToggle:a=>n(c=>c.includes(a)?c.filter(o=>o!==a):[...c,a])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var pe,me,fe;O.parameters={...O.parameters,docs:{...(pe=O.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
}`,...(fe=(me=O.parameters)==null?void 0:me.docs)==null?void 0:fe.source}}};var he,be,ve;D.parameters={...D.parameters,docs:{...(he=D.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
}`,...(ve=(be=D.parameters)==null?void 0:be.docs)==null?void 0:ve.source}}};var xe,ge,ye;M.parameters={...M.parameters,docs:{...(xe=M.parameters)==null?void 0:xe.docs,source:{originalSource:`{
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
}`,...(ye=(ge=M.parameters)==null?void 0:ge.docs)==null?void 0:ye.source}}};var we,Re,ke;U.parameters={...U.parameters,docs:{...(we=U.parameters)==null?void 0:we.docs,source:{originalSource:`{
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
}`,...(ke=(Re=U.parameters)==null?void 0:Re.docs)==null?void 0:ke.source}}};var Ne,Se,je;q.parameters={...q.parameters,docs:{...(Ne=q.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
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
}`,...(je=(Se=q.parameters)==null?void 0:Se.docs)==null?void 0:je.source}}};var Ie,Ce,_e;$.parameters={...$.parameters,docs:{...(Ie=$.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
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
}`,...(_e=(Ce=$.parameters)==null?void 0:Ce.docs)==null?void 0:_e.source}}};var Ee,Pe,Te;z.parameters={...z.parameters,docs:{...(Ee=z.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
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
}`,...(Te=(Pe=z.parameters)==null?void 0:Pe.docs)==null?void 0:Te.source}}};var Fe,Le,Ge;K.parameters={...K.parameters,docs:{...(Fe=K.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(Ge=(Le=K.parameters)==null?void 0:Le.docs)==null?void 0:Ge.source}}};const ua=["文字與數值","欄位狀態","勾選與下拉","分段選擇","開關","長文輸入","單選群","多選標籤片"];export{ua as __namedExportsOrder,la as default,U as 分段選擇,M as 勾選與下拉,z as 單選群,K as 多選標籤片,O as 文字與數值,D as 欄位狀態,$ as 長文輸入,q as 開關};
