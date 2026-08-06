import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as be}from"./index-BFQ_Q9OP.js";import{b as W,c as w,f as E}from"./utils-Cn0sxhoU.js";import{B as U}from"./badge-BHNJnXQI.js";import{a as h,S as B}from"./sample-data-DlVwqcXX.js";import"./index-DHGqUdmq.js";const q=Array.from({length:8},(t,i)=>`var(--chart-${i+1})`);function me(t,i){if(t.length<=i)return t;const n=new Set([...t].sort((o,r)=>r.value-o.value).slice(0,i-1)),s=t.filter(o=>n.has(o)),m=t.filter(o=>!n.has(o));return[...s,{label:`其他（${m.length} 項）`,value:m.reduce((o,r)=>o+r.value,0)}]}const $=t=>W(t),ge={success:"hsl(var(--success-subtle))",warning:"hsl(var(--warning-subtle))",info:"hsl(var(--info-subtle))",danger:"hsl(var(--danger-subtle))",muted:"hsl(var(--muted))"};function ve(t,i){const n=i.indexOf(t);return n>=0&&n<q.length?q[n]:"hsl(var(--muted))"}function A({caption:t,head:i,rows:n,onSelect:s,selectedIndex:m,className:o}){return e.jsx("div",{className:w("sr-only focus-within:not-sr-only focus-within:mt-2 focus-within:block",o),children:e.jsxs("table",{className:"w-full border-collapse rounded-md border text-xs",children:[e.jsx("caption",{className:"p-1 text-left font-medium",children:t}),e.jsx("thead",{children:e.jsx("tr",{children:i.map(r=>e.jsx("th",{scope:"col",className:"border-b px-2 py-1 text-left font-medium",children:r},r))})}),e.jsx("tbody",{children:n.map((r,d)=>e.jsxs("tr",{className:w(m===d&&"bg-muted"),children:[e.jsx("th",{scope:"row",className:"px-2 py-1 text-left font-normal",children:s?e.jsx("button",{type:"button",onClick:()=>s(d),"aria-pressed":m===d,className:"underline decoration-dotted underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring",children:r[0]}):r[0]}),r.slice(1).map((c,g)=>e.jsx("td",{className:"px-2 py-1 tabular-nums",children:c},g))]},d))})]})})}function k({children:t}){return e.jsx("p",{className:"py-6 text-center text-sm text-muted-foreground",children:t??"無資料"})}A.__docgenInfo={description:'文字等價 ＋ 鍵盤等價，一張表兩個職責（見〈Charts 圖表〉的無障礙一節與\n無障礙四原則的「文字等價用表格」）：\n\n- **報讀器**：圖形掛 `role="img"` 後子樹被隱藏，精確數值由這張表補回\n  （`<caption>` ＋ `scope`，報讀器有專門的表格瀏覽指令）。\n- **鍵盤**：hover 提示與點擊鑽取對鍵盤使用者不可達——這張表兼任操作介面，\n  有 `onSelect` 時每一列是一顆真按鈕。表平常 `sr-only`，**鍵盤焦點進入時現形**\n  （同 skip-link 的慣例），明眼的鍵盤使用者才不會把焦點丟進看不見的地方。',methods:[],displayName:"ChartDataTable",props:{caption:{required:!0,tsType:{name:"string"},description:"表格標題＝這張圖在講什麼。報讀器靠它定位，所以必填。"},head:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"}],raw:"string[][]"},description:"每列＝[label, ...值們]（已格式化成字串）。"},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};k.__docgenInfo={description:"空資料的統一出口：一行「無資料」，不畫空白座標軸（見文件〈空資料、單點、全零〉）。",methods:[],displayName:"ChartEmpty",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};function O({data:t,title:i="長條圖",showValues:n=!1,maxItems:s=12,valueFmt:m=$,onSelect:o,selectedIndex:r,color:d=q[0],height:c=180,className:g}){if(t.length===0)return e.jsx(k,{});const u=me(t,s),l=Math.max(1,...u.map(x=>x.value)),y=56,p={top:n?18:8,bottom:20},T=c-p.top-p.bottom,N=u.length*y,v=u.reduce((x,j)=>j.value>x.value?j:x,u[0]);return e.jsxs("div",{className:w("overflow-x-auto",g),children:[e.jsxs("svg",{role:"img","aria-label":`${i}，共 ${u.length} 項，最高為 ${v.label} ${m(v.value)}`,viewBox:`0 0 ${N} ${c}`,width:N,height:c,className:"block",children:[e.jsx("line",{x1:0,y1:c-p.bottom,x2:N,y2:c-p.bottom,stroke:"var(--chart-axis)"}),u.map((x,j)=>{const f=x.value/l*T,a=j*y+10,b=c-p.bottom-f,S=r!=null&&r!==j;return e.jsxs("g",{onClick:o?()=>o(j,x):void 0,className:w(o&&"cursor-pointer"),children:[e.jsx("title",{children:`${x.label}：${m(x.value)}`}),e.jsx("rect",{x:a,y:b,width:y-20,height:f,fill:d,opacity:S?.35:1}),n&&e.jsx("text",{x:a+(y-20)/2,y:b-4,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:m(x.value)}),e.jsx("text",{x:a+(y-20)/2,y:c-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:x.label})]},x.id??x.label)})]}),e.jsx(A,{caption:`${i}（資料表）`,head:["項目","數值"],rows:u.map(x=>[x.label,m(x.value)]),onSelect:o?x=>o(x,u[x]):void 0,selectedIndex:r})]})}O.__docgenInfo={description:`長條圖：比較同一個量在不同類別間的大小。
類別是時間（月份、週）請用 TrendChart——長條不表達「順序連續」。`,methods:[],displayName:"BarChart",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"這張圖在講什麼——同時是 aria-label 摘要與資料表 caption 的開頭。",defaultValue:{value:'"長條圖"',computed:!1}},showValues:{required:!1,tsType:{name:"boolean"},description:`在長條頂端標數值。**列印與觸控裝置一定要開**——
沒有 hover 的情境裡，不標值的長條只是形狀。`,defaultValue:{value:"false",computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:"類別上限（含彙總項），超過取值最大的前幾名、其餘併成「其他」。",defaultValue:{value:"12",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:"點擊鑽取。明細清單由宿主渲染——元件不猜「鑽下去看什麼」。"},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"單一序列色。預設 `PALETTE[0]`——它是全站單序列圖的預設色，要穩定。",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function ue({data:t,title:i="柏拉圖",maxItems:n=12,valueFmt:s=$,onSelect:m,selectedIndex:o,height:r=180,className:d}){if(t.length===0)return e.jsx(k,{});const c=me([...t].sort((a,b)=>b.value-a.value),n),g=Math.max(1,c.reduce((a,b)=>a+b.value,0)),u=Math.max(1,...c.map(a=>a.value)),l=56,y={top:10,bottom:20},p=r-y.top-y.bottom,T=c.length*l;let N=0;const v=c.map(a=>(N+=a.value)/g),x=a=>a*l+10+(l-20)/2,j=a=>y.top+(1-a)*p,f=v.findIndex(a=>a>=.8);return e.jsxs("div",{className:w("overflow-x-auto",d),children:[e.jsxs("svg",{role:"img","aria-label":`${i}，共 ${c.length} 項，前 ${f+1} 項累積佔 ${Math.round(v[Math.max(f,0)]*100)}%`,viewBox:`0 0 ${T} ${r}`,width:T,height:r,className:"block",children:[e.jsx("line",{x1:0,y1:r-y.bottom,x2:T,y2:r-y.bottom,stroke:"var(--chart-axis)"}),c.map((a,b)=>{const S=a.value/u*p,D=b*l+10,ye=o!=null&&o!==b;return e.jsxs("g",{onClick:m?()=>m(b,a):void 0,className:w(m&&"cursor-pointer"),children:[e.jsx("title",{children:`${a.label}：${s(a.value)}（累積 ${Math.round(v[b]*100)}%）`}),e.jsx("rect",{x:D,y:r-y.bottom-S,width:l-20,height:S,fill:q[0],opacity:ye?.35:1}),e.jsx("text",{x:D+(l-20)/2,y:r-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:a.label})]},a.id??a.label)}),e.jsx("polyline",{points:v.map((a,b)=>`${x(b)},${j(a)}`).join(" "),fill:"none",stroke:"var(--chart-text)",strokeWidth:1.5}),v.map((a,b)=>e.jsx("circle",{cx:x(b),cy:j(a),r:2.5,fill:"var(--chart-text)"},b))]}),e.jsx(A,{caption:`${i}（資料表，含累積佔比）`,head:["項目","數值","累積"],rows:c.map((a,b)=>[a.label,s(a.value),`${Math.round(v[b]*100)}%`]),onSelect:m?a=>m(a,c[a]):void 0,selectedIndex:o})]})}ue.__docgenInfo={description:`柏拉圖：長條由大到小 ＋ 累積百分比折線。回答「前幾項就佔掉多少」。

累積線是本組唯一的「雙軸」——它是柏拉圖的定義，不是為了省一張圖疊上去的。
即使如此也不畫第二條 Y 軸刻度，累積值只在提示與資料表裡以百分比呈現。

單一顏色是刻意的例外：整張圖的語意就是排序，分類配色反而添亂。`,methods:[],displayName:"Pareto",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:"元件內部自行由大到小排序，宿主不必先排。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"柏拉圖"',computed:!1}},maxItems:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"12",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function I({rows:t,title:i="堆疊長條",valueFmt:n=$,onSelectRow:s,selectedRow:m,height:o=22,className:r}){if(t.length===0)return e.jsx(k,{});const d=t.map(u=>u.segments.reduce((l,y)=>l+y.value,0)),c=Math.max(1,...d),g=[...new Set(t.flatMap(u=>u.segments.map(l=>l.label)))];return e.jsxs("div",{className:r,children:[e.jsx("div",{className:"space-y-1.5",children:t.map((u,l)=>{const y=m!=null&&m!==l;return e.jsxs("div",{className:w("flex items-center gap-2",s&&"cursor-pointer",y&&"opacity-50"),onClick:s?()=>s(l,u):void 0,children:[e.jsx("span",{className:"w-24 shrink-0 truncate text-xs",children:u.label}),e.jsx("div",{"aria-hidden":!0,className:"flex h-full flex-1 overflow-hidden rounded-sm",style:{height:o},children:u.segments.map(p=>e.jsx("div",{title:`${p.label}：${n(p.value)}`,style:{width:`${p.value/c*100}%`,backgroundColor:p.color}},p.label))}),e.jsx("span",{className:"w-20 shrink-0 text-right text-xs tabular-nums",children:n(d[l])})]},u.label)})}),e.jsx(A,{caption:`${i}（各列分段明細）`,head:["項目",...g,"合計"],rows:t.map((u,l)=>[u.label,...g.map(y=>{const p=u.segments.find(T=>T.label===y);return p?n(p.value):"—"}),n(d[l])]),onSelect:s?u=>s(u,t[u]):void 0,selectedIndex:m})]})}I.__docgenInfo={description:`水平堆疊長條：看一個總量由哪些部分構成，同時比較多個總量。

每列右側**固定顯示總量**——堆疊圖最常被問的就是「所以總共多少」，
人沒辦法用眼睛把幾個色塊加起來。

分段顏色由宿主指定（\`Segment.color\`）：序列色要**跨期穩定**、跟實體走，
元件沒有那個知識，猜了只會猜錯。

無障礙：數值已在鄰近可見文字（列標籤＋合計），圖形部分 \`aria-hidden\`，
分段明細由資料表提供——避免同一份資料被報讀器唸兩次。`,methods:[],displayName:"StackedBar",props:{rows:{required:!0,tsType:{name:"Array",elements:[{name:"StackedBarRow"}],raw:"StackedBarRow[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"堆疊長條"',computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelectRow:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, row: StackedBarRow) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"StackedBarRow"},name:"row"}],return:{name:"void"}}},description:""},selectedRow:{required:!1,tsType:{name:"number"},description:""},height:{required:!1,tsType:{name:"number"},description:"單列高度（px）。",defaultValue:{value:"22",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function de({data:t,title:i="趨勢折線",zeroBased:n=!0,valueFmt:s=$,onSelect:m,selectedIndex:o,color:r=q[0],height:d=180,className:c}){if(t.length===0)return e.jsx(k,{});const g=64,u={top:18,bottom:20},l=d-u.top-u.bottom,y=Math.max(1,t.length)*g,p=n?0:Math.min(...t.map(f=>f.value)),T=Math.max(n?1:p+1,...t.map(f=>f.value)),N=f=>f*g+g/2,v=f=>u.top+(1-(f-p)/(T-p))*l,x=t[0],j=t[t.length-1];return e.jsxs("div",{className:w("overflow-x-auto",c),children:[e.jsxs("svg",{role:"img","aria-label":`${i}，${t.length} 期，${x.label} ${s(x.value)} 到 ${j.label} ${s(j.value)}`,viewBox:`0 0 ${y} ${d}`,width:y,height:d,className:"block",children:[e.jsx("line",{x1:0,y1:d-u.bottom,x2:y,y2:d-u.bottom,stroke:"var(--chart-axis)"}),t.length>1&&e.jsx("polyline",{points:t.map((f,a)=>`${N(a)},${v(f.value)}`).join(" "),fill:"none",stroke:r,strokeWidth:2}),t.map((f,a)=>{const b=o===a,S=a===0||a===t.length-1;return e.jsxs("g",{onClick:m?()=>m(a,f):void 0,className:w(m&&"cursor-pointer"),children:[e.jsx("title",{children:`${f.label}：${s(f.value)}`}),e.jsx("circle",{cx:N(a),cy:v(f.value),r:b?5:3.5,fill:r}),S&&e.jsx("text",{x:N(a),y:v(f.value)-8,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:s(f.value)}),e.jsx("text",{x:N(a),y:d-6,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:f.label})]},f.id??f.label)})]}),e.jsx(A,{caption:`${i}（各期數值）`,head:["期別標籤","數值"],rows:t.map(f=>[f.label,s(f.value)]),onSelect:m?f=>m(f,t[f]):void 0,selectedIndex:o})]})}de.__docgenInfo={description:`趨勢折線：同一個量隨時間怎麼變。
單一資料點沒有趨勢可言——只畫該點並置中，不畫線。`,methods:[],displayName:"TrendChart",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"BarDatum[]"},description:"`label` 當 x 軸刻度——x 軸必須是**等距的時間**（每月、每週）。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"趨勢折線"',computed:!1}},zeroBased:{required:!1,tsType:{name:"boolean"},description:`Y 軸是否從 0 起算，預設 **true**。
金額、數量這類絕對量一律從 0 起算——才不會把 2% 的波動畫成懸崖。
只有看「相對變化」時才關；關掉時兩端數值仍會標示，那是誠實的底線。`,defaultValue:{value:"true",computed:!1}},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, datum: BarDatum) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ label: string; value: number; id?: string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}},{key:"id",value:{name:"string",required:!1}}]}},name:"datum"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"180",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function z({label:t,value:i,target:n,valueFmt:s=$,className:m}){const o=i>n,r=Math.max(1,i,n),d=n>0?Math.round(i/n*100):null,c=o?"hsl(var(--danger))":"hsl(var(--success))";return e.jsxs("div",{className:w("space-y-1",m),children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-2 text-xs",children:[e.jsx("span",{className:"font-medium",children:t}),e.jsxs("span",{className:"tabular-nums",children:[s(i)," / 目標 ",s(n),d!=null&&e.jsxs("span",{className:"ml-1 text-muted-foreground",children:["（",d,"%）"]})]})]}),e.jsxs("div",{"aria-hidden":!0,className:"relative h-3 overflow-hidden rounded-sm bg-muted",children:[e.jsx("div",{className:"h-full",style:{width:`${i/r*100}%`,backgroundColor:c}}),e.jsx("div",{className:"absolute inset-y-0 w-0.5 bg-foreground",style:{left:`${n/r*100}%`}})]})]})}z.__docgenInfo={description:`子彈圖：實際 vs 目標，一條就講完。放在卡片頂端當摘要。

**這是唯一使用狀態色的圖**：超出目標走 \`--danger\`、未超出走 \`--success\`。
預設假設「目標＝上限」（例如預算）；若你的指標是「目標＝下限」，
請用文案講清楚，不要讓讀者自己猜紅色代表什麼。

無障礙：實際、目標、達成率都是**鄰近可見文字**，圖形部分 \`aria-hidden\`——
不再附資料表，那會讓報讀器把同一份數字唸兩次。`,methods:[],displayName:"Bullet",props:{label:{required:!0,tsType:{name:"string"},description:"指標名稱。"},value:{required:!0,tsType:{name:"number"},description:""},target:{required:!0,tsType:{name:"number"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function ce({points:t,title:i="散布圖",xLabel:n,yLabel:s,valueFmt:m=$,onSelect:o,selectedIndex:r,color:d=q[0],height:c=220,className:g}){if(t.length===0)return e.jsx(k,{});const u=320,l={top:10,right:10,bottom:28,left:10},y=t.map(a=>a.x),p=t.map(a=>a.y),[T,N]=[Math.min(...y),Math.max(...y)],[v,x]=[Math.min(...p),Math.max(...p)],j=a=>l.left+(a-T)/Math.max(1e-9,N-T)*(u-l.left-l.right),f=a=>l.top+(1-(a-v)/Math.max(1e-9,x-v))*(c-l.top-l.bottom);return e.jsxs("div",{className:g,children:[e.jsxs("svg",{role:"img","aria-label":`${i}，${t.length} 個點，橫軸 ${n}、縱軸 ${s}`,viewBox:`0 0 ${u} ${c}`,className:"block w-full",style:{maxWidth:u},children:[e.jsx("line",{x1:l.left,y1:c-l.bottom,x2:u-l.right,y2:c-l.bottom,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:l.left,y1:l.top,x2:l.left,y2:c-l.bottom,stroke:"var(--chart-axis)"}),t.map((a,b)=>{const S=r!=null&&r!==b;return e.jsx("circle",{cx:j(a.x),cy:f(a.y),r:r===b?5.5:4,fill:d,opacity:S?.3:.8,onClick:o?()=>o(b,a):void 0,className:w(o&&"cursor-pointer"),children:e.jsx("title",{children:`${a.label??`第 ${b+1} 點`}：${n} ${m(a.x)}、${s} ${m(a.y)}`})},a.id??b)}),e.jsxs("text",{x:(u+l.left)/2,y:c-8,textAnchor:"middle",fontSize:10,fill:"var(--chart-text)",children:[n," →"]}),e.jsxs("text",{x:l.left+4,y:l.top+2,fontSize:10,fill:"var(--chart-text)",children:["↑ ",s]})]}),e.jsx(A,{caption:`${i}（各點座標）`,head:["點",n,s],rows:t.map((a,b)=>[a.label??`第 ${b+1} 點`,m(a.x),m(a.y)]),onSelect:o?a=>o(a,t[a]):void 0,selectedIndex:r})]})}ce.__docgenInfo={description:`散布圖：兩個數值之間有沒有關係。點數 20–300 才有意義——
少於 10 個點看不出關係卻容易讓人腦補出一條線，上千個點請先在資料層彙總。

軸範圍取自資料的 min/max（**不從 0 起算**）：散布圖看的是分散形狀，不是絕對大小。`,methods:[],displayName:"Scatter",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"散布圖"',computed:!1}},xLabel:{required:!0,tsType:{name:"string"},description:"兩軸各是什麼。不標的話整張圖無從得知——視同必填。"},yLabel:{required:!0,tsType:{name:"string"},description:""},valueFmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number, point: Point) => void",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}},name:"point"}],return:{name:"void"}}},description:""},selectedIndex:{required:!1,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"PALETTE[0]",computed:!0}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function pe({rowLabels:t,colLabels:i,cells:n,title:s="熱圖",domain:m,fmt:o=$,legend:r=!0,onSelect:d,className:c}){const g=n.flat().filter(p=>p!=null);if(t.length===0||g.length===0)return e.jsx(k,{});let[u,l]=m??[Math.min(...g),Math.max(...g)];u===l&&([u,l]=[u-1,l+1]);const y=p=>8+(p-u)/(l-u)*70;return e.jsxs("div",{className:w("overflow-x-auto",c),children:[e.jsxs("table",{className:"border-collapse text-xs",children:[e.jsx("caption",{className:"p-1 text-left font-medium",children:s}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("td",{}),i.map(p=>e.jsx("th",{scope:"col",className:"px-2 py-1 text-center font-medium",children:p},p))]})}),e.jsx("tbody",{children:t.map((p,T)=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"pr-2 text-left font-medium",children:p}),i.map((N,v)=>{var j;const x=((j=n[T])==null?void 0:j[v])??null;return e.jsx("td",{onClick:d?()=>d(T,v,x):void 0,className:w("min-w-14 border border-background px-2 py-1.5 text-center tabular-nums",d&&"cursor-pointer",x==null&&"bg-muted text-muted-foreground"),style:x==null?void 0:{backgroundColor:`color-mix(in srgb, ${q[0]} ${y(x)}%, transparent)`},children:x==null?"—":o(x)},v)})]},p))})]}),r&&e.jsxs("p",{className:"mt-1 flex items-center gap-2 text-xs text-muted-foreground",children:[e.jsx("span",{"aria-hidden":!0,className:"inline-block h-2.5 w-16 rounded-sm",style:{background:`linear-gradient(to right, color-mix(in srgb, ${q[0]} 8%, transparent), color-mix(in srgb, ${q[0]} 78%, transparent))`}}),"淺 ",o(u)," → 深 ",o(l),"；灰＝無資料"]})]})}pe.__docgenInfo={description:`熱圖：兩個維度交叉之後，值集中在哪裡。格子數 100 以內——
人沒辦法在 2500 格裡找出模式，那需要排序後的清單或 Pareto。

無障礙：熱圖**本來就是真表格**——數值是可見文字、顏色只是輔助。
不另附 sr-only 表格，把表格語意補正即可（caption／scope／列標頭）。`,methods:[],displayName:"Heatmap",props:{rowLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},colLabels:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},cells:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"unknown"}],raw:"(number | null)[]"}],raw:"(number | null)[][]"},description:"列 × 欄。**`null` 代表無資料，不是 0**——沒有發生和數值為零是兩件事。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"熱圖"',computed:!1}},domain:{required:!1,tsType:{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]},description:`色階值域。不給就依當期資料自動取 min/max。
**跨期比較時務必手動指定**：多張並排的熱圖各自用自動值域，
每張的「最深」代表不同的數字，並排比較就是錯的——而且錯得看不出來。`},fmt:{required:!1,tsType:{name:"signature",type:"function",raw:"(n: number) => string",signature:{arguments:[{type:{name:"number"},name:"n"}],return:{name:"string"}}},description:"",defaultValue:{value:"(n) => formatNumber(n)",computed:!1}},legend:{required:!1,tsType:{name:"boolean"},description:"色階圖例（預設開）。",defaultValue:{value:"true",computed:!1}},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(row: number, col: number, value: number | null) => void",signature:{arguments:[{type:{name:"number"},name:"row"},{type:{name:"number"},name:"col"},{type:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}]},name:"value"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};function xe({points:t,title:i="累積分布",diagonal:n=!0,height:s=220,className:m}){if(t.length===0)return e.jsx(k,{});const o=240,r=12,d=l=>r+l*(o-r*2),c=l=>r+(1-l)*(s-r*2),g=[...t].sort((l,y)=>l.x-y.x),u=g.reduce((l,y)=>Math.abs(y.x-.2)<Math.abs(l.x-.2)?y:l,g[0]);return e.jsxs("div",{className:m,children:[e.jsxs("svg",{role:"img","aria-label":`${i}，前 ${Math.round(u.x*100)}% 累積約 ${Math.round(u.y*100)}%`,viewBox:`0 0 ${o} ${s}`,className:"block w-full",style:{maxWidth:o},children:[e.jsx("line",{x1:r,y1:s-r,x2:o-r,y2:s-r,stroke:"var(--chart-axis)"}),e.jsx("line",{x1:r,y1:r,x2:r,y2:s-r,stroke:"var(--chart-axis)"}),n&&e.jsx("line",{x1:d(0),y1:c(0),x2:d(1),y2:c(1),stroke:"var(--chart-grid)",strokeDasharray:"4 3"}),e.jsx("polyline",{points:[`${d(0)},${c(0)}`,...g.map(l=>`${d(l.x)},${c(l.y)}`)].join(" "),fill:"none",stroke:q[0],strokeWidth:2})]}),e.jsx(A,{caption:`${i}（累積比例）`,head:["位置","累積"],rows:g.map(l=>[l.label??`前 ${Math.round(l.x*100)}%`,`${Math.round(l.y*100)}%`])})]})}xe.__docgenInfo={description:`累積分布折線：配對角基準線看「離平均分布差多遠」。
例：前 20% 的對象貢獻了多少總量。

對角線是這張圖的全部意義所在——沒有基準線，這條曲線讀不出任何東西。
時間序列不要用這支（那是 TrendChart）：這裡兩軸都是 0–1 的比例，語意不同。`,methods:[],displayName:"LineChart",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ x: number; y: number; label?: string; id?: string }",signature:{properties:[{key:"x",value:{name:"number",required:!0}},{key:"y",value:{name:"number",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"id",value:{name:"string",required:!1}}]}}],raw:"Point[]"},description:"累積分布曲線的點，**x 與 y 都必須先正規化到 0–1**。"},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"累積分布"',computed:!1}},diagonal:{required:!1,tsType:{name:"boolean"},description:"對角基準線（完全平均分布），預設開。曲線離對角線越遠＝越集中。",defaultValue:{value:"true",computed:!1}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"220",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function fe({items:t,className:i}){return e.jsx("ul",{className:w("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs",i),children:t.map(n=>e.jsxs("li",{className:"flex items-center gap-1.5",children:[e.jsx("span",{"aria-hidden":!0,className:"inline-block size-2.5 rounded-sm border border-foreground/20",style:{backgroundColor:n.color}}),n.label]},n.label))})}fe.__docgenInfo={description:`圖例：色塊 ＋ 文字標籤。**色塊永遠不會單獨出現**——只有色塊的圖例，
灰階列印後全部一樣。

只有多序列的圖（StackedBar）需要圖例；單序列的圖不要放——
一個顏色配一行說明只是佔位子，標題已經說完了。`,methods:[],displayName:"Legend",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"LegendItem"}],raw:"LegendItem[]"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const ke={title:"元件/資料/圖表 Charts"},he=t=>{const i=new Map;for(const n of h)i.set(n[t],(i.get(n[t])??0)+n.amount);return[...i.entries()].map(([n,s])=>({label:n,value:s}))},P=he("unit"),_={render:()=>{const[t,i]=be.useState();return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各單位金額（BarChart，點長條或進資料表鑽取）"}),e.jsx(O,{data:P,title:"各單位金額",showValues:!0,valueFmt:n=>E(n),onSelect:n=>i(n===t?void 0:n),selectedIndex:t}),t!=null&&e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["已選：",P[t].label,"——明細清單由宿主渲染，元件只回報 index"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"集中度（Pareto，元件自行排序＋累積線）"}),e.jsx(ue,{data:P,title:"各單位金額集中度",valueFmt:n=>E(n)})]})]})}},L={render:()=>{const t=[...new Set(h.map(n=>n.unit))].map(n=>({label:n,segments:[...new Set(h.map(s=>s.category))].map((s,m)=>({label:s,value:h.filter(o=>o.unit===n&&o.category===s).reduce((o,r)=>o+r.amount,0),color:q[m]}))})),i=[...new Set(h.map(n=>n.category))];return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"各單位的分類組成（StackedBar＋Legend）"}),e.jsx(fe,{items:i.map((n,s)=>({label:n,color:q[s]}))}),e.jsx(I,{rows:t,title:"各單位分類組成",valueFmt:n=>E(n)})]})}},M={render:()=>{const t=new Map;for(const r of h){const d=Number(r.createdAt.slice(8,10)),c=`${r.createdAt.slice(5,7)}月${d<=15?"上":"下"}`;t.set(c,(t.get(c)??0)+r.amount)}const i=[...t.entries()].map(([r,d])=>({label:r,value:d})),n=[...h].sort((r,d)=>d.amount-r.amount),s=n.reduce((r,d)=>r+d.amount,0);let m=0;const o=n.map((r,d)=>({x:(d+1)/n.length,y:(m+=r.amount)/s}));return e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"各期金額（TrendChart，zeroBased 預設開）"}),e.jsx(de,{data:i,title:"各期金額",valueFmt:r=>E(r)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"累積分布（LineChart，離對角線越遠越集中）"}),e.jsx(xe,{points:o,title:"金額累積分布"})]})]})}},C={render:()=>e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"數量 × 金額（Scatter，軸範圍取 min/max）"}),e.jsx(ce,{points:h.map(t=>({x:t.qty,y:t.amount,label:t.id})),title:"數量與金額的關係",xLabel:"數量",yLabel:"金額",valueFmt:t=>W(t)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"單位 × 分類（Heatmap，null＝無資料不是 0）"}),e.jsx(pe,{title:"單位 × 分類金額",rowLabels:[...new Set(h.map(t=>t.unit))],colLabels:[...new Set(h.map(t=>t.category))],cells:[...new Set(h.map(t=>t.unit))].map(t=>[...new Set(h.map(i=>i.category))].map(i=>{const n=h.filter(s=>s.unit===t&&s.category===i);return n.length?n.reduce((s,m)=>s+m.amount,0):null})),fmt:t=>W(Math.round(t/1e3))+"K"})]})]})},V={render:()=>{const t={done:"success",confirmed:"info",draft:"muted",void:"danger"},i=[...new Set(h.map(s=>s.unit))].slice(0,4),n=s=>i.map(m=>({label:m,segments:Object.keys(t).map((o,r)=>({label:B[o],value:h.filter(d=>d.unit===m&&d.status===o).length,color:s(o,r)}))}));return e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"✅ 狀態維度用 STATUS_SERIES——與徽章同一套語意"}),e.jsxs("div",{className:"mb-2 flex gap-2",children:[e.jsx(U,{variant:"success",children:B.done}),e.jsx(U,{variant:"info",children:B.confirmed}),e.jsx(U,{variant:"danger",children:B.void})]}),e.jsx(I,{title:"各單位狀態組成（語意色）",rows:n(s=>ge[t[s]])}),e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["「",B.done,"」在徽章上是綠的，在圖表裡也是綠的——語意記憶不被拆掉。"]})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["🚫 同一份資料照序取 PALETTE——「",B.done,"」變藍、與徽章打架"]}),e.jsx(I,{title:"各單位狀態組成（誤：分類色）",rows:n((s,m)=>q[m])})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm font-medium",children:["第 2 層【身分】：colorByKey——「",i[1],"」在所有圖表、所有期別同一色"]}),e.jsx(O,{title:"依固定鍵清單取色",data:i.map(s=>({label:s,value:h.filter(m=>m.unit===s).length})),color:ve(i[1],i),showValues:!0}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"鍵清單是維度的定義（宿主宣告一次、所有圖表共用），不是當期資料的排序。"})]})]})}},R={render:()=>{const t=h.filter(n=>n.status==="done").reduce((n,s)=>n+s.amount,0),i=h.reduce((n,s)=>n+s.amount,0);return e.jsxs("div",{className:"max-w-sm space-y-4",children:[e.jsx(z,{label:"已完成金額（目標＝上限）",value:t,target:i*.3,valueFmt:n=>E(n)}),e.jsx(z,{label:"批次數（未超出）",value:12,target:20}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"超出目標走 danger、未超出走 success——這是唯一使用狀態色的圖。"})]})}};var H,K,Y;_.parameters={..._.parameters,docs:{...(H=_.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(Y=(K=_.parameters)==null?void 0:K.docs)==null?void 0:Y.source}}};var F,X,G;L.parameters={...L.parameters,docs:{...(F=L.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(G=(X=L.parameters)==null?void 0:X.docs)==null?void 0:G.source}}};var J,Q,Z;M.parameters={...M.parameters,docs:{...(J=M.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Z=(Q=M.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var ee,te,ne;C.parameters={...C.parameters,docs:{...(ee=C.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(ne=(te=C.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var re,ae,se;V.parameters={...V.parameters,docs:{...(re=V.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(se=(ae=V.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var le,ie,oe;R.parameters={...R.parameters,docs:{...(le=R.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(oe=(ie=R.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};const $e=["長條與柏拉圖","堆疊與圖例","趨勢與累積","散布與熱圖","語意維度的堆疊","子彈圖"];export{$e as __namedExportsOrder,ke as default,L as 堆疊與圖例,R as 子彈圖,C as 散布與熱圖,V as 語意維度的堆疊,M as 趨勢與累積,_ as 長條與柏拉圖};
