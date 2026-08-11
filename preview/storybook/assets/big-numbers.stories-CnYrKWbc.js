import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{D as c}from"./data-table-YnBmSkHT.js";import{E as b}from"./editable-field-Cdacd3bD.js";import{D as j}from"./delta-D4_Tipf4.js";import{f as n,a as d}from"./utils-pm6Xa0Qd.js";import{m as l}from"./generate-stress-DBBSYc_v.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./button-PlLiai67.js";import"./index-VXoYh6zd.js";import"./index-rhYpeUg2.js";import"./select-BimLQx0-.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./checkbox-OptVgWvT.js";import"./popover-CfLROtjL.js";import"./dropdown-menu-BGKoUATf.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./label-DmCCWqIB.js";import"./seg-group-D0IDbvdD.js";import"./chips-DzzKURvw.js";import"./undo-2-CSzb_e47.js";const oe={title:"壓力測試/超大數值"},i=[{key:"id",header:"編號",cell:e=>e.id},{key:"name",header:"項目",cell:e=>e.name},{key:"qty",header:"數量",numeric:!0,cell:e=>d(e.qty),sortValue:e=>e.qty,total:e=>d(e.reduce((m,o)=>m+o.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>n(e.amount),sortValue:e=>e.amount,total:e=>n(e.reduce((m,o)=>m+o.amount,0))}],t={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"金額範圍 [1e12, 9.9e12]——合計列會到 14 位數"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：千分位還在嗎？數字欄有沒有偷偷縮小字級（規範：數值欄一律不縮字級，改為容器捲動）？ 合計列與明細列的字級一致嗎？"}),a.jsx(c,{rows:l({count:6,amountRange:[1e12,99e11],qtyRange:[1e4,9e5]}),columns:i,getRowKey:e=>e.id,searchable:!1})]}),a.jsxs("div",{className:"max-w-sm space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"同一個 13 位數放進逐欄編輯"}),a.jsx(b,{label:"上限額度",kind:"money",value:9876543210123,original:9876543210123,onChange:()=>{}})]})]})},r={render:()=>a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"數量 10 位小數、金額 8 位小數"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：顯示端**不四捨五入**是規約（formatNumber 忠實呈現到 10 位）—— 於是小數位不齊的欄位右對齊時會參差。這裡要回答的是「該在計算層進位到幾位」， 不是「顯示層要不要偷偷 round」。"}),a.jsx(c,{rows:l({count:4,qtyRange:[0,1],qtyDecimals:10,amountRange:[0,1],amountDecimals:8}),columns:i,getRowKey:e=>e.id,searchable:!1})]})},s={render:()=>a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：數量全零、金額跨越正負"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：負金額是會計慣例的括號（不是只靠紅字）；全零的合計是「0」不是空白； 差異欄在 0 的時候不該掛正負號。"}),a.jsx(c,{rows:l({count:6,qtyRange:[0,0],amountRange:[-25e4,25e4]}),columns:[...i,{key:"delta",header:"與基準差異",numeric:!0,cell:e=>a.jsx(j,{value:e.amount,posLabel:"高於基準 ",negLabel:"低於基準 ",format:n}),sortValue:e=>e.amount}],getRowKey:e=>e.id,searchable:!1})]})};var p,u,x;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">金額範圍 [1e12, 9.9e12]——合計列會到 14 位數</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：千分位還在嗎？數字欄有沒有偷偷縮小字級（規範：數值欄一律不縮字級，改為容器捲動）？
          合計列與明細列的字級一致嗎？
        </p>
        <DataTable rows={makeRecords({
        count: 6,
        amountRange: [1e12, 9.9e12],
        qtyRange: [10_000, 900_000]
      })} columns={columns} getRowKey={r => r.id} searchable={false} />
      </div>
      <div className="max-w-sm space-y-2">
        <p className="text-sm font-medium">同一個 13 位數放進逐欄編輯</p>
        <EditableField label="上限額度" kind="money" value={9_876_543_210_123} original={9_876_543_210_123} onChange={() => {}} />
      </div>
    </div>
}`,...(x=(u=t.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var y,f,g;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">數量 10 位小數、金額 8 位小數</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：顯示端**不四捨五入**是規約（formatNumber 忠實呈現到 10 位）——
        於是小數位不齊的欄位右對齊時會參差。這裡要回答的是「該在計算層進位到幾位」，
        不是「顯示層要不要偷偷 round」。
      </p>
      <DataTable rows={makeRecords({
      count: 4,
      qtyRange: [0, 1],
      qtyDecimals: 10,
      amountRange: [0, 1],
      amountDecimals: 8
    })} columns={columns} getRowKey={r => r.id} searchable={false} />
    </div>
}`,...(g=(f=r.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var N,h,R;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：數量全零、金額跨越正負</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：負金額是會計慣例的括號（不是只靠紅字）；全零的合計是「0」不是空白；
        差異欄在 0 的時候不該掛正負號。
      </p>
      <DataTable rows={makeRecords({
      count: 6,
      qtyRange: [0, 0],
      amountRange: [-250_000, 250_000]
    })} columns={[...columns, {
      key: "delta",
      header: "與基準差異",
      numeric: true,
      cell: r => <Delta value={r.amount} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
      sortValue: r => r.amount
    }]} getRowKey={r => r.id} searchable={false} />
    </div>
}`,...(R=(h=s.parameters)==null?void 0:h.docs)==null?void 0:R.source}}};const ne=["十三位數金額","超長小數","零與負值"];export{ne as __namedExportsOrder,oe as default,t as 十三位數金額,r as 超長小數,s as 零與負值};
