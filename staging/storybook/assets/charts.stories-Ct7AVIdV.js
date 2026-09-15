import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as he}from"./index-UiW3gZKV.js";import{L as je,B as K}from"./legend-B8VMETsf.js";import{c as N,f as k,a as S}from"./utils-CMl-9ImW.js";import{C as U,e as we,d as V,P as h,b as z,a as P,c as Te,S as Se}from"./stacked-bar-Bu_g74za.js";import{T as fe}from"./trend-chart-BHSgRbvK.js";import{B as F}from"./badge-BUiC31UU.js";import{a as p,S as T}from"./sample-data-I9KaR9SF.js";import{b as I,c as Ne}from"./generate-Bsle_8tt.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-BOrUEQ0c.js";function H({data:t,title:l="柏拉圖",maxItems:n=12,valueFmt:r=V,onSelect:i,selectedIndex:m,height:s=180,className:d}){if(t.length===0)return e.jsx(U,{});const u=we([...t].sort((a,c)=>c.value-a.value),n),b=Math.max(1,u.reduce((a,c)=>a+c.value,0)),x=Math.max(1,...u.map(a=>a.value)),o=56,f={top:10,bottom:20},y=s-f.top-f.bottom,j=u.length*o;let q=0;const g=u.map(a=>(q+=a.value)/b),v=a=>a*o+10+(o-20)/2,w=a=>f.top+(1-a)*y,E=g.findIndex(a=>a>=.8);return e.jsxs("div",{className:N("overflow-x-auto",d),children:[e.jsxs("svg",{role:"img","aria-label":`${l}，共 ${u.length} 項，前 ${E+1} 項累積佔 ${Math.round(g[Math.max(E,0)]*100)}%`,viewBox:`0 0 ${j} ${s}`,width:j,height:s,className:"block",children:[e.jsx("line",{x1:0,y1:s-f.bottom,x2:j,y2:s-f.bottom,stroke:"var(--chart-axis)"}),u.map((a,c)=>{const $=a.value/x*y,D=c*o+10,ve=m!=null&&m!==c;return e.jsxs("g",{onClick:i?()=>i(c,a):void 0,className:N(i&&"cursor-pointer"),children:[e.jsx("title",{children:`${a.label}：${r(a.value)}（累積 ${Math.round(g[c]*100)}%）`}),e.jsx("rect",{x:D,y:s-f.bottom-$,width:o-20,height:$,fill:h[0],opacity:ve?.35:1}),e.jsx("text",{x:D+(o-20)/2,y:s-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:a.label})]},a.id??a.label)}),e.jsx("polyline",{points:g.map((a,c)=>`${v(c)},${w(a)}`).join(" "),fill:"none",stroke:"var(--chart-text)",strokeWidth:1.5}),g.map((a,c)=>e.jsx("circle",{cx:v(c),cy:w(a),r:2.5,fill:"var(--chart-text)"},c))]}),e.jsx(z,{caption:`${l}（資料表，含累積佔比）`,head:["項目","數值","累積"],rows:u.map((a,c)=>[a.label,r(a.value),`${Math.round(g[c]*100)}%`]),onSelect:i?a=>i(a,u[a]):void 0,selectedIndex:m})]})}H.__docgenInfo={description:`柏拉圖：長條由大到小 ＋ 累積百分比折線。回答「前幾項就佔掉多少」。

累積線是本組唯一的「雙軸」——它是柏拉圖的定義，不是為了省一張圖疊上去的。
即使如此也不畫第二條 Y 軸刻度，累積值只在提示與資料表裡以百分比呈現。

單一顏色是刻意的例外：整張圖的語意就是排序，分類配色反而添亂。`,methods:[],displayName:"Pareto",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:"元件內部自行由大到小排序，宿主不必先排。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"柏拉圖"',computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"12",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function O({label:t,value:l,target:n,valueFmt:r=V,className:i}){const m=l>n,s=Math.max(1,l,n),d=n>0?Math.round(l/n*100):null,u=m?"hsl(var(--danger))":"hsl(var(--success))";return e.jsxs("div",{className:N("space-y-1",i),children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-2 text-xs",children:[e.jsx("span",{className:"font-medium",children:t}),e.jsxs("span",{className:"tabular-nums",children:[r(l)," / 目標 ",r(n),d!=null&&e.jsxs("span",{className:"ml-1 text-muted-foreground",children:["（",d,"%）"]})]})]}),e.jsxs("div",{"aria-hidden":!0,className:"relative h-3 overflow-hidden rounded-sm bg-muted",children:[e.jsx("div",{className:"h-full",style:{width:`${l/s*100}%`,backgroundColor:u}}),e.jsx("div",{className:"absolute inset-y-0 w-0.5 bg-foreground",style:{left:`${n/s*100}%`}})]})]})}O.__docgenInfo={description:`子彈圖：實際 vs 目標，一條就講完。放在卡片頂端當摘要。

**這是唯一使用狀態色的圖**：超出目標走 \`--danger\`、未超出走 \`--success\`。
預設假設「目標＝上限」（例如預算）；若你的指標是「目標＝下限」，
請用文案講清楚，不要讓讀者自己猜紅色代表什麼。

無障礙：實際、目標、達成率都是**鄰近可見文字**，圖形部分 \`aria-hidden\`——
不再附資料表，那會讓報讀器把同一份數字唸兩次。`,methods:[],displayName:"Bullet",props:{label:{required:!0,tsType:{name:"string"},description:"指標名稱。"},value:{required:!0,tsType:{name:"number"},description:""},target:{required:!0,tsType:{name:"number"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function ye({points:t,title:l="散布圖",xLabel:n,yLabel:r,valueFmt:i=V,onSelect:m,selectedIndex:s,color:d=h[0],height:u=220,className:b}){if(t.length===0)return e.jsx(U,{});const x=320,o={top:10,right:10,bottom:28,left:10},f=t.map(a=>a.x),y=t.map(a=>a.y),[j,q]=[Math.min(...f),Math.max(...f)],[g,v]=[Math.min(...y),Math.max(...y)],w=a=>o.left+(a-j)/Math.max(1e-9,q-j)*(x-o.left-o.right),E=a=>o.top+(1-(a-g)/Math.max(1e-9,v-g))*(u-o.top-o.bottom);return e.jsxs("div",{className:b,children:[e.jsxs("svg",{role:"img","aria-label":`${l}，${t.length} 個點，橫軸 ${n}、縱軸 ${r}`,viewBox:`0 0 ${x} ${u}`,className:"block w-full",style:{maxWidth:x},children:[e.jsx("line",{x1:o.left,y1:u-o.bottom,x2:x-o.right,y2:u-o.bottom,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:o.left,y1:o.top,x2:o.left,y2:u-o.bottom,stroke:"var(--chart-axis)"}),t.map((a,c)=>{const $=s!=null&&s!==c;return e.jsx("circle",{cx:w(a.x),cy:E(a.y),r:s===c?5.5:4,fill:d,opacity:$?.3:.8,onClick:m?()=>m(c,a):void 0,className:N(m&&"cursor-pointer"),children:e.jsx("title",{children:`${a.label??`第 ${c+1} 點`}：${n} ${i(a.x)}、${r} ${i(a.y)}`})},a.id??c)}),e.jsxs("text",{x:(x+o.left)/2,y:u-8,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:[n," →"]}),e.jsxs("text",{x:o.left+4,y:o.top+2,fontSize:10,fill:"var(--chart-text)",children:["↑ ",r]})]}),e.jsx(z,{caption:`${l}（各點座標）`,head:["點",n,r],rows:t.map((a,c)=>[a.label??`第 ${c+1} 點`,i(a.x),i(a.y)]),onSelect:m?a=>m(a,t[a]):void 0,selectedIndex:s})]})}ye.__docgenInfo={description:`散布圖：兩個數值之間有沒有關係。點數 20–300 才有意義——
少於 10 個點看不出關係卻容易讓人腦補出一條線，上千個點請先在資料層彙總。

軸範圍取自資料的 min/max（**不從 0 起算**）：散布圖看的是分散形狀，不是絕對大小。`,methods:[],displayName:"Scatter",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"散布圖"',computed:!1}},xLabel:{required:!0,tsType:{name:"string"},description:"兩軸各是什麼。不標的話整張圖無從得知——視同必填。"},yLabel:{required:!0,tsType:{name:"string"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, point: Point) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}},name:"point"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function ge({rowLabels:t,colLabels:l,cells:n,title:r="熱圖",domain:i,fmt:m=V,legend:s=!0,onSelect:d,className:u}){const b=n.flat().filter(y=>y!=null);if(t.length===0||b.length===0)return e.jsx(U,{});let[x,o]=i??[Math.min(...b),Math.max(...b)];x===o&&([x,o]=[x-1,o+1]);const f=y=>8+(y-x)/(o-x)*70;return e.jsxs("div",{className:N("overflow-x-auto",u),children:[e.jsxs("table",{className:"border-collapse text-xs",children:[e.jsx("caption",{className:"p-1 text-left font-medium",children:r}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("td",{}),l.map(y=>e.jsx("th",{scope:"col",className:"px-2 py-1 text-center font-medium",children:y},y))]})}),e.jsx("tbody",{children:t.map((y,j)=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"pr-2 text-left font-medium",children:y}),l.map((q,g)=>{var w;const v=((w=n[j])==null?void 0:w[g])??null;return e.jsx("td",{onClick:d?()=>d(j,g,v):void 0,className:N("min-w-14 border border-background px-2 py-1.5 text-center tabular-nums",d&&"cursor-pointer",v==null&&"bg-muted text-muted-foreground"),style:v==null?void 0:{backgroundColor:`color-mix(in srgb, ${h[0]} ${f(v)}%, transparent)`},children:v==null?"—":m(v)},g)})]},y))})]}),s&&e.jsxs("p",{className:"mt-1 flex items-center gap-2 text-xs text-muted-foreground",children:[e.jsx("span",{"aria-hidden":!0,className:"inline-block h-2.5 w-16 rounded-sm",style:{background:`linear-gradient(to right, color-mix(in srgb, ${h[0]} 8%, transparent), color-mix(in srgb, ${h[0]} 78%, transparent))`}}),"淺 ",m(x)," → 深 ",m(o),"；灰＝無資料"]})]})}ge.__docgenInfo={description:`熱圖：兩個維度交叉之後，值集中在哪裡。格子數 100 以內——
人沒辦法在 2500 格裡找出模式，那需要排序後的清單或 Pareto。

無障礙：熱圖**本來就是真表格**——數值是可見文字、顏色只是輔助。
不另附 sr-only 表格，把表格語意補正即可（caption／scope／列標頭）。`,methods:[],displayName:"Heatmap",props:{rowLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},colLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},cells:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"unknown"}],raw:"(number | null)[]"}],raw:"(number | null)[][]"},description:"列 × 欄。**`null` 代表無資料，不是 0**——沒有發生和數值為零是兩件事。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"熱圖"',computed:!1}},domain:{required:!1,tsType:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},description:`色階值域。不給就依當期資料自動取 min/max。
**跨期比較時務必手動指定**：多張並排的熱圖各自用自動值域，
每張的「最深」代表不同的數字，並排比較就是錯的——而且錯得看不出來。`},fmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},legend:{required:!1,tsType:{name:"boolean"},description:"色階圖例（預設開）。",defaultValue:{value:"true",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: number, col: number, value: number | null) => void",signature:{arguments:[{type:{name:"number"},name:"row"},{type:{name:"number"},name:"col"},{type:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}]},name:"value"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};function be({points:t,title:l="累積分布",diagonal:n=!0,height:r=220,className:i}){if(t.length===0)return e.jsx(U,{});const m=240,s=12,d=o=>s+o*(m-s*2),u=o=>s+(1-o)*(r-s*2),b=[...t].sort((o,f)=>o.x-f.x),x=b.reduce((o,f)=>Math.abs(f.x-.2)<Math.abs(o.x-.2)?f:o,b[0]);return e.jsxs("div",{className:i,children:[e.jsxs("svg",{role:"img","aria-label":`${l}，前 ${Math.round(x.x*100)}% 累積約 ${Math.round(x.y*100)}%`,viewBox:`0 0 ${m} ${r}`,className:"block w-full",style:{maxWidth:m},children:[e.jsx("line",{x1:s,y1:r-s,x2:m-s,y2:r-s,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:s,y1:s,x2:s,y2:r-s,stroke:"var(--chart-axis)"}),n&&e.jsx("line",{x1:d(0),y1:u(0),x2:d(1),y2:u(1),stroke:"var(--chart-grid)",strokeDasharray:"4 3"}),e.jsx("polyline",{points:[`${d(0)},${u(0)}`,...b.map(o=>`${d(o.x)},${u(o.y)}`)].join(" "),fill:"none",stroke:h[0],strokeWidth:2})]}),e.jsx(z,{caption:`${l}（累積比例）`,head:["位置","累積"],rows:b.map(o=>[o.label??`前 ${Math.round(o.x*100)}%`,`${Math.round(o.y*100)}%`])})]})}be.__docgenInfo={description:`累積分布折線：配對角基準線看「離平均分布差多遠」。
例：前 20% 的對象貢獻了多少總量。

對角線是這張圖的全部意義所在——沒有基準線，這條曲線讀不出任何東西。
時間序列不要用這支（那是 TrendChart）：這裡兩軸都是 0–1 的比例，語意不同。`,methods:[],displayName:"LineChart",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:"累積分布曲線的點，**x 與 y 都必須先正規化到 0–1**。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"累積分布"',computed:!1}},diagonal:{required:!1,tsType:{name:"boolean"},description:"對角基準線（完全平均分布），預設開。曲線離對角線越遠＝越集中。",defaultValue:{value:"true",computed:!1}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const Ue={title:"元件/資料/圖表 Charts"},ke=t=>{const l=new Map;for(const n of p)l.set(n[t],(l.get(n[t])??0)+n.amount);return[...l.entries()].map(([n,r])=>({label:n,value:r}))},W=ke("unit"),B={render:()=>{const[t,l]=he.useState();return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各單位金額（BarChart，點長條或進資料表鑽取）"}),e.jsx(K,{data:W,title:"各單位金額",showValues:!0,valueFmt:n=>k(n),onSelect:n=>l(n===t?void 0:n),selectedIndex:t}),t!=null&&e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["已選：",W[t].label,"——明細清單由宿主渲染，元件只回報 index"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"集中度（Pareto，元件自行排序＋累積線）"}),e.jsx(H,{data:W,title:"各單位金額集中度",valueFmt:n=>k(n)})]})]})}},A={render:()=>{const t=[...new Set(p.map(n=>n.unit))].map(n=>({label:n,segments:[...new Set(p.map(r=>r.category))].map((r,i)=>({label:r,value:p.filter(m=>m.unit===n&&m.category===r).reduce((m,s)=>m+s.amount,0),color:h[i]}))})),l=[...new Set(p.map(n=>n.category))];return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"各單位的分類組成（StackedBar＋Legend）"}),e.jsx(je,{items:l.map((n,r)=>({label:n,color:h[r]}))}),e.jsx(P,{rows:t,title:"各單位分類組成",valueFmt:n=>k(n)})]})}},L={render:()=>{const t=new Map;for(const s of p){const d=Number(s.createdAt.slice(8,10)),u=`${s.createdAt.slice(5,7)}月${d<=15?"上":"下"}`;t.set(u,(t.get(u)??0)+s.amount)}const l=[...t.entries()].map(([s,d])=>({label:s,value:d})),n=[...p].sort((s,d)=>d.amount-s.amount),r=n.reduce((s,d)=>s+d.amount,0);let i=0;const m=n.map((s,d)=>({x:(d+1)/n.length,y:(i+=s.amount)/r}));return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各期金額（TrendChart，zeroBased 預設開）"}),e.jsx(fe,{data:l,title:"各期金額",valueFmt:s=>k(s)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"累積分布（LineChart，離對角線越遠越集中）"}),e.jsx(be,{points:m,title:"金額累積分布"})]})]})}},_={render:()=>e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"數量 × 金額（Scatter，軸範圍取 min/max）"}),e.jsx(ye,{points:p.map(t=>({x:t.qty,y:t.amount,label:t.id})),title:"數量與金額的關係",xLabel:"數量",yLabel:"金額",valueFmt:t=>S(t)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"單位 × 分類（Heatmap，null＝無資料不是 0）"}),e.jsx(ge,{title:"單位 × 分類金額",rowLabels:[...new Set(p.map(t=>t.unit))],colLabels:[...new Set(p.map(t=>t.category))],cells:[...new Set(p.map(t=>t.unit))].map(t=>[...new Set(p.map(l=>l.category))].map(l=>{const n=p.filter(r=>r.unit===t&&r.category===l);return n.length?n.reduce((r,i)=>r+i.amount,0):null})),fmt:t=>S(Math.round(t/1e3))+"K"})]})]})},M={render:()=>{const t={done:"success",confirmed:"info",draft:"muted",void:"danger"},l=[...new Set(p.map(r=>r.unit))].slice(0,4),n=r=>l.map(i=>({label:i,segments:Object.keys(t).map((m,s)=>({label:T[m],value:p.filter(d=>d.unit===i&&d.status===m).length,color:r(m,s)}))}));return e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"✅ 狀態維度用 STATUS_SERIES——與徽章同一套語意"}),e.jsxs("div",{className:"mb-2 flex gap-2",children:[e.jsx(F,{variant:"success",children:T.done}),e.jsx(F,{variant:"info",children:T.confirmed}),e.jsx(F,{variant:"danger",children:T.void})]}),e.jsx(P,{title:"各單位狀態組成（語意色）",rows:n(r=>Se[t[r]])}),e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["「",T.done,"」在徽章上是綠的，在圖表裡也是綠的——語意記憶不被拆掉。"]})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["🚫 同一份資料照序取 PALETTE——「",T.done,"」變藍、與徽章打架"]}),e.jsx(P,{title:"各單位狀態組成（誤：分類色）",rows:n((r,i)=>h[i])})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["第 2 層【身分】：colorByKey——「",l[1],"」在所有圖表、所有期別同一色"]}),e.jsx(K,{title:"依固定鍵清單取色",data:l.map(r=>({label:r,value:p.filter(i=>i.unit===r).length})),color:Te(l[1],l),showValues:!0}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"鍵清單是維度的定義（宿主宣告一次、所有圖表共用），不是當期資料的排序。"})]})]})}},R={render:()=>{const t=p.filter(n=>n.status==="done").reduce((n,r)=>n+r.amount,0),l=p.reduce((n,r)=>n+r.amount,0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsx(O,{label:"已完成金額（目標＝上限）",value:t,target:l*.3,valueFmt:n=>k(n)}),e.jsx(O,{label:"批次數（未超出）",value:12,target:20}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"超出目標走 danger、未超出走 success——這是唯一使用狀態色的圖。"})]})}},C={args:{圖表類型:"長條",資料點數:6,段數:4,顯示數值:!0,類別上限:12,從零起算:!0},argTypes:{圖表類型:{control:"select",options:["長條","柏拉圖","趨勢","堆疊"]},資料點數:{control:{type:"range",min:0,max:30,step:1}},段數:{control:{type:"range",min:1,max:12,step:1},if:{arg:"圖表類型",eq:"堆疊"}},顯示數值:{control:"boolean",if:{arg:"圖表類型",eq:"長條"}},類別上限:{control:{type:"range",min:3,max:12,step:1},if:{arg:"圖表類型",eq:"長條"}},從零起算:{control:"boolean",if:{arg:"圖表類型",eq:"趨勢"}}},render:t=>{const l=()=>{switch(t.圖表類型){case"柏拉圖":return e.jsx(H,{data:I(t.資料點數),title:"集中度",valueFmt:n=>S(n)});case"趨勢":return e.jsx(fe,{data:I(t.資料點數,{labelKind:"period"}),title:"各期數值",zeroBased:t.從零起算,valueFmt:n=>S(n)});case"堆疊":return e.jsx(P,{rows:Ne(t.資料點數,t.段數).map(n=>({...n,segments:n.segments.map((r,i)=>({...r,color:h[i%h.length]}))})),title:"分類組成",valueFmt:n=>S(n)});default:return e.jsx(K,{data:I(t.資料點數),title:"各單位數值",showValues:t.顯示數值,maxItems:t.類別上限,valueFmt:n=>S(n)})}};return e.jsx("div",{className:"max-w-2xl",children:l()})}};var Y,X,G;B.parameters={...B.parameters,docs:{...(Y=B.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => {
    const [sel, setSel] = useState<number | undefined>();
    return <div className="max-w-2xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">各單位金額（BarChart，點長條或進資料表鑽取）</p>
          <BarChart data={byUnit} title="各單位金額" showValues valueFmt={n => formatMoney(n)} onSelect={i => setSel(i === sel ? undefined : i)} selectedIndex={sel} />
          {sel != null && <p className="mt-1 text-xs text-muted-foreground">
              已選：{byUnit[sel].label}——明細清單由宿主渲染，元件只回報 index
            </p>}
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">集中度（Pareto，元件自行排序＋累積線）</p>
          <Pareto data={byUnit} title="各單位金額集中度" valueFmt={n => formatMoney(n)} />
        </div>
      </div>;
  }
}`,...(G=(X=B.parameters)==null?void 0:X.docs)==null?void 0:G.source}}};var J,Q,Z;A.parameters={...A.parameters,docs:{...(J=A.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => {
    const rows: StackedBarRow[] = [...new Set(demoRecords.map(r => r.unit))].map(unit => ({
      label: unit,
      segments: [...new Set(demoRecords.map(r => r.category))].map((cat, ci) => ({
        label: cat,
        value: demoRecords.filter(r => r.unit === unit && r.category === cat).reduce((s, r) => s + r.amount, 0),
        color: PALETTE[ci]
      }))
    }));
    const cats = [...new Set(demoRecords.map(r => r.category))];
    return <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">各單位的分類組成（StackedBar＋Legend）</p>
        <Legend items={cats.map((c, i) => ({
        label: c,
        color: PALETTE[i]
      }))} />
        <StackedBar rows={rows} title="各單位分類組成" valueFmt={n => formatMoney(n)} />
      </div>;
  }
}`,...(Z=(Q=A.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var ee,ne,te;L.parameters={...L.parameters,docs:{...(ee=L.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    // 依建立週彙總（等距時間才可用折線）
    const weeks = new Map<string, number>();
    for (const r of demoRecords) {
      const day = Number(r.createdAt.slice(8, 10));
      const label = \`\${r.createdAt.slice(5, 7)}月\${day <= 15 ? "上" : "下"}\`;
      weeks.set(label, (weeks.get(label) ?? 0) + r.amount);
    }
    const trend = [...weeks.entries()].map(([label, value]) => ({
      label,
      value
    }));

    // 累積分布：金額由大到小的累積佔比（前 20% 的紀錄佔多少金額）
    const sorted = [...demoRecords].sort((a, b) => b.amount - a.amount);
    const total = sorted.reduce((s, r) => s + r.amount, 0);
    let acc = 0;
    const points = sorted.map((r, i) => ({
      x: (i + 1) / sorted.length,
      y: (acc += r.amount) / total
    }));
    return <div className="max-w-2xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">各期金額（TrendChart，zeroBased 預設開）</p>
          <TrendChart data={trend} title="各期金額" valueFmt={n => formatMoney(n)} />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">累積分布（LineChart，離對角線越遠越集中）</p>
          <LineChart points={points} title="金額累積分布" />
        </div>
      </div>;
  }
}`,...(te=(ne=L.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var ae,re,se;_.parameters={..._.parameters,docs:{...(ae=_.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">數量 × 金額（Scatter，軸範圍取 min/max）</p>
        <Scatter points={demoRecords.map(r => ({
        x: r.qty,
        y: r.amount,
        label: r.id
      }))} title="數量與金額的關係" xLabel="數量" yLabel="金額" valueFmt={n => formatNumber(n)} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">單位 × 分類（Heatmap，null＝無資料不是 0）</p>
        <Heatmap title="單位 × 分類金額" rowLabels={[...new Set(demoRecords.map(r => r.unit))]} colLabels={[...new Set(demoRecords.map(r => r.category))]} cells={[...new Set(demoRecords.map(r => r.unit))].map(unit => [...new Set(demoRecords.map(r => r.category))].map(cat => {
        const hit = demoRecords.filter(r => r.unit === unit && r.category === cat);
        return hit.length ? hit.reduce((s, r) => s + r.amount, 0) : null;
      }))} fmt={n => formatNumber(Math.round(n / 1000)) + "K"} />
      </div>
    </div>
}`,...(se=(re=_.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var oe,le,ie;M.parameters={...M.parameters,docs:{...(oe=M.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => {
    // 維度＝狀態：這不是「分類」，是系統已有語意色的維度（判斷樹第 1 層）
    const STATUS_TO_SERIES = {
      done: "success",
      confirmed: "info",
      draft: "muted",
      void: "danger"
    } as const;
    const units = [...new Set(demoRecords.map(r => r.unit))].slice(0, 4);
    const rowsWith = (color: (s: keyof typeof STATUS_TO_SERIES, i: number) => string) => units.map(unit => ({
      label: unit,
      segments: (Object.keys(STATUS_TO_SERIES) as (keyof typeof STATUS_TO_SERIES)[]).map((s, i) => ({
        label: STATUS_LABEL[s],
        value: demoRecords.filter(r => r.unit === unit && r.status === s).length,
        color: color(s, i)
      }))
    }));
    return <div className="max-w-xl space-y-8">
        <div>
          <p className="mb-1 text-sm font-medium">
            ✅ 狀態維度用 STATUS_SERIES——與徽章同一套語意
          </p>
          <div className="mb-2 flex gap-2">
            <Badge variant="success">{STATUS_LABEL.done}</Badge>
            <Badge variant="info">{STATUS_LABEL.confirmed}</Badge>
            <Badge variant="danger">{STATUS_LABEL.void}</Badge>
          </div>
          <StackedBar title="各單位狀態組成（語意色）" rows={rowsWith(s => STATUS_SERIES[STATUS_TO_SERIES[s]])} />
          <p className="mt-1 text-xs text-muted-foreground">
            「{STATUS_LABEL.done}」在徽章上是綠的，在圖表裡也是綠的——語意記憶不被拆掉。
          </p>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            🚫 同一份資料照序取 PALETTE——「{STATUS_LABEL.done}」變藍、與徽章打架
          </p>
          <StackedBar title="各單位狀態組成（誤：分類色）" rows={rowsWith((_s, i) => PALETTE[i])} />
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">
            第 2 層【身分】：colorByKey——「{units[1]}」在所有圖表、所有期別同一色
          </p>
          <BarChart title="依固定鍵清單取色" data={units.map(u => ({
          label: u,
          value: demoRecords.filter(r => r.unit === u).length
        }))} color={colorByKey(units[1], units)} showValues />
          <p className="mt-1 text-xs text-muted-foreground">
            鍵清單是維度的定義（宿主宣告一次、所有圖表共用），不是當期資料的排序。
          </p>
        </div>
      </div>;
  }
}`,...(ie=(le=M.parameters)==null?void 0:le.docs)==null?void 0:ie.source}}};var me,de,ue;R.parameters={...R.parameters,docs:{...(me=R.parameters)==null?void 0:me.docs,source:{originalSource:`{
  render: () => {
    const done = demoRecords.filter(r => r.status === "done").reduce((s, r) => s + r.amount, 0);
    const all = demoRecords.reduce((s, r) => s + r.amount, 0);
    return <div className="max-w-sm space-y-4">
        <Bullet label="已完成金額（目標＝上限）" value={done} target={all * 0.3} valueFmt={n => formatMoney(n)} />
        <Bullet label="批次數（未超出）" value={12} target={20} />
        <p className="text-xs text-muted-foreground">
          超出目標走 danger、未超出走 success——這是唯一使用狀態色的圖。
        </p>
      </div>;
  }
}`,...(ue=(de=R.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var ce,pe,xe;C.parameters={...C.parameters,docs:{...(ce=C.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    圖表類型: "長條",
    資料點數: 6,
    段數: 4,
    顯示數值: true,
    類別上限: 12,
    從零起算: true
  },
  argTypes: {
    圖表類型: {
      control: "select",
      options: ["長條", "柏拉圖", "趨勢", "堆疊"]
    },
    資料點數: {
      control: {
        type: "range",
        min: 0,
        max: 30,
        step: 1
      }
    },
    段數: {
      control: {
        type: "range",
        min: 1,
        max: 12,
        step: 1
      },
      if: {
        arg: "圖表類型",
        eq: "堆疊"
      }
    },
    顯示數值: {
      control: "boolean",
      if: {
        arg: "圖表類型",
        eq: "長條"
      }
    },
    類別上限: {
      control: {
        type: "range",
        min: 3,
        max: 12,
        step: 1
      },
      if: {
        arg: "圖表類型",
        eq: "長條"
      }
    },
    從零起算: {
      control: "boolean",
      if: {
        arg: "圖表類型",
        eq: "趨勢"
      }
    }
  },
  render: a => {
    const chart = () => {
      switch (a.圖表類型) {
        case "柏拉圖":
          return <Pareto data={makeSeries(a.資料點數)} title="集中度" valueFmt={n => formatNumber(n)} />;
        case "趨勢":
          // 趨勢的 x 軸必須是等距時間，所以用「第N期」而不是單位
          return <TrendChart data={makeSeries(a.資料點數, {
            labelKind: "period"
          })} title="各期數值" zeroBased={a.從零起算} valueFmt={n => formatNumber(n)} />;
        case "堆疊":
          // 序列色要跨期穩定、由使用端指定——生成器不給色，story 端照序配 PALETTE
          return <StackedBar rows={makeStackedRows(a.資料點數, a.段數).map(row => ({
            ...row,
            segments: row.segments.map((s, ci) => ({
              ...s,
              color: PALETTE[ci % PALETTE.length]
            }))
          }))} title="分類組成" valueFmt={n => formatNumber(n)} />;
        default:
          return <BarChart data={makeSeries(a.資料點數)} title="各單位數值" showValues={a.顯示數值} maxItems={a.類別上限} valueFmt={n => formatNumber(n)} />;
      }
    };
    return <div className="max-w-2xl">{chart()}</div>;
  }
}`,...(xe=(pe=C.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};const Ve=["長條與柏拉圖","堆疊與圖例","趨勢與累積","散布與熱圖","語意維度的堆疊","子彈圖","互動"];export{Ve as __namedExportsOrder,Ue as default,C as 互動,A as 堆疊與圖例,R as 子彈圖,_ as 散布與熱圖,M as 語意維度的堆疊,L as 趨勢與累積,B as 長條與柏拉圖};
