import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as m}from"./utils-C1k7i5aj.js";import{B as y}from"./button-DEbqQUaU.js";import{B as b}from"./badge-9TpBB0IJ.js";import{T as S}from"./tab-pills-CDjpRiKs.js";import"./index-BFQ_Q9OP.js";function s({w:a,h:r=14,label:n,className:c}){return e.jsx("div",{className:m("mock-placeholder flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-muted text-tiny text-muted-foreground",c),style:{width:a??"100%",height:r},children:n??""})}function d({children:a,label:r,className:n}){return e.jsxs("span",{className:m("spotlight-ring relative inline-block rounded-lg p-1",n),children:[a,r&&e.jsx("span",{className:"absolute left-2 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-tiny text-primary-foreground",style:{top:-10,transform:"translateY(-100%)"},children:r})]})}function w({children:a,className:r,navLabel:n="選單",topLabel:c="頂部狀態列"}){return e.jsxs("div",{className:m("flex min-w-[460px] gap-2.5 bg-background p-3 text-foreground",r),style:{minHeight:230},children:[e.jsxs("div",{className:"flex w-[90px] flex-col gap-1.5",children:[e.jsx(s,{h:22,label:n}),e.jsx(s,{h:14}),e.jsx(s,{h:14}),e.jsx(s,{h:14}),e.jsx(s,{h:14}),e.jsx(s,{h:14})]}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col gap-2.5",children:[e.jsx(s,{h:20,label:c}),e.jsx("div",{className:"flex flex-col items-stretch gap-2.5",children:a})]})]})}function o({focus:a}){return e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{w:64}),e.jsx(s,{w:90}),e.jsx(s,{}),e.jsx(s,{w:70}),a??e.jsx(s,{w:64,h:22})]})}s.__docgenInfo={description:"佔位塊：非重點區域一律留白（muted 圓角塊，可帶淡字標籤）。",methods:[],displayName:"Placeholder",props:{w:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},h:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"14",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};d.__docgenInfo={description:"聚光：包住「重點元件」。\n用的是與 Coachmark 同一個 `.spotlight-ring`——讀者在文件與系統裡看到的是**同一種**「看這裡」語言。\n琥珀色專屬「已改動未送出」，不得用於聚光。",methods:[],displayName:"Spotlight",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};w.__docgenInfo={description:"畫面框：模擬系統版面（側欄／頂欄＝佔位），children 放該步驟的排版。\n`min-w` 保底：小螢幕靠外層容器橫向捲動，不擠壞排版（擠壞的示意圖比沒有示意圖更糟）。",methods:[],displayName:"MockScreenFrame",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},navLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"選單"',computed:!1}},topLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"頂部狀態列"',computed:!1}}}};o.__docgenInfo={description:"表格假列（可帶一個重點格）。",methods:[],displayName:"MockRow",props:{focus:{required:!1,tsType:{name:"ReactNode"},description:""}}};const P={title:"元件/文件示意/模擬畫面積木"},t={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"Placeholder：非重點區域留白"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{w:90,label:"側欄"}),e.jsx(s,{}),e.jsx(s,{w:60,h:22})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"Spotlight：包住「真元件」，不是包住佔位塊"}),e.jsx("div",{className:"py-4",children:e.jsx(d,{label:"從這裡匯出",children:e.jsx(y,{variant:"outline",size:"sm",children:"匯出 CSV"})})})]})]})},l={render:()=>e.jsx("div",{className:"overflow-x-auto rounded-lg border",children:e.jsxs(w,{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(S,{value:"confirmed",onChange:()=>{},tabs:[{key:"all",label:"全部"},{key:"confirmed",label:"已確認"}]}),e.jsx("span",{className:"ml-auto",children:e.jsx(d,{label:"① 先切到「已確認」",children:e.jsx(b,{variant:"info",children:"7 筆"})})})]}),e.jsx(o,{}),e.jsx(o,{focus:e.jsx(d,{children:e.jsx(y,{size:"sm",variant:"outline",children:"排程處理"})})}),e.jsx(o,{})]})})},i={render:()=>e.jsxs("div",{className:"max-w-xl space-y-2 text-sm",children:[e.jsx("p",{children:"截圖第一天就開始過期。改一次按鈕位置，全手冊的圖都要重錄，於是沒人重錄，於是手冊開始說謊。"}),e.jsxs("p",{children:["示意圖用",e.jsx("strong",{children:"元件庫的真元件"}),"排出來：元件改版，示意圖跟著改版，沒有人需要去重拍任何東西。"]}),e.jsx("p",{className:"text-muted-foreground",children:"代價是示意圖不會百分百等於實際畫面（版面是簡化的）。這是刻意的取捨—— 讀者需要的是「該點哪裡」，不是像素級復刻。"})]})};var p,x,u;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Placeholder：非重點區域留白</p>
        <div className="flex gap-2"><Placeholder w={90} label="側欄" /><Placeholder /><Placeholder w={60} h={22} /></div>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Spotlight：包住「真元件」，不是包住佔位塊</p>
        <div className="py-4"><Spotlight label="從這裡匯出"><Button variant="outline" size="sm">匯出 CSV</Button></Spotlight></div>
      </div>
    </div>
}`,...(u=(x=t.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};var h,f,g;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="overflow-x-auto rounded-lg border">
      <MockScreenFrame>
        <div className="flex items-center gap-2">
          <TabPills value="confirmed" onChange={() => {}} tabs={[{
          key: "all",
          label: "全部"
        }, {
          key: "confirmed",
          label: "已確認"
        }]} />
          <span className="ml-auto"><Spotlight label="① 先切到「已確認」"><Badge variant="info">7 筆</Badge></Spotlight></span>
        </div>
        <MockRow />
        <MockRow focus={<Spotlight><Button size="sm" variant="outline">排程處理</Button></Spotlight>} />
        <MockRow />
      </MockScreenFrame>
    </div>
}`,...(g=(f=l.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var j,v,N;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="max-w-xl space-y-2 text-sm">
      <p>截圖第一天就開始過期。改一次按鈕位置，全手冊的圖都要重錄，於是沒人重錄，於是手冊開始說謊。</p>
      <p>示意圖用<strong>元件庫的真元件</strong>排出來：元件改版，示意圖跟著改版，沒有人需要去重拍任何東西。</p>
      <p className="text-muted-foreground">
        代價是示意圖不會百分百等於實際畫面（版面是簡化的）。這是刻意的取捨——
        讀者需要的是「該點哪裡」，不是像素級復刻。
      </p>
    </div>
}`,...(N=(v=i.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};const R=["積木","一步操作示意","為什麼不用截圖"];export{R as __namedExportsOrder,P as default,l as 一步操作示意,i as 為什麼不用截圖,t as 積木};
