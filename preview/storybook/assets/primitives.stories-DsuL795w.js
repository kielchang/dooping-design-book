import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./button-DgLj-b9x.js";import{B as t}from"./badge-sd53XUNE.js";import{c as g}from"./utils-C1k7i5aj.js";import{c as s}from"./createLucideIcon-DDRU598s.js";import{C as L,a as P,b as A,d as E,c as H,e as S}from"./card-CgeNeVVA.js";import{P as V}from"./plus-CK8V5P7p.js";import"./index-BFQ_Q9OP.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=s("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=s("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=s("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=s("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=s("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=s("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),W={success:D,warning:G,info:F,danger:_},J={success:"border-success/30 border-l-success bg-success-subtle text-success-subtle-foreground",warning:"border-warning/40 border-l-warning bg-warning-subtle text-warning-subtle-foreground",info:"border-info/30 border-l-info bg-info-subtle text-info-subtle-foreground",danger:"border-danger/30 border-l-danger bg-danger-subtle text-danger-subtle-foreground"},K={success:"border-transparent bg-success text-success-foreground",warning:"border-transparent bg-warning text-warning-foreground",info:"border-transparent bg-info text-info-foreground",danger:"border-transparent bg-danger text-danger-foreground"};function n({variant:o,intensity:T="low",live:c=!1,title:z,tag:u,icon:q,children:x,className:I}){const M=q??W[o],m=T==="high";return e.jsxs("div",{className:g("flex items-start gap-2.5 rounded-md border p-3",m?K[o]:g(J[o],"border-l-4"),I),role:c?"alert":"note","aria-live":c?m?"assertive":"polite":void 0,children:[e.jsx(M,{className:"mt-0.5 size-4 shrink-0","aria-hidden":!0}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("p",{className:"text-sm font-semibold",children:[u&&e.jsx("span",{className:"mr-1.5 rounded bg-background/70 px-1 py-0.5 align-middle text-micro font-medium",children:u}),z]}),x&&e.jsx("div",{className:"mt-0.5 text-xs leading-relaxed opacity-90",children:x})]})]})}n.__docgenInfo={description:`狀態提示框（良好／警示／提醒／危險）。

走語意 token 而非硬編色，換色票或切深色時不會漂移；四種變體各自帶固定圖示，
因此「這是什麼等級的訊息」不是只靠顏色傳達。`,methods:[],displayName:"Callout",props:{variant:{required:!0,tsType:{name:"union",raw:'"success" | "warning" | "info" | "danger"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"info"'},{name:"literal",value:'"danger"'}]},description:""},intensity:{required:!1,tsType:{name:"union",raw:'"low" | "high"',elements:[{name:"literal",value:'"low"'},{name:"literal",value:'"high"'}]},description:"視覺強度。預設 `low`；`high` 只給阻斷式訊息。",defaultValue:{value:'"low"',computed:!1}},live:{required:!1,tsType:{name:"boolean"},description:"這則訊息是「操作之後才出現」的嗎？\n\n預設 `false`＝靜態旁註，讀屏照文件順序讀到才念。\n設 `true` 才成為 live region 即時播報（`high` 用 assertive、`low` 用 polite）。\n靜態內容誤設 true 會讓讀屏在載入時把整頁提示框念一遍。",defaultValue:{value:"false",computed:!1}},title:{required:!0,tsType:{name:"ReactNode"},description:""},tag:{required:!1,tsType:{name:"string"},description:"短標籤（如規則代號、分類），顯示在標題前"},icon:{required:!1,tsType:{name:"LucideIcon"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const ne={title:"元件/基礎/按鈕・徽章・提示・卡片"},r={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{children:"主要動作"}),e.jsx(a,{variant:"brand",children:"送出申請"}),e.jsx(a,{variant:"secondary",children:"次要動作"}),e.jsx(a,{variant:"outline",children:"外框"}),e.jsx(a,{variant:"ghost",children:"淡化"}),e.jsx(a,{variant:"link",children:"連結樣式"}),e.jsxs(a,{variant:"destructive",children:[e.jsx(R,{})," 刪除這筆"]})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:["用工具列的",e.jsx("strong",{children:"色相"}),"切主題：只有 ",e.jsx("code",{children:"brand"})," 那顆會變，其餘全部不動。 這是刻意的——資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的",e.jsx("strong",{children:"出現面積"}),"失控 （色彩疲勞管的是面積與頻率，不是色相種類數）。",e.jsx("code",{children:"brand"})," 只給一頁一顆的關鍵動作。"]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{size:"sm",children:"小"}),e.jsx(a,{children:"預設"}),e.jsx(a,{size:"lg",children:"大"}),e.jsx(a,{size:"icon","aria-label":"新增",children:e.jsx(V,{})})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{disabled:!0,children:"停用"}),e.jsxs(a,{disabled:!0,children:[e.jsx(O,{className:"animate-spin"})," 處理中…"]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。 多一個 variant 只會讓人猶豫該用哪個。"})]})},i={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(t,{children:"預設"}),e.jsx(t,{variant:"secondary",children:"次要"}),e.jsx(t,{variant:"outline",children:"外框"})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(t,{variant:"success",children:"已完成"}),e.jsx(t,{variant:"warning",children:"待補件"}),e.jsx(t,{variant:"info",children:"審核中"}),e.jsx(t,{variant:"danger",children:"已退回"}),e.jsx(t,{variant:"edit",children:"已改動未送出"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。"})]})},l={render:()=>e.jsxs("div",{className:"grid max-w-4xl gap-5 lg:grid-cols-2",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs font-semibold",children:"低強度（預設）· 日常與次要提示"}),e.jsx(n,{variant:"success",title:"這批資料已全部完成",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(n,{variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個單位。"}),e.jsx(n,{variant:"warning",title:"有 3 筆缺少必要資訊",children:"未填寫前無法進入下一步。"}),e.jsx(n,{variant:"danger",title:"配額不足，無法確認",tag:"E-104",children:"項目「丙案 初版」可用量 2，需求 6。"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs font-semibold",children:"高強度 · 阻斷式，必須停下來決定"}),e.jsx(n,{intensity:"high",variant:"success",title:"這批資料已全部完成",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(n,{intensity:"high",variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個單位。"}),e.jsx(n,{intensity:"high",variant:"warning",title:"有 3 筆缺少必要資訊",children:"未填寫前無法進入下一步。"}),e.jsx(n,{intensity:"high",variant:"danger",title:"配額不足，無法確認",tag:"E-104",children:"項目「丙案 初版」可用量 2，需求 6。"})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground lg:col-span-2",children:["豐富度來源是「同一語意色的",e.jsx("strong",{children:"兩種強度"}),"」，不是加色相——四種語意封頂，不再擴充。",e.jsx("strong",{children:"有疑慮就用低強度"}),"：高強度出現頻率一高，色彩疲勞的預算會瞬間爆掉。 低強度的淡底是生成的 token（文字對它反解到 4.5:1），不是把實色壓 10% 疊上去—— 後者的對比取決於底下是什麼表面，完全不可控。"]})]})},d={render:()=>e.jsxs(L,{className:"max-w-sm",children:[e.jsxs(P,{children:[e.jsx(A,{children:"本月資料"}),e.jsx(E,{children:"2024 年 2 月，截至今日"})]}),e.jsx(H,{className:"text-3xl font-semibold tabular-nums",children:"1,284"}),e.jsxs(S,{className:"gap-2",children:[e.jsx(a,{size:"sm",children:"查看明細"}),e.jsx(a,{size:"sm",variant:"outline",children:"匯出"})]})]})};var p,h,v;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要動作</Button>
        <Button variant="brand">送出申請</Button>
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除這筆</Button>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        用工具列的<strong>色相</strong>切主題：只有 <code>brand</code> 那顆會變，其餘全部不動。
        這是刻意的——資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的<strong>出現面積</strong>失控
        （色彩疲勞管的是面積與頻率，不是色相種類數）。<code>brand</code> 只給一頁一顆的關鍵動作。
      </p>
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
}`,...(v=(h=r.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var f,j,b;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(b=(j=i.parameters)==null?void 0:j.docs)==null?void 0:b.source}}};var y,N,B;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-4xl gap-5 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-xs font-semibold">低強度（預設）· 日常與次要提示</p>
        <Callout variant="success" title="這批資料已全部完成">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
        <Callout variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個單位。</Callout>
        <Callout variant="warning" title="有 3 筆缺少必要資訊">未填寫前無法進入下一步。</Callout>
        <Callout variant="danger" title="配額不足，無法確認" tag="E-104">項目「丙案 初版」可用量 2，需求 6。</Callout>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold">高強度 · 阻斷式，必須停下來決定</p>
        <Callout intensity="high" variant="success" title="這批資料已全部完成">共 12 筆，最後一筆於 2024-02-05 完成。</Callout>
        <Callout intensity="high" variant="info" title="小提醒" tag="TIP">可以用欄位篩選一次比對多個單位。</Callout>
        <Callout intensity="high" variant="warning" title="有 3 筆缺少必要資訊">未填寫前無法進入下一步。</Callout>
        <Callout intensity="high" variant="danger" title="配額不足，無法確認" tag="E-104">項目「丙案 初版」可用量 2，需求 6。</Callout>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground lg:col-span-2">
        豐富度來源是「同一語意色的<strong>兩種強度</strong>」，不是加色相——四種語意封頂，不再擴充。
        <strong>有疑慮就用低強度</strong>：高強度出現頻率一高，色彩疲勞的預算會瞬間爆掉。
        低強度的淡底是生成的 token（文字對它反解到 4.5:1），不是把實色壓 10% 疊上去——
        後者的對比取決於底下是什麼表面，完全不可控。
      </p>
    </div>
}`,...(B=(N=l.parameters)==null?void 0:N.docs)==null?void 0:B.source}}};var C,w,k;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(k=(w=d.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};const te=["按鈕","徽章","提示框","卡片"];export{te as __namedExportsOrder,ne as default,d as 卡片,i as 徽章,r as 按鈕,l as 提示框};
