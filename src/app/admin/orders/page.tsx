import Link from 'next/link';
import { supabaseAdmin } from '@/lib/db';
import type { OrderRow } from '@/lib/db';

type ListRow = Pick<OrderRow,
  'id' | 'ref' | 'full_name' | 'email' | 'created_at' | 'status' | 'total_cents' | 'product' | 'card_purged_at'
>;

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function statusBadge(status: OrderRow['status'], purged: boolean) {
  const base = 'inline-block px-2 py-0.5 font-jetbrains text-[0.55rem] tracking-widest uppercase border';
  if (status === 'fulfilled') {
    return (
      <span className={`${base} bg-emerald/15 text-emerald border-emerald/40`}>
        Fulfilled{purged ? ' · purged' : ''}
      </span>
    );
  }
  if (status === 'cancelled') {
    return <span className={`${base} bg-rose-900/20 text-rose-300 border-rose-500/40`}>Cancelled</span>;
  }
  return <span className={`${base} bg-gold/15 text-gold border-gold/40`}>Awaiting</span>;
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

export default async function AdminOrdersPage() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, ref, full_name, email, created_at, status, total_cents, product, card_purged_at')
    .order('created_at', { ascending: false })
    .limit(200);

  const orders: ListRow[] = (data as ListRow[]) || [];

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">
            Out-of-state orders
          </div>
          <h1 className="font-cormorant text-3xl text-cream tracking-tight">
            All orders
          </h1>
        </div>
        <div className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim">
          {orders.length} total
        </div>
      </div>

      {error && (
        <div className="border border-rose-500/40 bg-rose-900/20 text-rose-200 px-4 py-3 text-sm mb-6">
          Failed to load orders: {error.message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 px-6 py-12 text-center">
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim">
            No orders yet
          </div>
          <div className="text-cream-dim/70 text-sm mt-3">
            New out-of-state orders will appear here as customers submit the order form.
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
              {orders.map((o) => (
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
                  <td className="px-4 py-3">{statusBadge(o.status, !!o.card_purged_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
