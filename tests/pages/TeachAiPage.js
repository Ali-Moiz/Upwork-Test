// Page Object: Teach AI ("Contextualize Your AI") page.
const { expect } = require('@playwright/test');

class TeachAiPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByText(/Contextualize Your AI/i);
    // Nav item is an <a> without href (SPA router) → not a "link" role; match by text.
    this.navLink = page.getByText('Teach AI', { exact: true });
    this.addFileButton = page.getByRole('button', { name: /add file/i });
  }

  // Deep-linking to /home/teach-ai bounces to login, so enter through the app
  // shell (/projects) and click the Teach AI nav link like a real user.
  async goto() {
    await this.page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await this.navLink.waitFor({ state: 'visible', timeout: 30_000 });
    await this.navLink.click();
    await this.page.waitForURL(/teach-ai/, { timeout: 30_000 });
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Upload a document. The "Add file" button triggers a native file chooser;
   * we intercept it rather than relying on a possibly-hidden <input type=file>.
   * @param {string} filePath absolute path to the file to upload
   */
  async uploadDocument(filePath) {
    // Clicking "Add file" reveals a hidden <input type=file> (no native chooser
    // event fires). Playwright can set files directly on the (hidden) input.
    const fileInput = this.page.locator('input[type="file"]');
    if (!(await fileInput.count())) {
      await this.addFileButton.click();
      await fileInput.first().waitFor({ state: 'attached', timeout: 10_000 });
    }
    await fileInput.first().setInputFiles(filePath);
  }
}

module.exports = { TeachAiPage };
