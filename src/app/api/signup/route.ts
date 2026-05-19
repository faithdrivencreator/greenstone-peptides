import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db';
import { sendWelcomeEmail, sendSignupNotification } from '@/lib/auth-emails';

const SignupSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  full_name: z.string().min(1).max(120),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date_of_birth must be YYYY-MM-DD'),
  accepted_age_21: z.literal(true),
  accepted_ruo: z.literal(true),
  accepted_liability: z.literal(true),
});

function calcAgeYears(dobIso: string) {
  const dob = new Date(dobIso + 'T00:00:00Z');
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const m = now.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;
  const email = data.email.toLowerCase().trim();

  // Hard age check, server-side — we don't trust the box
  if (calcAgeYears(data.date_of_birth) < 21) {
    return NextResponse.json({ error: 'under_21' }, { status: 400 });
  }

  // Check for existing account
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'email_in_use' }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(data.password, 12);
  const now = new Date().toISOString();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const ua = req.headers.get('user-agent') || null;

  // Insert user
  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .insert({ email, password_hash })
    .select('id, email')
    .single();

  if (userErr || !user) {
    console.error('[signup] insert user failed', userErr);
    return NextResponse.json({ error: 'signup_failed' }, { status: 500 });
  }

  // Insert profile
  const { error: profileErr } = await supabaseAdmin.from('user_profiles').insert({
    user_id: user.id,
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    accepted_age_21_at: now,
    accepted_ruo_at: now,
    accepted_liability_at: now,
    signup_ip: ip,
    signup_user_agent: ua,
  });

  if (profileErr) {
    console.error('[signup] insert profile failed', profileErr);
    // Best-effort: roll back the user row so they can retry
    await supabaseAdmin.from('users').delete().eq('id', user.id);
    return NextResponse.json({ error: 'signup_failed' }, { status: 500 });
  }

  // Fire welcome email + admin signup notification (don't block on either)
  sendWelcomeEmail({ to: user.email, name: data.full_name }).catch(() => {});
  sendSignupNotification({
    email: user.email,
    fullName: data.full_name,
    dateOfBirth: data.date_of_birth,
    ip,
    userAgent: ua,
  }).catch(() => {});

  return NextResponse.json({ ok: true, email: user.email }, { status: 201 });
}
