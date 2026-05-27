'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Minus, Plus, ClipboardList, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { reasonsForCategory } from '@/lib/prescription-reasons';

interface ItemReasonState {
  label: string;
  text: string;
}

export function PrescriptionRequestDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, clearCart } = useCart();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [globalNotes, setGlobalNotes] = useState('');
  const [reasons, setReasons] = useState<Record<string, ItemReasonState>>({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference?: string } | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Reset reason state for items that have been removed
  useEffect(() => {
    setReasons((prev) => {
      const filtered: Record<string, ItemReasonState> = {};
      items.forEach((i) => {
        if (prev[i.productId]) filtered[i.productId] = prev[i.productId];
      });
      return filtered;
    });
  }, [items]);

  // Esc closes, body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function resetForm() {
    setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    setGlobalNotes(''); setReasons({});
    setSubmitting(false); setError(null);
  }

  function handleClose() {
    if (done) { setDone(null); resetForm(); }
    closeCart();
  }

  function handleReasonChange(productId: string, label: string, defaultText: string) {
    setReasons((prev) => ({ ...prev, [productId]: { label, text: defaultText } }));
  }

  function handleReasonTextChange(productId: string, text: string) {
    setReasons((prev) => ({
      ...prev,
      [productId]: { label: prev[productId]?.label || '', text },
    }));
  }

  const allReasonsPicked = useMemo(
    () => items.every((i) => !!reasons[i.productId]?.label),
    [items, reasons],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('First name, last name, and email are required.');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one product before submitting.');
      return;
    }
    if (!allReasonsPicked) {
      setError('Please pick a reason for each product so the pharmacist can review.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        globalNotes,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productSlug: i.slug,
          productStrength: i.strength,
          productSize: i.size,
          productFormat: i.format,
          productCategory: i.category,
          productPrice: i.price,
          quantity: i.qty,
          reasonLabel: reasons[i.productId]?.label || '',
          reasonText: reasons[i.productId]?.text || '',
        })),
      };

      const res = await fetch('/api/prescription-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Unable to submit. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone({ reference: data?.reference });
      clearCart();
      setSubmitting(false);
    } catch {
      setError('A network error occurred. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Prescription request"
        className={`fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-obsidian-mid border-l border-gold/15 flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <div>
            <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald">Prescription Request</p>
            <h2 className="font-cormorant text-2xl text-white mt-0.5">
              {done ? 'Submitted' : 'Your draft request'}
            </h2>
            {!done && totalItems > 0 && (
              <p className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim/60 mt-0.5">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {done ? (
            <div className="text-center py-10">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald/10 border border-emerald/40 grid place-items-center mb-4">
                <Check size={24} className="text-emerald" />
              </div>
              <h3 className="font-cormorant text-2xl text-white mb-2">Request received</h3>
              {done.reference && (
                <p className="font-jetbrains text-xs tracking-widest uppercase text-cream-dim mb-4">
                  Reference #{done.reference}
                </p>
              )}
              <p className="text-sm text-cream-dim leading-relaxed max-w-sm mx-auto mb-6">
                A pharmacist will review your request and reply within 24 hours with confirmation and a secure payment link. Check your inbox for a confirmation email from <span className="text-cream">orders@gswellnesspharmacy.com</span>.
              </p>
              <Link
                href="/shop"
                onClick={handleClose}
                className="btn btn-primary"
              >
                Back to shop
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ClipboardList size={40} className="text-gold/30" />
              <p className="font-cormorant text-xl text-cream-dim">Your request is empty.</p>
              <Link
                href="/shop"
                onClick={handleClose}
                className="font-jetbrains text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
              >
                Browse Catalog →
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              {/* Items */}
              <ul className="divide-y divide-gold/10">
                {items.map((item) => {
                  const reasonOptions = reasonsForCategory(item.category);
                  const reasonState = reasons[item.productId];
                  return (
                    <li key={item.productId} className="py-5 first:pt-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/shop/${item.slug}`}
                            className="font-cormorant text-lg text-white hover:text-gold transition-colors leading-tight block"
                          >
                            {item.name}
                          </Link>
                          {(item.strength || item.size) && (
                            <p className="font-jetbrains text-[0.65rem] tracking-wider uppercase text-cream-dim/60 mt-1">
                              {[item.strength, item.size].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-cream-dim/40 hover:text-error transition-colors flex-shrink-0 mt-0.5"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Qty + price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 flex items-center justify-center border border-gold/20 text-cream-dim hover:text-gold hover:border-gold/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-jetbrains text-sm text-cream border-y border-gold/20 h-7 flex items-center justify-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center border border-gold/20 text-cream-dim hover:text-gold hover:border-gold/50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-cormorant text-lg text-gold">
                          ${(item.price * item.qty).toFixed(0)}
                        </p>
                      </div>

                      {/* Reason picker */}
                      <div className="mt-4 space-y-2">
                        <label className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim block">
                          Reason for use
                        </label>
                        <select
                          required
                          value={reasonState?.label || ''}
                          onChange={(e) => {
                            const opt = reasonOptions.find((o) => o.label === e.target.value);
                            handleReasonChange(item.productId, e.target.value, opt?.text || '');
                          }}
                          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select a reason…</option>
                          {reasonOptions.map((opt) => (
                            <option key={opt.label} value={opt.label}>{opt.label}</option>
                          ))}
                        </select>
                        {reasonState?.label && (
                          <textarea
                            rows={3}
                            value={reasonState.text}
                            onChange={(e) => handleReasonTextChange(item.productId, e.target.value)}
                            placeholder={reasonState.label === 'Other (I will write notes below)' ? 'Tell the pharmacist what you are looking for…' : ''}
                            className="w-full bg-obsidian-light/70 border border-gold/15 focus:border-emerald/50 px-3 py-2 text-xs text-cream-dim outline-none transition-colors resize-none leading-relaxed"
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-gold/10 pt-5 space-y-4">
                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim block mb-1.5">First name <span className="text-error/80">*</span></span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim block mb-1.5">Last name <span className="text-error/80">*</span></span>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim block mb-1.5">Email <span className="text-error/80">*</span></span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim mb-1.5 flex items-center gap-2">
                    Phone
                    <span
                      className="inline-flex items-center px-2 py-[2px] text-[0.55rem] tracking-[0.22em] uppercase rounded-sm border"
                      style={{
                        color: '#9dffb0',
                        borderColor: 'rgba(57,255,20,0.55)',
                        background: 'rgba(57,255,20,0.08)',
                        textShadow: '0 0 6px rgba(57,255,20,0.7)',
                        boxShadow: '0 0 10px rgba(57,255,20,0.25)',
                      }}
                    >
                      Optional
                    </span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="So we can text if there's a question"
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors placeholder:text-cream-dim/40"
                  />
                </label>

                <label className="block">
                  <span className="font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-cream-dim block mb-1.5">
                    Anything else for the pharmacist?{' '}
                    <span
                      className="inline-flex items-center px-2 py-[2px] text-[0.55rem] tracking-[0.22em] uppercase rounded-sm border align-middle ml-1"
                      style={{
                        color: '#9dffb0',
                        borderColor: 'rgba(57,255,20,0.55)',
                        background: 'rgba(57,255,20,0.08)',
                        textShadow: '0 0 6px rgba(57,255,20,0.7)',
                        boxShadow: '0 0 10px rgba(57,255,20,0.25)',
                      }}
                    >
                      Optional
                    </span>
                  </span>
                  <textarea
                    rows={2}
                    value={globalNotes}
                    onChange={(e) => setGlobalNotes(e.target.value)}
                    placeholder="Allergies, prior protocols, timing constraints…"
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/50 px-3 py-2 text-sm text-cream outline-none transition-colors resize-none placeholder:text-cream-dim/40"
                  />
                </label>

                <p className="text-[0.65rem] text-cream-dim/60 leading-relaxed">
                  By submitting, you confirm you are 21+ and understand that any payment link sent in response will need to be completed before compounding begins. Compounded medications are prepared by a licensed 503A pharmacy pursuant to a valid prescription and are not FDA-approved drug products.
                </p>

                {error && (
                  <p className="text-xs text-error font-jetbrains">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting…' : 'Submit Prescription Request'}
                </button>

                <p className="text-[0.65rem] text-cream-dim/50 text-center font-jetbrains leading-relaxed">
                  A pharmacist replies within 24 hours with a secure payment link.
                </p>
                <p className="text-[0.6rem] leading-relaxed text-cream-dim/40 text-center">
                  Compounded by a 503A licensed pharmacy pursuant to a valid prescription. Not an FDA-approved drug. Individual results vary.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
