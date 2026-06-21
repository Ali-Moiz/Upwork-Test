// Flow 2: Create a project (reuses the logged-in session).
const { test, expect } = require('@playwright/test');
const { ProjectsPage } = require('./pages/ProjectsPage');

test('user can create a new AI Survey project', async ({ page }) => {
  const projects = new ProjectsPage(page);
  await projects.goto();

  await projects.createProject('AI Survey');

  // Landed on a freshly created project detail page (proof of creation).
  await expect(page).toHaveURL(/\/projects\/[^/?#]+/);
  await expect(page.getByRole('tab', { name: /questions/i })).toBeVisible();
});
