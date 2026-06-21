# EVO e2e Tests (Playwright)

End-to-end tests for **[evo.dev.theysaid.io](https://evo.dev.theysaid.io/)** covering four core flows:

1. **Log in**
2. **Create a project**
3. **Upload a document via Teach AI**
4. **Publish a project + take its survey**

Registration is intentionally **not** automated — it requires manually entering an OTP from email.

## Session recording

📹 **[Session recording (Google Drive)]([DRIVE_LINK_PLACEHOLDER](https://drive.google.com/file/d/1lIXoJAsvR2DhwTV48v9dJEKE7CZgNUMB/view?usp=sharing))** — screen recording of building and running these tests.

## Stack

- [Playwright Test](https://playwright.dev/) (JavaScript), Chromium
- Login runs once (project `setup`) and saves `auth/state.json`; all other specs reuse the session via `storageState` — fast and deterministic.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # then fill in APP_URL / TEST_EMAIL / TEST_PASSWORD
```

## Run

```bash
npm test            # full suite, headless
npm run test:headed # watch it in a browser
npm run report      # open the last HTML report
```

## Tests

| Flow | Spec | Test |
|------|------|------|
| Log in | [specs/login.md](specs/login.md) | [tests/login.spec.js](tests/login.spec.js) |
| Create a project | [specs/create-project.md](specs/create-project.md) | [tests/create-project.spec.js](tests/create-project.spec.js) |
| Teach AI upload | [specs/teach-ai-upload.md](specs/teach-ai-upload.md) | [tests/teach-ai-upload.spec.js](tests/teach-ai-upload.spec.js) |
| Publish + survey | [specs/publish-and-survey.md](specs/publish-and-survey.md) | [tests/publish-and-survey.spec.js](tests/publish-and-survey.spec.js) |

## Bonus — issue report

See [ISSUE_REPORT.md](ISSUE_REPORT.md).

## Notes

- Tests authored with AI assistance using up to 4 parallel threads (one per flow).
- `specs/*.md` are compact, human-readable flow specs produced during discovery and used as the source of truth for each test.
