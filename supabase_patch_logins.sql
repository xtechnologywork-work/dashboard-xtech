-- ==========================================================================
-- PATCH 1 (run once, after supabase_secure.sql):  lets the super admin create logins
-- for the whole team from the dashboard (Users & Access > "Set up team logins").
--   * admin_set_password now also confirms the email (works even if "Confirm email" is ON)
--   * admin_list_logins lets the dashboard see who already has a login
-- ==========================================================================

create or replace function public.admin_set_password(p_email text, p_password text) returns boolean
language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if not public.xt_is_super() then raise exception 'not allowed'; end if;
  if length(coalesce(p_password,'')) < 8 then raise exception 'password too short'; end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
         email_confirmed_at = coalesce(email_confirmed_at, now()),
         updated_at = now()
   where lower(email) = lower(p_email);
  return found;
end $$;

create or replace function public.admin_list_logins() returns text[]
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.xt_is_super() then raise exception 'not allowed'; end if;
  return coalesce((select array_agg(lower(email)) from auth.users), '{}');
end $$;

revoke execute on function public.admin_set_password(text,text) from public, anon;
revoke execute on function public.admin_list_logins() from public, anon;
grant  execute on function public.admin_set_password(text,text) to authenticated;
grant  execute on function public.admin_list_logins() to authenticated;
