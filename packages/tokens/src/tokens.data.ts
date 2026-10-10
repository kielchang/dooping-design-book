// 由 scripts/build-css.mjs 從 tokens.json 產生，請勿手改。
export default {
  "$comment": "Dooping 設計 token 唯一來源（框架中立）。CSS 變數與 Tailwind preset 皆由此檔產生，勿直接改 dist/。色彩值以 HSL 三元組字串表示（可被 hsl(var(--x) / <alpha>) 套用透明度）；chart.* 例外為 hex（SVG fill/stroke 直接吃 var()，不經 hsl() 包裝）。",
  "meta": {
    "name": "dooping",
    "version": "0.8.0",
    "defaultTheme": "graphite"
  },
  "color": {
    "$comment": "語意色：命名說的是「這個顏色代表什麼意思」，不是「這是什麼顏色」。換色票時只改這裡，全站語意不變。",
    "light": {
      "background": {
        "value": "0 0% 100%",
        "desc": "頁面底色"
      },
      "foreground": {
        "value": "222.2 84% 4.9%",
        "desc": "頁面主要文字"
      },
      "card": {
        "value": "0 0% 100%",
        "desc": "卡片表面"
      },
      "card-foreground": {
        "value": "222.2 84% 4.9%",
        "desc": "卡片上的文字"
      },
      "popover": {
        "value": "0 0% 100%",
        "desc": "浮層表面（下拉／泡泡／篩選面板）"
      },
      "popover-foreground": {
        "value": "222.2 84% 4.9%",
        "desc": "浮層文字"
      },
      "primary": {
        "value": "222.2 47.4% 11.2%",
        "desc": "主要動作／品牌強調"
      },
      "primary-foreground": {
        "value": "210 40% 98%",
        "desc": "主色上的文字"
      },
      "secondary": {
        "value": "210 40% 96.1%",
        "desc": "次要動作表面"
      },
      "secondary-foreground": {
        "value": "222.2 47.4% 11.2%",
        "desc": "次要動作文字"
      },
      "muted": {
        "value": "210 40% 96.1%",
        "desc": "弱化表面（唯讀區、斑馬列）"
      },
      "muted-foreground": {
        "value": "215.4 16.3% 46.9%",
        "desc": "次要／說明文字"
      },
      "accent": {
        "value": "210 40% 96.1%",
        "desc": "hover／被指向的表面"
      },
      "accent-foreground": {
        "value": "222.2 47.4% 11.2%",
        "desc": "accent 上的文字"
      },
      "destructive": {
        "value": "357.9 70.6% 52%",
        "desc": "破壞性動作控制項（刪除鈕）——控制項語意，非狀態語意"
      },
      "destructive-foreground": {
        "value": "210 40% 98%",
        "desc": "destructive 上的文字"
      },
      "border": {
        "value": "214.3 31.8% 91.4%",
        "desc": "一般分隔線／邊框"
      },
      "input": {
        "value": "214.3 31.8% 91.4%",
        "desc": "表單控制項邊框"
      },
      "ring": {
        "value": "222.2 84% 4.9%",
        "desc": "鍵盤聚焦環（中性，不吃主題色相：焦點與欄位提醒色分家，換主題也不會誤讀）"
      },
      "success": {
        "value": "160 84% 39%",
        "desc": "狀態：良好／已完成／通過"
      },
      "success-foreground": {
        "value": "158.8 100% 12.7%",
        "desc": "success 底上的文字"
      },
      "warning": {
        "value": "38 92% 50%",
        "desc": "狀態：需要注意但不阻擋"
      },
      "warning-foreground": {
        "value": "37.3 100% 19.2%",
        "desc": "warning 底上的文字"
      },
      "info": {
        "value": "199 89% 48%",
        "desc": "狀態：中性提示／補充說明"
      },
      "info-foreground": {
        "value": "200.3 100% 15.7%",
        "desc": "info 底上的文字"
      },
      "danger": {
        "value": "347 77% 50%",
        "desc": "狀態：異常／錯誤／不合格（訊息與數值用；控制項用 destructive）"
      },
      "danger-foreground": {
        "value": "0 0% 100%",
        "desc": "danger 底上的文字"
      },
      "edit": {
        "value": "43 96% 56%",
        "desc": "保留色：已改動未送出（邊框）。此琥珀不得挪作他用"
      },
      "edit-foreground": {
        "value": "23 78% 26%",
        "desc": "已改動未送出（文字）"
      },
      "edit-bg": {
        "value": "48 100% 96%",
        "desc": "已改動未送出（底色）"
      },
      "field-editable": {
        "value": "214 100% 98%",
        "desc": "欄位語意：可編輯（極淡冷底）"
      },
      "field-editable-foreground": {
        "value": "222 47% 11%",
        "desc": "可編輯欄位文字"
      },
      "field-readonly": {
        "value": "214 15% 95%",
        "desc": "欄位語意：唯讀／計算值"
      },
      "field-readonly-foreground": {
        "value": "215 16% 40%",
        "desc": "唯讀欄位文字"
      },
      "field-border": {
        "value": "214 30% 80%",
        "desc": "可編輯欄位邊框（冷灰藍，刻意不像狀態色）"
      },
      "info-subtle": {
        "value": "205 100% 88%",
        "desc": "info 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "info-subtle-foreground": {
        "value": "201.1 69.3% 34.5%",
        "desc": "info-subtle 上的文字"
      },
      "warning-subtle": {
        "value": "32.1 73.7% 85.1%",
        "desc": "warning 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "warning-subtle-foreground": {
        "value": "35.5 73.2% 30.8%",
        "desc": "warning-subtle 上的文字"
      },
      "danger-subtle": {
        "value": "0 78% 91%",
        "desc": "danger 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "danger-subtle-foreground": {
        "value": "356 33% 44.5%",
        "desc": "danger-subtle 上的文字"
      },
      "success-subtle": {
        "value": "146.9 38.7% 85.3%",
        "desc": "success 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "success-subtle-foreground": {
        "value": "157.8 67.6% 26.7%",
        "desc": "success-subtle 上的文字"
      },
      "sidebar": {
        "value": "210 100% 98.4%",
        "desc": "側邊欄／外殼表面：比頁面底沉一階的安靜區（目標 ΔE00 反解，非挑色）"
      },
      "sidebar-foreground": {
        "value": "222.2 84% 4.9%",
        "desc": "sidebar 上的文字＝foreground 別名（生成器保證同值）"
      },
      "sidebar-border": {
        "value": "214.3 31.8% 91.4%",
        "desc": "側欄邊線＝border 別名（生成器保證同值）"
      },
      "sidebar-ring": {
        "value": "222.2 84% 4.9%",
        "desc": "側欄聚焦環＝ring 別名（預設外殼；環境主題換成近白）"
      },
      "sidebar-muted-foreground": {
        "value": "215.4 16.3% 46.9%",
        "desc": "外殼上的次要文字（群組標題等）＝muted-foreground 別名（預設外殼）"
      }
    },
    "dark": {
      "$comment": "深色不是機械式反轉：沿用同一冷靛藍色相，飽和度壓低成沉靜墨色，並建立 5 級表面抬升（background < card < popover < muted/secondary/accent < border/input）。",
      "background": {
        "value": "222 22% 8%"
      },
      "foreground": {
        "value": "210 40% 98%"
      },
      "card": {
        "value": "222 20% 12%"
      },
      "card-foreground": {
        "value": "210 30% 96%"
      },
      "popover": {
        "value": "222 20% 15%"
      },
      "popover-foreground": {
        "value": "210 30% 96%"
      },
      "primary": {
        "value": "210 40% 98%"
      },
      "primary-foreground": {
        "value": "222.2 47.4% 11.2%"
      },
      "secondary": {
        "value": "222 18% 18%"
      },
      "secondary-foreground": {
        "value": "210 30% 96%"
      },
      "muted": {
        "value": "222 18% 18%"
      },
      "muted-foreground": {
        "value": "215 20.2% 65.1%"
      },
      "accent": {
        "value": "222 18% 18%"
      },
      "accent-foreground": {
        "value": "210 30% 96%"
      },
      "destructive": {
        "value": "0 62.8% 30.6%"
      },
      "destructive-foreground": {
        "value": "210 40% 98%"
      },
      "border": {
        "value": "222 16% 22%"
      },
      "input": {
        "value": "222 16% 22%"
      },
      "ring": {
        "value": "210 30% 80%",
        "desc": "鍵盤聚焦環（中性，不吃主題色相：焦點與欄位提醒色分家，換主題也不會誤讀）"
      },
      "success": {
        "value": "160 60% 45%"
      },
      "success-foreground": {
        "value": "162.1 100% 13.1%"
      },
      "warning": {
        "value": "38 92% 55%"
      },
      "warning-foreground": {
        "value": "38 100% 20%"
      },
      "info": {
        "value": "199 89% 55%"
      },
      "info-foreground": {
        "value": "198.5 100% 18.4%"
      },
      "danger": {
        "value": "345.8 69% 53.1%"
      },
      "danger-foreground": {
        "value": "0 0% 100%"
      },
      "edit": {
        "value": "43 90% 60%"
      },
      "edit-foreground": {
        "value": "43 96% 76%"
      },
      "edit-bg": {
        "value": "26 60% 14%"
      },
      "field-editable": {
        "value": "216 22% 17%"
      },
      "field-editable-foreground": {
        "value": "210 30% 92%"
      },
      "field-readonly": {
        "value": "222 16% 15%"
      },
      "field-readonly-foreground": {
        "value": "215 20% 65%"
      },
      "field-border": {
        "value": "215 18% 34%"
      },
      "info-subtle": {
        "value": "198.1 100% 18.8%",
        "desc": "info 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "info-subtle-foreground": {
        "value": "201.3 64% 62.9%",
        "desc": "info-subtle 上的文字"
      },
      "warning-subtle": {
        "value": "34 18% 23%",
        "desc": "warning 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "warning-subtle-foreground": {
        "value": "34.8 53.3% 58.8%",
        "desc": "warning-subtle 上的文字"
      },
      "danger-subtle": {
        "value": "354.5 16.7% 25.9%",
        "desc": "danger 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "danger-subtle-foreground": {
        "value": "353.3 57.4% 72.4%",
        "desc": "danger-subtle 上的文字"
      },
      "success-subtle": {
        "value": "153.8 13.8% 22.7%",
        "desc": "success 低強度提示的底色（Carbon 雙強度的低強度層）"
      },
      "success-subtle-foreground": {
        "value": "155.5 38.9% 55.7%",
        "desc": "success-subtle 上的文字"
      },
      "sidebar": {
        "value": "222.9 26.9% 10.2%",
        "desc": "側邊欄／外殼表面：比頁面底沉一階的安靜區（目標 ΔE00 反解，非挑色）"
      },
      "sidebar-foreground": {
        "value": "210 40% 98%",
        "desc": "sidebar 上的文字＝foreground 別名（生成器保證同值）"
      },
      "sidebar-border": {
        "value": "222 16% 22%",
        "desc": "側欄邊線＝border 別名（生成器保證同值）"
      },
      "sidebar-ring": {
        "value": "210 30% 80%",
        "desc": "側欄聚焦環＝ring 別名（預設外殼；環境主題換成近白）"
      },
      "sidebar-muted-foreground": {
        "value": "215 20.2% 65.1%",
        "desc": "外殼上的次要文字（群組標題等）＝muted-foreground 別名（預設外殼）"
      }
    }
  },
  "chart": {
    "light": {
      "chart-1": {
        "value": "#006dbd"
      },
      "chart-2": {
        "value": "#7aa121"
      },
      "chart-3": {
        "value": "#005636"
      },
      "chart-4": {
        "value": "#00a495"
      },
      "chart-5": {
        "value": "#7b135c"
      },
      "chart-6": {
        "value": "#736a00"
      },
      "chart-7": {
        "value": "#8b89f4"
      },
      "chart-8": {
        "value": "#00818d"
      },
      "chart-axis": {
        "value": "#cbd5e1",
        "desc": "座標軸"
      },
      "chart-grid": {
        "value": "#e2e8f0",
        "desc": "格線"
      },
      "chart-text": {
        "value": "#475569",
        "desc": "圖表文字"
      }
    },
    "dark": {
      "chart-1": {
        "value": "#66a3f4"
      },
      "chart-2": {
        "value": "#7e6f00"
      },
      "chart-3": {
        "value": "#9fef9e"
      },
      "chart-4": {
        "value": "#a74877"
      },
      "chart-5": {
        "value": "#4cf4eb"
      },
      "chart-6": {
        "value": "#8faa41"
      },
      "chart-7": {
        "value": "#6c6ac3"
      },
      "chart-8": {
        "value": "#f88995"
      },
      "chart-axis": {
        "value": "#3a465c"
      },
      "chart-grid": {
        "value": "#131c2b"
      },
      "chart-text": {
        "value": "#94a3b8"
      }
    },
    "$comment": "分類色票（8 色）：淺／深各生一組獨立值，不共用。共用會把 L 鎖在 [0.49,0.67] 的窄帶，八色擠在中明度，二色覺下必然糊成一團。順序即安全性順序——最遠點插入的副產物，取用端拿 chart-1..chart-k 永遠是近似最佳的 k 色子集。狀態語意與分類色票脫鉤，且分類色與 danger 的感知距離硬性 ≥18（紅線會被讀成警告）。"
  },
  "radius": {
    "$comment": "圓角以 --radius 為基準推導，換一個值即可整站從方到圓。",
    "base": {
      "value": "0.5rem"
    },
    "sm": {
      "value": "calc(var(--radius) - 4px)"
    },
    "md": {
      "value": "calc(var(--radius) - 2px)"
    },
    "lg": {
      "value": "var(--radius)"
    },
    "full": {
      "value": "9999px"
    }
  },
  "space": {
    "1": {
      "value": "0.25rem"
    },
    "2": {
      "value": "0.5rem"
    },
    "3": {
      "value": "0.75rem"
    },
    "4": {
      "value": "1rem"
    },
    "6": {
      "value": "1.5rem"
    },
    "8": {
      "value": "2rem"
    },
    "12": {
      "value": "3rem"
    },
    "$comment": "4px 基準的間距階；元件內距（p-2/p-3/p-6）與元素間距（gap-1/gap-2）都取自這裡。",
    "0.5": {
      "value": "0.125rem"
    },
    "1.5": {
      "value": "0.375rem"
    },
    "2.5": {
      "value": "0.625rem"
    }
  },
  "fontSize": {
    "$comment": "字級只有 6 階，刻意少：資訊密度高的後台介面靠「字重＋顏色」分層，不靠字級爆炸。",
    "micro": {
      "value": "0.625rem",
      "lineHeight": "0.875rem",
      "desc": "10px：徽章內文字、極次要註記"
    },
    "tiny": {
      "value": "0.6875rem",
      "lineHeight": "1rem",
      "desc": "11px：欄位說明、圖例"
    },
    "xs": {
      "value": "0.75rem",
      "lineHeight": "1rem",
      "desc": "12px：表格次要欄、標籤"
    },
    "sm": {
      "value": "0.875rem",
      "lineHeight": "1.25rem",
      "desc": "14px：介面預設字級"
    },
    "base": {
      "value": "1rem",
      "lineHeight": "1.5rem",
      "desc": "16px：內文"
    },
    "lg": {
      "value": "1.125rem",
      "lineHeight": "1.75rem",
      "desc": "18px：卡片標題"
    },
    "xl": {
      "value": "1.5rem",
      "lineHeight": "2rem",
      "desc": "24px：頁面標題"
    }
  },
  "fontFamily": {
    "sans": {
      "value": "ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", \"Noto Sans TC\", \"PingFang TC\", \"Microsoft JhengHei\", sans-serif"
    },
    "mono": {
      "value": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    }
  },
  "shadow": {
    "$comment": "陰影＝表面抬升層級，不是裝飾。深色模式靠表面亮度分層，陰影效果本來就弱，所以層級最多 3 階。",
    "sm": {
      "value": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "desc": "貼地：卡片、輸入框"
    },
    "md": {
      "value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "desc": "抬起：下拉選單"
    },
    "lg": {
      "value": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      "desc": "浮起：對話框、導引卡"
    }
  },
  "duration": {
    "$comment": "動態時長：介面回饋越即時越好。超過 300ms 的動畫在後台系統只會讓人等。全部受 prefers-reduced-motion 保護。",
    "instant": {
      "value": "0ms",
      "desc": "無動畫（reduced-motion 降級目標）"
    },
    "fast": {
      "value": "150ms",
      "desc": "顏色／透明度回饋（hover、focus）"
    },
    "normal": {
      "value": "200ms",
      "desc": "浮層出現、展開收合"
    },
    "slow": {
      "value": "1500ms",
      "desc": "循環式引導脈動（唯一允許的長動畫，且必須可停）"
    }
  },
  "easing": {
    "standard": {
      "value": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "out": {
      "value": "cubic-bezier(0, 0, 0.2, 1)"
    }
  },
  "size": {
    "$comment": "互動尺寸：粗指標裝置的觸控目標下限來自 WCAG 2.5.5。",
    "control-sm": {
      "value": "2rem",
      "desc": "32px：密集表格內的控制項"
    },
    "control": {
      "value": "2.25rem",
      "desc": "36px：預設輸入框／欄位高度"
    },
    "control-lg": {
      "value": "2.5rem",
      "desc": "40px：主要按鈕"
    },
    "tap-target": {
      "value": "44px",
      "desc": "粗指標裝置的最小觸控目標（WCAG 2.5.5）"
    }
  },
  "state": {
    "$comment": "互動狀態層的強度（百分比，不是顏色）。疊加色一律取元件自己的 currentColor，因此同一組數值在任何底色、任何模式上都成立，不必為每個角色各生一組 hover 色。強度依「這個狀態持續多久」排序：瞬間的回饋輕、持久的狀態才配得上明顯的顏色。淺深兩模式共用同一組值——深色下實測比淺色強約三成（低亮度端的感知壓縮），但四道門檻都還在範圍內。",
    "hover-alpha": {
      "value": "6%",
      "desc": "指標懸停：只說「這個可以互動」。實測 ΔE00 3.0（淺）／3.9（深）"
    },
    "pressed-alpha": {
      "value": "14%",
      "desc": "按住的瞬間：系統收到了。實測距 hover ΔE00 4.3（淺）／5.3（深）"
    },
    "selected-alpha": {
      "value": "20%",
      "desc": "已選（持續到改選）。實測距底色 ΔE00 10.8（淺）／14.5（深）；上限 16 卡在深色模式的頁面底色——那是全系統最深的表面，同一個 alpha 在它上面的感知落差最大，22% 會衝到 16.1"
    }
  },
  "themes": {
    "graphite": {
      "$label": "石墨",
      "$hue": 265,
      "$family": "neutral",
      "$term": "灰",
      "$tier": "default",
      "light": {
        "background": {
          "value": "0 0% 100%",
          "desc": "頁面底色"
        },
        "card": {
          "value": "0 0% 100%",
          "desc": "卡片表面"
        },
        "popover": {
          "value": "0 0% 100%",
          "desc": "浮層表面（下拉／泡泡／篩選面板）"
        },
        "muted": {
          "value": "214.3 36.8% 96.3%",
          "desc": "弱化表面（唯讀區、斑馬列）"
        },
        "secondary": {
          "value": "214.3 36.8% 96.3%",
          "desc": "次要動作表面"
        },
        "accent": {
          "value": "214.3 36.8% 96.3%",
          "desc": "hover／被指向的表面"
        },
        "border": {
          "value": "221.5 30.2% 91.6%",
          "desc": "一般分隔線／邊框"
        },
        "input": {
          "value": "221.5 30.2% 91.6%",
          "desc": "表單控制項邊框"
        },
        "field-border": {
          "value": "220 27.3% 80.6%",
          "desc": "可編輯欄位邊框（冷灰藍，刻意不像狀態色）"
        },
        "muted-foreground": {
          "value": "221.7 15.1% 46.7%",
          "desc": "次要／說明文字"
        },
        "field-editable": {
          "value": "220 100% 98.2%",
          "desc": "欄位語意：可編輯（極淡冷底）"
        },
        "field-readonly": {
          "value": "220 12% 95%",
          "desc": "欄位語意：唯讀／計算值"
        },
        "sidebar": {
          "value": "222.9 100% 98.6%",
          "desc": "側邊欄／外殼表面：比頁面底沉一階的安靜區（目標 ΔE00 反解，非挑色）"
        },
        "sidebar-border": {
          "value": "221.5 30.2% 91.6%",
          "desc": "側欄邊線＝border 別名（生成器保證同值）"
        },
        "brand": {
          "value": "222.2 47.4% 11.2%",
          "desc": "品牌色：鏡射 primary，所有主題同值（主題只換外殼）"
        },
        "brand-foreground": {
          "value": "210 40% 98%",
          "desc": "brand 上的文字（鏡射 primary-foreground）"
        },
        "brand-subtle": {
          "value": "220.6 100% 93.3%",
          "desc": "中性淡底：選中的導覽項、分頁底線區"
        },
        "brand-subtle-foreground": {
          "value": "221.5 11.9% 42.7%",
          "desc": "brand-subtle 上的文字"
        },
        "sidebar-primary": {
          "value": "222.2 47.4% 11.2%",
          "desc": "外殼上的標誌塊＝brand 別名（預設外殼）"
        },
        "sidebar-primary-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-primary 上的文字＝brand-foreground 別名"
        },
        "sidebar-accent": {
          "value": "220.6 100% 93.3%",
          "desc": "選中的側欄項底色＝brand-subtle 別名（預設外殼）"
        },
        "sidebar-accent-foreground": {
          "value": "221.5 11.9% 42.7%",
          "desc": "sidebar-accent 上的文字＝brand-subtle-foreground 別名"
        },
        "sidebar-muted-foreground": {
          "value": "221.7 15.1% 46.7%",
          "desc": "外殼上的次要文字＝muted-foreground 別名（預設外殼）"
        }
      },
      "dark": {
        "background": {
          "value": "220 22% 8%"
        },
        "card": {
          "value": "222 21% 12%"
        },
        "popover": {
          "value": "221 21% 15%"
        },
        "muted": {
          "value": "221 17% 18%"
        },
        "secondary": {
          "value": "221 17% 18%"
        },
        "accent": {
          "value": "221 17% 18%"
        },
        "border": {
          "value": "220 16% 22%"
        },
        "input": {
          "value": "220 16% 22%"
        },
        "field-border": {
          "value": "220.7 15.9% 34.5%"
        },
        "muted-foreground": {
          "value": "220 15.9% 59.4%"
        },
        "field-editable": {
          "value": "220 20.5% 17.3%"
        },
        "field-readonly": {
          "value": "220 16% 15%"
        },
        "sidebar": {
          "value": "222.9 26.9% 10.2%",
          "desc": "側邊欄／外殼表面：比頁面底沉一階的安靜區（目標 ΔE00 反解，非挑色）"
        },
        "sidebar-border": {
          "value": "220 16% 22%",
          "desc": "側欄邊線＝border 別名（生成器保證同值）"
        },
        "brand": {
          "value": "210 40% 98%",
          "desc": "品牌色：鏡射 primary，所有主題同值（主題只換外殼）"
        },
        "brand-foreground": {
          "value": "222.2 47.4% 11.2%",
          "desc": "brand 上的文字（鏡射 primary-foreground）"
        },
        "brand-subtle": {
          "value": "222.9 58.3% 14.1%",
          "desc": "中性淡底：選中的導覽項、分頁底線區"
        },
        "brand-subtle-foreground": {
          "value": "219 8.3% 52.9%",
          "desc": "brand-subtle 上的文字"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊＝brand 別名（預設外殼）"
        },
        "sidebar-primary-foreground": {
          "value": "222.2 47.4% 11.2%",
          "desc": "sidebar-primary 上的文字＝brand-foreground 別名"
        },
        "sidebar-accent": {
          "value": "222.9 58.3% 14.1%",
          "desc": "選中的側欄項底色＝brand-subtle 別名（預設外殼）"
        },
        "sidebar-accent-foreground": {
          "value": "219 8.3% 52.9%",
          "desc": "sidebar-accent 上的文字＝brand-subtle-foreground 別名"
        },
        "sidebar-muted-foreground": {
          "value": "220 15.9% 59.4%",
          "desc": "外殼上的次要文字＝muted-foreground 別名（預設外殼）"
        }
      }
    },
    "slate": {
      "$label": "石板",
      "$hue": 265,
      "$family": "neutral",
      "$term": "灰",
      "$tier": "neutral",
      "light": {
        "sidebar": {
          "value": "220 12.5% 18.8%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "217.9 9.6% 61.4%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "220 9% 26.3%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "220 8.2% 28.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "220 12.5% 18.8%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "222 9.1% 21.6%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "217.9 10.6% 64.9%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "216 6.8% 28.6%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "216 6% 31%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "222 9.1% 21.6%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "berry": {
      "$label": "莓紅",
      "$hue": 5,
      "$family": "red",
      "$term": "紅",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "344.7 37.1% 31.2%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "346.7 13.4% 73.7%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "345.2 31% 38.6%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "345 29% 41%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "344.7 37.1% 31.2%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "345 30.1% 28.6%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "349.4 11.6% 71.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "347 25% 36%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "347 23.5% 38.4%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "345 30.1% 28.6%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "berry-deep": {
      "$label": "深莓紅",
      "$hue": 5,
      "$family": "red",
      "$term": "紅",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "343 49% 18%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "348.8 7.6% 58.8%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "344.3 34.8% 25.9%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "344.7 32.4% 28.4%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "343 49% 18%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "344.1 39.5% 16.9%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "348.8 7.5% 58%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "345 28.6% 24.7%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "347 26.6% 27.3%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "344.1 39.5% 16.9%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "rust": {
      "$label": "赭",
      "$hue": 45,
      "$family": "orange",
      "$term": "橙",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "19.7 57.7% 26.9%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "18.3 16.5% 72.7%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "19.3 46.3% 34.3%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "19 43.6% 36.9%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "19.7 57.7% 26.9%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "18.3 45% 25.7%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "16.4 14.5% 70.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "18.7 36.5% 32.7%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "19 34% 35%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "18.3 45% 25.7%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "rust-deep": {
      "$label": "深赭",
      "$hue": 45,
      "$family": "orange",
      "$term": "橙",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "20.3 83.8% 14.5%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "20 9.8% 57.8%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "19 54% 23%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "19 48.8% 25.3%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "20.3 83.8% 14.5%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "19.6 62.2% 14.5%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "20 9.6% 57.1%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "18.8 42.1% 22.4%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "18.4 38.6% 24.9%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "19.6 62.2% 14.5%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "olive": {
      "$label": "橄欖",
      "$hue": 95,
      "$family": "yellow",
      "$term": "黃褐",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "49.5 100% 16.9%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "46.7 12.5% 71.8%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "48.3 64.1% 25.1%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "48.1 58.3% 27.3%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "49.5 100% 16.9%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "48 59% 19%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "46.7 11.2% 68.6%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "48.2 41.8% 26.3%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "47.4 38.8% 28.8%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "48 59% 19%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "olive-deep": {
      "$label": "深橄欖",
      "$hue": 95,
      "$family": "yellow",
      "$term": "黃褐",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "48 100% 9.8%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "45.9 7.6% 56.3%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "49.3 100% 13.1%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "48.9 76.5% 16.7%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "48 100% 9.8%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "48.5 100% 9.2%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "49.4 7.4% 55.1%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "48 53% 17%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "47 46% 19.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "48.5 100% 9.2%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "moss": {
      "$label": "苔綠",
      "$hue": 140,
      "$family": "green",
      "$term": "綠",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "108.5 39.5% 23.3%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "106.2 9.6% 73.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "109.8 30.3% 30.4%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "109.8 28.1% 32.7%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "108.5 39.5% 23.3%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "109.4 29.3% 22.7%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "110 7.9% 70.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "109.7 23.2% 29.6%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "110 21% 32%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "109.4 29.3% 22.7%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "moss-deep": {
      "$label": "深苔綠",
      "$hue": 140,
      "$family": "green",
      "$term": "綠",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "108.3 58.1% 12.2%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "110 5.6% 57.6%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "108.6 36.6% 19.8%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "108.6 32.7% 22.2%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "108.3 58.1% 12.2%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "108.9 42.9% 12.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "110 5.4% 56.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "109 27% 20%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "109.3 24.6% 22.4%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "108.9 42.9% 12.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "teal": {
      "$label": "青玉",
      "$hue": 190,
      "$family": "cyan",
      "$term": "青",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "177.8 100% 16.3%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "173.3 12.9% 72.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "177.6 100% 20%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "177.2 100% 21.2%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "177.8 100% 16.3%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "177.6 94.9% 15.5%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "176.7 11.5% 69.4%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "176.4 52.4% 24.7%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "176 47% 27%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "177.6 94.9% 15.5%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "teal-deep": {
      "$label": "深青玉",
      "$hue": 190,
      "$family": "cyan",
      "$term": "青",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "177.5 100% 9.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "173.3 8.1% 56.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "177.3 100% 13.1%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "177.6 100% 14.5%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "177.5 100% 9.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "176 100% 9%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "173.3 8% 55.7%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "176.8 76% 14.7%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "176.7 60% 17.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "176 100% 9%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "lagoon": {
      "$label": "湖水",
      "$hue": 230,
      "$family": "azure",
      "$term": "青藍",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "195.3 100% 20.8%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "198.3 17% 73.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "196.8 72.8% 28.8%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "197.1 65.2% 31.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "195.3 100% 20.8%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "197.8 64.9% 22.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "199.1 14.5% 70.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "198.3 46.8% 30.2%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "198.9 44.2% 32.4%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "197.8 64.9% 22.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "lagoon-deep": {
      "$label": "深湖水",
      "$hue": 230,
      "$family": "azure",
      "$term": "青藍",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "197.1 100% 12.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "199.1 10.2% 57.6%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "196 100% 17%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "196 84% 20%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "197.1 100% 12.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "197 100% 11.8%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "199 10% 57%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "198 59% 20%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "198.3 51.3% 22.5%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "197 100% 11.8%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "indigo": {
      "$label": "靛藍",
      "$hue": 265,
      "$family": "blue",
      "$term": "藍",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "221.5 41% 32.5%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "219 15.4% 74.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "221.4 35% 39.8%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "221 34% 42%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "221.5 41% 32.5%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "221.5 34.7% 29.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "219 13.7% 71.4%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "221.1 29% 36.5%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "221 28% 39%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "221.5 34.7% 29.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "indigo-deep": {
      "$label": "深靛藍",
      "$hue": 265,
      "$family": "blue",
      "$term": "藍",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "222.4 51.5% 19.4%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "218 9% 59%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "221.5 40.1% 26.9%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "221.8 37.3% 29.4%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "222.4 51.5% 19.4%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "222 44.4% 17.6%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "221.1 8.9% 58.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "220.5 33.9% 24.9%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "220.9 31% 27.8%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "222 44.4% 17.6%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "violet": {
      "$label": "紫羅蘭",
      "$hue": 310,
      "$family": "purple",
      "$term": "紫",
      "$tier": "base",
      "light": {
        "sidebar": {
          "value": "276 30% 32%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "272.3 9.6% 73.5%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "274.8 25% 39.2%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "273.6 23.6% 41.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "276 30% 32%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "275 24% 29%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "272.3 8.8% 71.2%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "274.1 20% 36.3%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "273.2 19.2% 38.8%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "275 24% 29%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    },
    "amethyst": {
      "$label": "紫晶",
      "$hue": 310,
      "$family": "purple",
      "$term": "紫",
      "$tier": "deep",
      "light": {
        "sidebar": {
          "value": "275 37.5% 18.8%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "270 5.7% 58.8%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "274.7 27.9% 26.7%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "273.8 26.2% 29.2%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "275 37.5% 18.8%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      },
      "dark": {
        "sidebar": {
          "value": "276.4 31.8% 17.3%",
          "desc": "環境色：側欄與表頭的外殼底色（目標反解，非挑色）"
        },
        "sidebar-foreground": {
          "value": "210 40% 98%",
          "desc": "外殼上的文字（近白）"
        },
        "sidebar-muted-foreground": {
          "value": "275 5.6% 58%",
          "desc": "外殼上的次要文字（群組標題等）"
        },
        "sidebar-border": {
          "value": "274 23.4% 25.1%",
          "desc": "外殼內的分隔線"
        },
        "sidebar-accent": {
          "value": "274.8 22% 27.6%",
          "desc": "選中的側欄項：同色相亮一階"
        },
        "sidebar-accent-foreground": {
          "value": "210 40% 98%",
          "desc": "sidebar-accent 上的文字＝sidebar-foreground"
        },
        "sidebar-primary": {
          "value": "210 40% 98%",
          "desc": "外殼上的標誌塊：與外殼反相的近白"
        },
        "sidebar-primary-foreground": {
          "value": "276.4 31.8% 17.3%",
          "desc": "標誌塊上的字＝外殼色"
        },
        "sidebar-ring": {
          "value": "210 40% 98%",
          "desc": "外殼上的聚焦環＝sidebar-foreground"
        }
      }
    }
  }
} as const;
