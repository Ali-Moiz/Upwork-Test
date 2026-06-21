// Flow 3: Upload a document via the Teach AI feature.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { TeachAiPage } = require('./pages/TeachAiPage');

const SAMPLE = path.join(__dirname, '..', 'fixtures', 'sample-teach-ai.txt');

test('user can upload a document in Teach AI', async ({ page }) => {
  const teachAi = new TeachAiPage(page);
  await teachAi.goto();

  await teachAi.uploadDocument(SAMPLE);

  // The uploaded file name should surface somewhere on the page.
  await expect(page.getByText(/sample-teach-ai/i)).toBeVisible({ timeout: 20_000 });
});
