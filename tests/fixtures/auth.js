// Shared login helper.
// The login spec (project "setup") performs the real UI login and saves
// auth/state.json; every other test reuses it via storageState in the config.
//
// IMPORTANT: the WorkOS AuthKit pages render in inconsistent languages
// (the password step has been observed in Afrikaans while the email step was
// English). So we DO NOT locate buttons by visible text — we use the stable
// `button[type="submit"]` and input type attributes, which are language-proof.
const { TEST_EMAIL, TEST_PASSWORD } = process.env;

/**
 * Drive the two-step AuthKit login and land back on the EVO app.
 * @param {import('@playwright/test').Page} page
 */
async function login(page, { email = TEST_EMAIL, password = TEST_PASSWORD } = {}) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Step 1 — email
  const emailInput = page.locator('input[type="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 45_000 });
  await emailInput.fill(email);
  await page.locator('button[type="submit"]').click();

  // Step 2 — password
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.waitFor({ state: 'visible', timeout: 20_000 });
  await passwordInput.fill(password);
  await page.locator('button[type="submit"]').click();

  // Back on the app
  await page.waitForURL(/evo\.dev\.theysaid\.io/, { timeout: 40_000 });
  await page.waitForLoadState('networkidle').catch(() => {});
}

module.exports = { login };
