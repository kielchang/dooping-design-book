import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{within as p,userEvent as n,waitFor as y,expect as g}from"./index-DH-M5T-F.js";import{D as d}from"./data-table-BWSuqf5m.js";import{B as V}from"./badge-B-Xe92Tx.js";import{B as j}from"./button-BZKmkDjW.js";import{D as L}from"./delta-D4_Tipf4.js";import{f as b,a as w}from"./utils-pm6Xa0Qd.js";import{S as m,a as D}from"./sample-data-DlVwqcXX.js";import{a as q}from"./generate-Bsle_8tt.js";import{P as K}from"./package-open-ikfSYjs9.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./select-oRfq6VYn.js";import"./Combination-BkzcTUOc.js";import"./index-B0PXCDJg.js";import"./index-C5qX--6C.js";import"./index-DW-t51uL.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./index-rhYpeUg2.js";const ue={title:"元件/資料/資料表 DataTable"},N={draft:"secondary",confirmed:"info",done:"success",void:"danger"},u=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>w(e.qty),sortValue:e=>e.qty,total:e=>w(e.reduce((t,a)=>t+a.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>b(e.amount),sortValue:e=>e.amount,total:e=>b(e.reduce((t,a)=>t+a.amount,0))},{key:"status",header:"狀態",cell:e=>o.jsx(V,{variant:N[e.status],children:m[e.status]}),sortValue:e=>m[e.status],filterText:e=>m[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],s={render:()=>o.jsx(d,{rows:D,columns:u,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,m[e.status],e.createdAt],fileName:"records.csv"}}),play:async({canvasElement:e})=>{const t=p(e),a=e.ownerDocument,r=t.getByRole("button",{name:/^單位/});await n.click(r),await y(()=>g(r.closest("th")).toHaveAttribute("aria-sort","descending")),await n.click(r),await y(()=>g(r.closest("th")).toHaveAttribute("aria-sort","ascending")),await n.click(t.getByRole("button",{name:"篩選 單位"})),await p(a.body).findAllByRole("checkbox"),await n.keyboard("{Escape}"),await y(()=>g(p(a.body).queryAllByRole("checkbox")).toHaveLength(0))}},c={render:()=>o.jsx(d,{rows:[],columns:u,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:o.jsx(K,{className:"size-7"}),action:o.jsx(j,{size:"sm",children:"新增一筆"})}})},i={render:()=>{const e=[...u.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:t=>o.jsx(L,{value:t.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:b}),sortValue:t=>t.amount-1e5}];return o.jsx(d,{rows:D.slice(0,6),columns:e,getRowKey:t=>t.id,dense:!0,searchable:!1})}},l={args:{資料筆數:42,每頁筆數:15,斑馬紋:!0,密集模式:!1,十字對準:!0,可調欄寬:!0,超長名稱:!1,載入中:!1},argTypes:{資料筆數:{control:{type:"range",min:0,max:200,step:1}},每頁筆數:{control:"inline-radio",options:[5,15,30,50]},斑馬紋:{control:"boolean"},密集模式:{control:"boolean"},十字對準:{control:"boolean"},可調欄寬:{control:"boolean"},超長名稱:{control:"boolean"},載入中:{control:"boolean"}},render:e=>o.jsx(d,{rows:q(e.資料筆數,{longNameRatio:e.超長名稱?.15:0}),columns:u,getRowKey:t=>t.id,pageSize:e.每頁筆數,zebra:e.斑馬紋,dense:e.密集模式,crosshair:e.十字對準,resizable:e.可調欄寬,loading:e.載入中},e.每頁筆數)};var f,h,k;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(k=(h=s.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var x,R,v;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(v=(R=c.parameters)==null?void 0:R.docs)==null?void 0:v.source}}};var B,A,T;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(T=(A=i.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var S,E,z;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    資料筆數: 42,
    每頁筆數: 15,
    斑馬紋: true,
    密集模式: false,
    十字對準: true,
    可調欄寬: true,
    超長名稱: false,
    載入中: false
  },
  argTypes: {
    資料筆數: {
      control: {
        type: "range",
        min: 0,
        max: 200,
        step: 1
      }
    },
    每頁筆數: {
      control: "inline-radio",
      options: [5, 15, 30, 50]
    },
    斑馬紋: {
      control: "boolean"
    },
    密集模式: {
      control: "boolean"
    },
    十字對準: {
      control: "boolean"
    },
    可調欄寬: {
      control: "boolean"
    },
    超長名稱: {
      control: "boolean"
    },
    載入中: {
      control: "boolean"
    }
  },
  render: a => <DataTable
  // pageSize 是內部分頁 state 的初值，改 arg 必須 remount 才會生效；
  // rows 刻意不進 key——調筆數時保留既有的排序與篩選，才能玩「條件不變、資料變」
  key={a.每頁筆數} rows={makeRecords(a.資料筆數, {
    longNameRatio: a.超長名稱 ? 0.15 : 0
  })} columns={columns} getRowKey={r => r.id} pageSize={a.每頁筆數} zebra={a.斑馬紋} dense={a.密集模式} crosshair={a.十字對準} resizable={a.可調欄寬} loading={a.載入中} />
}`,...(z=(E=l.parameters)==null?void 0:E.docs)==null?void 0:z.source}}};const pe=["完整功能","空狀態","密集模式與變異欄","互動"];export{pe as __namedExportsOrder,ue as default,l as 互動,s as 完整功能,i as 密集模式與變異欄,c as 空狀態};
