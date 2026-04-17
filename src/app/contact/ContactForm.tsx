'use client';

import { useState } from 'react';
import { subscribeToKlaviyo, trackContactSubmission } from '@/lib/klaviyo';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const [subOk, eventOk] = await Promise.all([
        subscribeToKlaviyo(email, `Contact - ${topic}`),
        trackContactSubmission({ email, name, phone, topic, message }),
      ]);
      if (!subOk && !eventOk) {
        setError(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-glass h-fit">
        <p className="mono">Received</p>
        <h3 className="font-cormorant text-2xl text-gold mt-2">Thank you.</h3>
        <p className="text-cream-dim mt-3">
          We'll respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-glass space-y-5 h-fit">
      <label className="block">
        <span className="mono block mb-2">Topic</span>
        <select
          required
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        >
          <option value="" disabled>Select a topic</option>
          <option value="Product Questions">Product Questions</option>
          <option value="Wholesale & Bulk">Wholesale &amp; Bulk</option>
          <option value="General / Media">General / Media</option>
        </select>
      </label>
      <label className="block">
        <span className="mono block mb-2">Name</span>
        <input
          required
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">Email</span>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">Phone</span>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      <label className="block">
        <span className="mono block mb-2">How can we help?</span>
        <textarea
          required
          rows={5}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
        />
      </label>
      {error && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
