import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/db';
import { US_STATE_CODES } from '@/lib/us-states';

const Body = z.object({
  shipping_state: z
    .string()
    .length(2)
    .transform((v) => v.toUpperCase())
    .refine((v) => US_STATE_CODES.includes(v), 'invalid_state'),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      shipping_state: parsed.data.shipping_state,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', session.user.id);

  if (error) {
    console.error('[account/shipping] update failed', error);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, shipping_state: parsed.data.shipping_state });
}
