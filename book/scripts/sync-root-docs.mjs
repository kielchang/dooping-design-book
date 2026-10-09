// repo 根的取用契約 → 文件站副本（build 前同步）
//
// AGENTS.md 的正本放在 repo 根，因為它服務的不只是文件站讀者
// （也給「只拿到 GitHub repo」的取用端與 AI）。文件站需要它，就在 build 前同步一份——
// 單一來源，兩個出口，不用兩邊手動維護。
//
//   AGENTS.md → book/static/AGENTS.md（原樣複製。它是給機器抓的**靜態檔**，
//               部署後就是站上的 /AGENTS.md，llms.txt 會指向它）
//
// ARCHITECTURE.md 不同步：它是給貢獻者的地圖，只放在 GitHub 上，文件站以絕對網址連過去。
import { copyFileSync, existsSync } from "node:fs";
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
