import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-BFQ_Q9OP.js";import{D as S}from"./data-table-CFF77T8S.js";import{B as m}from"./badge-B-Xe92Tx.js";import{B as o}from"./button-i72Edb48.js";import{T}from"./tab-pills-6ZSblm0o.js";import{E as k}from"./empty-state-BjzKLH_M.js";import{a as A,f as x}from"./utils-pm6Xa0Qd.js";import{a as r,S as a}from"./sample-data-DlVwqcXX.js";import{P as c}from"./plus-CK8V5P7p.js";import{P as w}from"./package-open-U624fOhV.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./table-BcYJvUkN.js";import"./index-YW0vehpY.js";import"./Combination-DsSBML8Q.js";import"./index-DdXKfkXy.js";import"./select-CbCVKR29.js";import"./createLucideIcon-DDRU598s.js";import"./check-SsieMrcg.js";import"./tooltip-1GOoMEVs.js";import"./x-C3WrzgWc.js";import"./index-rhYpeUg2.js";const $={title:"頁面/清單頁"},B={draft:"secondary",confirmed:"info",done:"success",void:"danger"},R=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"amount",header:"金額",numeric:!0,cell:e=>x(e.amount),sortValue:e=>e.amount,total:e=>x(e.reduce((n,i)=>n+i.amount,0))},{key:"status",header:"狀態",cell:e=>t.jsx(m,{variant:B[e.status],children:a[e.status]}),sortValue:e=>a[e.status],filterText:e=>a[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],d={render:function(){const[n,i]=y.useState("all"),j=n==="all"?r:r.filter(s=>s.status===n),u=s=>r.filter(N=>N.status===s).length;return t.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[t.jsxs("div",{className:"flex flex-wrap items-end justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-semibold",children:"項目清單"}),t.jsxs("p",{className:"text-sm text-muted-foreground",children:["共 ",r.length," 筆・最後更新 2024-02-07"]})]}),t.jsxs(o,{children:[t.jsx(c,{})," 新增項目"]})]}),t.jsx(T,{label:"處理狀態",value:n,onChange:s=>i(s),tabs:[{key:"all",label:"全部"},{key:"draft",label:a.draft,badge:t.jsx(m,{variant:"secondary",children:u("draft")})},{key:"confirmed",label:a.confirmed,badge:t.jsx(m,{variant:"info",children:u("confirmed")})},{key:"done",label:a.done},{key:"void",label:a.void}]}),t.jsx(S,{rows:j,columns:R,getRowKey:s=>s.id,initialSort:{key:"createdAt",dir:"desc"},pageSize:10,onRowClick:()=>{},csv:{headers:["編號","單位","項目","金額","狀態","建立日期"],row:s=>[s.id,s.unit,s.name,s.amount,a[s.status],s.createdAt],fileName:"records.csv"}}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"列本身就是入口：點任一列進明細頁。逐列動作不做一排圖示，收斂進明細頁的動作區。"})]})}},l={render:()=>t.jsxs("div",{className:"mx-auto grid max-w-5xl gap-6 lg:grid-cols-2",children:[t.jsxs("div",{className:"space-y-4",children:[t.jsx("p",{className:"text-sm font-medium",children:"首次進入（真的沒有資料）：頁首照常、內容區給下一步"}),t.jsxs("div",{className:"flex items-end justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-semibold",children:"項目清單"}),t.jsx("p",{className:"text-sm text-muted-foreground",children:"共 0 筆"})]}),t.jsxs(o,{children:[t.jsx(c,{})," 新增項目"]})]}),t.jsx("div",{className:"rounded-lg border",children:t.jsx(k,{icon:t.jsx(w,{className:"size-7"}),title:"還沒有任何項目",hint:"建立第一筆後，這裡會顯示明細與合計。",action:t.jsx(o,{size:"sm",children:"新增一筆"})})})]}),t.jsxs("div",{className:"space-y-4",children:[t.jsx("p",{className:"text-sm font-medium",children:"載入中：保留版面高度，不讓頁面跳動（Skeleton 元件尚未收錄）"}),t.jsxs("div",{className:"flex items-end justify-between gap-3",children:[t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-semibold",children:"項目清單"}),t.jsx("p",{className:"text-sm text-muted-foreground",children:"載入中…"})]}),t.jsxs(o,{disabled:!0,children:[t.jsx(c,{})," 新增項目"]})]}),t.jsx("div",{className:"flex min-h-64 items-center justify-center rounded-lg border",role:"status",children:t.jsx("p",{className:"text-sm text-muted-foreground",children:"正在載入清單…"})}),t.jsxs("p",{className:"text-xs text-muted-foreground",children:["數字還沒回來就先顯示「",A(0),"」是錯的——0 是一個答案，載入中不是。"]})]})]})};var f,p,h;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [tab, setTab] = useState<"all" | RecordStatus>("all");
    const rows = tab === "all" ? demoRecords : demoRecords.filter(r => r.status === tab);
    const count = (s: RecordStatus) => demoRecords.filter(r => r.status === s).length;
    return <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：識別＋筆數＋唯一的主要動作（固定右上） */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">共 {demoRecords.length} 筆・最後更新 2024-02-07</p>
          </div>
          <Button><Plus /> 新增項目</Button>
        </div>

        {/* 工具區：檢視切換（實務上這個狀態要寫進網址，深連結才回得來） */}
        <TabPills label="處理狀態" value={tab} onChange={k => setTab(k as "all" | RecordStatus)} tabs={[{
        key: "all",
        label: "全部"
      }, {
        key: "draft",
        label: STATUS_LABEL.draft,
        badge: <Badge variant="secondary">{count("draft")}</Badge>
      }, {
        key: "confirmed",
        label: STATUS_LABEL.confirmed,
        badge: <Badge variant="info">{count("confirmed")}</Badge>
      }, {
        key: "done",
        label: STATUS_LABEL.done
      }, {
        key: "void",
        label: STATUS_LABEL.void
      }]} />

        {/* 內容區：資料表自帶搜尋、欄篩選、分頁、合計與匯出（細則見資料表標準） */}
        <DataTable rows={rows} columns={columns} getRowKey={r => r.id} initialSort={{
        key: "createdAt",
        dir: "desc"
      }} pageSize={10} onRowClick={() => {}} csv={{
        headers: ["編號", "單位", "項目", "金額", "狀態", "建立日期"],
        row: r => [r.id, r.unit, r.name, r.amount, STATUS_LABEL[r.status], r.createdAt],
        fileName: "records.csv"
      }} />
        <p className="text-xs text-muted-foreground">
          列本身就是入口：點任一列進明細頁。逐列動作不做一排圖示，收斂進明細頁的動作區。
        </p>
      </div>;
  }
}`,...(h=(p=d.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var g,v,b;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-medium">首次進入（真的沒有資料）：頁首照常、內容區給下一步</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">共 0 筆</p>
          </div>
          <Button><Plus /> 新增項目</Button>
        </div>
        <div className="rounded-lg border">
          <EmptyState icon={<PackageOpen className="size-7" />} title="還沒有任何項目" hint="建立第一筆後，這裡會顯示明細與合計。" action={<Button size="sm">新增一筆</Button>} />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">載入中：保留版面高度，不讓頁面跳動（Skeleton 元件尚未收錄）</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">項目清單</h1>
            <p className="text-sm text-muted-foreground">載入中…</p>
          </div>
          <Button disabled><Plus /> 新增項目</Button>
        </div>
        <div className="flex min-h-64 items-center justify-center rounded-lg border" role="status">
          <p className="text-sm text-muted-foreground">正在載入清單…</p>
        </div>
        <p className="text-xs text-muted-foreground">
          數字還沒回來就先顯示「{formatNumber(0)}」是錯的——0 是一個答案，載入中不是。
        </p>
      </div>
    </div>
}`,...(b=(v=l.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const ee=["典型組成","空與載入"];export{ee as __namedExportsOrder,$ as default,d as 典型組成,l as 空與載入};
