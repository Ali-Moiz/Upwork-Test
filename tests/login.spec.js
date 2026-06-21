// Flow 1: Log in. Runs as the "setup" project and SAVES auth/state.json,
// which every other spec reuses via storageState (see playwright.config.js).
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('./pages/LoginPage');

const STATE_PATH = path.join(__dirname, '..', 'auth', 'state.json');

test('user can log in and reach the projects dashboard', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);

  // Proof of a logged-in session.
  await expect(page).toHaveURL(/\/(projects|home)/);
  await expect(page.getByRole('button', { name: /add project/i })).toBeVisible();

  // Persist the authenticated session for the dependent specs.
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  await page.context().storageState({ path: STATE_PATH });
});
