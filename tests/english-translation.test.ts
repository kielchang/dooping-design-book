import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const EN_DOCS = join(ROOT, "book/i18n/en/docusaurus-plugin-content-docs/current");
const CONFIG = readFileSync(join(ROOT, "book/docusaurus.config.ts"), "utf8");
const EN_I18N = join(ROOT, "book/i18n/en");

const translatedDocs = [
  "index.md",
  "1-start/01-what-is-this.md",
  "1-start/02-three-ways.mdx",
  "1-start/03-adoption-checklist.mdx",
  "2-foundations/01-color.mdx",
  "2-foundations/02-typography.mdx",
  "2-foundations/03-space-radius.mdx",
  "2-foundations/04-elevation.mdx",
  "2-foundations/05-motion.mdx",
  "2-foundations/06-theming.mdx",
  "2-foundations/07-choosing-a-palette.mdx",
  "2-foundations/08-alert-colors.mdx",
  "3-components/01-button.mdx",
  "3-components/02-badge.mdx",
  "3-components/03-callout.mdx",
  "3-components/04-card.mdx",
  "3-components/05-input.mdx",
  "3-components/06-number-input.mdx",
  "3-components/07-checkbox-select.mdx",
  "3-components/08-seg-group.mdx",
  "3-components/09-chips.mdx",
  "3-components/10-tooltip.mdx",
  "3-components/11-dialog.mdx",
  "3-components/12-table.mdx",
  "3-components/14-tab-pills.mdx",
  "3-components/15-delta.mdx",
  "3-components/16-empty-state.mdx",
  "3-components/17-stepper.mdx",
  "3-components/18-editable-field.mdx",
  "3-components/19-change-summary.mdx",
  "3-components/20-coachmark.mdx",
  "3-components/21-mockup.mdx",
  "3-components/24-gantt.mdx",
  "3-components/27-toast.mdx",
  "3-components/28-skeleton.mdx",
  "3-components/29-date-range.mdx",
];

describe("English translation coverage", () => {
  it("declares English alongside the original Traditional Chinese locale", () => {
    expect(CONFIG).toContain('locales: ["zh-Hant", "en"]');
    expect(CONFIG).toContain('type: "localeDropdown"');
  });

  it("keeps the translated document set complete", () => {
    for (const relativePath of translatedDocs) {
      expect(existsSync(join(EN_DOCS, relativePath))).toBe(true);
    }
  });

  it("does not leave CJK characters in translated pages or visible messages", () => {
    const cjk = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
    const docs = translatedDocs.map((relativePath) => readFileSync(join(EN_DOCS, relativePath), "utf8"));
    const translations = [
      join(EN_I18N, "docusaurus-theme-classic/navbar.json"),
      join(EN_I18N, "docusaurus-theme-classic/footer.json"),
      join(EN_I18N, "docusaurus-plugin-content-docs/current.json"),
    ].flatMap((file) => Object.values(JSON.parse(readFileSync(file, "utf8")) as Record<string, { message: string }>).map((entry) => entry.message));

    const visibleDocs = docs.map((content) => content
      .replace(/<StoryLink\s+id="[^"]*"[^>]*>(?:[\s\S]*?<\/StoryLink>)?/gu, "")
      .replace(/<StoryFrame\s+id="[^"]*"[^>]*\/?>/gu, ""));
    for (const content of [...visibleDocs, ...translations]) {
      expect(content).not.toMatch(cjk);
    }
  });
});
