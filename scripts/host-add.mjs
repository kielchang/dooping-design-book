// 真取用端路徑：本機 registry 伺服器＋`npx shadcn add`——驗證 CLI 的行為與 host-sync 的產物一致。
//
//   node scripts/host-add.mjs                 # 裝 apps/host-v4/dooping.install.json 的整個安裝集
//   node scripts/host-add.mjs data-table      # 只裝指定 item
//
// 之後跑 `npm run host:sync && git diff --exit-code -- apps/host-v4/src`：兩條路的產物必須逐位元組相同。
//
// 為什麼不在 CI 跑：要網路、CLI 版本會漂移、一定會 npm install。CI 用決定性的 host-sync；
// 這支留給人與 agent，以及「shadcn CLI 升版時」手動確認一次（結果記在 apps/host-v4/LEDGER.md 的工具欄）。
//
// 伺服器與 CLI 在同一個行程：CLI 必須用非同步 spawn，否則 spawnSync 會卡住事件迴圈，
// 伺服器永遠回不了 CLI 的請求。
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = "registry-local";
const STATIC = join(ROOT, OUT);
// 釘版：升版走 PR，PR 必附「host-add 後 host-sync 零差異」的證據
const SHADCN = "shadcn@4.21.0";

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : JSON.parse(readFileSync(join(ROOT, "apps/host-v4/dooping.install.json"), "utf8")).items;

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/r\//, "");
  const file = normalize(join(STATIC, path));
  if (!file.startsWith(STATIC) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "content-type": "application/json" });
  res.end(readFileSync(file));
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}`;

const run = (cmd, args, env = {}) =>
  new Promise((ok, fail) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...env },
    });
    child.on("close", (code) => (code === 0 ? ok() : fail(new Error(`${cmd} ${args[0]} 結束碼 ${code}`))));
  });

try {
  // 產一份 base 指向本機伺服器的 registry——registryDependencies 才會回到這台伺服器，而不是正式站
  await run("node", ["scripts/build-registry.mjs"], { REGISTRY_BASE: base, REGISTRY_OUT: OUT });
  await run("npx", ["--yes", SHADCN, "add", "--yes", "--overwrite", "--cwd", "apps/host-v4", ...names.map((n) => `${base}/r/${n}.json`)]);
  console.log("\n[host-add] 完成。接著：npm run host:sync && git diff --exit-code -- apps/host-v4/src");
} catch (e) {
  console.error(`[host-add] ${e.message}`);
  process.exitCode = 1;
} finally {
  server.close();
}
