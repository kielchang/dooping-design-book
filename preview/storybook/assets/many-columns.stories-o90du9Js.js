import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{D as f}from"./data-table-YnBmSkHT.js";import{B as k}from"./badge-B-Xe92Tx.js";import{D as N}from"./delta-D4_Tipf4.js";import{a as c,f as m,b as w}from"./utils-pm6Xa0Qd.js";import{S as n}from"./sample-data-I9KaR9SF.js";import{m as h}from"./generate-stress-DBBSYc_v.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./button-PlLiai67.js";import"./index-VXoYh6zd.js";import"./index-rhYpeUg2.js";import"./select-BimLQx0-.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./checkbox-OptVgWvT.js";import"./popover-CfLROtjL.js";import"./dropdown-menu-BGKoUATf.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";const oe={title:"壓力測試/超多欄位"},V={draft:"secondary",confirmed:"info",done:"success",void:"danger"},g=h({count:20,longNameRatio:.15}),i=g.reduce((e,r)=>e+r.amount,0),j=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filter:"select",filterText:e=>e.unit},{key:"name",header:"項目",truncate:160,cell:e=>e.name,filterText:e=>e.name},{key:"category",header:"類別",cell:e=>e.category,sortValue:e=>e.category},{key:"qty",header:"數量",numeric:!0,cell:e=>c(e.qty),sortValue:e=>e.qty,total:e=>c(e.reduce((r,s)=>r+s.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>m(e.amount),sortValue:e=>e.amount,total:e=>m(e.reduce((r,s)=>r+s.amount,0))},{key:"delta",header:"與基準差異",numeric:!0,cell:e=>t.jsx(N,{value:e.amount-15e4,posLabel:"高於基準 ",negLabel:"低於基準 ",format:m}),sortValue:e=>e.amount-15e4},{key:"share",header:"佔比",numeric:!0,cell:e=>w(e.amount/i),sortValue:e=>e.amount/i},{key:"status",header:"狀態",cell:e=>t.jsx(k,{variant:V[e.status],children:n[e.status]}),sortValue:e=>n[e.status],filter:"select",filterText:e=>n[e.status]},{key:"owner",header:"負責組別",cell:e=>e.owner,sortValue:e=>e.owner},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt},{key:"note",header:"備註",cell:e=>e.status==="void"?"已作廢，不列入例行彙整":"—"}],a={render:()=>t.jsxs("div",{className:"space-y-2",children:[t.jsx("p",{className:"text-sm font-medium",children:"12 欄＋凍結首欄＋黏性表頭（maxHeight 360px）"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：水平捲動時凍結的「編號」欄還在原地嗎？垂直捲動時黏性表頭下緣 有沒有透出後面的內容？合計列橫向捲動時對得上各自的欄嗎？"}),t.jsx(f,{rows:g,columns:j,getRowKey:e=>e.id,stickyHeader:!0,maxHeight:"360px",pageSize:30})]})},o={render:()=>t.jsxs("div",{className:"max-w-md space-y-2",children:[t.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：只剩一欄"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：單欄的表格還像表格嗎？搜尋、排序、分頁這些配件在一欄時會不會顯得突兀？ ——如果只剩一欄，也許該用清單而不是表格。"}),t.jsx(f,{rows:h({count:5}),columns:[{key:"name",header:"項目",cell:e=>e.name,sortValue:e=>e.name}],getRowKey:e=>e.id,searchable:!1})]})};var l,d,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">12 欄＋凍結首欄＋黏性表頭（maxHeight 360px）</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：水平捲動時凍結的「編號」欄還在原地嗎？垂直捲動時黏性表頭下緣
        有沒有透出後面的內容？合計列橫向捲動時對得上各自的欄嗎？
      </p>
      <DataTable rows={rows} columns={columns} getRowKey={r => r.id} stickyHeader maxHeight="360px" pageSize={30} />
    </div>
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var p,x,y;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="max-w-md space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：只剩一欄</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：單欄的表格還像表格嗎？搜尋、排序、分頁這些配件在一欄時會不會顯得突兀？
        ——如果只剩一欄，也許該用清單而不是表格。
      </p>
      <DataTable rows={makeRecords({
      count: 5
    })} columns={[{
      key: "name",
      header: "項目",
      cell: r => r.name,
      sortValue: r => r.name
    }]} getRowKey={r => r.id} searchable={false} />
    </div>
}`,...(y=(x=o.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};const se=["十二欄","單欄"];export{se as __namedExportsOrder,oe as default,a as 十二欄,o as 單欄};
