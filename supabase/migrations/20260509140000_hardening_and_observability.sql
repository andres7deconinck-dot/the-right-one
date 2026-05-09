create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_request_logs_user_endpoint_created_idx
  on public.ai_request_logs (user_id, endpoint, created_at desc);

alter table public.ai_request_logs enable row level security;

drop policy if exists "Users can insert own ai logs" on public.ai_request_logs;
create policy "Users can insert own ai logs"
  on public.ai_request_logs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own ai logs" on public.ai_request_logs;
create policy "Users can read own ai logs"
  on public.ai_request_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.consume_card_quota(p_user_id uuid)
returns table(plan text, used integer, remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_used integer;
  v_limit integer;
begin
  select coalesce(p.plan, 'free'), coalesce(p.cards_used_this_month, 0)
  into v_plan, v_used
  from public.profiles p
  where p.id = p_user_id
  for update;

  if v_plan is null then
    v_plan := 'free';
  end if;

  v_limit := case
    when v_plan = 'free' then 3
    else 10000
  end;

  if v_used >= v_limit then
    return query select v_plan, v_used, 0;
    return;
  end if;

  update public.profiles
  set cards_used_this_month = v_used + 1
  where id = p_user_id;

  return query select v_plan, v_used + 1, greatest(0, v_limit - (v_used + 1));
end;
$$;

grant execute on function public.consume_card_quota(uuid) to authenticated;

create table if not exists public.paddle_webhook_events (
  event_id text primary key,
  environment text not null,
  event_type text not null,
  subscription_id text,
  occurred_at timestamptz,
  processed_at timestamptz not null default now()
);

create index if not exists paddle_webhook_events_sub_idx
  on public.paddle_webhook_events (subscription_id, environment, occurred_at desc);

create table if not exists public.paddle_subscription_event_state (
  paddle_subscription_id text not null,
  environment text not null,
  last_event_occurred_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (paddle_subscription_id, environment)
);

revoke all on table public.paddle_webhook_events from anon, authenticated;
revoke all on table public.paddle_subscription_event_state from anon, authenticated;
