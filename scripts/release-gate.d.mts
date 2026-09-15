// release-gate.mjs 的型別宣告（tests 以 TypeScript 匯入）。

export interface TokensState {
  version: string;
  key: string;
}

export interface GateState {
  mainVersion: string;
  headVersion: string;
  watchedChanged: string[];
  mainTokens: TokensState | null;
  headTokens: TokensState | null;
  tagExists?: boolean;
  changelog?: string;
  mainChangelog?: string | null;
}

export interface PrState extends GateState {
  baseRef: string;
  headRef: string;
  headRepo: string;
  repository: string;
  prBody: string;
  treeEqual: boolean;
}

export interface ChecklistItem {
  checked: boolean;
  text: string;
}

export declare function parseVersion(v: string): number[] | null;
export declare function compareVersions(a: string, b: string): number;
export declare function tokensContentKey(json: string | object): string;
export declare function evaluateBumpGuard(s: GateState): string[];
export declare function evaluateChangelog(
  changelog: string,
  mainChangelog: string | null | undefined,
  options: { bumped: boolean; version: string },
): string[];
export declare function evaluateRelease(s: GateState): string[];
export declare const MIN_APPROVAL_ITEMS: number;
export declare function approvalChecklist(body: string): ChecklistItem[] | null;
export declare function evaluatePr(s: PrState): string[];
