---
name: author-e2e
description: Author ONE Playwright (JS) e2e test from a flow spec, following repo conventions. Use when turning a specs/*.md file into a tests/*.spec.js, or as the per-test contract that parallel subagents follow.
---

# Author One e2e Test

Input: a `specs/<flow>.md` produced by explore-flow + the scaffolded repo. Output: a passing `tests/<flow>.spec.js`.

## Conventions (match the repo exactly)
- File: `tests/<flow>.spec.js`, one `test.describe` per flow.
- Auth: use the storageState fixture (`tests/fixtures/auth.js`) so the test starts logged in. The **login flow itself** is the only test that drives the login UI and SAVES the state others reuse.
- Locators: role/label/testid first, in the priority from the spec. No `nth-child`, no XPath, no fixed-timeout `waitForTimeout`.
- Assertions: web-first (`await expect(locator).toBeVisible()` etc.) so Playwright auto-retries. Assert the spec's success target.
- Data: read creds/URL from env (already wired). Generate unique names with a timestamp/uuid to keep runs idempotent.
- Uploads (Teach AI): use `setInputFiles` against the file input; sample file lives in `fixtures/`.

## Definition of done
1. Test mirrors the spec's steps and success assertion.
2. Runs green headless: `npx playwright test tests/<flow>.spec.js`.
3. No hard waits, no skipped assertions, deterministic.
4. Report back ONLY: test path, pass/fail, and any spec gap discovered. Do not paste the full test body.
