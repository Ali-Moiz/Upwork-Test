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
    await this.page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await expect(this.addProjectButton).toBeVisible({ timeout: 30_000 });
  }

  /** Open the Create modal and pick a project type, then confirm. */
  async createProject(type = 'AI Survey') {
    await this.addProjectButton.click();
    // Modal lists type cards — AI User Test / AI Interview / AI Survey / AI Poll.
    // The cards are NOT exposed as role=button, so select by their heading text.
    await this.page.getByText(type, { exact: true }).click();
    // Confirm button mirrors the chosen type, e.g. "Create AI Survey".
    await this.page.getByRole('button', { name: /^Create AI /i }).click();
    // Lands on the new project detail page (/projects/<id>, id format varies).
    await this.page.waitForURL(/\/projects\/[^/?#]+/, { timeout: 40_000 });
    // A "Draft project" onboarding modal may appear — skip it for a clean state.
    const skip = this.page.getByRole('button', { name: /^skip$/i });
    await skip.click({ timeout: 5_000 }).catch(() => {});
  }

  /** Open the first project in the list. */
  async openFirstProject() {
    const firstRowLink = this.page.locator('table a, [role="row"] a').first();
    await firstRowLink.click();
    await this.page.waitForURL(/\/projects\/[0-9a-f-]{36}/, { timeout: 30_000 });
  }
}

module.exports = { ProjectsPage };
