# Flow: Log in
Precondition: valid EVO account (TEST_EMAIL / TEST_PASSWORD)
Start URL: /  (redirects to /login → WorkOS AuthKit hosted page)

## Steps
1. Go to `/` — app redirects to AuthKit.
2. Fill email — locator: `input[type="email"]`
3. Submit — locator: `button[type="submit"]`  (label "Continue", but DO NOT match by text — see localization issue)
4. Fill password — locator: `input[type="password"]`
5. Submit — locator: `button[type="submit"]`  (label may be "Teken in"/Afrikaans)

## Success assertion
- URL is back on `evo.dev.theysaid.io/projects` (or /home)
- `getByRole('button', { name: /add project/i })` is visible

## Notes
- async: AuthKit redirect chain; wait for `input[type=email]` visible (~up to 45s cold).
- gotcha: password step renders in inconsistent language → text locators are unreliable. See ISSUE_REPORT.md.
- Saves `auth/state.json` for reuse by all other specs.
