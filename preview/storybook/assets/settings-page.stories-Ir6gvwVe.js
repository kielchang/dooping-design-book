import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-UiW3gZKV.js";import{B}from"./badge-Cl3jk1vO.js";import{B as t}from"./button-Cw_3_x2n.js";import{C as w}from"./callout-Yc-42awg.js";import{C as m,a as u,d as p,b as C,c as x,e as H}from"./card-B8B3JnhV.js";import{C as k}from"./checkbox-B4Z_93Kg.js";import{C as q}from"./chips-mSw_l9hW.js";import{L as f}from"./label-BJyaxRcC.js";import{N as O}from"./number-input-Dl8WS-DZ.js";import{P as F}from"./page-header-c9aiWSz1.js";import{S as I}from"./seg-group-DXjbX0o5.js";import{D as L,a as E,b as _,c as V,d as Q,e as $,f as R,g as z}from"./dialog-Dv1_qDMn.js";import{d as a,C as A}from"./sample-data-I9KaR9SF.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-C9IEqVQG.js";import"./utils-DBXtLcuW.js";import"./index-VXoYh6zd.js";import"./createLucideIcon-BcR0bl2m.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./index-BmqVfOSQ.js";import"./check-CZys2X9e.js";import"./input-kuo8quod.js";import"./chevron-right-DWuV1wB0.js";import"./index-C-xWP-pl.js";import"./x-DHctwwaT.js";const be={title:"頁面/設定頁"},G=[{value:"table",label:"清單"},{value:"card",label:"卡片"}],r={render:function(){const[D,S]=n.useState(!1),[P,T]=n.useState("table"),[h,g]=n.useState(a.quota),[i,v]=n.useState(a.channels),[o,l]=n.useState(!1),d=h!==a.quota||i.length!==a.channels.length||i.some(s=>!a.channels.includes(s));return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-4",children:[e.jsx(F,{title:"設定",meta:`${a.name}・${a.code}`}),e.jsxs(m,{children:[e.jsxs(u,{children:[e.jsx(p,{className:"text-base",children:"顯示偏好"}),e.jsx(C,{children:"變更立即生效，只影響你自己的畫面。"})]}),e.jsxs(x,{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{id:"sp-dense",checked:D,onCheckedChange:s=>S(s===!0)}),e.jsx(f,{htmlFor:"sp-dense",children:"清單使用密集模式"})]}),e.jsx(I,{label:"預設檢視",options:G,value:P,onPick:T})]})]}),e.jsxs(m,{children:[e.jsxs(u,{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(p,{className:"text-base",children:"額度與管道"}),d&&!o&&e.jsx(B,{variant:"edit",children:"已改動未送出"})]}),e.jsx(C,{children:"影響整個單位，按「儲存」才會生效並寫入異動紀錄。"})]}),e.jsxs(x,{className:"space-y-4",children:[e.jsxs("div",{className:"max-w-52 space-y-1",children:[e.jsx(f,{children:"上限額度"}),e.jsx(O,{value:h,onChange:g,min:0,step:5e4,"aria-label":"上限額度"})]}),e.jsx(q,{label:"聯絡管道",options:A,selected:i,onToggle:s=>{l(!1),v(c=>c.includes(s)?c.filter(y=>y!==s):[...c,s])}}),o&&e.jsx(w,{variant:"success",title:"已儲存",live:!0,children:"新的額度與管道即刻生效，這次變更已寫入異動紀錄。"})]}),e.jsxs(H,{className:"justify-end gap-2 border-t pt-4",children:[e.jsx(t,{variant:"outline",disabled:!d,onClick:()=>{g(a.quota),v(a.channels),l(!1)},children:"還原"}),e.jsx(t,{disabled:!d||o,onClick:()=>l(!0),children:"儲存"})]})]}),e.jsxs(m,{className:"border-danger/40",children:[e.jsxs(u,{children:[e.jsx(p,{className:"text-base text-danger",children:"危險操作"}),e.jsx(C,{children:"做了就很難回頭的事，全部集中在這裡。"})]}),e.jsxs(x,{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsxs("div",{className:"text-sm",children:[e.jsx("p",{className:"font-medium",children:"停用此單位"}),e.jsx("p",{className:"text-muted-foreground",children:"停用後不能再建立新項目，既有資料保留可查。"})]}),e.jsxs(L,{children:[e.jsx(E,{asChild:!0,children:e.jsx(t,{variant:"destructive",size:"sm",children:"停用"})}),e.jsxs(_,{children:[e.jsxs(V,{children:[e.jsxs(Q,{children:["確定要停用 ",a.code,"？"]}),e.jsx($,{children:"停用會即刻生效並通知相關負責組別；重新啟用需要管理者權限。"})]}),e.jsxs(R,{children:[e.jsx(z,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"返回"})}),e.jsx(t,{variant:"destructive",children:"確定停用"})]})]})]})]})]})]})}};var j,N,b;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: function Render() {
    const [dense, setDense] = useState(false);
    const [view, setView] = useState("table");
    const [quota, setQuota] = useState(demoProfile.quota);
    const [channels, setChannels] = useState<string[]>(demoProfile.channels);
    const [saved, setSaved] = useState(false);
    const dirty = quota !== demoProfile.quota || channels.length !== demoProfile.channels.length || channels.some(c => !demoProfile.channels.includes(c));
    return <div className="mx-auto max-w-2xl space-y-4">
        <PageHeader title="設定" meta={\`\${demoProfile.name}・\${demoProfile.code}\`} />

        {/* 立即生效區：改了就生效，所以沒有儲存鈕——要在標題旁講清楚 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">顯示偏好</CardTitle>
            <CardDescription>變更立即生效，只影響你自己的畫面。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox id="sp-dense" checked={dense} onCheckedChange={v => setDense(v === true)} />
              <Label htmlFor="sp-dense">清單使用密集模式</Label>
            </div>
            <SegGroup label="預設檢視" options={VIEW_OPTIONS} value={view} onPick={setView} />
          </CardContent>
        </Card>

        {/* 需儲存區：影響其他人看到的資料，改動標琥珀、按了儲存才算數 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">額度與管道</CardTitle>
              {dirty && !saved && <Badge variant="edit">已改動未送出</Badge>}
            </div>
            <CardDescription>影響整個單位，按「儲存」才會生效並寫入異動紀錄。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-52 space-y-1">
              <Label>上限額度</Label>
              <NumberInput value={quota} onChange={setQuota} min={0} step={50_000} aria-label="上限額度" />
            </div>
            <Chips label="聯絡管道" options={CHANNEL_OPTIONS} selected={channels} onToggle={v => {
            setSaved(false);
            setChannels(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);
          }} />
            {saved && <Callout variant="success" title="已儲存" live>
                新的額度與管道即刻生效，這次變更已寫入異動紀錄。
              </Callout>}
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t pt-4">
            <Button variant="outline" disabled={!dirty} onClick={() => {
            setQuota(demoProfile.quota);
            setChannels(demoProfile.channels);
            setSaved(false);
          }}>
              還原
            </Button>
            <Button disabled={!dirty || saved} onClick={() => setSaved(true)}>儲存</Button>
          </CardFooter>
        </Card>

        {/* 危險操作區：獨立隔離、紅字說清楚後果、按了還要再確認一次 */}
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle className="text-base text-danger">危險操作</CardTitle>
            <CardDescription>做了就很難回頭的事，全部集中在這裡。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">停用此單位</p>
              <p className="text-muted-foreground">停用後不能再建立新項目，既有資料保留可查。</p>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="destructive" size="sm">停用</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>確定要停用 {demoProfile.code}？</DialogTitle>
                  <DialogDescription>
                    停用會即刻生效並通知相關負責組別；重新啟用需要管理者權限。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">返回</Button></DialogClose>
                  <Button variant="destructive">確定停用</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>;
  }
}`,...(b=(N=r.parameters)==null?void 0:N.docs)==null?void 0:b.source}}};const De=["典型組成"];export{De as __namedExportsOrder,be as default,r as 典型組成};
