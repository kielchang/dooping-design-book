// registry-changes.mjs 的型別宣告（tests 以 TypeScript 匯入）。

import type { RegistryItemLike } from "./fingerprint.mjs";

export interface AffectedItem {
  name: string;
  /** 閉包裡變了（或新加入）的相依 */
  via: string[];
}

export interface RegistryChanges {
  changed: string[];
  affected: AffectedItem[];
  added: string[];
  removed: string[];
}

export declare function classify(fromItems: RegistryItemLike[], toItems: RegistryItemLike[]): RegistryChanges;
export declare function renderMarkdown(changes: RegistryChanges, fromLabel: string): string;
export declare function previousTag(tags: string[], before: string): string | null;
export declare function listTags(root: string): string[];
export declare function registryItemsAt(root: string, rev: string): RegistryItemLike[];
