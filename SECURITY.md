# 安全回報

## 支援範圍

目前是 `0.x`，只支援**最新版**：修正一律出在下一個版本，不回填舊版。

## 怎麼回報

**不要開公開 issue 描述可被利用的細節。** 走私密通道：

走 [GitHub 私密安全回報](https://github.com/kielchang/dooping-design-book/security/advisories/new)
（repo 的 Security 分頁 → Report a vulnerability）。內容只有維護者與回報者看得到。
取用端的 AI agent 發現安全問題時，同樣走這條，送出前給使用者看過。

## 處理原則

安全與無障礙問題**不必等三次法則**——確認即修（文件站
[〈回饋與 RFC 流程〉](https://kielchang.github.io/dooping-design-book/governance/rfc/)的既有規則）。
這個 repo 是設計規範與元件原始碼的散佈點：修正會隨下一次進版更新 registry，
已抄走元件的取用端請依 CHANGELOG 的「我需要做什麼」重抄受影響的檔案。
