# Moving to Supabase

The app only uses this interface (see `src/db-adapter.js`), exposed as `window.claude.use("db")`:

- `db.collection(c).onSnapshot(cb, errCb)` -> `cb({docs:[{id, data()}]})` fired on every change (use Supabase Realtime + initial select)
- `db.collection(c).doc()` -> ref with new random `id` ; `db.doc("col/id")` -> ref
- `ref.set(obj)` upsert, `ref.update(partial)` merge, `ref.delete()`, `ref.get()`
- `claude.use("downloads").save({filename,data})` -> browser download (already implemented)

Suggested schema: ONE table `docs(col text, id text, data jsonb, primary key(col,id))` (+ RLS). Collections:
users, products, leads, customers, expenses, events, team, marketing, cash, targets, reviews, settings, commissions, payouts.
Import `src/seed.json` ({collection:{id:doc}}) into it.

IMPORTANT before production: login is currently client-side (users docs with passHash). With Supabase use
Supabase Auth + Row Level Security instead of exposing the users table (passHash) to every client.

## Security status (important)
- The login backdoor (default passwords, auto-created accounts) has been removed. Accounts are created only by a super admin in *Users & Access*; 8+ character passwords; 5 wrong tries lock that email for 60 s; sessions end after 30 min idle; every sign-in/change/delete is written to the Audit Log.
- Passwords are still verified in the browser and the Supabase table `docs` is still open to the anon key (policy "Enable all access for anon"). Anyone who has the page and the key can read/write the table directly. To fully close this, move login to Supabase Auth and replace that policy with per-role RLS policies, then rotate the anon key.
- Rotate the super admin password in *My account* after first sign-in; the bootstrap password in the code is only used when no super admin exists.

## Locking the database (do this once)
Run `supabase_secure.sql` in Supabase > SQL Editor (read its header first: turn OFF "Confirm email" and create the super admin login in Authentication > Users). After that the dashboard switches to Supabase Auth automatically. New people: Users & Access > New user (the password you type becomes their login). Never re-run `supabase_setup.sql`: it re-opens the table.
