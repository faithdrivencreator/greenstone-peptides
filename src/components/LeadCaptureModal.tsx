'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gr_lead_modal_shown_v1';

export function LeadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    // Show once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      sessionStorage.setItem(STORAGE_KEY, '1');
      setOpen(true);
    };

    // 8-second time trigger
    const timer = window.setTimeout(show, 8000);

    // Exit-intent trigger (mouseleave from top)
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/leads endpoint (Phase 2)
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] grid place-items-center bg-obsidian/85 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="card-glass w-full max-w-md relative">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 p-2 text-cream-dim hover:text-gold"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <p className="mono">Free Download</p>
            <h3 className="font-cormorant text-3xl text-white mt-2">
              The Peptide Dosing Guide
            </h3>
            <p className="text-sm text-cream-dim mt-3 mb-6">
              A clinician-reviewed reference covering the most common peptides, dosing
              protocols, and safety considerations.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mono block mb-2">Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
                />
              </label>
              <label className="block">
                <span className="mono block mb-2">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
                />
              </label>
              <button type="submit" className="btn btn-primary w-full">
                Send Me the Guide
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="mono">Thank you</p>
            <h3 className="font-cormorant text-3xl text-gold mt-2">Check your inbox</h3>
            <p className="text-sm text-cream-dim mt-3">
              Your Peptide Dosing Guide is on the way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
