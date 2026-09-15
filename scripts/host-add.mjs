// 真取用端路徑：本機 registry 伺服器＋`npx shadcn add`——驗證 CLI 的行為與 host-sync 的產物一致。
//
//   node scripts/host-add.mjs                 # 裝 apps/host-v4/dooping.install.json 的整個安裝集
//   node scripts/host-add.mjs data-table      # 只裝指定 item
//
// 之後跑 `npm run host:sync && git diff --exit-code -- apps/host-v4/src`：兩條路的產物必須逐位元組相同。
//
// 為什麼不在 CI 跑：CI 用決定性的 host-sync；「從乾淨專案用真的 CLI 裝一次」由套用驗收
// （scripts/verify-consumer.mjs，在 staging 跑）負責。這支留給人與 agent，以及「shadcn CLI 升版時」
// 手動確認一次（結果記在 apps/host-v4/LEDGER.md 的工具欄）。
//
// 伺服器、registry 重建與 CLI 版本釘選共用 scripts/lib/serve-registry.mjs。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SHADCN, buildRegistry, run, startRegistryServer } from "./lib/serve-registry.mjs";

const OUT = "registry-local";

// 「--」開頭的參數原樣交給 CLI。`--dry-run` 預覽會動到哪些檔、`--diff=<檔案>` 看單檔差異——
// 這是取用端「上游改了什麼、我抄走的哪幾個檔會變」的第一手視角；預覽時不帶 --overwrite。
const argv = process.argv.slice(2);
const passthrough = argv.filter((a) => a.startsWith("--"));
const picked = argv.filter((a) => !a.startsWith("--"));
const names = picked.length
  ? picked
  : JSON.parse(readFileSync(join(ROOT, "apps/host-v4/dooping.install.json"), "utf8")).items;
const preview = passthrough.some((a) => a === "--dry-run" || a.startsWith("--diff") || a.startsWith("--view"));

const server = await startRegistryServer({ registryDir: join(ROOT, OUT) });
const { base } = server;

try {
  // 產一份 base 指向本機伺服器的 registry——registryDependencies 才會回到這台伺服器，而不是正式站
  await buildRegistry({ base, out: OUT });
  await run("npx", ["--yes", SHADCN, "add", "--yes", ...(preview ? [] : ["--overwrite"]), ...passthrough, "--cwd", "apps/host-v4", ...names.map((n) => `${base}/r/${n}.json`)]);
  console.log("\n[host-add] 完成。接著：npm run host:sync && git diff --exit-code -- apps/host-v4/src");
} catch (e) {
  console.error(`[host-add] ${e.message}`);
  process.exitCode = 1;
} finally {
  await server.close();
}
