'use client';

import { useState } from 'react';
export function WholesaleForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch('/api/wholesale-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('first-name'),
          lastName: data.get('last-name'),
          businessName: data.get('business-name'),
          email: data.get('business-email'),
          state: data.get('state'),
          monthlyVolume: data.get('monthly-volume'),
          notes: data.get('notes'),
        }),
      });
    } catch {}

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card-glass border-emerald/20 text-center py-12 space-y-4">
        <div className="w-14 h-14 border border-emerald/30 flex items-center justify-center mx-auto"
          style={{ background: 'rgba(26,158,110,0.1)' }}>
          <span className="text-emerald text-2xl font-cormorant font-semibold">✓</span>
        </div>
        <h3 className="font-cormorant text-3xl text-white">Inquiry Received</h3>
        <p className="text-cream-dim text-sm max-w-md mx-auto">
          Thank you for your interest. Our wholesale team will review your application
          and respond within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 card-glass border-emerald/20">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="mono block mb-2">First Name</label>
          <input
            id="first-name"
            name="first-name"
            type="text"
            required
            className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
            placeholder="Dr. Jane"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="mono block mb-2">Last Name</label>
          <input
            id="last-name"
            name="last-name"
            type="text"
            required
            className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
            placeholder="Smith"
          />
        </div>
      </div>
      <div>
        <label htmlFor="business-name" className="mono block mb-2">Business / Practice Name</label>
        <input
          id="business-name"
          name="business-name"
          type="text"
          required
          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
          placeholder="Advanced Wellness Clinic"
        />
      </div>
      <div>
        <label htmlFor="business-email" className="mono block mb-2">Business Email</label>
        <input
          id="business-email"
          name="business-email"
          type="email"
          required
          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
          placeholder="orders@yourclinic.com"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="state" className="mono block mb-2">State</label>
          <input
            id="state"
            name="state"
            type="text"
            className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
            placeholder="Florida"
          />
        </div>
        <div>
          <label htmlFor="monthly-volume" className="mono block mb-2">Estimated Monthly Volume</label>
          <select id="monthly-volume" name="monthly-volume" className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors appearance-none">
            <option value="">Select range</option>
            <option>Under $5,000 / mo</option>
            <option>$5,000 – $15,000 / mo</option>
            <option>$15,000 – $50,000 / mo</option>
            <option>Over $50,000 / mo</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="mono block mb-2">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors resize-none"
          placeholder="Tell us about your practice and what you're looking for..."
        />
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Wholesale Inquiry'}
      </button>
      <p className="text-xs text-cream-dim/50 text-center font-jetbrains">
        Wholesale access is subject to review and approval.
      </p>
    </form>
  );
}
