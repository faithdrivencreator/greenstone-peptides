import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/db';
import { decryptCard } from '@/lib/order-crypto';

// Force Node runtime — uses node:crypto via order-crypto.
export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ ref: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { email } = await requireAdmin();
  const { ref } = await params;

  // Pull the encrypted blob ONLY when reveal is requested.
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, card_ciphertext, card_iv, card_tag, card_purged_at')
    .eq('ref', ref)
    .maybeSingle<{
      id: string;
      card_ciphertext: string | null;
      card_iv: string | null;
      card_tag: string | null;
      card_purged_at: string | null;
    }>();

  if (error) {
    console.error('[admin/reveal] lookup failed', error);
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (order.card_purged_at || !order.card_ciphertext || !order.card_iv || !order.card_tag) {
    return NextResponse.json({ error: 'card_purged' }, { status: 410 });
  }

  let cardPayload;
  try {
    cardPayload = decryptCard({
      ciphertext: order.card_ciphertext,
      iv: order.card_iv,
      tag: order.card_tag,
    });
  } catch (e) {
    // Don't leak crypto details. Log only the message, never the ciphertext.
    console.error('[admin/reveal] decrypt failed:', (e as Error).message);
    return NextResponse.json({ error: 'decrypt_failed' }, { status: 500 });
  }

  // Log the access — never log the card itself.
  const userAgent = req.headers.get('user-agent');
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;

  const { error: logErr } = await supabaseAdmin.from('card_access_log').insert({
    order_id: order.id,
    accessed_by_email: email,
    user_agent: userAgent,
    ip,
  });
  if (logErr) {
    // The reveal happened — we'd rather return the card to Pete than fail
    // because of a log write. But surface a warning.
    console.warn('[admin/reveal] card_access_log insert failed', logErr);
  }

  // IMPORTANT: NEVER console.log(cardPayload). Returning over HTTPS only.
  return NextResponse.json({ card: cardPayload });
}
