import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as g}from"./index-BFQ_Q9OP.js";import{E as n,u as F,C as S}from"./use-record-diff-R4fj_Ip7.js";import{B as P}from"./button-i72Edb48.js";import{d as r,T as v,C as w}from"./sample-data-DlVwqcXX.js";import"./label-D5EPj26R.js";import"./Combination-DsSBML8Q.js";import"./index-DdXKfkXy.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./utils-pm6Xa0Qd.js";import"./index-YW0vehpY.js";import"./select-CbCVKR29.js";import"./createLucideIcon-DDRU598s.js";import"./check-SsieMrcg.js";import"./tooltip-1GOoMEVs.js";import"./seg-group-C31EXuC6.js";import"./chips-hPkBPIX5.js";import"./index-rhYpeUg2.js";const X={title:"元件/表單/唯讀逐欄編輯"},_=[{key:"name",label:"單位名稱",kind:"text"},{key:"code",label:"單位代號",kind:"text"},{key:"tier",label:"等級",kind:"select",format:i=>{var a;return((a=v.find(o=>o.value===i))==null?void 0:a.label)??String(i)}},{key:"quota",label:"上限額度",kind:"money"},{key:"adjustRate",label:"調整率",kind:"rate"},{key:"channels",label:"聯絡管道",kind:"multiselect"},{key:"active",label:"啟用中",kind:"checkbox"},{key:"contact",label:"聯絡方式",kind:"text"},{key:"since",label:"建立日期",kind:"date"}],d={render:function(){const[a,o]=g.useState(15e5);return e.jsxs("div",{className:"max-w-sm space-y-6",children:[e.jsx(n,{label:"上限額度",kind:"money",value:a,original:15e5,onChange:o,onRevert:()=>o(15e5),help:"點一下值就能編輯；改過的欄位會標成琥珀色，並出現還原鈕。"}),e.jsx(n,{label:"單位代號（鎖定）",kind:"text",value:"U-1042",original:"U-1042",onChange:()=>{},disabled:!0,lockHint:"代號建立後不可變更"})]})}},c={render:function(){const[a,o]=g.useState(r),{changes:s,revertField:t,revertAll:u}=F(r,a,o,_),l=y=>E=>o(N=>({...N,[y]:E}));return e.jsxs("div",{className:"grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]",children:[e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(n,{label:"單位名稱",kind:"text",value:a.name,original:r.name,onChange:l("name"),onRevert:()=>t("name")}),e.jsx(n,{label:"單位代號",kind:"text",value:a.code,original:r.code,onChange:l("code"),onRevert:()=>t("code")}),e.jsx(n,{label:"等級",kind:"select",options:v,value:a.tier,original:r.tier,onChange:l("tier"),onRevert:()=>t("tier")}),e.jsx(n,{label:"上限額度",kind:"money",value:a.quota,original:r.quota,onChange:l("quota"),onRevert:()=>t("quota")}),e.jsx(n,{label:"調整率",kind:"rate",value:a.adjustRate,original:r.adjustRate,onChange:l("adjustRate"),onRevert:()=>t("adjustRate"),help:"畫面顯示 %，存的是比值。"}),e.jsx(n,{label:"啟用中",kind:"checkbox",value:a.active,original:r.active,onChange:l("active"),onRevert:()=>t("active")}),e.jsx(n,{label:"聯絡管道",kind:"multiselect",options:w,value:a.channels,original:r.channels,onChange:l("channels"),onRevert:()=>t("channels"),className:"sm:col-span-2"}),e.jsx(n,{label:"聯絡方式",kind:"text",value:a.contact,original:r.contact,onChange:l("contact"),onRevert:()=>t("contact"),className:"sm:col-span-2"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(S,{changes:s,onRevertField:t,onRevertAll:u}),e.jsxs(P,{className:"w-full",disabled:s.length===0,children:["送出 ",s.length>0&&`（${s.length} 項變更）`]}),e.jsx("p",{className:"text-tiny text-muted-foreground",children:"摘要的資料結構（Change[]）與寫入異動紀錄的 before/after 是同一份—— 使用者送出前看到的，就是稽核紀錄之後會呈現的。"})]})]})}},m={render:function(){const[a,o]=g.useState({name:"",code:"",tier:"bronze"}),s=t=>u=>o(l=>({...l,[t]:u}));return e.jsxs("div",{className:"max-w-sm space-y-3",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"新增時 `alwaysEdit` ＋關閉 `trackChanges`：欄位恆為輸入態，也不會整張表單都被標成「已變更」。"}),e.jsx(n,{label:"單位名稱",kind:"text",value:a.name,onChange:s("name"),alwaysEdit:!0,trackChanges:!1,placeholder:"輸入單位名稱"}),e.jsx(n,{label:"單位代號",kind:"text",value:a.code,onChange:s("code"),alwaysEdit:!0,trackChanges:!1,placeholder:"例：U-1042"}),e.jsx(n,{label:"等級",kind:"radio",options:v,value:a.tier,onChange:s("tier"),alwaysEdit:!0,trackChanges:!1})]})}};var h,f,p;d.parameters={...d.parameters,docs:{...(h=d.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState<string | number | boolean | string[] | null | undefined>(1_500_000);
    return <div className="max-w-sm space-y-6">
        <EditableField label="上限額度" kind="money" value={v} original={1_500_000} onChange={setV} onRevert={() => setV(1_500_000)} help="點一下值就能編輯；改過的欄位會標成琥珀色，並出現還原鈕。" />
        <EditableField label="單位代號（鎖定）" kind="text" value="U-1042" original="U-1042" onChange={() => {}} disabled lockHint="代號建立後不可變更" />
      </div>;
  }
}`,...(p=(f=d.parameters)==null?void 0:f.docs)==null?void 0:p.source}}};var x,k,b;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: function Render() {
    const [draft, setDraft] = useState<DemoProfile>(demoProfile);
    const {
      changes,
      revertField,
      revertAll
    } = useRecordDiff(demoProfile, draft, setDraft, SPECS);
    const set = (k: keyof DemoProfile) => (v: unknown) => setDraft(d => ({
      ...d,
      [k]: v
    }));
    return <div className="grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2">
          <EditableField label="單位名稱" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
          <EditableField label="單位代號" kind="text" value={draft.code} original={demoProfile.code} onChange={set("code")} onRevert={() => revertField("code")} />
          <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
          <EditableField label="上限額度" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
          <EditableField label="調整率" kind="rate" value={draft.adjustRate} original={demoProfile.adjustRate} onChange={set("adjustRate")} onRevert={() => revertField("adjustRate")} help="畫面顯示 %，存的是比值。" />
          <EditableField label="啟用中" kind="checkbox" value={draft.active} original={demoProfile.active} onChange={set("active")} onRevert={() => revertField("active")} />
          <EditableField label="聯絡管道" kind="multiselect" options={CHANNEL_OPTIONS} value={draft.channels} original={demoProfile.channels} onChange={set("channels")} onRevert={() => revertField("channels")} className="sm:col-span-2" />
          <EditableField label="聯絡方式" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} className="sm:col-span-2" />
        </div>
        <div className="space-y-2">
          <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
          <Button className="w-full" disabled={changes.length === 0}>送出 {changes.length > 0 && \`（\${changes.length} 項變更）\`}</Button>
          <p className="text-tiny text-muted-foreground">
            摘要的資料結構（Change[]）與寫入異動紀錄的 before/after 是同一份——
            使用者送出前看到的，就是稽核紀錄之後會呈現的。
          </p>
        </div>
      </div>;
  }
}`,...(b=(k=c.parameters)==null?void 0:k.docs)==null?void 0:b.source}}};var C,R,j;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: function Render() {
    const [draft, setDraft] = useState({
      name: "",
      code: "",
      tier: "bronze"
    });
    const set = (k: string) => (v: unknown) => setDraft(d => ({
      ...d,
      [k]: v
    }));
    return <div className="max-w-sm space-y-3">
        <p className="text-xs text-muted-foreground">
          新增時 \`alwaysEdit\` ＋關閉 \`trackChanges\`：欄位恆為輸入態，也不會整張表單都被標成「已變更」。
        </p>
        <EditableField label="單位名稱" kind="text" value={draft.name} onChange={set("name")} alwaysEdit trackChanges={false} placeholder="輸入單位名稱" />
        <EditableField label="單位代號" kind="text" value={draft.code} onChange={set("code")} alwaysEdit trackChanges={false} placeholder="例：U-1042" />
        <EditableField label="等級" kind="radio" options={TIER_OPTIONS} value={draft.tier} onChange={set("tier")} alwaysEdit trackChanges={false} />
      </div>;
  }
}`,...(j=(R=m.parameters)==null?void 0:R.docs)==null?void 0:j.source}}};const Y=["單一欄位","完整表單與變更摘要","新增模式"];export{Y as __namedExportsOrder,X as default,d as 單一欄位,c as 完整表單與變更摘要,m as 新增模式};
