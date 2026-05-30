import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/db';
import { FL_STATE_CODE } from '@/lib/us-states';
import { pharmacyStorefrontUrl } from '@/lib/pharmacy';

export const dynamic = 'force-dynamic';

/**
 * Single source of truth for "Continue to Pharmacy" routing.
 *
 *   Not signed in        → /login?next=pharmacy
 *   Signed in, no state  → /account/shipping?next=/order-out-of-state
 *   FL shipping          → Bloom storefront (commission preserved)
 *   non-FL shipping      → /order-out-of-state (our managed OOS funnel)
 *
 * State is read from user_profiles directly so a stale JWT can't route a
 * non-FL customer to Bloom.
 */
export async function GET(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const nextParam = url.searchParams.get('next') ?? '/order-out-of-state';

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login?next=pharmacy', url.origin));
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('shipping_state')
    .eq('user_id', session.user.id)
    .maybeSingle<{ shipping_state: string | null }>();

  const state = (profile?.shipping_state ?? '').toUpperCase();

  if (!state) {
    const sp = new URLSearchParams({ next: nextParam });
    return NextResponse.redirect(
      new URL(`/account/shipping?${sp.toString()}`, url.origin),
    );
  }

  if (state === FL_STATE_CODE) {
    return NextResponse.redirect(pharmacyStorefrontUrl());
  }

  return NextResponse.redirect(new URL(nextParam, url.origin));
}
