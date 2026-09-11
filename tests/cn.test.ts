// 規則正本：packages/react/src/lib/utils.ts 的 twMerge 註解、book/docs/3-components/13-data-table.mdx「十字對準」。
// cn()（lib/utils）是每個元件合併 class 的唯一入口，也是 registry 最多 item 相依的檔。
// tailwind-merge 的分群一旦認錯，後面的 class 會**安靜地吃掉**前面的——畫面壞了、型別與測試全綠。
// 這支盯住兩個實際踩過的分群：
//   - token 自訂字級（text-tiny／text-micro）不能被當成文字色
//   - bg-gradient-to-* 不能被當成底色：DataTable 十字對準會吃掉凍結格的 bg-background（2026-09 手機實測）
import { describe, it, expect } from "vitest";
import { cn } from "../packages/react/src/lib/utils";

const tokens = (s: string) => s.split(" ").sort();

describe("cn：不同 CSS 屬性的 class 不互相吃掉", () => {
  it("十字對準的漸層疊在凍結格上時，凍結格的不透明底色還在", () => {
    const freeze = "sticky left-0 z-10 bg-background";
    const crosshair = "bg-gradient-to-r from-primary/[0.06] to-primary/[0.06]";
    const merged = tokens(cn(freeze, "font-medium", crosshair));
    expect(merged).toContain("bg-background");
    expect(merged).toContain("bg-gradient-to-r");
  });

  it("每個方向的 bg-gradient-to-* 都不吃底色", () => {
    for (const dir of ["t", "tr", "r", "br", "b", "bl", "l", "tl"]) {
      expect(tokens(cn("bg-muted", `bg-gradient-to-${dir}`)), dir).toContain("bg-muted");
    }
  });

  it("token 字級不吃文字色，文字色也不吃字級", () => {
    expect(tokens(cn("text-muted-foreground", "text-tiny"))).toEqual(["text-muted-foreground", "text-tiny"]);
    expect(tokens(cn("text-micro", "text-danger"))).toEqual(["text-danger", "text-micro"]);
  });
});

describe("cn：同一個屬性照樣後者覆蓋（登記沒有把合併弄壞）", () => {
  it("底色、漸層方向、字級各自覆蓋", () => {
    expect(cn("bg-background", "bg-muted")).toBe("bg-muted");
    expect(cn("bg-gradient-to-r", "bg-gradient-to-l")).toBe("bg-gradient-to-l");
    expect(cn("text-sm", "text-tiny")).toBe("text-tiny");
  });
});
