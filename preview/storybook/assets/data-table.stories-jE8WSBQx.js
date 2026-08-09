import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as g}from"./index-UiW3gZKV.js";import{within as l,userEvent as c,expect as u,waitFor as y}from"./index-DH-M5T-F.js";import{D as b}from"./data-table-tVu216X1.js";import{B as le}from"./badge-B-Xe92Tx.js";import{B as q}from"./button-PlLiai67.js";import{D as ue}from"./delta-D4_Tipf4.js";import{f as N,a as z}from"./utils-pm6Xa0Qd.js";import{S as A,a as h}from"./sample-data-I9KaR9SF.js";import{a as me}from"./generate-Bsle_8tt.js";import{P as de}from"./package-open-ikfSYjs9.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./createLucideIcon-BcR0bl2m.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./select-BimLQx0-.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-VXoYh6zd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./checkbox-OptVgWvT.js";import"./popover-CfLROtjL.js";import"./dropdown-menu-BGKoUATf.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./chevron-right-DWuV1wB0.js";import"./index-rhYpeUg2.js";const pe={get:()=>typeof window>"u"?"":window.location.search.replace(/^\?/,""),set:e=>{if(typeof window>"u")return;const t=`${window.location.pathname}${e?`?${e}`:""}${window.location.hash}`;window.history.replaceState(window.history.state,"",t),window.dispatchEvent(new PopStateEvent("popstate"))},subscribe:e=>typeof window>"u"?()=>{}:(window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e))},ye={page:0,pageSize:15,query:"",sort:null,filters:{}},j=encodeURIComponent,D=e=>e.map(j).join(","),C=e=>e.split(",").filter(Boolean).map(decodeURIComponent);function we(e,t,a=""){const n=new URLSearchParams,o=m=>`${a}${m}`;e.query.trim()!==t.query&&n.set(o("q"),e.query.trim()),e.page!==t.page&&n.set(o("page"),String(e.page+1)),e.pageSize!==t.pageSize&&n.set(o("size"),String(e.pageSize)),e.sort&&(t.sort===null||e.sort.key!==t.sort.key||e.sort.dir!==t.sort.dir)&&n.set(o("sort"),`${e.sort.key}.${e.sort.dir}`);for(const[m,r]of Object.entries(e.filters))r.values.length>0&&n.set(o(`f.${m}`),D(r.values)),r.texts.length>0&&n.set(o(`ft.${m}`),D(r.texts)),(r.min!==""||r.max!=="")&&n.set(o(`fr.${m}`),`${j(r.min)}..${j(r.max)}`);return n.toString()}function V(e,t,a=""){const n=new URLSearchParams(e),o={...t,filters:{...t.filters}},m=r=>a&&r.startsWith(a)?r.slice(a.length):a?null:r;for(const[r,p]of n.entries()){const d=m(r);if(d!==null){if(d==="q")o.query=p;else if(d==="page"){const i=Number(p);Number.isInteger(i)&&i>=1&&(o.page=i-1)}else if(d==="size"){const i=Number(p);Number.isInteger(i)&&i>0&&(o.pageSize=i)}else if(d==="sort"){const i=p.match(/^(.+)\.(asc|desc)$/);i&&(o.sort={key:i[1],dir:i[2]})}else if(d.startsWith("f.")){const i=d.slice(2);o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},values:C(p)}}else if(d.startsWith("ft.")){const i=d.slice(3);o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},texts:C(p)}}else if(d.startsWith("fr.")){const i=d.slice(3),w=p.match(/^(.*)\.\.(.*)$/);w&&(o.filters[i]={...o.filters[i]??{texts:[],min:"",max:"",values:[]},min:decodeURIComponent(w[1]),max:decodeURIComponent(w[2])})}}}return o}function ge(e={}){const{adapter:t=pe,prefix:a=""}=e,n=g.useMemo(()=>({...ye,...e.defaults}),[JSON.stringify(e.defaults)]),o=g.useSyncExternalStore(t.subscribe,t.get,()=>""),m=g.useMemo(()=>V(o,n,a),[o,n,a]),r=g.useCallback(p=>{const{selection:d,hiddenColumns:i,...w}=p;if(Object.keys(w).length===0)return;const se=["query","filters","sort","pageSize"].some(ie=>ie in w),ce={...V(t.get(),n,a),...se&&!("page"in w)?{page:0}:{},...w};t.set(we(ce,n,a))},[t,n,a]);return{state:m,onStateChange:r}}const at={title:"元件/資料/資料表 DataTable"},be={draft:"secondary",confirmed:"info",done:"success",void:"danger"},f=[{key:"id",header:"編號",freeze:!0,cell:e=>e.id,sortValue:e=>e.id,filterText:e=>e.id},{key:"unit",header:"單位",cell:e=>e.unit,sortValue:e=>e.unit,filterText:e=>e.unit,filter:"select"},{key:"name",header:"項目",truncate:180,cell:e=>e.name,sortValue:e=>e.name,filterText:e=>e.name},{key:"category",header:"分類",cell:e=>e.category,sortValue:e=>e.category,filterText:e=>e.category,filter:"select"},{key:"qty",header:"數量",numeric:!0,cell:e=>z(e.qty),sortValue:e=>e.qty,total:e=>z(e.reduce((t,a)=>t+a.qty,0))},{key:"amount",header:"金額",numeric:!0,cell:e=>N(e.amount),sortValue:e=>e.amount,total:e=>N(e.reduce((t,a)=>t+a.amount,0))},{key:"status",header:"狀態",cell:e=>s.jsx(le,{variant:be[e.status],children:A[e.status]}),sortValue:e=>A[e.status],filterText:e=>A[e.status],filter:"select"},{key:"createdAt",header:"建立日期",cell:e=>e.createdAt,sortValue:e=>e.createdAt,filterText:e=>e.createdAt}],R={render:()=>s.jsx(b,{rows:h,columns:f,getRowKey:e=>e.id,initialSort:{key:"amount",dir:"desc"},pageSize:5,csv:{headers:["編號","單位","項目","分類","數量","金額","狀態","建立日期"],row:e=>[e.id,e.unit,e.name,e.category,e.qty,e.amount,A[e.status],e.createdAt],fileName:"records.csv"}}),play:async({canvasElement:e})=>{const t=l(e),a=e.ownerDocument,n=t.getByRole("button",{name:/^單位/});await c.click(n),await y(()=>u(n.closest("th")).toHaveAttribute("aria-sort","descending")),await c.click(n),await y(()=>u(n.closest("th")).toHaveAttribute("aria-sort","ascending")),await c.click(t.getByRole("button",{name:"篩選 單位"})),await l(a.body).findAllByRole("checkbox"),await c.keyboard("{Escape}"),await y(()=>u(l(a.body).queryAllByRole("checkbox")).toHaveLength(0))}},v={render:()=>s.jsx(b,{rows:[],columns:f,getRowKey:e=>e.id,empty:{title:"還沒有任何資料",hint:"建立第一筆後，這裡會顯示明細與合計。",icon:s.jsx(de,{className:"size-7"}),action:s.jsx(q,{size:"sm",children:"新增一筆"})}})},B={render:()=>{const e=[...f.slice(0,2),{key:"delta",header:"與上期差異",numeric:!0,cell:t=>s.jsx(ue,{value:t.amount-1e5,posLabel:"高於基準 ",negLabel:"低於基準 ",format:N}),sortValue:t=>t.amount-1e5}];return s.jsx(b,{rows:h.slice(0,6),columns:e,getRowKey:t=>t.id,dense:!0,searchable:!1})}},x={args:{資料筆數:42,每頁筆數:15,斑馬紋:!0,密集模式:!1,十字對準:!0,可調欄寬:!0,超長名稱:!1,載入中:!1},argTypes:{資料筆數:{control:{type:"range",min:0,max:200,step:1}},每頁筆數:{control:"inline-radio",options:[5,15,30,50]},斑馬紋:{control:"boolean"},密集模式:{control:"boolean"},十字對準:{control:"boolean"},可調欄寬:{control:"boolean"},超長名稱:{control:"boolean"},載入中:{control:"boolean"}},render:e=>s.jsx(b,{rows:me(e.資料筆數,{longNameRatio:e.超長名稱?.15:0}),columns:f,getRowKey:t=>t.id,pageSize:e.每頁筆數,zebra:e.斑馬紋,dense:e.密集模式,crosshair:e.十字對準,resizable:e.可調欄寬,loading:e.載入中},e.每頁筆數)},k={render:()=>s.jsx(b,{rows:h,columns:f,getRowKey:e=>e.id,facets:["status","unit"]}),play:async({canvasElement:e})=>{const t=l(e),a=e.ownerDocument;await c.click(t.getAllByRole("button",{name:"狀態"})[0]);const n=await l(a.body).findByRole("dialog"),o=l(n).getByRole("checkbox",{name:/已確認/});await u(o).toHaveTextContent(/\d/),await c.click(o),await c.keyboard("{Escape}"),await y(()=>u(t.getByText("狀態：已確認")).toBeVisible());const m=t.getAllByRole("row");u(m.length).toBeGreaterThan(1),await c.click(t.getByRole("button",{name:/全部清除|移除 狀態：已確認/}))}};function fe(){const[e,t]=g.useState("");return s.jsxs("div",{className:"space-y-2",children:[e&&s.jsx("p",{className:"text-sm text-muted-foreground","data-testid":"bulk-result",children:e}),s.jsx(b,{rows:h,columns:f,getRowKey:a=>a.id,selectable:!0,bulkActions:({selected:a,clear:n})=>s.jsxs(s.Fragment,{children:[s.jsx(q,{size:"sm",variant:"outline",className:"h-7",onClick:()=>{t(`已匯出 ${a.length} 筆`),n()},children:"匯出所選"}),s.jsx(q,{size:"sm",variant:"destructive",className:"h-7",onClick:()=>{t(`已作廢 ${a.length} 筆`),n()},children:"作廢所選"})]})})]})}const E={render:()=>s.jsx(fe,{}),play:async({canvasElement:e})=>{const t=l(e);u(t.queryByRole("toolbar")).toBeNull();const a=t.getByRole("checkbox",{name:"選取 R-2401"});await c.click(a),await c.click(t.getByRole("checkbox",{name:"選取 R-2402"}));const n=await t.findByRole("toolbar",{name:"已選 2 筆"});l(n).getByRole("button",{name:"匯出所選"}).focus(),await c.keyboard("{ArrowRight}"),await u(l(n).getByRole("button",{name:"作廢所選"})).toHaveFocus(),await c.keyboard("{End}"),await u(l(n).getByRole("button",{name:"清除選取"})).toHaveFocus(),await c.click(l(n).getByRole("button",{name:"清除選取"})),await y(()=>u(t.queryByRole("toolbar")).toBeNull())}},S={render:()=>s.jsx(b,{rows:h,columns:f.map(e=>e.key==="createdAt"?{...e,defaultHidden:!0}:e),getRowKey:e=>e.id,columnVisibility:!0}),play:async({canvasElement:e})=>{const t=l(e),a=e.ownerDocument;await u(t.getByRole("columnheader",{name:/單位/})).toBeVisible(),u(t.queryByRole("columnheader",{name:/建立日期/})).toBeNull(),await c.click(t.getByRole("button",{name:"欄位"}));let n=await l(a.body).findByRole("menu");u(l(n).queryByRole("menuitemcheckbox",{name:"編號"})).toBeNull(),await c.click(l(n).getByRole("menuitemcheckbox",{name:"單位"})),await c.keyboard("{Escape}"),await y(()=>u(t.queryByRole("columnheader",{name:/單位/})).toBeNull()),await c.click(t.getByRole("button",{name:"欄位"})),n=await l(a.body).findByRole("menu"),await c.click(l(n).getByRole("menuitemcheckbox",{name:"建立日期"})),await c.keyboard("{Escape}"),await y(()=>u(t.getByRole("columnheader",{name:/建立日期/})).toBeVisible())}};function he(){const[e,t]=g.useState(""),a=g.useRef(new Set),n=g.useMemo(()=>({get:()=>e,set:r=>{t(r),a.current.forEach(p=>p())},subscribe:r=>(a.current.add(r),()=>a.current.delete(r))}),[e]),{state:o,onStateChange:m}=ge({adapter:n});return s.jsxs("div",{className:"space-y-2",children:[s.jsxs("p",{className:"rounded border bg-muted px-2 py-1 font-mono text-xs","data-testid":"url",children:["?",e||"（全部預設，網址乾淨）"]}),s.jsx(b,{rows:h,columns:f,getRowKey:r=>r.id,pageSize:5,state:o,onStateChange:m})]})}const T={render:()=>s.jsx(he,{}),play:async({canvasElement:e})=>{const t=l(e),a=()=>t.getByTestId("url").textContent??"";await c.click(t.getByRole("button",{name:/下一頁/})),await y(()=>u(a()).toContain("page=2"));const n=t.getByRole("textbox",{name:"搜尋關鍵字…"});await c.type(n,"甲"),await y(()=>u(a()).toContain("q=")),await y(()=>u(a()).not.toContain("page=")),await c.clear(n)}};var F,$,H;R.parameters={...R.parameters,docs:{...(F=R.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(H=($=R.parameters)==null?void 0:$.docs)==null?void 0:H.source}}};var L,K,U;v.parameters={...v.parameters,docs:{...(L=v.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <DataTable rows={[] as DemoRecord[]} columns={columns} getRowKey={r => r.id} empty={{
    title: "還沒有任何資料",
    hint: "建立第一筆後，這裡會顯示明細與合計。",
    icon: <PackageOpen className="size-7" />,
    action: <Button size="sm">新增一筆</Button>
  }} />
}`,...(U=(K=v.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var _,I,M;B.parameters={...B.parameters,docs:{...(_=B.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(M=(I=B.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var O,P,W;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(W=(P=x.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var G,J,Q;k.parameters={...k.parameters,docs:{...(G=k.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(Q=(J=k.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var X,Y,Z;E.parameters={...E.parameters,docs:{...(X=E.parameters)==null?void 0:X.docs,source:{originalSource:`{
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
}`,...(Z=(Y=E.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,te,ne;S.parameters={...S.parameters,docs:{...(ee=S.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ne=(te=S.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var ae,oe,re;T.parameters={...T.parameters,docs:{...(ae=T.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
    await userEvent.type(input, "甲");
    // 條件變更自動回第 1 頁：page 參數消失、q 出現
    await waitFor(() => expect(url()).toContain("q="));
    await waitFor(() => expect(url()).not.toContain("page="));
    await userEvent.clear(input);
  }
}`,...(re=(oe=T.parameters)==null?void 0:oe.docs)==null?void 0:re.source}}};const ot=["完整功能","空狀態","密集模式與變異欄","互動","Facet_篩選","批次操作","欄位顯示","網址同步"];export{k as Facet_篩選,ot as __namedExportsOrder,at as default,x as 互動,R as 完整功能,B as 密集模式與變異欄,E as 批次操作,S as 欄位顯示,v as 空狀態,T as 網址同步};
