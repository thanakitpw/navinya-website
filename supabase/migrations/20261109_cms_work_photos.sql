-- Lets CMS editors manage work photos (the galleries under /works/*) from /admin/works.
-- Changes go live at once: work photos have no draft state.

create policy work_photos_cms_insert on public.work_photos
  for insert to authenticated with check ((select private.is_cms_user()));
create policy work_photos_cms_update on public.work_photos
  for update to authenticated
  using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy work_photos_cms_delete on public.work_photos
  for delete to authenticated using ((select private.is_cms_user()));

-- Visitors only ever read; the old blanket grants let RLS be the only guard.
revoke insert, update, delete, truncate, references, trigger on public.work_photos from anon;
revoke truncate, references, trigger on public.work_photos from authenticated;

create index if not exists work_photos_service_sort_idx on public.work_photos (service, sort_order);

-- Rewrites sort_order so photos appear in the given order (one service at a time).
create or replace function public.cms_reorder_work_photos(p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_cms_user()) then
    raise exception 'ไม่มีสิทธิ์แก้ไขผลงาน' using errcode = '42501';
  end if;
  update public.work_photos w
     set sort_order = o.pos
    from unnest(p_ids) with ordinality as o(id, pos)
   where w.id = o.id;
end;
$$;

revoke all on function public.cms_reorder_work_photos(uuid[]) from public, anon;
grant execute on function public.cms_reorder_work_photos(uuid[]) to authenticated;

-- The works bucket: editors may list, upload and remove. Storage needs select to remove.
create policy works_cms_select on storage.objects
  for select to authenticated using (bucket_id = 'works' and (select private.is_cms_user()));
create policy works_cms_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'works' and (select private.is_cms_user()));
create policy works_cms_delete on storage.objects
  for delete to authenticated using (bucket_id = 'works' and (select private.is_cms_user()));
