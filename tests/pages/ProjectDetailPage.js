// Page Object: a single project (/projects/:id) — publish + survey entry points.
const { expect } = require('@playwright/test');

class ProjectDetailPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.publishButton = page.getByRole('button', { name: /^publish$/i });
    this.tabs = page.getByRole('tablist');
    this.title = page.locator('h1, [role="heading"]').first();
  }

  /** Click Publish and confirm any follow-up dialog. */
  async publish() {
    await expect(this.publishButton).toBeVisible();
    await this.publishButton.click();
    // A confirmation/share dialog usually appears; confirm it if present.
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});
    const confirm = dialog.getByRole('button', { name: /publish|confirm|continue|done|got it/i });
    if (await confirm.count()) {
      await confirm.first().click().catch(() => {});
    }
  }

  /**
   * Grab the public survey/share URL after publishing, if surfaced in the
   * publish dialog (copy-link field or visible link).
   * @returns {Promise<string|null>}
   */
  async getShareUrl() {
    // The publish panel renders the public survey URL as text next to "Copy link".
    const linkText = this.page.getByText(/\/survey\//).first();
    await linkText.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    if (await linkText.count()) {
      const txt = await linkText.innerText().catch(() => '');
      const m = txt.match(/https?:\/\/[^\s"']+\/survey\/[^\s"']+/);
      if (m) return m[0];
    }
    const link = this.page.locator('a[href*="/survey/"]').first();
    if (await link.count()) return link.getAttribute('href');
    return null;
  }
}

module.exports = { ProjectDetailPage };
