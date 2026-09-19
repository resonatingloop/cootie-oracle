import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  outputDir: "test-results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/cootie-oracle/",
    browserName: "chromium",
    channel: "chrome",
    launchOptions: {
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --strictPort --port 4173",
    url: "http://127.0.0.1:4173/cootie-oracle/",
    reuseExistingServer: true,
  },
});
