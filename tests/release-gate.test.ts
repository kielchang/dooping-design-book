// 發版閘（dev → staging → main）的規則。git 那一層由 CI 實跑；這裡用合成狀態讓每條規則各轉紅一次，
// 閘才不會「全綠但其實什麼都沒擋」。另有一條實跑 CLI：抓不到 main 時，release 必須失敗、bump-guard 必須放行。
// 規則正本：book/docs/7-governance/01-versioning.mdx「三段式發布」。
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  approvalChecklist,
  compareVersions,
  evaluateBumpGuard,
  evaluatePr,
  evaluateRelease,
  tokensContentKey,
  type GateState,
  type PrState,
} from "../scripts/release-gate.mjs";

const LF = "\n";
const ROOT = join(__dirname, "..");

/** 仿 CHANGELOG.md 的結構：前言有一個非發版的 H2，之後每節以「空行、---、空行」分隔。 */
const doc = (...sections: Array<[string, string]>) =>
  ["# CHANGELOG", "", "前言。", "", "## 兩條散佈通道", "", "說明。", "", "---", "",
    ...sections.flatMap(([h, body]) => [h, "", body, "", "---", ""])].join(LF);

const MAIN_LOG = doc(["## 2026-09-11（純文件進版，版號未動）", "- 前一次進版"], ["## v0.13.0 · 2026-09-11", "- 舊的一版"]);
const tokens = (version: string, value = 0) => ({ version, key: tokensContentKey({ meta: { version }, color: { a: value } }) });

const base = (over: Partial<GateState> = {}): GateState => ({
  mainVersion: "0.13.0",
  headVersion: "0.13.0",
  watchedChanged: [],
  mainTokens: tokens("0.7.0"),
  headTokens: tokens("0.7.0"),
  tagExists: false,
  changelog: doc(["## 2026-09-20（三段式發布）", "- 這一版"], ["## 2026-09-11（純文件進版，版號未動）", "- 前一次進版"]),
  mainChangelog: MAIN_LOG,
  ...over,
});

const CHECKED = ["## 核准清單", "", "- [x] 甲", "- [x] 乙", "- [X] 丙", "- [x] 丁", "- [x] 戊"].join(LF);
const pr = (over: Partial<PrState> = {}): PrState => ({
  ...base(),
  baseRef: "staging",
  headRef: "dev",
  headRepo: "kielchang/dooping-design-book",
  repository: "kielchang/dooping-design-book",
  prBody: "",
  treeEqual: true,
  ...over,
});

const hit = (failures: string[], word: string) => failures.some((f) => f.includes(word));

describe("版號與 token 內容", () => {
  it("版號照數字比，不照字串比", () => {
    expect(compareVersions("0.10.0", "0.9.9")).toBeGreaterThan(0);
    expect(compareVersions("0.13.0", "0.13.0")).toBe(0);
    expect(() => compareVersions("0.13", "0.13.0")).toThrow();
  });
  it("token 內容比對不看 meta、不看鍵的順序", () => {
    expect(tokensContentKey({ meta: { version: "1" }, b: 1, a: { y: 2, x: 1 } })).toBe(tokensContentKey({ a: { x: 1, y: 2 }, b: 1, meta: { version: "2" } }));
    expect(tokensContentKey({ a: 1 })).not.toBe(tokensContentKey({ a: 2 }));
  });
});

describe("bump-guard（dev push，行為照舊）", () => {
  it("元件變了、版號沒動 → 紅；bump 了 → 綠", () => {
    expect(hit(evaluateBumpGuard(base({ watchedChanged: ["packages/react/src/ui/button.tsx"] })), "規範版號還停在")).toBe(true);
    expect(evaluateBumpGuard(base({ watchedChanged: ["packages/react/src/ui/button.tsx"], headVersion: "0.13.1" }))).toEqual([]);
  });
  it("token 內容變了、tokens 版號沒動 → 紅", () => {
    expect(hit(evaluateBumpGuard(base({ headTokens: tokens("0.7.0", 1) })), "tokens 版號還停在")).toBe(true);
  });
});

describe("release（staging 的候選版）", () => {
  it("版號沒動、日期標題（全形括號）、有內容、不重複 → 綠", () => {
    expect(evaluateRelease(base())).toEqual([]);
  });

  it("還有「## 未發佈」→ 紅", () => {
    expect(hit(evaluateRelease(base({ changelog: doc(["## 未發佈（`dev`）", "- 累積中"]) })), "未發佈")).toBe(true);
  });

  it("版號沒動卻用版號標題、或日期後面黏著數字 → 紅", () => {
    expect(hit(evaluateRelease(base({ changelog: doc(["## v0.13.0 · 2026-09-20", "- 這一版"]) })), "應該是「## YYYY-MM-DD")).toBe(true);
    expect(hit(evaluateRelease(base({ changelog: doc(["## 2026-09-201", "- 這一版"]) })), "找不到任何發版標題")).toBe(true);
  });

  it("元件變了但版號沒有大於 main → 紅", () => {
    expect(hit(evaluateRelease(base({ watchedChanged: ["templates/dooping-check.mjs"] })), "沒有大於 main")).toBe(true);
  });

  it("bump 了：標題要是 ## v<版號>；tag 已存在 → 紅", () => {
    const bumped = { headVersion: "0.14.0", watchedChanged: ["packages/react/src/ui/button.tsx"] };
    expect(hit(evaluateRelease(base(bumped)), "## v0.14.0 · 日期")).toBe(true);
    const good = base({ ...bumped, changelog: doc(["## v0.14.0 · 2026-09-20", "- 新元件"]) });
    expect(evaluateRelease(good)).toEqual([]);
    expect(hit(evaluateRelease({ ...good, tagExists: true }), "tag 已經存在")).toBe(true);
  });

  it("版號倒退 → 紅", () => {
    expect(hit(evaluateRelease(base({ headVersion: "0.12.9" })), "比 main 的")).toBe(true);
  });

  it("標題已經在 main 的 CHANGELOG → 紅（同一天兩次要用括號區分）", () => {
    expect(hit(evaluateRelease(base({ changelog: MAIN_LOG })), "已經在 main 的 CHANGELOG")).toBe(true);
  });

  it("節是空的、或節尾缺分隔線吃進下一節 → 紅", () => {
    expect(hit(evaluateRelease(base({ changelog: doc(["## 2026-09-20（空的）", ""]) })), "底下沒有內容")).toBe(true);
    const leaking = ["# CHANGELOG", "", "## 2026-09-20（漏分隔線）", "", "- 這一版", "", "## v0.13.0 · 2026-09-11", "- 舊的", "", "---", ""].join(LF);
    expect(hit(evaluateRelease(base({ changelog: leaking })), "節尾缺分隔線")).toBe(true);
  });

  it("token 內容變了、tokens 版號沒有大於 main → 紅", () => {
    expect(hit(evaluateRelease(base({ headTokens: tokens("0.7.0", 1) })), "tokens 版號 0.7.0 沒有大於")).toBe(true);
  });
});

describe("pr（PR → staging／main）", () => {
  it("只允許 staging ← dev、main ← staging", () => {
    expect(evaluatePr(pr())).toEqual([]);
    expect(evaluatePr(pr({ baseRef: "main", headRef: "staging", prBody: CHECKED }))).toEqual([]);
    expect(hit(evaluatePr(pr({ baseRef: "main", headRef: "dev", prBody: CHECKED })), "不允許 main ← dev")).toBe(true);
    expect(hit(evaluatePr(pr({ headRef: "feat/x" })), "不允許 staging ← feat/x")).toBe(true);
    expect(hit(evaluatePr(pr({ baseRef: "dev", headRef: "feat/x" })), "不允許")).toBe(true);
  });

  it("來自其他 repo、或合併後的樹不等於來源 → 紅", () => {
    expect(hit(evaluatePr(pr({ headRepo: "someone/fork" })), "其他 repo")).toBe(true);
    expect(hit(evaluatePr(pr({ treeEqual: false })), "不等於來源分支")).toBe(true);
  });

  it("main 的 PR：核准清單沒有、太短、沒勾完 → 紅；勾完 → 綠", () => {
    const toMain = { baseRef: "main", headRef: "staging" };
    expect(hit(evaluatePr(pr({ ...toMain, prBody: "沒有清單" })), "找不到「核准清單」")).toBe(true);
    expect(hit(evaluatePr(pr({ ...toMain, prBody: ["### 核准清單", "- [x] 甲", "- [x] 乙", "- [x] 丙"].join(LF) })), "只有 3 項")).toBe(true);
    const open = CHECKED.replace("- [x] 丁", "- [ ] 丁");
    const failures = evaluatePr(pr({ ...toMain, prBody: open }));
    expect(hit(failures, "還有 1 項沒勾：丁")).toBe(true);
  });

  it("清單只數「核准清單」標題底下到下一個標題之前", () => {
    const body = ["## 自查", "- [ ] 別區的", "", "## 核准清單", "- [x] 甲", "- [ ] 乙", "", "## 備註", "- [ ] 也不算"].join(LF);
    expect(approvalChecklist(body)).toEqual([{ checked: true, text: "甲" }, { checked: false, text: "乙" }]);
    expect(approvalChecklist("")).toBeNull();
  });
});

describe("CLI：抓不到 origin/main", () => {
  it("release 失敗、bump-guard 放行", () => {
    const dir = mkdtempSync(join(tmpdir(), "release-gate-"));
    try {
      execFileSync("git", ["init", "-q"], { cwd: dir });
      writeFileSync(join(dir, "package.json"), JSON.stringify({ version: "0.13.0" }));
      writeFileSync(join(dir, "CHANGELOG.md"), MAIN_LOG);
      const run = (mode: string) => {
        try {
          execFileSync(process.execPath, [join(ROOT, "scripts/release-gate.mjs"), mode], { cwd: dir, encoding: "utf8", stdio: "pipe" });
          return { status: 0, stderr: "" };
        } catch (e) {
          const err = e as { status: number; stderr: string };
          return { status: err.status, stderr: String(err.stderr) };
        }
      };
      const release = run("release");
      expect(release.status).toBe(1);
      expect(release.stderr).toContain("抓不到 origin/main");
      expect(run("bump-guard").status).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 20000);
});
