---
name: explore-flow
description: Drive the browser (Playwright/Chrome MCP) to discover ONE web flow and write a compact, reusable flow spec to specs/. Use when figuring out how to log in, create a project, upload via Teach AI, or publish+survey — before writing any test.
---

# Explore a Flow → Compact Spec

Discover exactly one flow end-to-end with the MCP browser tools, then persist a terse spec to `specs/<flow>.md`. The spec — not the raw browsing — is what test authors consume.

## Token discipline (the whole point)
- **Never paste full DOM snapshots, accessibility trees, or screenshots into the conversation.** Inspect them via MCP, extract only what's needed, discard.
- After each meaningful step, record the minimal fact (selector + action) to the spec file. Keep running notes on disk, not in context.
- Final chat output = 3-5 lines: flow name, step count, any blockers, and the spec path. Nothing more.

## How to explore
1. Navigate to the start URL. Authenticate first if the flow requires it (reuse known creds).
2. Walk the happy path one action at a time. For each interactive element capture the **most stable locator** in this priority: `getByTestId` > `getByRole(name)` > `getByLabel` > `getByPlaceholder` > text. Avoid brittle CSS/nth-child.
3. Note required inputs, waits/async signals (network idle, spinners, toasts), and what proves success (the assertion target).
4. Capture failure/edge observations you trip over — feed candidates to the bonus issue report.

## Spec format (write this to specs/<flow>.md)
```md
# Flow: <name>
Precondition: <auth state / data needed>
Start URL: <path>

## Steps
1. <action> — locator: `getByRole('button', { name: 'New project' })`
2. ...

## Success assertion
- <what to assert> — locator: `...`

## Notes
- timing/async: <...>
- gotchas: <...>
```

Prefer the Playwright MCP (accessibility-tree driven, gives stable role/name locators). Use Chrome DevTools MCP only when you need network/perf/console insight the a11y view can't give.
