#!/usr/bin/env sh
#
# 把建置產物推到 gh-pages 分支的指定位置。
#
#   sh scripts/deploy-gh-pages.sh <來源目錄> <目標> "<commit 訊息>"
#
#   目標 "."        → 正式站（main 部署），佔根目錄，但保留 STAGE_DIRS 列的每個段目錄
#   目標 "preview"  → dev 預覽站，只動 preview/
#   目標 "staging"  → 候選版（staging 部署），只動 staging/
#
# STAGE_DIRS 是唯一一份清單：它同時是「允許的部署目標」與「根目錄部署要保留的目錄」。
# 其他目標一律拒絕——例如目標寫成 "r"，會把正式站的 registry 整個蓋掉。
#
# 為什麼不用 peaceiris/actions-gh-pages 之類的現成 action：三段共用同一個分支，誰都不能清掉別人。
# 那些 action 的 keep_files／destination_dir 組合語意沒實測過，與其賭它的行為，
# 不如用逐行讀得懂的做法——這個分支上放的是別人會參照的正式站。
#
# 三段各有自己的 concurrency group（見 .github/workflows/），可能同時寫 gh-pages。
# 每段只動自己的目錄，所以 push 被拒（別段剛推過）時：重抓分支、重套自己的目錄、再推——不會蓋掉別人。
#
# 測試用的環境變數：DEPLOY_REMOTE（預設 origin）、DEPLOY_BRANCH（gh-pages）、
# DEPLOY_ATTEMPTS（5）、DEPLOY_RETRY_DELAY（每次多等幾秒，10）。守衛：tests/deploy-gh-pages.test.ts。
set -eu

STAGE_DIRS="preview staging"

SRC="${1:?需要來源目錄}"
DEST="${2:?需要目標（. 或 preview／staging）}"
MSG="${3:-deploy}"
REMOTE="${DEPLOY_REMOTE:-origin}"
BRANCH="${DEPLOY_BRANCH:-gh-pages}"
MAX_ATTEMPTS="${DEPLOY_ATTEMPTS:-5}"
RETRY_DELAY="${DEPLOY_RETRY_DELAY:-10}"

case " . $STAGE_DIRS " in
  *" $DEST "*) ;;
  *) echo "::error::部署目標只能是 . 或 $STAGE_DIRS（收到：$DEST）" >&2; exit 1 ;;
esac
[ -d "$SRC" ] || { echo "::error::來源目錄不存在：$SRC" >&2; exit 1; }
[ -f "$SRC/index.html" ] || { echo "::error::$SRC 沒有 index.html——不像建置產物，拒絕部署" >&2; exit 1; }
SRC_ABS=$(cd "$SRC" && pwd)

# CI runner 沒有預設的 git 身分，沒有這兩行 commit 會失敗。
git config user.name  >/dev/null 2>&1 || git config user.name  "github-actions[bot]"
git config user.email >/dev/null 2>&1 || git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

WT=$(mktemp -d)
cleanup() { git worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; }
trap cleanup EXIT

if git ls-remote --exit-code --heads "$REMOTE" "$BRANCH" >/dev/null 2>&1; then
  git fetch -q --depth=1 "$REMOTE" "+refs/heads/$BRANCH:refs/remotes/$REMOTE/$BRANCH"
  git worktree add -f "$WT" -B "$BRANCH" "$REMOTE/$BRANCH" >/dev/null 2>&1
else
  echo "$BRANCH 不存在，建立空分支"
  git worktree add -f --detach "$WT" >/dev/null 2>&1
  git -C "$WT" checkout -q --orphan "$BRANCH"
  git -C "$WT" rm -rfq . >/dev/null 2>&1 || true
fi

apply() {
  if [ "$DEST" = "." ]; then
    # 正式站：清掉根目錄的一切，但 .git 與每個段目錄留著——它們不屬於 main 的部署範圍。
    for entry in "$WT"/* "$WT"/.[!.]* "$WT"/..?*; do
      [ -e "$entry" ] || continue
      name=${entry##*/}
      keep=
      for d in .git $STAGE_DIRS; do
        [ "$name" = "$d" ] && keep=1
      done
      [ -n "$keep" ] || rm -rf "$entry"
    done
    cp -R "$SRC_ABS"/. "$WT"/
  else
    # 段目錄：只重建這一個子目錄，根目錄與其他段完全不動。
    rm -rf "${WT:?}/$DEST"
    mkdir -p "$WT/$DEST"
    cp -R "$SRC_ABS"/. "$WT/$DEST"/
  fi
  # GitHub Pages 的分支模式會跑 Jekyll，而 Jekyll 會忽略底線開頭的目錄。
  touch "$WT/.nojekyll"
}

attempt=1
while :; do
  apply
  git -C "$WT" add -A
  if git -C "$WT" diff --cached --quiet; then
    echo "內容無變化，不產生 commit"
    exit 0
  fi
  git -C "$WT" commit -q -m "$MSG"
  if git -C "$WT" push -q "$REMOTE" "HEAD:refs/heads/$BRANCH"; then
    echo "已部署 $SRC → $BRANCH:$DEST"
    exit 0
  fi
  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo "::error::push 連續 $attempt 次被拒，放棄" >&2
    exit 1
  fi
  echo "::warning::push 被拒（第 $attempt 次）——重抓 $BRANCH、重套 $DEST 再推"
  sleep $((RETRY_DELAY * attempt))
  attempt=$((attempt + 1))
  git fetch -q --depth=1 "$REMOTE" "+refs/heads/$BRANCH:refs/remotes/$REMOTE/$BRANCH"
  git -C "$WT" reset -q --hard "$REMOTE/$BRANCH"
  git -C "$WT" clean -qfdx
done
