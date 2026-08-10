// Play function 專用：對 React 受控輸入框設值。
//
// 為什麼不用 userEvent.type／clear：user-event 的文字插入在部分 Chromium 環境
// （實測 Electron 42／Chrome 148 的內嵌瀏覽器）會經由元素實例上的 value descriptor
// 寫值——那條路同時更新 React 的 value tracker，於是接著派發的 input 事件被 React
// 的變更偵測判定「值沒變」而吞掉 onChange，受控元件的狀態永遠不會更新，
// play 在無頭 CI 綠、真瀏覽器紅。preview 評估期間任何人用瀏覽器開 Storybook
// 都會看到假性失敗，所以打字一律走這裡的 prototype setter：繞過 tracker、
// 讓變更偵測成立，行為在所有環境一致。
//
// 語意差異：這是「一次設整段值」不是逐字打字。要驗中間狀態就分次呼叫，
// 每次給完整的目標值（見 confirm-dialog 的硬確認 story）。
export function setInputValue(el: HTMLElement, value: string): void {
  if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) {
    throw new Error("setInputValue 只接受 input 或 textarea 元素");
  }
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (!setter) throw new Error("取不到 prototype 的 value setter");
  el.focus();
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
