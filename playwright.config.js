// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    // Headed locally (good for the screen recording); headless in CI.
    headless: !!process.env.CI,
    baseURL: process.env.APP_URL || 'https://evo.dev.theysaid.io/',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // 1) Logs in via UI and saves auth/state.json (runs first, no stored state).
    { name: 'setup', testMatch: /login\.spec\.js/ },
    // 2) Everything else reuses the saved session.
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'auth/state.json' },
      testIgnore: /login\.spec\.js/,
    },
  ],
});
