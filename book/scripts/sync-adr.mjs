// docs/adr/*.md（repo 內的正本） → book/docs/7-adr/*.md（文件站副本）
//
// ADR 的正本放在 repo 根的 docs/adr，因為它服務的是「改這個工具箱的人」，
// 不是只服務讀文件站的人。文件站需要它，就在 build 前同步一份過來——
// 單一來源，兩個出口，不用兩邊手動維護。
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../docs/adr");
const DEST = join(HERE, "../docs/7-adr");

if (!existsSync(SRC)) {
  console.warn("[sync-adr] 找不到 docs/adr，略過");
  process.exit(0);
}
for (const f of existsSync(DEST) ? readdirSync(DEST) : []) {
  if (f.endsWith(".md")) rmSync(join(DEST, f));
}
mkdirSync(DEST, { recursive: true });

const files = readdirSync(SRC).filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();
files.forEach((f, i) => {
  const body = readFileSync(join(SRC, f), "utf8");
  const title = (body.match(/^#\s+(.+)$/m) ?? [, f])[1];
  const front = `---\ntitle: "${title.replace(/"/g, "'")}"\nsidebar_position: ${i + 1}\n---\n\n`;
  writeFileSync(join(DEST, f), front + body.replace(/^#\s+.+\n/, ""), "utf8");
});
console.log(`[sync-adr] 同步 ${files.length} 則 ADR → book/docs/7-adr/`);
