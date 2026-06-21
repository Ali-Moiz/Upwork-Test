// Page Object: the public survey a respondent fills out.
// Surveys are dynamic (rating / choice / open text, with an intro screen), so
// we complete them with a defensive generic loop using dummy data.
const { expect } = require('@playwright/test');

const DUMMY_TEXT = 'This is an automated end-to-end test response. The experience was smooth and intuitive.';

class SurveyPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.advanceButton = page.getByRole('button', { name: /continue|next|submit|send|start|begin|finish|done/i });
  }

  async open(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2_000);
  }

  /** Answer whatever the current step shows, with dummy data. */
  async answerCurrentStep() {
    // Open text questions.
    const textbox = this.page.locator('textarea, input[type="text"], [contenteditable="true"]').first();
    if (await textbox.count() && await textbox.isVisible().catch(() => false)) {
      await textbox.fill(DUMMY_TEXT).catch(() => {});
      return;
    }
    // Rating / choice: click the first selectable option.
    const choice = this.page.locator('[role="radio"], input[type="radio"], [role="option"], [data-rating], button[aria-label]').first();
    if (await choice.count() && await choice.isVisible().catch(() => false)) {
      await choice.click().catch(() => {});
    }
  }

  /**
   * Drive the survey to completion with dummy data.
   * @returns {Promise<boolean>} true if an end/acknowledgement screen was reached
   */
  async completeWithDummyData({ maxSteps = 12 } = {}) {
    for (let i = 0; i < maxSteps; i++) {
      // Reached the end?
      if (await this._isComplete()) return true;

      await this.answerCurrentStep();

      const advance = this.advanceButton.first();
      if (!(await advance.count()) || !(await advance.isEnabled().catch(() => false))) {
        // No way forward — re-check completion.
        return this._isComplete();
      }
      await advance.click().catch(() => {});
      await this.page.waitForTimeout(1_500);
    }
    return this._isComplete();
  }

  async _isComplete() {
    const body = await this.page.locator('body').innerText().catch(() => '');
    return /thank you|thanks|completed|all done|submitted|appreciate|that'?s all|your responses/i.test(body);
  }
}

module.exports = { SurveyPage, DUMMY_TEXT };
