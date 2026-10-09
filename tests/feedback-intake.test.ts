import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { because, toLines } from "./lib/guard";

// 取用端回饋守衛：送件格式的正本只有 AGENTS.md「回饋到上游」一份。
//
// 管什麼：
// - 送件方是別的 repo 裡的 agent，它照抄 AGENTS.md 的兩段圍籬（送出指令＋issue 內容骨架）就送出。
//   GitHub 不驗內容——少一段、前綴拼錯，issue 照樣開得出來，只會在分流時才發現。
// - 任何一頁另寫一份範本，兩份就會分岔。
// - 台帳四題（問題、建議、影響範圍、如果不改會怎樣）同時出現在骨架、台帳頁與流程頁，必須是同一說法。
//
// 不管：issue 實際寫了什麼、守門人有沒有按時分流（人工，見規則正本）。
const RULE = "AGENTS.md「回饋到上游」／book/docs/7-governance/02-rfc.mdx「送出之後」";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

export const SECTION = "## 回饋到上游";
export const SEND_INFO = 'bash title="回饋：送出指令"';
export const BODY_INFO = 'markdown title="回饋：issue 內容骨架"';
const HEADINGS = ["來源", "對象", "類型", "目前處置", "問題", "建議", "影響範圍", "如果不改會怎樣"];
const SEND_PARTS = ["gh issue create", "--repo kielchang/dooping-design-book", '--title "[回饋]', "--body-file"];
const AGENTS_URL = "https://kielchang.github.io/dooping-design-book/AGENTS.md";
const FOUR = HEADINGS.slice(4).join("、");

type Fence = { line: number; body: string };

/** 抓出開頭行（去掉縮排後）恰為 ```<info> 的圍籬；line 是開頭行的行號（1 起算）。 */
export function fencesByInfo(md: string, info: string): Fence[] {
  const out: Fence[] = [];
  let open: { line: number; match: boolean; body: string[] } | null = null;
  toLines(md).forEach((raw, i) => {
    if (!/^\s*```/.test(raw)) {
      open?.body.push(raw);
      return;
    }
    if (open) {
      if (open.match) out.push({ line: open.line, body: open.body.join("\n") });
      open = null;
    } else {
      open = { line: i + 1, match: raw.trim() === "```" + info, body: [] };
    }
  });
  return out;
}

/** 某個 H2 節的行範圍 [start, end)（行號 1 起算）；圍籬裡的 `## ` 不算節界。找不到回 null。 */
export function sectionOf(md: string, heading: string): [number, number] | null {
  const lines = toLines(md);
  let fence = false;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) fence = !fence;
    if (fence) continue;
    if (start < 0 && lines[i] === heading) start = i + 1;
    else if (start > 0 && lines[i].startsWith("## ")) return [start, i + 1];
  }
  return start > 0 ? [start, lines.length + 1] : null;
}

function walk(dir: string, keep: (name: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "node_modules" ? [] : walk(full, keep);
    return keep(name) ? [full] : [];
  });
}

describe("取用端回饋：格式正本只在 AGENTS.md 一份", () => {
  const agents = read("AGENTS.md");
  const sends = fencesByInfo(agents, SEND_INFO);
  const bodies = fencesByInfo(agents, BODY_INFO);

  it("圍籬抽取抓得到相符與縮排相符、放過不相符（防空轉）", () => {
    const sample = ['```json title="x"', "{}", "```", '  ```json title="x"', "  [1]", "  ```", "```json", '{"a":1}', "```"].join("\n");
    expect(fencesByInfo(sample, 'json title="x"')).toEqual([
      { line: 1, body: "{}" },
      { line: 4, body: "  [1]" },
    ]);
  });

  it("兩段圍籬各恰好一份，都在「回饋到上游」節內", () => {
    const range = sectionOf(agents, SECTION);
    expect(range, because(`AGENTS.md 找不到 ${SECTION}`, "取用端 agent 照節名找送件格式", RULE)).not.toBeNull();
    const [start, end] = range!;
    for (const [name, found] of [["送出指令", sends], ["issue 內容骨架", bodies]] as const) {
      expect(found.length, because(`AGENTS.md 的「${name}」圍籬應恰好一個，實際 ${found.length} 個`, "兩份就會分岔，零份就沒得抄", RULE)).toBe(1);
      expect(found[0].line >= start && found[0].line < end, because(`「${name}」圍籬不在 ${SECTION} 節內（第 ${found[0].line} 行）`, "流程頁用節名指向正本", RULE)).toBe(true);
    }
  });

  it("送出指令是單行、開到本 repo、帶 [回饋] 前綴與內容檔", () => {
    const body = sends[0].body.trim();
    expect(toLines(body).length, because("送出指令應為單行", "agent 逐字照抄；續行符號在不同 shell 行為不同", RULE)).toBe(1);
    const missing = SEND_PARTS.filter((part) => !body.includes(part));
    expect(missing, because(`送出指令缺少：${missing.join("、")}`, "少了 --repo 會開到取用端自己的 repo；少了前綴守門人分流時找不到", RULE)).toEqual([]);
  });

  it("issue 內容骨架八段依序，目前處置列出台帳三態", () => {
    const body = toLines(bodies[0].body);
    const headings = body.flatMap((l) => (/^## (.+)$/.exec(l)?.slice(1) ?? []));
    expect(headings, because("骨架的 H2 應依序為八段", "後四段＝台帳四題，守門人逐段比對同類回饋", RULE)).toEqual(HEADINGS);
    // 只看標題下第一行的選項（<遵循｜自製｜刻意偏離>）——同段的說明文字也會提到狀態名，整段比對會放過漏掉的選項
    const from = body.indexOf("## 目前處置");
    const options = /^<([^>]*)>/.exec(body.slice(from + 1).find((l) => l.trim() !== "") ?? "")?.[1].split("｜") ?? [];
    expect(options, because("「目前處置」第一行應列出台帳三態 <遵循｜自製｜刻意偏離>", "回饋要對得上送件方台帳的那一列", "book/docs/7-governance/05-conformance-ledger.mdx")).toEqual(["遵循", "自製", "刻意偏離"]);
  });

  it("台帳四題在各處是同一說法", () => {
    const files = ["AGENTS.md", "CONTRIBUTING.md", "book/docs/7-governance/02-rfc.mdx", "book/docs/7-governance/05-conformance-ledger.mdx"];
    const found = files.flatMap((f) => [...read(f).matchAll(/（(問題、[^）]*)）/g)].map((m) => ({ f, text: m[1] })));
    expect(found.length, because("至少兩處列出台帳四題（防空轉）", "比對對象消失時這條先紅", RULE)).toBeGreaterThanOrEqual(2);
    const wrong = found.filter((x) => x.text !== FOUR).map((x) => `${x.f}：（${x.text}）`);
    expect(wrong, because(`台帳四題應一律寫成（${FOUR}）`, "四題與骨架後四段是同一件事，換個說法就湊不起證據", RULE)).toEqual([]);
  });

  it("流程頁指向正本", () => {
    for (const f of ["book/docs/7-governance/02-rfc.mdx", "book/docs/7-governance/05-conformance-ledger.mdx"]) {
      const src = read(f);
      expect(src.includes(AGENTS_URL) && src.includes("「回饋到上游」"), because(`${f} 應連到 ${AGENTS_URL} 並以「回饋到上游」指名該節`, "正本只有一份，流程頁只導流不抄", RULE)).toBe(true);
    }
  });

  it("別處沒有第二份範本", () => {
    const md = (n: string) => /\.mdx?$/.test(n);
    const files = [
      ...walk(join(ROOT, "book/docs"), md),
      ...walk(join(ROOT, ".github"), (n) => md(n) || /\.ya?ml$/.test(n)),
      ...["README.md", "CONTRIBUTING.md", "ARCHITECTURE.md", "SECURITY.md", "CLAUDE.md", "book/static/llms.txt"].map((f) => join(ROOT, f)),
    ];
    expect(files.length, because("掃描檔數過少（防空轉）", "目錄搬家時這條先紅", RULE)).toBeGreaterThanOrEqual(30);
    const markers = [SEND_INFO.split('"')[1], BODY_INFO.split('"')[1]];
    const copies = files.filter((f) => {
      const src = readFileSync(f, "utf8");
      return markers.some((m) => src.includes(m));
    });
    expect(copies.map((f) => f.slice(ROOT.length)), because("這些檔另抄了一份送件範本，改成指向 AGENTS.md「回饋到上游」", "兩份範本一定分岔", RULE)).toEqual([]);
  });
});
