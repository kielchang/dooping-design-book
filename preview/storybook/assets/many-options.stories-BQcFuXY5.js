import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as m}from"./index-UiW3gZKV.js";import{C as h}from"./chips-DzzKURvw.js";import{S as N}from"./seg-group-D0IDbvdD.js";import{a as j}from"./generate-stress-DBBSYc_v.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-pm6Xa0Qd.js";import"./check-CZys2X9e.js";import"./createLucideIcon-BcR0bl2m.js";const P={title:"壓力測試/超多選項"},n={render:function(){const[s,t]=m.useState(["o3","o11","o19"]);return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Chips × 24 個選項"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：換行後整塊的高度能不能接受？已選的那幾顆還找得到嗎？ Chips 的適用邊界是「選項固定且 ≤ 12」——超過就該改多選下拉，這支 story 是在幫你確認那條線。"}),e.jsx(h,{options:j(24),selected:s,onToggle:a=>t(i=>i.includes(a)?i.filter(y=>y!==a):[...i,a]),label:"二十四個選項的多選"})]})}},o={render:function(){const[s,t]=m.useState("o2");return e.jsxs("div",{className:"max-w-xl space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"SegGroup × 6 個長標籤"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：分段選擇一旦換行，「一眼看完所有選項」的價值就沒了—— 撞出來的規範是「分段選擇換行即失去意義，該改下拉」。"}),e.jsx(N,{options:j(6,{longLabelRatio:1}),value:s,onPick:t,label:"六個長標籤的單選"})]})}},r={render:function(){const[s,t]=m.useState("");return e.jsxs("div",{className:"max-w-xl space-y-4",children:[e.jsx("p",{className:"text-sm font-medium",children:"「沒有」那一側：options 是空陣列"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"該看什麼：Chips 有 emptyHint 撐住場面；SegGroup 剩一個空殼—— 空清單常常來自「上游還沒建選項」，元件要嘛給提示、要嘛整塊藏起來，不能只剩一個框。"}),e.jsx(h,{options:[],selected:[],onToggle:()=>{},label:"零選項的多選",emptyHint:"尚未建立任何選項"}),e.jsx(N,{options:[],value:s,onPick:t,label:"零選項的單選"})]})}};var l,c,d;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: function Render() {
    const [sel, setSel] = useState<string[]>(["o3", "o11", "o19"]);
    return <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">Chips × 24 個選項</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：換行後整塊的高度能不能接受？已選的那幾顆還找得到嗎？
          Chips 的適用邊界是「選項固定且 ≤ 12」——超過就該改多選下拉，這支 story 是在幫你確認那條線。
        </p>
        <Chips options={makeOptions(24)} selected={sel} onToggle={v => setSel(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])} label="二十四個選項的多選" />
      </div>;
  }
}`,...(d=(c=n.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,x,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState("o2");
    return <div className="max-w-xl space-y-2">
        <p className="text-sm font-medium">SegGroup × 6 個長標籤</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：分段選擇一旦換行，「一眼看完所有選項」的價值就沒了——
          撞出來的規範是「分段選擇換行即失去意義，該改下拉」。
        </p>
        <SegGroup options={makeOptions(6, {
        longLabelRatio: 1
      })} value={v} onPick={setV} label="六個長標籤的單選" />
      </div>;
  }
}`,...(g=(x=o.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var f,v,S;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState("");
    return <div className="max-w-xl space-y-4">
        <p className="text-sm font-medium">「沒有」那一側：options 是空陣列</p>
        <p className="text-xs text-muted-foreground">
          該看什麼：Chips 有 emptyHint 撐住場面；SegGroup 剩一個空殼——
          空清單常常來自「上游還沒建選項」，元件要嘛給提示、要嘛整塊藏起來，不能只剩一個框。
        </p>
        <Chips options={[]} selected={[]} onToggle={() => {}} label="零選項的多選" emptyHint="尚未建立任何選項" />
        <SegGroup options={[]} value={v} onPick={setV} label="零選項的單選" />
      </div>;
  }
}`,...(S=(v=r.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};const T=["多選二十四項","單選六個長標籤","零選項"];export{T as __namedExportsOrder,P as default,o as 單選六個長標籤,n as 多選二十四項,r as 零選項};
