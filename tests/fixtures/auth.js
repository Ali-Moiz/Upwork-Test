// Shared helpers for authentication.
// The login spec (project "setup") performs the real UI login and saves
// auth/state.json; every other test reuses it via storageState in the config.
const { TEST_EMAIL, TEST_PASSWORD } = process.env;

/**
 * Drive the login UI. Selectors are confirmed during explore-flow and may be
 * refined in specs/login.md. Kept here so both the setup spec and any
 * re-auth path share one implementation.
 */
async function login(page, { email = TEST_EMAIL, password = TEST_PASSWORD } = {}) {
  await page.goto('/');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();
}

module.exports = { login };
