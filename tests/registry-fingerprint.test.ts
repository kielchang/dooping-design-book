// registry 逐 item 指紋（ADR-0013 第一層）。
//
// 指紋是對外契約：取用端的 lock 記的就是它，Release 的異動清單也靠它分類。
// 這支用**獨立寫的第二份實作**逐 item 重算 /r/index.json 的 meta——產生器與規則任何一邊寫錯都會紅；
// 另外盯住兩個語意：base 與說明文字不進指紋、相依變了 closureHash 要跟著變。
import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fingerprints, itemHash } from "../scripts/lib/fingerprint.mjs";

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}
interface RegistryItem {
  name: string;
  type: string;
  version?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}
interface IndexItem {
  name: string;
  meta?: { hash?: string; closureHash?: string };
}

const REGISTRY = join(__dirname, "..", "registry");
const items: RegistryItem[] = readdirSync(REGISTRY)
  .filter((f) => f.endsWith(".json") && f !== "index.json")
  .map((f) => JSON.parse(readFileSync(join(REGISTRY, f), "utf8")));
const index: { items: IndexItem[] } = JSON.parse(readFileSync(join(REGISTRY, "index.json"), "utf8"));

// ── 第二份實作：照 ADR-0013 的文字規則重寫，不 import 產生器的任何東西 ────────────
const hex16 = (s: string) => createHash("sha256").update(s).digest("hex").substring(0, 16);
const lastSegment = (ref: string) => ref.substring(ref.lastIndexOf("/") + 1).replace(".json", "");

function referenceHash(item: RegistryItem): string {
  let text = "name " + item.name + "\ntype " + item.type;
  text += "\ndeps " + [...(item.dependencies ?? [])].sort().join(" ");
  text += "\nregistryDeps " + (item.registryDependencies ?? []).map(lastSegment).sort().join(" ");
  const files = [...item.files].sort((a, b) => ((a.target ?? a.path) < (b.target ?? b.path) ? -1 : 1));
  for (const f of files) text += "\nfile " + (f.target ?? f.path) + " " + f.type + " " + f.content.length + "\n" + f.content;
  return hex16(text);
}

function referenceClosure(name: string, byName: Map<string, RegistryItem>, acc = new Set<string>()): Set<string> {
  if (acc.has(name)) return acc;
  acc.add(name);
  for (const ref of byName.get(name)?.registryDependencies ?? []) referenceClosure(lastSegment(ref), byName, acc);
  return acc;
}

describe("/r/index.json 的逐 item 指紋", () => {
  it("每個 item 都有指紋，而且 index 與 item 檔一一對應（防空轉）", () => {
    expect(items.length).toBeGreaterThan(50);
    expect(index.items.map((i) => i.name).sort()).toEqual(items.map((i) => i.name).sort());
    for (const i of index.items) {
      expect(i.meta?.hash, i.name).toMatch(/^[0-9a-f]{16}$/);
      expect(i.meta?.closureHash, i.name).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  it("第二份實作逐 item 重算，與產生器寫進 index 的值完全相同", () => {
    const byName = new Map(items.map((i) => [i.name, i]));
    const own = new Map(items.map((i) => [i.name, referenceHash(i)]));
    const mismatches: string[] = [];
    for (const entry of index.items) {
      const closure = [...referenceClosure(entry.name, byName)].sort();
      const closureHash = hex16(closure.map((n) => n + ":" + own.get(n)).join("\n"));
      if (entry.meta?.hash !== own.get(entry.name)) mismatches.push(`${entry.name} hash`);
      if (entry.meta?.closureHash !== closureHash) mismatches.push(`${entry.name} closureHash`);
    }
    expect(mismatches, "index 的指紋與規則對不上——重跑 npm run build:registry，或產生器與 ADR-0013 的規則分岔了").toEqual([]);
  });
});

describe("指紋的語意", () => {
  const dataTable = items.find((i) => i.name === "data-table")!;

  it("registry base 不進指紋：預覽站與正式站的同一份內容同一個指紋", () => {
    const moved = {
      ...dataTable,
      registryDependencies: (dataTable.registryDependencies ?? []).map((u) => u.replace(/^https?:\/\/[^/]+(\/[^/]+)*\/r\//, "http://127.0.0.1:4173/r/")),
    };
    expect(moved.registryDependencies).not.toEqual(dataTable.registryDependencies);
    expect(itemHash(moved)).toBe(itemHash(dataTable));
  });

  it("版號、標題、說明不進指紋：只改說明文字不會叫取用端重抄", () => {
    expect(itemHash({ ...dataTable, version: "9.9.9", title: "改名", description: "改說明" })).toBe(itemHash(dataTable));
  });

  it("檔案內容或相依一變，自己的 hash 就變", () => {
    const edited = { ...dataTable, files: dataTable.files.map((f) => ({ ...f, content: f.content + "\n" })) };
    expect(itemHash(edited)).not.toBe(itemHash(dataTable));
    expect(itemHash({ ...dataTable, dependencies: [...(dataTable.dependencies ?? []), "left-pad"] })).not.toBe(itemHash(dataTable));
  });

  it("相依變了：相依者的 hash 不變、closureHash 變；閉包外的 item 完全不受影響", () => {
    const mutated = items.map((i) =>
      i.name === "utils" ? { ...i, files: i.files.map((f) => ({ ...f, content: f.content + "\n// 模擬修正" })) } : i,
    );
    const before = fingerprints(items);
    const after = fingerprints(mutated);
    expect(after.get("utils")!.hash).not.toBe(before.get("utils")!.hash);
    expect(after.get("data-table")!.hash).toBe(before.get("data-table")!.hash);
    expect(after.get("data-table")!.closureHash).not.toBe(before.get("data-table")!.closureHash);

    const outside = items.filter((i) => !before.get(i.name)!.closure.includes("utils"));
    expect(outside.length, "找不到閉包外的 item——斷言會空轉").toBeGreaterThan(0);
    for (const i of outside) expect(after.get(i.name)!.closureHash, i.name).toBe(before.get(i.name)!.closureHash);
  });
});
