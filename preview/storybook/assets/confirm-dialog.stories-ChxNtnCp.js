import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as u}from"./index-UiW3gZKV.js";import{within as s,userEvent as c,expect as i,waitFor as B,fn as P}from"./index-DH-M5T-F.js";import{B as y}from"./button-PlLiai67.js";import{D as $,b as z,c as G,d as J,e as K,f as M}from"./dialog-BGzFPbaD.js";import{I as Q}from"./input-vSeq6R7n.js";import{L as U}from"./label-DmCCWqIB.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-rhYpeUg2.js";import"./utils-pm6Xa0Qd.js";import"./index-C-xWP-pl.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./x-DHctwwaT.js";import"./createLucideIcon-BcR0bl2m.js";function x({open:t,onOpenChange:a,title:n,description:o,children:r,confirmText:l="確定",cancelText:O="取消",destructive:F=!1,loading:p=!1,disabled:L=!1,onConfirm:V,typeToConfirm:d}){const[v,R]=u.useState(""),h=u.useId();u.useEffect(()=>{t||R("")},[t]);const A=d?v.trim()!==d.expected:!1,_=L||p||A,D=g=>{p&&!g||a(g)};return e.jsx($,{open:t,onOpenChange:D,children:e.jsxs(z,{children:[e.jsxs(G,{children:[e.jsx(J,{children:n}),o?e.jsx(K,{children:o}):null]}),r,d?e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(U,{htmlFor:h,children:d.label??`請輸入「${d.expected}」以確認`}),e.jsx(Q,{id:h,value:v,onChange:g=>R(g.target.value),placeholder:d.placeholder,disabled:p,autoComplete:"off"})]}):null,e.jsxs(M,{children:[e.jsx(y,{variant:"outline",onClick:()=>D(!1),disabled:p,children:O}),e.jsx(y,{variant:F?"destructive":"default",onClick:V,disabled:_,"aria-busy":p||void 0,children:l})]})]})})}x.__docgenInfo={description:`確認對話框。破壞性操作的固定寫法：標題講動作、描述講後果、
確認鈕的字是動詞（「作廢」「刪除」），不是「確定」二字打發。`,methods:[],displayName:"ConfirmDialog",props:{open:{required:!0,tsType:{name:"boolean"},description:"受控開關——搭配 `useDialogState` 或宿主自己的狀態。"},onOpenChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"額外內容（影響範圍清單、警示框…），插在描述與按鈕之間。"},confirmText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"確定"',computed:!1}},cancelText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"取消"',computed:!1}},destructive:{required:!1,tsType:{name:"boolean"},description:"破壞性確認：確認鈕改走 `destructive`。這是**控制項語意**（這顆按下去會刪東西），\n與狀態語意 `danger` 分家——同 Button 的原則。",defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:"操作進行中：確認鈕 `aria-busy` 且全部出口（確認、取消、Esc、點遮罩、右上關閉）\n一律鎖住。進行中關掉對話框會讓使用者以為取消了——實際上沒有。",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:`確認後**不會自動關閉**：成功才關、失敗留在原地顯示錯誤，時機由宿主決定。
刻意不吃 Promise——async 編排與錯誤呈現是應用層的事，元件不吞錯誤。`},typeToConfirm:{required:!1,tsType:{name:"signature",type:"object",raw:"{ expected: string; label?: string; placeholder?: string }",signature:{properties:[{key:"expected",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"placeholder",value:{name:"string",required:!1}}]}},description:`硬確認：輸入指定字串才解鎖確認鈕。「把危險操作變成刻意的決定」
（硬鎖定模式）在對話框層的落地——用在影響半徑大、無法還原的操作。`}}};function I(t=null){const[a,n]=u.useState(t),o=u.useCallback(r=>{n(l=>l===r?null:r)},[]);return[a,o]}const be={title:"元件/浮層/確認對話框 ConfirmDialog"},m=P();function W(){const[t,a]=I();return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{onClick:()=>a("submit"),children:"送出本期批次"}),e.jsx(x,{open:t==="submit",onOpenChange:n=>!n&&a(null),title:"送出本期批次？",description:"送出後本期進入鎖定狀態，內容不再接受修改。",confirmText:"送出",onConfirm:m})]})}const f={render:()=>e.jsx(W,{}),play:async({canvasElement:t})=>{m.mockClear();const a=t.ownerDocument,n=s(a.body);await c.click(s(t).getByRole("button",{name:"送出本期批次"}));const o=await n.findByRole("dialog");await i(o).toHaveAccessibleName("送出本期批次？"),await c.click(s(o).getByRole("button",{name:"送出"})),await i(m).toHaveBeenCalledTimes(1),await i(n.getByRole("dialog")).toBeInTheDocument(),await c.keyboard("{Escape}"),await B(()=>i(n.queryByRole("dialog")).toBeNull())}};function X(){const[t,a]=I();return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{variant:"destructive",onClick:()=>a("void"),children:"作廢 R-2403"}),e.jsx(x,{open:t==="void",onOpenChange:n=>!n&&a(null),title:"作廢 R-2403？",description:"作廢會釋放已保留的配額並寫入異動紀錄，且無法還原。",confirmText:"作廢",destructive:!0,typeToConfirm:{expected:"R-2403"},onConfirm:m})]})}const b={render:()=>e.jsx(X,{}),play:async({canvasElement:t})=>{const a=t.ownerDocument,n=s(a.body);await c.click(s(t).getByRole("button",{name:"作廢 R-2403"}));const o=await n.findByRole("dialog"),r=s(o).getByRole("button",{name:"作廢"});await i(r).toBeDisabled();const l=s(o).getByRole("textbox");await c.type(l,"R-240"),await i(r).toBeDisabled(),await c.type(l,"3"),await B(()=>i(r).toBeEnabled()),await c.keyboard("{Escape}"),await B(()=>i(n.queryByRole("dialog")).toBeNull())}};function Y(){const[t,a]=u.useState(!0);return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{onClick:()=>a(!0),children:"重新開啟"}),e.jsx(x,{open:t,onOpenChange:a,title:"正在送出…",description:"送出進行中。此時所有出口都會鎖住，避免使用者以為已取消。",confirmText:"送出",loading:!0,onConfirm:m})]})}const w={render:()=>e.jsx(Y,{}),play:async({canvasElement:t})=>{m.mockClear();const a=t.ownerDocument,n=s(a.body),o=await n.findByRole("dialog"),r=s(o).getByRole("button",{name:"送出"});await i(r).toBeDisabled(),await i(r).toHaveAttribute("aria-busy","true"),await i(s(o).getByRole("button",{name:"取消"})).toBeDisabled(),await c.keyboard("{Escape}"),await i(n.getByRole("dialog")).toBeInTheDocument()}};var E,C,j;f.parameters={...f.parameters,docs:{...(E=f.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <BasicDemo />,
  // 契約：確認鈕觸發 onConfirm 但**不自動關閉**——成功才關、失敗留在原地，時機由宿主決定。
  play: async ({
    canvasElement
  }) => {
    confirmSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", {
      name: "送出本期批次"
    }));
    const dialog = await body.findByRole("dialog");
    await expect(dialog).toHaveAccessibleName("送出本期批次？");
    await userEvent.click(within(dialog).getByRole("button", {
      name: "送出"
    }));
    await expect(confirmSpy).toHaveBeenCalledTimes(1);
    await expect(body.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  }
}`,...(j=(C=f.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var k,T,q;b.parameters={...b.parameters,docs:{...(k=b.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <HardConfirmDemo />,
  // 硬確認契約：輸入完全相符前，確認鈕鎖住——把危險操作變成刻意的決定（硬鎖定模式）。
  play: async ({
    canvasElement
  }) => {
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    await userEvent.click(within(canvasElement).getByRole("button", {
      name: "作廢 R-2403"
    }));
    const dialog = await body.findByRole("dialog");
    const confirm = within(dialog).getByRole("button", {
      name: "作廢"
    });
    await expect(confirm).toBeDisabled();
    const input = within(dialog).getByRole("textbox");
    await userEvent.type(input, "R-240");
    await expect(confirm).toBeDisabled();
    await userEvent.type(input, "3");
    await waitFor(() => expect(confirm).toBeEnabled());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  }
}`,...(q=(T=b.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var N,S,H;w.parameters={...w.parameters,docs:{...(N=w.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <LoadingDemo />,
  // 載入中契約：確認鈕鎖住（disabled ＋ pointer-events-none，連點打不進來）、
  // Esc 也關不掉——操作進行中沒有出口。
  play: async ({
    canvasElement
  }) => {
    confirmSpy.mockClear();
    const doc = canvasElement.ownerDocument;
    const body = within(doc.body);
    const dialog = await body.findByRole("dialog");
    const confirm = within(dialog).getByRole("button", {
      name: "送出"
    });
    await expect(confirm).toBeDisabled();
    await expect(confirm).toHaveAttribute("aria-busy", "true");
    await expect(within(dialog).getByRole("button", {
      name: "取消"
    })).toBeDisabled();
    await userEvent.keyboard("{Escape}");
    await expect(body.getByRole("dialog")).toBeInTheDocument();
  }
}`,...(H=(S=w.parameters)==null?void 0:S.docs)==null?void 0:H.source}}};const we=["一般確認","破壞性與硬確認","載入中"];export{we as __namedExportsOrder,be as default,f as 一般確認,b as 破壞性與硬確認,w as 載入中};
