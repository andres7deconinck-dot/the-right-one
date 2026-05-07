import { createFileRoute } from '@tanstack/react-router';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { verifyWebhook, EventName, type PaddleEnv } from '@/lib/paddle.server';

const PRODUCT_TO_PLAN: Record<string, string> = {
  traveler_plan: 'traveler',
  family_plan: 'family',
};

function activeForPlan(status: string): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}

async function syncProfilePlan(userId: string, env: PaddleEnv) {
  // Pick the highest tier active sub for this user/env. Family > traveler > free.
  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('product_id, status, current_period_end')
    .eq('user_id', userId)
    .eq('environment', env);

  let plan = 'free';
  const now = Date.now();
  for (const s of subs || []) {
    const end = s.current_period_end ? new Date(s.current_period_end as string).getTime() : Infinity;
    const isActive =
      (activeForPlan(s.status as string) && (!s.current_period_end || end > now)) ||
      (s.status === 'canceled' && end > now);
    if (!isActive) continue;
    const candidate = PRODUCT_TO_PLAN[s.product_id as string];
    if (!candidate) continue;
    if (candidate === 'family') plan = 'family';
    else if (plan !== 'family' && candidate === 'traveler') plan = 'traveler';
  }
  await supabaseAdmin.from('profiles').update({ plan }).eq('id', userId);
}

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const userId = data.customData?.userId;
  if (!userId) {
    console.error('Webhook: no userId in customData');
    return;
  }
  const item = data.items?.[0];
  const priceId = item?.price?.importMeta?.externalId;
  const productId = item?.product?.importMeta?.externalId;
  if (!priceId || !productId) {
    console.warn('Skipping subscription: missing importMeta.externalId');
    return;
  }
  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    paddle_subscription_id: data.id,
    paddle_customer_id: data.customerId,
    product_id: productId,
    price_id: priceId,
    status: data.status,
    current_period_start: data.currentBillingPeriod?.startsAt,
    current_period_end: data.currentBillingPeriod?.endsAt,
    environment: env,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'paddle_subscription_id' });
  await syncProfilePlan(userId, env);
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  await supabaseAdmin.from('subscriptions')
    .update({
      status: data.status,
      current_period_start: data.currentBillingPeriod?.startsAt,
      current_period_end: data.currentBillingPeriod?.endsAt,
      cancel_at_period_end: data.scheduledChange?.action === 'cancel',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', data.id)
    .eq('environment', env);
  const { data: row } = await supabaseAdmin.from('subscriptions')
    .select('user_id').eq('paddle_subscription_id', data.id).maybeSingle();
  if (row?.user_id) await syncProfilePlan(row.user_id as string, env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  await supabaseAdmin.from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('paddle_subscription_id', data.id)
    .eq('environment', env);
  const { data: row } = await supabaseAdmin.from('subscriptions')
    .select('user_id').eq('paddle_subscription_id', data.id).maybeSingle();
  if (row?.user_id) await syncProfilePlan(row.user_id as string, env);
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.eventType) {
            case EventName.SubscriptionCreated:
              await handleSubscriptionCreated(event.data, env);
              break;
            case EventName.SubscriptionUpdated:
              await handleSubscriptionUpdated(event.data, env);
              break;
            case EventName.SubscriptionCanceled:
              await handleSubscriptionCanceled(event.data, env);
              break;
            default:
              console.log('Unhandled Paddle event:', event.eventType);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error('Webhook error:', e);
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});
