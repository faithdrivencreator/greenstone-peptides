'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CarrierName } from '@/lib/shipping-email';
import type { PendingOrder } from '@/app/api/admin/pending-orders/route';

const CARRIERS: CarrierName[] = ['USPS', 'UPS', 'FedEx', 'DHL', 'Other'];

export default function AdminShipPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState<CarrierName>('USPS');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const fetchPending = useCallback(async (pw: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/pending-orders', {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (res.status === 401) {
        setStatus({ type: 'error', msg: 'Wrong password.' });
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setAuthed(true);
      setPendingOrders(data.orders ?? []);
      if (data.orders?.length === 1) {
        setSelectedSessionId(data.orders[0].sessionId);
      } else if (!data.orders?.length) {
        setStatus({ type: 'info', msg: 'No pending orders waiting to ship. Nice work.' });
      }
      window.localStorage.setItem('gs-admin-pw', pw);
    } catch (err) {
      setStatus({ type: 'error', msg: String(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-attempt with cached password on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('gs-admin-pw') : null;
    if (stored) {
      setPassword(stored);
      fetchPending(stored);
    }
  }, [fetchPending]);

  const selectedOrder = pendingOrders.find((o) => o.sessionId === selectedSessionId) ?? null;

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    await fetchPending(password);
  }

  async function sendShipping(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/send-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          customerEmail: selectedOrder.customerEmail,
          customerFirstName: selectedOrder.customerFirstName ?? undefined,
          orderRef: selectedOrder.orderRef,
          stripePaymentIntent: selectedOrder.paymentIntent ?? undefined,
          trackingNumber: trackingNumber.trim(),
          carrier,
          expectedDelivery: expectedDelivery.trim() || undefined,
          customNote: customNote.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: 'success',
          msg: `Shipped email sent to ${selectedOrder.customerEmail}. Resend ID: ${data.emailId}`,
        });
        setTrackingNumber('');
        setExpectedDelivery('');
        setCustomNote('');
        // Refresh pending list — this order should no longer appear
        await fetchPending(password);
      } else {
        setStatus({ type: 'error', msg: data.error || 'Send failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  function formatAddress(a: PendingOrder['shippingAddress']): string {
    if (!a) return 'On file with Stripe';
    return [a.line1, a.line2, `${a.city}, ${a.state} ${a.postal_code}`].filter(Boolean).join(', ');
  }

  return (
    <section className="section-py">
      <div className="container-gr max-w-2xl">
        <header className="mb-8">
          <p className="eyebrow">Internal</p>
          <h1>Ship an Order</h1>
          <p className="text-cream-dim mt-3 text-sm leading-relaxed">
            Pick a pending order, drop the tracking number, pick the carrier, hit send. Everything else
            is auto-filled from Stripe — customer email, shipping address, order #.
          </p>
        </header>

        {!authed && (
          <form onSubmit={submitPassword} className="space-y-4 mb-8">
            <div>
              <label className="mono block text-cream-dim mb-2 text-xs">Admin password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream font-jetbrains rounded"
                placeholder="•••••••••••••"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Loading…' : 'Unlock'}
            </button>
          </form>
        )}

        {authed && (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-cormorant text-2xl text-white">
                {pendingOrders.length === 0
                  ? 'No pending orders'
                  : `${pendingOrders.length} pending order${pendingOrders.length === 1 ? '' : 's'}`}
              </h2>
              <button
                type="button"
                onClick={() => fetchPending(password)}
                disabled={loading}
                className="text-gold text-xs uppercase tracking-widest hover:text-gold-light"
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {pendingOrders.length > 1 && (
              <div className="mb-6 space-y-2">
                {pendingOrders.map((o) => (
                  <button
                    type="button"
                    key={o.sessionId}
                    onClick={() => setSelectedSessionId(o.sessionId)}
                    className={`w-full text-left p-4 border rounded transition ${
                      o.sessionId === selectedSessionId
                        ? 'border-gold bg-obsidian-light/60'
                        : 'border-gold/15 bg-obsidian-light/20 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-cormorant text-lg text-cream">
                        {o.customerName ?? o.customerEmail}
                      </span>
                      <span className="font-jetbrains text-gold text-sm">
                        ${o.amountTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="mono text-xs text-cream-dim mt-1">
                      #{o.orderRef} · {o.ageDays}d ago · {formatAddress(o.shippingAddress)}
                    </div>
                    {o.itemsSummary && (
                      <div className="mono text-[10px] text-cream-dim/70 mt-1 truncate">
                        {o.itemsSummary}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedOrder && (
              <form onSubmit={sendShipping} className="space-y-6">
                <div className="card-glass border border-gold/30 p-5">
                  <p className="mono text-xs text-gold mb-2 tracking-widest">SHIPPING THIS ORDER</p>
                  <p className="font-cormorant text-xl text-white">{selectedOrder.customerName}</p>
                  <p className="text-cream-dim text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-cream-dim text-sm mt-2">
                    Order <span className="font-jetbrains text-gold">#{selectedOrder.orderRef}</span>{' '}
                    · <span className="text-emerald">${selectedOrder.amountTotal.toFixed(2)}</span>
                  </p>
                  <p className="text-cream-dim text-sm mt-2 leading-relaxed">
                    To: {formatAddress(selectedOrder.shippingAddress)}
                  </p>
                  {selectedOrder.itemsSummary && (
                    <p className="text-cream-dim text-xs mt-2 font-jetbrains">
                      {selectedOrder.itemsSummary}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="mono block text-cream-dim mb-2 text-xs">Tracking number *</label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream font-jetbrains rounded"
                      placeholder="9400 1111 2222 3333 4444 55"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="mono block text-cream-dim mb-2 text-xs">Carrier *</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value as CarrierName)}
                      className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded"
                    >
                      {CARRIERS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <details className="text-cream-dim text-sm">
                  <summary className="cursor-pointer mono text-xs tracking-widest hover:text-gold">
                    Optional fields ▾
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mono block text-cream-dim mb-2 text-xs">Expected delivery</label>
                      <input
                        type="text"
                        value={expectedDelivery}
                        onChange={(e) => setExpectedDelivery(e.target.value)}
                        className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded"
                        placeholder="Tuesday, May 20 (or '2–4 business days')"
                      />
                    </div>
                    <div>
                      <label className="mono block text-cream-dim mb-2 text-xs">Custom note</label>
                      <textarea
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        rows={2}
                        className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded resize-y"
                        placeholder="Shipped with cold pack — refrigerate immediately on arrival."
                      />
                    </div>
                  </div>
                </details>

                <button
                  type="submit"
                  disabled={submitting || !trackingNumber.trim()}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : `Send Shipping Email to ${selectedOrder.customerFirstName ?? selectedOrder.customerEmail}`}
                </button>
              </form>
            )}

            {!selectedOrder && pendingOrders.length > 0 && (
              <p className="text-cream-dim text-sm">Pick an order above to ship.</p>
            )}
          </>
        )}

        {status && (
          <div
            className={`mt-6 p-4 border rounded ${
              status.type === 'success'
                ? 'border-emerald/40 bg-emerald/10 text-emerald-light'
                : status.type === 'info'
                ? 'border-gold/30 bg-obsidian-light/40 text-cream-dim'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}
          >
            {status.msg}
          </div>
        )}
      </div>
    </section>
  );
}
