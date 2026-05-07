import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { gatewayFetch, getPaddleClient, type PaddleEnv } from '@/lib/paddle.server';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { supabase } from '@/integrations/supabase/client';

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: PaddleEnv }) => data)
  .handler(async ({ data }) => {
    const response = await gatewayFetch(data.environment, `/prices?external_id=${encodeURIComponent(data.priceId)}`);
    const result = await response.json();
    if (!result.data?.length) throw new Error("Price not found");
    return result.data[0].id as string;
  });

// Attaches the user's Supabase access token as a Bearer header so
// requireSupabaseAuth can validate the request.
const withSupabaseBearer = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);

export const createCustomerPortalUrl = createServerFn({ method: "POST" })
  .middleware([withSupabaseBearer, requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('paddle_customer_id, paddle_subscription_id, environment')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!sub?.paddle_customer_id) throw new Error('No subscription found');
    const paddle = getPaddleClient(sub.environment as PaddleEnv);
    const session = await paddle.customerPortalSessions.create(
      sub.paddle_customer_id as string,
      [sub.paddle_subscription_id as string],
    );
    return { url: session.urls.general.overview as string };
  });
