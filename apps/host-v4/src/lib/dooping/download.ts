export function saveBlob(blob: Blob, fileName: string): void {
  // 觸發瀏覽器下載一個 Blob。無框架相依，供 CSV／檔案匯出共用。
  // 說明寫在函式內而不是檔頭：shadcn CLI 安裝時會刪掉檔案開頭的註解（tests/registry-content.test.ts）。
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
