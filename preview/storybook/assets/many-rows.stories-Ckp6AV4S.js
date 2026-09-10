import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{D as m}from"./data-table-DGN2E3g0.js";import{B as v}from"./badge-Cl3jk1vO.js";import{a as l,f as u}from"./utils-DBXtLcuW.js";import{S as p}from"./sample-data-I9KaR9SF.js";import{m as d}from"./generate-stress-mfYj4AO0.js";import{P as b}from"./package-open-ikfSYjs9.js";import"./index-UiW3gZKV.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-BjHUlWCA.js";import"./empty-state-99jlnPRN.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-CpwypqWR.js";import"./input-kuo8quod.js";import"./button-Cw_3_x2n.js";import"./index-VXoYh6zd.js";import"./index-C9IEqVQG.js";import"./select-BbRzm7y4.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CyZzvjef.js";import"./checkbox-B4Z_93Kg.js";import"./popover-CK_dJ5Ux.js";import"./dropdown-menu-Hfmcpkw1.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";const ce={title:"壓力測試/超多筆"},z={draft:"secondary",confirmed:"info",done:"success",void:"danger"},i=[{key:"id",header:"編號",cell:e=>e.id,sortValue:e=>e.id},{key:"name",header:"項目",truncate:200,cell:e=>e.name,filterText:e=>e.name},{key:"qty",header:"數量",numeric:!0,cell:e=>l(e.qty),sortValue:e=>e.qty,total:e=>l(e.reduce((r,c)=>r+c.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>u(e.amount),sortValue:e=>e.amount,total:e=>u(e.reduce((r,c)=>r+c.amount,0))},{key:"status",header:"狀態",cell:e=>t.jsx(v,{variant:z[e.status],children:p[e.status]}),sortValue:e=>p[e.status],filter:"select",filterText:e=>p[e.status]}],s={render:()=>t.jsxs("div",{className:"space-y-2",children:[t.jsx("p",{className:"text-sm font-medium",children:"42 筆、每頁 15——剛好跨過門檻式分頁的線"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：分頁器這時才第一次出現，位置與行為對嗎？ 合計列算的是**篩選後全部 42 筆**，不是當頁 15 筆——拿第一頁的金額心算一下就能抓到這種錯。"}),t.jsx(m,{rows:d({count:42}),columns:i,getRowKey:e=>e.id,pageSize:15})]})},a={render:()=>t.jsxs("div",{className:"space-y-2",children:[t.jsx("p",{className:"text-sm font-medium",children:"200 筆、每頁 50、黏性表頭"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：捲動順不順？切頁順不順？搜尋打一個字的反應時間能不能接受？ 這是「上線第一週就會遇到」的資料量，不是罕見狀況。"}),t.jsx(m,{rows:d({count:200}),columns:i,getRowKey:e=>e.id,pageSize:50,stickyHeader:!0,maxHeight:"420px"})]})},o={render:()=>t.jsxs("div",{className:"space-y-2",children:[t.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：0 筆"}),t.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：空狀態有標題、說明與下一步，不是一個空白的表框； 分頁器與合計列這時都不該出現。"}),t.jsx(m,{rows:[],columns:i,getRowKey:e=>e.id,empty:{title:"還沒有任何紀錄",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:t.jsx(b,{className:"size-7"})}})]})},n={args:{資料筆數:42,每頁筆數:15,斑馬紋:!0},argTypes:{資料筆數:{control:{type:"range",min:0,max:200,step:1}},每頁筆數:{control:"inline-radio",options:[5,15,30,50]},斑馬紋:{control:"boolean"}},render:e=>t.jsx(m,{rows:d({count:e.資料筆數}),columns:i,getRowKey:r=>r.id,pageSize:e.每頁筆數,zebra:e.斑馬紋,empty:{title:"還沒有任何紀錄",hint:"把「資料筆數」往右拉就有了。"}},`${e.資料筆數}-${e.每頁筆數}`)};var x,g,y;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">42 筆、每頁 15——剛好跨過門檻式分頁的線</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：分頁器這時才第一次出現，位置與行為對嗎？
        合計列算的是**篩選後全部 42 筆**，不是當頁 15 筆——拿第一頁的金額心算一下就能抓到這種錯。
      </p>
      <DataTable rows={makeRecords({
      count: 42
    })} columns={columns} getRowKey={r => r.id} pageSize={15} />
    </div>
}`,...(y=(g=s.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var f,N,h;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">200 筆、每頁 50、黏性表頭</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：捲動順不順？切頁順不順？搜尋打一個字的反應時間能不能接受？
        這是「上線第一週就會遇到」的資料量，不是罕見狀況。
      </p>
      <DataTable rows={makeRecords({
      count: 200
    })} columns={columns} getRowKey={r => r.id} pageSize={50} stickyHeader maxHeight="420px" />
    </div>
}`,...(h=(N=a.parameters)==null?void 0:N.docs)==null?void 0:h.source}}};var j,w,R;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <p className="text-sm font-medium">「沒有」那一側：0 筆</p>
      <p className="text-xs text-muted-foreground">
        該看什麼：空狀態有標題、說明與下一步，不是一個空白的表框；
        分頁器與合計列這時都不該出現。
      </p>
      <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
      title: "還沒有任何紀錄",
      hint: "建立第一筆後，這裡會顯示明細與合計。",
      icon: <PackageOpen className="size-7" />
    }} />
    </div>
}`,...(R=(w=o.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var S,k,T;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    資料筆數: 42,
    每頁筆數: 15,
    斑馬紋: true
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
    }
  },
  render: a => <DataTable key={\`\${a.資料筆數}-\${a.每頁筆數}\`} rows={makeRecords({
    count: a.資料筆數
  })} columns={columns} getRowKey={r => r.id} pageSize={a.每頁筆數} zebra={a.斑馬紋} empty={{
    title: "還沒有任何紀錄",
    hint: "把「資料筆數」往右拉就有了。"
  }} />
}`,...(T=(k=n.parameters)==null?void 0:k.docs)==null?void 0:T.source}}};const pe=["四十二筆","兩百筆","零筆","互動"];export{pe as __namedExportsOrder,ce as default,n as 互動,a as 兩百筆,s as 四十二筆,o as 零筆};
