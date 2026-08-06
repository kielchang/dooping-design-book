import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as o,o as ut}from"./index-BFQ_Q9OP.js";import{I as M}from"./input-BrhjGTHk.js";import{L as w}from"./label-8atcQy7k.js";import{N as pt}from"./number-input-LFDh09jt.js";import{C as mt}from"./checkbox-CNPe1prz.js";import{c as J,a as _,b as ie,g as ft,u as vt,i as ht,P as bt}from"./Combination-DbYkIDSq.js";import{u as O}from"./index-DdXKfkXy.js";import{u as Ue}from"./index-qiD-0q_F.js";import{P as F}from"./index-BTi5fV8z.js";import{c as Z}from"./utils-pm6Xa0Qd.js";import{e as xt,u as He,S as gt,a as Rt,b as yt,c as St,d as It}from"./select-qegdSbxB.js";import{c as Nt}from"./createLucideIcon-DDRU598s.js";import{S as se}from"./seg-group-C31EXuC6.js";import{C as jt}from"./chips-hPkBPIX5.js";import{T as W,C as wt}from"./sample-data-DlVwqcXX.js";import"./check-SsieMrcg.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=Nt("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var kt=Object.defineProperty,T=(s,t)=>kt(s,"name",{value:t,configurable:!0}),de="Switch",[_t,On]=J(de),[Ft,le]=_t(de);function Ke(s){const{__scopeSwitch:t,checked:r,children:n,defaultChecked:a,disabled:c,form:i,name:u,onCheckedChange:f,required:h,value:v="on",internal_do_not_use_render:l}=s,[p,g]=ie({prop:r,defaultProp:a??!1,onChange:f,caller:de}),[b,x]=o.useState(null),[N,S]=o.useState(null),m=o.useRef(!1),[d,y]=o.useReducer(k=>k+1,0),I=b?!!i||!!b.closest("form"):!0,R={checked:p,setChecked:g,disabled:c,control:b,setControl:x,name:u,form:i,value:v,hasConsumerStoppedPropagationRef:m,userInteractionCount:d,onUserInteraction:y,required:h,defaultChecked:a,isFormControl:I,bubbleInput:N,setBubbleInput:S};return e.jsx(Ft,{scope:t,...R,children:qe(l)?l(R):n})}T(Ke,"SwitchProvider");var Et="SwitchTrigger",Tt=o.forwardRef(T(function({__scopeSwitch:t,onClick:r,...n},a){const{control:c,form:i,value:u,disabled:f,checked:h,required:v,setControl:l,setChecked:p,hasConsumerStoppedPropagationRef:g,onUserInteraction:b,isFormControl:x,bubbleInput:N}=le(Et,t),S=O(a,l),m=o.useRef(h);return o.useEffect(()=>{const d=i?c==null?void 0:c.ownerDocument.getElementById(i):c==null?void 0:c.form;if(d instanceof HTMLFormElement){const y=T(()=>p(m.current),"reset");return d.addEventListener("reset",y),()=>d.removeEventListener("reset",y)}},[c,i,p]),e.jsx(F.button,{type:"button",role:"switch","aria-checked":h,"aria-required":v,"data-state":ue(h),"data-disabled":f?"":void 0,disabled:f,value:u,...n,ref:S,onClick:_(r,d=>{b(),p(y=>!y),N&&x&&(g.current=d.isPropagationStopped(),g.current||d.stopPropagation())})})},"SwitchTrigger")),$e=o.forwardRef(T(function(t,r){const{__scopeSwitch:n,name:a,checked:c,defaultChecked:i,required:u,disabled:f,value:h,onCheckedChange:v,form:l,...p}=t;return e.jsx(Ke,{__scopeSwitch:n,checked:c,defaultChecked:i,disabled:f,required:u,onCheckedChange:v,name:a,form:l,value:h,internal_do_not_use_render:({isFormControl:g})=>e.jsxs(e.Fragment,{children:[e.jsx(Tt,{...p,ref:r,__scopeSwitch:n}),g&&e.jsx(At,{__scopeSwitch:n})]})})},"Switch")),Pt="SwitchThumb",Gt=o.forwardRef(T(function(t,r){const{__scopeSwitch:n,...a}=t,c=le(Pt,n);return e.jsx(F.span,{"data-state":ue(c.checked),"data-disabled":c.disabled?"":void 0,...a,ref:r})},"SwitchThumb")),Lt="SwitchBubbleInput",At=o.forwardRef(T(function({__scopeSwitch:t,onClick:r,...n},a){const{control:c,hasConsumerStoppedPropagationRef:i,userInteractionCount:u,checked:f,defaultChecked:h,required:v,disabled:l,name:p,value:g,form:b,bubbleInput:x,setBubbleInput:N}=le(Lt,t),S=O(a,N),m=Ue(c),d=o.useRef(!1),y=o.useRef(f),I=o.useRef(u);o.useEffect(()=>{const k=x;if(!k)return;const E=window.HTMLInputElement.prototype,P=Object.getOwnPropertyDescriptor(E,"checked").set,G=u!==I.current;I.current=u;const L=y.current!==f;y.current=f;const V=!(G&&i.current);if(L&&P){d.current=!G;const re=new Event("click",{bubbles:V});P.call(k,f),k.dispatchEvent(re),d.current=!1}},[x,f,i,u]);const R=o.useRef(f);return e.jsx(F.input,{type:"checkbox","aria-hidden":!0,defaultChecked:h??R.current,required:v,disabled:l,name:p,value:g,form:b,...n,tabIndex:-1,ref:S,onClick:_(r,k=>{d.current&&k.stopPropagation()}),style:{...n.style,...m,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"SwitchBubbleInput"));function qe(s){return typeof s=="function"}T(qe,"isFunction");function ue(s){return s?"checked":"unchecked"}T(ue,"getState");const B=o.forwardRef(({className:s,...t},r)=>e.jsx($e,{ref:r,className:Z("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",s),...t,children:e.jsx(Gt,{className:"pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform duration-fast data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"})}));B.displayName=$e.displayName;B.__docgenInfo={description:`開關：切了**立即生效**。

與 Checkbox 的分工是語意不是外觀——「送出才生效」的表單選項用 Checkbox，
設定頁那種切下去就儲存的用 Switch。因此 Switch 刻意沒有「已改動未送出」
的琥珀態：立即生效的控制項不存在未送出狀態（ADR-0002 的保留色也就用不上）。

必須配可見的文字標籤（\`<Label htmlFor>\`）：開／關語意不靠位置與顏色單獨傳達，
標籤同時擴大點擊面積（軌道本身只有 20px 高）。`,methods:[]};const X=o.forwardRef(({className:s,...t},r)=>e.jsx("textarea",{className:Z("flex min-h-16 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors duration-fast placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-subtle disabled:cursor-not-allowed disabled:opacity-50",s),ref:r,...t}));X.displayName="Textarea";X.__docgenInfo={description:"多行文字輸入。樣式逐項鏡射 `Input`（邊框、聚焦環、不合格態、停用態），\n兩者排在同一張表單裡不會出現第二套質感。\n\n`resize-y` 是顯式宣告：只准直向調整，橫向會破壞表單欄寬對齊。\n高度下限 `min-h-16`（約三行）——低於這個高度的自由文字，該用 `Input`。",methods:[],displayName:"Textarea"};var Ot=Object.defineProperty,pe=(s,t)=>Ot(s,"name",{value:t,configurable:!0}),oe=!1;function ze(){const[s,t]=o.useState(oe);return o.useEffect(()=>{oe||(oe=!0,t(!0))},[]),s}pe(ze,"useIsHydrated");var Ye=ut[" useSyncExternalStore ".trim().toString()];function Qe(){return()=>{}}pe(Qe,"subscribe");function We(){return Ye(Qe,()=>!0,()=>!1)}pe(We,"useIsHydratedModern");var Dt=typeof Ye=="function"?We:ze,Vt=Object.defineProperty,D=(s,t)=>Vt(s,"name",{value:t,configurable:!0}),ae="rovingFocusGroup.onEntryFocus",Mt={bubbles:!1,cancelable:!0},ee="RovingFocusGroup",[ce,Xe,Bt]=xt(ee),[Ut,Je]=J(ee,[Bt]),[Ht,Kt]=Ut(ee),$t=o.forwardRef(D(function(t,r){return e.jsx(ce.Provider,{scope:t.__scopeRovingFocusGroup,children:e.jsx(ce.Slot,{scope:t.__scopeRovingFocusGroup,children:e.jsx(qt,{...t,ref:r})})})},"RovingFocusGroup")),qt=o.forwardRef(D(function(t,r){const{__scopeRovingFocusGroup:n,orientation:a,loop:c=!1,dir:i,currentTabStopId:u,defaultCurrentTabStopId:f,onCurrentTabStopIdChange:h,onEntryFocus:v,preventScrollOnEntryFocus:l=!1,...p}=t,g=o.useRef(null),b=O(r,g),x=He(i),[N,S]=ie({prop:u,defaultProp:f??null,onChange:h,caller:ee}),[m,d]=o.useState(!1),y=ht(v),I=Xe(n),R=o.useRef(!1),[k,E]=o.useState(0);return o.useEffect(()=>{const j=g.current;if(j)return j.addEventListener(ae,y),()=>j.removeEventListener(ae,y)},[y]),e.jsx(Ht,{scope:n,orientation:a,dir:x,loop:c,currentTabStopId:N,onItemFocus:o.useCallback(j=>S(j),[S]),onItemShiftTab:o.useCallback(()=>d(!0),[]),onFocusableItemAdd:o.useCallback(()=>E(j=>j+1),[]),onFocusableItemRemove:o.useCallback(()=>E(j=>j-1),[]),children:e.jsx(F.div,{tabIndex:m||k===0?-1:0,"data-orientation":a,...p,ref:b,style:{outline:"none",...t.style},onMouseDown:_(t.onMouseDown,()=>{R.current=!0}),onFocus:_(t.onFocus,j=>{const P=!R.current;if(j.target===j.currentTarget&&P&&!m){const G=new CustomEvent(ae,Mt);if(j.currentTarget.dispatchEvent(G),!G.defaultPrevented){const L=I().filter(A=>A.focusable),V=L.find(A=>A.active),re=L.find(A=>A.id===N),lt=[V,re,...L].filter(Boolean).map(A=>A.ref.current);me(lt,l)}}R.current=!1}),onBlur:_(t.onBlur,()=>d(!1))})})},"RovingFocusGroupImpl")),zt="RovingFocusGroupItem",Yt=o.forwardRef(D(function(t,r){const{__scopeRovingFocusGroup:n,focusable:a=!0,active:c=!1,tabStopId:i,children:u,...f}=t,h=ft(),v=i||h,l=Kt(zt,n),p=l.currentTabStopId===v,g=Xe(n),{onFocusableItemAdd:b,onFocusableItemRemove:x,currentTabStopId:N}=l,S=Dt();return vt(()=>{if(!(!S||!a))return b(),()=>x()},[S,a,b,x]),o.useEffect(()=>{if(!(S||!a))return b(),()=>x()},[S,a,b,x]),e.jsx(ce.ItemSlot,{scope:n,id:v,focusable:a,active:c,children:e.jsx(F.span,{tabIndex:p?0:-1,"data-orientation":l.orientation,...f,ref:r,onMouseDown:_(t.onMouseDown,m=>{a?l.onItemFocus(v):m.preventDefault()}),onFocus:_(t.onFocus,()=>l.onItemFocus(v)),onKeyDown:_(t.onKeyDown,m=>{if(m.key==="Tab"&&m.shiftKey){l.onItemShiftTab();return}if(m.target!==m.currentTarget)return;const d=et(m,l.orientation,l.dir);if(d!==void 0){if(m.metaKey||m.ctrlKey||m.altKey||m.shiftKey)return;m.preventDefault();let I=g().filter(R=>R.focusable).map(R=>R.ref.current);if(d==="last")I.reverse();else if(d==="prev"||d==="next"){d==="prev"&&I.reverse();const R=I.indexOf(m.currentTarget);I=l.loop?tt(I,R+1):I.slice(R+1)}setTimeout(()=>me(I))}}),children:typeof u=="function"?u({isCurrentTabStop:p,hasTabStop:N!=null}):u})})},"RovingFocusGroupItem")),Qt={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Ze(s,t){return t!=="rtl"?s:s==="ArrowLeft"?"ArrowRight":s==="ArrowRight"?"ArrowLeft":s}D(Ze,"getDirectionAwareKey");function et(s,t,r){const n=Ze(s.key,r);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(n))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(n)))return Qt[n]}D(et,"getFocusIntent");function me(s,t=!1){const r=document.activeElement;for(const n of s)if(n===r||(n.focus({preventScroll:t}),document.activeElement!==r))return}D(me,"focusFirst");function tt(s,t){return s.map((r,n)=>s[(t+n)%s.length])}D(tt,"wrapArray");var Wt=$t,Xt=Yt,Jt=Object.defineProperty,C=(s,t)=>Jt(s,"name",{value:t,configurable:!0}),nt="Radio",[Zt,rt]=J(nt),[en,te]=Zt(nt);function st(s){const{__scopeRadio:t,checked:r=!1,children:n,disabled:a,form:c,name:i,onCheck:u,required:f,value:h="on",internal_do_not_use_render:v}=s,[l,p]=o.useState(null),[g,b]=o.useState(null),x=o.useRef(!1),[N,S]=o.useReducer(y=>y+1,0),m=l?!!c||!!l.closest("form"):!0,d={checked:r,disabled:a,required:f,name:i,form:c,value:h,control:l,setControl:p,hasConsumerStoppedPropagationRef:x,userInteractionCount:N,onUserInteraction:S,isFormControl:m,bubbleInput:g,setBubbleInput:b,onCheck:C(()=>u==null?void 0:u(),"onCheck")};return e.jsx(en,{scope:t,...d,children:ot(v)?v(d):n})}C(st,"RadioProvider");var tn="RadioTrigger",nn=o.forwardRef(C(function({__scopeRadio:t,onClick:r,...n},a){const{checked:c,disabled:i,value:u,setControl:f,onCheck:h,hasConsumerStoppedPropagationRef:v,onUserInteraction:l,isFormControl:p,bubbleInput:g}=te(tn,t),b=O(a,f);return e.jsx(F.button,{type:"button",role:"radio","aria-checked":c,"data-state":fe(c),"data-disabled":i?"":void 0,disabled:i,value:u,...n,ref:b,onClick:_(r,x=>{c||(l(),h()),g&&p&&(v.current=x.isPropagationStopped(),v.current||x.stopPropagation())})})},"RadioTrigger")),rn="RadioIndicator",sn=o.forwardRef(C(function(t,r){const{__scopeRadio:n,forceMount:a,...c}=t,i=te(rn,n);return e.jsx(bt,{present:a||i.checked,children:e.jsx(F.span,{"data-state":fe(i.checked),"data-disabled":i.disabled?"":void 0,...c,ref:r})})},"RadioIndicator")),on="RadioBubbleInput",an=o.forwardRef(C(function({__scopeRadio:t,onClick:r,...n},a){const{control:c,checked:i,required:u,disabled:f,name:h,value:v,form:l,bubbleInput:p,setBubbleInput:g,hasConsumerStoppedPropagationRef:b,userInteractionCount:x}=te(on,t),N=O(a,g),S=Ue(c),m=o.useRef(!1),d=o.useRef(i),y=o.useRef(x);o.useEffect(()=>{const R=p;if(!R)return;const k=window.HTMLInputElement.prototype,j=Object.getOwnPropertyDescriptor(k,"checked").set,P=x!==y.current;y.current=x;const G=d.current!==i;d.current=i;const L=!(P&&b.current);if(G&&j){m.current=!P;const V=new Event("click",{bubbles:L});j.call(R,i),R.dispatchEvent(V),m.current=!1}},[p,i,b,x]);const I=o.useRef(i);return e.jsx(F.input,{type:"radio","aria-hidden":!0,defaultChecked:I.current,required:u,disabled:f,name:h,value:v,form:l,...n,tabIndex:-1,ref:N,onClick:_(r,R=>{m.current&&R.stopPropagation()}),style:{...n.style,...S,position:"absolute",pointerEvents:"none",opacity:0,margin:0,transform:"translateX(-100%)"}})},"RadioBubbleInput"));function ot(s){return typeof s=="function"}C(ot,"isFunction");function fe(s){return s?"checked":"unchecked"}C(fe,"getState");var cn=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],ve="RadioGroup",[dn,Dn]=J(ve,[Je,rt]),at=Je(),ne=rt(),[ln,un]=dn(ve),ct=o.forwardRef(C(function(t,r){const{__scopeRadioGroup:n,name:a,form:c,defaultValue:i,value:u,required:f=!1,disabled:h=!1,orientation:v,dir:l,loop:p=!0,onValueChange:g,...b}=t,x=at(n),N=He(l),[S,m]=ie({prop:u,defaultProp:i??null,onChange:g,caller:ve}),[d,y]=o.useState(null),I=O(r,y),R=o.useRef(S);return o.useEffect(()=>{const k=c?d==null?void 0:d.ownerDocument.getElementById(c):d==null?void 0:d.closest("form");if(k instanceof HTMLFormElement){const E=C(()=>m(R.current),"reset");return k.addEventListener("reset",E),()=>k.removeEventListener("reset",E)}},[d,c,m]),e.jsx(ln,{scope:n,name:a,form:c,required:f,disabled:h,value:S,onValueChange:m,children:e.jsx(Wt,{asChild:!0,...x,orientation:v,dir:N,loop:p,children:e.jsx(F.div,{role:"radiogroup","aria-required":f,"aria-orientation":v,"data-disabled":h?"":void 0,dir:N,...b,ref:I})})})},"RadioGroup")),pn="RadioGroupItemProvider",mn="RadioGroupItemTrigger";function it(s){const{__scopeRadioGroup:t,value:r,disabled:n,children:a,internal_do_not_use_render:c}=s,i=un(pn,t),u=ne(t),f=i.disabled||n;return e.jsx(st,{...u,checked:i.value===r,disabled:f,required:i.required,name:i.name,form:i.form,value:r,onCheck:()=>i.onValueChange(r),internal_do_not_use_render:c,children:a})}C(it,"RadioGroupItemProvider");var fn=o.forwardRef(C(function(t,r){const{__scopeRadioGroup:n,...a}=t,c=at(n),i=ne(n),{checked:u,disabled:f}=te(mn,i.__scopeRadio),h=o.useRef(null),v=O(r,h),l=o.useRef(!1);return o.useEffect(()=>{const p=C(b=>{cn.includes(b.key)&&(l.current=!0)},"handleKeyDown"),g=C(()=>l.current=!1,"handleKeyUp");return document.addEventListener("keydown",p),document.addEventListener("keyup",g),()=>{document.removeEventListener("keydown",p),document.removeEventListener("keyup",g)}},[]),e.jsx(Xt,{asChild:!0,...c,focusable:!f,active:u,children:e.jsx(nn,{...i,...a,ref:v,onKeyDown:_(a.onKeyDown,p=>{p.key==="Enter"&&p.preventDefault()}),onFocus:_(a.onFocus,()=>{var p;l.current&&((p=h.current)==null||p.click())})})})},"RadioGroupItemTrigger")),dt=o.forwardRef(C(function(t,r){const{__scopeRadioGroup:n,value:a,disabled:c,...i}=t;return e.jsx(it,{__scopeRadioGroup:n,value:a,disabled:c,internal_do_not_use_render:({isFormControl:u})=>e.jsxs(e.Fragment,{children:[e.jsx(fn,{...i,ref:r,__scopeRadioGroup:n}),u&&e.jsx(vn,{__scopeRadioGroup:n})]})})},"RadioGroupItem")),vn=o.forwardRef(C(function(t,r){const{__scopeRadioGroup:n,...a}=t,c=ne(n);return e.jsx(an,{...c,...a,ref:r})},"RadioGroupItemBubbleInput")),hn=o.forwardRef(C(function(t,r){const{__scopeRadioGroup:n,...a}=t,c=ne(n);return e.jsx(sn,{...c,...a,ref:r})},"RadioGroupIndicator"));const he=o.forwardRef(({className:s,...t},r)=>e.jsx(ct,{ref:r,className:Z("grid gap-2",s),...t}));he.displayName=ct.displayName;const be=o.forwardRef(({className:s,...t},r)=>e.jsx(dt,{ref:r,className:Z("aspect-square size-4 shrink-0 rounded-full border border-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50",s),...t,children:e.jsx(hn,{className:"flex items-center justify-center",children:e.jsx(Ct,{className:"size-2.5 fill-primary text-primary","aria-hidden":!0})})}));be.displayName=dt.displayName;he.__docgenInfo={description:"單選群（垂直）。選項標籤長、或每個選項需要一行說明時用這個；\n選項 2–5 個且標籤短到能橫排一眼看完，用 `SegGroup`；\n超過 5 個或選項動態增減，用 `Select`；\n在「唯讀 ↔ 編輯」的欄位語境裡，用 `EditableField` 的 `radio` 型態。\n\n鍵盤與焦點行為（roving tabindex、方向鍵移動）由 Radix 提供，\n與 `SegGroup` 的手刻版本一致：整組只佔一個 Tab 停留點。",methods:[]};be.__docgenInfo={description:`單選項圓鈕。選中同時「填實心點」——形狀變化不只靠顏色，
灰階列印與色覺障礙下仍分得出選了哪個。`,methods:[]};const Vn={title:"元件/表單/輸入控制項"},U={render:function(){const[t,r]=o.useState(120);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"s-name",children:"單位名稱"}),e.jsx(M,{id:"s-name",defaultValue:"遠東貿易股份有限公司"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"s-code",children:"單位代號"}),e.jsx(M,{id:"s-code",placeholder:"例：C-1042"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"s-locked",children:"建立日期"}),e.jsx(M,{id:"s-locked",defaultValue:"2019-04-01",disabled:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{children:"訂購數量"}),e.jsx(pt,{value:t,onChange:r,min:0,step:10,"aria-label":"訂購數量"}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"數值輸入固定右對齊＋等寬數字，底色＝「可編輯」語意。"})]})]})}},H={render:function(){const[t,r]=o.useState(!0);return e.jsxs("div",{className:"max-w-xl space-y-5",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["一格欄位可以",e.jsx("strong",{children:"同時"}),"是「被聚焦」「改過沒送」「不合格」。三件事走三個不同的通道， 疊起來互不干涉——",e.jsx("strong",{children:"聚焦環永遠是同一個顏色"}),"，邊框與底色管狀態。"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"f-ro",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border border-transparent px-3 py-2 text-sm",children:"1,380,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"f-ok",children:"可編輯（優先序 0）"}),e.jsx(M,{id:"f-ok",defaultValue:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"f-edit",children:"已改動未送出（優先序 1）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"f-bad",children:"不合格（優先序 2，最高）"}),e.jsx(M,{id:"f-bad",defaultValue:"0","aria-invalid":t,"aria-describedby":"f-bad-err",onChange:n=>r(n.target.value==="0")}),t&&e.jsx("p",{id:"f-bad-err",className:"text-tiny text-danger",children:"數值必須大於 0。改成別的值就會恢復。"})]})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["用 Tab 鍵走過上面四格，注意",e.jsx("strong",{children:"聚焦環不隨狀態變色"}),"。 若環會跟著變紅，Tab 過三個必填空欄時每一格都會閃紅——那會訓練使用者忽略紅色。 環與邊框之間有一圈背景色（",e.jsx("code",{children:"ring-offset"}),"）：少了它，環會直接畫在紅框上， 實測深色模式下兩者對比只有 ",e.jsx("strong",{children:"1.04:1"}),"，聚焦環等於隱形。"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["「",e.jsx("strong",{children:"必填未填"}),"」是不合格的一種，但它的問題是",e.jsx("strong",{children:"時機"}),"不是顏色—— 不該在使用者還沒碰過欄位時就標紅。慣例是 blur 或送出之後才標。"]})]})}},K={render:function(){const[t,r]=o.useState(!0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(mt,{id:"s-active",checked:t,onCheckedChange:n=>r(n===!0)}),e.jsx(w,{htmlFor:"s-active",children:"啟用此單位"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{children:"等級"}),e.jsxs(gt,{defaultValue:"gold",children:[e.jsx(Rt,{children:e.jsx(yt,{})}),e.jsx(St,{children:W.map(n=>e.jsx(It,{value:n.value,children:n.label},n.value))})]})]})]})}},$={render:function(){const[t,r]=o.useState("gold"),[n]=o.useState("silver");return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"選項少、標籤短、要一眼看完 → 分段選擇"}),e.jsx(se,{label:"等級",options:W,value:t,onPick:r})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"已改動未送出（琥珀）"}),e.jsx(se,{label:"等級（已改動）",options:W,value:t,onPick:r,changed:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"鎖定：可聚焦、有鎖頭、hover 有原因"}),e.jsx(se,{label:"等級（鎖定）",options:W,value:n,onPick:()=>{},disabled:!0,lockHint:"此筆已結案，需先解除鎖定"})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"鍵盤：方向鍵移動、Space/Enter 選定、Esc 取消。整組只佔一個 Tab 停留點。"})]})}},q={render:function(){const[t,r]=o.useState(!0),[n,a]=o.useState(!1);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(w,{htmlFor:"sw-save",children:"自動儲存"}),e.jsx(B,{id:"sw-save",checked:t,onCheckedChange:r})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(w,{htmlFor:"sw-dense",children:"密集列表"}),e.jsx(B,{id:"sw-dense",checked:n,onCheckedChange:a})]}),e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(w,{htmlFor:"sw-locked",className:"opacity-60",children:"週報寄送（由管理端統一設定）"}),e.jsx(B,{id:"sw-locked",checked:!0,disabled:!0})]}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:["開關＝",e.jsx("strong",{children:"切了立即生效"}),"（設定頁）；「送出才生效」的表單選項用 Checkbox。 所以開關沒有「已改動未送出」的琥珀態——立即生效的控制項不存在未送出狀態。"]})]})}},z={render:function(){const[t,r]=o.useState(""),n=t.length>200;return e.jsxs("div",{className:"max-w-xl space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"ta-note",children:"備註"}),e.jsx(X,{id:"ta-note",placeholder:"補充說明（選填）",value:t,onChange:a=>r(a.target.value),rows:3,"aria-invalid":n||void 0,"aria-describedby":n?"ta-err":void 0}),n&&e.jsxs("p",{id:"ta-err",className:"text-tiny text-danger",children:["超過 200 字上限（目前 ",t.length," 字）。"]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(w,{htmlFor:"ta-ro",children:"結案原因（停用示意）"}),e.jsx(X,{id:"ta-ro",defaultValue:"重複建立，已併入既有紀錄。",disabled:!0})]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"與 Input 同一套邊框／聚焦環／不合格態；只准直向調整大小（resize-y）， 橫向拉寬會破壞表單欄寬對齊。"})]})}},Y={render:function(){const[t,r]=o.useState("all");return e.jsxs("div",{className:"max-w-md space-y-3",children:[e.jsx(he,{value:t,onValueChange:r,"aria-label":"通知範圍",children:[{value:"all",label:"全部動態",hint:"每一筆變更都通知"},{value:"important",label:"重要事項",hint:"只有需要動作的才通知"},{value:"none",label:"暫停通知",hint:"改到站內清單自行查看"}].map(n=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(be,{value:n.value,id:`rg-${n.value}`,className:"mt-0.5"}),e.jsxs(w,{htmlFor:`rg-${n.value}`,className:"font-normal",children:[e.jsx("span",{className:"block text-sm",children:n.label}),e.jsx("span",{className:"block text-tiny text-muted-foreground",children:n.hint})]})]},n.value))}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"選項長或含說明 → 單選群（垂直）；2–5 個短標籤 → 分段選擇； 超過 5 個或選項動態增減 → 下拉。整組只佔一個 Tab 停留點，方向鍵移動。"})]})}},Q={render:function(){const[t,r]=o.useState(["web","phone"]);return e.jsxs("div",{className:"max-w-md space-y-2",children:[e.jsx(jt,{label:"下單管道",options:wt,selected:t,onToggle:n=>r(a=>a.includes(n)?a.filter(c=>c!==n):[...a,n])}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。"})]})}};var xe,ge,Re;U.parameters={...U.parameters,docs:{...(xe=U.parameters)==null?void 0:xe.docs,source:{originalSource:`{
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
}`,...(Re=(ge=U.parameters)==null?void 0:ge.docs)==null?void 0:Re.source}}};var ye,Se,Ie;H.parameters={...H.parameters,docs:{...(ye=H.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Ie=(Se=H.parameters)==null?void 0:Se.docs)==null?void 0:Ie.source}}};var Ne,je,we;K.parameters={...K.parameters,docs:{...(Ne=K.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
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
}`,...(we=(je=K.parameters)==null?void 0:je.docs)==null?void 0:we.source}}};var Ce,ke,_e;$.parameters={...$.parameters,docs:{...(Ce=$.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
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
}`,...(_e=(ke=$.parameters)==null?void 0:ke.docs)==null?void 0:_e.source}}};var Fe,Ee,Te;q.parameters={...q.parameters,docs:{...(Fe=q.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
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
  }
}`,...(Te=(Ee=q.parameters)==null?void 0:Ee.docs)==null?void 0:Te.source}}};var Pe,Ge,Le;z.parameters={...z.parameters,docs:{...(Pe=z.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
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
}`,...(Le=(Ge=z.parameters)==null?void 0:Ge.docs)==null?void 0:Le.source}}};var Ae,Oe,De;Y.parameters={...Y.parameters,docs:{...(Ae=Y.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
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
}`,...(De=(Oe=Y.parameters)==null?void 0:Oe.docs)==null?void 0:De.source}}};var Ve,Me,Be;Q.parameters={...Q.parameters,docs:{...(Ve=Q.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["web", "phone"]);
    return <div className="max-w-md space-y-2">
        <Chips label="下單管道" options={CHANNEL_OPTIONS} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} />
        <p className="text-tiny text-muted-foreground">
          已選與未選同時看得見——多選下拉「選完就看不見選了什麼」是後台最常見的抱怨。
        </p>
      </div>;
  }
}`,...(Be=(Me=Q.parameters)==null?void 0:Me.docs)==null?void 0:Be.source}}};const Mn=["文字與數值","欄位狀態","勾選與下拉","分段選擇","開關","長文輸入","單選群","多選標籤片"];export{Mn as __namedExportsOrder,Vn as default,$ as 分段選擇,K as 勾選與下拉,Y as 單選群,Q as 多選標籤片,U as 文字與數值,H as 欄位狀態,z as 長文輸入,q as 開關};
