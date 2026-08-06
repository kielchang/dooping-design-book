import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as o}from"./utils-pm6Xa0Qd.js";import{c as r}from"./createLucideIcon-DDRU598s.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=r("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=r("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=r("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=r("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),h={success:p,warning:b,info:f,danger:m},x={success:"border-success/30 bg-success-subtle text-success-subtle-foreground",warning:"border-warning/30 bg-warning-subtle text-warning-subtle-foreground",info:"border-info/30 bg-info-subtle text-info-subtle-foreground",danger:"border-danger/30 bg-danger-subtle text-danger-subtle-foreground"},y={success:"border-transparent bg-success text-success-foreground",warning:"border-transparent bg-warning text-warning-foreground",info:"border-transparent bg-info text-info-foreground",danger:"border-transparent bg-danger text-danger-foreground"};function w({variant:n,intensity:l="low",live:t=!1,title:d,tag:s,icon:c,children:a,className:u}){const g=c??h[n],i=l==="high";return e.jsxs("div",{className:o("flex items-start gap-2.5 rounded-md border p-3",i?y[n]:o(x[n],"border-l-4 border-l-current"),u),role:t?"alert":"note","aria-live":t?i?"assertive":"polite":void 0,children:[e.jsx(g,{className:"mt-0.5 size-4 shrink-0","aria-hidden":!0}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("p",{className:"text-sm font-semibold",children:[s&&e.jsx("span",{className:"mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium",children:s}),d]}),a&&e.jsx("div",{className:"mt-0.5 text-xs leading-relaxed opacity-90",children:a})]})]})}w.__docgenInfo={description:`狀態提示框（良好／警示／提醒／危險）。

走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
因此「這是什麼等級的訊息」不是只靠顏色傳達。`,methods:[],displayName:"Callout",props:{variant:{required:!0,tsType:{name:"union",raw:'"success" | "warning" | "info" | "danger"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"info"'},{name:"literal",value:'"danger"'}]},description:""},intensity:{required:!1,tsType:{name:"union",raw:'"low" | "high"',elements:[{name:"literal",value:'"low"'},{name:"literal",value:'"high"'}]},description:"視覺強度。預設 `low`；`high` 只給阻斷式訊息。",defaultValue:{value:'"low"',computed:!1}},live:{required:!1,tsType:{name:"boolean"},description:"這則訊息是「操作之後才出現」的嗎？\n\n預設 `false`＝靜態旁註，讀屏照文件順序讀到才念。\n設 `true` 才成為 live region 即時播報（`high` 用 assertive、`low` 用 polite）。\n靜態內容誤設 true 會讓讀屏在載入時把整頁提示框念一遍。",defaultValue:{value:"false",computed:!1}},title:{required:!0,tsType:{name:"ReactNode"},description:""},tag:{required:!1,tsType:{name:"string"},description:"短標籤（如規則代號、分類），顯示在標題前"},icon:{required:!1,tsType:{name:"LucideIcon"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};export{w as C};
