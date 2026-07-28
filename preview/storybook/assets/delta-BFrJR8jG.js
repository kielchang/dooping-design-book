import{c as u}from"./createLucideIcon-DDRU598s.js";import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as d,d as f}from"./utils-C1k7i5aj.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=u("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=u("PackageOpen",[["path",{d:"M12 22v-9",key:"x3hkom"}],["path",{d:"M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",key:"2ntwy6"}],["path",{d:"M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",key:"1pmm1c"}],["path",{d:"M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",key:"12ttoo"}]]);function x({icon:t,title:i,hint:a,action:n,className:s,compact:o=!1}){return e.jsxs("div",{className:d("flex flex-col items-center justify-center text-center",o?"py-6":"py-10",s),children:[e.jsx("div",{className:"mb-2 text-muted-foreground/60",children:t??e.jsx(g,{className:"size-7"})}),e.jsx("p",{className:"text-sm font-medium",children:i}),a&&e.jsx("p",{className:"mt-0.5 max-w-sm text-xs text-muted-foreground",children:a}),n&&e.jsx("div",{className:"mt-3",children:n})]})}x.__docgenInfo={description:`空狀態。

三種空是不一樣的，文案必須分開：**還沒有資料**（引導建立）、
**篩選後沒有結果**（引導放寬條件）、**沒有權限看**（說明原因）。
全部塞同一句「查無資料」是最常見、也最讓人卡住的偷懶做法。`,methods:[],displayName:"EmptyState",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},hint:{required:!1,tsType:{name:"string"},description:"說明「為什麼是空的」或「下一步該做什麼」——只寫「無資料」等於沒說。"},action:{required:!1,tsType:{name:"ReactNode"},description:"行動呼籲（新增第一筆、清除篩選…）"},className:{required:!1,tsType:{name:"string"},description:""},compact:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function y({value:t,goodWhen:i="positive",posLabel:a="",negLabel:n="",format:s=f,zeroLabel:o="持平",className:m}){if(t===0)return e.jsxs("span",{className:d("tabular-nums text-muted-foreground",m),children:["— ",o]});const r=t>0,c=i==="positive"?r:!r,p=r?"▲":"▼",l=r?a:n;return e.jsxs("span",{className:d("inline-flex items-center gap-0.5 tabular-nums",c?"text-success":"text-danger",m),title:`${l}${s(Math.abs(t))}`,children:[e.jsx("span",{"aria-hidden":!0,children:p}),l&&e.jsx("span",{children:l}),s(Math.abs(t))]})}y.__docgenInfo={description:`變異顯示。

三重編碼：**箭頭符號 ▲▼ ＋ 文字 ＋ 顏色**。顏色是三者中最弱的一環——
8% 的男性有紅綠色覺障礙，而後台報表幾乎一定會被灰階列印出來簽核。
因此箭頭與文字必須自己就能把話說完，顏色只是加速。`,methods:[],displayName:"Delta",props:{value:{required:!0,tsType:{name:"number"},description:""},goodWhen:{required:!1,tsType:{name:"union",raw:'"positive" | "negative"',elements:[{name:"literal",value:'"positive"'},{name:"literal",value:'"negative"'}]},description:`哪個方向算「好」。差異數字的好壞是**業務決定**、不是數學決定：
「庫存差異 +100」可能是好（備料充足）也可能是壞（積壓），元件不猜。`,defaultValue:{value:'"positive"',computed:!1}},posLabel:{required:!1,tsType:{name:"string"},description:"正值前綴文字（如「超出」「增加」）",defaultValue:{value:'""',computed:!1}},negLabel:{required:!1,tsType:{name:"string"},description:"負值前綴文字（如「短少」「減少」）",defaultValue:{value:'""',computed:!1}},format:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:`function formatNumber(n: number, locale = "en-US"): string {
  if (!Number.isFinite(n)) return String(n);
  return n.toLocaleString(locale, { maximumFractionDigits: 10 });
}`,computed:!1}},zeroLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"持平"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};export{y as D,x as E,N as P};
