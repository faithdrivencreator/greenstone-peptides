import { supabaseAdmin } from '@/lib/db';

function fmtDate(s: string) {
  return new Date(s).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type ProfileShape = {
  full_name: string | null;
  shipping_state: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  zip: string | null;
};

type CustomerRow = {
  id: string;
  email: string;
  created_at: string;
  profile: ProfileShape | null;
};

export default async function AdminCustomersPage() {
  const [{ data: rawCustomers, error }, { data: orderCounts }] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select('id, email, created_at, user_profiles(full_name, shipping_state, phone, address_line1, address_line2, city, zip)')
      .order('created_at', { ascending: false })
      .limit(500),
    supabaseAdmin.from('orders').select('user_id, status'),
  ]);

  // user_profiles arrives as an array per Supabase typing; normalise to single.
  const customersRaw = (rawCustomers ?? []) as unknown as Array<{
    id: string;
    email: string;
    created_at: string;
    user_profiles: ProfileShape[] | null;
  }>;
  const customers: CustomerRow[] = customersRaw.map((c) => ({
    id: c.id,
    email: c.email,
    created_at: c.created_at,
    profile: c.user_profiles?.[0] ?? null,
  }));

  // Aggregate per-user order counts client-side (Supabase free tier has no count groupings).
  const countsByUser = new Map<string, number>();
  for (const o of (orderCounts ?? []) as Array<{ user_id: string | null; status: string }>) {
    if (!o.user_id) continue;
    countsByUser.set(o.user_id, (countsByUser.get(o.user_id) ?? 0) + 1);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">
            Accounts
          </div>
          <h1 className="font-cormorant text-3xl text-cream tracking-tight">All customers</h1>
        </div>
        <div className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim">
          {customers.length} total
        </div>
      </div>

      {error && (
        <div className="border border-rose-500/40 bg-rose-900/20 text-rose-200 px-4 py-3 text-sm mb-6">
          Failed to load customers: {error.message}
        </div>
      )}

      {customers.length === 0 ? (
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 px-6 py-12 text-center text-cream-dim/70 text-sm">
          No customer accounts yet.
        </div>
      ) : (
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-dim/15 text-cream-dim font-jetbrains text-[0.55rem] tracking-widest uppercase">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Shipping</th>
                <th className="text-right px-4 py-3">Orders</th>
                <th className="text-left px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const p = c.profile;
                const addr = p
                  ? [p.address_line1, p.address_line2, p.city, p.shipping_state, p.zip]
                      .filter(Boolean)
                      .join(', ')
                  : '';
                return (
                  <tr
                    key={c.id}
                    className="border-b border-cream-dim/10 last:border-0 hover:bg-obsidian/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-cream">{p?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-cream-dim">{c.email}</td>
                    <td className="px-4 py-3 text-cream-dim font-jetbrains text-xs">
                      {p?.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-cream-dim text-xs max-w-xs truncate">
                      {addr || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-jetbrains text-cream">
                      {countsByUser.get(c.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-cream-dim text-xs">{fmtDate(c.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
