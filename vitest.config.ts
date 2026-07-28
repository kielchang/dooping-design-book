import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@dooping/tokens": path.resolve(__dirname, "packages/tokens/src/index.ts"),
      "@dooping/react": path.resolve(__dirname, "packages/react/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
