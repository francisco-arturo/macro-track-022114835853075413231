# Fit Code Nutrition — demo

## Run

```powershell
node dev-server.mjs
```

Local review URL: **http://127.0.0.1:4174**

Port 4173 was already held by another prototype on this machine, so the preview was started with
`$env:PORT=4174; node dev-server.mjs`. The server binds `127.0.0.1`. Stop it with `Ctrl+C` in the
terminal running the job.

Live URL: not deployed yet. The push and deploy wait for the user's approval of this local build.

## The path to walk

1. **Today.** The app opens signed in as Maya Chen. The seeded day is 1,329 kcal, 124g protein and an
   11-day streak. Point at the calorie ring, the protein bar (the priority macro) and the planned
   dinner.
2. **Log food.** Tap any **Log food** button. Pick **Grilled chicken**. Switch the portion control to
   **Hand portions**: one palm equals four ounces. Set it to two palms, choose **Dinner**, add it.
   The ring, all three macro bars, the meal list and the hero copy update.
3. **Meal plan.** Go to **Meal plan**. Change the goal or block length and press **Generate plan**.
   The card shows the server route being called, then the plan and the remaining generations. The
   dropdowns are allow-listed on the server, and the function never returns the API key.
4. **Progress.** The 8-week weight trend, 7-day protein bars and 14-day logging calendar are seeded.
   Press **Log weight**, enter 147.9 and save; the latest weight and trend update.
5. **Owner review.** Use the chip in the top bar. This is the `member_summary` view the owner will
   open in Supabase: name, days since last log, streak, 7-day protein against target, latest weight.
   The SQL preview and the RLS notes are below the table.
6. **Account.** Open the avatar. Export the member's JSON, try **Install on this device**, or use the
   two-step **Delete account** flow. Deletion clears the local records and shows the deleted state;
   **Restore the demo** brings the seed back.

## What is deliberately fake

- **Auth is a seeded session.** The app opens without a login wall so the member flow can be judged
  in one minute. Real Supabase Auth, password reset and Google are Phase 1 build work, not demo work.
- **Data is in `localStorage`.** There is no Supabase project in this prototype. The schema, RLS and
  view are documented and previewed, not connected.
- **Owner rows are seeded.** Maya's row is computed from the live local state; the other five members
  are sample data. Phase 1 has no admin page: the owner reads the view in the Supabase dashboard.
- **AI falls back to a deterministic plan.** Without `ANTHROPIC_API_KEY`, the server route still
  validates, meters and returns a complete three-day plan. With the key set, the same route calls
  Anthropic and validates the JSON before returning it. The key is read only in
  `api/meal-plan.mjs`.
- **The usage limit is per warm function instance.** It proves the gate and the UX. Production moves
  the counter to Postgres so a cold start cannot reset it.
- **PWA install is real on HTTPS.** On localhost the manifest and service worker are active; a
  home-screen install behaves as it will on Vercel.

## What the client should judge

- Whether ounce and hand-portion logging feels faster than the prototype.
- Whether the macro hierarchy is obvious without reading a number.
- Whether the owner table answers "who needs a check-in?" at a glance.
- Whether the plan output is specific enough to cook from.
- Whether the iPhone layout, safe areas and bottom nav feel like an app, not a website.

## Production gaps not hidden by the demo

- Supabase schema migrations, RLS policies and tests.
- Real auth, session refresh, password reset delivery and Google provider.
- Server-side export and deletion tied to `auth.uid()`.
- Persistent `ai_usage` and atomic limit enforcement.
- Supabase view verification in the dashboard under the owner account.
