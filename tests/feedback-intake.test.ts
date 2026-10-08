import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { because, toLines } from "./lib/guard";

// 取用端回饋守衛：送件格式的正本只有 AGENTS.md「回饋到上游」一份。
//
// 理由：
// - 送件方是別的 repo 裡的 agent，它照抄 AGENTS.md 的兩段圍籬（create_task 參數＋description 骨架）就送出。
//   PMIS 不驗內容——鍵拼錯、systemCode 寫錯、少一段，寫入照樣成功，錯了沒有任何訊息，只會在分流時才發現。
// - 任何一頁另寫一份範本，兩份就會分岔；agent 抄到哪一份全憑運氣。
// - 台帳四題（問題、建議、影響範圍、如果不改會怎樣）同時出現在骨架、台帳頁與流程頁，三處各說各話就湊不起證據。
// - 參數的鍵照 PMIS create_task（server 0.4.1）。status／featureId／dueDate 刻意不給送件方——那是守門人分流用的欄位。
//
// 不管：PMIS 實際收到什麼、PMIS 那端的 schema 改了沒有、守門人有沒有按時分流（人工，見規則正本）。
const RULE = "AGENTS.md「回饋到上游」／book/docs/7-governance/02-rfc.mdx「取用端回饋：PMIS 的分流」";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

export const SECTION = "## 回饋到上游";
export const CALL_INFO = 'json title="回饋：create_task 參數"';
export const BODY_INFO = 'markdown title="回饋：description 骨架"';
const HEADINGS = ["來源", "對象", "類型", "目前處置", "問題", "建議", "影響範圍", "如果不改會怎樣"];
const CALL_KEYS = ["author", "description", "priority", "systemCode", "title"];
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
  const calls = fencesByInfo(agents, CALL_INFO);
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
    for (const [name, found] of [["create_task 參數", calls], ["description 骨架", bodies]] as const) {
      expect(found.length, because(`AGENTS.md 的「${name}」圍籬應恰好一個，實際 ${found.length} 個`, "兩份就會分岔，零份就沒得抄", RULE)).toBe(1);
      expect(found[0].line >= start && found[0].line < end, because(`「${name}」圍籬不在 ${SECTION} 節內（第 ${found[0].line} 行）`, "流程頁用節名指向正本", RULE)).toBe(true);
    }
  });

  it("create_task 參數解析得了，鍵與值對得上 PMIS", () => {
    let call: Record<string, unknown> = {};
    expect(() => (call = JSON.parse(calls[0].body)), because("create_task 參數不是合法 JSON", "agent 會原樣當參數送出", RULE)).not.toThrow();
    expect(Object.keys(call).sort(), because("鍵應恰為 author／description／priority／systemCode／title", "多帶 status／featureId／dueDate 等於替守門人分流；少帶就收不到", RULE)).toEqual(CALL_KEYS);
    expect(call.systemCode, because("systemCode 應為 DESIGN", "寫錯代號，回饋會落到別的系統的看板", RULE)).toBe("DESIGN");
    expect(String(call.title).startsWith("[回饋]"), because("title 應以 [回饋] 開頭", "守門人靠前綴把回饋與本系統自己的 task 分開", RULE)).toBe(true);
    expect(String(call.author), because("author 應為 agent:<送件方系統代號小寫>", "PMIS 只驗 ^(human|agent):.+$；署名系統才數得出跨系統證據", RULE)).toMatch(/^agent:.+$/);
    expect(["high", "medium", "low"], because("priority 只能是 high／medium／low", "PMIS 的列舉值", RULE)).toContain(call.priority);
  });

  it("description 骨架八段依序，目前處置列出台帳三態", () => {
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
    const markers = [CALL_INFO.split('"')[1], BODY_INFO.split('"')[1]];
    const copies = files.filter((f) => {
      const src = readFileSync(f, "utf8");
      return markers.some((m) => src.includes(m)) || /"systemCode"\s*:\s*"DESIGN"/.test(src);
    });
    expect(copies.map((f) => f.slice(ROOT.length)), because("這些檔另抄了一份送件範本，改成指向 AGENTS.md「回饋到上游」", "兩份範本一定分岔", RULE)).toEqual([]);
  });
});
