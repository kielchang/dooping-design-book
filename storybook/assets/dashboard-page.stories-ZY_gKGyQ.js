import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as R}from"./index-BFQ_Q9OP.js";import{C as $,a as _,b as k,c as y}from"./card-CF2OQJSG.js";import{D as c}from"./delta-D4_Tipf4.js";import{S as I}from"./seg-group-C31EXuC6.js";import{S as P,T as U,a as D}from"./trend-chart-Djcqx2_m.js";import{f,a as u,b as w}from"./utils-pm6Xa0Qd.js";import{a as m,S}from"./sample-data-DlVwqcXX.js";import"./check-SsieMrcg.js";import"./createLucideIcon-DDRU598s.js";const z={title:"頁面/儀表板"},g=[{value:"2024-01",label:"一月"},{value:"2024-02",label:"二月"},{value:"all",label:"全部"}],h={done:"success",confirmed:"info",draft:"muted",void:"danger"},j=n=>{const a=n.filter(r=>r.status==="done").length;return{amount:n.reduce((r,s)=>r+s.amount,0),done:a,rate:n.length?a/n.length:0,open:n.filter(r=>r.status==="draft"||r.status==="confirmed").length}};function p({label:n,value:a,delta:r}){return e.jsxs($,{children:[e.jsx(_,{className:"pb-2",children:e.jsx(k,{children:n})}),e.jsxs(y,{className:"space-y-1",children:[e.jsx("p",{className:"text-3xl font-semibold tabular-nums",children:a}),e.jsx("p",{className:"text-sm",children:r??e.jsx("span",{className:"text-muted-foreground",children:"—"})})]})]})}const b={render:function(){var v;const[a,r]=R.useState("2024-02"),s=j(m.filter(t=>a==="all"||t.createdAt.startsWith(a))),l=a==="2024-02"?j(m.filter(t=>t.createdAt.startsWith("2024-01"))):void 0,x=new Map;for(const t of m){const o=Number(t.createdAt.slice(8,10)),i=`${Number(t.createdAt.slice(5,7))}月${o<=15?"上":"下"}`;x.set(i,(x.get(i)??0)+t.amount)}const E=[...x.entries()].map(([t,o])=>({label:t,value:o})),A=[...new Set(m.map(t=>t.unit))].map(t=>({label:t,segments:Object.keys(h).map(o=>({label:S[o],value:m.filter(i=>i.unit===t&&i.status===o&&(a==="all"||i.createdAt.startsWith(a))).length,color:P[h[o]]}))})),d=(v=g.find(t=>t.value===a))==null?void 0:v.label;return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-end justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"成效總覽"}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["資料期間：",d,"・更新於 2024-02-07"]})]}),e.jsx(I,{label:"期間",options:g,value:a,onPick:r})]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsx(p,{label:`總金額（${d}）`,value:f(s.amount),delta:l&&e.jsx(c,{value:s.amount-l.amount,posLabel:"增加 ",negLabel:"減少 ",format:f})}),e.jsx(p,{label:`完成筆數（${d}）`,value:u(s.done),delta:l&&e.jsx(c,{value:s.done-l.done,posLabel:"增加 ",negLabel:"減少 ",format:t=>`${u(t)} 筆`})}),e.jsx(p,{label:`完成率（${d}）`,value:w(s.rate,0),delta:l&&e.jsx(c,{value:Math.round((s.rate-l.rate)*100),posLabel:"上升 ",negLabel:"下降 ",format:t=>`${t} 個百分點`})}),e.jsx(p,{label:`待處理（${d}）`,value:u(s.open),delta:l&&e.jsx(c,{value:s.open-l.open,goodWhen:"negative",posLabel:"增加 ",negLabel:"減少 ",format:t=>`${u(t)} 筆`})})]}),e.jsxs("div",{className:"grid gap-6 lg:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"金額往哪個方向走？（全期）"}),e.jsx(U,{data:E,title:"各期金額",valueFmt:t=>f(t)})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["哪個單位卡住了？（",d,"）"]}),e.jsx(D,{title:"各單位狀態組成",rows:A}),e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["狀態維度用 STATUS_SERIES——「",S.done,"」在這裡與徽章同一個綠。"]})]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"磚與圖是入口不是終點：點「待處理」應帶著同一組篩選條件進清單頁，數字才對得上。"})]})}};var N,L,T;b.parameters={...b.parameters,docs:{...(N=b.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: function Render() {
    const [period, setPeriod] = useState("2024-02");
    const cur = metric(demoRecords.filter(r => period === "all" || r.createdAt.startsWith(period)));
    // 只有「二月」有上一期可比；沒得比就不硬擠一個數字出來
    const prev = period === "2024-02" ? metric(demoRecords.filter(r => r.createdAt.startsWith("2024-01"))) : undefined;

    // 各期金額：依上／下半月彙總（等距期間才可用折線）
    const buckets = new Map<string, number>();
    for (const r of demoRecords) {
      const day = Number(r.createdAt.slice(8, 10));
      const label = \`\${Number(r.createdAt.slice(5, 7))}月\${day <= 15 ? "上" : "下"}\`;
      buckets.set(label, (buckets.get(label) ?? 0) + r.amount);
    }
    const trend = [...buckets.entries()].map(([label, value]) => ({
      label,
      value
    }));

    // 各單位狀態組成：維度是狀態 → STATUS_SERIES（與徽章同一套語意）
    const stacked: StackedBarRow[] = [...new Set(demoRecords.map(r => r.unit))].map(unit => ({
      label: unit,
      segments: (Object.keys(STATUS_TO_SERIES) as RecordStatus[]).map(s => ({
        label: STATUS_LABEL[s],
        value: demoRecords.filter(r => r.unit === unit && r.status === s && (period === "all" || r.createdAt.startsWith(period))).length,
        color: STATUS_SERIES[STATUS_TO_SERIES[s]]
      }))
    }));
    const periodLabel = PERIODS.find(p => p.value === period)?.label;
    return <div className="mx-auto max-w-5xl space-y-4">
        {/* 頁首區：標題＋期間切換。期間只在這裡出現一次，控整頁 */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">成效總覽</h1>
            <p className="text-sm text-muted-foreground">資料期間：{periodLabel}・更新於 2024-02-07</p>
          </div>
          <SegGroup label="期間" options={PERIODS} value={period} onPick={setPeriod} />
        </div>

        {/* KPI 磚列：數字＋期間標籤＋與上期的變異（三重編碼），一排 3–5 磚 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label={\`總金額（\${periodLabel}）\`} value={formatMoney(cur.amount)} delta={prev && <Delta value={cur.amount - prev.amount} posLabel="增加 " negLabel="減少 " format={formatMoney} />} />
          <Kpi label={\`完成筆數（\${periodLabel}）\`} value={formatNumber(cur.done)} delta={prev && <Delta value={cur.done - prev.done} posLabel="增加 " negLabel="減少 " format={n => \`\${formatNumber(n)} 筆\`} />} />
          <Kpi label={\`完成率（\${periodLabel}）\`} value={formatPercent(cur.rate, 0)} delta={prev && <Delta value={Math.round((cur.rate - prev.rate) * 100)} posLabel="上升 " negLabel="下降 " format={n => \`\${n} 個百分點\`} />} />
          <Kpi label={\`待處理（\${periodLabel}）\`} value={formatNumber(cur.open)} delta={prev && <Delta value={cur.open - prev.open} goodWhen="negative" posLabel="增加 " negLabel="減少 " format={n => \`\${formatNumber(n)} 筆\`} />} />
        </div>

        {/* 圖表區：先問題、後圖表——每張圖回答一個寫得出來的問題 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium">金額往哪個方向走？（全期）</p>
            <TrendChart data={trend} title="各期金額" valueFmt={n => formatMoney(n)} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">哪個單位卡住了？（{periodLabel}）</p>
            <StackedBar title="各單位狀態組成" rows={stacked} />
            <p className="mt-1 text-xs text-muted-foreground">
              狀態維度用 STATUS_SERIES——「{STATUS_LABEL.done}」在這裡與徽章同一個綠。
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          磚與圖是入口不是終點：點「待處理」應帶著同一組篩選條件進清單頁，數字才對得上。
        </p>
      </div>;
  }
}`,...(T=(L=b.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};const J=["典型組成"];export{J as __namedExportsOrder,z as default,b as 典型組成};
