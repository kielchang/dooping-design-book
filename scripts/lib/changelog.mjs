// CHANGELOG 的分節規則——deploy 抽 Release notes、發版閘、守衛測試共用這一份。
// （以前 deploy.yml 是 awk、tests/changelog.test.ts 是逐行移植：同一份規則兩處，只能靠測試盯著不分岔。）
//
// 標題三種（正本：CHANGELOG.md 開頭與 book/docs/7-governance/01-versioning.mdx）：
//   ## vX.Y.Z · YYYY-MM-DD      有 bump 的進版；Release notes 從這行之後讀到第一條恰為 --- 的行
//   ## YYYY-MM-DD（說明）        版號沒動的進版（純文件／純 CI）：不打 tag、不發 Release
//   ## 未發佈（`dev`）            還在累積；開 dev → staging 的 PR 之前要改成上面兩種之一
const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);

/** 切行並去掉行尾 CR（工作目錄在 Windows 是 CRLF、CI checkout 是 LF）。 */
export const toLines = (text) => String(text ?? "").split(LF).map((l) => (l.endsWith(CR) ? l.slice(0, -1) : l));

/**
 * 以 prefix 開頭的第一行之後、到第一條恰為 --- 的行之前（兩者皆不含）。找不到 prefix 回傳 null。
 * 這就是 deploy 原本那行 awk：index($0, prefix) == 1 {f=1; next} f && /^---$/ {exit} f
 */
export function extractSection(text, prefix) {
  let started = false;
  const out = [];
  for (const line of toLines(text)) {
    if (!started) {
      if (line.startsWith(prefix)) started = true;
      continue;
    }
    if (line === "---") break;
    out.push(line);
  }
  return started ? out : null;
}

/** Release notes：「## <tag> 」——版號後面要接空白，v9.9.9 不會吃到 v9.9.90。 */
export const extractReleaseNotes = (text, tag) => extractSection(text, `## ${tag} `);

/** ``` 圍籬外的 H2 標題（index 從 0 起算）。 */
export function headings(text) {
  const out = [];
  let fence = false;
  toLines(text).forEach((line, index) => {
    if (line.startsWith("```")) fence = !fence;
    else if (!fence && line.startsWith("## ")) out.push({ index, line });
  });
  return out;
}

export const UNRELEASED_PREFIX = "## 未發佈";
export const VERSION_HEADING = /^## v(\d+\.\d+\.\d+) /;
export const DATE_HEADING = /^## \d{4}-\d{2}-\d{2}(?=[\s（(]|$)/;

const isReleaseHeading = (line) => line.startsWith(UNRELEASED_PREFIX) || VERSION_HEADING.test(line) || DATE_HEADING.test(line);

/** 第一個「發版類」標題（未發佈／版號／日期）。前言裡的其他 H2（例如「兩條散佈通道」）不算。 */
export const topReleaseHeading = (text) => headings(text).find(({ line }) => isReleaseHeading(line)) ?? null;

/** 某個標題行之後、到第一條 --- 之前的內容。 */
export const sectionBody = (text, heading) => extractSection(text, heading.line);
