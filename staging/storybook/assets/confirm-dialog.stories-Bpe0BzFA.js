import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-UiW3gZKV.js";import{within as s,userEvent as u,expect as i,waitFor as B,fn as $}from"./index-DH-M5T-F.js";import{B as y}from"./button-DyXVXefs.js";import{D as z,b as G,c as J,d as K,e as M,f as Q}from"./dialog-C82NnX_8.js";import{I as U}from"./input-D31gR-xu.js";import{L as W}from"./label-DCW2ivba.js";import{s as C}from"./play-B_tfD0rJ.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-VXoYh6zd.js";import"./index-BOrUEQ0c.js";import"./utils-CMl-9ImW.js";import"./index-C-xWP-pl.js";import"./Combination-Gi-zDQIY.js";import"./index-BJ3p15Kd.js";import"./index-3b7XovMV.js";import"./index-BA8NevWa.js";import"./x-DHctwwaT.js";import"./createLucideIcon-BcR0bl2m.js";function x({open:t,onOpenChange:a,title:n,description:o,children:r,confirmText:c="確定",cancelText:V="取消",destructive:F=!1,loading:p=!1,disabled:L=!1,onConfirm:A,typeToConfirm:l}){const[R,v]=d.useState(""),h=d.useId();d.useEffect(()=>{t||v("")},[t]);const _=l?R.trim()!==l.expected:!1,P=L||p||_,D=g=>{p&&!g||a(g)};return e.jsx(z,{open:t,onOpenChange:D,children:e.jsxs(G,{children:[e.jsxs(J,{children:[e.jsx(K,{children:n}),o?e.jsx(M,{children:o}):null]}),r,l?e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(W,{htmlFor:h,children:l.label??`請輸入「${l.expected}」以確認`}),e.jsx(U,{id:h,value:R,onChange:g=>v(g.target.value),placeholder:l.placeholder,disabled:p,autoComplete:"off"})]}):null,e.jsxs(Q,{children:[e.jsx(y,{variant:"outline",onClick:()=>D(!1),disabled:p,children:V}),e.jsx(y,{variant:F?"destructive":"default",onClick:A,disabled:P,"aria-busy":p||void 0,children:c})]})]})})}x.__docgenInfo={description:`確認對話框。破壞性操作的固定寫法：標題講動作、描述講後果、
確認鈕的字是動詞（「作廢」「刪除」），不是「確定」二字打發。`,methods:[],displayName:"ConfirmDialog",props:{open:{required:!0,tsType:{name:"boolean"},description:"受控開關——搭配 `useDialogState` 或宿主自己的狀態。"},onOpenChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"額外內容（影響範圍清單、警示框…），插在描述與按鈕之間。"},confirmText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"確定"',computed:!1}},cancelText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"取消"',computed:!1}},destructive:{required:!1,tsType:{name:"boolean"},description:"破壞性確認：確認鈕改走 `destructive`。這是**控制項語意**（這顆按下去會刪東西），\n與狀態語意 `danger` 分家——同 Button 的原則。",defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:"操作進行中：確認鈕 `aria-busy` 且全部出口（確認、取消、Esc、點遮罩、右上關閉）\n一律鎖住。進行中關掉對話框會讓使用者以為取消了——實際上沒有。",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:`確認後**不會自動關閉**：成功才關、失敗留在原地顯示錯誤，時機由宿主決定。
刻意不吃 Promise——async 編排與錯誤呈現是應用層的事，元件不吞錯誤。`},typeToConfirm:{required:!1,tsType:{name:"signature",type:"object",raw:"{ expected: string; label?: string; placeholder?: string }",signature:{properties:[{key:"expected",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"placeholder",value:{name:"string",required:!1}}]}},description:`硬確認：輸入指定字串才解鎖確認鈕。「把危險操作變成刻意的決定」
（硬鎖定模式）在對話框層的落地——用在影響半徑大、無法還原的操作。`}}};function O(t=null){const[a,n]=d.useState(t),o=d.useCallback(r=>{n(c=>c===r?null:r)},[]);return[a,o]}const xe={title:"元件/浮層/確認對話框 ConfirmDialog"},m=$();function X(){const[t,a]=O();return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{onClick:()=>a("submit"),children:"送出本期批次"}),e.jsx(x,{open:t==="submit",onOpenChange:n=>!n&&a(null),title:"送出本期批次？",description:"送出後本期進入鎖定狀態，內容不再接受修改。",confirmText:"送出",onConfirm:m})]})}const f={render:()=>e.jsx(X,{}),play:async({canvasElement:t})=>{m.mockClear();const a=t.ownerDocument,n=s(a.body);await u.click(s(t).getByRole("button",{name:"送出本期批次"}));const o=await n.findByRole("dialog");await i(o).toHaveAccessibleName("送出本期批次？"),await u.click(s(o).getByRole("button",{name:"送出"})),await i(m).toHaveBeenCalledTimes(1),await i(n.getByRole("dialog")).toBeInTheDocument(),await u.keyboard("{Escape}"),await B(()=>i(n.queryByRole("dialog")).toBeNull())}};function Y(){const[t,a]=O();return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{variant:"destructive",onClick:()=>a("void"),children:"作廢 R-2403"}),e.jsx(x,{open:t==="void",onOpenChange:n=>!n&&a(null),title:"作廢 R-2403？",description:"作廢會釋放已保留的配額並寫入異動紀錄，且無法還原。",confirmText:"作廢",destructive:!0,typeToConfirm:{expected:"R-2403"},onConfirm:m})]})}const b={render:()=>e.jsx(Y,{}),play:async({canvasElement:t})=>{const a=t.ownerDocument,n=s(a.body);await u.click(s(t).getByRole("button",{name:"作廢 R-2403"}));const o=await n.findByRole("dialog"),r=s(o).getByRole("button",{name:"作廢"});await i(r).toBeDisabled();const c=s(o).getByRole("textbox");C(c,"R-240"),await i(r).toBeDisabled(),C(c,"R-2403"),await B(()=>i(r).toBeEnabled()),await u.keyboard("{Escape}"),await B(()=>i(n.queryByRole("dialog")).toBeNull())}};function Z(){const[t,a]=d.useState(!0);return e.jsxs("div",{className:"py-8",children:[e.jsx(y,{onClick:()=>a(!0),children:"重新開啟"}),e.jsx(x,{open:t,onOpenChange:a,title:"正在送出…",description:"送出進行中。此時所有出口都會鎖住，避免使用者以為已取消。",confirmText:"送出",loading:!0,onConfirm:m})]})}const w={render:()=>e.jsx(Z,{}),play:async({canvasElement:t})=>{m.mockClear();const a=t.ownerDocument,n=s(a.body),o=await n.findByRole("dialog"),r=s(o).getByRole("button",{name:"送出"});await i(r).toBeDisabled(),await i(r).toHaveAttribute("aria-busy","true"),await i(s(o).getByRole("button",{name:"取消"})).toBeDisabled(),await u.keyboard("{Escape}"),await i(n.getByRole("dialog")).toBeInTheDocument()}};var E,j,k;f.parameters={...f.parameters,docs:{...(E=f.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(k=(j=f.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var T,q,N;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
    // setInputValue 是整段設值：第二次給完整目標值，不是接續打字
    setInputValue(input, "R-240");
    await expect(confirm).toBeDisabled();
    setInputValue(input, "R-2403");
    await waitFor(() => expect(confirm).toBeEnabled());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  }
}`,...(N=(q=b.parameters)==null?void 0:q.docs)==null?void 0:N.source}}};var I,S,H;w.parameters={...w.parameters,docs:{...(I=w.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(H=(S=w.parameters)==null?void 0:S.docs)==null?void 0:H.source}}};const Be=["一般確認","破壞性與硬確認","載入中"];export{Be as __namedExportsOrder,xe as default,f as 一般確認,b as 破壞性與硬確認,w as 載入中};
