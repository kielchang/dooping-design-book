import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-UiW3gZKV.js";import{r as D}from"./index-3b7XovMV.js";import{B as c}from"./button-BZKmkDjW.js";import{c as F}from"./utils-pm6Xa0Qd.js";import{c as q}from"./createLucideIcon-BcR0bl2m.js";import{X as ae}from"./x-DHctwwaT.js";import{C as J,a as Q,d as Y,c as Z}from"./card-CFhhONKA.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-BA8NevWa.js";import"./index-C5qX--6C.js";import"./index-rhYpeUg2.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=q("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=q("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]),le={skip:"略過",prev:"上一步",next:"下一步",finish:"完成",collapse:"縮小（騰出空間操作，之後可展開）",expand:"展開",guide:"導引",keyboardHint:"· ← → 換步 · Esc 略過",verdictTitle:"驗收此步：",pass:"✅ 通過",issue:"❌ 有問題",notePlaceholder:"（選填）問題描述，會寫進驗收報告",dialogLabel:"操作導引"},m=12,A=12,x=6;function $({targetRect:s,title:l,body:d,stepIndex:a,stepCount:u,isFirst:f,isLast:h,onNext:o,onPrev:i,onSkip:p,finishLabel:y,secondaryAction:S,actionHint:H,warning:R,showVerdict:ee,verdict:j,onVerdict:g,note:te,onNote:k,labels:ne}){const r={...le,...ne},C=n.useRef(null),[w,P]=n.useState(null),[se,E]=n.useState(!1);n.useEffect(()=>{var t;E(!1),(t=C.current)==null||t.focus()},[a]);const re=t=>{t.key==="Escape"?(t.preventDefault(),p()):t.key==="ArrowRight"?(t.preventDefault(),o()):t.key==="ArrowLeft"?f||(t.preventDefault(),i()):t.key==="Enter"&&t.target===C.current&&(t.preventDefault(),o())};return n.useLayoutEffect(()=>{const t=C.current;if(!t)return;const B=t.offsetWidth,L=t.offsetHeight,O=window.innerWidth,z=window.innerHeight;if(!s){P({top:Math.max(m,(z-L)/2),left:Math.max(m,(O-B)/2)});return}let M=s.bottom+A;M+L>z-m&&(M=Math.max(m,s.top-L-A));let T=s.left+s.width/2-B/2;T=Math.min(Math.max(m,T),Math.max(m,O-B-m)),P({top:M,left:T})},[s,l,d,a,u]),se?D.createPortal(e.jsx("div",{className:"pointer-events-none fixed inset-0 z-[200]",children:e.jsxs("div",{className:"pointer-events-auto fixed bottom-4 right-4 flex items-center gap-2 rounded-full border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg",children:[e.jsxs("span",{className:"tabular-nums text-muted-foreground",children:[r.guide," ",a+1,"/",u]}),e.jsxs(c,{size:"sm",variant:"outline",onClick:()=>E(!1),children:[e.jsx(oe,{className:"size-3.5"})," ",r.expand]}),e.jsx("button",{type:"button",onClick:p,className:"text-tiny text-muted-foreground underline underline-offset-2",children:r.skip})]})}),document.body):D.createPortal(e.jsxs("div",{className:"pointer-events-none fixed inset-0 z-[200]",role:"dialog","aria-modal":"false","aria-label":r.dialogLabel,children:[s?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"pointer-events-none fixed rounded-md",style:{top:s.top-x,left:s.left-x,width:s.width+x*2,height:s.height+x*2,boxShadow:"0 0 0 9999px rgba(15,23,42,0.55)"}}),e.jsx("div",{className:"spotlight-ring pointer-events-none fixed rounded-md",style:{top:s.top-x,left:s.left-x,width:s.width+x*2,height:s.height+x*2}})]}):e.jsx("div",{className:"pointer-events-none fixed inset-0 bg-foreground/60"}),e.jsxs("div",{ref:C,tabIndex:-1,onKeyDown:re,"aria-live":"polite",style:w?{top:w.top,left:w.left}:{opacity:0},className:"pointer-events-auto fixed w-[min(340px,calc(100vw-24px))] rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg outline-none ring-1 ring-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",children:[e.jsxs("div",{className:"mb-1 flex items-start justify-between gap-2",children:[e.jsx("p",{className:"text-sm font-semibold",children:l}),e.jsxs("div",{className:"-m-1 flex items-center gap-0.5",children:[e.jsx("button",{type:"button",onClick:()=>E(!0),"aria-label":r.collapse,title:r.collapse,className:"tap-target rounded p-1 text-muted-foreground hover:text-foreground",children:e.jsx(ie,{className:"size-4","aria-hidden":!0})}),e.jsx("button",{type:"button",onClick:p,"aria-label":r.skip,className:"tap-target rounded p-1 text-muted-foreground hover:text-foreground",children:e.jsx(ae,{className:"size-4","aria-hidden":!0})})]})]}),e.jsx("div",{className:"text-sm text-muted-foreground [&_strong]:text-foreground",children:d}),R&&e.jsx("p",{className:"mt-2 rounded-md border border-danger/40 bg-danger/10 px-2 py-1.5 text-xs text-danger [&_strong]:text-danger",children:R}),H&&e.jsxs("p",{className:"mt-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary",children:[e.jsx("span",{className:"inline-block size-2 shrink-0 animate-pulse rounded-full bg-primary","aria-hidden":!0}),H]}),ee&&e.jsxs("div",{className:"mt-2 rounded-md border bg-muted/40 p-2",children:[e.jsx("p",{className:"mb-1.5 text-tiny font-medium text-muted-foreground",children:r.verdictTitle}),e.jsxs("div",{className:"flex gap-2",role:"radiogroup","aria-label":r.verdictTitle,children:[e.jsx("button",{type:"button",role:"radio","aria-checked":j==="pass",onClick:()=>g==null?void 0:g("pass"),className:F("state-layer tap-target flex-1 rounded-md border px-2 py-1 text-xs font-medium",j==="pass"?"border-success bg-success/15 text-success":"text-muted-foreground"),children:r.pass}),e.jsx("button",{type:"button",role:"radio","aria-checked":j==="issue",onClick:()=>g==null?void 0:g("issue"),className:F("state-layer tap-target flex-1 rounded-md border px-2 py-1 text-xs font-medium",j==="issue"?"border-danger bg-danger/15 text-danger":"text-muted-foreground"),children:r.issue})]}),j==="issue"&&e.jsx("textarea",{value:te??"",onChange:t=>k==null?void 0:k(t.target.value),rows:2,placeholder:r.notePlaceholder,className:"field-editable mt-2 w-full resize-none rounded-md border px-2 py-1 text-xs"})]}),e.jsxs("div",{className:"mt-3 flex items-center justify-between",children:[e.jsxs("span",{className:"text-xs tabular-nums text-muted-foreground",children:[a+1," / ",u,e.jsx("span",{className:"ml-1.5 hidden text-micro text-muted-foreground/70 sm:inline","aria-hidden":!0,children:r.keyboardHint})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button",onClick:p,className:"text-tiny text-muted-foreground underline underline-offset-2",children:r.skip}),!f&&e.jsx(c,{variant:"outline",size:"sm",onClick:i,children:r.prev}),h&&S&&e.jsx(c,{variant:"outline",size:"sm",onClick:S.onClick,children:S.label}),e.jsx(c,{size:"sm",onClick:o,children:h?y??r.finish:r.next})]})]})]})]}),document.body)}const ye={title:"元件/引導/聚光導引 Coachmark"},b=[{title:"先選擇單位",body:e.jsx(e.Fragment,{children:"從這裡挑一個既有單位，或直接建立新的。"})},{title:"加入項目",body:e.jsx(e.Fragment,{children:"可以一次加入多筆；數量與金額都能之後再調整。"}),actionHint:"👆 點上方圈起來的按鈕試試"},{title:"最後確認",body:e.jsxs(e.Fragment,{children:["送出前會顯示",e.jsx("strong",{children:"本次變更摘要"}),"，確認無誤再送出。"]})}],v={render:function(){const[l,d]=n.useState(!1),[a,u]=n.useState(0),[f,h]=n.useState(null),o=[n.useRef(null),n.useRef(null),n.useRef(null)];return n.useLayoutEffect(()=>{var p;if(!l)return;const i=(p=o[a])==null?void 0:p.current;h(i?i.getBoundingClientRect():null)},[l,a]),e.jsxs("div",{className:"space-y-4",children:[e.jsx(c,{onClick:()=>{u(0),d(!0)},children:"開始導引"}),e.jsxs(J,{className:"max-w-xl",children:[e.jsx(Q,{children:e.jsx(Y,{children:"建立一筆資料"})}),e.jsxs(Z,{className:"flex flex-wrap gap-2",children:[e.jsx(c,{ref:o[0],variant:"outline",children:"選擇單位"}),e.jsx(c,{ref:o[1],variant:"outline",children:"加入項目"}),e.jsx(c,{ref:o[2],children:"確認送出"})]})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"聚光洞可以點穿——導引是教人操作，不是代替他操作。卡片右上角可以縮小， 騰出空間做真正的操作後再展開。"}),l&&e.jsx($,{targetRect:f,title:b[a].title,body:b[a].body,actionHint:b[a].actionHint,stepIndex:a,stepCount:b.length,isFirst:a===0,isLast:a===b.length-1,onNext:()=>a===b.length-1?d(!1):u(i=>i+1),onPrev:()=>u(i=>Math.max(0,i-1)),onSkip:()=>d(!1)})]})}},N={render:function(){const[l,d]=n.useState(!1),[a,u]=n.useState(null),[f,h]=n.useState(""),o=n.useRef(null),[i,p]=n.useState(null);return n.useLayoutEffect(()=>{var y;l&&p(((y=o.current)==null?void 0:y.getBoundingClientRect())??null)},[l]),e.jsxs("div",{className:"space-y-4",children:[e.jsx(c,{onClick:()=>d(!0),children:"開始驗收"}),e.jsxs(J,{className:"max-w-md",children:[e.jsx(Q,{children:e.jsx(Y,{children:"資料清單"})}),e.jsx(Z,{children:e.jsx(c,{ref:o,variant:"outline",children:"匯出 CSV"})})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"同一個元件換一種用途：逐步標記「通過／有問題」＋備註，走完就是一份可交付的驗收報告。"}),l&&e.jsx($,{targetRect:i,title:"驗收：匯出功能",body:e.jsxs(e.Fragment,{children:["點「匯出 CSV」，確認下載的內容與畫面上",e.jsx("strong",{children:"篩選後"}),"的資料一致。"]}),warning:e.jsx(e.Fragment,{children:"此環境為示範資料，請勿以此結果作為正式驗收依據。"}),stepIndex:0,stepCount:1,isFirst:!0,isLast:!0,showVerdict:!0,verdict:a,onVerdict:u,note:f,onNote:h,onNext:()=>d(!1),onPrev:()=>{},onSkip:()=>d(!1)})]})}};var _,I,K,V,W;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const refs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
    useLayoutEffect(() => {
      if (!open) return;
      const el = refs[step]?.current;
      setRect(el ? el.getBoundingClientRect() : null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, step]);
    return <div className="space-y-4">
        <Button onClick={() => {
        setStep(0);
        setOpen(true);
      }}>開始導引</Button>
        <Card className="max-w-xl">
          <CardHeader><CardTitle>建立一筆資料</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button ref={refs[0]} variant="outline">選擇單位</Button>
            <Button ref={refs[1]} variant="outline">加入項目</Button>
            <Button ref={refs[2]}>確認送出</Button>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          聚光洞可以點穿——導引是教人操作，不是代替他操作。卡片右上角可以縮小，
          騰出空間做真正的操作後再展開。
        </p>
        {open && <Coachmark targetRect={rect} title={STEPS[step].title} body={STEPS[step].body} actionHint={STEPS[step].actionHint} stepIndex={step} stepCount={STEPS.length} isFirst={step === 0} isLast={step === STEPS.length - 1} onNext={() => step === STEPS.length - 1 ? setOpen(false) : setStep(s => s + 1)} onPrev={() => setStep(s => Math.max(0, s - 1))} onSkip={() => setOpen(false)} />}
      </div>;
  }
}`,...(K=(I=v.parameters)==null?void 0:I.docs)==null?void 0:K.source},description:{story:`導引本身的狀態機（走到第幾步、錨點在哪）屬於**宿主應用**，不在元件庫裡。
這個 story 演示的就是「宿主要寫的那一小段」。`,...(W=(V=v.parameters)==null?void 0:V.docs)==null?void 0:W.description}}};var G,U,X;N.parameters={...N.parameters,docs:{...(G=N.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [verdict, setVerdict] = useState<"pass" | "issue" | null>(null);
    const [note, setNote] = useState("");
    const anchor = useRef<HTMLButtonElement>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);
    useLayoutEffect(() => {
      if (open) setRect(anchor.current?.getBoundingClientRect() ?? null);
    }, [open]);
    return <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>開始驗收</Button>
        <Card className="max-w-md">
          <CardHeader><CardTitle>資料清單</CardTitle></CardHeader>
          <CardContent><Button ref={anchor} variant="outline">匯出 CSV</Button></CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          同一個元件換一種用途：逐步標記「通過／有問題」＋備註，走完就是一份可交付的驗收報告。
        </p>
        {open && <Coachmark targetRect={rect} title="驗收：匯出功能" body={<>點「匯出 CSV」，確認下載的內容與畫面上<strong>篩選後</strong>的資料一致。</>} warning={<>此環境為示範資料，請勿以此結果作為正式驗收依據。</>} stepIndex={0} stepCount={1} isFirst isLast showVerdict verdict={verdict} onVerdict={setVerdict} note={note} onNote={setNote} onNext={() => setOpen(false)} onPrev={() => {}} onSkip={() => setOpen(false)} />}
      </div>;
  }
}`,...(X=(U=N.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};const Ce=["三步導引","驗收模式"];export{Ce as __namedExportsOrder,ye as default,v as 三步導引,N as 驗收模式};
