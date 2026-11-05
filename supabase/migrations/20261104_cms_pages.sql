-- Page-by-page CMS: text and image overrides on top of the defaults kept in code.
--
-- Rows hold only what differs from the code defaults.
--   draft_*     what editors see in the preview. NULL on a published row means
--               "go back to the default when this is next published".
--   published_* what visitors see. Saving a draft never touches it.

create schema if not exists private;

create table public.cms_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  created_at   timestamptz not null default now()
);

create or replace function private.is_cms_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.cms_users u where u.id = (select auth.uid()));
$$;

revoke all on function private.is_cms_user() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_cms_user() to authenticated;

create table public.site_copy (
  page            text not null,
  key             text not null,
  draft_value     text,
  published_value text,
  source_hash     text,
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users(id) on delete set null,
  published_at    timestamptz,
  published_by    uuid references auth.users(id) on delete set null,
  primary key (page, key)
);
create index site_copy_updated_by_idx on public.site_copy (updated_by);
create index site_copy_published_by_idx on public.site_copy (published_by);

create table public.site_images (
  src           text primary key,
  draft_url     text,
  published_url text,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id) on delete set null,
  published_at  timestamptz,
  published_by  uuid references auth.users(id) on delete set null
);
create index site_images_updated_by_idx on public.site_images (updated_by);
create index site_images_published_by_idx on public.site_images (published_by);

alter table public.cms_users   enable row level security;
alter table public.site_copy   enable row level security;
alter table public.site_images enable row level security;

create policy cms_users_self on public.cms_users
  for select to authenticated using (id = (select auth.uid()));

create policy site_copy_cms on public.site_copy
  for all to authenticated
  using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy site_copy_published_read on public.site_copy
  for select to anon using (published_value is not null);

create policy site_images_cms on public.site_images
  for all to authenticated
  using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy site_images_published_read on public.site_images
  for select to anon using (published_url is not null);

-- RLS picks rows, grants pick columns: without these, visitors could read draft columns of published rows.
revoke all on public.cms_users, public.site_copy, public.site_images from anon, authenticated;
grant select on public.cms_users to authenticated;
grant select, insert, update, delete on public.site_copy, public.site_images to authenticated;
grant select (page, key, published_value, source_hash) on public.site_copy to anon;
grant select (src, published_url) on public.site_images to anon;
grant all on public.cms_users, public.site_copy, public.site_images to service_role;

create or replace function public.cms_publish_pages(p_pages text[], p_images text[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if not (select private.is_cms_user()) then
    raise exception 'ไม่มีสิทธิ์เผยแพร่เนื้อหา' using errcode = '42501';
  end if;

  delete from public.site_copy where page = any(p_pages) and draft_value is null;
  update public.site_copy
     set published_value = draft_value, published_at = now(), published_by = v_uid
   where page = any(p_pages) and draft_value is distinct from published_value;

  delete from public.site_images where src = any(p_images) and draft_url is null;
  update public.site_images
     set published_url = draft_url, published_at = now(), published_by = v_uid
   where src = any(p_images) and draft_url is distinct from published_url;
end;
$$;

revoke all on function public.cms_publish_pages(text[], text[]) from public, anon;
grant execute on function public.cms_publish_pages(text[], text[]) to authenticated;

-- Uploaded page images. Public to read by URL; only editors can list, add or remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy site_media_cms_select on storage.objects
  for select to authenticated
  using (bucket_id = 'site-media' and (select private.is_cms_user()));
create policy site_media_cms_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-media' and (select private.is_cms_user()));
