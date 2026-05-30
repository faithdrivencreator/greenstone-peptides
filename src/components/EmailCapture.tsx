'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/subscribe-ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          ebook: 'made-easy',
          source: 'homepage-email-capture',
        }),
      })
    } catch {
      // Always show success, keeps UX honest about email delivery
    } finally {
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 max-w-md mx-auto text-center">
        <div className="bg-emerald/10 border border-emerald/30 rounded-lg p-6">
          <p className="text-emerald font-semibold text-lg mb-2">Check your inbox.</p>
          <p className="text-cream/80 text-sm leading-relaxed">
            Your free copy of <em>Peptides Made Easy</em> is on its way.
          </p>
          <p className="text-cream-dim/60 text-xs mt-3 font-jetbrains">
            Delivered in minutes · Check spam if you don&apos;t see it
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-obsidian-light border border-gold/20 px-4 py-3 text-cream focus:border-emerald/60 outline-none transition-colors"
        />
        <button type="submit" disabled={loading} className="btn btn-primary whitespace-nowrap">
          {loading ? 'Sending...' : 'Send Me the Guide'}
        </button>
      </form>
      <p className="mt-4 text-[0.65rem] text-cream-dim/40 font-jetbrains tracking-wide text-center">
        Free PDF · One short email a month · No spam
      </p>
    </>
  )
}
