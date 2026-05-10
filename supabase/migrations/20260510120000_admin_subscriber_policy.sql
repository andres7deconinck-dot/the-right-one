-- Allow admin user to read all profiles (for subscriber management)
-- The admin is identified by their email address stored in auth.users
create policy "Admin can view all profiles"
  on public.profiles
  for select
  using (
    auth.uid() = id
    or (
      select email from auth.users where id = auth.uid()
    ) = 'info.neurixx@gmail.com'
  );

-- Drop the old non-admin select policy since we're replacing it above
-- (the new policy handles both own profile AND admin-all)
drop policy if exists "Users can view own profile" on public.profiles;
