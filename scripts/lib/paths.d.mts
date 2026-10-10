// paths.mjs 的型別宣告（本 repo 的 tests 以 TypeScript 匯入）。

export declare function isInside(child: string, parent: string): boolean;
export declare function safeDecode(text: string): string | null;
export declare function outputDirUnder(root: string, value: string | undefined, name?: string): string;
export declare function shellArgs(args: readonly string[], platform?: string): string[];
