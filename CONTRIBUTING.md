# 貢獻指南

> 給要回饋這套設計語言的人——不管你是取用端專案的工程師、設計師，還是 AI agent。
> 完整規範在文件站[〈回饋與 RFC 流程〉](https://kielchang.github.io/dooping-design-book/governance/rfc/)；這一頁是「怎麼提、提到哪」的操作版。

## 三種回饋，三個門口

| 類型 | 門口 | 期望回應 |
| --- | --- | --- |
| **Bug**（行為與規範不符） | [Bug 回報表單](https://github.com/kielchang/dooping-design-book/issues/new?template=bug.yml) | 直接修 |
| **小調整**（文案、對比、一個 prop） | 直接[開 PR](https://github.com/kielchang/dooping-design-book/compare)，附截圖或說明 | Review 後合併 |
| **新元件／新 token／改語意** | [RFC 提案表單](https://github.com/kielchang/dooping-design-book/issues/new?template=rfc.yml) | 討論後決定 |

另有一個低門檻入口：[**缺件認領**](https://github.com/kielchang/dooping-design-book/issues/new?template=missing-piece.yml)——頁面章缺件表的項目，回報一個使用場景就是三次法則的一次證據，證據齊了就會動工。

**下游唯讀鐵律**：取用端專案對這個 repo 只有「讀」與「提案」兩種關係，
沒有 submodule、沒有自動同步；**未合併的提案不得在下游先行實作**
（理由見[符合性台帳](https://kielchang.github.io/dooping-design-book/governance/conformance-ledger/)）。

## 收錄三原則（全過才收）

1. **去領域化** — 拿掉原始產業脈絡還成立嗎？由 `tests/de-domain.test.ts` 自動把關，零容忍。
2. **通用性** — 換一個後台系統會用到嗎？
3. **三次法則** — 實際用過三次以上且穩定才收。投機性抽象不收。
   例外：**已知的無障礙或安全問題**不必等三次。

## 開 PR 前，本機四道全綠

```bash
npm run build:tokens   # 其他步驟的前提
npm run typecheck
npm test               # 守衛：元件庫邊界、token 一致性、去領域化詞彙
npm run build:registry # 改了元件就要重新產生 registry JSON 並一起提交
```

## 提案的狀態機

| label | 誰掛 | 語意 |
| --- | --- | --- |
| `bug`／`缺件`／`rfc` | 表單自動 | 類型標記，永不移除 |
| `rfc:討論中` | 表單自動 | 開立即此態，任何人可討論 |
| `rfc:已接受` | 守門人 | 三問通過；守門人同時開一則 ADR（提議中），實作 PR 合併時 ADR 改「已採用」、issue 關閉 |
| `rfc:已婉拒` | 守門人 | issue 留一句**可被推翻**的理由後關閉（「因 X 不收，待 Y 成立可重提」） |
| `rfc:已擱置` | 守門人 | 通常是三次證據未滿；用缺件認領 issue 湊證據，齊了改回討論中 |

**守門人**：@kielchang（`.github/CODEOWNERS`）。守門人三問：三次法則過了嗎？拿掉領域脈絡還成立嗎？現有元件真的做不到嗎？

## 維護者一次性設定

> 表單引用的 label 必須先存在（不存在只是不自動掛，表單照常可用）。

```bash
gh label create "缺件"       --color 1d76db --description "頁面章缺件表的認領與場景證據"
gh label create "rfc"        --color 6f42c1 --description "新元件／新 token／改語意的提案"
gh label create "rfc:討論中" --color fbca04 --description "RFC 開立狀態，任何人可討論"
gh label create "rfc:已接受" --color 0e8a16 --description "守門人三問通過，待實作"
gh label create "rfc:已婉拒" --color d93f0b --description "留有可被推翻的理由"
gh label create "rfc:已擱置" --color c5def5 --description "三次證據未滿，湊齊可重啟"
```

沒有 `gh` 的話走網頁：repo → Issues → Labels → New label，照上表建。
另外到 Settings → Security → 啟用 **Private vulnerability reporting**（`SECURITY.md` 的回報通道）。
