// 三段式發布的設定契約：ruleset 要求的必過檢查，一定對得到真的 job 與觸發事件；會讓必過檢查「安靜變綠」的寫法一律擋下。
//
// 為什麼要有這支：GitHub 的必過檢查只認名字。job 改名，PR 就永遠卡在「Expected — waiting」；
// 更糟的是被 if: 跳過的 job 會回報「成功」——staging.yml 少傳一個 consumer: true，套用驗收就不跑、main 照樣放行。
// 另外兩個曾經存在的破口也在這裡盯著：deploy／staging 手動觸發不限分支、publish-tokens 手動非試跑跳過配對閘。
// 權限也在這裡：寫入權只在部署 job，npm 發佈身分只在不跑專案程式的 publish job。
// 這支看不到 GitHub 上的 ruleset 是否真的套用了——那要用 `gh api repos/<repo>/rules/branches/main` 看。
// 規則正本：ARCHITECTURE.md「分支與部署拓樸」。
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { because } from "./lib/guard";

const ROOT = join(__dirname, "..");
const WF_DIR = join(ROOT, ".github/workflows");
const RULE = "ARCHITECTURE.md「分支與部署拓樸」";
const PIPELINE = "_pipeline.yml";
const ACTIONS_APP_ID = 15368;

type Step = { name?: string; run?: string; if?: string; uses?: string; with?: Record<string, unknown>; env?: Record<string, string> };
type Permissions = Record<string, string>;
type Job = { uses?: string; with?: Record<string, unknown>; if?: string; needs?: string | string[]; steps?: Step[]; concurrency?: unknown; permissions?: Permissions; environment?: unknown };
type Workflow = { on: Record<string, { branches?: string[]; paths?: string[]; "paths-ignore"?: string[] } | null>; jobs: Record<string, Job>; concurrency?: { group: string }; permissions?: Permissions };

const workflows: Record<string, Workflow> = Object.fromEntries(
  readdirSync(WF_DIR)
    .filter((f) => f.endsWith(".yml"))
    .map((f) => [f, parse(readFileSync(join(WF_DIR, f), "utf8"))]),
);
const pipeline = workflows[PIPELINE];
const callers = Object.keys(workflows).filter((f) => f !== PIPELINE);
const usesPipeline = (job: Job) => job.uses === `./.github/workflows/${PIPELINE}`;

/** 一支 workflow 產生的檢查名：一般 job＝job id；呼叫可重用 workflow 的 job＝「caller / called」。 */
const checkNames = (file: string) =>
  Object.entries(workflows[file].jobs).flatMap(([id, job]) => (usesPipeline(job) ? Object.keys(pipeline.jobs).map((inner) => `${id} / ${inner}`) : [id]));

const producers = new Map<string, string[]>();
for (const file of callers) for (const name of checkNames(file)) producers.set(name, [...(producers.get(name) ?? []), file]);

type Ruleset = { name: string; conditions: { ref_name: { include: string[] } }; rules: Array<{ type: string; parameters?: any }> };
const rulesets: Array<{ file: string; json: Ruleset; branch: string }> = readdirSync(join(ROOT, ".github/rulesets"))
  .filter((f) => f.endsWith(".json"))
  .map((file) => {
    const json: Ruleset = JSON.parse(readFileSync(join(ROOT, ".github/rulesets", file), "utf8"));
    return { file, json, branch: json.conditions.ref_name.include[0].replace("refs/heads/", "") };
  });
const requiredChecks = (json: Ruleset): Array<{ context: string; integration_id: number }> =>
  json.rules.find((r) => r.type === "required_status_checks")?.parameters.required_status_checks ?? [];

/** 合併進某分支的 PR，來源是哪個分支（ruleset 本身沒有這條規則，由 pr-gate 擋）。 */
const SOURCE_OF: Record<string, string> = { staging: "dev", main: "staging" };

describe("workflow 與 ruleset 的契約", () => {
  it("掃描對象不是空的；舊的 ci.yml 已由三段的呼叫端取代", () => {
    expect(existsSync(join(WF_DIR, "ci.yml")), because("ci.yml 還在", "它與 _pipeline.yml 會是同一套流程的兩份複本，一定漂移", RULE)).toBe(false);
    expect(callers).toEqual(expect.arrayContaining(["preview.yml", "pr-verify.yml", "pr-gate.yml", "staging.yml", "deploy.yml", "publish-tokens.yml"]));
    expect(rulesets.map((r) => r.branch).sort()).toEqual(["dev", "main", "staging"]);
    expect(rulesets.flatMap((r) => requiredChecks(r.json)).length).toBeGreaterThanOrEqual(6);
  });

  it("檢查名在所有 workflow 之間不重複", () => {
    const dupes = [...producers].filter(([, files]) => files.length > 1).map(([name, files]) => `${name}（${files.join("、")}）`);
    expect(dupes, because(`檢查名重複：${dupes.join("；")}`, "必過檢查只認名字，重名時哪一支綠了都算數", RULE)).toEqual([]);
  });

  it("ruleset 要求的每個檢查都對得到 job，而且在對的事件上觸發", () => {
    const problems: string[] = [];
    for (const { file, json, branch } of rulesets) {
      for (const { context, integration_id } of requiredChecks(json)) {
        if (integration_id !== ACTIONS_APP_ID) problems.push(`${file}：${context} 的 integration_id 不是 GitHub Actions（${ACTIONS_APP_ID}）`);
        const files = producers.get(context);
        if (!files) {
          problems.push(`${file}：沒有任何 job 產生「${context}」`);
          continue;
        }
        const on = workflows[files[0]].on;
        if (files[0] === "pr-gate.yml") {
          if (!on.pull_request?.branches?.includes(branch)) problems.push(`${file}：pr-gate.yml 沒有對開到 ${branch} 的 PR 觸發`);
        } else if (!on.push?.branches?.includes(SOURCE_OF[branch])) {
          problems.push(`${file}：「${context}」來自 ${files[0]}，但它不是由 push ${SOURCE_OF[branch]} 觸發——PR 的 head SHA 上不會有這個檢查`);
        }
      }
      const pr = json.rules.find((r) => r.type === "pull_request");
      if (pr) {
        if (JSON.stringify(pr.parameters.allowed_merge_methods) !== JSON.stringify(["merge"])) problems.push(`${file}：只能允許 merge commit`);
        const strict = json.rules.find((r) => r.type === "required_status_checks")?.parameters.strict_required_status_checks_policy;
        if (strict !== false) problems.push(`${file}：strict 必須關（staging 永遠不含 main 的 merge commit，按 Update branch 會破壞流程）`);
      }
      for (const type of ["deletion", "non_fast_forward"]) if (!json.rules.some((r) => r.type === type)) problems.push(`${file}：缺 ${type}`);
    }
    expect(problems, because(problems.join("\n"), "ruleset 要求一個不存在的檢查，PR 會永遠等不到它；在錯的事件上觸發，檢查不會掛在 PR 上", RULE)).toEqual([]);
  });

  it("必過的 job 不會被 if: 安靜跳過（staging 一定跑套用驗收與冒煙）", () => {
    const problems: string[] = [];
    const required = new Set(rulesets.flatMap((r) => requiredChecks(r.json).map((c) => c.context)));
    for (const context of required) {
      const [caller, inner] = context.split(" / ");
      if (!inner) {
        const file = producers.get(context)?.[0];
        if (file && workflows[file].jobs[caller].if) problems.push(`${context} 有 if:——被跳過時會回報成功`);
        continue;
      }
      const file = producers.get(context)?.[0];
      if (!file) continue;
      const callerJob = workflows[file].jobs[caller];
      const innerJob = pipeline.jobs[inner];
      if (inner === "build" && innerJob.if) problems.push("_pipeline.yml 的 build 不准有 if:");
      if (inner === "consumer" && callerJob.with?.consumer !== true) problems.push(`${file} 沒有傳 consumer: true——「${context}」會被跳過而回報成功`);
      if (inner === "smoke" && (callerJob.with?.deploy !== true || callerJob.with?.stage === "preview")) problems.push(`${file} 的「${context}」不會真的跑冒煙`);
    }
    expect(problems, because(problems.join("\n"), "被 if: 跳過的必過檢查回報「成功」，驗收就安靜地不存在了", RULE)).toEqual([]);
  });

  it("每段傳對的輸入", () => {
    const withOf = (file: string) => Object.values(workflows[file].jobs).find(usesPipeline)?.with ?? {};
    expect(withOf("preview.yml")).toMatchObject({ stage: "preview", deploy: true });
    expect(withOf("preview.yml").consumer).not.toBe(true);
    expect(withOf("pr-verify.yml")).toMatchObject({ stage: "pr" });
    expect(withOf("pr-verify.yml").deploy).not.toBe(true);
    expect(withOf("staging.yml")).toMatchObject({ stage: "staging", deploy: true, consumer: true });
    expect(withOf("deploy.yml")).toMatchObject({ stage: "production", deploy: true });
  });

  it("產生必過檢查的 workflow 沒有 paths 過濾（被過濾掉的 workflow 會讓檢查永遠停在等待中）", () => {
    const offenders = ["preview.yml", "pr-gate.yml", "staging.yml"].flatMap((file) =>
      Object.entries(workflows[file].on ?? {})
        .filter(([, cfg]) => cfg && (cfg.paths || cfg["paths-ignore"]))
        .map(([event]) => `${file}：${event}`),
    );
    expect(offenders).toEqual([]);
  });

  it("concurrency 每段一組、不共用；可重用流程裡不設", () => {
    const groups = callers.map((f) => workflows[f].concurrency?.group).filter(Boolean) as string[];
    expect(new Set(groups).size, because(`concurrency group 重複：${groups.join("、")}`, "GitHub 一個 group 只留一個等待中的 run，共用時 dev 的 push 會取消等待中的 main 部署", RULE)).toBe(groups.length);
    for (const file of ["preview.yml", "staging.yml", "deploy.yml"]) expect(workflows[file].concurrency?.group, `${file} 沒有 concurrency`).toBeTruthy();
    expect(pipeline.concurrency).toBeUndefined();
    expect(Object.values(pipeline.jobs).filter((j) => j.concurrency)).toEqual([]);
  });

  it("手動觸發有分支守門：staging.yml 只對 staging、deploy.yml 只對 main", () => {
    for (const [file, branch] of [["staging.yml", "staging"], ["deploy.yml", "main"]] as const) {
      const jobs = workflows[file].jobs;
      const guardId = Object.keys(jobs).find((id) => id.endsWith("ref-guard"));
      expect(guardId, `${file} 沒有 *-ref-guard job`).toBeTruthy();
      expect(jobs[guardId!].steps?.some((s) => s.run?.includes(`refs/heads/${branch}`))).toBe(true);
      const pipelineJob = Object.values(jobs).find(usesPipeline)!;
      expect([pipelineJob.needs].flat(), because(`${file} 的部署不等守門`, "手動觸發可以選任何分支，沒守門就會把未核准的內容部署出去", RULE)).toContain(guardId);
    }
  });

  it("publish-tokens：手動發佈（非試跑）也要過配對閘，而且只能對 main", () => {
    const steps = Object.values(workflows["publish-tokens.yml"].jobs).flatMap((j) => j.steps ?? []);
    const gate = steps.find((s) => s.name?.includes("配對檢查"));
    expect(gate, "找不到配對檢查步驟").toBeTruthy();
    expect(gate!.if).toContain("!inputs.dry_run");
    expect(gate!.if).not.toContain("== false");
    expect(gate!.run).toContain("refs/heads/main");
    expect(gate!.run).toContain("merge-base --is-ancestor");
  });

  it("寫入權只在部署 job：其餘 job 唯讀、簽出不留憑證", () => {
    const problems: string[] = [];
    const isCheckout = (s: Step) => s.uses?.startsWith("actions/checkout@") ?? false;
    // 呼叫端：整份唯讀，只有呼叫 _pipeline.yml 的 job（與 deploy.yml 的 release）拿 contents: write
    for (const file of ["preview.yml", "staging.yml", "deploy.yml"]) {
      const wf = workflows[file];
      if (JSON.stringify(wf.permissions) !== JSON.stringify({ contents: "read" })) problems.push(`${file}：頂層 permissions 必須只有 contents: read`);
      for (const [id, job] of Object.entries(wf.jobs)) {
        const write = job.permissions?.contents === "write";
        const allowed = usesPipeline(job) || (file === "deploy.yml" && id === "release");
        if (write && !allowed) problems.push(`${file} 的 ${id}：不該有 contents: write`);
        if (usesPipeline(job) && !write) problems.push(`${file} 的 ${id}：呼叫部署流程要給 contents: write（_pipeline.yml 的 deploy job 才推得了 gh-pages）`);
      }
    }
    // pr-verify 跑 PR（含 fork）的程式、不部署：整份唯讀，呼叫 job 也不給寫入
    const prVerify = workflows["pr-verify.yml"];
    if (JSON.stringify(prVerify.permissions) !== JSON.stringify({ contents: "read" })) problems.push("pr-verify.yml：頂層 permissions 必須只有 contents: read");
    for (const [id, job] of Object.entries(prVerify.jobs)) {
      if (job.permissions && Object.values(job.permissions).includes("write")) problems.push(`pr-verify.yml 的 ${id}：不該有寫入權`);
    }
    // _pipeline.yml：deploy 繼承呼叫端的 contents: write（被呼叫的流程不能要求比呼叫端更多的權限，寫死 write 會讓唯讀的 pr-verify 起不來）；
    // 其餘 job 自己寫 permissions 收回唯讀，簽出都不留憑證
    for (const [id, job] of Object.entries(pipeline.jobs)) {
      if (id === "deploy") {
        if (job.permissions) problems.push("_pipeline.yml 的 deploy：不寫 permissions，繼承呼叫端那個 job 給的 contents: write");
        const runs = (job.steps ?? []).map((s) => s.run ?? "").join("\n");
        if (/\bnpm\b|\bnpx\b|\bnode\b/.test(runs)) problems.push("_pipeline.yml 的 deploy：持有寫入權的 job 不跑 npm／npx／node——只下載產物、執行部署腳本");
        if (!(job.steps ?? []).some((s) => s.uses?.startsWith("actions/download-artifact@"))) problems.push("_pipeline.yml 的 deploy：要從 build 取回產物，不在這裡建置");
      } else {
        if (!job.permissions) {
          problems.push(`_pipeline.yml 的 ${id}：沒寫 permissions——會整份繼承呼叫端的寫入權`);
          continue;
        }
        const write = Object.entries(job.permissions).filter(([, v]) => v === "write").map(([k]) => k);
        if (write.length) problems.push(`_pipeline.yml 的 ${id}：不該有寫入權（${write.join("、")}）`);
        for (const s of (job.steps ?? []).filter(isCheckout)) {
          if (s.with?.["persist-credentials"] !== false) problems.push(`_pipeline.yml 的 ${id}：actions/checkout 要設 persist-credentials: false`);
        }
      }
    }
    // release 只承認 main 歷史上的 tag：已存在的 tag 若不是核准流程打的，不跳過、不發 Release
    const releaseRuns = (workflows["deploy.yml"].jobs.release?.steps ?? []).map((s) => s.run ?? "");
    for (const keyword of ["git tag -a", "gh release create"]) {
      const step = releaseRuns.find((r) => r.includes(keyword));
      if (!step?.includes("merge-base --is-ancestor")) problems.push(`deploy.yml 的 release：「${keyword}」那一步要先確認既有 tag 在 main 的歷史上（merge-base --is-ancestor）`);
    }
    // deploy 不是必過檢查：冒煙要在 deploy 沒成功時明確紅，不能被 if: 跳過而回報成功
    const smoke = pipeline.jobs.smoke;
    if (![smoke?.needs].flat().includes("deploy")) problems.push("_pipeline.yml 的 smoke：needs 要包含 deploy");
    if (!(smoke?.steps ?? []).some((s) => Object.values(s.env ?? {}).some((v) => v.includes("needs.deploy.result")) && s.run?.includes("exit 1"))) {
      problems.push("_pipeline.yml 的 smoke：要有一步在 needs.deploy.result 不是 success 時 exit 1");
    }
    expect(problems, because(problems.join("\n"), "dev 合進來的程式與現抓的第三方套件都在 build／consumer 裡執行；手上有寫入權杖，就能在核准前改正式站根目錄、/r/ 與 tag", RULE)).toEqual([]);
  });

  it("publish-tokens：發佈身分只在不跑專案程式的 publish job，試跑不碰它", () => {
    const wf = workflows["publish-tokens.yml"];
    const problems: string[] = [];
    if (wf.permissions?.["id-token"]) problems.push("頂層 permissions 不能有 id-token");
    const withId = Object.entries(wf.jobs).filter(([, j]) => j.permissions?.["id-token"] === "write");
    if (withId.length !== 1) problems.push(`id-token: write 必須只在一個 job（現在 ${withId.length} 個）`);
    for (const [id, job] of withId) {
      const steps = job.steps ?? [];
      if (steps.some((s) => s.uses?.startsWith("actions/checkout@"))) problems.push(`${id}：持有發佈身分的 job 不簽出程式碼`);
      const runs = steps.map((s) => s.run ?? "").join("\n");
      if (/npm (ci|test|run|install(?! -g npm@\d))|\bnpx\b|\bnode\b/.test(runs)) problems.push(`${id}：持有發佈身分的 job 不跑專案腳本與相依安裝（只送出 build 打好的 tarball）`);
      if (/npm@latest/.test(runs)) problems.push(`${id}：npm 要釘版號，不裝 latest`);
      if (!job.if?.includes("!inputs.dry_run") || !job.if?.includes("github.event_name == 'push'")) problems.push(`${id}：只在 tag 觸發或手動非試跑時執行`);
      if (!job.environment) problems.push(`${id}：要掛 environment，讓部署規則與 npm trusted publisher 綁得到核准流程`);
    }
    expect(problems, because(problems.join("\n"), "整個 job 都拿得到發佈身分時，專案程式、測試與相依套件的安裝腳本都能用它發佈；試跑還會跳過配對閘", RULE)).toEqual([]);
  });

  it("_pipeline.yml 的部署目錄＝部署腳本的 STAGE_DIRS", () => {
    const stageDirs = /STAGE_DIRS="([^"]+)"/.exec(readFileSync(join(ROOT, "scripts/deploy-gh-pages.sh"), "utf8"))![1].split(/\s+/).sort();
    const setup = pipeline.jobs.build.steps!.find((s) => s.name?.startsWith("段設定"))!.run!;
    const dests = [...setup.matchAll(/DEST=([^;\s]*);/g)].map((m) => m[1]).filter((d) => d && d !== ".").sort();
    expect(dests, because(`部署目錄 ${dests.join(" ")} ≠ STAGE_DIRS ${stageDirs.join(" ")}`, "根目錄部署只保留 STAGE_DIRS 列的目錄；多一段沒列進去，每次 main 部署都會把它刪掉", "scripts/deploy-gh-pages.sh 檔頭")).toEqual(stageDirs);
  });
});
