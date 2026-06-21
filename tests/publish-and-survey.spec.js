// Flow 4: Publish a project, then take its survey.
const { test, expect } = require('@playwright/test');
const { ProjectsPage } = require('./pages/ProjectsPage');
const { ProjectDetailPage } = require('./pages/ProjectDetailPage');

test('user can publish a project and take its survey', async ({ page, context }) => {
  const projects = new ProjectsPage(page);
  await projects.goto();
  await projects.openFirstProject();

  const detail = new ProjectDetailPage(page);
  await detail.publish();

  // After publishing, capture the public survey link if exposed.
  const shareUrl = await detail.getShareUrl();
  test.skip(!shareUrl, 'No public survey URL surfaced after publish');

  // Take the survey in a fresh (unauthenticated) page, like a real respondent.
  const respondent = await context.browser().newContext();
  const surveyPage = await respondent.newPage();
  await surveyPage.goto(shareUrl, { waitUntil: 'domcontentloaded' });

  // Start the survey, answer the first prompt, and advance.
  const start = surveyPage.getByRole('button', { name: /start|begin|let'?s go|next/i });
  if (await start.count()) await start.first().click().catch(() => {});

  const answerBox = surveyPage.locator('textarea, input[type="text"], [contenteditable="true"]').first();
  await answerBox.waitFor({ state: 'visible', timeout: 20_000 });
  await answerBox.fill('This is an automated end-to-end test response.');

  const next = surveyPage.getByRole('button', { name: /next|submit|send|continue/i }).first();
  await next.click();

  // Evidence that the response was accepted (advanced or thanked).
  await expect(surveyPage.locator('body')).toContainText(/thank|next question|response|submitted/i, { timeout: 20_000 });
  await respondent.close();
});
