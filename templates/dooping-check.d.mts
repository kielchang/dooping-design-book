// dooping-check.mjs 的型別宣告（本 repo 的 tests 以 TypeScript 匯入）。取用端不需要這個檔，registry item 也不帶它。

export declare const DEFAULT_REGISTRY: string;
export declare const LOCK_FILE: string;

export interface LockEntry {
  closureHash: string;
  files: Record<string, string>;
}

export interface Lock {
  $comment?: string;
  registry: string;
  items: Record<string, LockEntry>;
}

export interface RegistryIndexLike {
  items: { name: string; meta?: { hash?: string; closureHash?: string } }[];
}

export interface ItemStatus {
  name: string;
  removed: boolean;
  upstream: boolean;
  modified: string[];
}

export declare function contentHash(content: string): string;
export declare function readRegistry(registry: string, name: string, cwd: string): Promise<unknown>;
export declare function resolveTargets(cwd: string): (target: string) => string;
export declare function createLockEntries(
  registry: string,
  names: string[],
  cwd: string,
  index: RegistryIndexLike,
): Promise<Record<string, LockEntry>>;
export declare function evaluate(
  lock: Pick<Lock, "items">,
  index: RegistryIndexLike,
  readLocal: (path: string) => string | null,
): ItemStatus[];
export declare function renderReport(results: ItemStatus[], options: { registry: string }): string;
export declare function parseArgs(argv: string[]): {
  command: "check" | "init" | "update";
  items: string[];
  registry?: string;
  cwd?: string;
  strict: boolean;
};
export declare function main(argv: string[]): Promise<number>;
