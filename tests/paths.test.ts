// 規則正本：scripts/lib/paths.mjs 檔頭。
// 本機腳本（verify-* 的靜態伺服器、host-sync、build-registry、Windows 下經 shell 執行的指令）共用的路徑與參數防護。
// 它們吃的輸入不全是自己寫的：請求網址、提交進來的 registry target、環境變數、命令列參數。
// 這支盯住會出事的那幾種：前綴相同的兄弟資料夾、解碼後才出現的分隔符、壞掉的 % 跳脫、
// 會被整個刪掉的輸出目錄寫錯、含空白的參數被 cmd 拆開。
import { describe, it, expect } from "vitest";
import { join, normalize, resolve } from "node:path";
import { tmpdir } from "node:os";
import { isInside, outputDirUnder, safeDecode, shellArgs } from "../scripts/lib/paths.mjs";
import { because } from "./lib/guard";

const RULE = "scripts/lib/paths.mjs 檔頭";
const WHY = "本機腳本吃的網址、registry target、環境變數不全是自己寫的；跑出資料夾就會讀到或刪到不該碰的檔";
const root = resolve(tmpdir(), "dooping-root");

describe("isInside", () => {
  it("本身與底下算在內；前綴相同的兄弟資料夾、上一層、別的磁碟都不算", () => {
    expect(isInside(root, root)).toBe(true);
    expect(isInside(join(root, "a", "b.html"), root)).toBe(true);
    expect(isInside(join(root, "..foo"), root), because("「..foo」是底下的檔名，不是上一層", WHY, RULE)).toBe(true);
    for (const outside of [`${root}-x`, `${root}2`, join(root, ".."), resolve(root, "../other")]) {
      expect(isInside(outside, root), because(`「${outside}」不在 root 底下`, WHY, RULE)).toBe(false);
    }
  });
});

describe("safeDecode＋isInside：靜態伺服器的請求路徑", () => {
  // 伺服器的組法：解碼 → 去掉開頭斜線 → join 到 root → normalize → 確認還在 root 底下
  const served = (url: string) => {
    const decoded = safeDecode(url);
    if (decoded === null) return null;
    const file = normalize(join(root, decoded.replace(/^\/+/, "")));
    return isInside(file, root) ? file : null;
  };

  it("壞掉的 % 跳脫回傳 null，不丟例外", () => {
    expect(safeDecode("/%E0%A4%A")).toBeNull();
    expect(safeDecode("/%E7%94%B2")).toBe("/甲");
  });

  it("一般路徑落在 root 底下；解碼後才出現的斜線與上一層擋掉", () => {
    expect(served("/assets/%E7%94%B2.js")).toBe(join(root, "assets", "甲.js"));
    for (const p of ["/..%2F..%2Fsecret.txt", "/%2e%2e/%2e%2e/secret.txt", "/assets/..%2F..%2Fsecret.txt", "/%E0%A4%A"]) {
      expect(served(p), because(`「${p}」要被擋掉`, WHY, RULE)).toBeNull();
    }
  });
});

describe("outputDirUnder：會被整個刪掉重建的輸出目錄", () => {
  it("repo 底下的相對路徑照用", () => {
    expect(outputDirUnder(root, "registry")).toBe(join(root, "registry"));
    expect(outputDirUnder(root, "registry-local")).toBe(join(root, "registry-local"));
  });

  it("空字串、repo 根目錄、上一層、絕對路徑一律丟錯", () => {
    for (const v of ["", "  ", ".", "./", "..", "../x", "a/../../x", "/x", "C:\\x", "C:/x"]) {
      expect(() => outputDirUnder(root, v, "REGISTRY_OUT"), because(`REGISTRY_OUT=「${v}」要被擋掉`, "輸出目錄會被 rmSync 整個刪掉；寫錯一個環境變數不能刪掉整個 repo", RULE)).toThrow();
    }
    expect(() => outputDirUnder(root, undefined)).toThrow();
  });
});

describe("shellArgs：Windows 經 cmd 執行的參數", () => {
  it("含空白或 cmd 特殊字元的加引號；其他平台原樣", () => {
    const args = ["pack", "--pack-destination", "C:\\Users\\A B\\tmp\\vendor", "a&b", "--json"];
    expect(shellArgs(args, "win32"), because("含空白的路徑沒加引號會被 cmd 拆成兩個參數", WHY, RULE)).toEqual(["pack", "--pack-destination", "\"C:\\Users\\A B\\tmp\\vendor\"", "\"a&b\"", "--json"]);
    expect(shellArgs(args, "linux")).toEqual(args);
  });

  it("含引號、%、! 的在 cmd 裡擋不住展開，直接丟錯", () => {
    for (const bad of ['a"b', "%PATH%", "x!y"]) expect(() => shellArgs([bad], "win32")).toThrow();
  });
});
