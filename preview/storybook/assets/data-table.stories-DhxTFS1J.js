import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{D as i}from"./data-table-C2XP8buS.js";import{B as S}from"./badge-B-Xe92Tx.js";import{B as A}from"./button-i72Edb48.js";import{D as R}from"./delta-D4_Tipf4.js";import{f as m,a as d}from"./utils-pm6Xa0Qd.js";import{S as n,a as w}from"./sample-data-DlVwqcXX.js";import{P as b}from"./package-open-U624fOhV.js";import"./index-BFQ_Q9OP.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./table-BcYJvUkN.js";import"./empty-state-BjzKLH_M.js";import"./createLucideIcon-DDRU598s.js";import"./index-Cz5Sp9I-.js";import"./Combination-DsSBML8Q.js";import"./index-DdXKfkXy.js";import"./select-BnSxgMTA.js";import"./check-SsieMrcg.js";import"./tooltip-1GOoMEVs.js";import"./x-C3WrzgWc.js";import"./plus-CK8V5P7p.js";import"./index-rhYpeUg2.js";const X={title:"元件/資料/資料表 DataTable"},D={draft:"secondary",confirmed:"info",done:"success",void:"danger"},l=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>d(e.qty),sortValue:e=>e.qty,total:e=>d(e.reduce((r,c)=>r+c.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>m(e.amount),sortValue:e=>e.amount,total:e=>m(e.reduce((r,c)=>r+c.amount,0))},{key:"status",header:"狀態",cell:e=>t.jsx(S,{variant:D[e.status],children:n[e.status]}),sortValue:e=>n[e.status],filterText:e=>n[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],a={render:()=>t.jsx(i,{rows:w,columns:l,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,n[e.status],e.createdAt],fileName:"records.csv"}})},o={render:()=>t.jsx(i,{rows:[],columns:l,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:t.jsx(b,{className:"size-7"}),action:t.jsx(A,{size:"sm",children:"新增一筆"})}})},s={render:()=>{const e=[...l.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:r=>t.jsx(R,{value:r.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:m}),sortValue:r=>r.amount-1e5}];return t.jsx(i,{rows:w.slice(0,6),columns:e,getRowKey:r=>r.id,dense:!0,searchable:!1})}};var u,p,y;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <DataTable rows={demoRecords} columns={columns} getRowKey={r => r.id} initialSort={{
    key: "amount",
    dir: "desc"
  }} pageSize={5} csv={{
    headers: ["編號", "單位", "項目", "分類", "數量", "金額", "狀態", "建立日期"],
    row: r => [r.id, r.unit, r.name, r.category, r.qty, r.amount, STATUS_LABEL[r.status], r.createdAt],
    fileName: "records.csv"
  }} />
}`,...(y=(p=a.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var f,g,h;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var T,x,k;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const cols: Column<DemoRecord>[] = [...columns.slice(0, 2), {
      key: "delta",
      header: "與上期差異",
      numeric: true,
      cell: r => <Delta value={r.amount - 100_000} posLabel="高於基準 " negLabel="低於基準 " format={formatMoney} />,
      sortValue: r => r.amount - 100_000
    }];
    return <DataTable rows={demoRecords.slice(0, 6)} columns={cols} getRowKey={r => r.id} dense searchable={false} />;
  }
}`,...(k=(x=s.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};const Y=["完整功能","空狀態","密集模式與變異欄"];export{Y as __namedExportsOrder,X as default,a as 完整功能,s as 密集模式與變異欄,o as 空狀態};
