XTechnology Group - CEO Dashboard
=================================
Open the dashboard:  npm run dev  ->  http://localhost:3000/   (index.html)
Rebuild after editing src/:  node build.js   (writes index.html and xtech-hq.html)

Data and sign-in live in Supabase (see SUPABASE.md). Run supabase_secure.sql once, then
supabase_patch_logins.sql. People are added in Team (email + password) or Users & Access.

src/
  p1.html          CSS + page shell
  p2.js p3.js p4.js p5.js   app code (state, views, actions, Supabase adapter, business suite)
  logo_t.b64 mark_t.b64     logos
Private data (src/seed.json, supabase_setup.sql) is git-ignored and never embedded in the build
unless you run:  XTECH_EMBED_SEED=1 node build.js   (do NOT commit that output).
