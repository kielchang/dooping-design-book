# 安全回報

## 支援範圍

目前是 `0.x`，只支援**最新版**：修正一律出在下一個版本，不回填舊版。

## 怎麼回報

**不要開公開 issue 描述可被利用的細節。** 走私密通道：

1. 首選：[GitHub 私密安全回報](https://github.com/kielchang/dooping-design-book/security/advisories/new)
   （需維護者先在 Settings → Security 啟用 Private vulnerability reporting；見 `CONTRIBUTING.md` 的一次性設定）。
2. 上述頁面 404（功能尚未啟用）時的過渡做法：開
   [Bug 回報表單](https://github.com/kielchang/dooping-design-book/issues/new?template=bug.yml)，
   只寫「安全相關，請聯繫」與影響範圍，**不要貼利用細節**，等維護者聯繫後再提供。

## 處理原則

安全與無障礙問題**不必等三次法則**——確認即修（文件站
[〈回饋與 RFC 流程〉](https://kielchang.github.io/dooping-design-book/governance/rfc/)的既有規則）。
這個 repo 是設計規範與元件原始碼的散佈點：修正會隨下一次進版更新 registry，
已抄走元件的取用端請依 CHANGELOG 的「我需要做什麼」重抄受影響的檔案。
