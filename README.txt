XTechnology Group - CEO Dashboard (STANDALONE, no claude.ai needed)
===================================================================
Open xtech-hq.html (double-click, or serve the folder with any local server / Antigravity preview).
Login: infos@xtechnology.group  (your password)

- Data is stored in the browser (IndexedDB), per address. file:// and localhost:PORT are different
  storages. First run auto-imports your current data (src/seed.json: 114 leads/customers, team, users...).
- Settings > Backup exports everything to JSON. xtechResetLocalData() in the console resets to the seed.

src/
  p1.html            CSS + page shell
  p2.js p3.js p4.js  app code (state, views, actions)
  db-adapter.js      the ONLY file that talks to the database -> replace with Supabase later (see SUPABASE.md)
  seed.json          exported data (first-run import)
  build_standalone.py  python src/build_standalone.py -> rebuilds ../xtech-hq.html
