-- Create public storage bucket for session reports if it doesn't exist
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'session-reports'
  ) then
    perform storage.create_bucket('session-reports', true);
  end if;
end $$;

-- Ensure the bucket is marked as public
update storage.buckets
set public = true
where id = 'session-reports';

-- Create a read policy for the bucket if it doesn't already exist
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and polname = 'session_reports_read_public'
  ) then
    create policy "session_reports_read_public"
      on storage.objects
      for select
      using (bucket_id = 'session-reports');
  end if;
end $$;


