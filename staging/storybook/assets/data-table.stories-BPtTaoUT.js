import{j as c}from"./jsx-runtime-D_zvdyIk.js";import{r as w}from"./index-UiW3gZKV.js";import{within as m,userEvent as i,expect as r,waitFor as p}from"./index-DH-M5T-F.js";import{D as b}from"./data-table-CVaqZJok.js";import{B as he}from"./badge-BUiC31UU.js";import{B as j}from"./button-DyXVXefs.js";import{D as ve}from"./delta-BGADb_DJ.js";import{f as C,a as $}from"./utils-CMl-9ImW.js";import{s as V}from"./play-B_tfD0rJ.js";import{S as q,a as h}from"./sample-data-I9KaR9SF.js";import{a as Re}from"./generate-Bsle_8tt.js";import{P as Be}from"./package-open-ikfSYjs9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-BoO4nXaP.js";import"./empty-state-KwOlHdIt.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-36koZ389.js";import"./input-D31gR-xu.js";import"./select-CtC8ydIk.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-VXoYh6zd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-wQla93iR.js";import"./checkbox-BPXNu1Dg.js";import"./popover-D_gDLSMC.js";import"./dropdown-menu-DIIbaxa5.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./index-BOrUEQ0c.js";const xe={get:()=>typeof window>"u"?"":window.location.search.replace(/^\?/,""),set:e=>{if(typeof window>"u")return;const t=`${window.location.pathname}${e?`?${e}`:""}${window.location.hash}`;window.history.replaceState(window.history.state,"",t),window.dispatchEvent(new PopStateEvent("popstate"))},subscribe:e=>typeof window>"u"?()=>{}:(window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e))},ke={page:0,pageSize:15,query:"",sort:null,filters:{}},H=encodeURIComponent,F=e=>e.map(H).join(","),L=e=>e.split(",").filter(Boolean).map(decodeURIComponent);function Ee(e,t,n=""){const a=new URLSearchParams,o=l=>`${n}${l}`;e.query.trim()!==t.query&&a.set(o("q"),e.query.trim()),e.page!==t.page&&a.set(o("page"),String(e.page+1)),e.pageSize!==t.pageSize&&a.set(o("size"),String(e.pageSize)),e.sort&&(t.sort===null||e.sort.key!==t.sort.key||e.sort.dir!==t.sort.dir)&&a.set(o("sort"),`${e.sort.key}.${e.sort.dir}`);for(const[l,s]of Object.entries(e.filters))s.values.length>0&&a.set(o(`f.${l}`),F(s.values)),s.texts.length>0&&a.set(o(`ft.${l}`),F(s.texts)),(s.min!==""||s.max!=="")&&a.set(o(`fr.${l}`),`${H(s.min)}..${H(s.max)}`);return a.toString()}function I(e,t,n=""){const a=new URLSearchParams(e),o={...t,filters:{...t.filters}},l=s=>n&&s.startsWith(n)?s.slice(n.length):n?null:s;for(const[s,d]of a.entries()){const y=l(s);if(y!==null){if(y==="q")o.query=d;else if(y==="page"){const u=Number(d);Number.isInteger(u)&&u>=1&&(o.page=u-1)}else if(y==="size"){const u=Number(d);Number.isInteger(u)&&u>0&&(o.pageSize=u)}else if(y==="sort"){const u=d.match(/^(.+)\.(asc|desc)$/);u&&(o.sort={key:u[1],dir:u[2]})}else if(y.startsWith("f.")){const u=y.slice(2);o.filters[u]={...o.filters[u]??{texts:[],min:"",max:"",values:[]},values:L(d)}}else if(y.startsWith("ft.")){const u=y.slice(3);o.filters[u]={...o.filters[u]??{texts:[],min:"",max:"",values:[]},texts:L(d)}}else if(y.startsWith("fr.")){const u=y.slice(3),g=d.match(/^(.*)\.\.(.*)$/);g&&(o.filters[u]={...o.filters[u]??{texts:[],min:"",max:"",values:[]},min:decodeURIComponent(g[1]),max:decodeURIComponent(g[2])})}}}return o}function Se(e,t){const n=t?e.startsWith(t)?e.slice(t.length):null:e;return n===null?!1:n==="q"||n==="page"||n==="size"||n==="sort"||n.startsWith("f.")||n.startsWith("ft.")||n.startsWith("fr.")}function Ae(e,t,n,a=""){const o=new URLSearchParams(e);for(const l of[...new Set(o.keys())])Se(l,a)&&o.delete(l);for(const[l,s]of new URLSearchParams(Ee(t,n,a)))o.append(l,s);return o.toString()}function Te(e={}){const{adapter:t=xe,prefix:n=""}=e,a=w.useMemo(()=>({...ke,...e.defaults}),[JSON.stringify(e.defaults)]),o=w.useSyncExternalStore(t.subscribe,t.get,()=>""),l=w.useMemo(()=>I(o,a,n),[o,a,n]),s=w.useCallback(d=>{const{selection:y,hiddenColumns:u,...g}=d;if(Object.keys(g).length===0)return;const D=["query","filters","sort","pageSize"].some(fe=>fe in g),z=t.get(),be={...I(z,a,n),...D&&!("page"in g)?{page:0}:{},...g};t.set(Ae(z,be,a,n))},[t,a,n]);return{state:l,onStateChange:s}}const ft={title:"元件/資料/資料表 DataTable"},Ne={draft:"secondary",confirmed:"info",done:"success",void:"danger"},f=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>$(e.qty),sortValue:e=>e.qty,total:e=>$(e.reduce((t,n)=>t+n.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>C(e.amount),sortValue:e=>e.amount,total:e=>C(e.reduce((t,n)=>t+n.amount,0))},{key:"status",header:"狀態",cell:e=>c.jsx(he,{variant:Ne[e.status],children:q[e.status]}),sortValue:e=>q[e.status],filterText:e=>q[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],v={render:()=>c.jsx(b,{rows:h,columns:f,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,q[e.status],e.createdAt],fileName:"records.csv"}}),play:async({canvasElement:e})=>{const t=m(e),n=e.ownerDocument,a=t.getByRole("button",{name:/^單位/});await i.click(a),await p(()=>r(a.closest("th")).toHaveAttribute("aria-sort","descending")),await i.click(a),await p(()=>r(a.closest("th")).toHaveAttribute("aria-sort","ascending")),await i.click(t.getByRole("button",{name:"篩選 單位"})),await m(n.body).findAllByRole("checkbox"),await i.keyboard("{Escape}"),await p(()=>r(m(n.body).queryAllByRole("checkbox")).toHaveLength(0))}},R={render:()=>c.jsx(b,{rows:[],columns:f,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:c.jsx(Be,{className:"size-7"}),action:c.jsx(j,{size:"sm",children:"新增一筆"})}})},B={render:()=>{const e=[...f.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:t=>c.jsx(ve,{value:t.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:C}),sortValue:t=>t.amount-1e5}];return c.jsx(b,{rows:h.slice(0,6),columns:e,getRowKey:t=>t.id,dense:!0,searchable:!1})}},x={args:{資料筆數:42,每頁筆數:15,斑馬紋:!0,密集模式:!1,十字對準:!0,可調欄寬:!0,超長名稱:!1,載入中:!1},argTypes:{資料筆數:{control:{type:"range",min:0,max:200,step:1}},每頁筆數:{control:"inline-radio",options:[5,15,30,50]},斑馬紋:{control:"boolean"},密集模式:{control:"boolean"},十字對準:{control:"boolean"},可調欄寬:{control:"boolean"},超長名稱:{control:"boolean"},載入中:{control:"boolean"}},render:e=>c.jsx(b,{rows:Re(e.資料筆數,{longNameRatio:e.超長名稱?.15:0}),columns:f,getRowKey:t=>t.id,pageSize:e.每頁筆數,zebra:e.斑馬紋,dense:e.密集模式,crosshair:e.十字對準,resizable:e.可調欄寬,loading:e.載入中},e.每頁筆數)},k={render:()=>c.jsx(b,{rows:h,columns:f,getRowKey:e=>e.id,facets:["status","unit"]}),play:async({canvasElement:e})=>{const t=m(e),n=e.ownerDocument;await i.click(t.getAllByRole("button",{name:"狀態"})[0]);const a=await m(n.body).findByRole("dialog"),o=m(a).getByRole("checkbox",{name:/已確認/});await r(o).toHaveTextContent(/\d/),await i.click(o),await i.keyboard("{Escape}"),await p(()=>r(t.getByText("狀態：已確認")).toBeVisible());const l=t.getAllByRole("row");r(l.length).toBeGreaterThan(1),await i.click(t.getByRole("button",{name:/全部清除|移除 狀態：已確認/}))}};function qe(){const[e,t]=w.useState("");return c.jsxs("div",{className:"space-y-2",children:[e&&c.jsx("p",{className:"text-sm text-muted-foreground","data-testid":"bulk-result",children:e}),c.jsx(b,{rows:h,columns:f,getRowKey:n=>n.id,selectable:!0,bulkActions:({selected:n,clear:a})=>c.jsxs(c.Fragment,{children:[c.jsx(j,{size:"sm",variant:"outline",className:"h-7",onClick:()=>{t(`已匯出 ${n.length} 筆`),a()},children:"匯出所選"}),c.jsx(j,{size:"sm",variant:"destructive",className:"h-7",onClick:()=>{t(`已作廢 ${n.length} 筆`),a()},children:"作廢所選"})]})})]})}const E={render:()=>c.jsx(qe,{}),play:async({canvasElement:e})=>{const t=m(e);r(t.queryByRole("toolbar")).toBeNull();const n=t.getByRole("checkbox",{name:"選取 R-2401"});await i.click(n),await i.click(t.getByRole("checkbox",{name:"選取 R-2402"}));const a=await t.findByRole("toolbar",{name:"已選 2 筆"});m(a).getByRole("button",{name:"匯出所選"}).focus(),await i.keyboard("{ArrowRight}"),await r(m(a).getByRole("button",{name:"作廢所選"})).toHaveFocus(),await i.keyboard("{End}"),await r(m(a).getByRole("button",{name:"清除選取"})).toHaveFocus(),await i.click(m(a).getByRole("button",{name:"清除選取"})),await p(()=>r(t.queryByRole("toolbar")).toBeNull())}};function je(){const[e,t]=w.useState(null);return c.jsxs("div",{className:"space-y-2",children:[c.jsx("p",{className:"text-sm text-muted-foreground","data-testid":"row-opened",children:e?`已開啟 ${e}`:"尚未開啟任何一筆"}),c.jsx(b,{rows:h.slice(0,5),columns:f,getRowKey:n=>n.id,searchable:!1,selectable:!0,onRowClick:n=>t(n.id),bulkActions:({selected:n,clear:a})=>c.jsxs(j,{size:"sm",variant:"outline",className:"h-7",onClick:a,children:["匯出所選（",n.length,"）"]})})]})}const S={render:()=>c.jsx(je,{}),play:async({canvasElement:e})=>{const t=m(e),[n,a,o,l]=h.slice(0,4).map(D=>D.id),s=t.getByTestId("row-opened"),d=t.getByRole("button",{name:n}).closest("tr");await r(d).not.toBeNull(),await r(d).not.toHaveAttribute("role"),await r(d).not.toHaveAttribute("tabindex"),await i.click(t.getByRole("checkbox",{name:`選取 ${n}`}));const y=await t.findByRole("toolbar",{name:"已選 1 筆"});await r(s).toHaveTextContent("尚未開啟任何一筆"),await i.click(t.getByRole("button",{name:a})),await r(s).toHaveTextContent(`已開啟 ${a}`),t.getByRole("button",{name:o}).focus(),await i.keyboard("{Enter}"),await r(s).toHaveTextContent(`已開啟 ${o}`);const u=t.getByRole("button",{name:l}).closest("tr"),g=m(u).getAllByRole("cell");await i.click(g[g.length-1]),await r(s).toHaveTextContent(`已開啟 ${l}`),await i.click(m(y).getByRole("button",{name:"清除選取"})),await p(()=>r(t.queryByRole("toolbar")).toBeNull())}},A={render:()=>c.jsx(b,{rows:h,columns:f.map(e=>e.key==="createdAt"?{...e,defaultHidden:!0}:e),getRowKey:e=>e.id,columnVisibility:!0}),play:async({canvasElement:e})=>{const t=m(e),n=e.ownerDocument;await r(t.getByRole("columnheader",{name:/單位/})).toBeVisible(),r(t.queryByRole("columnheader",{name:/建立日期/})).toBeNull(),await i.click(t.getByRole("button",{name:"欄位"}));let a=await m(n.body).findByRole("menu");r(m(a).queryByRole("menuitemcheckbox",{name:"編號"})).toBeNull(),await i.click(m(a).getByRole("menuitemcheckbox",{name:"單位"})),await i.keyboard("{Escape}"),await p(()=>r(t.queryByRole("columnheader",{name:/單位/})).toBeNull()),await i.click(t.getByRole("button",{name:"欄位"})),a=await m(n.body).findByRole("menu"),await i.click(m(a).getByRole("menuitemcheckbox",{name:"建立日期"})),await i.keyboard("{Escape}"),await p(()=>r(t.getByRole("columnheader",{name:/建立日期/})).toBeVisible())}};function De(){const[e,t]=w.useState(""),n=w.useRef(new Set),a=w.useMemo(()=>({get:()=>e,set:s=>{t(s),n.current.forEach(d=>d())},subscribe:s=>(n.current.add(s),()=>n.current.delete(s))}),[e]),{state:o,onStateChange:l}=Te({adapter:a});return c.jsxs("div",{className:"space-y-2",children:[c.jsxs("p",{className:"rounded-sm border bg-muted px-2 py-1 font-mono text-xs","data-testid":"url",children:["?",e||"（全部預設，網址乾淨）"]}),c.jsx(b,{rows:h,columns:f,getRowKey:s=>s.id,pageSize:5,state:o,onStateChange:l})]})}const T={render:()=>c.jsx(De,{}),play:async({canvasElement:e})=>{const t=m(e),n=()=>t.getByTestId("url").textContent??"";await i.click(t.getByRole("button",{name:/下一頁/})),await p(()=>r(n()).toContain("page=2"));const a=t.getByRole("textbox",{name:"搜尋關鍵字…"});V(a,"甲"),await p(()=>r(n()).toContain("q=")),await p(()=>r(n()).not.toContain("page=")),V(a,"")}},Ce={page:0,pageSize:5,query:"",sort:null,filters:{},hiddenColumns:[],selection:[]};function He(){const[e,t]=w.useState(Ce),[n,a]=w.useState(!1),o=w.useRef(null),l=w.useRef(void 0);return w.useEffect(()=>()=>window.clearTimeout(l.current),[]),c.jsxs("div",{className:"space-y-2",children:[c.jsx("p",{className:"text-tiny text-muted-foreground",children:"排序、篩選、搜尋任一變更 → 900ms 模擬查詢：舊資料保留、變暗＋列脈動，表頭與工具列不動。"}),c.jsx(b,{rows:h,columns:f,getRowKey:s=>s.id,pageSize:5,facets:["status"],loading:n,state:e,onStateChange:(s,d)=>{"sort"in s||"filters"in s||"query"in s?(o.current=d,a(!0),window.clearTimeout(l.current),l.current=window.setTimeout(()=>{o.current&&t(o.current),a(!1)},900)):t(d)}})]})}const N={render:()=>c.jsx(He,{}),play:async({canvasElement:e})=>{const t=m(e),n=t.getAllByRole("row").length;await i.click(t.getByRole("button",{name:"數量"})),await p(()=>r(t.getByRole("status")).toBeInTheDocument()),r(t.getAllByRole("row").length).toBe(n),r(t.getByRole("columnheader",{name:/數量/})).not.toHaveAttribute("aria-sort"),await p(()=>r(t.queryByRole("status")).toBeNull(),{timeout:2500}),r(t.getByRole("columnheader",{name:/數量/})).toHaveAttribute("aria-sort","descending")}};var K,U,_;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...(_=(U=v.parameters)==null?void 0:U.docs)==null?void 0:_.source}}};var P,M,O;R.parameters={...R.parameters,docs:{...(P=R.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(O=(M=R.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var W,G,J;B.parameters={...B.parameters,docs:{...(W=B.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(J=(G=B.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var Q,Y,X;x.parameters={...x.parameters,docs:{...(Q=x.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
}`,...(X=(Y=x.parameters)==null?void 0:Y.docs)==null?void 0:X.source}}};var Z,ee,te;k.parameters={...k.parameters,docs:{...(Z=k.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(te=(ee=k.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ne,ae,oe;E.parameters={...E.parameters,docs:{...(ne=E.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(oe=(ae=E.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var se,re,ce;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: () => <RowEntryDemo />,
  // 契約（〈清單頁〉兩條規範並存）：列本身不是 button——鍵盤與讀屏的入口是首欄的真按鈕，
  // 列裡才放得下勾選框（axe 的 nested-interactive 由 verify:storybook 一併掃）。
  // 勾選不開啟；按首欄按鈕、鍵盤 Enter、點列上非互動區域都開同一筆。
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const [a, b, c, d] = demoRecords.slice(0, 4).map(r => r.id);
    const opened = canvas.getByTestId("row-opened");

    // 入口是首欄按鈕；列本身沒有 button 角色、不是 Tab 停點
    const rowA = canvas.getByRole("button", {
      name: a
    }).closest("tr");
    await expect(rowA).not.toBeNull();
    await expect(rowA).not.toHaveAttribute("role");
    await expect(rowA).not.toHaveAttribute("tabindex");

    // 勾選只勾選，不開啟
    await userEvent.click(canvas.getByRole("checkbox", {
      name: \`選取 \${a}\`
    }));
    const bar = await canvas.findByRole("toolbar", {
      name: "已選 1 筆"
    });
    await expect(opened).toHaveTextContent("尚未開啟任何一筆");

    // 按首欄按鈕
    await userEvent.click(canvas.getByRole("button", {
      name: b
    }));
    await expect(opened).toHaveTextContent(\`已開啟 \${b}\`);

    // 鍵盤：聚焦入口、Enter
    canvas.getByRole("button", {
      name: c
    }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(opened).toHaveTextContent(\`已開啟 \${c}\`);

    // 滑鼠點列上非互動區域（最後一欄）
    const rowD = canvas.getByRole("button", {
      name: d
    }).closest("tr")!;
    const cells = within(rowD).getAllByRole("cell");
    await userEvent.click(cells[cells.length - 1]);
    await expect(opened).toHaveTextContent(\`已開啟 \${d}\`);

    // 收尾：清掉選取，不留殘留狀態給視覺掃描
    await userEvent.click(within(bar).getByRole("button", {
      name: "清除選取"
    }));
    await waitFor(() => expect(canvas.queryByRole("toolbar")).toBeNull());
  }
}`,...(ce=(re=S.parameters)==null?void 0:re.docs)==null?void 0:ce.source}}};var ie,le,ue;A.parameters={...A.parameters,docs:{...(ie=A.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(ue=(le=A.parameters)==null?void 0:le.docs)==null?void 0:ue.source}}};var me,de,ye;T.parameters={...T.parameters,docs:{...(me=T.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(ye=(de=T.parameters)==null?void 0:de.docs)==null?void 0:ye.source}}};var we,pe,ge;N.parameters={...N.parameters,docs:{...(we=N.parameters)==null?void 0:we.docs,source:{originalSource:`{
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
}`,...(ge=(pe=N.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};const ht=["完整功能","空狀態","密集模式與變異欄","互動","Facet_篩選","批次操作","整列可點與批次勾選","欄位顯示","網址同步","重新查詢載入模擬"];export{k as Facet_篩選,ht as __namedExportsOrder,ft as default,x as 互動,v as 完整功能,B as 密集模式與變異欄,E as 批次操作,S as 整列可點與批次勾選,A as 欄位顯示,R as 空狀態,T as 網址同步,N as 重新查詢載入模擬};
