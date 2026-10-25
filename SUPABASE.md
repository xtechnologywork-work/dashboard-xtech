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
