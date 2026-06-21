// Page Object: Teach AI ("Contextualize Your AI") page.
const { expect } = require('@playwright/test');

class TeachAiPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Contextualize Your AI/i });
    this.addFileButton = page.getByRole('button', { name: /add file/i });
  }

  async goto() {
    await this.page.goto('/home/teach-ai', { waitUntil: 'networkidle' });
    await expect(this.heading).toBeVisible();
  }

  /**
   * Upload a document. The "Add file" button triggers a native file chooser;
   * we intercept it rather than relying on a possibly-hidden <input type=file>.
   * @param {string} filePath absolute path to the file to upload
   */
  async uploadDocument(filePath) {
    const fileInput = this.page.locator('input[type="file"]');
    if (await fileInput.count()) {
      await fileInput.first().setInputFiles(filePath);
    } else {
      const [chooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.addFileButton.click(),
      ]);
      await chooser.setFiles(filePath);
    }
  }
}

module.exports = { TeachAiPage };
