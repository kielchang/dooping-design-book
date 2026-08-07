import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as o,o as vt}from"./index-UiW3gZKV.js";import{within as le,expect as E,userEvent as H,waitFor as M}from"./index-DH-M5T-F.js";import{I as U}from"./input-vSeq6R7n.js";import{L as N}from"./label-CcKLfqeY.js";import{N as bt}from"./number-input-DJbZuNmz.js";import{C as ht}from"./checkbox-CzpyAXv7.js";import{c as te,a as _,b as pe,g as xt,u as gt,i as yt,P as Rt}from"./Combination-BkzcTUOc.js";import{u as O}from"./index-C5qX--6C.js";import{u as qe}from"./index-DW-t51uL.js";import{P as F}from"./index-B0PXCDJg.js";import{c as ne}from"./utils-pm6Xa0Qd.js";import{e as wt,u as ze,S as St,a as It,b as kt,c as Nt,d as jt}from"./select-oRfq6VYn.js";import{c as Ct}from"./createLucideIcon-BcR0bl2m.js";import{S as ce}from"./seg-group-D0IDbvdD.js";import{C as _t}from"./chips-DzzKURvw.js";import{T as Z,C as Et}from"./sample-data-DlVwqcXX.js";import"./_commonjsHelpers-CqkleIqs.js";import"./check-CZys2X9e.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=Ct("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var Tt=Object.defineProperty,P=(a,t)=>Tt(a,"name",{value:t,configurable:!0}),me="Switch",[Pt,Un]=te(me),[Gt,fe]=Pt(me);function Ye(a){const{__scopeSwitch:t,checked:r,children:n,defaultChecked:s,disabled:c,form:i,name:u,onCheckedChange:f,required:b,value:v="on",internal_do_not_use_render:l}=a,[p,g]=pe({prop:r,defaultProp:s??!1,onChange:f,caller:me}),[h,x]=o.useState(null),[I,w]=o.useState(null),m=o.useRef(!1),[d,R]=o.useReducer(C=>C+1,0),S=h?!!i||!!h.closest("form"):!0,y={checked:p,setChecked:g,disabled:c,control:h,setControl:x,name:u,form:i,value:v,hasConsumerStoppedPropagationRef:m,userInteractionCount:d,onUserInteraction:R,required:b,defaultChecked:s,isFormControl:S,bubbleInput:I,setBubbleInput:w};return e.jsx(Gt,{scope:t,...y,children:We(l)?l(y):n})}P(Ye,"SwitchProvider");var Lt="SwitchTrigger",At=o.forwardRef(P(function({__scopeSwitch:t,onClick:r,...n},s){const{control:c,form:i,value:u,disabled:f,checked:b,required:v,setControl:l,setChecked:p,hasConsumerStoppedPropagationRef:g,onUserInteraction:h,isFormControl:x,bubbleInput:I}=fe(Lt,t),w=O(s,l),m=o.useRef(b);return o.useEffect(()=>{const d=i?c==null?void 0:c.ownerDocument.getElementById(i):c==null?void 0:c.form;if(d instanceof HTMLFormElement){const R=P(()=>p(m.current),"reset");return d.addEventListener("reset",R),()=>d.removeEventListener("reset",R)}},[c,i,p]),e.jsx(F.button,{type:"button",role:"switch","aria-checked":b,"aria-required":v,"data-state":ve(b),"data-disabled":f?"":void 0,disabled:f,value:u,...n,ref:w,onClick:_(r,d=>{h(),p(R=>!R),I&&x&&(g.current=d.isPropagationStopped(),g.current||d.stopPropagation())})})},"SwitchTrigger")),Qe=o.forwardRef(P(function(t,r){const{__scopeSwitch:n,name:s,checked:c,defaultChecked:i,required:u,disabled:f,value:b,onCheckedChange:v,form:l,...p}=t;return e.jsx(Ye,{__scopeSwitch:n,checked:c,defaultChecked:i,disabled:f,required:u,onCheckedChange:v,name:s,form:l,value:b,internal_do_not_use_render:({isFormControl:g})=>e.jsxs(e.Fragment,{children:[e.jsx(At,{...p,ref:r,__scopeSwitch:n}),g&&e.jsx(Ht,{__scopeSwitch:n})]})})},"Switch")),Bt="SwitchThumb",Ot=o.forwardRef(P(function(t,r){const{__scopeSwitch:n,...s}=t,c=fe(Bt,n);return e.jsx(F.span,{"data-state":ve(c.checked),"data-disabled":c.disabled?"":void 0,...s,ref:r})},"SwitchThumb")),Dt="SwitchBubbleInput",Ht=o.forwardRef(P(function({__scopeSwitch:t,onClick:r,...n},s){const{control:c,hasConsumerStoppedPropagationRef:i,userInteractionCount:u,checked:f,defaultChecked:b,required:v,disabled:l,name:p,value:g,form:h,bubbleInput:x,setBubbleInput:I}=fe(Dt,t),w=O(s,I),m=qe(c),d=o.useRef(!1),R=o.useRef(f),S=o.useRef(u);o.useEffect(()=>{const C=x;if(!C)return;const T=window.HTMLInputElement.prototype,G=Object.getOwnPropertyDescriptor(T,"checked").set,L=u!==S.current;S.current=u;const A=R.current!==f;R.current=f;const V=!(L&&i.current);if(A&&G){d.current=!L;const se=new Event("click",{bubbles:V});G.call(C,f),C.dispatchEvent(se),d.current=!1}},[x,f,i,u]);const y=o.useRef(f);return e.jsx(F.input,{type:"checkbox","aria-hidden":!0,defaultChecked:b??y.current,required:v,disabled:l,name:p,value:g,form:h,...n,tabIndex:-1,ref:w,onClick:_(r,C=>{d.current&&C.stopPropagation()}),style:{...n.style,...m,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"SwitchBubbleInput"));function We(a){return typeof a=="function"}P(We,"isFunction");function ve(a){return a?"checked":"unchecked"}P(ve,"getState");const K=o.forwardRef(({className:a,...t},r)=>e.jsx(Qe,{ref:r,className:ne("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",a),...t,children:e.jsx(Ot,{className:"pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform duration-fast data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"})}));K.displayName=Qe.displayName;K.__docgenInfo={description:`開關：切了**立即生效**。

與 Checkbox 的分工是語意不是外觀——「送出才生效」的表單選項用 Checkbox，
設定頁那種切下去就儲存的用 Switch。因此 Switch 刻意沒有「已改動未送出」
的琥珀態：立即生效的控制項不存在未送出狀態（ADR-0002 的保留色也就用不上）。

必須配可見的文字標籤（\`<Label htmlFor>\`）：開／關語意不靠位置與顏色單獨傳達，
標籤同時擴大點擊面積（軌道本身只有 20px 高）。`,methods:[]};const ee=o.forwardRef(({className:a,...t},r)=>e.jsx("textarea",{className:ne("flex min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors duration-fast placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-subtle disabled:cursor-not-allowed disabled:opacity-50",a),ref:r,...t}));ee.displayName="Textarea";ee.__docgenInfo={description:"多行文字輸入。樣式逐項鏡射 `Input`（邊框、聚焦環、不合格態、停用態），\n兩者排在同一張表單裡不會出現第二套質感。\n\n`resize-y` 是顯式宣告：只准直向調整，橫向會破壞表單欄寬對齊。\n高度下限 `min-h-16`（約三行）——低於這個高度的自由文字，該用 `Input`。",methods:[],displayName:"Textarea"};var Vt=Object.defineProperty,be=(a,t)=>Vt(a,"name",{value:t,configurable:!0}),ie=!1;function Xe(){const[a,t]=o.useState(ie);return o.useEffect(()=>{ie||(ie=!0,t(!0))},[]),a}be(Xe,"useIsHydrated");var Je=vt[" useSyncExternalStore ".trim().toString()];function Ze(){return()=>{}}be(Ze,"subscribe");function et(){return Je(Ze,()=>!0,()=>!1)}be(et,"useIsHydratedModern");var Mt=typeof Je=="function"?et:Xe,Ut=Object.defineProperty,D=(a,t)=>Ut(a,"name",{value:t,configurable:!0}),de="rovingFocusGroup.onEntryFocus",Kt={bubbles:!1,cancelable:!0},re="RovingFocusGroup",[ue,tt,$t]=wt(re),[qt,nt]=te(re,[$t]),[zt,Yt]=qt(re),Qt=o.forwardRef(D(function(t,r){return e.jsx(ue.Provider,{scope:t.__scopeRovingFocusGroup,children:e.jsx(ue.Slot,{scope:t.__scopeRovingFocusGroup,children:e.jsx(Wt,{...t,ref:r})})})},"RovingFocusGroup")),Wt=o.forwardRef(D(function(t,r){const{__scopeRovingFocusGroup:n,orientation:s,loop:c=!1,dir:i,currentTabStopId:u,defaultCurrentTabStopId:f,onCurrentTabStopIdChange:b,onEntryFocus:v,preventScrollOnEntryFocus:l=!1,...p}=t,g=o.useRef(null),h=O(r,g),x=ze(i),[I,w]=pe({prop:u,defaultProp:f??null,onChange:b,caller:re}),[m,d]=o.useState(!1),R=yt(v),S=tt(n),y=o.useRef(!1),[C,T]=o.useState(0);return o.useEffect(()=>{const k=g.current;if(k)return k.addEventListener(de,R),()=>k.removeEventListener(de,R)},[R]),e.jsx(zt,{scope:n,orientation:s,dir:x,loop:c,currentTabStopId:I,onItemFocus:o.useCallback(k=>w(k),[w]),onItemShiftTab:o.useCallback(()=>d(!0),[]),onFocusableItemAdd:o.useCallback(()=>T(k=>k+1),[]),onFocusableItemRemove:o.useCallback(()=>T(k=>k-1),[]),children:e.jsx(F.div,{tabIndex:m||C===0?-1:0,"data-orientation":s,...p,ref:h,style:{outline:"none",...t.style},onMouseDown:_(t.onMouseDown,()=>{y.current=!0}),onFocus:_(t.onFocus,k=>{const G=!y.current;if(k.target===k.currentTarget&&G&&!m){const L=new CustomEvent(de,Kt);if(k.currentTarget.dispatchEvent(L),!L.defaultPrevented){const A=S().filter(B=>B.focusable),V=A.find(B=>B.active),se=A.find(B=>B.id===I),ft=[V,se,...A].filter(Boolean).map(B=>B.ref.current);he(ft,l)}}y.current=!1}),onBlur:_(t.onBlur,()=>d(!1))})})},"RovingFocusGroupImpl")),Xt="RovingFocusGroupItem",Jt=o.forwardRef(D(function(t,r){const{__scopeRovingFocusGroup:n,focusable:s=!0,active:c=!1,tabStopId:i,children:u,...f}=t,b=xt(),v=i||b,l=Yt(Xt,n),p=l.currentTabStopId===v,g=tt(n),{onFocusableItemAdd:h,onFocusableItemRemove:x,currentTabStopId:I}=l,w=Mt();return gt(()=>{if(!(!w||!s))return h(),()=>x()},[w,s,h,x]),o.useEffect(()=>{if(!(w||!s))return h(),()=>x()},[w,s,h,x]),e.jsx(ue.ItemSlot,{scope:n,id:v,focusable:s,active:c,children:e.jsx(F.span,{tabIndex:p?0:-1,"data-orientation":l.orientation,...f,ref:r,onMouseDown:_(t.onMouseDown,m=>{s?l.onItemFocus(v):m.preventDefault()}),onFocus:_(t.onFocus,()=>l.onItemFocus(v)),onKeyDown:_(t.onKeyDown,m=>{if(m.key==="Tab"&&m.shiftKey){l.onItemShiftTab();return}if(m.target!==m.currentTarget)return;const d=at(m,l.orientation,l.dir);if(d!==void 0){if(m.metaKey||m.ctrlKey||m.altKey||m.shiftKey)return;m.preventDefault();let S=g().filter(y=>y.focusable).map(y=>y.ref.current);if(d==="last")S.reverse();else if(d==="prev"||d==="next"){d==="prev"&&S.reverse();const y=S.indexOf(m.currentTarget);S=l.loop?ot(S,y+1):S.slice(y+1)}setTimeout(()=>he(S))}}),children:typeof u=="function"?u({isCurrentTabStop:p,hasTabStop:I!=null}):u})})},"RovingFocusGroupItem")),Zt={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function rt(a,t){return t!=="rtl"?a:a==="ArrowLeft"?"ArrowRight":a==="ArrowRight"?"ArrowLeft":a}D(rt,"getDirectionAwareKey");function at(a,t,r){const n=rt(a.key,r);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(n))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(n)))return Zt[n]}D(at,"getFocusIntent");function he(a,t=!1){const r=document.activeElement;for(const n of a)if(n===r||(n.focus({preventScroll:t}),document.activeElement!==r))return}D(he,"focusFirst");function ot(a,t){return a.map((r,n)=>a[(t+n)%a.length])}D(ot,"wrapArray");var en=Qt,tn=Jt,nn=Object.defineProperty,j=(a,t)=>nn(a,"name",{value:t,configurable:!0}),st="Radio",[rn,ct]=te(st),[an,ae]=rn(st);function it(a){const{__scopeRadio:t,checked:r=!1,children:n,disabled:s,form:c,name:i,onCheck:u,required:f,value:b="on",internal_do_not_use_render:v}=a,[l,p]=o.useState(null),[g,h]=o.useState(null),x=o.useRef(!1),[I,w]=o.useReducer(R=>R+1,0),m=l?!!c||!!l.closest("form"):!0,d={checked:r,disabled:s,required:f,name:i,form:c,value:b,control:l,setControl:p,hasConsumerStoppedPropagationRef:x,userInteractionCount:I,onUserInteraction:w,isFormControl:m,bubbleInput:g,setBubbleInput:h,onCheck:j(()=>u==null?void 0:u(),"onCheck")};return e.jsx(an,{scope:t,...d,children:dt(v)?v(d):n})}j(it,"RadioProvider");var on="RadioTrigger",sn=o.forwardRef(j(function({__scopeRadio:t,onClick:r,...n},s){const{checked:c,disabled:i,value:u,setControl:f,onCheck:b,hasConsumerStoppedPropagationRef:v,onUserInteraction:l,isFormControl:p,bubbleInput:g}=ae(on,t),h=O(s,f);return e.jsx(F.button,{type:"button",role:"radio","aria-checked":c,"data-state":xe(c),"data-disabled":i?"":void 0,disabled:i,value:u,...n,ref:h,onClick:_(r,x=>{c||(l(),b()),g&&p&&(v.current=x.isPropagationStopped(),v.current||x.stopPropagation())})})},"RadioTrigger")),cn="RadioIndicator",dn=o.forwardRef(j(function(t,r){const{__scopeRadio:n,forceMount:s,...c}=t,i=ae(cn,n);return e.jsx(Rt,{present:s||i.checked,children:e.jsx(F.span,{"data-state":xe(i.checked),"data-disabled":i.disabled?"":void 0,...c,ref:r})})},"RadioIndicator")),ln="RadioBubbleInput",un=o.forwardRef(j(function({__scopeRadio:t,onClick:r,...n},s){const{control:c,checked:i,required:u,disabled:f,name:b,value:v,form:l,bubbleInput:p,setBubbleInput:g,hasConsumerStoppedPropagationRef:h,userInteractionCount:x}=ae(ln,t),I=O(s,g),w=qe(c),m=o.useRef(!1),d=o.useRef(i),R=o.useRef(x);o.useEffect(()=>{const y=p;if(!y)return;const C=window.HTMLInputElement.prototype,k=Object.getOwnPropertyDescriptor(C,"checked").set,G=x!==R.current;R.current=x;const L=d.current!==i;d.current=i;const A=!(G&&h.current);if(L&&k){m.current=!G;const V=new Event("click",{bubbles:A});k.call(y,i),y.dispatchEvent(V),m.current=!1}},[p,i,h,x]);const S=o.useRef(i);return e.jsx(F.input,{type:"radio","aria-hidden":!0,defaultChecked:S.current,required:u,disabled:f,name:b,value:v,form:l,...n,tabIndex:-1,ref:I,onClick:_(r,y=>{m.current&&y.stopPropagation()}),style:{...n.style,...w,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"RadioBubbleInput"));function dt(a){return typeof a=="function"}j(dt,"isFunction");function xe(a){return a?"checked":"unchecked"}j(xe,"getState");var pn=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],ge="RadioGroup",[mn,Kn]=te(ge,[nt,ct]),lt=nt(),oe=ct(),[fn,vn]=mn(ge),ut=o.forwardRef(j(function(t,r){const{__scopeRadioGroup:n,name:s,form:c,defaultValue:i,value:u,required:f=!1,disabled:b=!1,orientation:v,dir:l,loop:p=!0,onValueChange:g,...h}=t,x=lt(n),I=ze(l),[w,m]=pe({prop:u,defaultProp:i??null,onChange:g,caller:ge}),[d,R]=o.useState(null),S=O(r,R),y=o.useRef(w);return o.useEffect(()=>{const C=c?d==null?void 0:d.ownerDocument.getElementById(c):d==null?void 0:d.closest("form");if(C instanceof HTMLFormElement){const T=j(()=>m(y.current),"reset");return C.addEventListener("reset",T),()=>C.removeEventListener("reset",T)}},[d,c,m]),e.jsx(fn,{scope:n,name:s,form:c,required:f,disabled:b,value:w,onValueChange:m,children:e.jsx(en,{asChild:!0,...x,orientation:v,dir:I,loop:p,children:e.jsx(F.div,{role:"radiogroup","aria-required":f,"aria-orientation":v,"data-disabled":b?"":void 0,dir:I,...h,ref:S})})})},"RadioGroup")),bn="RadioGroupItemProvider",hn="RadioGroupItemTrigger";function pt(a){const{__scopeRadioGroup:t,value:r,disabled:n,children:s,internal_do_not_use_render:c}=a,i=vn(bn,t),u=oe(t),f=i.disabled||n;return e.jsx(it,{...u,checked:i.value===r,disabled:f,required:i.required,name:i.name,form:i.form,value:r,onCheck:()=>i.onValueChange(r),internal_do_not_use_render:c,children:s})}j(pt,"RadioGroupItemProvider");var xn=o.forwardRef(j(function(t,r){const{__scopeRadioGroup:n,...s}=t,c=lt(n),i=oe(n),{checked:u,disabled:f}=ae(hn,i.__scopeRadio),b=o.useRef(null),v=O(r,b),l=o.useRef(!1);return o.useEffect(()=>{const p=j(h=>{pn.includes(h.key)&&(l.current=!0)},"handleKeyDown"),g=j(()=>l.current=!1,"handleKeyUp");return document.addEventListener("keydown",p),document.addEventListener("keyup",g),()=>{document.removeEventListener("keydown",p),document.removeEventListener("keyup",g)}},[]),e.jsx(tn,{asChild:!0,...c,focusable:!f,active:u,children:e.jsx(sn,{...i,...s,ref:v,onKeyDown:_(s.onKeyDown,p=>{p.key==="Enter"&&p.preventDefault()}),onFocus:_(s.onFocus,()=>{var p;l.current&&((p=b.current)==null||p.click())})})})},"RadioGroupItemTrigger")),mt=o.forwardRef(j(function(t,r){const{__scopeRadioGroup:n,value:s,disabled:c,...i}=t;return e.jsx(pt,{__scopeRadioGroup:n,value:s,disabled:c,internal_do_not_use_render:({isFormControl:u})=>e.jsxs(e.Fragment,{children:[e.jsx(xn,{...i,ref:r,__scopeRadioGroup:n}),u&&e.jsx(gn,{__scopeRadioGroup:n})]})})},"RadioGroupItem")),gn=o.forwardRef(j(function(t,r){const{__scopeRadioGroup:n,...s}=t,c=oe(n);return e.jsx(un,{...c,...s,ref:r})},"RadioGroupItemBubbleInput")),yn=o.forwardRef(j(function(t,r){const{__scopeRadioGroup:n,...s}=t,c=oe(n);return e.jsx(dn,{...c,...s,ref:r})},"RadioGroupIndicator"));const ye=o.forwardRef(({className:a,...t},r)=>e.jsx(ut,{ref:r,className:ne("grid gap-2",a),...t}));ye.displayName=ut.displayName;const Re=o.forwardRef(({className:a,...t},r)=>e.jsx(mt,{ref:r,className:ne("aspect-square size-4 shrink-0 rounded-full border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50",a),...t,children:e.jsx(yn,{className:"flex items-center justify-center",children:e.jsx(Ft,{className:"size-2.5 fill-primary text-primary","aria-hidden":!0})})}));Re.displayName=mt.displayName;ye.__docgenInfo={description:"單選群（垂直）。選項標籤長、或每個選項需要一行說明時用這個；\n選項 2–5 個且標籤短到能橫排一眼看完，用 `SegGroup`；\n超過 5 個或選項動態增減，用 `Select`；\n在「唯讀 ↔ 編輯」的欄位語境裡，用 `EditableField` 的 `radio` 型態。\n\n鍵盤與焦點行為（roving tabindex、方向鍵移動）由 Radix 提供，\n與 `SegGroup` 的手刻版本一致：整組只佔一個 Tab 停留點。",methods:[]};Re.__docgenInfo={description:`單選項圓鈕。選中同時「填實心點」——形狀變化不只靠顏色，
灰階列印與色覺障礙下仍分得出選了哪個。`,methods:[]};const $n={title:"元件/表單/輸入控制項"},$={render:function(){const[t,r]=o.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(U,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-code",children:"單位代號"}),e.jsx(U,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(U,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{children:"訂購數量"}),e.jsx(bt,{value:t,onChange:r,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},q={render:function(){const[t,r]=o.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(U,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(U,{id:"f-bad",defaultValue:"0","aria-invalid":t,"aria-describedby":"f-bad-err",onChange:n=>r(n.target.value==="0")}),t&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},z={render:function(){const[t,r]=o.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ht,{id:"s-active",checked:t,onCheckedChange:n=>r(n===!0)}),e.jsx(N,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"s-tier",children:"等級"}),e.jsxs(St,{defaultValue:"gold",children:[e.jsx(It,{id:"s-tier",children:e.jsx(kt,{})}),e.jsx(Nt,{children:Z.map(n=>e.jsx(jt,{value:n.value,children:n.label},n.value))})]})]})]})},play:async({canvasElement:a})=>{const t=le(a),r=t.getByRole("checkbox",{name:"啟用此單位"});await E(r).toHaveAttribute("aria-checked","true"),r.focus(),await H.keyboard(" "),await M(()=>E(r).toHaveAttribute("aria-checked","false")),await H.keyboard(" "),await M(()=>E(r).toHaveAttribute("aria-checked","true"));const n=t.getByRole("combobox",{name:"等級"});n.focus(),await H.keyboard("{Enter}"),await le(a.ownerDocument.body).findByRole("listbox"),await E(n).toHaveAttribute("aria-expanded","true"),await H.keyboard("{Escape}"),await M(()=>E(n).toHaveAttribute("aria-expanded","false"))}},Y={render:function(){const[t,r]=o.useState("gold"),[n]=o.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(ce,{label:"等級",options:Z,value:t,onPick:r})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(ce,{label:"等級（已改動）",options:Z,value:t,onPick:r,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(ce,{label:"等級（鎖定）",options:Z,value:n,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},Q={render:function(){const[t,r]=o.useState(!0),[n,s]=o.useState(!1);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(N,{htmlFor:"sw-save",children:"自動儲存"}),e.jsx(K,{id:"sw-save",checked:t,onCheckedChange:r})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(N,{htmlFor:"sw-dense",children:"密集列表"}),e.jsx(K,{id:"sw-dense",checked:n,onCheckedChange:s})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(N,{htmlFor:"sw-locked",className:"opacity-60",children:"週報寄送（由管理端統一設定）"}),e.jsx(K,{id:"sw-locked",checked:!0,disabled:!0})]}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["開關＝",e.jsx("strong",{children:"切了立即生效"}),"（設定頁）；「送出才生效」的表單選項用 Checkbox。 所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。"]})]})},play:async({canvasElement:a})=>{const t=le(a),r=t.getByRole("switch",{name:"自動儲存"});await E(r).toHaveAttribute("aria-checked","true"),r.focus(),await H.keyboard(" "),await M(()=>E(r).toHaveAttribute("aria-checked","false")),await H.keyboard(" "),await M(()=>E(r).toHaveAttribute("aria-checked","true")),await E(t.getByRole("switch",{name:"週報寄送（由管理端統一設定）"})).toBeDisabled()}},W={render:function(){const[t,r]=o.useState(""),n=t.length>200;return e.jsxs("div",{className:"max-w-xl space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"ta-note",children:"備註"}),e.jsx(ee,{id:"ta-note",placeholder:"補充說明（選填）",value:t,onChange:s=>r(s.target.value),rows:3,"aria-invalid":n||void 0,"aria-describedby":n?"ta-err":void 0}),n&&e.jsxs("p",{id:"ta-err",className:"text-tiny text-danger",children:["超過 200 字上限（目前 ",t.length," 字）。"]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(N,{htmlFor:"ta-ro",children:"結案原因（停用示意）"}),e.jsx(ee,{id:"ta-ro",defaultValue:"重複建立，已併入既有紀錄。",disabled:!0})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y）， 橫向拉寬會破壞表單欄寬對齊。"})]})}},X={render:function(){const[t,r]=o.useState("all");return e.jsxs("div",{className:"max-w-md space-y-3",children:[e.jsx(ye,{value:t,onValueChange:r,"aria-label":"通知範圍",children:[{value:"all",label:"全部動態",hint:"每一筆變更都通知"},{value:"important",label:"重要事項",hint:"只有需要動作的才通知"},{value:"none",label:"暫停通知",hint:"改到站內清單自行查看"}].map(n=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(Re,{value:n.value,id:`rg-${n.value}`,className:"mt-0.5"}),e.jsxs(N,{htmlFor:`rg-${n.value}`,className:"font-normal",children:[e.jsx("span",{className:"block text-sm",children:n.label}),e.jsx("span",{className:"block text-tiny text-muted-foreground",children:n.hint})]})]},n.value))}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇； 超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。"})]})}},J={render:function(){const[t,r]=o.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(_t,{label:"下單管道",options:Et,selected:t,onToggle:n=>r(s=>s.includes(n)?s.filter(c=>c!==n):[...s,n])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var we,Se,Ie;$.parameters={...$.parameters,docs:{...(we=$.parameters)==null?void 0:we.docs,source:{originalSource:`{
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
}`,...(Ie=(Se=$.parameters)==null?void 0:Se.docs)==null?void 0:Ie.source}}};var ke,Ne,je;q.parameters={...q.parameters,docs:{...(ke=q.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(je=(Ne=q.parameters)==null?void 0:Ne.docs)==null?void 0:je.source}}};var Ce,_e,Ee;z.parameters={...z.parameters,docs:{...(Ce=z.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
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
}`,...(Ee=(_e=z.parameters)==null?void 0:_e.docs)==null?void 0:Ee.source}}};var Fe,Te,Pe;Y.parameters={...Y.parameters,docs:{...(Fe=Y.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
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
}`,...(Pe=(Te=Y.parameters)==null?void 0:Te.docs)==null?void 0:Pe.source}}};var Ge,Le,Ae;Q.parameters={...Q.parameters,docs:{...(Ge=Q.parameters)==null?void 0:Ge.docs,source:{originalSource:`{
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
}`,...(Ae=(Le=Q.parameters)==null?void 0:Le.docs)==null?void 0:Ae.source}}};var Be,Oe,De;W.parameters={...W.parameters,docs:{...(Be=W.parameters)==null?void 0:Be.docs,source:{originalSource:`{
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
}`,...(De=(Oe=W.parameters)==null?void 0:Oe.docs)==null?void 0:De.source}}};var He,Ve,Me;X.parameters={...X.parameters,docs:{...(He=X.parameters)==null?void 0:He.docs,source:{originalSource:`{
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
}`,...(Me=(Ve=X.parameters)==null?void 0:Ve.docs)==null?void 0:Me.source}}};var Ue,Ke,$e;J.parameters={...J.parameters,docs:{...(Ue=J.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...($e=(Ke=J.parameters)==null?void 0:Ke.docs)==null?void 0:$e.source}}};const qn=["文字與數值","欄位狀態","勾選與下拉","分段選擇","開關","長文輸入","單選群","多選標籤片"];export{qn as __namedExportsOrder,$n as default,Y as 分段選擇,z as 勾選與下拉,X as 單選群,J as 多選標籤片,$ as 文字與數值,q as 欄位狀態,W as 長文輸入,Q as 開關};
