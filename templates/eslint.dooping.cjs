// Dooping 防漂移 lint 規則——複製到你的專案，不是 npm 套件。
//
// 為什麼是複製而不是發套件：跟元件走 registry 是同一個判斷（ADR-0004）。
// 這些規則你一定會依專案調整（白名單、例外檔案），複製走之後它就是你的規則。
//
// 用法（.eslintrc.cjs）：
//   module.exports = { extends: ["./eslint.dooping.cjs"] };
//
// 這是三道防漂移防線的第二道：
//   1. 編譯層 —— @dooping/tokens 的 Tailwind preset 已清空預設色盤，bg-red-500 寫不出來
//   2. lint（這支）—— 擋掉繞過編譯層的逃逸路徑：raw hex、arbitrary value、深入內部路徑
//   3. 視覺回歸 —— 讓「改壞了」看得見（需另外建置）
//
// 第一道擋不住的是「繞路」：bg-[#ff0000]、style={{color:'#f00'}}、直接 import 元件內部。
// 這支就是在補那些洞。
module.exports = {
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        // Tailwind arbitrary color：bg-[#fff]、text-[rgb(0,0,0)]、border-[hsl(...)]
        // 這是繞過編譯層最常見的一條路，而且 review 時很容易看漏。
        selector:
          "Literal[value=/(?:bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|divide|placeholder|caret|accent)-\\[(?:#|rgb|hsl|oklch|color\\()/]",
        message:
          "不要用 Tailwind arbitrary color（bg-[#fff]）。改用語意色 utility（bg-primary、text-danger…）。真的需要新顏色，請走 RFC 流程加進 token。",
      },
      {
        // inline style 裡的硬編色：style={{ color: '#f00' }}
        //
        // 負向前瞻放行含 var(--…) 的值：hsl(var(--danger)) 正是這條規則推薦的替代寫法，
        // 少了它會把正確用法一起擋掉（實測踩過）。
        selector:
          "JSXAttribute[name.name='style'] Property[key.name=/^(color|background|backgroundColor|borderColor|fill|stroke|outlineColor)$/] > Literal[value=/^(?!.*var\\(--)(#|rgb|hsl)/]",
        message:
          "不要在 inline style 硬編顏色。改用語意色 class，或 hsl(var(--token) / <alpha>)。",
      },
    ],

    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            // 元件複製進來後的落點是 @/components/dooping/*，那是公開介面。
            // 深入 src/ui、src/form 這類上游內部路徑代表相依了不保證穩定的東西。
            group: ["**/dooping/src/**", "@dooping/react/src/**", "@dooping/tokens/src/**"],
            message:
              "不要 import 上游的內部路徑。元件用 @/components/dooping/*，token 用 @dooping/tokens 的公開匯出。",
          },
        ],
      },
    ],
  },

  overrides: [
    {
      // token 的來源檔本來就會出現 hex 與 hsl 字面值，不適用上述規則。
      // 你的專案若有自訂 token 檔，把路徑加進來。
      files: ["**/tokens.json", "**/tokens*.ts", "**/tailwind-preset*.cjs", "**/*.stories.*"],
      rules: { "no-restricted-syntax": "off" },
    },
  ],
};
