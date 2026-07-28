#!/usr/bin/env bash
#
# 把建置產物推到 gh-pages 分支的指定位置。
#
#   scripts/deploy-gh-pages.sh <來源目錄> <目標> "<commit 訊息>"
#
#   目標 "."        → 正式站，佔根目錄，但**保留 preview/**
#   目標 "preview"  → 預覽站，只動 preview/，不碰根目錄的任何東西
#
# 為什麼不用 peaceiris/actions-gh-pages 之類的現成 action：
# 正式站與預覽站共用同一個分支，誰都不能清掉對方。那些 action 的
# keep_files / destination_dir 組合語意我沒實測過，與其賭它的行為，
# 不如用逐行讀得懂的做法——這個分支上放的是別人會參照的正式站。
#
# 兩支 workflow 共用 concurrency group「gh-pages-write」序列化寫入，
# 所以這支腳本可以假設同一時間只有一個實例在跑。
set -euo pipefail

SRC="${1:?需要來源目錄}"
DEST="${2:?需要目標（. 或 preview）}"
MSG="${3:-deploy}"

[ -d "$SRC" ] || { echo "::error::來源目錄不存在：$SRC"; exit 1; }

# CI runner 沒有預設的 git 身分，沒有這兩行 commit 會失敗。
git config user.name  >/dev/null 2>&1 || git config user.name  "github-actions[bot]"
git config user.email >/dev/null 2>&1 || git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

WT="$(mktemp -d)"
cleanup() { git worktree remove --force "$WT" >/dev/null 2>&1 || true; }
trap cleanup EXIT

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch --depth=1 origin gh-pages
  git worktree add "$WT" -B gh-pages origin/gh-pages >/dev/null
else
  echo "gh-pages 不存在，建立空分支"
  git worktree add --detach "$WT" >/dev/null
  git -C "$WT" checkout --orphan gh-pages >/dev/null 2>&1
  git -C "$WT" rm -rf . >/dev/null 2>&1 || true
fi

if [ "$DEST" = "." ]; then
  # 正式站：清掉根目錄的一切，但 .git 與 preview/ 留著。
  # preview/ 是 dev 的預覽站，不屬於這支 workflow 管的範圍。
  find "$WT" -mindepth 1 -maxdepth 1 \
    ! -name .git ! -name preview \
    -exec rm -rf {} +
  cp -r "$SRC"/. "$WT"/
else
  # 預覽站：只重建這個子目錄，根目錄的正式站完全不動。
  rm -rf "${WT:?}/${DEST}"
  mkdir -p "$WT/$DEST"
  cp -r "$SRC"/. "$WT/$DEST"/
fi

# GitHub Pages 的分支模式會跑 Jekyll，而 Jekyll 會忽略底線開頭的目錄。
# artifact 模式不跑 Jekyll，所以這個檔案在改用分支模式後才變成必要。
touch "$WT/.nojekyll"

git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "內容無變化，不產生 commit"
  exit 0
fi
git -C "$WT" commit -q -m "$MSG"
git -C "$WT" push origin gh-pages
echo "已部署 $SRC → gh-pages:$DEST"
