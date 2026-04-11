'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="card-glass h-fit">
        <p className="mono">Received</p>
        <h3 className="font-cormorant text-2xl text-gold mt-2">Thank you.</h3>
        <p className="text-cream-dim mt-3">
          A member of our team will reach out within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up /api/contact endpoint (Phase 2)
        setSubmitted(true);
      }}
      className="card-glass space-y-5 h-fit"
    >
      <label className="block">
        <span className="mono block mb-2">Name</span>
        <input
          required
          type="text"
          name="name"
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">Email</span>
        <input
          required
          type="email"
          name="email"
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">Phone</span>
        <input
          type="tel"
          name="phone"
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">How can we help?</span>
        <textarea
          required
          rows={5}
          name="message"
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <button type="submit" className="btn btn-primary w-full">
        Send Message
      </button>
    </form>
  );
}
