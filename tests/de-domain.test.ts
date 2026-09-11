// 去領域化守衛 — 硬性驗收。
//
// 這個工具箱的來源是一套真實運作的內部後台系統，但收進來的只有「操作邏輯與設計語言」，
// 領域語意一律留在原地。示範資料會被複製貼上：一旦示範裡出現特定產業的欄位，
// 抄過去的人就會連那個產業的資料模型一起抄走。
//
// 規則在 v0.2.1 從「不留**來源專案**語彙」擴為「不綁死**任何**產業」。原因是原本的示範情境
// 自稱「中性商業情境」，實際上是一整套 ERP（訂單／客戶／出貨／庫存／工單）——
// 犯的是同一個錯，只是不在黑名單上，所以三個版本都沒被發現。
//
// 因此這裡不是「盡量避免」，是「一個字都不留」，而且用測試盯著。
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, extname } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/**
 * 掃描範圍＝「取用端看得到的，或會被複製走的」全部東西。
 * templates/ 與 scripts/ 是 v0.2.1 補的洞：前者被整份抄走，後者的 TITLES 會寫進 registry JSON。
 * .github/ 是回饋入口補的洞：issue 表單的欄位文案是取用端提案時第一眼看到的規範措辭。
 */
const SCAN_DIRS = [
  "packages/react/src",
  "packages/tokens/src",
  ".storybook",
  ".github",
  "book/docs",
  "book/src",
  "docs",
  "registry",
  "templates",
  "scripts",
  "tests",
  // 內部試裝宿主：頁面文案、README、台帳都是「新子系統整個目錄抄走」的範本，領域詞會跟著被抄走
  "apps",
];
const SCAN_FILES = [
  "README.md",
  "AGENTS.md",
  "ARCHITECTURE.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "packages/react/README.md",
  "packages/tokens/README.md",
  // 側欄標題與站台設定都是使用者可見文字
  "book/docusaurus.config.ts",
  "book/sidebars.ts",
  // 給 AI 的機器地圖：book/static 不在 SCAN_DIRS、.txt 也不在 EXTS，不列名就掃不到
  "book/static/llms.txt",
];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".md", ".mdx", ".json", ".css", ".yml", ".yaml"]);

/**
 * 禁用詞。
 *
 * 分四層：來源專案的領域語彙、企業系統（ERP／CRM／BPM／MES）、其他產業、英文。
 * 第二層是重點——「換一個產業的示範資料」不叫去領域化，只是把領域換了一個。
 *
 * 刻意**不列**的三個，是判斷不是遺漏：
 *   主管   「報表印出來給主管簽名」是通用商業敘述
 *   中位數  統計詞彙不是領域詞彙，圖表章一定會用到
 *   跟進   「這次進版需不需要跟進」是通用中文
 * 需要例外請開 RFC issue 討論（範例是中性詞的判準要一起改），不要默默加詞或刪詞。
 */
const FORBIDDEN = [
  // ── 來源專案（人事薪資）
  "薪資", "薪水", "薪酬", "薪資條", "工資", "本薪", "加給", "津貼",
  "勞保", "健保", "勞退", "投保", "保費", "級距", "補充保費",
  "扣繳", "免稅額", "扣除額", "所得稅",
  "加班費", "特休", "年資", "眷屬", "撫養", "請假", "休假",
  "申報", "名冊", "破月", "實發", "應發", "雇主",
  "員工", "人事", "到職", "離職", "留停", "停職", "復職",
  "加保", "退保", "停保", "復保", "打卡", "出勤", "考勤", "考績",
  "部門", "部屬", "職等", "職稱", "調薪", "調幅", "獎金", "分紅",
  "工時", "分攤", "招募", "面試", "年終",

  // ── 企業系統：ERP／進銷存
  "進銷存", "採購", "請購", "領料", "製令", "料號", "庫存", "盤點",
  "出貨", "進貨", "銷貨", "應收帳款", "應付帳款", "總帳", "傳票",
  "成本中心", "發票", "供應商", "倉庫", "品項", "單價",

  // ── 企業系統：CRM
  "訂單", "客戶", "商機", "銷售漏斗", "拜訪紀錄", "客訴", "售後",
  "報價單", "成交", "名片", "合約",

  // ── 企業系統：BPM／簽核流程
  "簽核", "陳核", "會簽", "加簽", "關卡", "代理人", "流程引擎", "退回重簽",

  // ── 企業系統：MES／資產
  "工單", "派工", "良率", "工序", "機台", "保養", "報修", "資產編號", "財產",

  // ── 其他產業：醫療
  "病人", "病患", "就診", "掛號", "處方", "診斷", "病歷", "醫師",
  "護理", "藥品", "手術", "住院", "門診", "健檢",

  // ── 其他產業：教育
  "學生", "課程", "學期", "成績", "選課", "教師", "學號", "班級",
  "考試", "學分", "校務", "教材",

  // ── 其他產業：金融
  "帳戶", "存款", "放款", "利率", "保單", "理賠", "投資", "股票",
  "基金", "匯率", "信用卡", "對帳單", "貸款",

  // ── 其他產業：零售餐飲
  "菜單", "餐點", "桌號", "外送", "會員卡", "促銷", "門市", "收銀", "結帳",

  // ── 其他產業：物流
  "貨運", "提單", "倉儲", "配送", "託運", "運單",

  // ── 其他產業：法律／不動產
  "案件", "訴訟", "委任", "律師", "房屋", "租約", "坪數", "仲介",

  // ── 英文
  "payroll", "salary", "wage", "labor insurance", "health insurance",
];

// 詞表先小寫一次。原本每一行都對 176 個詞各呼叫一次 term.toLowerCase()，
// 同一批常數字串被重算了「行數 × 176」遍。掃描量長到 v0.13.0 時，
// 這支守衛跑到 4.9 秒、貼著 5 秒的預設 timeout，變成會隨機紅的守衛。
// 會隨機紅比慢更糟：沒人相信的紅燈最後會被加 timeout 蓋掉，守衛就此空轉。
// 所以改的是重算（行為逐字相同），不是把 timeout 調大。
const FORBIDDEN_LOWER = FORBIDDEN.map((t) => t.toLowerCase());

export interface Hit {
  line: number;
  term: string;
  text: string;
}

/**
 * 比對邏輯抽出來，才測得到。
 *
 * 沒有這一步，「守衛全綠」與「守衛空轉」在測試報告上長得一模一樣——
 * `FORBIDDEN` 被清空、`walk()` 壞掉，兩種情況都是綠的。
 */
export function scanLines(text: string): Hit[] {
  const hits: Hit[] = [];
  text.split("\n").forEach((line, i) => {
    const lower = line.toLowerCase();
    for (let t = 0; t < FORBIDDEN.length; t++) {
      if (lower.includes(FORBIDDEN_LOWER[t])) {
        hits.push({ line: i + 1, term: FORBIDDEN[t], text: line.trim().slice(0, 80) });
      }
    }
  });
  return hits;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "build" || name === ".docusaurus" || name === "dist") continue;
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { out.push(...walk(abs)); continue; }
    if (EXTS.has(extname(name))) out.push(abs);
  }
  return out;
}

const targets = [
  ...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...SCAN_FILES.map((f) => join(ROOT, f)).filter((f) => existsSync(f)),
];

describe("去領域化", () => {
  it("掃描範圍非空（守衛本身沒有空轉）", () => {
    expect(targets.length).toBeGreaterThan(20);
  });

  it("全部檔案不含任何產業的領域詞彙", () => {
    const hits: string[] = [];
    for (const abs of targets) {
      const rel = relative(ROOT, abs);
      // 這支測試檔自己就是詞表，跳過
      if (rel.includes("de-domain.test")) continue;
      for (const h of scanLines(readFileSync(abs, "utf8"))) {
        hits.push(`${rel}:${h.line} 出現「${h.term}」 → ${h.text}`);
      }
    }
    expect(
      hits,
      `發現領域詞彙殘留（共 ${hits.length} 處）：\n${hits.join("\n")}\n\n` +
        "改寫成抽象中性情境（項目／類別／單位／負責人／狀態）。" +
        "示範資料一律取自 packages/react/src/demo/sample-data.ts。" +
        "確有必要保留某個詞，請開 RFC issue 討論例外，不要默默把它從詞表刪掉。\n" +
        "為什麼：領域詞一旦進了範例，複製出去的元件就帶著別人的業務假設。\n" +
        "規則正本：CLAUDE.md「去領域化是硬閘門」、本檔檔頭。",
    ).toEqual([]);
  });

  // ── 守衛的自我驗證：證明比對真的會抓，而不是永遠回傳空陣列
  it("比對邏輯抓得到已知的領域詞", () => {
    const hits = scanLines(["const a = 1;", "// 這一行提到客戶與出貨", "const b = 2;"].join("\n"));
    expect(hits.map((h) => h.term).sort()).toEqual(["出貨", "客戶"]);
    expect(hits[0].line).toBe(2);
  });

  it("乾淨內容不會誤報", () => {
    const hits = scanLines("const rows = demoRecords; // 抽象中性示範資料：項目、類別、單位");
    expect(hits).toEqual([]);
  });
});
