import { createHash } from "node:crypto";

// registry item 指紋（ADR-0013 第一層）。build-registry 寫進 /r/index.json 的 meta，
// registry-changes 用它比對任意兩版，取用端的檢查腳本也照同一套規則算。
//
// 串接規則是對外契約：改了等於讓所有取用端的 lock 一次失效——要改先修訂 ADR-0013。
// tests/registry-fingerprint.test.ts 用獨立寫的第二份實作逐 item 對過。

const sha16 = (text) => createHash("sha256").update(text, "utf8").digest("hex").slice(0, 16);
const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** registryDependencies 的一筆（URL 或名稱）→ item 名稱。預覽站與正式站的 base 不同，指紋不能跟著 base 變。 */
export const dependencyName = (ref) => ref.split("/").pop().replace(/\.json$/, "");

/** 單一檔案內容的指紋（取用端檢查「本地改過沒有」用）。換行先正規化成 LF。 */
export const contentHash = (content) => sha16(content.replace(/\r\n/g, "\n"));

/**
 * item 自己的指紋：取用端抄走的東西——檔案落點與內容、npm 相依、registry 相依的名稱。
 * 不含版號、標題、說明、URL：只改說明文字不該叫人重抄，預覽站與正式站的同一份內容也必須同一個指紋。
 */
export function itemHash(item) {
  const files = [...(item.files ?? [])].sort((a, b) => byCodeUnit(a.target ?? a.path, b.target ?? b.path));
  const lines = [
    `name ${item.name}`,
    `type ${item.type}`,
    `deps ${[...(item.dependencies ?? [])].sort(byCodeUnit).join(" ")}`,
    `registryDeps ${(item.registryDependencies ?? []).map(dependencyName).sort(byCodeUnit).join(" ")}`,
    ...files.map((f) => `file ${f.target ?? f.path} ${f.type} ${f.content.length}\n${f.content}`),
  ];
  return sha16(lines.join("\n"));
}

/**
 * 全部 item 的指紋：Map<name, { hash, closureHash, closure }>。
 *
 * closure＝自己＋所有遞移 registry 相依的名稱（排序）；closureHash 由閉包內每個 item 的 hash 算出——
 * 任何一個相依變了，這個值就變（utils 修了，data-table 的 closureHash 跟著變、hash 不變）。
 * strict（預設）時相依指到不存在的 item 直接丟錯；比對舊版 registry 時用 strict:false，缺的相依記成「missing」。
 */
export function fingerprints(items, { strict = true } = {}) {
  const byName = new Map(items.map((item) => [item.name, item]));
  const own = new Map(items.map((item) => [item.name, itemHash(item)]));
  const result = new Map();
  for (const item of items) {
    const seen = new Set();
    const stack = [item.name];
    while (stack.length > 0) {
      const name = stack.pop();
      if (seen.has(name)) continue;
      seen.add(name);
      const dep = byName.get(name);
      if (!dep) {
        if (strict) throw new Error(`「${item.name}」的 registry 相依指到不存在的 item「${name}」`);
        continue;
      }
      for (const ref of dep.registryDependencies ?? []) stack.push(dependencyName(ref));
    }
    const closure = [...seen].sort(byCodeUnit);
    result.set(item.name, {
      hash: own.get(item.name),
      closureHash: sha16(closure.map((name) => `${name}:${own.get(name) ?? "missing"}`).join("\n")),
      closure,
    });
  }
  return result;
}
