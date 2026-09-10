import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as v}from"./index-UiW3gZKV.js";import{E as o}from"./editable-field-DANRApfL.js";import{C as D}from"./change-summary-BjaahFHj.js";import{u as O}from"./use-record-diff-DcHqZmEB.js";import{B as q}from"./button-Cw_3_x2n.js";import{d as i,T as p,C as I}from"./sample-data-I9KaR9SF.js";import{m as T}from"./generate-Bsle_8tt.js";import"./_commonjsHelpers-CqkleIqs.js";import"./label-BJyaxRcC.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-VXoYh6zd.js";import"./utils-DBXtLcuW.js";import"./input-kuo8quod.js";import"./select-BbRzm7y4.js";import"./Combination-Gi-zDQIY.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./createLucideIcon-BcR0bl2m.js";import"./check-CZys2X9e.js";import"./tooltip-CyZzvjef.js";import"./seg-group-DXjbX0o5.js";import"./chips-mSw_l9hW.js";import"./undo-2-CSzb_e47.js";import"./index-C9IEqVQG.js";const ue={title:"元件/表單/唯讀逐欄編輯"},A=[{key:"name",label:"單位名稱",kind:"text"},{key:"code",label:"單位代號",kind:"text"},{key:"tier",label:"等級",kind:"select",format:t=>{var e;return((e=p.find(a=>a.value===t))==null?void 0:e.label)??String(t)}},{key:"quota",label:"上限額度",kind:"money"},{key:"adjustRate",label:"調整率",kind:"rate"},{key:"channels",label:"聯絡管道",kind:"multiselect"},{key:"active",label:"啟用中",kind:"checkbox"},{key:"contact",label:"聯絡方式",kind:"text"},{key:"since",label:"建立日期",kind:"date"}],c={render:function(){const[e,a]=v.useState(15e5);return n.jsxs("div",{className:"max-w-sm space-y-6",children:[n.jsx(o,{label:"上限額度",kind:"money",value:e,original:15e5,onChange:a,onRevert:()=>a(15e5),help:"點一下值就能編輯；改過的欄位會標成琥珀色，並出現還原鈕。"}),n.jsx(o,{label:"單位代號（鎖定）",kind:"text",value:"U-1042",original:"U-1042",onChange:()=>{},disabled:!0,lockHint:"代號建立後不可變更"})]})}},m={render:function(){const[e,a]=v.useState(i),{changes:r,revertField:l,revertAll:d}=O(i,e,a,A),s=w=>_=>a(P=>({...P,[w]:_}));return n.jsxs("div",{className:"grid max-w-4xl gap-6 md:grid-cols-[1fr_320px]",children:[n.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[n.jsx(o,{label:"單位名稱",kind:"text",value:e.name,original:i.name,onChange:s("name"),onRevert:()=>l("name")}),n.jsx(o,{label:"單位代號",kind:"text",value:e.code,original:i.code,onChange:s("code"),onRevert:()=>l("code")}),n.jsx(o,{label:"等級",kind:"select",options:p,value:e.tier,original:i.tier,onChange:s("tier"),onRevert:()=>l("tier")}),n.jsx(o,{label:"上限額度",kind:"money",value:e.quota,original:i.quota,onChange:s("quota"),onRevert:()=>l("quota")}),n.jsx(o,{label:"調整率",kind:"rate",value:e.adjustRate,original:i.adjustRate,onChange:s("adjustRate"),onRevert:()=>l("adjustRate"),help:"畫面顯示 %，存的是比值。"}),n.jsx(o,{label:"啟用中",kind:"checkbox",value:e.active,original:i.active,onChange:s("active"),onRevert:()=>l("active")}),n.jsx(o,{label:"聯絡管道",kind:"multiselect",options:I,value:e.channels,original:i.channels,onChange:s("channels"),onRevert:()=>l("channels"),className:"sm:col-span-2"}),n.jsx(o,{label:"聯絡方式",kind:"text",value:e.contact,original:i.contact,onChange:s("contact"),onRevert:()=>l("contact"),className:"sm:col-span-2"})]}),n.jsxs("div",{className:"space-y-2",children:[n.jsx(D,{changes:r,onRevertField:l,onRevertAll:d}),n.jsxs(q,{className:"w-full",disabled:r.length===0,children:["送出 ",r.length>0&&`（${r.length} 項變更）`]}),n.jsx("p",{className:"text-tiny text-muted-foreground",children:"摘要的資料結構（Change[]）與寫入異動紀錄的 before/after 是同一份—— 使用者送出前看到的，就是稽核紀錄之後會呈現的。"})]})]})}},u={render:function(){const[e,a]=v.useState({name:"",code:"",tier:"bronze"}),r=l=>d=>a(s=>({...s,[l]:d}));return n.jsxs("div",{className:"max-w-sm space-y-3",children:[n.jsx("p",{className:"text-xs text-muted-foreground",children:"新增時 `alwaysEdit` ＋關閉 `trackChanges`：欄位恆為輸入態，也不會整張表單都被標成「已變更」。"}),n.jsx(o,{label:"單位名稱",kind:"text",value:e.name,onChange:r("name"),alwaysEdit:!0,trackChanges:!1,placeholder:"輸入單位名稱"}),n.jsx(o,{label:"單位代號",kind:"text",value:e.code,onChange:r("code"),alwaysEdit:!0,trackChanges:!1,placeholder:"例：U-1042"}),n.jsx(o,{label:"等級",kind:"radio",options:p,value:e.tier,onChange:r("tier"),alwaysEdit:!0,trackChanges:!1})]})}},f={文字:"text",數值:"number",金額:"money",比率:"rate",日期:"date",下拉:"select",單選:"radio",多選:"multiselect",是否:"checkbox"};function B(t,e){var a;switch(t){case"number":return 250;case"money":return i.quota;case"rate":return i.adjustRate;case"date":return i.since;case"select":case"radio":return((a=e[0])==null?void 0:a.value)??null;case"multiselect":return e.slice(0,2).map(r=>r.value);case"checkbox":return!0;default:return"甲案 第一階段"}}const g={args:{欄位型別:"金額",選項數:4,鎖定:!1,鎖定原因:"此筆已結案，需先解除鎖定",恆為輸入態:!1,追蹤變更:!0,說明文字:""},argTypes:{欄位型別:{control:"select",options:Object.keys(f)},選項數:{control:{type:"range",min:0,max:24,step:1},description:"只影響 下拉／單選／多選"},鎖定:{control:"boolean"},鎖定原因:{control:"text",if:{arg:"鎖定"}},恆為輸入態:{control:"boolean"},追蹤變更:{control:"boolean"},說明文字:{control:"text"}},render:t=>{const e=f[t.欄位型別],a=T(t.選項數),r=B(e,a),l=()=>{const[d,s]=v.useState(r);return n.jsx(o,{label:"示範欄位",kind:e,value:d,original:r,onChange:s,onRevert:()=>s(r),options:a,disabled:t.鎖定,lockHint:t.鎖定?t.鎖定原因:void 0,alwaysEdit:t.恆為輸入態,trackChanges:t.追蹤變更,help:t.說明文字||void 0})};return n.jsx("div",{className:"max-w-sm",children:n.jsx(l,{},`${e}-${t.選項數}-${t.恆為輸入態}`)})}};var h,b,k;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: function Render() {
    const [v, setV] = useState<string | number | boolean | string[] | null | undefined>(1_500_000);
    return <div className="max-w-sm space-y-6">
        <EditableField label="上限額度" kind="money" value={v} original={1_500_000} onChange={setV} onRevert={() => setV(1_500_000)} help="點一下值就能編輯；改過的欄位會標成琥珀色，並出現還原鈕。" />
        <EditableField label="單位代號（鎖定）" kind="text" value="U-1042" original="U-1042" onChange={() => {}} disabled lockHint="代號建立後不可變更" />
      </div>;
  }
}`,...(k=(b=c.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var x,C,y;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(y=(C=m.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var R,E,j;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(j=(E=u.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var N,F,S;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    欄位型別: "金額",
    選項數: 4,
    鎖定: false,
    鎖定原因: "此筆已結案，需先解除鎖定",
    恆為輸入態: false,
    追蹤變更: true,
    說明文字: ""
  },
  argTypes: {
    欄位型別: {
      control: "select",
      options: Object.keys(KIND_BY_LABEL)
    },
    // Storybook 的 if 條件只有 eq/neq/exists/truthy，表達不了「三選一才顯示」，
    // 所以恆顯示、用描述講清楚適用範圍
    選項數: {
      control: {
        type: "range",
        min: 0,
        max: 24,
        step: 1
      },
      description: "只影響 下拉／單選／多選"
    },
    鎖定: {
      control: "boolean"
    },
    鎖定原因: {
      control: "text",
      if: {
        arg: "鎖定"
      }
    },
    恆為輸入態: {
      control: "boolean"
    },
    追蹤變更: {
      control: "boolean"
    },
    說明文字: {
      control: "text"
    }
  },
  render: a => {
    const kind = KIND_BY_LABEL[a.欄位型別];
    const opts = makeOptions(a.選項數);
    const original = originalOf(kind, opts);
    const Demo = () => {
      const [v, setV] = useState<EditableFieldValue>(original);
      return <EditableField label="示範欄位" kind={kind} value={v} original={original} onChange={setV} onRevert={() => setV(original)} options={opts} disabled={a.鎖定} lockHint={a.鎖定 ? a.鎖定原因 : undefined} alwaysEdit={a.恆為輸入態} trackChanges={a.追蹤變更} help={a.說明文字 || undefined} />;
    };
    return <div className="max-w-sm">
        <Demo key={\`\${kind}-\${a.選項數}-\${a.恆為輸入態}\`} />
      </div>;
  }
}`,...(S=(F=g.parameters)==null?void 0:F.docs)==null?void 0:S.source}}};const ge=["單一欄位","完整表單與變更摘要","新增模式","互動"];export{ge as __namedExportsOrder,ue as default,g as 互動,c as 單一欄位,m as 完整表單與變更摘要,u as 新增模式};
