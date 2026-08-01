# AGENTS.md

## Goal

Help diagnose and recover the L28 Render release while preserving the intended
application change.

## Runtime and commands

- Node.js `>=24 <27`, pnpm `11.5.1`, JavaScript only.
- Replay is the required provider.
- Validate with `pnpm check`, `pnpm test`, and `pnpm test:e2e`.
- Verify the release with
  `pnpm verify:remote -- <base-url> <expected-commit>`.

## Boundaries

- Inspect CI, deploy state and logs before proposing code changes.
- Keep `.github/workflows/quality.yml` active and green.
- Preserve `status`, `provider` and `release` in `/health`.
- Do not weaken tests, health checks or remote verification.
- Do not remove the visible L28 application change.
- Do not add secrets, live AI calls or new dependencies.
- Prefer one evidence-backed, minimal change.

