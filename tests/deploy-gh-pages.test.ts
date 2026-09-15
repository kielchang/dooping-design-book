// 部署腳本的邊界：gh-pages 上同時住著正式站（根目錄）、dev 預覽站（preview/）、候選版（staging/）。
// 任何一段部署都不准清掉別段；目標寫錯（例如 "r"）要當場拒絕；push 被拒時要重抓重套再推。
// 用臨時的 bare repo 實跑 scripts/deploy-gh-pages.sh——這支腳本寫的是別人會參照的正式站，不能只靠讀。
// 規則正本：scripts/deploy-gh-pages.sh 檔頭；段目錄清單 STAGE_DIRS。
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { because } from "./lib/guard";

const ROOT = join(__dirname, "..");
const SCRIPT = join(ROOT, "scripts/deploy-gh-pages.sh").replace(/\\/g, "/");
const RULE = "scripts/deploy-gh-pages.sh 檔頭";

/** Windows 上用 Git for Windows 附的 sh（不是 WSL 的 bash.exe）；CI 用系統 sh。 */
function findSh(): string {
  if (process.platform !== "win32") return "sh";
  const exec = execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim();
  const gitRoot = exec.replace(/[\\/](mingw64|mingw32|clangarm64)[\\/]libexec[\\/]git-core$/i, "");
  for (const candidate of [join(gitRoot, "usr/bin/sh.exe"), join(gitRoot, "bin/sh.exe")]) if (existsSync(candidate)) return candidate;
  throw new Error(`找不到 Git for Windows 的 sh（git --exec-path＝${exec}）`);
}
const SH = findSh();

const git = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const write = (path: string, content: string) => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content);
};

let dir = "";
let remote = "";
let work = "";

function deploy(src: string, dest: string, env: Record<string, string> = {}) {
  try {
    const stdout = execFileSync(SH, [SCRIPT, src.replace(/\\/g, "/"), dest, `deploy(${dest})`], {
      cwd: work,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, DEPLOY_RETRY_DELAY: "0", ...env },
    });
    return { status: 0, output: stdout };
  } catch (e) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { status: err.status, output: `${err.stdout}${err.stderr}` };
  }
}

/** 遠端 gh-pages 上的檔案清單與某個檔的內容 */
const tree = () => git(remote, "ls-tree", "-r", "--name-only", "gh-pages").split("\n").filter(Boolean).sort();
const show = (path: string) => git(remote, "show", `gh-pages:${path}`);

function build(name: string, files: Record<string, string>) {
  const out = join(dir, name);
  for (const [path, content] of Object.entries(files)) write(join(out, path), content);
  return out;
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "deploy-gh-pages-"));
  remote = join(dir, "remote.git");
  work = join(dir, "work");
  git(dir, "init", "-q", "--bare", remote);
  // 種子：三段都已經部署過一次
  const seed = join(dir, "seed");
  mkdirSync(seed);
  git(seed, "init", "-q");
  git(seed, "checkout", "-q", "-b", "gh-pages");
  for (const [path, content] of Object.entries({
    "index.html": "正式站-舊", "r/button.json": "{}", "preview/index.html": "預覽-舊", "staging/index.html": "候選-舊",
  })) write(join(seed, path), content);
  git(seed, "add", "-A");
  git(seed, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "seed");
  git(seed, "push", "-q", remote, "gh-pages");
  // 部署腳本在一個有 origin 的工作 repo 裡跑（CI 就是 checkout 下來的 repo）
  mkdirSync(work);
  git(work, "init", "-q");
  git(work, "config", "user.name", "t");
  git(work, "config", "user.email", "t@t");
  git(work, "remote", "add", "origin", remote);
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("scripts/deploy-gh-pages.sh", () => {
  it("正式站部署清掉根目錄舊檔，但 preview/ 與 staging/ 原封不動", () => {
    const r = deploy(build("root", { "index.html": "正式站-新", "storybook/index.html": "sb" }), ".");
    expect(r.status, r.output).toBe(0);
    const files = tree();
    expect(files, because("根目錄部署刪掉了段目錄", "preview／staging 不屬於 main 的部署範圍", RULE)).toEqual(
      expect.arrayContaining(["preview/index.html", "staging/index.html"]),
    );
    expect(files).not.toContain("r/button.json");
    expect(show("index.html")).toBe("正式站-新");
    expect(show("staging/index.html")).toBe("候選-舊");
  }, 60000);

  it("段部署只重建自己的目錄，根目錄與其他段不動", () => {
    const r = deploy(build("stage", { "index.html": "候選-新", "r/button.json": "{\"v\":1}" }), "staging");
    expect(r.status, r.output).toBe(0);
    expect(show("staging/index.html")).toBe("候選-新");
    expect(show("staging/r/button.json")).toBe("{\"v\":1}");
    expect(show("index.html")).toBe("正式站-舊");
    expect(show("r/button.json")).toBe("{}");
    expect(show("preview/index.html")).toBe("預覽-舊");
  }, 60000);

  it("目標不在清單上、或來源不像建置產物 → 拒絕，遠端不變", () => {
    const before = tree();
    const bad = deploy(build("x", { "index.html": "x" }), "r");
    expect(bad.status, because("部署目標 r 被接受了", "寫錯目標會蓋掉正式站的資料夾", RULE)).toBe(1);
    expect(bad.output).toContain("部署目標只能是");
    const noIndex = deploy(build("empty", { "readme.txt": "x" }), "preview");
    expect(noIndex.status).toBe(1);
    expect(tree()).toEqual(before);
  }, 60000);

  it("push 被拒一次：重抓重套再推，成功且沒有蓋掉別段", () => {
    // 遠端第一次拒收（模擬別段剛好推過、或暫時性錯誤），第二次放行
    write(join(remote, "hooks/pre-receive"), "#!/bin/sh\nif [ ! -f \"$GIT_DIR/rejected-once\" ]; then touch \"$GIT_DIR/rejected-once\"; echo 'reject once' >&2; exit 1; fi\nexit 0\n");
    const r = deploy(build("preview", { "index.html": "預覽-新" }), "preview");
    expect(r.status, r.output).toBe(0);
    expect(r.output, because("沒有走到重試", "push 被拒時要重抓、重套、再推", RULE)).toContain("push 被拒");
    expect(show("preview/index.html")).toBe("預覽-新");
    expect(show("staging/index.html")).toBe("候選-舊");
    expect(show("index.html")).toBe("正式站-舊");
  }, 60000);
});
