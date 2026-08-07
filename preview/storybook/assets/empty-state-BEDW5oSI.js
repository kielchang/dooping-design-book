import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as o}from"./utils-pm6Xa0Qd.js";import{c}from"./createLucideIcon-BcR0bl2m.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=c("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);function d({icon:a,title:r,hint:t,action:s,className:i,compact:n=!1}){return e.jsxs("div",{className:o("flex flex-col items-center justify-center text-center",n?"py-6":"py-10",i),children:[e.jsx("div",{className:"mb-2 text-muted-foreground/60",children:a??e.jsx(m,{className:"size-7"})}),e.jsx("p",{className:"text-sm font-medium",children:r}),t&&e.jsx("p",{className:"mt-0.5 max-w-sm text-xs text-muted-foreground",children:t}),s&&e.jsx("div",{className:"mt-3",children:s})]})}d.__docgenInfo={description:`空狀態。

三種空是不一樣的，文案必須分開：**還沒有資料**（引導建立）、
**篩選後沒有結果**（引導放寬條件）、**沒有權限看**（說明原因）。
全部塞同一句「查無資料」是最常見、也最讓人卡住的偷懶做法。`,methods:[],displayName:"EmptyState",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},title:{required:!0,tsType:{name:"string"},description:""},hint:{required:!1,tsType:{name:"string"},description:"說明「為什麼是空的」或「下一步該做什麼」——只寫「無資料」等於沒說。"},action:{required:!1,tsType:{name:"ReactNode"},description:"行動呼籲（新增第一筆、清除篩選…）"},className:{required:!1,tsType:{name:"string"},description:""},compact:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};export{d as E};
