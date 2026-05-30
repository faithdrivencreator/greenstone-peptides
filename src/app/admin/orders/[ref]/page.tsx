import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/db';
import type { OrderRow, CardAccessLogRow } from '@/lib/db';
import { OrderActions } from './order-actions';

// PHI/PCI-adjacent — never cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(s: string | null | undefined) {
  if (!s) return '—';
  return new Date(s).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function statusBadge(status: OrderRow['status']) {
  const base = 'inline-block px-2.5 py-1 font-jetbrains text-[0.6rem] tracking-widest uppercase border';
  if (status === 'fulfilled') {
    return <span className={`${base} bg-emerald/15 text-emerald border-emerald/40`}>Fulfilled</span>;
  }
  if (status === 'cancelled') {
    return <span className={`${base} bg-rose-900/20 text-rose-300 border-rose-500/40`}>Cancelled</span>;
  }
  return <span className={`${base} bg-gold/15 text-gold border-gold/40`}>Awaiting fulfillment</span>;
}

function ynRow(label: string, val: { answer?: string; describe?: string } | undefined) {
  const ans = val?.answer || '—';
  const desc = val?.describe || '';
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-cream-dim/10 last:border-0">
      <span className="text-cream-dim text-sm">{label}</span>
      <span className="text-cream text-sm text-right">
        <span className={ans === 'yes' ? 'text-gold' : 'text-cream-dim'}>{ans.toUpperCase()}</span>
        {desc && <div className="text-cream-dim/80 text-xs mt-0.5">{desc}</div>}
      </span>
    </div>
  );
}

interface PageProps {
  params: Promise<{ ref: string }>;
}

export default async function AdminOrderDetail({ params }: PageProps) {
  const { ref } = await params;

  // Fetch everything EXCEPT the encrypted card blob. Even though only Pete can
  // reach this page, there's no reason to hydrate the ciphertext onto the
  // server-rendered HTML when nothing on first render needs it.
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      id, ref, user_id, status,
      full_name, email, phone, dob,
      ship_street, ship_apt, ship_city, ship_state, ship_zip,
      screening, product, dose, size,
      subtotal_cents, shipping_cents, total_cents,
      consents,
      card_brand, card_last4, card_exp_month, card_exp_year,
      created_at, fulfilled_at, card_purged_at, notes
    `)
    .eq('ref', ref)
    .maybeSingle<Omit<OrderRow, 'card_ciphertext' | 'card_iv' | 'card_tag'>>();

  if (error) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="border border-rose-500/40 bg-rose-900/20 text-rose-200 px-4 py-3 text-sm">
          Failed to load order: {error.message}
        </div>
      </section>
    );
  }
  if (!data) {
    notFound();
  }

  // Access log
  const { data: logRows } = await supabaseAdmin
    .from('card_access_log')
    .select('id, order_id, accessed_by_email, accessed_at, user_agent, ip')
    .eq('order_id', data.id)
    .order('accessed_at', { ascending: false })
    .limit(20);
  const log: CardAccessLogRow[] = (logRows as CardAccessLogRow[]) || [];

  const screening = (data.screening || {}) as Record<string, unknown>;
  const consents = (data.consents || {}) as Record<string, boolean>;

  const sex = (screening.sex as string) || '—';
  const height = `${(screening.height_ft as string) || '?'}'${(screening.height_in as string) || '?'}"`;
  const weight = `${(screening.weight_lbs as string) || '?'} lbs`;

  const cardPurged = !!data.card_purged_at;
  const exp =
    data.card_exp_month && data.card_exp_year
      ? `${String(data.card_exp_month).padStart(2, '0')}/${String(data.card_exp_year).slice(-2)}`
      : '—';

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim hover:text-emerald-light transition-colors"
        >
          &larr; All orders
        </Link>
      </div>

      <div className="flex items-end justify-between mb-8 pb-4 border-b border-cream-dim/15">
        <div>
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">
            Order
          </div>
          <h1 className="font-cormorant text-3xl text-cream tracking-tight">
            {data.ref}
          </h1>
          <div className="text-cream-dim text-xs mt-1">Placed {fmtDate(data.created_at)}</div>
        </div>
        <div className="text-right">
          {statusBadge(data.status)}
          <div className="text-cream-dim text-xs mt-2">
            Total <span className="text-gold font-jetbrains">{dollars(data.total_cents)}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Customer
          </h2>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between"><dt className="text-cream-dim">Name</dt><dd className="text-cream">{data.full_name}</dd></div>
            <div className="flex justify-between"><dt className="text-cream-dim">Email</dt><dd className="text-cream">{data.email}</dd></div>
            <div className="flex justify-between"><dt className="text-cream-dim">Phone</dt><dd className="text-cream">{data.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-cream-dim">DOB</dt><dd className="text-cream">{data.dob}</dd></div>
          </dl>
        </div>

        {/* Shipping */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Ship to
          </h2>
          <address className="not-italic font-jetbrains text-sm text-cream leading-relaxed">
            {data.full_name}<br />
            {data.ship_street}{data.ship_apt ? `, ${data.ship_apt}` : ''}<br />
            {data.ship_city}, {data.ship_state} {data.ship_zip}
          </address>
        </div>

        {/* Order */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Order
          </h2>
          <div className="text-cream text-sm">
            <div className="font-medium">{data.product || '—'}</div>
            <div className="text-cream-dim text-xs mt-0.5">
              {[data.dose, data.size].filter(Boolean).join(' · ')}
            </div>
          </div>
          <dl className="text-sm mt-4 space-y-1">
            <div className="flex justify-between"><dt className="text-cream-dim">Subtotal</dt><dd className="text-cream font-jetbrains">{dollars(data.subtotal_cents)}</dd></div>
            <div className="flex justify-between"><dt className="text-cream-dim">Shipping</dt><dd className="text-cream font-jetbrains">{dollars(data.shipping_cents)}</dd></div>
            <div className="flex justify-between pt-2 mt-2 border-t border-cream-dim/15">
              <dt className="text-cream font-jetbrains text-[0.65rem] tracking-widest uppercase">Total</dt>
              <dd className="text-gold font-jetbrains">{dollars(data.total_cents)}</dd>
            </div>
          </dl>
        </div>

        {/* Consents */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Consents
          </h2>
          <ul className="text-sm space-y-1.5">
            {[
              ['Compounding pharmacy disclaimer', 'compounding'],
              ['Telehealth consent', 'telehealth'],
              ['HIPAA acknowledgment', 'hipaa'],
              ['Terms of Service', 'terms'],
            ].map(([label, key]) => (
              <li key={key} className="flex justify-between">
                <span className="text-cream-dim">{label}</span>
                <span className={consents[key] ? 'text-emerald' : 'text-rose-300'}>
                  {consents[key] ? '✓ accepted' : '✗ NOT accepted'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Screening */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5 lg:col-span-2">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Health screening
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-3 text-sm">
            <div><div className="text-cream-dim text-xs">Biological sex</div><div className="text-cream font-medium uppercase">{sex}</div></div>
            <div><div className="text-cream-dim text-xs">Height</div><div className="text-cream font-medium">{height}</div></div>
            <div><div className="text-cream-dim text-xs">Weight</div><div className="text-cream font-medium">{weight}</div></div>
          </div>
          <div className="border-t border-cream-dim/10 pt-2">
            {ynRow('Q1 — Cancer?', screening.cancer as { answer?: string; describe?: string })}
            {ynRow('Q2 — Thyroid?', screening.thyroid as { answer?: string; describe?: string })}
            {ynRow('Q3 — Medications?', screening.medications as { answer?: string; describe?: string })}
            {ynRow('Q4 — First time peptides?', screening.first_time_peptides as { answer?: string })}
            {ynRow('Q5 — Allergies?', screening.allergies as { answer?: string; describe?: string })}
          </div>
        </div>

        {/* Payment */}
        <div className="border border-cream-dim/15 bg-obsidian-mid/30 p-5 lg:col-span-2">
          <h2 className="font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald mb-3">
            Payment
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <div className="text-cream-dim text-xs">Brand</div>
              <div className="text-cream font-medium">{data.card_brand || '—'}</div>
            </div>
            <div>
              <div className="text-cream-dim text-xs">Last 4</div>
              <div className="text-cream font-jetbrains tracking-wider">
                {data.card_last4 ? `•••• ${data.card_last4}` : '—'}
              </div>
            </div>
            <div>
              <div className="text-cream-dim text-xs">Expires</div>
              <div className="text-cream font-jetbrains">{exp}</div>
            </div>
          </div>

          <OrderActions
            orderRef={data.ref}
            status={data.status}
            cardPurged={cardPurged}
            purgedAt={data.card_purged_at}
            fulfilledAt={data.fulfilled_at}
          />

          {log.length > 0 && (
            <div className="mt-6 pt-4 border-t border-cream-dim/10">
              <h3 className="font-jetbrains text-[0.55rem] tracking-widest uppercase text-cream-dim mb-2">
                Reveal history
              </h3>
              <ul className="text-xs text-cream-dim space-y-1">
                {log.map((row) => (
                  <li key={row.id}>
                    <span className="text-cream">{row.accessed_by_email}</span>
                    {' · '}
                    {fmtDate(row.accessed_at)}
                    {row.ip ? ` · ${row.ip}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
