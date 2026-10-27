# Progress — Prototype: macro-track-022114835853075413231

## Current State

- The Fit Code demo is now Spanish-first: member UI, dialogs, toasts, aria labels, seed foods and
  meals, AI plan output, PWA manifest and demo script. The developer README stays in English for
  handoff.
- Built from the original prototype: Today dashboard, ounce and hand-portion logging, saved three-day
  AI meal plan, eight-week weight chart, protein and streak charts, owner summary view, JSON export and
  two-step account deletion.
- The app is a static Vercel shape with a real serverless route at `api/meal-plan.mjs`: Spanish
  allow-lists, per-member daily limit, server-only Anthropic key and a deterministic Spanish demo plan.
- PWA shell is in place: Spanish manifest, service worker cache `fit-code-es-v2`, 192/512/maskable
  icons and Apple touch icon.
- Seeds live in `data.js`; member state persists to `localStorage` under a new Spanish key so the old
  English demo state is not reused.
- Pushed to `https://github.com/francisco-arturo/macro-track-022114835853075413231` and deployed to
  **https://macro-track-022114835853075413231.vercel.app** (deployment
  `dpl_4wtgcTMqBXpJzepqkgFMvq4bgWvT`, READY).
- No Supabase project is connected yet. README documents the production schema, RLS policies and
  cutover order; `DEMO.md` is explicit about what is simulated.

## Current Objective

The Spanish version is deployed and the live URL is unchanged, so the proposal's opener still points
at the correct build. No proposal rewrite was requested.

## Last Updated

- **Last Updated**: 2026-10-27
- **Live URL**: https://macro-track-022114835853075413231.vercel.app
- **Review URL**: http://127.0.0.1:4174 (port 4173 was already in use by another prototype)
- **Run command**: `$env:PORT=4174; node dev-server.mjs`

## What Ran

| Command | Result |
|---|---|
| `powershell -ExecutionPolicy Bypass -File .\init.ps1` | exit 0; 51 checks PASS; `ALL CHECKS PASSED`; structural score 100/100 |
| `node verify.mjs` | same suite through the direct Node entrypoint |
| temporary jsdom interaction smoke | 30/30 passed: Spanish render, quick log with hand portions, plan view, generation usage, charts, owner table, weigh-in, account role and delete state |
| live `https://macro-track-...vercel.app` | 200; HTML `lang="es"` and `Registrar comida` present |
| live `manifest.webmanifest` | 200; `lang: es`, name `Fit Code Nutrición` |
| live `POST /api/meal-plan` | 200; plan label `Día 1`, meal `Avena con proteína`, `source: demo` |
| `node .harness/deploy.mjs macro-track-022114835853075413231` | READY in 9s; `dpl_4wtgcTMqBXpJzepqkgFMvq4bgWvT`; canonical alias unchanged |
| `git push -u origin main` (earlier delivery) | `e656e49`, `be045f4`, `8ab5df5` on `main` |

## Verification Evidence

- Spanish `init.ps1`: 51 file/route/API checks, `ALL CHECKS PASSED`, structural 100/100.
- API checks exercised: 200 for a valid Spanish member, three-day plan, Spanish `Día 1` label, four
  meals per day, usage `1 of 3`, no `sk-ant-` string, 429 on the fourth call, 401 without a member id,
  400 on an unknown Spanish goal.
- jsdom smoke: 30/30, including Spanish copy, hand-portion logging, plan generation, charts, owner
  table, weigh-in, role label and deletion state.
- Headless Chrome is still blocked by the Windows sandbox (`crashpad ... OpenProcess: Access is
  denied`), so browser checks used jsdom plus live route and API fetches.

## Next

1. User reviews the Spanish live build.
2. The English proposal remains in chat and unchanged; its only URL is the same live deployment.
3. Production Phase 1 work is not in this prototype; see README for the Supabase cutover.

## Blockers

- None. No credentials were created; no `.env` exists.
