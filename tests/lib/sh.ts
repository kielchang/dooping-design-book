// 守衛實跑 shell 腳本時共用：找到能用的 sh，並把它的工具目錄放進子行程 PATH。
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";

/**
 * Windows 上用 Git for Windows 附的 sh（不是 WSL 的 bash.exe）；CI 用系統 sh。
 * 腳本用到的 mktemp 等指令在 Git 的 usr/bin，從 PowerShell／cmd 跑時 PATH 通常沒有它——
 * 所以一併回傳那個目錄，子行程前置到 PATH，不靠呼叫端的 shell。
 */
export function findSh(): { sh: string; toolsDir?: string } {
  if (process.platform !== "win32") return { sh: "sh" };
  const exec = execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim();
  const gitRoot = exec.replace(/[\\/](mingw64|mingw32|clangarm64)[\\/]libexec[\\/]git-core$/i, "");
  const toolsDir = join(gitRoot, "usr/bin");
  for (const candidate of [join(toolsDir, "sh.exe"), join(gitRoot, "bin/sh.exe")]) if (existsSync(candidate)) return { sh: candidate, toolsDir };
  throw new Error(`找不到 Git for Windows 的 sh（git --exec-path＝${exec}）`);
}

/** 子行程環境：有 toolsDir 就前置到 PATH。Windows 的鍵名大小寫不定（Path／PATH），沿用原本那個，避免兩個並存。 */
export function shEnv(toolsDir: string | undefined, extra: Record<string, string> = {}): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, ...extra };
  if (toolsDir) {
    const key = Object.keys(env).find((k) => k.toUpperCase() === "PATH") ?? "PATH";
    env[key] = [toolsDir, env[key]].filter(Boolean).join(delimiter);
  }
  return env;
}
