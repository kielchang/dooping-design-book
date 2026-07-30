import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as q}from"./index-BFQ_Q9OP.js";import{E as x,P as _,D as i}from"./delta-DB2sNv8-.js";import{T as I}from"./tab-pills-CDjpRiKs.js";import{c as l,f as M}from"./utils-C1k7i5aj.js";import{C as W}from"./check-SsieMrcg.js";import{B as h}from"./badge-9TpBB0IJ.js";import{B as y}from"./button-DEbqQUaU.js";import{c as D}from"./createLucideIcon-DDRU598s.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=D("SearchX",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=D("ShieldOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",key:"1jlk70"}],["path",{d:"M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",key:"18rp1v"}]]);function R({steps:t,current:n,completed:r={},onStep:p,className:O}){const g=t.findIndex(a=>a.key===n);return e.jsx("ol",{className:l("flex w-full items-start overflow-x-auto pb-1",O),children:t.map((a,s)=>{const b=a.key===n,f=r[a.key],P=s<g,o=b?"current":f||P?"done":"todo";return e.jsxs("li",{className:l("flex flex-1 items-start",s===t.length-1&&"flex-none"),children:[e.jsxs("button",{type:"button",onClick:()=>p==null?void 0:p(a.key),"aria-current":b?"step":void 0,className:"group flex flex-col items-center gap-1.5 text-center",children:[e.jsx("span",{className:l("flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-fast",o==="current"&&"border-primary bg-primary text-primary-foreground",o==="done"&&"border-success bg-success text-success-foreground",o==="todo"&&"border-muted-foreground/30 bg-background text-muted-foreground group-hover:border-primary/50"),children:o==="done"?e.jsx(W,{className:"size-4","aria-hidden":!0}):s+1}),e.jsxs("span",{className:"w-24 sm:w-32",children:[e.jsx("span",{className:l("block text-xs font-medium leading-tight sm:text-sm",o==="todo"?"text-muted-foreground":"text-foreground"),children:a.label}),a.hint&&e.jsx("span",{className:"mt-0.5 hidden text-tiny leading-tight text-muted-foreground sm:block",children:a.hint})]})]}),s<t.length-1&&e.jsx("span",{className:l("mt-[18px] h-0.5 flex-1",s<g||f?"bg-success":"bg-muted-foreground/20"),"aria-hidden":!0})]},a.key)})})}R.__docgenInfo={description:`步驟指示。

完成態同時用**勾選圖示**與顏色標示，不只靠綠色；步驟可點擊回頭，
因為多步驟表單最常見的挫折就是「我想回去確認第 2 步填了什麼，但只能一路取消重來」。`,methods:[],displayName:"Stepper",props:{steps:{required:!0,tsType:{name:"Array",elements:[{name:"Step"}],raw:"Step[]"},description:""},current:{required:!0,tsType:{name:"string"},description:"目前步驟 key"},completed:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"boolean"}],raw:"Record<string, boolean>"},description:"各步驟是否已完成（可跳著完成，不必依序）",defaultValue:{value:"{}",computed:!1}},onStep:{required:!1,tsType:{name:"signature",type:"function",raw:"(key: string) => void",signature:{arguments:[{type:{name:"string"},name:"key"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const Y={title:"元件/狀態/變異・空狀態・分頁・步驟"},d={render:()=>e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:["本月營收與上月比較：",e.jsx(i,{value:128400,posLabel:"增加 ",negLabel:"減少 ",format:M})]}),e.jsxs("p",{children:["誤差數（越少越好）：",e.jsx(i,{value:340,goodWhen:"negative",posLabel:"超出 ",negLabel:"短少 "})]}),e.jsxs("p",{children:["交期落差：",e.jsx(i,{value:-3,goodWhen:"negative",posLabel:"延遲 ",negLabel:"提前 ",format:t=>`${t} 天`})]}),e.jsxs("p",{children:["與上期持平：",e.jsx(i,{value:0})]}),e.jsx("p",{className:"pt-2 text-xs text-muted-foreground",children:"三重編碼：箭頭 ▲▼ ＋ 文字 ＋ 顏色。把這段用灰階印出來，語意仍然完整——那才算過關。"})]})},c={render:()=>e.jsxs("div",{className:"grid gap-4 md:grid-cols-3",children:[e.jsx("div",{className:"rounded-lg border",children:e.jsx(x,{icon:e.jsx(_,{className:"size-7"}),title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",action:e.jsx(y,{size:"sm",children:"新增一筆"})})}),e.jsx("div",{className:"rounded-lg border",children:e.jsx(x,{icon:e.jsx(X,{className:"size-7"}),title:"查無符合的資料",hint:"目前篩選：單位＝乙單位、狀態＝已完成。試著放寬其中一項。",action:e.jsx(y,{size:"sm",variant:"outline",children:"清除篩選"})})}),e.jsx("div",{className:"rounded-lg border",children:e.jsx(x,{icon:e.jsx(A,{className:"size-7"}),title:"沒有檢視權限",hint:"此區資料僅限管理員檢視，請洽系統管理者。"})})]})},m={render:function(){const[n,r]=q.useState("all");return e.jsx(I,{label:"處理狀態",value:n,onChange:r,tabs:[{key:"all",label:"全部"},{key:"draft",label:"草稿",badge:e.jsx(h,{variant:"secondary",children:"3"})},{key:"confirmed",label:"已確認",badge:e.jsx(h,{variant:"info",children:"7"})},{key:"done",label:"已完成"}]})}},u={render:function(){const[n,r]=q.useState("items");return e.jsx("div",{className:"max-w-2xl",children:e.jsx(R,{current:n,onStep:r,completed:{customer:!0},steps:[{key:"unit",label:"選擇單位",hint:"或建立新單位"},{key:"items",label:"加入項目",hint:"數量與金額"},{key:"extra",label:"補充資訊"},{key:"review",label:"確認送出"}]})})}};var v,j,k;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 text-sm">
      <p>本月營收與上月比較：<Delta value={128_400} posLabel="增加 " negLabel="減少 " format={formatMoney} /></p>
      <p>誤差數（越少越好）：<Delta value={340} goodWhen="negative" posLabel="超出 " negLabel="短少 " /></p>
      <p>交期落差：<Delta value={-3} goodWhen="negative" posLabel="延遲 " negLabel="提前 " format={n => \`\${n} 天\`} /></p>
      <p>與上期持平：<Delta value={0} /></p>
      <p className="pt-2 text-xs text-muted-foreground">
        三重編碼：箭頭 ▲▼ ＋ 文字 ＋ 顏色。把這段用灰階印出來，語意仍然完整——那才算過關。
      </p>
    </div>
}`,...(k=(j=d.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var N,S,L;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border">
        <EmptyState icon={<PackageOpen className="size-7" />} title="還沒有任何資料" hint="建立第一筆後，這裡會顯示明細與合計。" action={<Button size="sm">新增一筆</Button>} />
      </div>
      <div className="rounded-lg border">
        <EmptyState icon={<SearchX className="size-7" />} title="查無符合的資料" hint="目前篩選：單位＝乙單位、狀態＝已完成。試著放寬其中一項。" action={<Button size="sm" variant="outline">清除篩選</Button>} />
      </div>
      <div className="rounded-lg border">
        <EmptyState icon={<ShieldOff className="size-7" />} title="沒有檢視權限" hint="此區資料僅限管理員檢視，請洽系統管理者。" />
      </div>
    </div>
}`,...(L=(S=c.parameters)==null?void 0:S.docs)==null?void 0:L.source}}};var w,z,B;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: function Render() {
    const [tab, setTab] = useState("all");
    return <TabPills label="處理狀態" value={tab} onChange={setTab} tabs={[{
      key: "all",
      label: "全部"
    }, {
      key: "draft",
      label: "草稿",
      badge: <Badge variant="secondary">3</Badge>
    }, {
      key: "confirmed",
      label: "已確認",
      badge: <Badge variant="info">7</Badge>
    }, {
      key: "done",
      label: "已完成"
    }]} />;
  }
}`,...(B=(z=m.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var T,C,E;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: function Render() {
    const [cur, setCur] = useState("items");
    return <div className="max-w-2xl">
        <Stepper current={cur} onStep={setCur} completed={{
        customer: true
      }} steps={[{
        key: "unit",
        label: "選擇單位",
        hint: "或建立新單位"
      }, {
        key: "items",
        label: "加入項目",
        hint: "數量與金額"
      }, {
        key: "extra",
        label: "補充資訊"
      }, {
        key: "review",
        label: "確認送出"
      }]} />
      </div>;
  }
}`,...(E=(C=u.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};const Z=["變異顯示","三種空狀態","分頁膠囊","步驟指示"];export{Z as __namedExportsOrder,Y as default,c as 三種空狀態,m as 分頁膠囊,u as 步驟指示,d as 變異顯示};
