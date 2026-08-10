import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-UiW3gZKV.js";import{within as u,userEvent as l,expect as c,waitFor as w}from"./index-DH-M5T-F.js";import{D as g}from"./data-table-YnBmSkHT.js";import{B as pe}from"./badge-B-Xe92Tx.js";import{B as N}from"./button-PlLiai67.js";import{D as we}from"./delta-D4_Tipf4.js";import{f as j,a as z}from"./utils-pm6Xa0Qd.js";import{s as V}from"./play-B_tfD0rJ.js";import{S as q,a as h}from"./sample-data-I9KaR9SF.js";import{a as ge}from"./generate-Bsle_8tt.js";import{P as be}from"./package-open-ikfSYjs9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./select-BimLQx0-.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-VXoYh6zd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./checkbox-OptVgWvT.js";import"./popover-CfLROtjL.js";import"./dropdown-menu-BGKoUATf.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./index-rhYpeUg2.js";const fe={get:()=>typeof window>"u"?"":window.location.search.replace(/^\?/,""),set:e=>{if(typeof window>"u")return;const t=`${window.location.pathname}${e?`?${e}`:""}${window.location.hash}`;window.history.replaceState(window.history.state,"",t),window.dispatchEvent(new PopStateEvent("popstate"))},subscribe:e=>typeof window>"u"?()=>{}:(window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e))},he={page:0,pageSize:15,query:"",sort:null,filters:{}},D=encodeURIComponent,C=e=>e.map(D).join(","),F=e=>e.split(",").filter(Boolean).map(decodeURIComponent);function Be(e,t,a=""){const n=new URLSearchParams,o=m=>`${a}${m}`;e.query.trim()!==t.query&&n.set(o("q"),e.query.trim()),e.page!==t.page&&n.set(o("page"),String(e.page+1)),e.pageSize!==t.pageSize&&n.set(o("size"),String(e.pageSize)),e.sort&&(t.sort===null||e.sort.key!==t.sort.key||e.sort.dir!==t.sort.dir)&&n.set(o("sort"),`${e.sort.key}.${e.sort.dir}`);for(const[m,r]of Object.entries(e.filters))r.values.length>0&&n.set(o(`f.${m}`),C(r.values)),r.texts.length>0&&n.set(o(`ft.${m}`),C(r.texts)),(r.min!==""||r.max!=="")&&n.set(o(`fr.${m}`),`${D(r.min)}..${D(r.max)}`);return n.toString()}function H(e,t,a=""){const n=new URLSearchParams(e),o={...t,filters:{...t.filters}},m=r=>a&&r.startsWith(a)?r.slice(a.length):a?null:r;for(const[r,d]of n.entries()){const p=m(r);if(p!==null){if(p==="q")o.query=d;else if(p==="page"){const i=Number(d);Number.isInteger(i)&&i>=1&&(o.page=i-1)}else if(p==="size"){const i=Number(d);Number.isInteger(i)&&i>0&&(o.pageSize=i)}else if(p==="sort"){const i=d.match(/^(.+)\.(asc|desc)$/);i&&(o.sort={key:i[1],dir:i[2]})}else if(p.startsWith("f.")){const i=p.slice(2);o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},values:F(d)}}else if(p.startsWith("ft.")){const i=p.slice(3);o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},texts:F(d)}}else if(p.startsWith("fr.")){const i=p.slice(3),f=d.match(/^(.*)\.\.(.*)$/);f&&(o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},min:decodeURIComponent(f[1]),max:decodeURIComponent(f[2])})}}}return o}function Re(e={}){const{adapter:t=fe,prefix:a=""}=e,n=y.useMemo(()=>({...he,...e.defaults}),[JSON.stringify(e.defaults)]),o=y.useSyncExternalStore(t.subscribe,t.get,()=>""),m=y.useMemo(()=>H(o,n,a),[o,n,a]),r=y.useCallback(d=>{const{selection:p,hiddenColumns:i,...f}=d;if(Object.keys(f).length===0)return;const me=["query","filters","sort","pageSize"].some(ye=>ye in f),de={...H(t.get(),n,a),...me&&!("page"in f)?{page:0}:{},...f};t.set(Be(de,n,a))},[t,n,a]);return{state:m,onStateChange:r}}const mt={title:"元件/資料/資料表 DataTable"},ve={draft:"secondary",confirmed:"info",done:"success",void:"danger"},b=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>z(e.qty),sortValue:e=>e.qty,total:e=>z(e.reduce((t,a)=>t+a.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>j(e.amount),sortValue:e=>e.amount,total:e=>j(e.reduce((t,a)=>t+a.amount,0))},{key:"status",header:"狀態",cell:e=>s.jsx(pe,{variant:ve[e.status],children:q[e.status]}),sortValue:e=>q[e.status],filterText:e=>q[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],B={render:()=>s.jsx(g,{rows:h,columns:b,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,q[e.status],e.createdAt],fileName:"records.csv"}}),play:async({canvasElement:e})=>{const t=u(e),a=e.ownerDocument,n=t.getByRole("button",{name:/^單位/});await l.click(n),await w(()=>c(n.closest("th")).toHaveAttribute("aria-sort","descending")),await l.click(n),await w(()=>c(n.closest("th")).toHaveAttribute("aria-sort","ascending")),await l.click(t.getByRole("button",{name:"篩選 單位"})),await u(a.body).findAllByRole("checkbox"),await l.keyboard("{Escape}"),await w(()=>c(u(a.body).queryAllByRole("checkbox")).toHaveLength(0))}},R={render:()=>s.jsx(g,{rows:[],columns:b,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:s.jsx(be,{className:"size-7"}),action:s.jsx(N,{size:"sm",children:"新增一筆"})}})},v={render:()=>{const e=[...b.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:t=>s.jsx(we,{value:t.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:j}),sortValue:t=>t.amount-1e5}];return s.jsx(g,{rows:h.slice(0,6),columns:e,getRowKey:t=>t.id,dense:!0,searchable:!1})}},x={args:{資料筆數:42,每頁筆數:15,斑馬紋:!0,密集模式:!1,十字對準:!0,可調欄寬:!0,超長名稱:!1,載入中:!1},argTypes:{資料筆數:{control:{type:"range",min:0,max:200,step:1}},每頁筆數:{control:"inline-radio",options:[5,15,30,50]},斑馬紋:{control:"boolean"},密集模式:{control:"boolean"},十字對準:{control:"boolean"},可調欄寬:{control:"boolean"},超長名稱:{control:"boolean"},載入中:{control:"boolean"}},render:e=>s.jsx(g,{rows:ge(e.資料筆數,{longNameRatio:e.超長名稱?.15:0}),columns:b,getRowKey:t=>t.id,pageSize:e.每頁筆數,zebra:e.斑馬紋,dense:e.密集模式,crosshair:e.十字對準,resizable:e.可調欄寬,loading:e.載入中},e.每頁筆數)},k={render:()=>s.jsx(g,{rows:h,columns:b,getRowKey:e=>e.id,facets:["status","unit"]}),play:async({canvasElement:e})=>{const t=u(e),a=e.ownerDocument;await l.click(t.getAllByRole("button",{name:"狀態"})[0]);const n=await u(a.body).findByRole("dialog"),o=u(n).getByRole("checkbox",{name:/已確認/});await c(o).toHaveTextContent(/\d/),await l.click(o),await l.keyboard("{Escape}"),await w(()=>c(t.getByText("狀態：已確認")).toBeVisible());const m=t.getAllByRole("row");c(m.length).toBeGreaterThan(1),await l.click(t.getByRole("button",{name:/全部清除|移除 狀態：已確認/}))}};function xe(){const[e,t]=y.useState("");return s.jsxs("div",{className:"space-y-2",children:[e&&s.jsx("p",{className:"text-sm text-muted-foreground","data-testid":"bulk-result",children:e}),s.jsx(g,{rows:h,columns:b,getRowKey:a=>a.id,selectable:!0,bulkActions:({selected:a,clear:n})=>s.jsxs(s.Fragment,{children:[s.jsx(N,{size:"sm",variant:"outline",className:"h-7",onClick:()=>{t(`已匯出 ${a.length} 筆`),n()},children:"匯出所選"}),s.jsx(N,{size:"sm",variant:"destructive",className:"h-7",onClick:()=>{t(`已作廢 ${a.length} 筆`),n()},children:"作廢所選"})]})})]})}const E={render:()=>s.jsx(xe,{}),play:async({canvasElement:e})=>{const t=u(e);c(t.queryByRole("toolbar")).toBeNull();const a=t.getByRole("checkbox",{name:"選取 R-2401"});await l.click(a),await l.click(t.getByRole("checkbox",{name:"選取 R-2402"}));const n=await t.findByRole("toolbar",{name:"已選 2 筆"});u(n).getByRole("button",{name:"匯出所選"}).focus(),await l.keyboard("{ArrowRight}"),await c(u(n).getByRole("button",{name:"作廢所選"})).toHaveFocus(),await l.keyboard("{End}"),await c(u(n).getByRole("button",{name:"清除選取"})).toHaveFocus(),await l.click(u(n).getByRole("button",{name:"清除選取"})),await w(()=>c(t.queryByRole("toolbar")).toBeNull())}},S={render:()=>s.jsx(g,{rows:h,columns:b.map(e=>e.key==="createdAt"?{...e,defaultHidden:!0}:e),getRowKey:e=>e.id,columnVisibility:!0}),play:async({canvasElement:e})=>{const t=u(e),a=e.ownerDocument;await c(t.getByRole("columnheader",{name:/單位/})).toBeVisible(),c(t.queryByRole("columnheader",{name:/建立日期/})).toBeNull(),await l.click(t.getByRole("button",{name:"欄位"}));let n=await u(a.body).findByRole("menu");c(u(n).queryByRole("menuitemcheckbox",{name:"編號"})).toBeNull(),await l.click(u(n).getByRole("menuitemcheckbox",{name:"單位"})),await l.keyboard("{Escape}"),await w(()=>c(t.queryByRole("columnheader",{name:/單位/})).toBeNull()),await l.click(t.getByRole("button",{name:"欄位"})),n=await u(a.body).findByRole("menu"),await l.click(u(n).getByRole("menuitemcheckbox",{name:"建立日期"})),await l.keyboard("{Escape}"),await w(()=>c(t.getByRole("columnheader",{name:/建立日期/})).toBeVisible())}};function ke(){const[e,t]=y.useState(""),a=y.useRef(new Set),n=y.useMemo(()=>({get:()=>e,set:r=>{t(r),a.current.forEach(d=>d())},subscribe:r=>(a.current.add(r),()=>a.current.delete(r))}),[e]),{state:o,onStateChange:m}=Re({adapter:n});return s.jsxs("div",{className:"space-y-2",children:[s.jsxs("p",{className:"rounded border bg-muted px-2 py-1 font-mono text-xs","data-testid":"url",children:["?",e||"（全部預設，網址乾淨）"]}),s.jsx(g,{rows:h,columns:b,getRowKey:r=>r.id,pageSize:5,state:o,onStateChange:m})]})}const A={render:()=>s.jsx(ke,{}),play:async({canvasElement:e})=>{const t=u(e),a=()=>t.getByTestId("url").textContent??"";await l.click(t.getByRole("button",{name:/下一頁/})),await w(()=>c(a()).toContain("page=2"));const n=t.getByRole("textbox",{name:"搜尋關鍵字…"});V(n,"甲"),await w(()=>c(a()).toContain("q=")),await w(()=>c(a()).not.toContain("page=")),V(n,"")}},Ee={page:0,pageSize:5,query:"",sort:null,filters:{},hiddenColumns:[],selection:[]};function Se(){const[e,t]=y.useState(Ee),[a,n]=y.useState(!1),o=y.useRef(null),m=y.useRef(void 0);return y.useEffect(()=>()=>window.clearTimeout(m.current),[]),s.jsxs("div",{className:"space-y-2",children:[s.jsx("p",{className:"text-tiny text-muted-foreground",children:"排序、篩選、搜尋任一變更 → 900ms 模擬查詢：舊資料保留、變暗＋列脈動，表頭與工具列不動。"}),s.jsx(g,{rows:h,columns:b,getRowKey:r=>r.id,pageSize:5,facets:["status"],loading:a,state:e,onStateChange:(r,d)=>{"sort"in r||"filters"in r||"query"in r?(o.current=d,n(!0),window.clearTimeout(m.current),m.current=window.setTimeout(()=>{o.current&&t(o.current),n(!1)},900)):t(d)}})]})}const T={render:()=>s.jsx(Se,{}),play:async({canvasElement:e})=>{const t=u(e),a=t.getAllByRole("row").length;await l.click(t.getByRole("button",{name:"數量"})),await w(()=>c(t.getByRole("status")).toBeInTheDocument()),c(t.getAllByRole("row").length).toBe(a),c(t.getByRole("columnheader",{name:/數量/})).not.toHaveAttribute("aria-sort"),await w(()=>c(t.queryByRole("status")).toBeNull(),{timeout:2500}),c(t.getByRole("columnheader",{name:/數量/})).toHaveAttribute("aria-sort","descending")}};var L,I,$;B.parameters={...B.parameters,docs:{...(L=B.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...($=(I=B.parameters)==null?void 0:I.docs)==null?void 0:$.source}}};var K,U,_;R.parameters={...R.parameters,docs:{...(K=R.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(_=(U=R.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var M,O,P;v.parameters={...v.parameters,docs:{...(M=v.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(P=(O=v.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var W,G,J;x.parameters={...x.parameters,docs:{...(W=x.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(J=(G=x.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var Q,Y,X;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <DataTable rows={demoRecords} columns={columns} getRowKey={r => r.id} facets={["status", "unit"]} />,
  // 契約：facet 鈕與表頭篩選共用同一份狀態——勾選後列數變、篩選 chip 出現、鈕上出現數字。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    // 「狀態」同名者有二：工具列 facet 鈕與表頭排序鈕——工具列在 DOM 前面，取第一個
    await userEvent.click(canvas.getAllByRole("button", {
      name: "狀態"
    })[0]);
    const panel = await within(doc.body).findByRole("dialog");
    const option = within(panel).getByRole("checkbox", {
      name: /已確認/
    });
    // 逐值計數顯示在選項右側
    await expect(option).toHaveTextContent(/\\d/);
    await userEvent.click(option);
    await userEvent.keyboard("{Escape}");
    // 篩選 chip 與表頭篩選同一份狀態
    await waitFor(() => expect(canvas.getByText("狀態：已確認")).toBeVisible());
    const rows = canvas.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
    await userEvent.click(canvas.getByRole("button", {
      name: /全部清除|移除 狀態：已確認/
    }));
  }
}`,...(X=(Y=k.parameters)==null?void 0:Y.docs)==null?void 0:X.source}}};var Z,ee,te;E.parameters={...E.parameters,docs:{...(Z=E.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <BulkDemo />,
  // 契約：無選取不渲染工具列；表頭勾選只切當頁；方向鍵在列內移動焦點；清除即消失。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("toolbar")).toBeNull();
    const first = canvas.getByRole("checkbox", {
      name: "選取 R-2401"
    });
    await userEvent.click(first);
    await userEvent.click(canvas.getByRole("checkbox", {
      name: "選取 R-2402"
    }));
    const bar = await canvas.findByRole("toolbar", {
      name: "已選 2 筆"
    });
    // 方向鍵在列內移動焦點
    within(bar).getByRole("button", {
      name: "匯出所選"
    }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(within(bar).getByRole("button", {
      name: "作廢所選"
    })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(within(bar).getByRole("button", {
      name: "清除選取"
    })).toHaveFocus();
    await userEvent.click(within(bar).getByRole("button", {
      name: "清除選取"
    }));
    await waitFor(() => expect(canvas.queryByRole("toolbar")).toBeNull());
  }
}`,...(te=(ee=E.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ne,ae,oe;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <DataTable rows={demoRecords} columns={columns.map(c => c.key === "createdAt" ? {
    ...c,
    defaultHidden: true
  } : c)} getRowKey={r => r.id} columnVisibility />,
  // 契約：取消勾選的欄整欄消失；defaultHidden 初始就隱藏；凍結欄不在選單裡。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    // 先證明 columnheader 查得到（否則後面的「不存在」斷言全是空轉）
    await expect(canvas.getByRole("columnheader", {
      name: /單位/
    })).toBeVisible();
    expect(canvas.queryByRole("columnheader", {
      name: /建立日期/
    })).toBeNull();

    // 注意：Radix DropdownMenu 是 modal——開著時選單外的內容整個 aria-hidden，
    // 對表頭的斷言一律要在 Escape 關閉**之後**做，否則查不到（或空轉）。
    await userEvent.click(canvas.getByRole("button", {
      name: "欄位"
    }));
    let menu = await within(doc.body).findByRole("menu");
    expect(within(menu).queryByRole("menuitemcheckbox", {
      name: "編號"
    })).toBeNull(); // 凍結欄不可隱藏
    await userEvent.click(within(menu).getByRole("menuitemcheckbox", {
      name: "單位"
    }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("columnheader", {
      name: /單位/
    })).toBeNull());

    // 重開選單再把 defaultHidden 的欄打開
    await userEvent.click(canvas.getByRole("button", {
      name: "欄位"
    }));
    menu = await within(doc.body).findByRole("menu");
    await userEvent.click(within(menu).getByRole("menuitemcheckbox", {
      name: "建立日期"
    }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.getByRole("columnheader", {
      name: /建立日期/
    })).toBeVisible());
  }
}`,...(oe=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var re,se,ce;A.parameters={...A.parameters,docs:{...(re=A.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <UrlSyncDemo />,
  // 契約：搜尋寫進 q=、翻頁寫進 page=（1-based）、改條件自動回第 1 頁（page 參數消失）。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const url = () => canvas.getByTestId("url").textContent ?? "";
    await userEvent.click(canvas.getByRole("button", {
      name: /下一頁/
    }));
    await waitFor(() => expect(url()).toContain("page=2"));
    const input = canvas.getByRole("textbox", {
      name: "搜尋關鍵字…"
    });
    setInputValue(input, "甲");
    // 條件變更自動回第 1 頁：page 參數消失、q 出現
    await waitFor(() => expect(url()).toContain("q="));
    await waitFor(() => expect(url()).not.toContain("page="));
    setInputValue(input, "");
  }
}`,...(ce=(se=A.parameters)==null?void 0:se.docs)==null?void 0:ce.source}}};var ie,le,ue;T.parameters={...T.parameters,docs:{...(ie=T.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <RequeryLoadingDemo />,
  // 契約：重查期間舊內容保留（列數不變、排序尚未生效）、容器宣告載入；
  // 完成後載入收掉、新排序生效。變暗＋脈動是視覺語彙，語意靠 aria-busy 與 role="status"。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const rowsBefore = canvas.getAllByRole("row").length;
    await userEvent.click(canvas.getByRole("button", {
      name: "數量"
    }));
    await waitFor(() => expect(canvas.getByRole("status")).toBeInTheDocument());
    // 重查期間：舊內容與舊排序都還在
    expect(canvas.getAllByRole("row").length).toBe(rowsBefore);
    expect(canvas.getByRole("columnheader", {
      name: /數量/
    })).not.toHaveAttribute("aria-sort");
    // 模擬回應後：載入收掉、新排序生效（首次點擊＝降冪，見 use-sort）
    await waitFor(() => expect(canvas.queryByRole("status")).toBeNull(), {
      timeout: 2500
    });
    expect(canvas.getByRole("columnheader", {
      name: /數量/
    })).toHaveAttribute("aria-sort", "descending");
  }
}`,...(ue=(le=T.parameters)==null?void 0:le.docs)==null?void 0:ue.source}}};const dt=["完整功能","空狀態","密集模式與變異欄","互動","Facet_篩選","批次操作","欄位顯示","網址同步","重新查詢載入模擬"];export{k as Facet_篩選,dt as __namedExportsOrder,mt as default,x as 互動,B as 完整功能,v as 密集模式與變異欄,E as 批次操作,S as 欄位顯示,R as 空狀態,A as 網址同步,T as 重新查詢載入模擬};
