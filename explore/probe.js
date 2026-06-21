// Standalone exploration probe (not a test). Navigates the app, screenshots
// key pages, and dumps a TRIMMED list of interactive elements (role + name)
// to explore/out/ so the AI can "see" the UI without huge DOM dumps in chat.
//
// Usage: node explore/probe.js <step>
//   step: home | postlogin
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const { APP_URL, TEST_EMAIL, TEST_PASSWORD } = process.env;

async function dumpInteractives(page, tag) {
  const items = await page.evaluate(() => {
    const out = [];
    const sel = 'a,button,input,textarea,select,[role="button"],[role="link"],[role="tab"],[role="menuitem"],[contenteditable="true"]';
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const label = (el.getAttribute('aria-label') || el.getAttribute('placeholder') ||
        el.getAttribute('name') || el.innerText || el.value || '').trim().slice(0, 60);
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        role: el.getAttribute('role') || '',
        testid: el.getAttribute('data-testid') || el.getAttribute('data-test') || '',
        label,
      });
    }
    return out.slice(0, 120);
  });
  fs.writeFileSync(path.join(OUT, `${tag}.json`),
    JSON.stringify({ url: page.url(), title: await page.title(), items }, null, 2));
  await page.screenshot({ path: path.join(OUT, `${tag}.png`), fullPage: true });
  console.log(`[${tag}] ${page.url()} — ${items.length} interactive els -> out/${tag}.json/.png`);
}

(async () => {
  const step = process.argv[2] || 'home';
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await dumpInteractives(page, 'home');

  if (step === 'postlogin') {
    // Best-effort generic login; refine selectors after seeing home.json.
    try {
      const email = page.locator('input[type="email"], input[name*="email" i]').first();
      const pass = page.locator('input[type="password"]').first();
      await email.fill(TEST_EMAIL);
      await pass.fill(TEST_PASSWORD);
      await page.getByRole('button', { name: /log ?in|sign ?in|continue/i }).first().click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await dumpInteractives(page, 'postlogin');
      fs.mkdirSync(path.join(__dirname, '..', 'auth'), { recursive: true });
      await context.storageState({ path: path.join(__dirname, '..', 'auth', 'state.json') });
      console.log('Saved auth/state.json');
    } catch (e) {
      console.log('LOGIN PROBE ERROR:', e.message);
    }
  }
  await browser.close();
})();
