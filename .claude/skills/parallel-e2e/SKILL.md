---
name: parallel-e2e
description: Orchestrate up to 4 parallel subagents that each author one Playwright test from a flow spec (the "4 parallel threads"). Use after specs exist and the repo is scaffolded, to write the login / create-project / Teach-AI-upload / publish+survey tests concurrently.
---

# Parallel e2e Authoring (≤4 threads)

Fan the four flows out to subagents so the heavy authoring happens in isolated contexts and the main conversation stays small.

## Preconditions
- Repo scaffolded (`scaffold-pw-repo`) and all four `specs/*.md` exist (`explore-flow`).
- Auth storageState produced **first** — the login test must run before the others can reuse state.

## Dispatch
1. **Sequence the dependency**: author + run `login.spec.js` first (it creates `auth/state.json`). The other three depend on that state existing.
2. Then launch the remaining flows as **parallel subagents (max 4 in flight)** — one Agent call per flow, in a single message:
   - create-project
   - teach-ai-upload
   - publish-and-survey
   (Login can also be one of the 4 if you prefer to parallelize all and have non-login tests tolerate missing state on first pass — but the dependency-ordered approach is more reliable.)
3. Each subagent prompt must say: "Follow `.claude/skills/author-e2e/SKILL.md`. Your spec is `specs/<flow>.md`. Write `tests/<flow>.spec.js`, run it headless until green, then report back ONLY the test path, pass/fail, and any spec gaps. Do not paste file contents."

## Token discipline
- Subagents return terse summaries, not transcripts. The orchestrator never re-reads full test files unless a failure needs triage.
- If a subagent reports a spec gap, patch the spec and re-dispatch just that one — don't re-run the whole fan-out.

## After all return
- Run the full suite once: `npx playwright test`. Report the pass matrix (flow → ✓/✗) and the HTML report path. Keep output to the matrix + failures only.
