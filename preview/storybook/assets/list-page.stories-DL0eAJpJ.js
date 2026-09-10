import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as N}from"./index-UiW3gZKV.js";import{D as T}from"./data-table-CMjlPUn2.js";import{B as m}from"./badge-Cl3jk1vO.js";import{B as d}from"./button-Cw_3_x2n.js";import{T as k}from"./tab-pills-BWBDaVy_.js";import{E as A}from"./empty-state-99jlnPRN.js";import{P as c}from"./page-header-DitvXJdl.js";import{a as B,f as x}from"./utils-DBXtLcuW.js";import{a as n,S as s}from"./sample-data-I9KaR9SF.js";import{P as u}from"./plus-Bz5CK1Id.js";import{P}from"./package-open-ikfSYjs9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-BjHUlWCA.js";import"./skeleton-CpwypqWR.js";import"./input-kuo8quod.js";import"./select-BbRzm7y4.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-VXoYh6zd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./createLucideIcon-BcR0bl2m.js";import"./check-CZys2X9e.js";import"./tooltip-CyZzvjef.js";import"./checkbox-B4Z_93Kg.js";import"./popover-CK_dJ5Ux.js";import"./dropdown-menu-Hfmcpkw1.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./chevron-right-DWuV1wB0.js";import"./index-C9IEqVQG.js";const ue={title:"頁面/清單頁"},R={draft:"secondary",confirmed:"info",done:"success",void:"danger"},w=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"amount",header:"金額",numeric:!0,cell:e=>x(e.amount),sortValue:e=>e.amount,total:e=>x(e.reduce((r,l)=>r+l.amount,0))},{key:"status",header:"狀態",cell:e=>t.jsx(m,{variant:R[e.status],children:s[e.status]}),sortValue:e=>s[e.status],filterText:e=>s[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],o={render:function(){const[r,l]=N.useState("all"),j=r==="all"?n:n.filter(a=>a.status===r),p=a=>n.filter(S=>S.status===a).length;return t.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[t.jsx(c,{title:"項目清單",meta:`共 ${n.length} 筆・最後更新 2024-02-07`,actions:t.jsxs(d,{children:[t.jsx(u,{})," 新增項目"]})}),t.jsx(k,{label:"處理狀態",value:r,onChange:a=>l(a),tabs:[{key:"all",label:"全部"},{key:"draft",label:s.draft,badge:t.jsx(m,{variant:"secondary",children:p("draft")})},{key:"confirmed",label:s.confirmed,badge:t.jsx(m,{variant:"info",children:p("confirmed")})},{key:"done",label:s.done},{key:"void",label:s.void}]}),t.jsx(T,{rows:j,columns:w,getRowKey:a=>a.id,initialSort:{key:"createdAt",dir:"desc"},pageSize:10,onRowClick:()=>{},csv:{headers:["編號","單位","項目","金額","狀態","建立日期"],row:a=>[a.id,a.unit,a.name,a.amount,s[a.status],a.createdAt],fileName:"records.csv"}}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"列本身就是入口：點任一列進明細頁。逐列動作不做一排圖示，收斂進明細頁的動作區。"})]})}},i={render:()=>t.jsxs("div",{className:"mx-auto grid max-w-5xl gap-6 lg:grid-cols-2",children:[t.jsxs("div",{className:"space-y-4",children:[t.jsx("p",{className:"text-sm font-medium",children:"首次進入（真的沒有資料）：頁首照常、內容區給下一步"}),t.jsx(c,{title:"項目清單",meta:"共 0 筆",actions:t.jsxs(d,{children:[t.jsx(u,{})," 新增項目"]})}),t.jsx("div",{className:"rounded-lg border",children:t.jsx(A,{icon:t.jsx(P,{className:"size-7"}),title:"還沒有任何項目",hint:"建立第一筆後，這裡會顯示明細與合計。",action:t.jsx(d,{size:"sm",children:"新增一筆"})})})]}),t.jsxs("div",{className:"space-y-4",children:[t.jsx("p",{className:"text-sm font-medium",children:"載入中：保留版面高度，不讓頁面跳動（Skeleton 元件尚未收錄）"}),t.jsx(c,{title:"項目清單",meta:"載入中…",actions:t.jsxs(d,{disabled:!0,children:[t.jsx(u,{})," 新增項目"]})}),t.jsx("div",{className:"flex min-h-64 items-center justify-center rounded-lg border",role:"status",children:t.jsx("p",{className:"text-sm text-muted-foreground",children:"正在載入清單…"})}),t.jsxs("p",{className:"text-xs text-muted-foreground",children:["數字還沒回來就先顯示「",B(0),"」是錯的——0 是一個答案，載入中不是。"]})]})]})};var f,g,b;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [tab, setTab] = useState<"all" | RecordStatus>("all");
    const rows = tab === "all" ? demoRecords : demoRecords.filter(r => r.status === tab);
    const count = (s: RecordStatus) => demoRecords.filter(r => r.status === s).length;
    return <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：識別＋筆數＋唯一的主要動作（固定右上）。版型由 PageHeader 定型 */}
        <PageHeader title="項目清單" meta={\`共 \${demoRecords.length} 筆・最後更新 2024-02-07\`} actions={<Button><Plus /> 新增項目</Button>} />

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
}`,...(b=(g=o.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var h,v,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-medium">首次進入（真的沒有資料）：頁首照常、內容區給下一步</p>
        <PageHeader title="項目清單" meta="共 0 筆" actions={<Button><Plus /> 新增項目</Button>} />
        <div className="rounded-lg border">
          <EmptyState icon={<PackageOpen className="size-7" />} title="還沒有任何項目" hint="建立第一筆後，這裡會顯示明細與合計。" action={<Button size="sm">新增一筆</Button>} />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">載入中：保留版面高度，不讓頁面跳動（Skeleton 元件尚未收錄）</p>
        <PageHeader title="項目清單" meta="載入中…" actions={<Button disabled><Plus /> 新增項目</Button>} />
        <div className="flex min-h-64 items-center justify-center rounded-lg border" role="status">
          <p className="text-sm text-muted-foreground">正在載入清單…</p>
        </div>
        <p className="text-xs text-muted-foreground">
          數字還沒回來就先顯示「{formatNumber(0)}」是錯的——0 是一個答案，載入中不是。
        </p>
      </div>
    </div>
}`,...(y=(v=i.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};const pe=["典型組成","空與載入"];export{pe as __namedExportsOrder,ue as default,o as 典型組成,i as 空與載入};
