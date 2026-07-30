import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{t as r}from"./index-D55oynAp.js";const _={title:"基礎/設計 Token"},x=n=>Object.entries(n).filter(([,s])=>typeof s=="object"&&s!==null&&"value"in s);function O({name:n,entry:s}){const l=s.value.startsWith("#");return e.jsxs("div",{className:"flex items-center gap-3 rounded-md border p-2",children:[e.jsx("span",{className:"size-9 shrink-0 rounded border",style:{background:l?s.value:`hsl(var(--${n}))`},"aria-hidden":!0}),e.jsxs("div",{className:"min-w-0",children:[e.jsxs("p",{className:"truncate font-mono text-xs",children:["--",n]}),s.desc&&e.jsx("p",{className:"truncate text-tiny text-muted-foreground",children:s.desc})]})]})}const t={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx("p",{className:"max-w-2xl text-sm text-muted-foreground",children:"命名說的是「這個顏色代表什麼意思」，不是「這是什麼顏色」。因此換色票時只改值、不改任何一行使用它的程式碼。 用 Storybook 工具列切換淺／深色，同一個 token 名稱會給出兩套值。"}),e.jsx("div",{className:"grid gap-2 sm:grid-cols-2 lg:grid-cols-3",children:x(r.color.light).map(([n,s])=>e.jsx(O,{name:n,entry:s},n))})]})},o={render:()=>{const n=a=>Array.from({length:8},(p,d)=>r.chart[a][`chart-${d+1}`].value),s=a=>`hsl(${r.color[a].background.value})`,l=a=>`hsl(${r.color[a].foreground.value})`;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("p",{className:"max-w-2xl text-sm text-muted-foreground",children:["分類色票與狀態語意",e.jsx("strong",{children:"刻意脫鉤"}),"：換一套分類色票，不會讓「紅＝異常」跟著變。 它也",e.jsx("strong",{children:"不跟著色相主題走"}),"——顏色跟資料實體走，同一個項目在所有圖表、所有主題下都是同一色， 所以切工具列的「色相」不會影響下面這兩排。"]}),e.jsxs("p",{className:"max-w-2xl text-sm text-muted-foreground",children:["排列順序是",e.jsx("strong",{children:"最遠點插入"}),"的順序，不是色相環：第 1 色錨在藍，之後每一色都是 「與已選色感知距離最遠」的那一個。因此取 ",e.jsx("code",{children:"chart-1"}),"…",e.jsx("code",{children:"chart-k"}),"對任何 k 都是近似最佳的 k 色子集。"]}),["light","dark"].map(a=>e.jsxs("div",{className:"space-y-2 rounded-md border p-3",style:{background:s(a),color:l(a)},children:[e.jsx("p",{className:"text-xs font-semibold",children:a==="light"?"淺色模式":"深色模式"}),e.jsx("div",{className:"flex gap-1.5",children:n(a).map((p,d)=>e.jsxs("div",{className:"flex-1 space-y-1",children:[e.jsx("div",{className:"h-10 rounded",style:{background:p},"aria-hidden":!0}),e.jsx("p",{className:"text-center font-mono text-tiny opacity-70",children:d+1})]},d))})]},a)),e.jsxs("p",{className:"max-w-2xl text-tiny text-muted-foreground",children:["淺深是",e.jsx("strong",{children:"兩組獨立的值，沒有任何一色相同"}),"。共用會把 OKLCH 的 L 鎖在",e.jsx("code",{children:"[0.49, 0.67]"}),"（寬度 0.17），八色必然擠在中明度——而二色覺者失去的正是色相辨別、 保留的是明度。上一版 8 色裡共用了 6 色，最差一對在綠色盲下 ΔE00 只有 2.6。"]})]})}},c={render:()=>e.jsxs("div",{className:"space-y-5",children:[e.jsxs("p",{className:"max-w-2xl text-sm text-muted-foreground",children:["用工具列的",e.jsx("strong",{children:"色相"}),"切換六組主題，",e.jsx("strong",{children:"主題"}),"切換淺深——兩者正交。 主題只影響 17 個 token：5 個主題色（下方）與 12 個帶色調的中性色（背景、邊框、muted…， 只轉色相、明度與彩度不動）。"]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{className:"space-y-2 rounded-md border p-3",children:[e.jsx("p",{className:"text-xs font-semibold",children:"主題色"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx("span",{className:"rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground",children:"關鍵動作"}),e.jsx("span",{className:"rounded-md bg-brand-subtle px-3 py-1.5 text-sm font-medium text-brand-subtle-foreground",children:"被選中的項目"})]}),e.jsx("div",{className:"pt-1",children:e.jsx("input",{className:"w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-2 ring-ring ring-offset-2 ring-offset-background",defaultValue:"聚焦環吃主題色相",readOnly:!0})})]}),e.jsxs("div",{className:"space-y-2 rounded-md border p-3",children:[e.jsx("p",{className:"text-xs font-semibold",children:"與主題無關"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx("span",{className:"rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground",children:"一般控制項"}),e.jsx("span",{className:"rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-danger-foreground",children:"異常"}),e.jsx("span",{className:"rounded-md bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground",children:"注意"})]}),e.jsxs("p",{className:"text-tiny text-muted-foreground",children:[e.jsx("code",{children:"--primary"})," 維持中性近黑、狀態色色相鎖死。切色相時這一欄應該",e.jsx("strong",{children:"幾乎不動"}),"。"]})]})]}),e.jsx("p",{className:"max-w-2xl text-tiny text-muted-foreground",children:"為什麼狀態色不跟著主題微調：往主題偏 15° 會讓淺色模式六組裡有四組的分類色守衛破掉； 只彎淡底層則讓藍紫系的 warning／danger 淡底收斂到 ΔE00 8.8——琥珀和紅都變粉橘。 整體感靠「四種提示共用同一條構成規則」加「坐在帶主題色相的中性表面上」，不靠彎色相。"})]})},i={render:()=>e.jsxs("div",{className:"grid gap-8 md:grid-cols-2",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"字級（只有 7 階，刻意少）"}),x(r.fontSize).map(([n,s])=>e.jsxs("div",{className:"flex items-baseline gap-3 border-b pb-1",children:[e.jsx("span",{className:"w-16 shrink-0 font-mono text-tiny text-muted-foreground",children:n}),e.jsx("span",{style:{fontSize:s.value},children:"資訊密度高的介面靠字重與顏色分層"})]},n))]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-sm font-semibold",children:"間距（4px 基準）"}),x(r.space).map(([n,s])=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"w-12 shrink-0 font-mono text-tiny text-muted-foreground",children:n}),e.jsx("span",{className:"h-3 bg-primary/70",style:{width:s.value},"aria-hidden":!0}),e.jsx("span",{className:"text-tiny text-muted-foreground",children:s.value})]},n))]})]})},m={render:()=>e.jsxs("div",{className:"max-w-lg space-y-3",children:[e.jsxs("p",{className:"text-sm text-muted-foreground",children:["欄位只有兩種語意：",e.jsx("strong",{children:"可編輯"}),"與",e.jsx("strong",{children:"唯讀"}),"。"]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs font-medium",children:"可編輯"}),e.jsx("div",{className:"field-editable rounded-md border px-3 py-2 text-sm",children:"1,500,000"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs font-medium",children:"唯讀／計算值"}),e.jsx("div",{className:"field-readonly rounded-md border px-3 py-2 text-sm",children:"1,380,000"})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"text-xs font-medium",children:"已改動未送出（保留色，不得挪作他用）"}),e.jsx("div",{className:"rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground",children:"1,650,000"})]})]})};var g,u,f;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        命名說的是「這個顏色代表什麼意思」，不是「這是什麼顏色」。因此換色票時只改值、不改任何一行使用它的程式碼。
        用 Storybook 工具列切換淺／深色，同一個 token 名稱會給出兩套值。
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list(tokens.color.light as Record<string, unknown>).map(([k, v]) => <Swatch key={k} name={k} entry={v} />)}
      </div>
    </div>
}`,...(f=(u=t.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var h,N,v;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const pal = (mode: "light" | "dark") => Array.from({
      length: 8
    }, (_, i) => (tokens.chart[mode] as Record<string, Entry>)[\`chart-\${i + 1}\`].value);
    const bg = (mode: "light" | "dark") => \`hsl(\${(tokens.color[mode] as Record<string, Entry>).background.value})\`;
    const fg = (mode: "light" | "dark") => \`hsl(\${(tokens.color[mode] as Record<string, Entry>).foreground.value})\`;
    return <div className="space-y-5">
        <p className="max-w-2xl text-sm text-muted-foreground">
          分類色票與狀態語意<strong>刻意脫鉤</strong>：換一套分類色票，不會讓「紅＝異常」跟著變。
          它也<strong>不跟著色相主題走</strong>——顏色跟資料實體走，同一個項目在所有圖表、所有主題下都是同一色，
          所以切工具列的「色相」不會影響下面這兩排。
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          排列順序是<strong>最遠點插入</strong>的順序，不是色相環：第 1 色錨在藍，之後每一色都是
          「與已選色感知距離最遠」的那一個。因此取 <code>chart-1</code>…<code>chart-k</code>
          對任何 k 都是近似最佳的 k 色子集。
        </p>
        {(["light", "dark"] as const).map(mode => <div key={mode} className="space-y-2 rounded-md border p-3" style={{
        background: bg(mode),
        color: fg(mode)
      }}>
            <p className="text-xs font-semibold">{mode === "light" ? "淺色模式" : "深色模式"}</p>
            <div className="flex gap-1.5">
              {pal(mode).map((c, i) => <div key={i} className="flex-1 space-y-1">
                  <div className="h-10 rounded" style={{
              background: c
            }} aria-hidden />
                  <p className="text-center font-mono text-tiny opacity-70">{i + 1}</p>
                </div>)}
            </div>
          </div>)}
        <p className="max-w-2xl text-tiny text-muted-foreground">
          淺深是<strong>兩組獨立的值，沒有任何一色相同</strong>。共用會把 OKLCH 的 L 鎖在
          <code>[0.49, 0.67]</code>（寬度 0.17），八色必然擠在中明度——而二色覺者失去的正是色相辨別、
          保留的是明度。上一版 8 色裡共用了 6 色，最差一對在綠色盲下 ΔE00 只有 2.6。
        </p>
      </div>;
  }
}`,...(v=(N=o.parameters)==null?void 0:N.docs)==null?void 0:v.source}}};var y,b,j;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="space-y-5">
      <p className="max-w-2xl text-sm text-muted-foreground">
        用工具列的<strong>色相</strong>切換六組主題，<strong>主題</strong>切換淺深——兩者正交。
        主題只影響 17 個 token：5 個主題色（下方）與 12 個帶色調的中性色（背景、邊框、muted…，
        只轉色相、明度與彩度不動）。
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">主題色</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground">
              關鍵動作
            </span>
            <span className="rounded-md bg-brand-subtle px-3 py-1.5 text-sm font-medium text-brand-subtle-foreground">
              被選中的項目
            </span>
          </div>
          <div className="pt-1">
            <input className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-2 ring-ring ring-offset-2 ring-offset-background" defaultValue="聚焦環吃主題色相" readOnly />
          </div>
        </div>
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-xs font-semibold">與主題無關</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              一般控制項
            </span>
            <span className="rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-danger-foreground">異常</span>
            <span className="rounded-md bg-warning px-2.5 py-1 text-xs font-medium text-warning-foreground">注意</span>
          </div>
          <p className="text-tiny text-muted-foreground">
            <code>--primary</code> 維持中性近黑、狀態色色相鎖死。切色相時這一欄應該<strong>幾乎不動</strong>。
          </p>
        </div>
      </div>
      <p className="max-w-2xl text-tiny text-muted-foreground">
        為什麼狀態色不跟著主題微調：往主題偏 15° 會讓淺色模式六組裡有四組的分類色守衛破掉；
        只彎淡底層則讓藍紫系的 warning／danger 淡底收斂到 ΔE00 8.8——琥珀和紅都變粉橘。
        整體感靠「四種提示共用同一條構成規則」加「坐在帶主題色相的中性表面上」，不靠彎色相。
      </p>
    </div>
}`,...(j=(b=c.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var k,w,S;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">字級（只有 7 階，刻意少）</h3>
        {list(tokens.fontSize as Record<string, unknown>).map(([k, v]) => <div key={k} className="flex items-baseline gap-3 border-b pb-1">
            <span className="w-16 shrink-0 font-mono text-tiny text-muted-foreground">{k}</span>
            <span style={{
          fontSize: v.value
        }}>資訊密度高的介面靠字重與顏色分層</span>
          </div>)}
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">間距（4px 基準）</h3>
        {list(tokens.space as Record<string, unknown>).map(([k, v]) => <div key={k} className="flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-tiny text-muted-foreground">{k}</span>
            <span className="h-3 bg-primary/70" style={{
          width: v.value
        }} aria-hidden />
            <span className="text-tiny text-muted-foreground">{v.value}</span>
          </div>)}
      </div>
    </div>
}`,...(S=(w=i.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var E,R,$;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-3">
      <p className="text-sm text-muted-foreground">欄位只有兩種語意：<strong>可編輯</strong>與<strong>唯讀</strong>。</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium">可編輯</p>
          <div className="field-editable rounded-md border px-3 py-2 text-sm">1,500,000</div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium">唯讀／計算值</p>
          <div className="field-readonly rounded-md border px-3 py-2 text-sm">1,380,000</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium">已改動未送出（保留色，不得挪作他用）</p>
        <div className="rounded-md border border-edit bg-edit-bg px-3 py-2 text-sm text-edit-foreground">1,650,000</div>
      </div>
    </div>
}`,...($=(R=m.parameters)==null?void 0:R.docs)==null?void 0:$.source}}};const H=["語意色","圖表色票","色相主題","字級與間距","欄位語意"];export{H as __namedExportsOrder,_ as default,o as 圖表色票,i as 字級與間距,m as 欄位語意,c as 色相主題,t as 語意色};
