import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as n}from"./button-i72Edb48.js";import{B as a}from"./badge-B-Xe92Tx.js";import{C as s}from"./callout-44PHFNm4.js";import{C as N,a as b,d as y,b as C,c as w,e as z}from"./card-CF2OQJSG.js";import{c as B}from"./createLucideIcon-DDRU598s.js";import{P as k}from"./plus-CK8V5P7p.js";import"./index-BFQ_Q9OP.js";import"./index-DdXKfkXy.js";import"./index-rhYpeUg2.js";import"./utils-pm6Xa0Qd.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=B("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=B("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),O={title:"元件/基礎/按鈕・徽章・提示・卡片"},t={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{children:"主要動作"}),e.jsx(n,{variant:"brand",children:"開始新流程"}),e.jsx(n,{variant:"secondary",children:"次要動作"}),e.jsx(n,{variant:"outline",children:"外框"}),e.jsx(n,{variant:"ghost",children:"淡化"}),e.jsx(n,{variant:"link",children:"連結樣式"}),e.jsxs(n,{variant:"destructive",children:[e.jsx(P,{})," 刪除這筆"]})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:["用工具列的",e.jsx("strong",{children:"色相"}),"切主題：只有 ",e.jsx("code",{children:"brand"})," 那顆會變，其餘全部不動。 資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的",e.jsx("strong",{children:"出現面積"}),"失控 （色彩疲勞管的是面積與頻率，不是色相種類數）。切到",e.jsx("strong",{children:"石墨"}),"時 ",e.jsx("code",{children:"brand"}),"會與 ",e.jsx("code",{children:"default"})," 完全一樣——那一組刻意沒有品牌色。"]}),e.jsxs("div",{className:"max-w-2xl space-y-2 rounded-md border border-l-4 border-l-danger bg-danger-subtle p-3 text-danger-subtle-foreground",children:[e.jsx("p",{className:"text-xs font-semibold",children:"brand 不要用在確認／送出／儲存上"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-4",children:[e.jsxs("span",{className:"flex items-center gap-2 text-xs",children:[e.jsx(n,{size:"sm",children:"送出申請"})," 正確"]}),e.jsxs("span",{className:"flex items-center gap-2 text-xs",children:[e.jsx(n,{size:"sm",variant:"brand",children:"送出申請"})," 錯誤"]})]}),e.jsxs("p",{className:"text-xs leading-relaxed",children:[e.jsx("code",{children:"--brand"})," 的職責是",e.jsx("strong",{children:"識別"}),"（這是誰的產品），確認按鈕的職責是",e.jsx("strong",{children:"指示可供性"}),"（按下去會提交）。色相帶著既成慣例——綠＝通行、藍＝系統預設、 紅＝停止、灰＝停用；紫與洋紅",e.jsx("strong",{children:"沒有動作慣例"}),"，放在確認按鈕上會讀成裝飾。 把工具列切到藍紫或紫晶，比較上面兩顆就看得出來。"]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{size:"sm",children:"小"}),e.jsx(n,{children:"預設"}),e.jsx(n,{size:"lg",children:"大"}),e.jsx(n,{size:"icon","aria-label":"新增",children:e.jsx(k,{})})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{disabled:!0,children:"停用"}),e.jsxs(n,{disabled:!0,children:[e.jsx(T,{className:"animate-spin"})," 處理中…"]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"「載入中」沒有獨立 variant：把按鈕設為 disabled、換上旋轉圖示、改文案即可。 多一個 variant 只會讓人猶豫該用哪個。"})]})},r={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{children:"預設"}),e.jsx(a,{variant:"secondary",children:"次要"}),e.jsx(a,{variant:"outline",children:"外框"})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{variant:"success",children:"已完成"}),e.jsx(a,{variant:"warning",children:"待補件"}),e.jsx(a,{variant:"info",children:"審核中"}),e.jsx(a,{variant:"danger",children:"已退回"}),e.jsx(a,{variant:"edit",children:"已改動未送出"})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:["徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。 四種狀態走",e.jsx("strong",{children:"淡底層"}),"，與提示框的低強度同一組 token——所以整排的構造與極性一致 （全部是「淡底＋同色相深墨」）。改版前 success／warning／info 是中明度實色配深字、 danger 是深實色配反白，",e.jsx("strong",{children:"一排裡有兩種極性"}),"、底色 L* 全距 23.5； 眼睛會把極性反轉讀成「不同種類」而不是「不同嚴重度」。現在全距收到 10。"]}),e.jsxs("div",{className:"space-y-2 border-t pt-3",children:[e.jsx("p",{className:"text-xs font-semibold",children:'intensity="high" · 實色，只給必須喊的場合'}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{variant:"success",intensity:"high",children:"已完成"}),e.jsx(a,{variant:"warning",intensity:"high",children:"待補件"}),e.jsx(a,{variant:"info",intensity:"high",children:"審核中"}),e.jsx(a,{variant:"danger",intensity:"high",children:"已退回"})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:[e.jsx("strong",{children:"資料表裡不要用這一排。"}),"一頁上百個徽章全用實色，高飽和色的出現面積會失控 ——色彩疲勞管的是面積 × 頻率，不是色相種類數。這一排也正好是舊版的長相： 注意 danger 那顆的極性與左邊三顆相反。"]})]})]})},i={render:()=>e.jsxs("div",{className:"grid max-w-4xl gap-5 lg:grid-cols-2",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs font-semibold",children:"低強度（預設）· 日常與次要提示"}),e.jsx(s,{variant:"success",title:"這批資料已全部完成",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(s,{variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個單位。"}),e.jsx(s,{variant:"warning",title:"有 3 筆缺少必要資訊",children:"未填寫前無法進入下一步。"}),e.jsx(s,{variant:"danger",title:"配額不足，無法確認",tag:"E-104",children:"項目「丙案 初版」可用量 2，需求 6。"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs font-semibold",children:"高強度 · 阻斷式，必須停下來決定"}),e.jsx(s,{intensity:"high",variant:"success",title:"這批資料已全部完成",children:"共 12 筆，最後一筆於 2024-02-05 完成。"}),e.jsx(s,{intensity:"high",variant:"info",title:"小提醒",tag:"TIP",children:"可以用欄位篩選一次比對多個單位。"}),e.jsx(s,{intensity:"high",variant:"warning",title:"有 3 筆缺少必要資訊",children:"未填寫前無法進入下一步。"}),e.jsx(s,{intensity:"high",variant:"danger",title:"配額不足，無法確認",tag:"E-104",children:"項目「丙案 初版」可用量 2，需求 6。"})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground lg:col-span-2",children:["豐富度來源是「同一語意色的",e.jsx("strong",{children:"兩種強度"}),"」，不是加色相——四種語意封頂，不再擴充。",e.jsx("strong",{children:"有疑慮就用低強度"}),"：高強度出現頻率一高，色彩疲勞的預算會瞬間爆掉。 低強度的淡底是生成的 token（文字對它反解到 4.5:1），不是把實色壓 10% 疊上去—— 後者的對比取決於底下是什麼表面，完全不可控。"]})]})},d={render:()=>e.jsxs(N,{className:"max-w-sm",children:[e.jsxs(b,{children:[e.jsx(y,{children:"本月資料"}),e.jsx(C,{children:"2024 年 2 月，截至今日"})]}),e.jsx(w,{className:"text-3xl font-semibold tabular-nums",children:"1,284"}),e.jsxs(z,{className:"gap-2",children:[e.jsx(n,{size:"sm",children:"查看明細"}),e.jsx(n,{size:"sm",variant:"outline",children:"匯出"})]})]})};var l,c,o;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要動作</Button>
        <Button variant="brand">開始新流程</Button>
        <Button variant="secondary">次要動作</Button>
        <Button variant="outline">外框</Button>
        <Button variant="ghost">淡化</Button>
        <Button variant="link">連結樣式</Button>
        <Button variant="destructive"><Trash2 /> 刪除這筆</Button>
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        用工具列的<strong>色相</strong>切主題：只有 <code>brand</code> 那顆會變，其餘全部不動。
        資料密集的畫面上按鈕很多，全部吃主題色會讓高飽和色的<strong>出現面積</strong>失控
        （色彩疲勞管的是面積與頻率，不是色相種類數）。切到<strong>石墨</strong>時 <code>brand</code>
        會與 <code>default</code> 完全一樣——那一組刻意沒有品牌色。
      </p>

      <div className="max-w-2xl space-y-2 rounded-md border border-l-4 border-l-danger bg-danger-subtle p-3 text-danger-subtle-foreground">
        <p className="text-xs font-semibold">brand 不要用在確認／送出／儲存上</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-xs">
            <Button size="sm">送出申請</Button> 正確
          </span>
          <span className="flex items-center gap-2 text-xs">
            <Button size="sm" variant="brand">送出申請</Button> 錯誤
          </span>
        </div>
        <p className="text-xs leading-relaxed">
          <code>--brand</code> 的職責是<strong>識別</strong>（這是誰的產品），確認按鈕的職責是
          <strong>指示可供性</strong>（按下去會提交）。色相帶著既成慣例——綠＝通行、藍＝系統預設、
          紅＝停止、灰＝停用；紫與洋紅<strong>沒有動作慣例</strong>，放在確認按鈕上會讀成裝飾。
          把工具列切到藍紫或紫晶，比較上面兩顆就看得出來。
        </p>
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
}`,...(o=(c=t.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};var x,m,g;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
      <p className="max-w-2xl text-xs text-muted-foreground">
        徽章一定要有文字。純色點在灰階列印與色覺障礙下等於消失。
        四種狀態走<strong>淡底層</strong>，與提示框的低強度同一組 token——所以整排的構造與極性一致
        （全部是「淡底＋同色相深墨」）。改版前 success／warning／info 是中明度實色配深字、
        danger 是深實色配反白，<strong>一排裡有兩種極性</strong>、底色 L* 全距 23.5；
        眼睛會把極性反轉讀成「不同種類」而不是「不同嚴重度」。現在全距收到 10。
      </p>
      <div className="space-y-2 border-t pt-3">
        <p className="text-xs font-semibold">intensity=&quot;high&quot; · 實色，只給必須喊的場合</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" intensity="high">已完成</Badge>
          <Badge variant="warning" intensity="high">待補件</Badge>
          <Badge variant="info" intensity="high">審核中</Badge>
          <Badge variant="danger" intensity="high">已退回</Badge>
        </div>
        <p className="max-w-2xl text-xs text-muted-foreground">
          <strong>資料表裡不要用這一排。</strong>一頁上百個徽章全用實色，高飽和色的出現面積會失控
          ——色彩疲勞管的是面積 × 頻率，不是色相種類數。這一排也正好是舊版的長相：
          注意 danger 那顆的極性與左邊三顆相反。
        </p>
      </div>
    </div>
}`,...(g=(m=r.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,p,u;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(u=(p=i.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var v,j,f;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(f=(j=d.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};const R=["按鈕","徽章","提示框","卡片"];export{R as __namedExportsOrder,O as default,d as 卡片,r as 徽章,t as 按鈕,i as 提示框};
