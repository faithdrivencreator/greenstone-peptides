'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Product } from '@/types';

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function RequestPrescriptionModal({ product, open, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference?: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  function reset() {
    setName(''); setEmail(''); setPhone(''); setQuantity(1); setNotes('');
    setSubmitting(false); setError(null); setDone(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/prescription-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          productName: product.name,
          productSlug: product.slug?.current,
          productStrength: product.strength,
          productSize: product.size,
          productFormat: product.format,
          productPrice: product.price,
          quantity,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Unable to submit. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone({ reference: data?.reference });
      setSubmitting(false);
    } catch {
      setError('A network error occurred. Please try again.');
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-obsidian/85 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request prescription"
        className="fixed inset-0 z-[90] grid place-items-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-lg bg-obsidian-mid border border-gold/20 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gold/10">
            <div>
              <p className="mono !text-cream-dim">Prescription request</p>
              <h3 className="font-cormorant text-2xl text-white leading-tight mt-1">
                {product.name}
              </h3>
              {(product.strength || product.size) && (
                <p className="mono !text-cream-dim/70 mt-1">
                  {[product.strength, product.size].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-cream-dim hover:text-gold transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {done ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald/10 border border-emerald/40 grid place-items-center mb-4">
                <Check size={24} className="text-emerald" />
              </div>
              <h4 className="font-cormorant text-2xl text-white mb-2">Request received</h4>
              {done.reference && (
                <p className="mono !text-cream-dim mb-4">Reference #{done.reference}</p>
              )}
              <p className="text-cream-dim text-sm leading-relaxed max-w-sm mx-auto mb-6">
                A pharmacist will review your request and reply within 24 hours with confirmation and a secure payment link. Check your inbox for a confirmation email.
              </p>
              <button onClick={handleClose} className="btn btn-primary">Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 py-6 space-y-4">
              <p className="text-sm text-cream-dim leading-relaxed">
                Submit a prescription request and our pharmacy team will review it and reply within <strong className="text-cream">24 hours</strong> with a secure payment link to complete your order.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mono !text-cream-dim mb-1.5 block">Full name *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="mono !text-cream-dim mb-1.5 block">Email *</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mono !text-cream-dim mb-1.5 block">Phone (optional)</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="mono !text-cream-dim mb-1.5 block">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mono !text-cream-dim mb-1.5 block">Notes for the pharmacist (optional)</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Goals, prior experience, dosing preferences..."
                  className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors resize-none"
                />
              </label>

              <p className="text-[0.65rem] text-cream-dim/60 leading-relaxed">
                By submitting, you confirm you are 18+ and understand that any payment link sent in response will require completion before compounding begins. Research peptides are for laboratory and research use.
              </p>

              {error && (
                <p className="text-xs text-error font-jetbrains">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Prescription Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
