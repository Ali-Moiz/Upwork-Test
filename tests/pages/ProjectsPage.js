// Page Object: AI Projects list (/projects) and the "Create" modal.
const { expect } = require('@playwright/test');

class ProjectsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /AI Projects/i });
    this.addProjectButton = page.getByRole('button', { name: /add project/i });
    this.createModal = page.getByRole('dialog');
  }

  async goto() {
    await this.page.goto('/projects', { waitUntil: 'networkidle' });
    await expect(this.addProjectButton).toBeVisible();
  }

  /** Open the Create modal and pick a project type, then confirm. */
  async createProject(type = 'AI Survey') {
    await this.addProjectButton.click();
    // Modal lists: AI User Test / AI Interview / AI Survey / AI Poll
    await this.page.getByText(type, { exact: true }).click();
    // Confirm button text mirrors the chosen type, e.g. "Create AI Survey".
    await this.page.getByRole('button', { name: new RegExp(`^Create ${type}$`, 'i') }).click();
    // Lands on the new project detail page.
    await this.page.waitForURL(/\/projects\/[0-9a-f-]{36}/, { timeout: 40_000 });
  }

  /** Open the first project in the list. */
  async openFirstProject() {
    const firstRowLink = this.page.locator('table a, [role="row"] a').first();
    await firstRowLink.click();
    await this.page.waitForURL(/\/projects\/[0-9a-f-]{36}/, { timeout: 30_000 });
  }
}

module.exports = { ProjectsPage };
