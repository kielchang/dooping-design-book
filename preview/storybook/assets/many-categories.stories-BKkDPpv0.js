import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a,L as w}from"./legend-B8VMETsf.js";import{c,P as k,a as B}from"./stacked-bar-Bu_g74za.js";import{f as l}from"./utils-CMl-9ImW.js";import{d as m,m as C}from"./generate-stress-DqnYZdHV.js";const L={title:"壓力測試/多類別圖形"},x=m(20),n={render:()=>e.jsxs("div",{className:"max-w-2xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"✅ 預設封頂（maxItems 12）：取大者、其餘併「其他」"}),e.jsx("p",{className:"mb-2 text-xs text-muted-foreground",children:"撞出來的規範：超過上限彙總成「其他（N 項）」，不要循環用色。 留意「其他」那支的值——它是 9 個類別的和，不該假裝自己是第 13 類。"}),e.jsx(a,{data:x,title:"二十類（封頂後）",showValues:!0,valueFmt:t=>l(t)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"🚫 不封頂（maxItems 20）：20 支長條"}),e.jsx("p",{className:"mb-2 text-xs text-muted-foreground",children:"該看什麼：圖要嘛水平捲動、要嘛標籤擠成一團；捲出畫面外的長條等於不存在。 這就是封頂存在的理由。"}),e.jsx(a,{data:x,maxItems:20,title:"二十類（不封頂）",valueFmt:t=>l(t)})]})]})},r={render:()=>{const t=m(12).map(s=>s.label),y=C({count:5}).map((s,g)=>({label:s.unit,segments:m(12,{seed:7+g}).map(d=>({label:d.label,value:d.value,color:c(d.label,t)}))}));return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsxs("p",{className:"text-sm font-medium",children:["每列 12 段——色票只有 ",k.length," 色"]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：第 9 段起 colorByKey 一律退灰（muted）——圖例出現一排同色不同名的項目， 這是「該把尾巴併成『其他』」的訊號，不是「該去生第 9 種顏色」。 也試著 hover 最窄的那段：還點得到、讀得到值嗎？"}),e.jsx(w,{items:t.map(s=>({label:s,color:c(s,t)}))}),e.jsx(B,{rows:y,title:"十二段堆疊",valueFmt:s=>l(s)})]})}},o={render:()=>e.jsxs("div",{className:"max-w-xl space-y-8",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"1 個類別"}),e.jsx("p",{className:"mb-2 text-xs text-muted-foreground",children:"單一長條的圖還算圖嗎？——也許一個大數字就夠了。"}),e.jsx(a,{data:m(1),title:"單一類別",showValues:!0,valueFmt:t=>l(t)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"6 個類別、全部為 0"}),e.jsx("p",{className:"mb-2 text-xs text-muted-foreground",children:"該看什麼：座標軸正常、長條全部貼地，**不是除以零炸掉**。 「本期皆為 0」要由宿主明說，否則使用者會以為資料沒載入。"}),e.jsx(a,{data:m(6,{valueRange:[0,0]}),title:"全零",showValues:!0})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm font-medium",children:"「沒有」那一側：空陣列"}),e.jsx("p",{className:"mb-2 text-xs text-muted-foreground",children:"統一出口是一行「無資料」，不畫空白座標軸。"}),e.jsx(a,{data:[],title:"空資料"})]})]})};var i,u,p;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">✅ 預設封頂（maxItems 12）：取大者、其餘併「其他」</p>
        <p className="mb-2 text-xs text-muted-foreground">
          撞出來的規範：超過上限彙總成「其他（N 項）」，不要循環用色。
          留意「其他」那支的值——它是 9 個類別的和，不該假裝自己是第 13 類。
        </p>
        <BarChart data={twenty} title="二十類（封頂後）" showValues valueFmt={n => formatMoney(n)} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">🚫 不封頂（maxItems 20）：20 支長條</p>
        <p className="mb-2 text-xs text-muted-foreground">
          該看什麼：圖要嘛水平捲動、要嘛標籤擠成一團；捲出畫面外的長條等於不存在。
          這就是封頂存在的理由。
        </p>
        <BarChart data={twenty} maxItems={20} title="二十類（不封頂）" valueFmt={n => formatMoney(n)} />
      </div>
    </div>
}`,...(p=(u=n.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var v,f,h;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const keys = makeCategories(12).map(c => c.label);
    const rows = makeRecords({
      count: 5
    }).map((r, i) => ({
      label: r.unit,
      segments: makeCategories(12, {
        seed: 7 + i
      }).map(c => ({
        label: c.label,
        value: c.value,
        color: colorByKey(c.label, keys)
      }))
    }));
    return <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">每列 12 段——色票只有 {PALETTE.length} 色</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：第 9 段起 colorByKey 一律退灰（muted）——圖例出現一排同色不同名的項目，
          這是「該把尾巴併成『其他』」的訊號，不是「該去生第 9 種顏色」。
          也試著 hover 最窄的那段：還點得到、讀得到值嗎？
        </p>
        <Legend items={keys.map(k => ({
        label: k,
        color: colorByKey(k, keys)
      }))} />
        <StackedBar rows={rows} title="十二段堆疊" valueFmt={n => formatMoney(n)} />
      </div>;
  }
}`,...(h=(f=r.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var b,N,j;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="max-w-xl space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium">1 個類別</p>
        <p className="mb-2 text-xs text-muted-foreground">單一長條的圖還算圖嗎？——也許一個大數字就夠了。</p>
        <BarChart data={makeCategories(1)} title="單一類別" showValues valueFmt={n => formatMoney(n)} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">6 個類別、全部為 0</p>
        <p className="mb-2 text-xs text-muted-foreground">
          該看什麼：座標軸正常、長條全部貼地，**不是除以零炸掉**。
          「本期皆為 0」要由宿主明說，否則使用者會以為資料沒載入。
        </p>
        <BarChart data={makeCategories(6, {
        valueRange: [0, 0]
      })} title="全零" showValues />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">「沒有」那一側：空陣列</p>
        <p className="mb-2 text-xs text-muted-foreground">統一出口是一行「無資料」，不畫空白座標軸。</p>
        <BarChart data={[]} title="空資料" />
      </div>
    </div>
}`,...(j=(N=o.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};const M=["二十類長條","十二段堆疊","一類與全零"];export{M as __namedExportsOrder,L as default,o as 一類與全零,n as 二十類長條,r as 十二段堆疊};
