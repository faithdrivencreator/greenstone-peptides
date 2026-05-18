import { auth, signOut } from '@/auth';
import { supabaseAdmin } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Your account',
  alternates: { canonical: '/account' },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?from=/account');

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('full_name, date_of_birth, phone, accepted_age_21_at, accepted_ruo_at, accepted_liability_at')
    .eq('user_id', session.user.id)
    .maybeSingle();

  const fullName = profile?.full_name || session.user.name || '';
  const email = session.user.email || '';

  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl">
        <header className="mb-12">
          <p className="eyebrow">Account</p>
          <h1>Welcome back{fullName ? `, ${fullName.split(' ')[0]}` : ''}.</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream-dim/10 mb-10">
          <Card label="Email" value={email} />
          <Card label="Full name" value={fullName || '—'} />
          <Card label="Date of birth" value={profile?.date_of_birth || '—'} />
          <Card label="Phone" value={profile?.phone || '—'} />
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="font-cormorant text-2xl text-cream mb-3" style={{ fontWeight: 400 }}>
              Shipping addresses
            </h2>
            <p className="text-cream-dim text-sm mb-4">
              Manage your saved shipping addresses for prescription request fulfillment.
            </p>
            <Link
              href="/account/addresses"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-emerald/40 text-emerald hover:bg-emerald/10 font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
            >
              Manage addresses →
            </Link>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl text-cream mb-3" style={{ fontWeight: 400 }}>
              Compliance record
            </h2>
            <div className="bg-obsidian/40 border border-cream-dim/10 p-5 text-sm text-cream-dim space-y-1.5 font-jetbrains text-[0.75rem]">
              <p>21+ acknowledged: {profile?.accepted_age_21_at ? new Date(profile.accepted_age_21_at).toLocaleString() : '—'}</p>
              <p>RUO acknowledged: {profile?.accepted_ruo_at ? new Date(profile.accepted_ruo_at).toLocaleString() : '—'}</p>
              <p>Liability acknowledged: {profile?.accepted_liability_at ? new Date(profile.accepted_liability_at).toLocaleString() : '—'}</p>
            </div>
          </section>

          <section className="pt-6 border-t border-cream-dim/10">
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim hover:text-cream hover:border-cream-dim/60 font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors"
              >
                Sign out
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-obsidian/40 p-5">
      <p className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim/70 mb-1.5">{label}</p>
      <p className="text-cream text-sm">{value}</p>
    </div>
  );
}
