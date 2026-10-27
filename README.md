# Fit Code Nutrición

A working front-end prototype of the Fit Code member nutrition app, Spanish-first. The member-facing
interface, seed data, error copy, PWA metadata and demo script are in Spanish. This developer README
stays in English so another developer can pick up the repository.

It is built from the existing single-page concept, not from a rewrite: the macro targets, ounce and
hand-portion logging, AI meal plan and dashboard are all here, plus the owner view, export and
deletion flows the Phase 1 brief calls for.

The deployed shape is a static Vercel app with one serverless function at `api/meal-plan.mjs`.
There is no build step.

## Run it

```powershell
node dev-server.mjs
```

Open `http://127.0.0.1:4173`. If that port is busy, run `$env:PORT=4174; node dev-server.mjs` and open
`http://127.0.0.1:4174`.

Verification:

```powershell
node verify.mjs
# or, on Windows:
powershell -ExecutionPolicy Bypass -File .\init.ps1
```

`verify.mjs` checks the files, the PWA manifest, the static routes, the AI endpoint, the plan shape
and the per-member daily limit. It starts the same local server on an ephemeral port, so it does not
need a separate process.

## The 60-second path

1. **Today** opens as a signed-in member, Maya Chen, with a seeded day: 1,329 kcal, 124g protein,
   11-day streak and a planned dinner.
2. **Log food** opens a quick-add sheet. Pick chicken, switch to **Hand portions**, choose **Dinner**,
   add it. The calorie ring, macro bars and meal list update.
3. **Meal plan** shows the saved three-day plan. Change a control and **Generate plan** to exercise
   the server route and the usage meter.
4. **Progress** shows the eight-week weight trend, seven-day protein chart and 14-day calendar.
   **Log weight** writes a new weigh-in.
5. **Owner review** is the preview of the `member_summary` database view, not an admin page.
6. **Account** exports a JSON copy of the member's data and has the two-step account deletion flow.

## What is real and what is simulated

| Area | This prototype | Production Phase 1 |
| --- | --- | --- |
| Auth | Seeded member session, no login wall for the demo | Supabase Auth email/password + reset, optional Google |
| Database | Browser `localStorage`, one seeded member | Postgres tables with RLS on every member-owned row |
| Owner view | Seeded `member_summary` table | SQL view read in the Supabase dashboard as owner |
| AI route | Real serverless function; falls back to a deterministic demo plan when no key is set | Same route with `ANTHROPIC_API_KEY` in Vercel env |
| Usage limits | Per warm function instance, plus client display | Postgres `ai_usage` table keyed by member and date |
| Account deletion | Clears local data, shows the deleted state | Server deletes the auth user; FK cascade removes rows |
| Export | Real JSON download from local state | Server route reads the member's rows and returns JSON |

The server route is real code, not a mock: it validates the inputs, meters the member, calls Anthropic
when `ANTHROPIC_API_KEY` exists, validates the model JSON and falls back safely. The key never enters
the browser bundle.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | No (demo falls back) | Server-only Anthropic key |
| `ANTHROPIC_MODEL` | No | Overrides the default model id |
| `AI_DAILY_LIMIT` | No | Defaults to 3, capped at 50 |

On Vercel, set these under **Project → Settings → Environment Variables**. Do not add a `VITE_` or
`NEXT_PUBLIC_` prefix: this app reads them only inside `api/meal-plan.mjs`.

## Security model for the real build

The prototype shows the shape; the production policies are the deliverable. The rules:

1. **Every member-owned table has `member_id uuid not null references auth.users(id)`**:
   `profiles`, `macro_plans`, `meal_plans`, `meal_logs`, `daily_logs`, `water_logs`, `ai_usage`.
2. **RLS is enabled and forced on every one of those tables.** The member policy is the same in all
   four verbs:

   ```sql
   create policy "members read their own rows"
     on public.meal_logs for select
     using (member_id = auth.uid());

   create policy "members insert their own rows"
     on public.meal_logs for insert
     with check (member_id = auth.uid());

   create policy "members update their own rows"
     on public.meal_logs for update
     using (member_id = auth.uid())
     with check (member_id = auth.uid());

   create policy "members delete their own rows"
     on public.meal_logs for delete
     using (member_id = auth.uid());
   ```

3. **Admin reads use a helper, not a recursive policy.** A policy that queries `profiles` from inside
   a `profiles` policy recurses. The helper is `security definer`, `stable`, with a fixed
   `search_path`:

   ```sql
   create or replace function public.is_admin()
   returns boolean
   language sql
   stable
   security definer
   set search_path = public
   as $$
     select exists (
       select 1 from public.profiles
       where id = auth.uid() and role = 'admin'
     );
   $$;
   ```

   Then `create policy "admins read all" on public.meal_logs for select using (public.is_admin());`
   Permissive policies are OR-ed, so members keep their own-row access and admins read everything.

4. **The `role` column is not member-writable.** A trigger, or column-level `revoke`, blocks a member
   from promoting themselves through an `update` on `profiles`. The service role is the only writer.
5. **The summary view runs with `security_invoker = true`**, so it inherits the caller's RLS. The
   owner reads it in the Supabase dashboard with the service role; a member using the anon key sees
   only their own row.
6. **Server secrets stay server-side.** The anon key is public by design; the service-role key and
   Anthropic key are only Vercel environment variables. No `service_role` key in the client.
7. **Deletion is server-owned.** A Postgres function or Edge Function deletes the `auth.users` row
   after verifying `auth.uid()`, and `on delete cascade` removes the member's data. The client cannot
   delete arbitrary ids.

### AI cost control

The order matters: authenticate → read the member id from the verified session, not the request body →
check `ai_usage` for `(member_id, current_date)` → reject at the limit → call the model → increment
the counter atomically. The prototype reads `x-member-id` because there is no real session yet; in
production that header is replaced by `auth.uid()` from the JWT. The limit is also enforced in the
UI, but the UI is not the control.

`ai_usage` should have a unique key on `(member_id, usage_date)` and a `security definer` function
that does `insert ... on conflict do update set generations = generations + 1 returning generations`,
so two parallel requests cannot both pass a read-then-write check.

## Files

| File | Role |
| --- | --- |
| `index.html` | App shell, all three views and the dialogs |
| `styles.css` | Design system and responsive layout |
| `app.js` | Rendering, logging, plan generation, charts, export and deletion |
| `data.js` | Seed member, foods, plan and summary rows |
| `api/meal-plan.mjs` | Vercel serverless route, validation, Anthropic call, usage limit |
| `dev-server.mjs` | Local static server and API route (excluded from deploy) |
| `verify.mjs` | Route, API and limit checks (excluded from deploy) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installable PWA |
| `DEMO.md` | Click path and what is deliberately fake |

## Deploy

The repository is shaped for Vercel as static files plus `api/`. Push it, import it, add the env
variables and deploy. `vercel.json` keeps the service worker uncached and serves the manifest with
the right content type. `dev-server.mjs`, `verify.mjs`, the harness files and this README are excluded
from the upload by `.vercelignore`.

## PWA notes

The manifest is installable with 192, 512 and maskable icons, a standalone display and two shortcuts.
The service worker caches the shell and serves navigation network-first. On iPhone the install path
is Safari → Share → Add to Home Screen; on Android it is the browser menu → Install app. Service
workers require HTTPS, which Vercel provides (localhost is also allowed).

## Production cutover, in order

1. Create the Supabase project under the client's email, run the schema and RLS migrations, enable
   email/password and the reset template.
2. Add the Supabase URL and anon key to the client; add the service-role key only to Vercel.
3. Replace the seeded `loadState` with a repository module that uses the Supabase client.
4. Move the summary view into a migration and read it in the dashboard as owner.
5. Move `ai_usage` and deletion into server functions with `auth.uid()`.
6. Test on a real iPhone and Android home screen, including offline shell and password reset.
