import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as j}from"./index-BFQ_Q9OP.js";import{T as g,a as T,b as o,c as n,d as v,e as s}from"./table-DdyfySUo.js";import{B as i}from"./badge-0NFF6jup.js";import{B as f}from"./button-CZTVPQNV.js";import"./utils-Cn0sxhoU.js";import"./index-DdXKfkXy.js";const R={title:"基礎/互動狀態層"},c={一般:void 0,hover:"var(--state-hover-alpha)",pressed:"var(--state-pressed-alpha)"},l={render:()=>e.jsxs("div",{className:"max-w-3xl space-y-4",children:[e.jsxs(g,{zebra:!0,children:[e.jsx(T,{children:e.jsxs(o,{children:[e.jsx(n,{children:"狀態"}),e.jsx(n,{children:"項目"}),e.jsx(n,{children:"標記"}),e.jsx(n,{className:"text-muted-foreground",children:"次要文字"})]})}),e.jsxs(v,{children:[[...Object.entries(c),...Object.entries(c)].map(([a,r],t)=>e.jsxs(o,{style:r?{"--state-layer-alpha":r}:void 0,children:[e.jsx(s,{className:"font-medium",children:a}),e.jsx(s,{children:t<3?"奇數列（無斑馬）":"偶數列（斑馬底）"}),e.jsx(s,{children:e.jsx(i,{variant:"success",children:"已完成"})}),e.jsx(s,{className:"text-muted-foreground",children:"2024-02-05"})]},t)),e.jsxs(o,{"data-state":"selected",children:[e.jsx(s,{className:"font-medium",children:"已選"}),e.jsx(s,{children:'data-state="selected"'}),e.jsx(s,{children:e.jsx(i,{variant:"success",children:"已完成"})}),e.jsx(s,{className:"text-muted-foreground",children:"次要文字自動改用正文色"})]})]})]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:["三階都是",e.jsx("strong",{children:"疊"}),"在列自己的底色上，不是換一組底色——所以斑馬列被指到時 一樣是「深了一階」。改版前 hover 用 ",e.jsx("code",{children:"--accent"}),"、已選用"," ",e.jsx("code",{children:"--muted"}),"，而這兩個 token 的值相同（斑馬列本來就是那個顏色）， 實測一般→hover 只差 ΔE00 ",e.jsx("strong",{children:"1.6"}),"。 已選那列的徽章",e.jsx("strong",{children:"顏色完全不受影響"}),"（實測填色像素與一般列逐一相符， 只有與底色交界的抗鋸齒像素不同）：疊加層落在背景層——在 ",e.jsx("code",{children:"background-color"}),"之上、內容之下。若改用 ",e.jsx("code",{children:"::after"})," 蓋在內容上，同一個徽章會被染成",e.jsx("code",{children:"#abc4b4"}),"。"]})]})},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid max-w-2xl grid-cols-[5rem_repeat(3,1fr)] items-center gap-2 text-xs",children:[e.jsx("span",{}),Object.keys(c).map(a=>e.jsx("span",{className:"font-medium",children:a},a)),["default","secondary","outline","destructive"].map(a=>e.jsxs(j.Fragment,{children:[e.jsx("code",{className:"text-xs",children:a}),Object.values(c).map((r,t)=>e.jsx(f,{variant:a,size:"sm",style:r?{"--state-layer-alpha":r}:void 0,children:"套用"},t))]},a))]}),e.jsxs("p",{className:"max-w-2xl text-xs text-muted-foreground",children:["六個變體共用同一組強度。改版前每個變體各挑一個透明度（",e.jsx("code",{children:"/90"}),"、",e.jsx("code",{children:"/80"}),"…），可見度從 ΔE00 ",e.jsx("strong",{children:"0.6"}),"（secondary，等於沒有 hover） 到 ",e.jsx("strong",{children:"7.4"}),"（default，太刻意）差了十倍；現在全部落在 ",e.jsx("strong",{children:"2.6–4.5"}),"。",e.jsx("code",{children:"link"})," 變體刻意不套——它是一段文字不是一塊表面。"]})]})};var m,x,b;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="max-w-3xl space-y-4">
      <Table zebra>
        <TableHeader>
          <TableRow>
            <TableHead>狀態</TableHead>
            <TableHead>項目</TableHead>
            <TableHead>標記</TableHead>
            <TableHead className="text-muted-foreground">次要文字</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Object.entries(AS), ...Object.entries(AS)].map(([label, a], i) => <TableRow key={i} style={a ? {
          "--state-layer-alpha": a
        } as React.CSSProperties : undefined}>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell>{i < 3 ? "奇數列（無斑馬）" : "偶數列（斑馬底）"}</TableCell>
              <TableCell><Badge variant="success">已完成</Badge></TableCell>
              <TableCell className="text-muted-foreground">2024-02-05</TableCell>
            </TableRow>)}
          <TableRow data-state="selected">
            <TableCell className="font-medium">已選</TableCell>
            <TableCell>data-state=&quot;selected&quot;</TableCell>
            <TableCell><Badge variant="success">已完成</Badge></TableCell>
            <TableCell className="text-muted-foreground">次要文字自動改用正文色</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="max-w-2xl text-xs text-muted-foreground">
        三階都是<strong>疊</strong>在列自己的底色上，不是換一組底色——所以斑馬列被指到時
        一樣是「深了一階」。改版前 hover 用 <code>--accent</code>、已選用{" "}
        <code>--muted</code>，而這兩個 token 的值相同（斑馬列本來就是那個顏色），
        實測一般→hover 只差 ΔE00 <strong>1.6</strong>。
        已選那列的徽章<strong>顏色完全不受影響</strong>（實測填色像素與一般列逐一相符，
        只有與底色交界的抗鋸齒像素不同）：疊加層落在背景層——在 <code>background-color</code>
        之上、內容之下。若改用 <code>::after</code> 蓋在內容上，同一個徽章會被染成
        <code>#abc4b4</code>。
      </p>
    </div>
}`,...(b=(x=l.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var u,h,p;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="grid max-w-2xl grid-cols-[5rem_repeat(3,1fr)] items-center gap-2 text-xs">
        <span />
        {Object.keys(AS).map(k => <span key={k} className="font-medium">{k}</span>)}
        {(["default", "secondary", "outline", "destructive"] as const).map(v => <React.Fragment key={v}>
            <code className="text-xs">{v}</code>
            {Object.values(AS).map((a, i) => <Button key={i} variant={v} size="sm" style={a ? {
          "--state-layer-alpha": a
        } as React.CSSProperties : undefined}>
                套用
              </Button>)}
          </React.Fragment>)}
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground">
        六個變體共用同一組強度。改版前每個變體各挑一個透明度（<code>/90</code>、
        <code>/80</code>…），可見度從 ΔE00 <strong>0.6</strong>（secondary，等於沒有 hover）
        到 <strong>7.4</strong>（default，太刻意）差了十倍；現在全部落在 <strong>2.6–4.5</strong>。
        <code>link</code> 變體刻意不套——它是一段文字不是一塊表面。
      </p>
    </div>
}`,...(p=(h=d.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};const S=["資料表列的三種狀態","按鈕的三種狀態"];export{S as __namedExportsOrder,R as default,d as 按鈕的三種狀態,l as 資料表列的三種狀態};
