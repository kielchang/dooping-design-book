// 本機腳本共用的路徑與參數防護：靜態伺服器、host-sync、build-registry、Windows 下經 shell 執行的指令都用這裡。
// 這些腳本只在維護者電腦與 CI 跑，但吃的輸入（網址、registry 的 target、環境變數、命令列參數）不全是自己寫的。
import { isAbsolute, relative, resolve } from "node:path";

/** child 是不是 parent 本身或底下的路徑（兩者都先 resolve）。 */
export function isInside(child, parent) {
  const rel = relative(resolve(parent), resolve(child));
  return rel === "" || (!/^\.\.(?:[\\/]|$)/.test(rel) && !isAbsolute(rel));
}

/** 解不開的 % 跳脫（例如 `/%E0%A4%A`）回傳 null，不丟例外——伺服器的請求處理不能因為一個壞網址整個停掉。 */
export function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return null;
  }
}

/**
 * `REGISTRY_OUT` 這類「會被整個刪掉重建」的輸出目錄：只接受 repo 底下的相對路徑，而且不能是 repo 根目錄本身。
 * 空字串、絕對路徑、`..` 一律丟錯——寫錯一個環境變數不能刪掉整個 repo。
 */
export function outputDirUnder(root, value, name = "輸出目錄") {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${name} 不能是空的`);
  if (isAbsolute(value) || /^[a-zA-Z]:/.test(value)) throw new Error(`${name} 要用 repo 底下的相對路徑：${value}`);
  const dir = resolve(root, value);
  if (!isInside(dir, root) || resolve(root) === dir) throw new Error(`${name} 必須在 repo 底下、而且不是 repo 根目錄：${value}`);
  return dir;
}

/**
 * Windows 上經 shell（cmd）執行時的參數：Node 會把參數直接串起來，含空白或 cmd 特殊字元的要自己加引號。
 * 含 `"`、`%`、`!` 的在 cmd 裡加引號也擋不住展開，直接丟錯。其他平台原樣回傳。
 */
export function shellArgs(args, platform = process.platform) {
  if (platform !== "win32") return args;
  return args.map((arg) => {
    const s = String(arg);
    if (/["%!\r\n]/.test(s)) throw new Error(`參數含 cmd 無法安全傳遞的字元：${s}`);
    return /[\s&|<>^()]/.test(s) ? `"${s}"` : s;
  });
}
