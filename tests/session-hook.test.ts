// 本機 SessionStart 掛勾的邊界：只在 session 啟動時跑；origin 只把舊 repo 名稱校正成正式位址，別的 remote 不動。
// 掛勾會執行當下 checkout 的安裝與建置腳本，清空對話、壓縮、恢復時再跑，就會在中途切換的分支上自動執行程式；
// origin 一律改寫的話，fork 或鏡像的 push 會跑到公開 repo。改寫那一段從腳本裡取出來，在臨時 repo 實跑。
// 規則正本：.claude/hooks/session-start.sh 檔頭。
import { describe, it, expect, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { because, toLines } from "./lib/guard";
import { findSh, shEnv } from "./lib/sh";

const ROOT = join(__dirname, "..");
const RULE = ".claude/hooks/session-start.sh 檔頭";
const CANONICAL = "https://github.com/kielchang/dooping-design-book.git";
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

const { sh: SH, toolsDir } = findSh();
const tmp = mkdtempSync(join(tmpdir(), "session-hook-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

/** 腳本裡「origin 正規化」那一段：從 CANONICAL= 到對應的 esac。 */
function originSnippet(): string {
  const lines = toLines(read(".claude/hooks/session-start.sh"));
  const start = lines.findIndex((l) => l.startsWith("CANONICAL="));
  const end = lines.findIndex((l, i) => i > start && l.trim() === "esac");
  if (start < 0 || end < 0) throw new Error("session-start.sh 找不到 origin 正規化段（CANONICAL= … esac）");
  return lines.slice(start, end + 1).join("\n") + "\n";
}

/** 在臨時 repo 設好 origin（或不設），跑那一段，回傳之後的 origin。 */
function runWithOrigin(url: string | null, n: number): string {
  const repo = join(tmp, `repo-${n}`);
  execFileSync("git", ["init", "-q", repo]);
  if (url) execFileSync("git", ["-C", repo, "remote", "add", "origin", url]);
  const script = join(tmp, "origin.sh");
  writeFileSync(script, originSnippet());
  execFileSync(SH, [script.replace(/\\/g, "/")], { cwd: repo, env: shEnv(toolsDir), stdio: ["ignore", "pipe", "pipe"] });
  try {
    return execFileSync("git", ["-C", repo, "config", "--get", "remote.origin.url"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

describe("SessionStart 掛勾", () => {
  it("只在 session 啟動時跑（matcher: startup）", () => {
    const entries: Array<{ matcher?: string }> = JSON.parse(read(".claude/settings.json")).hooks?.SessionStart ?? [];
    expect(entries.length, "settings.json 沒有 SessionStart——守衛空轉").toBeGreaterThan(0);
    const bad = entries.filter((e) => e.matcher !== "startup").map((e) => e.matcher ?? "（沒有 matcher）");
    expect(bad, because(`SessionStart 的 matcher 要是 "startup"（現在：${bad.join("、")}）`, "掛勾會執行當下 checkout 的安裝與建置腳本；清空、壓縮、恢復時再跑，就會在中途切換的未審分支上自動執行程式", RULE)).toEqual([]);
  });

  it("origin 只校正舊名，其他 remote 不動", () => {
    const cases: Array<[string | null, string]> = [
      ["https://github.com/kielchang/doping-design-book.git", CANONICAL],
      ["git@github.com:kielchang/doping-design-book.git", CANONICAL],
      [CANONICAL, CANONICAL],
      ["https://github.com/someone/dooping-design-book-mirror.git", "https://github.com/someone/dooping-design-book-mirror.git"],
      ["https://github.com/someone/design-book-fork.git", "https://github.com/someone/design-book-fork.git"],
      ["https://github.com/someone/doping-design-book.git", "https://github.com/someone/doping-design-book.git"],
      [null, ""],
    ];
    const wrong = cases
      .map(([url, want], i) => ({ url, want, got: runWithOrigin(url, i) }))
      .filter((c) => c.got !== c.want)
      .map((c) => `${c.url ?? "（沒有 origin）"} → ${c.got || "（沒有）"}，應為 ${c.want || "（沒有）"}`);
    expect(wrong, because(wrong.join("\n"), "只有舊名 kielchang/doping-design-book 要校正；fork、鏡像或別的名字的副本被改成正式位址，之後的 push 會跑到公開 repo", RULE)).toEqual([]);
  });
});
