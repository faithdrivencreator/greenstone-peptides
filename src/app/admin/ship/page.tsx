'use client';

import { useState, useEffect } from 'react';
import type { CarrierName } from '@/lib/shipping-email';

const CARRIERS: CarrierName[] = ['USPS', 'UPS', 'FedEx', 'DHL', 'Other'];

export default function AdminShipPage() {
  const [password, setPassword] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [stripePaymentIntent, setStripePaymentIntent] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState<CarrierName>('USPS');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Cache password in localStorage so Pete doesn't retype every session
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('gs-admin-pw') : null;
    if (stored) setPassword(stored);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/send-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          customerEmail: customerEmail.trim(),
          customerFirstName: customerFirstName.trim() || undefined,
          orderRef: orderRef.trim(),
          trackingNumber: trackingNumber.trim(),
          carrier,
          expectedDelivery: expectedDelivery.trim() || undefined,
          customNote: customNote.trim() || undefined,
          stripePaymentIntent: stripePaymentIntent.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        window.localStorage.setItem('gs-admin-pw', password);
        setStatus({ type: 'success', msg: `Shipped email sent to ${customerEmail}. Resend ID: ${data.emailId}` });
        // Clear order-specific fields, keep password
        setCustomerEmail('');
        setCustomerFirstName('');
        setOrderRef('');
        setStripePaymentIntent('');
        setTrackingNumber('');
        setExpectedDelivery('');
        setCustomNote('');
      } else {
        setStatus({ type: 'error', msg: data.error || 'Send failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section-py">
      <div className="container-gr max-w-2xl">
        <header className="mb-8">
          <p className="eyebrow">Internal</p>
          <h1>Send Shipping Notification</h1>
          <p className="text-cream-dim mt-3 text-sm leading-relaxed">
            Pete-only. Enter the customer&apos;s tracking info, hit send, customer gets the
            branded shipping email from <code className="font-jetbrains text-gold">orders@greenstonewellness.store</code>.
            Tracking link is auto-generated from the carrier.
          </p>
        </header>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mono block text-cream-dim mb-2 text-xs">Admin password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream font-jetbrains rounded"
              placeholder="•••••••••••••"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="mono block text-cream-dim mb-2 text-xs">Customer email *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="mono block text-cream-dim mb-2 text-xs">First name (optional)</label>
              <input
                type="text"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded"
                placeholder="Azam"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="mono block text-cream-dim mb-2 text-xs">Order # *</label>
              <input
                type="text"
                required
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream font-jetbrains rounded"
                placeholder="BASEQZ2G"
              />
              <p className="text-cream-dim text-xs mt-1">
                Last 8 chars of Stripe session ID. Find on the order confirmation email subject line.
              </p>
            </div>
            <div>
              <label className="mono block text-cream-dim mb-2 text-xs">Stripe payment_intent (optional)</label>
              <input
                type="text"
                value={stripePaymentIntent}
                onChange={(e) => setStripePaymentIntent(e.target.value)}
                className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream font-jetbrains rounded"
                placeholder="pi_xxx"
              />
              <p className="text-cream-dim text-xs mt-1">
                Sets shipped_at, tracking, carrier metadata on the Stripe PaymentIntent.
              </p>
            </div>
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

          <div>
            <label className="mono block text-cream-dim mb-2 text-xs">Expected delivery (optional)</label>
            <input
              type="text"
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
              className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded"
              placeholder="Tuesday, May 20 (or '2–4 business days')"
            />
          </div>

          <div>
            <label className="mono block text-cream-dim mb-2 text-xs">Custom note (optional)</label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={3}
              className="w-full bg-obsidian-light/40 border border-gold/15 px-4 py-3 text-cream rounded resize-y"
              placeholder="Note appearing in the email card. E.g., 'Shipped with cold pack — refrigerate on arrival.'"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Send Shipping Email'}
            </button>
          </div>

          {status && (
            <div
              className={`p-4 border rounded ${
                status.type === 'success'
                  ? 'border-emerald/40 bg-emerald/10 text-emerald-light'
                  : 'border-red-500/40 bg-red-500/10 text-red-200'
              }`}
            >
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
