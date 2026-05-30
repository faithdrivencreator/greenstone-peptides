import Link from 'next/link';
import { supabaseAdmin } from '@/lib/db';
import type { OrderRow } from '@/lib/db';

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(s: string) {
  const d = new Date(s);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function fmtDateOnly(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type StatTileProps = {
  kicker: string;
  value: string;
  hint?: string;
  accent?: 'emerald' | 'gold' | 'cream';
};

function StatTile({ kicker, value, hint, accent = 'cream' }: StatTileProps) {
  const accentClass =
    accent === 'emerald' ? 'text-emerald-light' : accent === 'gold' ? 'text-gold' : 'text-cream';
  return (
    <div className="border border-cream-dim/15 bg-obsidian-mid/30 px-5 py-5">
      <div className="font-jetbrains text-[0.55rem] tracking-widest uppercase text-cream-dim mb-2">
        {kicker}
      </div>
      <div className={`font-cormorant text-3xl tracking-tight ${accentClass}`}>{value}</div>
      {hint && (
        <div className="font-jetbrains text-[0.6rem] tracking-wider uppercase text-cream-dim/60 mt-2">
          {hint}
        </div>
      )}
    </div>
  );
}

type OrderListRow = Pick<
  OrderRow,
  'id' | 'ref' | 'full_name' | 'email' | 'created_at' | 'status' | 'total_cents' | 'product' | 'card_purged_at'
>;

export default async function AdminHomePage() {
  // ---- Pull data in parallel -----------------------------------------------
  const [ordersRes, customersRes] = await Promise.all([
    supabaseAdmin
      .from('orders')
      .select('id, ref, full_name, email, created_at, status, total_cents, product, card_purged_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supabaseAdmin
      .from('users')
      .select('id, email, created_at, user_profiles(full_name, shipping_state)')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const orders: OrderListRow[] = (ordersRes.data as OrderListRow[]) ?? [];
  // Supabase typed `user_profiles` as an array (it doesn't know the relationship
  // is one-to-one), so we normalise to `profile = first element | null`.
  const customersRaw = (customersRes.data ?? []) as unknown as Array<{
    id: string;
    email: string;
    created_at: string;
    user_profiles: Array<{ full_name: string | null; shipping_state: string | null }> | null;
  }>;
  const customers = customersRaw.map((c) => ({
    id: c.id,
    email: c.email,
    created_at: c.created_at,
    profile: c.user_profiles?.[0] ?? null,
  }));

  // ---- Compute stats -------------------------------------------------------
  const totalOrders = orders.length;
  const awaiting = orders.filter((o) => o.status === 'awaiting_fulfillment').length;
  const fulfilled = orders.filter((o) => o.status === 'fulfilled').length;
  const revenueCents = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_cents ?? 0), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">
          Operations
        </div>
        <h1 className="font-cormorant text-4xl text-cream tracking-tight">Dashboard</h1>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatTile
          kicker="Awaiting fulfillment"
          value={String(awaiting)}
          hint={awaiting > 0 ? 'Action needed' : 'All caught up'}
          accent={awaiting > 0 ? 'gold' : 'emerald'}
        />
        <StatTile kicker="Fulfilled" value={String(fulfilled)} accent="emerald" />
        <StatTile kicker="Total orders" value={String(totalOrders)} />
        <StatTile kicker="Gross revenue" value={dollars(revenueCents)} accent="emerald" />
      </div>

      {/* Recent orders */}
      <div className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-1">
              Latest
            </div>
            <h2 className="font-cormorant text-2xl text-cream tracking-tight">Recent orders</h2>
          </div>
          <Link
            href="/admin/orders"
            className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-cream-dim/15 bg-obsidian-mid/30 px-6 py-12 text-center">
            <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim">
              No orders yet
            </div>
            <div className="text-cream-dim/70 text-sm mt-3">
              When a customer places an order, it will land here.
            </div>
          </div>
        ) : (
          <div className="border border-cream-dim/15 bg-obsidian-mid/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dim/15 text-cream-dim font-jetbrains text-[0.55rem] tracking-widest uppercase">
                  <th className="text-left px-4 py-3">Ref</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Placed</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const status =
                    o.status === 'fulfilled'
                      ? { label: 'Fulfilled', cls: 'bg-emerald/15 text-emerald border-emerald/40' }
                      : o.status === 'cancelled'
                      ? { label: 'Cancelled', cls: 'bg-rose-900/20 text-rose-300 border-rose-500/40' }
                      : { label: 'Awaiting', cls: 'bg-gold/15 text-gold border-gold/40' };
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-cream-dim/10 last:border-0 hover:bg-obsidian/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${o.ref}`}
                          className="font-jetbrains text-emerald-light hover:text-emerald tracking-wider"
                        >
                          {o.ref}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-cream">{o.full_name}</div>
                        <div className="text-cream-dim/70 text-xs">{o.email}</div>
                      </td>
                      <td className="px-4 py-3 text-cream-dim">{o.product || '—'}</td>
                      <td className="px-4 py-3 text-right text-cream font-jetbrains">
                        {dollars(o.total_cents)}
                      </td>
                      <td className="px-4 py-3 text-cream-dim text-xs">{fmtDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 font-jetbrains text-[0.55rem] tracking-widest uppercase border ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent customers */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-1">
              Accounts
            </div>
            <h2 className="font-cormorant text-2xl text-cream tracking-tight">Recent customers</h2>
          </div>
          <Link
            href="/admin/customers"
            className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
          >
            View all →
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="border border-cream-dim/15 bg-obsidian-mid/30 px-6 py-12 text-center text-cream-dim/70 text-sm">
            No customer accounts yet.
          </div>
        ) : (
          <div className="border border-cream-dim/15 bg-obsidian-mid/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dim/15 text-cream-dim font-jetbrains text-[0.55rem] tracking-widest uppercase">
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">State</th>
                  <th className="text-left px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-cream-dim/10 last:border-0">
                    <td className="px-4 py-3 text-cream">{c.profile?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-cream-dim">{c.email}</td>
                    <td className="px-4 py-3 text-cream-dim font-jetbrains text-xs">
                      {c.profile?.shipping_state || '—'}
                    </td>
                    <td className="px-4 py-3 text-cream-dim text-xs">{fmtDateOnly(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
