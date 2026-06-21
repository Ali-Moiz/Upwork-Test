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
    await this.emailInput.waitFor({ state: 'visible', timeout: 45_000 });
    await this.emailInput.fill(email);
    await this.submit.click();

    await this.passwordInput.waitFor({ state: 'visible', timeout: 20_000 });
    await this.passwordInput.fill(password);
    await this.submit.click();

    await this.page.waitForURL(/evo\.dev\.theysaid\.io\/(projects|home)/, { timeout: 40_000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}

module.exports = { LoginPage };
