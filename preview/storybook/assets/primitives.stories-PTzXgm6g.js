import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./button-DgLj-b9x.js";import{B as r}from"./badge-sd53XUNE.js";import{c as p}from"./utils-C1k7i5aj.js";import{c as n}from"./createLucideIcon-DDRU598s.js";import{C as L,a as A,b as H,d as P,c as E,e as S}from"./card-CgeNeVVA.js";import{P as V}from"./plus-CK8V5P7p.js";import"./index-BFQ_Q9OP.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=n("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=n("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=n("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=n("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=n("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=n("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),W={success:D,warning:G,info:F,danger:_},J={success:"border-success/30 border-l-success bg-success-subtle text-success-subtle-foreground",warning:"border-warning/40 border-l-warning bg-warning-subtle text-warning-subtle-foreground",info:"border-info/30 border-l-info bg-info-subtle text-info-subtle-foreground",danger:"border-danger/30 border-l-danger bg-danger-subtle text-danger-subtle-foreground"},K={success:"border-transparent bg-success text-success-foreground",warning:"border-transparent bg-warning text-warning-foreground",info:"border-transparent bg-info text-info-foreground",danger:"border-transparent bg-danger text-danger-foreground"};function s({variant:o,intensity:T="low",live:c=!1,title:z,tag:u,icon:q,children:m,className:M}){const I=q??W[o],x=T==="high";return e.jsxs("div",{className:p("flex items-start gap-2.5 rounded-md border p-3",x?K[o]:p(J[o],"border-l-4"),M),role:c?"alert":"note","aria-live":c?x?"assertive":"polite":void 0,children:[e.jsx(I,{className:"mt-0.5 size-4 shrink-0","aria-hidden":!0}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("p",{className:"text-sm font-semibold",children:[u&&e.jsx("span",{className:"mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium",children:u}),z]}),m&&e.jsx("div",{className:"mt-0.5 text-xs leading-relaxed opacity-90",children:m})]})]})}s.__docgenInfo={description:`狀態提示框（良好／警示／提醒／危險）。

走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
因此「這是什麼等級的訊息」不是只靠顏色傳達。`,methods:[],displayName:"Callout",props:{variant:{required:!0,tsType:{name:"union",raw:'"success" | "warning" | "info" | "danger"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"info"'},{name:"literal",value:'"danger"'}]},description:""},intensity:{required:!1,tsType:{name:"union",raw:'"low" | "high"',elements:[{name:"literal",value:'"low"'},{name:"literal",value:'"high"'}]},description:"視覺強度。預設 `low`；`high` 只給阻斷式訊息。",defaultValue:{value:'"low"',computed:!1}},live:{required:!1,tsType:{name:"boolean"},description:"這則訊息是「操作之後才出現」的嗎？\n\n預設 `false`＝靜態旁註，讀屏照文件順序讀到才念。\n設 `true` 才成為 live region 即時播報（`high` 用 assertive、`low` 用 polite）。\n靜態內容誤設 true 會讓讀屏在載入時把整頁提示框念一遍。",defaultValue:{value:"false",computed:!1}},title:{required:!0,tsType:{name:"ReactNode"},description:""},tag:{required:!1,tsType:{name:"string"},description:"短標籤（如規則代號、分類），顯示在標題前"},icon:{required:!1,tsType:{name:"LucideIcon"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const re={title:"元件/基礎/按鈕・徽章・提示・卡片"},t={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{children:"主要動作"}),e.jsx(a,{variant:"secondary",children:"次要動作"}),e.jsx(a,{variant:"outline",children:"外框"}),e.jsx(a,{variant:"ghost",children:"淡化"}),e.jsx(a,{variant:"link",children:"連結樣式"}),e.jsxs(a,{variant:"destructive",children:[e.jsx(R,{})," 刪除這筆"]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{size:"sm",children:"小"}),e.jsx(a,{children:"預設"}),e.jsx(a,{size:"lg",children:"大"}),e.jsx(a,{size:"icon","aria-label":"新增",children:e.jsx(V,{})})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{disabled:!0,children:"停用"}),e.jsxs(a,{disabled:!0,children:[e.jsx(O,{className:"animate-spin"})," 處理中…"]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。 多一個 variant 只會讓人猶豫該用哪個。"})]})},i={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(r,{children:"預設"}),e.jsx(r,{variant:"secondary",children:"次要"}),e.jsx(r,{variant:"outline",children:"外框"})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(r,{variant:"success",children:"已完成"}),e.jsx(r,{variant:"warning",children:"待補件"}),e.jsx(r,{variant:"info",children:"審核中"}),e.jsx(r,{variant:"danger",children:"已退回"}),e.jsx(r,{variant:"edit",children:"已改動未送出"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。"})]})},d={render:()=>e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx(s,{variant:"success",title:"這批資料已全部完成",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(s,{variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個單位。"}),e.jsx(s,{variant:"warning",title:"有 3 筆缺少必要資訊",children:"未填寫前無法進入下一步。"}),e.jsx(s,{variant:"danger",title:"配額不足，無法確認",tag:"E-104",children:"項目「丙案 初版」可用量 2，需求 6。"})]})},l={render:()=>e.jsxs(L,{className:"max-w-sm",children:[e.jsxs(A,{children:[e.jsx(H,{children:"本月資料"}),e.jsx(P,{children:"2024 年 2 月，截至今日"})]}),e.jsx(E,{className:"text-3xl font-semibold tabular-nums",children:"1,284"}),e.jsxs(S,{className:"gap-2",children:[e.jsx(a,{size:"sm",children:"查看明細"}),e.jsx(a,{size:"sm",variant:"outline",children:"匯出"})]})]})};var g,h,v;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要動作</Button>
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除這筆</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">小</Button>
        <Button>預設</Button>
        <Button size="lg">大</Button>
        <Button size="icon" aria-label="新增"><Plus /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>停用</Button>
        <Button disabled><Loader2 className="animate-spin" /> 處理中…</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。
        多一個 variant 只會讓人猶豫該用哪個。
      </p>
    </div>
}`,...(v=(h=t.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var f,j,b;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>預設</Badge>
        <Badge variant="secondary">次要</Badge>
        <Badge variant="outline">外框</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">已完成</Badge>
        <Badge variant="warning">待補件</Badge>
        <Badge variant="info">審核中</Badge>
        <Badge variant="danger">已退回</Badge>
        <Badge variant="edit">已改動未送出</Badge>
      </div>
      <p className="text-xs text-muted-foreground">徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。</p>
    </div>
}`,...(b=(j=i.parameters)==null?void 0:j.docs)==null?void 0:b.source}}};var y,B,w;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="max-w-xl space-y-2">
      <Callout variant="success" title="這批資料已全部完成">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
      <Callout variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個單位。</Callout>
      <Callout variant="warning" title="有 3 筆缺少必要資訊">未填寫前無法進入下一步。</Callout>
      <Callout variant="danger" title="配額不足，無法確認" tag="E-104">項目「丙案 初版」可用量 2，需求 6。</Callout>
    </div>
}`,...(w=(B=d.parameters)==null?void 0:B.docs)==null?void 0:w.source}}};var C,N,k;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>本月資料</CardTitle>
        <CardDescription>2024 年 2 月，截至今日</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tabular-nums">1,284</CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">查看明細</Button>
        <Button size="sm" variant="outline">匯出</Button>
      </CardFooter>
    </Card>
}`,...(k=(N=l.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};const ne=["按鈕","徽章","提示框","卡片"];export{ne as __namedExportsOrder,re as default,l as 卡片,i as 徽章,t as 按鈕,d as 提示框};
