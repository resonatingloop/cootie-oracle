import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/cootie-oracle/",
  envDir: "public-env",
  test: {
    environment: "node",
    include: ["tests/*.test.ts"],
    coverage: {
      enabled: false,
    },
  },
});
