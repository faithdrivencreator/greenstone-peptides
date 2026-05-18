import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AddressManager } from './AddressManager';
import type { ShippingAddressRow } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shipping addresses',
  alternates: { canonical: '/account/addresses' },
};

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?from=/account/addresses');

  const { data } = await supabaseAdmin
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  const addresses = (data ?? []) as ShippingAddressRow[];

  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl">
        <header className="mb-10">
          <p className="eyebrow">Account · Addresses</p>
          <h1>Shipping addresses</h1>
          <p className="mt-3 text-cream-dim">
            Saved here so you don&rsquo;t have to retype them on every prescription request.
          </p>
        </header>

        <AddressManager initialAddresses={addresses} />
      </div>
    </section>
  );
}
