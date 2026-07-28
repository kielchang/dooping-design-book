import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./button-CBB3RNBY.js";import{B as n}from"./badge-vlz8DnLC.js";import{c as o}from"./utils-C1k7i5aj.js";import{c as r}from"./createLucideIcon-DDRU598s.js";import{C as q,a as A,b as I,d as L,c as P,e as E}from"./card-CgeNeVVA.js";import{P as H}from"./plus-CK8V5P7p.js";import"./index-BFQ_Q9OP.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=r("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=r("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=r("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=r("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=r("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=r("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),W={success:{wrap:"border-success/30 bg-success/10",color:"text-success",icon:S},warning:{wrap:"border-warning/40 bg-warning/10",color:"text-warning",icon:V},info:{wrap:"border-info/30 bg-info/10",color:"text-info",icon:_},danger:{wrap:"border-danger/30 bg-danger/10",color:"text-danger",icon:R}};function s({variant:b,title:k,tag:m,icon:T,children:x,className:z}){const t=W[b],M=T??t.icon;return e.jsxs("div",{className:o("flex items-start gap-2.5 rounded-md border p-3",t.wrap,z),children:[e.jsx(M,{className:o("mt-0.5 size-4 shrink-0",t.color),"aria-hidden":!0}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("p",{className:o("text-sm font-semibold",t.color),children:[m&&e.jsx("span",{className:"mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium",children:m}),k]}),x&&e.jsx("div",{className:"mt-0.5 text-xs leading-relaxed text-muted-foreground",children:x})]})]})}s.__docgenInfo={description:`狀態提示框（良好／警示／提醒／危險）。

走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
因此「這是什麼等級的訊息」不是只靠顏色傳達。`,methods:[],displayName:"Callout",props:{variant:{required:!0,tsType:{name:"union",raw:'"success" | "warning" | "info" | "danger"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"info"'},{name:"literal",value:'"danger"'}]},description:""},title:{required:!0,tsType:{name:"ReactNode"},description:""},tag:{required:!1,tsType:{name:"string"},description:"短標籤（如規則代號、分類），顯示在標題前"},icon:{required:!1,tsType:{name:"LucideIcon"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const Z={title:"元件/基礎/按鈕・徽章・提示・卡片"},i={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{children:"主要動作"}),e.jsx(a,{variant:"secondary",children:"次要動作"}),e.jsx(a,{variant:"outline",children:"外框"}),e.jsx(a,{variant:"ghost",children:"淡化"}),e.jsx(a,{variant:"link",children:"連結樣式"}),e.jsxs(a,{variant:"destructive",children:[e.jsx(F,{})," 刪除訂單"]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{size:"sm",children:"小"}),e.jsx(a,{children:"預設"}),e.jsx(a,{size:"lg",children:"大"}),e.jsx(a,{size:"icon","aria-label":"新增",children:e.jsx(H,{})})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{disabled:!0,children:"停用"}),e.jsxs(a,{disabled:!0,children:[e.jsx(D,{className:"animate-spin"})," 處理中…"]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。 多一個 variant 只會讓人猶豫該用哪個。"})]})},d={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{children:"預設"}),e.jsx(n,{variant:"secondary",children:"次要"}),e.jsx(n,{variant:"outline",children:"外框"})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{variant:"success",children:"已出貨"}),e.jsx(n,{variant:"warning",children:"待補件"}),e.jsx(n,{variant:"info",children:"審核中"}),e.jsx(n,{variant:"danger",children:"已退回"}),e.jsx(n,{variant:"edit",children:"已改動未送出"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。"})]})},c={render:()=>e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx(s,{variant:"success",title:"這批訂單已全部出貨",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(s,{variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個客戶。"}),e.jsx(s,{variant:"warning",title:"有 3 筆訂單缺少收件資訊",children:"未填寫前無法排程出貨。"}),e.jsx(s,{variant:"danger",title:"庫存不足，無法確認訂單",tag:"E-104",children:"品項「伺服馬達 750W」可用量 2，需求 6。"})]})},l={render:()=>e.jsxs(q,{className:"max-w-sm",children:[e.jsxs(A,{children:[e.jsx(I,{children:"本月訂單"}),e.jsx(L,{children:"2024 年 2 月，截至今日"})]}),e.jsx(P,{className:"text-3xl font-semibold tabular-nums",children:"1,284"}),e.jsxs(E,{className:"gap-2",children:[e.jsx(a,{size:"sm",children:"查看明細"}),e.jsx(a,{size:"sm",variant:"outline",children:"匯出"})]})]})};var u,p,g;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要動作</Button>
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除訂單</Button>
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
}`,...(g=(p=i.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var v,h,f;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>預設</Badge>
        <Badge variant="secondary">次要</Badge>
        <Badge variant="outline">外框</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">已出貨</Badge>
        <Badge variant="warning">待補件</Badge>
        <Badge variant="info">審核中</Badge>
        <Badge variant="danger">已退回</Badge>
        <Badge variant="edit">已改動未送出</Badge>
      </div>
      <p className="text-xs text-muted-foreground">徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。</p>
    </div>
}`,...(f=(h=d.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var j,B,y;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="max-w-xl space-y-2">
      <Callout variant="success" title="這批訂單已全部出貨">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
      <Callout variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個客戶。</Callout>
      <Callout variant="warning" title="有 3 筆訂單缺少收件資訊">未填寫前無法排程出貨。</Callout>
      <Callout variant="danger" title="庫存不足，無法確認訂單" tag="E-104">品項「伺服馬達 750W」可用量 2，需求 6。</Callout>
    </div>
}`,...(y=(B=c.parameters)==null?void 0:B.docs)==null?void 0:y.source}}};var C,N,w;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>本月訂單</CardTitle>
        <CardDescription>2024 年 2 月，截至今日</CardDescription>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tabular-nums">1,284</CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">查看明細</Button>
        <Button size="sm" variant="outline">匯出</Button>
      </CardFooter>
    </Card>
}`,...(w=(N=l.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};const $=["按鈕","徽章","提示框","卡片"];export{$ as __namedExportsOrder,Z as default,l as 卡片,d as 徽章,i as 按鈕,c as 提示框};
