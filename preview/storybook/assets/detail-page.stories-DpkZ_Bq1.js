import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-UiW3gZKV.js";import{B as u}from"./badge-B-Xe92Tx.js";import{B as i}from"./button-PlLiai67.js";import{T as S}from"./tab-pills-CEtiFzQ_.js";import{P as q,B as w}from"./page-header-BOlFrVHG.js";import{C as g,a as N,d as P,c as p}from"./card-CFhhONKA.js";import{D as H}from"./data-table-YnBmSkHT.js";import{D as B,a as _,b as A,c as O,d as I,e as $,f as V,g as L}from"./dialog-BGzFPbaD.js";import{E as s}from"./editable-field-Cdacd3bD.js";import{C as z}from"./change-summary-BbqPl0En.js";import{u as K}from"./use-record-diff-DO9N_cP4.js";import{f as M}from"./utils-pm6Xa0Qd.js";import{a as U,d as t,T as x,S as h}from"./sample-data-I9KaR9SF.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-rhYpeUg2.js";import"./index-VXoYh6zd.js";import"./chevron-right-DWuV1wB0.js";import"./createLucideIcon-BcR0bl2m.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./table-CPnfN5eO.js";import"./empty-state-BEDW5oSI.js";import"./skeleton-C5oW7yxH.js";import"./input-vSeq6R7n.js";import"./select-BimLQx0-.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-Btum-Xq9.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./tooltip-CldeheBp.js";import"./checkbox-OptVgWvT.js";import"./popover-CfLROtjL.js";import"./dropdown-menu-BGKoUATf.js";import"./index-CLEGCNc0.js";import"./search-CZ8TAUj0.js";import"./x-DHctwwaT.js";import"./plus-Bz5CK1Id.js";import"./index-C-xWP-pl.js";import"./label-DmCCWqIB.js";import"./seg-group-D0IDbvdD.js";import"./chips-DzzKURvw.js";import"./undo-2-CSzb_e47.js";const Ie={title:"頁面/明細頁"},G=[{key:"name",label:"單位名稱",kind:"text"},{key:"tier",label:"等級",kind:"select",format:a=>{var r;return((r=x.find(o=>o.value===a))==null?void 0:r.label)??String(a)}},{key:"quota",label:"上限額度",kind:"money"},{key:"contact",label:"聯絡方式",kind:"text"}],J=[{key:"id",header:"編號",cell:a=>a.id,sortValue:a=>a.id},{key:"name",header:"項目",truncate:160,cell:a=>a.name,sortValue:a=>a.name},{key:"amount",header:"金額",numeric:!0,cell:a=>M(a.amount),sortValue:a=>a.amount},{key:"status",header:"狀態",cell:a=>h[a.status],sortValue:a=>h[a.status]}];function R(){return e.jsx(q,{nav:e.jsx(w,{href:"#/records"}),title:t.name,badges:e.jsxs(e.Fragment,{children:[e.jsx(u,{variant:"outline",children:t.code}),e.jsx(u,{variant:"success",children:"啟用中"})]}),actions:e.jsxs(e.Fragment,{children:[e.jsx(i,{variant:"outline",size:"sm",children:"匯出"}),e.jsxs(B,{children:[e.jsx(_,{asChild:!0,children:e.jsx(i,{variant:"destructive",size:"sm",children:"停用"})}),e.jsxs(A,{children:[e.jsxs(O,{children:[e.jsxs(I,{children:["確定要停用 ",t.code,"？"]}),e.jsx($,{children:"停用後此單位不能再建立新項目，既有項目不受影響。此動作會寫入異動紀錄。"})]}),e.jsxs(V,{children:[e.jsx(L,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"返回"})}),e.jsx(i,{variant:"destructive",children:"確定停用"})]})]})]})]})})}const c={render:function(){const[r,o]=y.useState("basic"),l=U.filter(n=>n.unit==="甲單位");return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[e.jsx(R,{}),e.jsx(S,{label:"明細分區",value:r,onChange:o,tabs:[{key:"basic",label:"基本資料"},{key:"related",label:"關聯項目",badge:e.jsx(u,{variant:"secondary",children:l.length})},{key:"history",label:"異動紀錄"}]}),r==="basic"&&e.jsxs(g,{children:[e.jsx(N,{children:e.jsx(P,{className:"text-base",children:"基本資料"})}),e.jsxs(p,{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"單位名稱",kind:"text",value:t.name,original:t.name,onChange:()=>{}}),e.jsx(s,{label:"單位代號",kind:"text",value:t.code,original:t.code,onChange:()=>{},disabled:!0,lockHint:"代號建立後不可變更"}),e.jsx(s,{label:"等級",kind:"select",options:x,value:t.tier,original:t.tier,onChange:()=>{}}),e.jsx(s,{label:"上限額度",kind:"money",value:t.quota,original:t.quota,onChange:()=>{}})]})]}),r==="related"&&e.jsx(H,{rows:l,columns:J,getRowKey:n=>n.id,dense:!0,searchable:!1,onRowClick:()=>{}}),r==="history"&&e.jsx(g,{children:e.jsxs(p,{className:"space-y-2 pt-6 text-sm",children:[e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2024-02-05・第一組"}),"　調整上限額度：$1,500,000 → $1,650,000"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2024-01-26・第二組"}),"　等級：銀級 → 金級"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2019-04-01・系統"}),"　建立此單位"]})]})})]})}},m={render:function(){const[r,o]=y.useState(t),{changes:l,revertField:n,revertAll:T}=K(t,r,o,G),d=D=>F=>o(E=>({...E,[D]:F}));return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[e.jsx(R,{}),e.jsxs("div",{className:"grid gap-6 lg:grid-cols-[1fr_300px]",children:[e.jsxs(g,{children:[e.jsx(N,{children:e.jsx(P,{className:"text-base",children:"基本資料"})}),e.jsxs(p,{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"單位名稱",kind:"text",value:r.name,original:t.name,onChange:d("name"),onRevert:()=>n("name")}),e.jsx(s,{label:"等級",kind:"select",options:x,value:r.tier,original:t.tier,onChange:d("tier"),onRevert:()=>n("tier")}),e.jsx(s,{label:"上限額度",kind:"money",value:r.quota,original:t.quota,onChange:d("quota"),onRevert:()=>n("quota")}),e.jsx(s,{label:"聯絡方式",kind:"text",value:r.contact,original:t.contact,onChange:d("contact"),onRevert:()=>n("contact")})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(z,{changes:l,onRevertField:n,onRevertAll:T}),e.jsxs(i,{className:"w-full",disabled:l.length===0,children:["送出 ",l.length>0&&`（${l.length} 項變更）`]})]})]})]})}};var f,b,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [tab, setTab] = useState("basic");
    const related = demoRecords.filter(r => r.unit === "甲單位");
    return <div className="mx-auto max-w-5xl space-y-4">
        <ProfileHeader />

        {/* 分頁籤切區：實務上目前分頁要寫進網址，分享連結才落在同一個分頁 */}
        <TabPills label="明細分區" value={tab} onChange={setTab} tabs={[{
        key: "basic",
        label: "基本資料"
      }, {
        key: "related",
        label: "關聯項目",
        badge: <Badge variant="secondary">{related.length}</Badge>
      }, {
        key: "history",
        label: "異動紀錄"
      }]} />

        {tab === "basic" && <Card>
            <CardHeader><CardTitle className="text-base">基本資料</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {/* 唯讀優先：平常是乾淨的唯讀版面，點值才進入編輯 */}
              <EditableField label="單位名稱" kind="text" value={demoProfile.name} original={demoProfile.name} onChange={() => {}} />
              <EditableField label="單位代號" kind="text" value={demoProfile.code} original={demoProfile.code} onChange={() => {}} disabled lockHint="代號建立後不可變更" />
              <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={demoProfile.tier} original={demoProfile.tier} onChange={() => {}} />
              <EditableField label="上限額度" kind="money" value={demoProfile.quota} original={demoProfile.quota} onChange={() => {}} />
            </CardContent>
          </Card>}

        {tab === "related" && <DataTable rows={related} columns={relatedColumns} getRowKey={r => r.id} dense searchable={false} onRowClick={() => {}} />}

        {tab === "history" && <Card>
            <CardContent className="space-y-2 pt-6 text-sm">
              <p><span className="text-muted-foreground">2024-02-05・第一組</span>　調整上限額度：$1,500,000 → $1,650,000</p>
              <p><span className="text-muted-foreground">2024-01-26・第二組</span>　等級：銀級 → 金級</p>
              <p><span className="text-muted-foreground">2019-04-01・系統</span>　建立此單位</p>
            </CardContent>
          </Card>}
      </div>;
  }
}`,...(v=(b=c.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var C,j,k;m.parameters={...m.parameters,docs:{...(C=m.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
    return <div className="mx-auto max-w-5xl space-y-4">
        <ProfileHeader />
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader><CardTitle className="text-base">基本資料</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <EditableField label="單位名稱" kind="text" value={draft.name} original={demoProfile.name} onChange={set("name")} onRevert={() => revertField("name")} />
              <EditableField label="等級" kind="select" options={TIER_OPTIONS} value={draft.tier} original={demoProfile.tier} onChange={set("tier")} onRevert={() => revertField("tier")} />
              <EditableField label="上限額度" kind="money" value={draft.quota} original={demoProfile.quota} onChange={set("quota")} onRevert={() => revertField("quota")} />
              <EditableField label="聯絡方式" kind="text" value={draft.contact} original={demoProfile.contact} onChange={set("contact")} onRevert={() => revertField("contact")} />
            </CardContent>
          </Card>
          {/* 動作區：送出前先看得到改了什麼；沒有變更就不能送 */}
          <div className="space-y-2">
            <ChangeSummary changes={changes} onRevertField={revertField} onRevertAll={revertAll} />
            <Button className="w-full" disabled={changes.length === 0}>
              送出 {changes.length > 0 && \`（\${changes.length} 項變更）\`}
            </Button>
          </div>
        </div>
      </div>;
  }
}`,...(k=(j=m.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};const $e=["典型組成","編輯與變更摘要"];export{$e as __namedExportsOrder,Ie as default,c as 典型組成,m as 編輯與變更摘要};
