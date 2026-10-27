# Session Handoff — Prototype: macro-track-022114835853075413231

## Last Updated

- 2026-10-27 — Fit Code Nutrition demo built, verified, pushed and deployed. Repository and live URL
  are recorded below.

## Current Objective

The user asked for a proposal. The build is pushed to
`https://github.com/francisco-arturo/macro-track-022114835853075413231` and live at
**https://macro-track-022114835853075413231.vercel.app** (deployment `dpl_H1HQJP56bTJMy9DNaGwD2NcynNSH`).
The standard opener can cite the live URL and the repository offer is true.

## Recommended Next Step

1. Draft the proposal in chat only, using `upwork-kit/PLAYBOOK.md` and `CHECKLIST.md`.
2. Do not invent Supabase proof: no prototype in this workspace is connected to Supabase. The one
   screening gap must be filled by the user with a real app URL and the part they wrote.
3. Do not write the draft to the kit and do not log it in `TRACKER.csv` until it is sent.

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
- Repository: https://github.com/francisco-arturo/macro-track-022114835853075413231
- Live: https://macro-track-022114835853075413231.vercel.app

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
