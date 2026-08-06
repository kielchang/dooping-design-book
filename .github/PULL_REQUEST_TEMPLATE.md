<!-- 進版 PR（dev → main）不適用此模板：整段刪掉、貼 CHANGELOG 的該節即可。 -->
<!-- 新元件／新 token／改語意：請先開 RFC issue（issues/new?template=rfc.yml），合併過的 RFC 才實作。 -->

## 改了什麼／為什麼

<!-- 一兩句講清楚。小調整（文案、對比、一個 prop）附截圖或前後對照最有效。 -->

## 自查

- [ ] `npm run build:tokens` → `npm run typecheck` → `npm test` 全綠
- [ ] 改了 `packages/react/src` → `npm run build:registry` 並提交 `registry/`
- [ ] 取用端可感知的變更 → 版號三處同步（根 `package.json`、`packages/react/package.json`、`packages/react/src/version.ts`）
- [ ] `CHANGELOG.md` 未發佈節補一則（改了什麼／我需要做什麼／為什麼改）
- [ ] 措辭過去領域化詞表（示範用中性詞：項目／單位／類別／批次／紀錄）
