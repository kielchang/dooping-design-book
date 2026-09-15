// 本機 registry 伺服器——取用端路徑（真的 `npx shadcn add <URL>`）要有一個 URL 可以打。
//
// host-add.mjs（手動確認 CLI 與 host-sync 產物一致）與 verify-consumer.mjs（套用驗收）共用這一份：
//   - /r/<item>.json：以本機 base 重建的 registry（registryDependencies 才會回到這台伺服器，而不是正式站）
//   - /npm/@dooping%2ftokens 與 /npm/-/<tarball>：npm 相容的最小端點，供 `@dooping:registry=<base>/npm/`
//     讓 shadcn 安裝 item 宣告的 `@dooping/tokens@^X` 時，裝到的是 `npm pack` 出來的受測版本——
//     staging 在 npm 發佈之前，npm 上可能還沒有這一版。
//
// 伺服器與 CLI 在同一個行程：CLI 必須用非同步 spawn（run），否則 spawnSync 會卡住事件迴圈，
// 伺服器永遠回不了 CLI 的請求。
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
// 釘版：升版走 PR，PR 必附「host-add 後 host-sync 零差異」與 verify:consumer 通過的證據
export const SHADCN = "shadcn@4.21.0";

/** 非同步 spawn；結束碼非 0 就 reject。Windows 上 npm／npx 是 .cmd，要走 shell。 */
export function run(cmd, args, { cwd = ROOT, env = {}, timeoutMs = 0, stdio = "inherit" } = {}) {
  return new Promise((ok, fail) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio,
      shell: process.platform === "win32",
      env: { ...process.env, ...env },
    });
    const timer = timeoutMs
      ? setTimeout(() => {
          child.kill();
          fail(new Error(`${cmd} ${args[0] ?? ""} 超過 ${Math.round(timeoutMs / 1000)} 秒`));
        }, timeoutMs)
      : null;
    child.on("error", (e) => {
      if (timer) clearTimeout(timer);
      fail(e);
    });
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      code === 0 ? ok() : fail(new Error(`${cmd} ${args.slice(0, 2).join(" ")} 結束碼 ${code}`));
    });
  });
}

/** 以指定 base 重建一份 registry 到 ROOT 底下的 out 目錄（REGISTRY_OUT 是相對 ROOT 的路徑）。 */
export const buildRegistry = ({ base, out }) =>
  run("node", ["scripts/build-registry.mjs"], { env: { REGISTRY_BASE: base, REGISTRY_OUT: out } });

/** npm 套件的 dist 欄位：integrity（sha512）與 shasum（sha1）。 */
function tarballDist(file) {
  const bytes = readFileSync(file);
  return {
    integrity: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
    shasum: createHash("sha1").update(bytes).digest("hex"),
  };
}

/**
 * 起伺服器。回傳 { base, close }；base 形如 http://127.0.0.1:<port>，registry 在 base/r/。
 * 伺服器先起、registry 後建（base 要有 port 才建得出來），所以 registryDir 是每次請求時才讀。
 *
 * @param {{ registryDir: string, npmPackage?: { name: string, version: string, tarball: string, manifest?: object } }} options
 */
export async function startRegistryServer({ registryDir, npmPackage }) {
  const staticDir = normalize(registryDir);
  const requests = [];
  let base = "";
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    requests.push(path);
    const send = (status, body, type = "application/json") => {
      res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
      res.end(body);
    };
    if (path.startsWith("/r/")) {
      const file = normalize(join(staticDir, path.slice(3)));
      if (!file.startsWith(staticDir) || !existsSync(file) || statSync(file).isDirectory()) return send(404, "");
      return send(200, readFileSync(file));
    }
    if (npmPackage && path.startsWith("/npm/")) {
      const rest = path.slice(5);
      const tarName = basename(npmPackage.tarball);
      if (rest === `-/${tarName}`) return send(200, readFileSync(npmPackage.tarball), "application/octet-stream");
      if (rest === npmPackage.name) {
        const { version } = npmPackage;
        const packument = {
          name: npmPackage.name,
          "dist-tags": { latest: version },
          versions: {
            [version]: {
              ...(npmPackage.manifest ?? {}),
              name: npmPackage.name,
              version,
              dist: { tarball: `${base}/npm/-/${tarName}`, ...tarballDist(npmPackage.tarball) },
            },
          },
        };
        return send(200, JSON.stringify(packument));
      }
    }
    return send(404, "");
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  base = `http://127.0.0.1:${server.address().port}`;
  return { base, requests, close: () => new Promise((ok) => server.close(ok)) };
}
