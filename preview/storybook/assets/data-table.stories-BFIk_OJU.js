import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{within as m,userEvent as s,waitFor as d,expect as u}from"./index-DH-M5T-F.js";import{D as y}from"./data-table-BWSuqf5m.js";import{B as E}from"./badge-B-Xe92Tx.js";import{B as S}from"./button-BZKmkDjW.js";import{D}from"./delta-D4_Tipf4.js";import{f as p,a as f}from"./utils-pm6Xa0Qd.js";import{S as l,a as T}from"./sample-data-DlVwqcXX.js";import{P as V}from"./package-open-ikfSYjs9.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./select-oRfq6VYn.js";import"./Combination-BkzcTUOc.js";import"./index-B0PXCDJg.js";import"./index-C5qX--6C.js";import"./index-DW-t51uL.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./index-rhYpeUg2.js";const ne={title:"元件/資料/資料表 DataTable"},L={draft:"secondary",confirmed:"info",done:"success",void:"danger"},w=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>f(e.qty),sortValue:e=>e.qty,total:e=>f(e.reduce((t,r)=>t+r.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>p(e.amount),sortValue:e=>e.amount,total:e=>p(e.reduce((t,r)=>t+r.amount,0))},{key:"status",header:"狀態",cell:e=>a.jsx(E,{variant:L[e.status],children:l[e.status]}),sortValue:e=>l[e.status],filterText:e=>l[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],n={render:()=>a.jsx(y,{rows:T,columns:w,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,l[e.status],e.createdAt],fileName:"records.csv"}}),play:async({canvasElement:e})=>{const t=m(e),r=e.ownerDocument,o=t.getByRole("button",{name:/^單位/});await s.click(o),await d(()=>u(o.closest("th")).toHaveAttribute("aria-sort","descending")),await s.click(o),await d(()=>u(o.closest("th")).toHaveAttribute("aria-sort","ascending")),await s.click(t.getByRole("button",{name:"篩選 單位"})),await m(r.body).findAllByRole("checkbox"),await s.keyboard("{Escape}"),await d(()=>u(m(r.body).queryAllByRole("checkbox")).toHaveLength(0))}},c={render:()=>a.jsx(y,{rows:[],columns:w,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:a.jsx(V,{className:"size-7"}),action:a.jsx(S,{size:"sm",children:"新增一筆"})}})},i={render:()=>{const e=[...w.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:t=>a.jsx(D,{value:t.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:p}),sortValue:t=>t.amount-1e5}];return a.jsx(y,{rows:T.slice(0,6),columns:e,getRowKey:t=>t.id,dense:!0,searchable:!1})}};var h,g,b;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <DataTable rows={demoRecords} columns={columns} getRowKey={r => r.id} initialSort={{
    key: "amount",
    dir: "desc"
  }} pageSize={5} csv={{
    headers: ["編號", "單位", "項目", "分類", "數量", "金額", "狀態", "建立日期"],
    row: r => [r.id, r.unit, r.name, r.category, r.qty, r.amount, STATUS_LABEL[r.status], r.createdAt],
    fileName: "records.csv"
  }} />,
  // 排序：點欄頭 → th 的 aria-sort 連動（首擊 desc——後台先看大的，再擊 asc）；
  // 篩選：面板 portal 到 body、選項是 role=checkbox、Esc 收回。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const sortBtn = canvas.getByRole("button", {
      name: /^單位/
    });
    await userEvent.click(sortBtn);
    await waitFor(() => expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "descending"));
    await userEvent.click(sortBtn);
    await waitFor(() => expect(sortBtn.closest("th")).toHaveAttribute("aria-sort", "ascending"));
    await userEvent.click(canvas.getByRole("button", {
      name: "篩選 單位"
    }));
    await within(doc.body).findAllByRole("checkbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(doc.body).queryAllByRole("checkbox")).toHaveLength(0));
  }
}`,...(b=(g=n.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var k,x,v;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(v=(x=c.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var B,A,R;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(R=(A=i.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};const ce=["完整功能","空狀態","密集模式與變異欄"];export{ce as __namedExportsOrder,ne as default,n as 完整功能,i as 密集模式與變異欄,c as 空狀態};
