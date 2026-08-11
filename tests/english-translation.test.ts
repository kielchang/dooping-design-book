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

    for (const content of [...docs, ...translations]) {
      expect(content).not.toMatch(cjk);
    }
  });
});
