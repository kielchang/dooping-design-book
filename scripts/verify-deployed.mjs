// 部署後冒煙：推上 gh-pages 之後，對真的網址確認「上線的就是剛驗過的這一版」。
//
//   DEPLOY_URL=https://kielchang.github.io/dooping-design-book/staging/ EXPECT_STAGE=staging EXPECT_SHA=<sha> npm run verify:deployed
//   DEPLOY_URL=https://kielchang.github.io/dooping-design-book/ EXPECT_STAGE=production npm run verify:deployed   # 不帶 sha：只驗現況
//   node scripts/verify-deployed.mjs --stamp book/build        # 部署前：寫 deploy.json（段、sha、版號、run）
//
// 1. 等上線：輪詢 deploy.json?sha=<sha>（繞過 Pages CDN 約 10 分鐘的快取）直到 sha 對上，最多 SMOKE_TIMEOUT_S 秒（預設 600）
// 2. registry：/r/index.json 的 version＝package.json、tokensVersion＝宣告、homepage＝本段網址、item 數＝repo；
//    每個 item 200、指紋（現算）＝repo 的 meta.hash、registryDependencies 都指向**本段**網址且 200
//    （預覽站以前的 registry 相依指向正式站——那種 registry 裝不到候選版，這一條就是在擋它）
// 3. 站台：非正式站 index.html 有 noindex 與該段橫幅；正式站兩者都沒有；Storybook（staging 另加宿主）200
// 4. dooping-check：用取用端工具的 HTTP 路徑讀這一段的 registry 建 lock，closureHash 要等於 repo
//
// 規則正本：book/docs/7-governance/01-versioning.mdx「三段式發布」。
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createLockEntries, readRegistry } from "../templates/dooping-check.mjs";
import { itemHash } from "./lib/fingerprint.mjs";

const ROOT = process.cwd();
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const STAGES = ["preview", "staging", "production"];
const BANNER_TEXT = { preview: "dev 預覽站", staging: "候選版 v" };

const version = readJson("package.json").version;
const tokensVersion = readJson("packages/react/package.json").dependencies["@dooping/tokens"].replace(/^[\^~>=<\s]+/, "");

if (process.argv[2] === "--stamp") {
  const dir = process.argv[3];
  const stage = process.env.BOOK_STAGE ?? process.env.EXPECT_STAGE;
  if (!dir || !STAGES.includes(stage)) {
    console.error("用法：BOOK_STAGE=<preview|staging|production> node scripts/verify-deployed.mjs --stamp <建置目錄>");
    process.exit(2);
  }
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  const stamp = {
    stage,
    sha: process.env.GITHUB_SHA ?? "local",
    version,
    tokensVersion,
    run: GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null,
    builtAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, "deploy.json"), `${JSON.stringify(stamp, null, 2)}\n`);
  console.log(`[verify-deployed] deploy.json：${stage} ${stamp.sha}`);
  process.exit(0);
}

const DEPLOY_URL = (process.env.DEPLOY_URL ?? "").replace(/\/?$/, "/");
const STAGE = process.env.EXPECT_STAGE;
const SHA = process.env.EXPECT_SHA ?? "";
const TIMEOUT_S = Number(process.env.SMOKE_TIMEOUT_S ?? 600);
const bust = `sha=${encodeURIComponent(SHA || String(Date.now()))}`;

const failures = [];
const fail = (msg) => failures.push(msg);

async function get(url, { tries = 3 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { cache: "no-store", redirect: "follow" });
      return res;
    } catch (e) {
      last = e;
      await sleep(2000 * (i + 1));
    }
  }
  throw new Error(`連不上 ${url}：${last?.message}`);
}

async function waitForDeploy() {
  if (!SHA) return null;
  const deadline = Date.now() + TIMEOUT_S * 1000;
  let seen = null;
  while (Date.now() < deadline) {
    const res = await get(`${DEPLOY_URL}deploy.json?${bust}`).catch(() => null);
    if (res?.ok) {
      seen = await res.json().catch(() => null);
      if (seen?.sha === SHA) return seen;
    }
    await sleep(15_000);
  }
  throw new Error(`等了 ${TIMEOUT_S} 秒，${DEPLOY_URL}deploy.json 的 sha 仍是 ${seen?.sha ?? "讀不到"}（期望 ${SHA}）——Pages 還沒上線或部署沒成功`);
}

async function registryChecks() {
  const base = DEPLOY_URL.replace(/\/$/, "");
  const res = await get(`${DEPLOY_URL}r/index.json?${bust}`);
  if (!res.ok) return fail(`r/index.json HTTP ${res.status}`);
  const index = await res.json();
  const local = readJson("registry/index.json");
  if (index.version !== version) fail(`r/index.json 的 version＝${index.version}，repo 是 ${version}`);
  if (index.tokensVersion !== tokensVersion) fail(`r/index.json 的 tokensVersion＝${index.tokensVersion}，宣告是 ${tokensVersion}`);
  if (index.homepage !== base) fail(`r/index.json 的 homepage＝${index.homepage}，應該是這一段的網址 ${base}`);
  if ((index.items ?? []).length !== (local.items ?? []).length) fail(`r/index.json 有 ${index.items?.length} 個 item，repo 是 ${local.items?.length}`);
  if ((index.items ?? []).length < 20) fail("r/index.json 的 item 少於 20——冒煙不能空轉");

  const localMeta = new Map((local.items ?? []).map((i) => [i.name, i.meta]));
  const depUrls = new Set();
  const items = index.items ?? [];
  for (let i = 0; i < items.length; i += 8) {
    await Promise.all(
      items.slice(i, i + 8).map(async ({ name, url }) => {
        if (!url?.startsWith(`${base}/r/`)) fail(`${name} 的 url 不在這一段（${url}）`);
        const r = await get(`${base}/r/${name}.json?${bust}`);
        if (!r.ok) return fail(`${name}.json HTTP ${r.status}`);
        const item = await r.json();
        if (item.version !== version) fail(`${name}.json 的 version＝${item.version}`);
        if (itemHash(item) !== localMeta.get(name)?.hash) fail(`${name}.json 的內容指紋與 repo 不同——上線的不是這一版`);
        for (const dep of item.registryDependencies ?? []) {
          if (!dep.startsWith(`${base}/r/`)) fail(`${name} 的相依 ${dep} 沒有指向這一段——從這裡裝會混到別段的版本`);
          depUrls.add(dep);
        }
      }),
    );
  }
  for (const dep of depUrls) {
    const r = await get(`${dep}?${bust}`);
    if (!r.ok) fail(`相依 ${dep} HTTP ${r.status}`);
  }
  return index;
}

async function siteChecks() {
  const res = await get(`${DEPLOY_URL}?${bust}`);
  if (!res.ok) return fail(`首頁 HTTP ${res.status}`);
  const html = await res.text();
  const noindex = (html.match(/<meta\b[^>]*>/gi) ?? []).some((tag) => /name="robots"/i.test(tag) && /noindex/i.test(tag));
  if (STAGE === "production") {
    if (noindex) fail("正式站首頁帶了 noindex");
    for (const text of Object.values(BANNER_TEXT)) if (html.includes(text)) fail(`正式站首頁出現橫幅「${text}」`);
  } else {
    if (!noindex) fail(`${STAGE} 首頁沒有 noindex`);
    if (!html.includes(BANNER_TEXT[STAGE])) fail(`${STAGE} 首頁沒有橫幅「${BANNER_TEXT[STAGE]}…」`);
  }
  const extras = ["storybook/", ...(STAGE === "production" ? [] : ["host/"])];
  for (const path of extras) {
    const r = await get(`${DEPLOY_URL}${path}?${bust}`);
    if (!r.ok) fail(`${path} HTTP ${r.status}`);
  }
}

async function doopingCheck(index) {
  const registry = `${DEPLOY_URL}r`;
  const names = ["data-table", "page-header", "dooping-check"].filter((n) => (index.items ?? []).some((i) => i.name === n));
  const remoteIndex = await readRegistry(registry, "index", ROOT);
  const entries = await createLockEntries(registry, names, ROOT, remoteIndex);
  const local = new Map((readJson("registry/index.json").items ?? []).map((i) => [i.name, i.meta?.closureHash]));
  for (const name of names) {
    if (entries[name]?.closureHash !== local.get(name)) fail(`dooping-check 讀到的 ${name} closureHash＝${entries[name]?.closureHash}，repo 是 ${local.get(name)}`);
    if (Object.keys(entries[name]?.files ?? {}).length === 0) fail(`dooping-check 沒有讀到 ${name} 的任何檔`);
  }
  return names.length;
}

async function main() {
  if (!DEPLOY_URL.startsWith("http") || !STAGES.includes(STAGE)) {
    console.error("需要 DEPLOY_URL（http…）與 EXPECT_STAGE（preview／staging／production）");
    process.exit(2);
  }
  const stamp = await waitForDeploy();
  if (stamp) {
    if (stamp.stage !== STAGE) fail(`deploy.json 的 stage＝${stamp.stage}，期望 ${STAGE}`);
    if (stamp.version !== version) fail(`deploy.json 的 version＝${stamp.version}，repo 是 ${version}`);
  }
  const index = await registryChecks();
  await siteChecks();
  const checked = index ? await doopingCheck(index).catch((e) => (fail(`dooping-check 讀不了這一段的 registry：${e.message}`), 0)) : 0;

  if (failures.length) {
    console.error(`\n✗ 部署後冒煙不通過（${DEPLOY_URL}，${failures.length} 項）：\n${failures.map((f) => `  ${f}`).join("\n")}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `✓ 部署後冒煙通過：${DEPLOY_URL}（${STAGE}${SHA ? `，sha ${SHA.slice(0, 7)}` : ""}）——${index.items.length} 個 item、相依都在這一段、dooping-check 讀 ${checked} 個 item 的指紋一致`,
  );
}

main().catch((e) => {
  console.error(`[verify-deployed] ${e.message}`);
  process.exitCode = 1;
});
