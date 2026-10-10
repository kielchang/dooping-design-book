#!/bin/bash
# SessionStart hook — 讓「乾淨 clone」立刻能跑測試與建置。
#
# 為什麼需要這支：`dist/` 在 .gitignore 裡，但 `packages/tokens/dist/tokens.css`
# 是三個地方的硬相依——`tests/tokens.test.ts` 直接讀它、`.storybook/main.ts` 與
# `book/src/css/kit.css` 都 import 它。所以 clone 完不先產生 token 產物，
# `npm test`、Storybook、文件站**三者都會失敗**。CI 有做這一步，人與 agent 沒有提示。
#
# 四個步驟都是幂等的，而且在「已經做過」時幾乎零成本，所以刻意**不**用
# $CLAUDE_CODE_REMOTE 只跑遠端：本機的第一次 checkout 會踩到同一個坑。
#
# 只在 session 啟動時跑（.claude/settings.json 的 matcher: "startup"）：清空對話、壓縮、恢復時不跑。
# 這支會執行當下 checkout 的安裝與建置腳本——對話中途切到別人送來、還沒審過的分支，
# 不該因為一次清空或壓縮就自動執行那個分支的程式。守衛：tests/session-hook.test.ts。
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

# 1. 相依。只在 node_modules 不存在時安裝——避免動到本機開發者既有的環境
#    （`npm install` 有可能改寫 package-lock.json）。
if [ ! -d node_modules ]; then
  echo "[session-start] 安裝相依（npm install）…"
  npm install --no-audit --no-fund
else
  echo "[session-start] node_modules 已存在，跳過安裝"
fi

# 2. 文件站的相依。`book/` 刻意不是 workspace 成員（見 README），所以上面那次安裝
#    不會涵蓋它——少了這一步，`npm run build:book` 在乾淨 clone 上會直接失敗。
#    只在缺少時安裝：這是本 hook 最貴的一步，但容器狀態會被快取，只付一次。
if [ ! -d book/node_modules ]; then
  echo "[session-start] 安裝文件站相依（book/）…"
  npm --prefix book install --no-audit --no-fund
else
  echo "[session-start] book/node_modules 已存在，跳過安裝"
fi

# 3. token 產物。一律重跑：它由 tokens.json 決定、只要兩秒，而且產物過期比沒有更難查。
echo "[session-start] 產生 token 產物（npm run build:tokens）…"
npm run build:tokens --silent

# 4. origin 正規化。repo 已改名為 dooping-design-book（兩個 o）；舊名 doping-design-book
#    靠 GitHub 的改名轉址還能推，但每次 push 都會噴 "This repository moved"，
#    而且環境重建時 provisioning 可能又給回舊名。這裡校正成正式位址。
#    ~/.gitconfig 的 insteadOf 會把它改寫到當下的 git proxy，所以不要寫死 proxy 位址。
#    只改舊名本身：fork、鏡像或別的名字的副本不是舊名，改成正式位址會讓之後的 push 跑到別的 repo。
CANONICAL="https://github.com/kielchang/dooping-design-book.git"
CURRENT="$(git config --get remote.origin.url || true)"
case "$CURRENT" in
  *dooping-design-book*) ;;                       # 已經是新名，不動
  "") echo "[session-start] 沒有 origin，跳過" ;;
  *kielchang/doping-design-book*)
    echo "[session-start] origin 用的是舊名，校正為 $CANONICAL"
    git remote set-url origin "$CANONICAL"
    ;;
  *) echo "[session-start] origin 不是本 repo 的舊名（$CURRENT），不動" ;;
esac

echo "[session-start] 完成。驗證指令：npm test / npm run typecheck / npm run verify:color"
