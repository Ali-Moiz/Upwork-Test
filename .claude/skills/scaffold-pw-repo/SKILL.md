---
name: scaffold-pw-repo
description: Scaffold a clean Playwright (JavaScript) e2e test repository. Use when starting the test repo, setting up playwright.config, auth storageState, .env, fixtures, README, or git init for this assessment.
---

# Scaffold Playwright e2e Repo

Goal: a minimal, conventional Playwright (JS) repo that the parallel test authors can target without re-deriving structure.

## Layout (create exactly this)
```
package.json
playwright.config.js
.env.example          # APP_URL, TEST_EMAIL, TEST_PASSWORD
.gitignore            # node_modules, .env, test-results, playwright-report, /auth/*.json, downloads
README.md             # see template below
specs/                # flow specs written by explore-flow (committed)
tests/
  fixtures/auth.js    # storageState login-once fixture
  *.spec.js           # one per flow
auth/                 # storageState json (gitignored)
fixtures/             # sample upload doc for Teach AI
```

## Rules (token + time efficient)
- **Auth once, reuse**: a global-setup or fixture logs in a single time and saves `auth/state.json`; every other test loads `storageState`. Never repeat the login UI per test except in `login.spec.js` itself.
- Config: `baseURL` from `process.env.APP_URL`, `trace: 'on-first-retry'`, `video: 'retain-on-failure'`, `retries: process.env.CI ? 2 : 0`, projects = chromium only (keep it lean), `testDir: 'tests'`.
- Secrets live in `.env` (gitignored). Commit `.env.example` only.
- `npm scripts`: `test`, `test:headed`, `report`, `codegen`.

## README template (fill placeholders, keep short)
- One-line purpose, prerequisites, `.env` setup, `npx playwright install`, run commands.
- A **Session Recording** section with the Google Drive link placeholder: `[Session recording](DRIVE_LINK)`.
- A **Tests** table: flow → spec file → test file.
- A **Bonus / Issue report** section.

## Steps
1. `npm init -y`; install `@playwright/test` + `dotenv`.
2. Write the files above. `git init`, first commit `chore: scaffold playwright e2e repo`.
3. Print the tree and the run command. Do NOT paste full file contents back into chat — just confirm paths created.
