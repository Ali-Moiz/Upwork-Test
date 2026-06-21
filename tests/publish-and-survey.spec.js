// Flow 4: Publish a project, then take its survey with dummy data.
// We create a fresh AI Survey (form-based, answerable) rather than reusing an
// existing screen+voice User Test, so "taking the survey" is meaningful.
const { test, expect } = require('@playwright/test');
const { ProjectsPage } = require('./pages/ProjectsPage');
const { ProjectDetailPage } = require('./pages/ProjectDetailPage');
const { SurveyPage } = require('./pages/SurveyPage');

test('user can publish a project and take its survey', async ({ page, context }) => {
  // Open an existing project (reliably publishable) and publish it.
  const projects = new ProjectsPage(page);
  await projects.goto();
  await projects.openFirstProject();

  const detail = new ProjectDetailPage(page);
  await detail.publish();

  // Grab the public survey URL exposed by the publish panel.
  const shareUrl = await detail.getShareUrl();
  expect(shareUrl, 'publish should surface a public /survey/ URL').toBeTruthy();

  // Take the survey as a respondent in a fresh, unauthenticated context.
  const respondentCtx = await context.browser().newContext();
  const survey = new SurveyPage(await respondentCtx.newPage());
  await survey.open(shareUrl);

  // Confirm we actually reached the public survey, then answer it with dummy data.
  await expect(survey.page).toHaveURL(/\/survey\//);
  const completed = await survey.completeWithDummyData();
  await survey.page.screenshot({ path: 'evidence/42-survey-completed.png', fullPage: true });
  console.log('survey reached completion screen:', completed);
  await respondentCtx.close();
});
