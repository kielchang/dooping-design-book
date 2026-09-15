// changelog.mjs 的型別宣告（tests 以 TypeScript 匯入）。

export interface Heading {
  index: number;
  line: string;
}

export declare const toLines: (text: string) => string[];
export declare function extractSection(text: string, prefix: string): string[] | null;
export declare function extractReleaseNotes(text: string, tag: string): string[] | null;
export declare function headings(text: string): Heading[];
export declare const UNRELEASED_PREFIX: string;
export declare const VERSION_HEADING: RegExp;
export declare const DATE_HEADING: RegExp;
export declare function topReleaseHeading(text: string): Heading | null;
export declare function sectionBody(text: string, heading: Heading): string[] | null;
