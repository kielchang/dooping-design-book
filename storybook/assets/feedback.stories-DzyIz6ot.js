import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as N}from"./index-UiW3gZKV.js";import{D as a}from"./delta-D4_Tipf4.js";import{E as d}from"./empty-state-BEDW5oSI.js";import{T as B}from"./tab-pills-6ZSblm0o.js";import{S as z}from"./stepper-Bl9BkPqb.js";import{B as c}from"./badge-B-Xe92Tx.js";import{B as m}from"./button-BZKmkDjW.js";import{f as E}from"./utils-pm6Xa0Qd.js";import{P as C}from"./package-open-ikfSYjs9.js";import{c as L}from"./createLucideIcon-BcR0bl2m.js";import"./_commonjsHelpers-CqkleIqs.js";import"./check-CZys2X9e.js";import"./index-rhYpeUg2.js";import"./index-C5qX--6C.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=L("SearchX",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=L("ShieldOff",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",key:"1jlk70"}],["path",{d:"M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",key:"18rp1v"}]]),J={title:"元件/狀態/變異・空狀態・分頁・步驟"},n={render:()=>e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{children:["本月營收與上月比較：",e.jsx(a,{value:128400,posLabel:"增加 ",negLabel:"減少 ",format:E})]}),e.jsxs("p",{children:["誤差數（越少越好）：",e.jsx(a,{value:340,goodWhen:"negative",posLabel:"超出 ",negLabel:"短少 "})]}),e.jsxs("p",{children:["交期落差：",e.jsx(a,{value:-3,goodWhen:"negative",posLabel:"延遲 ",negLabel:"提前 ",format:o=>`${o} 天`})]}),e.jsxs("p",{children:["與上期持平：",e.jsx(a,{value:0})]}),e.jsx("p",{className:"pt-2 text-xs text-muted-foreground",children:"三重編碼：箭頭 ▲▼ ＋ 文字 ＋ 顏色。把這段用灰階印出來，語意仍然完整——那才算過關。"})]})},t={render:()=>e.jsxs("div",{className:"grid gap-4 md:grid-cols-3",children:[e.jsx("div",{className:"rounded-lg border",children:e.jsx(d,{icon:e.jsx(C,{className:"size-7"}),title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",action:e.jsx(m,{size:"sm",children:"新增一筆"})})}),e.jsx("div",{className:"rounded-lg border",children:e.jsx(d,{icon:e.jsx(D,{className:"size-7"}),title:"查無符合的資料",hint:"目前篩選：單位＝乙單位、狀態＝已完成。試著放寬其中一項。",action:e.jsx(m,{size:"sm",variant:"outline",children:"清除篩選"})})}),e.jsx("div",{className:"rounded-lg border",children:e.jsx(d,{icon:e.jsx(O,{className:"size-7"}),title:"沒有檢視權限",hint:"此區資料僅限管理員檢視，請洽系統管理者。"})})]})},r={render:function(){const[l,i]=N.useState("all");return e.jsx(B,{label:"處理狀態",value:l,onChange:i,tabs:[{key:"all",label:"全部"},{key:"draft",label:"草稿",badge:e.jsx(c,{variant:"secondary",children:"3"})},{key:"confirmed",label:"已確認",badge:e.jsx(c,{variant:"info",children:"7"})},{key:"done",label:"已完成"}]})}},s={render:function(){const[l,i]=N.useState("items");return e.jsx("div",{className:"max-w-2xl",children:e.jsx(z,{current:l,onStep:i,completed:{unit:!0},steps:[{key:"unit",label:"選擇單位",hint:"或建立新單位"},{key:"items",label:"加入項目",hint:"數量與金額"},{key:"extra",label:"補充資訊"},{key:"review",label:"確認送出"}]})})}};var p,u,b;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 text-sm">
      <p>本月營收與上月比較：<Delta value={128_400} posLabel="增加 " negLabel="減少 " format={formatMoney} /></p>
      <p>誤差數（越少越好）：<Delta value={340} goodWhen="negative" posLabel="超出 " negLabel="短少 " /></p>
      <p>交期落差：<Delta value={-3} goodWhen="negative" posLabel="延遲 " negLabel="提前 " format={n => \`\${n} 天\`} /></p>
      <p>與上期持平：<Delta value={0} /></p>
      <p className="pt-2 text-xs text-muted-foreground">
        三重編碼：箭頭 ▲▼ ＋ 文字 ＋ 顏色。把這段用灰階印出來，語意仍然完整——那才算過關。
      </p>
    </div>
}`,...(b=(u=n.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var x,g,h;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(h=(g=t.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var v,f,y;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(y=(f=r.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var j,k,S;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: function Render() {
    const [cur, setCur] = useState("items");
    return <div className="max-w-2xl">
        <Stepper current={cur} onStep={setCur} completed={{
        unit: true
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
}`,...(S=(k=s.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};const K=["變異顯示","三種空狀態","分頁膠囊","步驟指示"];export{K as __namedExportsOrder,J as default,t as 三種空狀態,r as 分頁膠囊,s as 步驟指示,n as 變異顯示};
