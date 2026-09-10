// registry 散佈時的匯入路徑改寫：相對路徑 → 目標專案的 `@/` 別名。
//
// 兩個消費者共用這一份：scripts/build-registry.mjs（產生 registry JSON）與
// scripts/host-sync.mjs（把示範資料同步進內部試裝宿主）。同一套改寫規則只能有一份——
// 兩份規則一漂移，宿主裡的示範資料就會 import 到不存在的路徑，而 registry 本身照樣全綠。
export function rewrite(content) {
  return content
    .replace(/from\s+["']\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/dooping/forms-diff"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/forms\/diff["']/g, 'from "@/lib/dooping/forms-diff"')
    .replace(/from\s+["']\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/dooping/$1"')
    .replace(/from\s+["']\.\.\/\.\.\/lib\/([a-z-]+)["']/g, 'from "@/lib/dooping/$1"')
    .replace(/from\s+["']\.\.\/(?:ui|form)\/([a-z-]+)["']/g, 'from "@/components/dooping/$1"')
    .replace(/from\s+["']\.\/([a-z-]+)["']/g, 'from "@/components/dooping/$1"');
}
