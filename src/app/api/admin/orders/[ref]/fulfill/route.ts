import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/db';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ ref: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  await requireAdmin();
  const { ref } = await params;

  const now = new Date().toISOString();

  // Mark as fulfilled AND purge the encrypted card payload.
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'fulfilled',
      fulfilled_at: now,
      card_ciphertext: null,
      card_iv: null,
      card_tag: null,
      card_purged_at: now,
    })
    .eq('ref', ref)
    .select('id, ref')
    .maybeSingle<{ id: string; ref: string }>();

  if (error) {
    console.error('[admin/fulfill] update failed', error);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ref: data.ref });
}
