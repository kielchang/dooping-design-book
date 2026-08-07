import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as Te}from"./index-UiW3gZKV.js";import{c as w,f as E,a as $}from"./utils-pm6Xa0Qd.js";import{C as A,c as fe,d as B,P as j,b as U,a as P,e as we,T as ye,S as Se}from"./trend-chart-Djcqx2_m.js";import{B as W}from"./badge-B-Xe92Tx.js";import{a as g,S as k}from"./sample-data-DlVwqcXX.js";import{b as z,c as Ne}from"./generate-Bsle_8tt.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-rhYpeUg2.js";function F({data:n,title:o="長條圖",showValues:t=!1,maxItems:r=12,valueFmt:m=B,onSelect:i,selectedIndex:s,color:c=j[0],height:u=180,className:v}){if(n.length===0)return e.jsx(A,{});const p=fe(n,r),l=Math.max(1,...p.map(d=>d.value)),f=56,y={top:t?18:8,bottom:20},T=u-y.top-y.bottom,S=p.length*f,b=p.reduce((d,h)=>h.value>d.value?h:d,p[0]);return e.jsxs("div",{className:w("overflow-x-auto",v),children:[e.jsxs("svg",{role:"img","aria-label":`${o}，共 ${p.length} 項，最高為 ${b.label} ${m(b.value)}`,viewBox:`0 0 ${S} ${u}`,width:S,height:u,className:"block",children:[e.jsx("line",{x1:0,y1:u-y.bottom,x2:S,y2:u-y.bottom,stroke:"var(--chart-axis)"}),p.map((d,h)=>{const N=d.value/l*T,a=h*f+10,x=u-y.bottom-N,q=s!=null&&s!==h;return e.jsxs("g",{onClick:i?()=>i(h,d):void 0,className:w(i&&"cursor-pointer"),children:[e.jsx("title",{children:`${d.label}：${m(d.value)}`}),e.jsx("rect",{x:a,y:x,width:f-20,height:N,fill:c,opacity:q?.35:1}),t&&e.jsx("text",{x:a+(f-20)/2,y:x-4,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:m(d.value)}),e.jsx("text",{x:a+(f-20)/2,y:u-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:d.label})]},d.id??d.label)})]}),e.jsx(U,{caption:`${o}（資料表）`,head:["項目","數值"],rows:p.map(d=>[d.label,m(d.value)]),onSelect:i?d=>i(d,p[d]):void 0,selectedIndex:s})]})}F.__docgenInfo={description:`長條圖：比較同一個量在不同類別間的大小。
類別是時間（月份、週）請用 TrendChart——長條不表達「順序連續」。`,methods:[],displayName:"BarChart",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"這張圖在講什麼——同時是 aria-label 摘要與資料表 caption 的開頭。",defaultValue:{value:'"長條圖"',computed:!1}},showValues:{required:!1,tsType:{name:"boolean"},description:`在長條頂端標數值。**列印與觸控裝置一定要開**——
沒有 hover 的情境裡，不標值的長條只是形狀。`,defaultValue:{value:"false",computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:"類別上限（含彙總項），超過取值最大的前幾名、其餘併成「其他」。",defaultValue:{value:"12",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:"點擊鑽取。明細清單由宿主渲染——元件不猜「鑽下去看什麼」。"},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"單一序列色。預設 `PALETTE[0]`——它是全站單序列圖的預設色，要穩定。",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function H({data:n,title:o="柏拉圖",maxItems:t=12,valueFmt:r=B,onSelect:m,selectedIndex:i,height:s=180,className:c}){if(n.length===0)return e.jsx(A,{});const u=fe([...n].sort((a,x)=>x.value-a.value),t),v=Math.max(1,u.reduce((a,x)=>a+x.value,0)),p=Math.max(1,...u.map(a=>a.value)),l=56,f={top:10,bottom:20},y=s-f.top-f.bottom,T=u.length*l;let S=0;const b=u.map(a=>(S+=a.value)/v),d=a=>a*l+10+(l-20)/2,h=a=>f.top+(1-a)*y,N=b.findIndex(a=>a>=.8);return e.jsxs("div",{className:w("overflow-x-auto",c),children:[e.jsxs("svg",{role:"img","aria-label":`${o}，共 ${u.length} 項，前 ${N+1} 項累積佔 ${Math.round(b[Math.max(N,0)]*100)}%`,viewBox:`0 0 ${T} ${s}`,width:T,height:s,className:"block",children:[e.jsx("line",{x1:0,y1:s-f.bottom,x2:T,y2:s-f.bottom,stroke:"var(--chart-axis)"}),u.map((a,x)=>{const q=a.value/p*y,D=x*l+10,je=i!=null&&i!==x;return e.jsxs("g",{onClick:m?()=>m(x,a):void 0,className:w(m&&"cursor-pointer"),children:[e.jsx("title",{children:`${a.label}：${r(a.value)}（累積 ${Math.round(b[x]*100)}%）`}),e.jsx("rect",{x:D,y:s-f.bottom-q,width:l-20,height:q,fill:j[0],opacity:je?.35:1}),e.jsx("text",{x:D+(l-20)/2,y:s-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:a.label})]},a.id??a.label)}),e.jsx("polyline",{points:b.map((a,x)=>`${d(x)},${h(a)}`).join(" "),fill:"none",stroke:"var(--chart-text)",strokeWidth:1.5}),b.map((a,x)=>e.jsx("circle",{cx:d(x),cy:h(a),r:2.5,fill:"var(--chart-text)"},x))]}),e.jsx(U,{caption:`${o}（資料表，含累積佔比）`,head:["項目","數值","累積"],rows:u.map((a,x)=>[a.label,r(a.value),`${Math.round(b[x]*100)}%`]),onSelect:m?a=>m(a,u[a]):void 0,selectedIndex:i})]})}H.__docgenInfo={description:`柏拉圖：長條由大到小 ＋ 累積百分比折線。回答「前幾項就佔掉多少」。

累積線是本組唯一的「雙軸」——它是柏拉圖的定義，不是為了省一張圖疊上去的。
即使如此也不畫第二條 Y 軸刻度，累積值只在提示與資料表裡以百分比呈現。

單一顏色是刻意的例外：整張圖的語意就是排序，分類配色反而添亂。`,methods:[],displayName:"Pareto",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:"元件內部自行由大到小排序，宿主不必先排。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"柏拉圖"',computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"12",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function K({label:n,value:o,target:t,valueFmt:r=B,className:m}){const i=o>t,s=Math.max(1,o,t),c=t>0?Math.round(o/t*100):null,u=i?"hsl(var(--danger))":"hsl(var(--success))";return e.jsxs("div",{className:w("space-y-1",m),children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-2 text-xs",children:[e.jsx("span",{className:"font-medium",children:n}),e.jsxs("span",{className:"tabular-nums",children:[r(o)," / 目標 ",r(t),c!=null&&e.jsxs("span",{className:"ml-1 text-muted-foreground",children:["（",c,"%）"]})]})]}),e.jsxs("div",{"aria-hidden":!0,className:"relative h-3 overflow-hidden rounded-sm bg-muted",children:[e.jsx("div",{className:"h-full",style:{width:`${o/s*100}%`,backgroundColor:u}}),e.jsx("div",{className:"absolute inset-y-0 w-0.5 bg-foreground",style:{left:`${t/s*100}%`}})]})]})}K.__docgenInfo={description:`子彈圖：實際 vs 目標，一條就講完。放在卡片頂端當摘要。

**這是唯一使用狀態色的圖**：超出目標走 \`--danger\`、未超出走 \`--success\`。
預設假設「目標＝上限」（例如預算）；若你的指標是「目標＝下限」，
請用文案講清楚，不要讓讀者自己猜紅色代表什麼。

無障礙：實際、目標、達成率都是**鄰近可見文字**，圖形部分 \`aria-hidden\`——
不再附資料表，那會讓報讀器把同一份數字唸兩次。`,methods:[],displayName:"Bullet",props:{label:{required:!0,tsType:{name:"string"},description:"指標名稱。"},value:{required:!0,tsType:{name:"number"},description:""},target:{required:!0,tsType:{name:"number"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function ge({points:n,title:o="散布圖",xLabel:t,yLabel:r,valueFmt:m=B,onSelect:i,selectedIndex:s,color:c=j[0],height:u=220,className:v}){if(n.length===0)return e.jsx(A,{});const p=320,l={top:10,right:10,bottom:28,left:10},f=n.map(a=>a.x),y=n.map(a=>a.y),[T,S]=[Math.min(...f),Math.max(...f)],[b,d]=[Math.min(...y),Math.max(...y)],h=a=>l.left+(a-T)/Math.max(1e-9,S-T)*(p-l.left-l.right),N=a=>l.top+(1-(a-b)/Math.max(1e-9,d-b))*(u-l.top-l.bottom);return e.jsxs("div",{className:v,children:[e.jsxs("svg",{role:"img","aria-label":`${o}，${n.length} 個點，橫軸 ${t}、縱軸 ${r}`,viewBox:`0 0 ${p} ${u}`,className:"block w-full",style:{maxWidth:p},children:[e.jsx("line",{x1:l.left,y1:u-l.bottom,x2:p-l.right,y2:u-l.bottom,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:l.left,y1:l.top,x2:l.left,y2:u-l.bottom,stroke:"var(--chart-axis)"}),n.map((a,x)=>{const q=s!=null&&s!==x;return e.jsx("circle",{cx:h(a.x),cy:N(a.y),r:s===x?5.5:4,fill:c,opacity:q?.3:.8,onClick:i?()=>i(x,a):void 0,className:w(i&&"cursor-pointer"),children:e.jsx("title",{children:`${a.label??`第 ${x+1} 點`}：${t} ${m(a.x)}、${r} ${m(a.y)}`})},a.id??x)}),e.jsxs("text",{x:(p+l.left)/2,y:u-8,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:[t," →"]}),e.jsxs("text",{x:l.left+4,y:l.top+2,fontSize:10,fill:"var(--chart-text)",children:["↑ ",r]})]}),e.jsx(U,{caption:`${o}（各點座標）`,head:["點",t,r],rows:n.map((a,x)=>[a.label??`第 ${x+1} 點`,m(a.x),m(a.y)]),onSelect:i?a=>i(a,n[a]):void 0,selectedIndex:s})]})}ge.__docgenInfo={description:`散布圖：兩個數值之間有沒有關係。點數 20–300 才有意義——
少於 10 個點看不出關係卻容易讓人腦補出一條線，上千個點請先在資料層彙總。

軸範圍取自資料的 min/max（**不從 0 起算**）：散布圖看的是分散形狀，不是絕對大小。`,methods:[],displayName:"Scatter",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"散布圖"',computed:!1}},xLabel:{required:!0,tsType:{name:"string"},description:"兩軸各是什麼。不標的話整張圖無從得知——視同必填。"},yLabel:{required:!0,tsType:{name:"string"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, point: Point) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}},name:"point"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function be({rowLabels:n,colLabels:o,cells:t,title:r="熱圖",domain:m,fmt:i=B,legend:s=!0,onSelect:c,className:u}){const v=t.flat().filter(y=>y!=null);if(n.length===0||v.length===0)return e.jsx(A,{});let[p,l]=m??[Math.min(...v),Math.max(...v)];p===l&&([p,l]=[p-1,l+1]);const f=y=>8+(y-p)/(l-p)*70;return e.jsxs("div",{className:w("overflow-x-auto",u),children:[e.jsxs("table",{className:"border-collapse text-xs",children:[e.jsx("caption",{className:"p-1 text-left font-medium",children:r}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("td",{}),o.map(y=>e.jsx("th",{scope:"col",className:"px-2 py-1 text-center font-medium",children:y},y))]})}),e.jsx("tbody",{children:n.map((y,T)=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"pr-2 text-left font-medium",children:y}),o.map((S,b)=>{var h;const d=((h=t[T])==null?void 0:h[b])??null;return e.jsx("td",{onClick:c?()=>c(T,b,d):void 0,className:w("min-w-14 border border-background px-2 py-1.5 text-center tabular-nums",c&&"cursor-pointer",d==null&&"bg-muted text-muted-foreground"),style:d==null?void 0:{backgroundColor:`color-mix(in srgb, ${j[0]} ${f(d)}%, transparent)`},children:d==null?"—":i(d)},b)})]},y))})]}),s&&e.jsxs("p",{className:"mt-1 flex items-center gap-2 text-xs text-muted-foreground",children:[e.jsx("span",{"aria-hidden":!0,className:"inline-block h-2.5 w-16 rounded-sm",style:{background:`linear-gradient(to right, color-mix(in srgb, ${j[0]} 8%, transparent), color-mix(in srgb, ${j[0]} 78%, transparent))`}}),"淺 ",i(p)," → 深 ",i(l),"；灰＝無資料"]})]})}be.__docgenInfo={description:`熱圖：兩個維度交叉之後，值集中在哪裡。格子數 100 以內——
人沒辦法在 2500 格裡找出模式，那需要排序後的清單或 Pareto。

無障礙：熱圖**本來就是真表格**——數值是可見文字、顏色只是輔助。
不另附 sr-only 表格，把表格語意補正即可（caption／scope／列標頭）。`,methods:[],displayName:"Heatmap",props:{rowLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},colLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},cells:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"unknown"}],raw:"(number | null)[]"}],raw:"(number | null)[][]"},description:"列 × 欄。**`null` 代表無資料，不是 0**——沒有發生和數值為零是兩件事。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"熱圖"',computed:!1}},domain:{required:!1,tsType:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},description:`色階值域。不給就依當期資料自動取 min/max。
**跨期比較時務必手動指定**：多張並排的熱圖各自用自動值域，
每張的「最深」代表不同的數字，並排比較就是錯的——而且錯得看不出來。`},fmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},legend:{required:!1,tsType:{name:"boolean"},description:"色階圖例（預設開）。",defaultValue:{value:"true",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: number, col: number, value: number | null) => void",signature:{arguments:[{type:{name:"number"},name:"row"},{type:{name:"number"},name:"col"},{type:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}]},name:"value"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};function ve({points:n,title:o="累積分布",diagonal:t=!0,height:r=220,className:m}){if(n.length===0)return e.jsx(A,{});const i=240,s=12,c=l=>s+l*(i-s*2),u=l=>s+(1-l)*(r-s*2),v=[...n].sort((l,f)=>l.x-f.x),p=v.reduce((l,f)=>Math.abs(f.x-.2)<Math.abs(l.x-.2)?f:l,v[0]);return e.jsxs("div",{className:m,children:[e.jsxs("svg",{role:"img","aria-label":`${o}，前 ${Math.round(p.x*100)}% 累積約 ${Math.round(p.y*100)}%`,viewBox:`0 0 ${i} ${r}`,className:"block w-full",style:{maxWidth:i},children:[e.jsx("line",{x1:s,y1:r-s,x2:i-s,y2:r-s,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:s,y1:s,x2:s,y2:r-s,stroke:"var(--chart-axis)"}),t&&e.jsx("line",{x1:c(0),y1:u(0),x2:c(1),y2:u(1),stroke:"var(--chart-grid)",strokeDasharray:"4 3"}),e.jsx("polyline",{points:[`${c(0)},${u(0)}`,...v.map(l=>`${c(l.x)},${u(l.y)}`)].join(" "),fill:"none",stroke:j[0],strokeWidth:2})]}),e.jsx(U,{caption:`${o}（累積比例）`,head:["位置","累積"],rows:v.map(l=>[l.label??`前 ${Math.round(l.x*100)}%`,`${Math.round(l.y*100)}%`])})]})}ve.__docgenInfo={description:`累積分布折線：配對角基準線看「離平均分布差多遠」。
例：前 20% 的對象貢獻了多少總量。

對角線是這張圖的全部意義所在——沒有基準線，這條曲線讀不出任何東西。
時間序列不要用這支（那是 TrendChart）：這裡兩軸都是 0–1 的比例，語意不同。`,methods:[],displayName:"LineChart",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:"累積分布曲線的點，**x 與 y 都必須先正規化到 0–1**。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"累積分布"',computed:!1}},diagonal:{required:!1,tsType:{name:"boolean"},description:"對角基準線（完全平均分布），預設開。曲線離對角線越遠＝越集中。",defaultValue:{value:"true",computed:!1}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function he({items:n,className:o}){return e.jsx("ul",{className:w("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs",o),children:n.map(t=>e.jsxs("li",{className:"flex items-center gap-1.5",children:[e.jsx("span",{"aria-hidden":!0,className:"inline-block size-2.5 rounded-sm border border-foreground/20",style:{backgroundColor:t.color}}),t.label]},t.label))})}he.__docgenInfo={description:`圖例：色塊 ＋ 文字標籤。**色塊永遠不會單獨出現**——只有色塊的圖例，
灰階列印後全部一樣。

只有多序列的圖（StackedBar）需要圖例；單序列的圖不要放——
一個顏色配一行說明只是佔位子，標題已經說完了。`,methods:[],displayName:"Legend",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"LegendItem"}],raw:"LegendItem[]"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const Ce={title:"元件/資料/圖表 Charts"},qe=n=>{const o=new Map;for(const t of g)o.set(t[n],(o.get(t[n])??0)+t.amount);return[...o.entries()].map(([t,r])=>({label:t,value:r}))},O=qe("unit"),L={render:()=>{const[n,o]=Te.useState();return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各單位金額（BarChart，點長條或進資料表鑽取）"}),e.jsx(F,{data:O,title:"各單位金額",showValues:!0,valueFmt:t=>E(t),onSelect:t=>o(t===n?void 0:t),selectedIndex:n}),n!=null&&e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["已選：",O[n].label,"——明細清單由宿主渲染，元件只回報 index"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"集中度（Pareto，元件自行排序＋累積線）"}),e.jsx(H,{data:O,title:"各單位金額集中度",valueFmt:t=>E(t)})]})]})}},_={render:()=>{const n=[...new Set(g.map(t=>t.unit))].map(t=>({label:t,segments:[...new Set(g.map(r=>r.category))].map((r,m)=>({label:r,value:g.filter(i=>i.unit===t&&i.category===r).reduce((i,s)=>i+s.amount,0),color:j[m]}))})),o=[...new Set(g.map(t=>t.category))];return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"各單位的分類組成（StackedBar＋Legend）"}),e.jsx(he,{items:o.map((t,r)=>({label:t,color:j[r]}))}),e.jsx(P,{rows:n,title:"各單位分類組成",valueFmt:t=>E(t)})]})}},M={render:()=>{const n=new Map;for(const s of g){const c=Number(s.createdAt.slice(8,10)),u=`${s.createdAt.slice(5,7)}月${c<=15?"上":"下"}`;n.set(u,(n.get(u)??0)+s.amount)}const o=[...n.entries()].map(([s,c])=>({label:s,value:c})),t=[...g].sort((s,c)=>c.amount-s.amount),r=t.reduce((s,c)=>s+c.amount,0);let m=0;const i=t.map((s,c)=>({x:(c+1)/t.length,y:(m+=s.amount)/r}));return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各期金額（TrendChart，zeroBased 預設開）"}),e.jsx(ye,{data:o,title:"各期金額",valueFmt:s=>E(s)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"累積分布（LineChart，離對角線越遠越集中）"}),e.jsx(ve,{points:i,title:"金額累積分布"})]})]})}},R={render:()=>e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"數量 × 金額（Scatter，軸範圍取 min/max）"}),e.jsx(ge,{points:g.map(n=>({x:n.qty,y:n.amount,label:n.id})),title:"數量與金額的關係",xLabel:"數量",yLabel:"金額",valueFmt:n=>$(n)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"單位 × 分類（Heatmap，null＝無資料不是 0）"}),e.jsx(be,{title:"單位 × 分類金額",rowLabels:[...new Set(g.map(n=>n.unit))],colLabels:[...new Set(g.map(n=>n.category))],cells:[...new Set(g.map(n=>n.unit))].map(n=>[...new Set(g.map(o=>o.category))].map(o=>{const t=g.filter(r=>r.unit===n&&r.category===o);return t.length?t.reduce((r,m)=>r+m.amount,0):null})),fmt:n=>$(Math.round(n/1e3))+"K"})]})]})},C={render:()=>{const n={done:"success",confirmed:"info",draft:"muted",void:"danger"},o=[...new Set(g.map(r=>r.unit))].slice(0,4),t=r=>o.map(m=>({label:m,segments:Object.keys(n).map((i,s)=>({label:k[i],value:g.filter(c=>c.unit===m&&c.status===i).length,color:r(i,s)}))}));return e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"✅ 狀態維度用 STATUS_SERIES——與徽章同一套語意"}),e.jsxs("div",{className:"mb-2 flex gap-2",children:[e.jsx(W,{variant:"success",children:k.done}),e.jsx(W,{variant:"info",children:k.confirmed}),e.jsx(W,{variant:"danger",children:k.void})]}),e.jsx(P,{title:"各單位狀態組成（語意色）",rows:t(r=>Se[n[r]])}),e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["「",k.done,"」在徽章上是綠的，在圖表裡也是綠的——語意記憶不被拆掉。"]})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["🚫 同一份資料照序取 PALETTE——「",k.done,"」變藍、與徽章打架"]}),e.jsx(P,{title:"各單位狀態組成（誤：分類色）",rows:t((r,m)=>j[m])})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["第 2 層【身分】：colorByKey——「",o[1],"」在所有圖表、所有期別同一色"]}),e.jsx(F,{title:"依固定鍵清單取色",data:o.map(r=>({label:r,value:g.filter(m=>m.unit===r).length})),color:we(o[1],o),showValues:!0}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"鍵清單是維度的定義（宿主宣告一次、所有圖表共用），不是當期資料的排序。"})]})]})}},V={render:()=>{const n=g.filter(t=>t.status==="done").reduce((t,r)=>t+r.amount,0),o=g.reduce((t,r)=>t+r.amount,0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsx(K,{label:"已完成金額（目標＝上限）",value:n,target:o*.3,valueFmt:t=>E(t)}),e.jsx(K,{label:"批次數（未超出）",value:12,target:20}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"超出目標走 danger、未超出走 success——這是唯一使用狀態色的圖。"})]})}},I={args:{圖表類型:"長條",資料點數:6,段數:4,顯示數值:!0,類別上限:12,從零起算:!0},argTypes:{圖表類型:{control:"select",options:["長條","柏拉圖","趨勢","堆疊"]},資料點數:{control:{type:"range",min:0,max:30,step:1}},段數:{control:{type:"range",min:1,max:12,step:1},if:{arg:"圖表類型",eq:"堆疊"}},顯示數值:{control:"boolean",if:{arg:"圖表類型",eq:"長條"}},類別上限:{control:{type:"range",min:3,max:12,step:1},if:{arg:"圖表類型",eq:"長條"}},從零起算:{control:"boolean",if:{arg:"圖表類型",eq:"趨勢"}}},render:n=>{const o=()=>{switch(n.圖表類型){case"柏拉圖":return e.jsx(H,{data:z(n.資料點數),title:"集中度",valueFmt:t=>$(t)});case"趨勢":return e.jsx(ye,{data:z(n.資料點數,{labelKind:"period"}),title:"各期數值",zeroBased:n.從零起算,valueFmt:t=>$(t)});case"堆疊":return e.jsx(P,{rows:Ne(n.資料點數,n.段數).map(t=>({...t,segments:t.segments.map((r,m)=>({...r,color:j[m%j.length]}))})),title:"分類組成",valueFmt:t=>$(t)});default:return e.jsx(F,{data:z(n.資料點數),title:"各單位數值",showValues:n.顯示數值,maxItems:n.類別上限,valueFmt:t=>$(t)})}};return e.jsx("div",{className:"max-w-2xl",children:o()})}};var Y,X,G;L.parameters={...L.parameters,docs:{...(Y=L.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(G=(X=L.parameters)==null?void 0:X.docs)==null?void 0:G.source}}};var J,Q,Z;_.parameters={..._.parameters,docs:{...(J=_.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Z=(Q=_.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var ee,te,ne;M.parameters={...M.parameters,docs:{...(ee=M.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ne=(te=M.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var ae,re,se;R.parameters={...R.parameters,docs:{...(ae=R.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
}`,...(se=(re=R.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var le,oe,ie;C.parameters={...C.parameters,docs:{...(le=C.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(ie=(oe=C.parameters)==null?void 0:oe.docs)==null?void 0:ie.source}}};var me,ue,de;V.parameters={...V.parameters,docs:{...(me=V.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(de=(ue=V.parameters)==null?void 0:ue.docs)==null?void 0:de.source}}};var ce,pe,xe;I.parameters={...I.parameters,docs:{...(ce=I.parameters)==null?void 0:ce.docs,source:{originalSource:`{
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
}`,...(xe=(pe=I.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};const Ve=["長條與柏拉圖","堆疊與圖例","趨勢與累積","散布與熱圖","語意維度的堆疊","子彈圖","互動"];export{Ve as __namedExportsOrder,Ce as default,I as 互動,_ as 堆疊與圖例,V as 子彈圖,R as 散布與熱圖,C as 語意維度的堆疊,M as 趨勢與累積,L as 長條與柏拉圖};
