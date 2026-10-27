# Session Handoff — Prototype: macro-track-022114835853075413231

## Last Updated

- 2026-10-27 — Fit Code Nutrition demo built, verified and handed over locally.

## Current Objective

Wait for the user to review the local build. On approval, confirm the repository URL they create,
add it to `github.json` -> `push_policy.approved_remotes`, push, then deploy with
`node .harness/deploy.mjs macro-track-022114835853075413231` from the workspace root. No proposal
unless the user asks for one.

## Recommended Next Step

1. Open **http://127.0.0.1:4174** and walk `DEMO.md`.
2. If approved, ask for the GitHub repository URL.
3. Push and deploy; then update `DEMO.md`, `progress.md` and `feature_list.json` with the live URL.

## Files

- `AGENTS.md` — prototype rules.
- `feature_list.json` — `proto-001` is done, with evidence.
- `progress.md` — commands, verification results and known limits.
- `DEMO.md` — review URL, 60-second path and simulated areas.
- `README.md` — architecture, RLS model, environment and production cutover.
- `index.html`, `styles.css`, `app.js`, `data.js` — the app.
- `api/meal-plan.mjs` — server-only AI route.
- `dev-server.mjs`, `verify.mjs` — local server and verification (excluded from deploy).
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA assets.
- `init.ps1` / `init.sh` — verification entrypoints; both call `node verify.mjs`.

## Blockers

- None.
- Headless Chrome screenshots are blocked by the Windows sandbox (`crashpad ... OpenProcess: Access
  is denied`). This is an agent-environment limitation, not an app failure. Route checks and jsdom
  interaction checks passed.

## Next Session

- Do not re-scaffold or create a second directory.
- Run `.\init.ps1` first; it should stay at 100/100.
- No secrets exist in the repository. `.env` is gitignored.
- The local preview is running as a managed background job on port 4174; port 4173 is held by another
  prototype on this machine.
