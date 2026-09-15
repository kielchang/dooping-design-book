import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{D as u}from"./data-table-CVaqZJok.js";import{C as h}from"./change-summary-D0ua9-xe.js";import{f as N}from"./utils-CMl-9ImW.js";import{S as y}from"./sample-data-I9KaR9SF.js";import{m as g,c as v}from"./generate-stress-DqnYZdHV.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-BoO4nXaP.js";import"./empty-state-KwOlHdIt.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-36koZ389.js";import"./input-D31gR-xu.js";import"./button-DyXVXefs.js";import"./index-VXoYh6zd.js";import"./index-BOrUEQ0c.js";import"./select-CtC8ydIk.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-wQla93iR.js";import"./checkbox-BPXNu1Dg.js";import"./popover-D_gDLSMC.js";import"./dropdown-menu-DIIbaxa5.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./undo-2-CSzb_e47.js";const ae={title:"壓力測試/超長文字值"},f=[{key:"id",header:"編號",cell:e=>e.id},{key:"nameTruncate",header:"項目（截斷 200px）",truncate:200,cell:e=>e.name,filterText:e=>e.name},{key:"nameWrap",header:"項目（不截斷）",cell:e=>e.name},{key:"status",header:"狀態",cell:e=>y[e.status]},{key:"amount",header:"金額",numeric:!0,cell:e=>N(e.amount),sortValue:e=>e.amount}],s={render:()=>a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"一半的筆數帶 40 字左右的名稱（makeRecords longNameRatio: 0.5）"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：截斷欄 hover 有沒有完整內容的提示？不截斷欄換行後，同一列的「狀態」「金額」跟著變高， 掃讀金額欄的視線會被打斷——這就是要在元件層決定截斷策略的原因。"}),a.jsx(u,{rows:g({count:6,longNameRatio:.5}),columns:f,getRowKey:e=>e.id,searchable:!1})]})},r={render:()=>a.jsxs("div",{className:"max-w-md space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"一半的變更帶超長標籤與超長前後值（makeChanges longTextRatio: 0.5）"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：每一列仍然是「舊值 → 新值」一行嗎？截斷處 hover 拿得到完整值嗎？ 箭頭與還原鈕有沒有被長文字推走？"}),a.jsx(h,{changes:v(8,{longTextRatio:.5}),onRevertField:()=>{},onRevertAll:()=>{}})]})},m={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：整欄 name 都是空字串"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：空儲存格是留白、還是顯示占位符號？列高有沒有塌掉？ 「消失的 UI 沒有人會在開發時注意到」——這支 story 就是拿來注意它的。"}),a.jsx(u,{rows:g({count:4}).map(e=>({...e,name:""})),columns:f,getRowKey:e=>e.id,searchable:!1})]}),a.jsxs("div",{className:"max-w-md space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"零筆變更：ChangeSummary 的空狀態"}),a.jsx(h,{changes:[]})]})]})};var t,o,n;s.parameters={...s.parameters,docs:{...(t=s.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">一半的筆數帶 40 字左右的名稱（makeRecords longNameRatio: 0.5）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：截斷欄 hover 有沒有完整內容的提示？不截斷欄換行後，同一列的「狀態」「金額」跟著變高，
        掃讀金額欄的視線會被打斷——這就是要在元件層決定截斷策略的原因。
      </p>
      <DataTable rows={makeRecords({
      count: 6,
      longNameRatio: 0.5
    })} columns={columns} getRowKey={r => r.id} searchable={false} />
    </div>
}`,...(n=(o=s.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};var c,i,d;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div className="max-w-md space-y-2">
      <p className="text-sm font-medium">一半的變更帶超長標籤與超長前後值（makeChanges longTextRatio: 0.5）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：每一列仍然是「舊值 → 新值」一行嗎？截斷處 hover 拿得到完整值嗎？
        箭頭與還原鈕有沒有被長文字推走？
      </p>
      <ChangeSummary changes={makeChanges(8, {
      longTextRatio: 0.5
    })} onRevertField={() => {}} onRevertAll={() => {}} />
    </div>
}`,...(d=(i=r.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var p,l,x;m.parameters={...m.parameters,docs:{...(p=m.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">「沒有」那一側：整欄 name 都是空字串</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：空儲存格是留白、還是顯示占位符號？列高有沒有塌掉？
          「消失的 UI 沒有人會在開發時注意到」——這支 story 就是拿來注意它的。
        </p>
        <DataTable rows={makeRecords({
        count: 4
      }).map(r => ({
        ...r,
        name: ""
      }))} columns={columns} getRowKey={r => r.id} searchable={false} />
      </div>
      <div className="max-w-md space-y-2">
        <p className="text-sm font-medium">零筆變更：ChangeSummary 的空狀態</p>
        <ChangeSummary changes={[]} />
      </div>
    </div>
}`,...(x=(l=m.parameters)==null?void 0:l.docs)==null?void 0:x.source}}};const se=["截斷與換行","變更摘要的長值","空字串"];export{se as __namedExportsOrder,ae as default,s as 截斷與換行,m as 空字串,r as 變更摘要的長值};
