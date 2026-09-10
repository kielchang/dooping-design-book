import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./index-UiW3gZKV.js";import{E as N}from"./editable-field-DANRApfL.js";import{T as h}from"./tab-pills-BWBDaVy_.js";import{B as r}from"./badge-Cl3jk1vO.js";import{a as k,b as l}from"./generate-stress-mfYj4AO0.js";import"./_commonjsHelpers-CqkleIqs.js";import"./label-BJyaxRcC.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./utils-DBXtLcuW.js";import"./input-kuo8quod.js";import"./select-BbRzm7y4.js";import"./Combination-Gi-zDQIY.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./createLucideIcon-BcR0bl2m.js";import"./check-CZys2X9e.js";import"./tooltip-CyZzvjef.js";import"./seg-group-DXjbX0o5.js";import"./chips-mSw_l9hW.js";import"./undo-2-CSzb_e47.js";import"./index-C9IEqVQG.js";const W={title:"壓力測試/超長標籤"},s={render:()=>e.jsxs("div",{className:"max-w-sm space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"28 字的欄位標籤（容器 max-w-sm）"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：標籤自己換行，值的區塊不該被擠變形；還原鈕與鎖頭的位置不該漂移。"}),e.jsx(N,{label:l(28),kind:"text",value:"第一階段",original:"第一階段",onChange:()=>{}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"徽章：2 字 vs 6 字 vs 20 字"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"20 字的徽章會把表格行高撐開——撞出來的規範是「徽章文字 2–6 字，寫不短就換元件」。"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(r,{variant:"success",children:"完成"}),e.jsx(r,{variant:"info",children:"等待中的批次"}),e.jsx(r,{variant:"warning",children:l(20)})]})]})]})},t={render:function(){const a=k(4,{longLabelRatio:1}).map(o=>({key:o.value,label:o.label})),[m,y]=b.useState(a[0].key);return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"4 個超長標籤的分頁膠囊"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：膠囊列整體換行（flex-wrap）是預期行為；單顆膠囊內部不該斷成兩行。 真的長到這樣，該縮短標籤，不是撐大元件。"}),e.jsx(h,{tabs:a,value:m,onChange:y,label:"超長標籤分頁"})]})}},n={render:function(){const[a,m]=b.useState("o1");return e.jsxs("div",{className:"max-w-sm space-y-6",children:[e.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：標籤全部是空字串"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：空標籤的欄位剩一個孤零零的值、空標籤的分頁剩一顆空膠囊、 空文字的徽章縮成一粒膠囊皮——每一個都是「整塊元件安靜消失」的前兆。"}),e.jsx(N,{label:"",kind:"text",value:"有值但沒有標籤",original:"有值但沒有標籤",onChange:()=>{}}),e.jsx(h,{tabs:[{key:"o1",label:""},{key:"o2",label:"第二頁"}],value:a,onChange:m,label:"含空標籤的分頁"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{variant:"success",children:""}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"← 空字串的徽章"})]})]})}};var i,d,c;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">28 字的欄位標籤（容器 max-w-sm）</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：標籤自己換行，值的區塊不該被擠變形；還原鈕與鎖頭的位置不該漂移。
        </p>
        <EditableField label={makeLongText(28)} kind="text" value="第一階段" original="第一階段" onChange={() => {}} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">徽章：2 字 vs 6 字 vs 20 字</p>
        <p className="text-xs text-muted-foreground">
          20 字的徽章會把表格行高撐開——撞出來的規範是「徽章文字 2–6 字，寫不短就換元件」。
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">完成</Badge>
          <Badge variant="info">等待中的批次</Badge>
          <Badge variant="warning">{makeLongText(20)}</Badge>
        </div>
      </div>
    </div>
}`,...(c=(d=s.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var x,p,u;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: function Render() {
    const tabs = makeOptions(4, {
      longLabelRatio: 1
    }).map(o => ({
      key: o.value,
      label: o.label
    }));
    const [v, setV] = useState(tabs[0].key);
    return <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">4 個超長標籤的分頁膠囊</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：膠囊列整體換行（flex-wrap）是預期行為；單顆膠囊內部不該斷成兩行。
          真的長到這樣，該縮短標籤，不是撐大元件。
        </p>
        <TabPills tabs={tabs} value={v} onChange={setV} label="超長標籤分頁" />
      </div>;
  }
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var v,g,f;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState("o1");
    return <div className="max-w-sm space-y-6">
        <p className="text-sm font-medium">「沒有」那一側：標籤全部是空字串</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：空標籤的欄位剩一個孤零零的值、空標籤的分頁剩一顆空膠囊、
          空文字的徽章縮成一粒膠囊皮——每一個都是「整塊元件安靜消失」的前兆。
        </p>
        <EditableField label="" kind="text" value="有值但沒有標籤" original="有值但沒有標籤" onChange={() => {}} />
        <TabPills tabs={[{
        key: "o1",
        label: ""
      }, {
        key: "o2",
        label: "第二頁"
      }]} value={v} onChange={setV} label="含空標籤的分頁" />
        <div className="flex items-center gap-2">
          <Badge variant="success">{""}</Badge>
          <span className="text-xs text-muted-foreground">← 空字串的徽章</span>
        </div>
      </div>;
  }
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const X=["欄位與徽章標籤","分頁標籤","無標籤"];export{X as __namedExportsOrder,W as default,t as 分頁標籤,s as 欄位與徽章標籤,n as 無標籤};
