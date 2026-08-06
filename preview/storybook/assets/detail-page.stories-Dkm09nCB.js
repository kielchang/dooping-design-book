import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./index-BFQ_Q9OP.js";import{B as u}from"./badge-B-Xe92Tx.js";import{B as o}from"./button-i72Edb48.js";import{T as S}from"./tab-pills-6ZSblm0o.js";import{C as g,a as N,d as R,c as x}from"./card-CF2OQJSG.js";import{D as w}from"./data-table-DnMcgKTo.js";import{D as q,a as H,b as A,c as B,d as _,e as I,f as O,g as $}from"./dialog-xzhddh7c.js";import{E as s,u as L,C as z}from"./use-record-diff-CdDVuCPq.js";import{f as V}from"./utils-pm6Xa0Qd.js";import{a as K,d as n,T as h,S as p}from"./sample-data-DlVwqcXX.js";import{c as M}from"./createLucideIcon-DDRU598s.js";import"./index-rhYpeUg2.js";import"./index-DdXKfkXy.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./table-BcYJvUkN.js";import"./empty-state-BjzKLH_M.js";import"./skeleton-C5oW7yxH.js";import"./input-BrhjGTHk.js";import"./select-qegdSbxB.js";import"./Combination-DbYkIDSq.js";import"./index-BTi5fV8z.js";import"./index-qiD-0q_F.js";import"./check-SsieMrcg.js";import"./tooltip-1GOoMEVs.js";import"./x-C3WrzgWc.js";import"./plus-CK8V5P7p.js";import"./label-8atcQy7k.js";import"./seg-group-C31EXuC6.js";import"./chips-hPkBPIX5.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=M("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),Pe={title:"頁面/明細頁"},G=[{key:"name",label:"單位名稱",kind:"text"},{key:"tier",label:"等級",kind:"select",format:a=>{var t;return((t=h.find(i=>i.value===a))==null?void 0:t.label)??String(a)}},{key:"quota",label:"上限額度",kind:"money"},{key:"contact",label:"聯絡方式",kind:"text"}],J=[{key:"id",header:"編號",cell:a=>a.id,sortValue:a=>a.id},{key:"name",header:"項目",truncate:160,cell:a=>a.name,sortValue:a=>a.name},{key:"amount",header:"金額",numeric:!0,cell:a=>V(a.amount),sortValue:a=>a.amount},{key:"status",header:"狀態",cell:a=>p[a.status],sortValue:a=>p[a.status]}];function P(){return e.jsxs("div",{className:"space-y-2",children:[e.jsxs(o,{variant:"ghost",size:"sm",className:"-ml-2 text-muted-foreground",children:[e.jsx(U,{})," 返回清單"]}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("h1",{className:"text-2xl font-semibold",children:n.name}),e.jsx(u,{variant:"outline",children:n.code}),e.jsx(u,{variant:"success",children:"啟用中"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(o,{variant:"outline",size:"sm",children:"匯出"}),e.jsxs(q,{children:[e.jsx(H,{asChild:!0,children:e.jsx(o,{variant:"destructive",size:"sm",children:"停用"})}),e.jsxs(A,{children:[e.jsxs(B,{children:[e.jsxs(_,{children:["確定要停用 ",n.code,"？"]}),e.jsx(I,{children:"停用後此單位不能再建立新項目，既有項目不受影響。此動作會寫入異動紀錄。"})]}),e.jsxs(O,{children:[e.jsx($,{asChild:!0,children:e.jsx(o,{variant:"outline",children:"返回"})}),e.jsx(o,{variant:"destructive",children:"確定停用"})]})]})]})]})]})]})}const c={render:function(){const[t,i]=y.useState("basic"),l=K.filter(r=>r.unit==="甲單位");return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[e.jsx(P,{}),e.jsx(S,{label:"明細分區",value:t,onChange:i,tabs:[{key:"basic",label:"基本資料"},{key:"related",label:"關聯項目",badge:e.jsx(u,{variant:"secondary",children:l.length})},{key:"history",label:"異動紀錄"}]}),t==="basic"&&e.jsxs(g,{children:[e.jsx(N,{children:e.jsx(R,{className:"text-base",children:"基本資料"})}),e.jsxs(x,{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"單位名稱",kind:"text",value:n.name,original:n.name,onChange:()=>{}}),e.jsx(s,{label:"單位代號",kind:"text",value:n.code,original:n.code,onChange:()=>{},disabled:!0,lockHint:"代號建立後不可變更"}),e.jsx(s,{label:"等級",kind:"select",options:h,value:n.tier,original:n.tier,onChange:()=>{}}),e.jsx(s,{label:"上限額度",kind:"money",value:n.quota,original:n.quota,onChange:()=>{}})]})]}),t==="related"&&e.jsx(w,{rows:l,columns:J,getRowKey:r=>r.id,dense:!0,searchable:!1,onRowClick:()=>{}}),t==="history"&&e.jsx(g,{children:e.jsxs(x,{className:"space-y-2 pt-6 text-sm",children:[e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2024-02-05・第一組"}),"　調整上限額度：$1,500,000 → $1,650,000"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2024-01-26・第二組"}),"　等級：銀級 → 金級"]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-muted-foreground",children:"2019-04-01・系統"}),"　建立此單位"]})]})})]})}},m={render:function(){const[t,i]=y.useState(n),{changes:l,revertField:r,revertAll:T}=L(n,t,i,G),d=D=>E=>i(F=>({...F,[D]:E}));return e.jsxs("div",{className:"mx-auto max-w-5xl space-y-4",children:[e.jsx(P,{}),e.jsxs("div",{className:"grid gap-6 lg:grid-cols-[1fr_300px]",children:[e.jsxs(g,{children:[e.jsx(N,{children:e.jsx(R,{className:"text-base",children:"基本資料"})}),e.jsxs(x,{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"單位名稱",kind:"text",value:t.name,original:n.name,onChange:d("name"),onRevert:()=>r("name")}),e.jsx(s,{label:"等級",kind:"select",options:h,value:t.tier,original:n.tier,onChange:d("tier"),onRevert:()=>r("tier")}),e.jsx(s,{label:"上限額度",kind:"money",value:t.quota,original:n.quota,onChange:d("quota"),onRevert:()=>r("quota")}),e.jsx(s,{label:"聯絡方式",kind:"text",value:t.contact,original:n.contact,onChange:d("contact"),onRevert:()=>r("contact")})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(z,{changes:l,onRevertField:r,onRevertAll:T}),e.jsxs(o,{className:"w-full",disabled:l.length===0,children:["送出 ",l.length>0&&`（${l.length} 項變更）`]})]})]})]})}};var f,b,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: function Render() {
    const [tab, setTab] = useState("basic");
    const related = demoRecords.filter(r => r.unit === "甲單位");
    return <div className="mx-auto max-w-5xl space-y-4">
        <PageHeader />

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
        <PageHeader />
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
}`,...(k=(j=m.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};const Te=["典型組成","編輯與變更摘要"];export{Te as __namedExportsOrder,Pe as default,c as 典型組成,m as 編輯與變更摘要};
