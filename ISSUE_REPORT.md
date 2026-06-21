# Bonus — Issue Report

## 🐞 Inconsistent localization on the WorkOS AuthKit login flow

**Severity:** Medium (trust/UX + breaks text-based automation)

**Where:** Hosted auth at `https://mystical-turtle-68-staging.authkit.app/...` reached from `https://evo.dev.theysaid.io/login`.

**What happens:** The login is a two-step AuthKit flow (email → password). The two steps render in **different languages within the same session**:

- **Step 1 (email):** English — `Your email address`, `Continue`, `Continue with Google`, `Sign up`.
- **Step 2 (password):** **Afrikaans** — `Jou wagwoord` (Your password), `Teken in` (Sign in), `Wagwoord vergeet?` (Forgot password?), `Gaan terug` (Go back).

The browser/account locale is English (US), so the password step should also be English. The language also appears to vary between sessions, which points to an inconsistent/last-write-wins locale negotiation on the auth host rather than a deliberate per-user setting.

**Evidence:** see [evidence/02-password-page.png](evidence/02-password-page.png) (Afrikaans password screen) vs the English email screen.

**Impact:**
1. Confusing/eroded trust for English-speaking users mid-login.
2. It silently breaks any automation or QA that locates the submit button by visible text (`Sign in` / `Continue`).

**How we caught & worked around it:** Our login Page Object deliberately avoids text-based locators for the auth buttons and uses the language-agnostic `button[type="submit"]` + input `type` attributes (see [tests/pages/LoginPage.js](tests/pages/LoginPage.js)). This is also a good general best practice for third-party hosted auth.

**Suggested fix:** Pin the AuthKit `locale`/`Accept-Language` (or pass it explicitly) so every step of the hosted flow renders in one consistent, correct language.
