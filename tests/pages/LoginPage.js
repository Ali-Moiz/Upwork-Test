// Page Object: WorkOS AuthKit two-step login.
// Locators are language-agnostic (button[type=submit], input types) because
// the hosted auth pages render in inconsistent languages (observed Afrikaans).
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submit = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async login(email, password) {
    await this.goto();

    // Step 1 — email. Submit via Enter (more robust than clicking the AuthKit
    // button, which is occasionally not actionable in time).
    await this.emailInput.waitFor({ state: 'visible', timeout: 45_000 });
    await this.emailInput.fill(email);
    await this.emailInput.press('Enter');

    // Step 2 — password.
    await this.passwordInput.waitFor({ state: 'visible', timeout: 30_000 });
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');

    await this.page.waitForURL(/evo\.dev\.theysaid\.io\/(projects|home)/, { timeout: 45_000 });
  }
}

module.exports = { LoginPage };
