import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium", reducedMotion: "reduce", trace: "retain-on-failure" },
  webServer: { env: { VERCEL_ENV: "preview", RESEND_API_KEY: "", EMAIL_FROM: "", EMAIL_TO: "", GHL_WEBHOOK_URL: "" }, command: "npm run start -- --hostname 127.0.0.1 --port 3100", url: "http://127.0.0.1:3100", reuseExistingServer: !process.env.CI, timeout: 30000 },
});
