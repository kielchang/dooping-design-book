// repo 根的取用端／貢獻端文件 → 文件站副本（build 前同步）
//
// 與 sync-adr.mjs 同一個理由：正本放在 repo 根，因為它服務的不只是文件站讀者
// （AGENTS.md 給「只拿到 GitHub repo」的取用端與 AI；ARCHITECTURE.md 給
// clone 下來就要理解系統的貢獻者）。文件站需要它，就在 build 前同步一份——
// 單一來源，兩個出口，不用兩邊手動維護。
//
// 兩個去向刻意不同：
//   AGENTS.md       → book/static/AGENTS.md（原樣複製。它是給機器抓的**靜態檔**，
//                     部署後就是站上的 /AGENTS.md，llms.txt 會指向它）
//   ARCHITECTURE.md → book/docs/7-governance/10-architecture.md（注入 front matter
//                     進側欄，站內可搜尋。正本不寫 front matter，GitHub 上才乾淨）
//
// 正本裡**只能用絕對 URL**（GitHub blob 或文件站網址）：相對 markdown 連結
// 在副本的位置會解析失敗，onBrokenMarkdownLinks: "throw" 會當場把 build 弄紅——
// 這是刻意留著的守衛，不要繞。
import { copyFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");

// AGENTS.md → static/（原樣）
const agents = join(ROOT, "AGENTS.md");
if (existsSync(agents)) {
  copyFileSync(agents, join(HERE, "../static/AGENTS.md"));
  console.log("[sync-root-docs] AGENTS.md → book/static/");
} else {
  console.warn("[sync-root-docs] 找不到 AGENTS.md，略過");
}

// ARCHITECTURE.md → 治理章（front matter 注入手法同 sync-adr.mjs）
const arch = join(ROOT, "ARCHITECTURE.md");
if (existsSync(arch)) {
  const body = readFileSync(arch, "utf8");
  const title = (body.match(/^#\s+(.+)$/m) ?? [, "系統架構"])[1];
  const front = `---\ntitle: "${title.replace(/"/g, "'")}"\nsidebar_position: 10\n---\n\n`;
  writeFileSync(
    join(HERE, "../docs/7-governance/10-architecture.md"),
    front + body.replace(/^#\s+.+\n/, ""),
    "utf8",
  );
  console.log("[sync-root-docs] ARCHITECTURE.md → book/docs/7-governance/10-architecture.md");
} else {
  console.warn("[sync-root-docs] 找不到 ARCHITECTURE.md，略過");
}
