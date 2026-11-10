-- ==========================================================================
-- XTECHNOLOGY GROUP - MASTER SECURITY SQL  (run ONCE in Supabase > SQL Editor)
--
-- BEFORE running:
--   1) Supabase > Authentication > Providers > Email : turn OFF "Confirm email".
--   2) Supabase > Authentication > Users > Add user > "Create new user"
--        email: infos@xtechnology.group   password: (choose a NEW strong one)
--        tick "Auto Confirm User".
--   3) Deploy / open the NEW xtech-hq.html (built from this repo) - the old one
--      can no longer sign in once this script has run.
--
-- What it does:
--   * Closes the table to the public anon key (no more open read/write).
--   * Only signed-in users that have an ACTIVE account in the dashboard can read/write,
--     and only the data their role/pages allow (super admin = everything).
--   * Removes stored password hashes from the dashboard users (Supabase Auth owns passwords now).
--   * Audit log is append-only. Nobody can sign up unless a super admin invited the email first.
--   * Super admin can reset / remove other people's logins from inside the dashboard.
--
-- DO NOT re-run supabase_setup.sql afterwards: it re-opens the table to the public.
-- ==========================================================================

create extension if not exists pgcrypto with schema extensions;

-- 0. make sure the base table exists --------------------------------------
create table if not exists public.docs (
  col text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (col, id)
);

-- 1. make sure a super admin account exists in the dashboard --------------
insert into public.docs (col, id, data)
select 'users', 'usr_superadmin',
  jsonb_build_object('id','usr_superadmin','name','Co-Fonder | Bader Bensalah','email','infos@xtechnology.group',
    'role','superadmin','title','Co-Founder','active',true,'scope','all','pages','[]'::jsonb,
    'teamId','dv3yk1dw6tk95if7zs42','createdAt',to_char(now(),'YYYY-MM-DD'))
where not exists (select 1 from public.docs where col='users' and data->>'role'='superadmin');

-- 2. stored password hashes are no longer used -----------------------------
update public.docs set data = data - 'passHash' where col='users' and data ? 'passHash';

-- 3. helper functions ------------------------------------------------------
create or replace function public.xt_me() returns jsonb
language sql stable security definer set search_path = public as $$
  select data from public.docs
  where col='users'
    and lower(data->>'email') = lower(coalesce(auth.jwt()->>'email',''))
    and coalesce(data->>'active','true') <> 'false'
  limit 1
$$;

create or replace function public.xt_is_super() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((public.xt_me())->>'role','') = 'superadmin'
$$;

create or replace function public.xt_page(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.xt_is_super() or coalesce((public.xt_me())->'pages' ? p, false)
$$;

create or replace function public.xt_can(c text, d jsonb, w boolean) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare me jsonb := public.xt_me(); team text; own boolean;
begin
  if me is null then return false; end if;
  if me->>'role' = 'superadmin' then return true; end if;
  team := coalesce(me->>'teamId','');
  own  := coalesce(me->>'scope','all') = 'own' and team <> '';
  case c
    when 'users'    then return (not w) or lower(d->>'email') = lower(coalesce(auth.jwt()->>'email',''));
    when 'settings' then return not w;
    when 'audit'    then return w;                                   -- anyone may append, only super reads
    when 'payroll'  then return false;
    when 'payouts'  then return (not w) and d->>'teamId' = team and team <> '';
    when 'commissions' then
      if w then return public.xt_page('sales') or public.xt_page('customers'); end if;
      return d->>'teamId' = team and team <> '';
    when 'leads'     then if w and not public.xt_page('sales') then return false; end if;
                          return (not own) or d->>'owner' = team;
    when 'customers' then if w and not (public.xt_page('customers') or public.xt_page('sales')) then return false; end if;
                          return (not own) or d->>'owner' = team;
    when 'events'    then if w and not public.xt_page('calendar') then return false; end if;
                          return (not own) or coalesce(d->>'owner','') in ('', team);
    when 'products'  then return (not w) or public.xt_page('products');
    when 'team'      then return (not w) or public.xt_page('team');
    when 'tasks'     then return public.xt_page('tasks');
    when 'expenses'  then return public.xt_page('expenses') or public.xt_page('reports');
    when 'cash'      then return public.xt_page('cashflow');
    when 'targets'   then return public.xt_page('targets');
    when 'marketing' then return public.xt_page('marketing');
    when 'reviews'   then return public.xt_page('reviews');
    when 'invoices'  then return public.xt_page('invoices');
    when 'okrs'      then return public.xt_page('okrs');
    when 'vault'     then return public.xt_page('vault');
    else return false;
  end case;
end $$;

-- 4. protect sensitive fields of user accounts + immutable audit ------------
create or replace function public.xt_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    if old.col = 'audit' then raise exception 'audit log is read-only'; end if;
    new.col := old.col; new.id := old.id;
    if old.col = 'users' and not public.xt_is_super() then
      new.data := new.data || jsonb_build_object(
        'role', old.data->'role', 'active', old.data->'active', 'pages', old.data->'pages',
        'scope', old.data->'scope', 'email', old.data->'email', 'teamId', old.data->'teamId');
    end if;
  end if;
  return new;
end $$;
drop trigger if exists xt_guard_trg on public.docs;
create trigger xt_guard_trg before update on public.docs for each row execute function public.xt_guard();

-- 5. row level security ------------------------------------------------------
alter table public.docs enable row level security;
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname='public' and tablename='docs' loop
    execute format('drop policy %I on public.docs', r.policyname);
  end loop;
end $$;

create policy docs_select on public.docs for select to authenticated using (public.xt_can(col, data, false));
create policy docs_insert on public.docs for insert to authenticated with check (public.xt_can(col, data, true));
create policy docs_update on public.docs for update to authenticated
  using (col <> 'audit' and public.xt_can(col, data, true)) with check (public.xt_can(col, data, true));
create policy docs_delete on public.docs for delete to authenticated
  using (col <> 'audit' and public.xt_can(col, data, true));

revoke all on public.docs from anon;
revoke all on public.docs from public;
grant select, insert, update, delete on public.docs to authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and tablename='docs') then
    alter publication supabase_realtime add table public.docs;
  end if;
end $$;

-- 6. only invited emails can ever get a login --------------------------------
create or replace function public.xt_signup_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.docs where col='users' and lower(data->>'email') = lower(new.email)) then
    raise exception 'This email has not been invited to the dashboard';
  end if;
  return new;
end $$;
drop trigger if exists xt_signup_guard_trg on auth.users;
create trigger xt_signup_guard_trg before insert on auth.users for each row execute function public.xt_signup_guard();

-- 7. functions the dashboard calls -------------------------------------------
create or replace function public.xtech_auth_required() returns boolean
language sql stable as $$ select true $$;

create or replace function public.admin_set_password(p_email text, p_password text) returns boolean
language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if not public.xt_is_super() then raise exception 'not allowed'; end if;
  if length(coalesce(p_password,'')) < 8 then raise exception 'password too short'; end if;
  update auth.users set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')), updated_at = now()
  where lower(email) = lower(p_email);
  return found;
end $$;

create or replace function public.admin_delete_login(p_email text) returns boolean
language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.xt_is_super() then raise exception 'not allowed'; end if;
  if lower(p_email) = lower(coalesce(auth.jwt()->>'email','')) then raise exception 'cannot remove your own login'; end if;
  delete from auth.users where lower(email) = lower(p_email);
  return found;
end $$;

revoke execute on function public.admin_set_password(text,text) from public, anon;
revoke execute on function public.admin_delete_login(text) from public, anon;
grant  execute on function public.admin_set_password(text,text) to authenticated;
grant  execute on function public.admin_delete_login(text) to authenticated;
grant  execute on function public.xtech_auth_required() to anon, authenticated;
revoke execute on function public.xt_me(), public.xt_is_super(), public.xt_page(text), public.xt_can(text,jsonb,boolean) from public, anon;
grant  execute on function public.xt_me(), public.xt_is_super(), public.xt_page(text), public.xt_can(text,jsonb,boolean) to authenticated;

-- Done. Check: in the SQL editor run  select count(*) from public.docs;  (works for you),
-- but the same query with only the anon key (public) now returns nothing.
