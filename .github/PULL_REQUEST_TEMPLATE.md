<!--
  三種 PR，只留你這一種，其他整段刪掉。流程正本：book/docs/7-governance/01-versioning.mdx「三段式發布」。
    一般 PR（開到 dev）             → 留「改了什麼／自查」
    候選版 PR（dev → staging）      → 只貼 CHANGELOG 最上面那一節
    核准 PR（staging → main）       → 貼 CHANGELOG 該節，並逐項勾完「核准清單」（pr-gate 會檢查）
  新元件／新 token／改語意：先在宿主做並記台帳，三次法則過了再開 RFC issue（issues/new?template=rfc.yml）提回上游。
-->

## 改了什麼／為什麼

<!-- 一兩句講清楚。小調整（文案、對比、一個 prop）附截圖或前後對照最有效。 -->

## 自查

- [ ] `npm run build:tokens` → `npm run typecheck` → `npm test` 全綠
- [ ] 改了 `packages/react/src` → `npm run build:registry` 並提交 `registry/`
- [ ] 取用端可感知的變更 → 版號三處同步（根 `package.json`、`packages/react/package.json`、`packages/react/src/version.ts`）
- [ ] `CHANGELOG.md` 未發佈節補一則（改了什麼／我需要做什麼／為什麼改）
- [ ] 措辭過去領域化詞表（示範用中性詞：項目／單位／類別／批次／紀錄）

## 核准清單

<!-- 只有 staging → main 的 PR 需要。勾完才算核准；勾完後 pr-gate 會自動重跑。 -->

- [ ] `/staging/` 文件站：本版 CHANGELOG 提到的頁看過，候選版橫幅在
- [ ] `/staging/host/` 手機看過：五種頁型、深色模式、390px 寬
- [ ] `/staging/storybook/`：本版動到的元件 story 看過
- [ ] staging run 摘要的 registry 異動清單與 CHANGELOG「我需要做什麼」對得上
- [ ] token 有變的話：合併後推 `tokens-v<版號>`（token 沒變就勾並註明）
