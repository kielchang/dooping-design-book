import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-BFQ_Q9OP.js";import{B}from"./badge-B-Xe92Tx.js";import{B as t}from"./button-i72Edb48.js";import{C as w}from"./callout-Dc_ExeDD.js";import{C as m,a as u,d as x,b as p,c as h,e as k}from"./card-CF2OQJSG.js";import{C as H}from"./checkbox-CNPe1prz.js";import{C as q}from"./chips-hPkBPIX5.js";import{L as f}from"./label-8atcQy7k.js";import{N as O}from"./number-input-LFDh09jt.js";import{S as F}from"./seg-group-C31EXuC6.js";import{D as I,a as L,b as E,c as _,d as V,e as Q,f as R,g as z}from"./dialog-xzhddh7c.js";import{d as s,C as A}from"./sample-data-DlVwqcXX.js";import"./index-rhYpeUg2.js";import"./utils-pm6Xa0Qd.js";import"./index-DdXKfkXy.js";import"./createLucideIcon-DDRU598s.js";import"./Combination-DbYkIDSq.js";import"./index-BTi5fV8z.js";import"./index-BvEpo9bQ.js";import"./index-CI1UOwFw.js";import"./index-qiD-0q_F.js";import"./check-SsieMrcg.js";import"./input-BrhjGTHk.js";import"./x-C3WrzgWc.js";const ge={title:"頁面/設定頁"},G=[{value:"table",label:"清單"},{value:"card",label:"卡片"}],r={render:function(){const[D,S]=n.useState(!1),[T,y]=n.useState("table"),[C,g]=n.useState(s.quota),[i,v]=n.useState(s.channels),[l,o]=n.useState(!1),d=C!==s.quota||i.length!==s.channels.length||i.some(a=>!s.channels.includes(a));return e.jsxs("div",{className:"mx-auto max-w-2xl space-y-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-semibold",children:"設定"}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[s.name,"・",s.code]})]}),e.jsxs(m,{children:[e.jsxs(u,{children:[e.jsx(x,{className:"text-base",children:"顯示偏好"}),e.jsx(p,{children:"變更立即生效，只影響你自己的畫面。"})]}),e.jsxs(h,{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(H,{id:"sp-dense",checked:D,onCheckedChange:a=>S(a===!0)}),e.jsx(f,{htmlFor:"sp-dense",children:"清單使用密集模式"})]}),e.jsx(F,{label:"預設檢視",options:G,value:T,onPick:y})]})]}),e.jsxs(m,{children:[e.jsxs(u,{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(x,{className:"text-base",children:"額度與管道"}),d&&!l&&e.jsx(B,{variant:"edit",children:"已改動未送出"})]}),e.jsx(p,{children:"影響整個單位，按「儲存」才會生效並寫入異動紀錄。"})]}),e.jsxs(h,{className:"space-y-4",children:[e.jsxs("div",{className:"max-w-52 space-y-1",children:[e.jsx(f,{children:"上限額度"}),e.jsx(O,{value:C,onChange:g,min:0,step:5e4,"aria-label":"上限額度"})]}),e.jsx(q,{label:"聯絡管道",options:A,selected:i,onToggle:a=>{o(!1),v(c=>c.includes(a)?c.filter(P=>P!==a):[...c,a])}}),l&&e.jsx(w,{variant:"success",title:"已儲存",live:!0,children:"新的額度與管道即刻生效，這次變更已寫入異動紀錄。"})]}),e.jsxs(k,{className:"justify-end gap-2 border-t pt-4",children:[e.jsx(t,{variant:"outline",disabled:!d,onClick:()=>{g(s.quota),v(s.channels),o(!1)},children:"還原"}),e.jsx(t,{disabled:!d||l,onClick:()=>o(!0),children:"儲存"})]})]}),e.jsxs(m,{className:"border-danger/40",children:[e.jsxs(u,{children:[e.jsx(x,{className:"text-base text-danger",children:"危險操作"}),e.jsx(p,{children:"做了就很難回頭的事，全部集中在這裡。"})]}),e.jsxs(h,{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsxs("div",{className:"text-sm",children:[e.jsx("p",{className:"font-medium",children:"停用此單位"}),e.jsx("p",{className:"text-muted-foreground",children:"停用後不能再建立新項目，既有資料保留可查。"})]}),e.jsxs(I,{children:[e.jsx(L,{asChild:!0,children:e.jsx(t,{variant:"destructive",size:"sm",children:"停用"})}),e.jsxs(E,{children:[e.jsxs(_,{children:[e.jsxs(V,{children:["確定要停用 ",s.code,"？"]}),e.jsx(Q,{children:"停用會即刻生效並通知相關負責組別；重新啟用需要管理者權限。"})]}),e.jsxs(R,{children:[e.jsx(z,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"返回"})}),e.jsx(t,{variant:"destructive",children:"確定停用"})]})]})]})]})]})]})}};var j,N,b;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: function Render() {
    const [dense, setDense] = useState(false);
    const [view, setView] = useState("table");
    const [quota, setQuota] = useState(demoProfile.quota);
    const [channels, setChannels] = useState<string[]>(demoProfile.channels);
    const [saved, setSaved] = useState(false);
    const dirty = quota !== demoProfile.quota || channels.length !== demoProfile.channels.length || channels.some(c => !demoProfile.channels.includes(c));
    return <div className="mx-auto max-w-2xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">設定</h1>
          <p className="text-sm text-muted-foreground">{demoProfile.name}・{demoProfile.code}</p>
        </div>

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
}`,...(b=(N=r.parameters)==null?void 0:N.docs)==null?void 0:b.source}}};const ve=["典型組成"];export{ve as __namedExportsOrder,ge as default,r as 典型組成};
