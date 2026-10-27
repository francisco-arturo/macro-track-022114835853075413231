# Session Handoff — Prototype: macro-track-022114835853075413231

## Last Updated

- 2026-10-27 — Fit Code Nutrition was translated to Spanish, verified, deployed and pushed. The
  English version was superseded by the Spanish deployment. Repository and live URL are recorded below.

## Current Objective

The user asked for a Spanish prototype and explicitly said the proposal did not need to be redone. The
build is pushed to `https://github.com/francisco-arturo/macro-track-022114835853075413231` and live at
**https://macro-track-022114835853075413231.vercel.app** (deployment
`dpl_4wtgcTMqBXpJzepqkgFMvq4bgWvT`). The canonical live URL is unchanged, so the existing proposal's
opener still points at the correct Spanish build.

## Recommended Next Step

1. The proposal draft already in chat remains valid because the live URL did not change.
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
- Live deployment: `dpl_4wtgcTMqBXpJzepqkgFMvq4bgWvT`
- Language: Spanish member UI, seed data, errors and PWA metadata; developer README is English.

## Blockers

- None.
- Headless Chrome screenshots are blocked by the Windows sandbox (`crashpad ... OpenProcess: Access
  is denied`). This is an agent-environment limitation, not an app failure. Route checks and jsdom
  interaction checks passed.

## Next Session

- Do not re-scaffold or create a second directory.
- Run `.\init.ps1` first; it should stay at 100/100 with 51 checks.
- Confirm the live HTML still has `lang="es"` and the Spanish CTA after any deploy.
- No secrets exist in the repository. `.env` is gitignored.
- The local preview is running as a managed background job on port 4174; port 4173 is held by another
  prototype on this machine.
