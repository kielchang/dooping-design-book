// fingerprint.mjs 的型別宣告（tests 以 TypeScript 匯入）。規則正本在 ADR-0013 與 fingerprint.mjs。

export interface RegistryFileLike {
  path: string;
  type: string;
  target?: string;
  content: string;
}

export interface RegistryItemLike {
  name: string;
  type: string;
  version?: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFileLike[];
}

export interface Fingerprint {
  /** item 自己的指紋：檔案落點與內容、npm 相依、registry 相依的名稱 */
  hash: string;
  /** 自己＋遞移相依的指紋；任何一個相依變了就變 */
  closureHash: string;
  /** 自己＋遞移相依的名稱（排序） */
  closure: string[];
}

export declare function dependencyName(ref: string): string;
export declare function contentHash(content: string): string;
export declare function itemHash(item: RegistryItemLike): string;
export declare function fingerprints(items: RegistryItemLike[], options?: { strict?: boolean }): Map<string, Fingerprint>;
