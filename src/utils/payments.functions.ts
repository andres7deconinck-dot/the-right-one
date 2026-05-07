import { createServerFn } from "@tanstack/react-start";
import { gatewayFetch, getPaddleClient, type PaddleEnv } from '@/lib/paddle.server';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: PaddleEnv }) => data)
  .handler(async ({ data }) => {
    const response = await gatewayFetch(data.environment, `/prices?external_id=${encodeURIComponent(data.priceId)}`);
    const result = await response.json();
    if (!result.data?.length) throw new Error("Price not found");
    return result.data[0].id as string;
  });

export const createCustomerPortalUrl = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { data: userRes, error: authErr } = await supabaseAdmin.auth.getUser(data.accessToken);
    if (authErr || !userRes?.user) throw new Error('Unauthorized');
    const userId = userRes.user.id;

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
