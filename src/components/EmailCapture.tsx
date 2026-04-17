'use client'

import { useState } from 'react'
import { subscribeToKlaviyo } from '@/lib/klaviyo'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await subscribeToKlaviyo(email, 'Homepage Email Capture')
    } finally {
      // Always show success — even for already-subscribed addresses
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 max-w-md mx-auto text-center">
        <div className="bg-emerald/10 border border-emerald/30 rounded-lg p-6">
          <p className="text-emerald font-semibold text-lg mb-2">You&apos;re in!</p>
          <p className="text-cream/80 text-sm mb-3">Your discount code:</p>
          <p className="font-jetbrains text-2xl text-gold tracking-wider">CLINICAL30</p>
          <p className="text-cream-dim/60 text-xs mt-3">
            $30 off your first order · Valid 14 days · One use per customer
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
          {loading ? 'Joining...' : 'Claim $30 Off'}
        </button>
      </form>
      <p className="mt-4 text-[0.65rem] text-cream-dim/40 font-jetbrains tracking-wide text-center">
        Code delivered instantly · Valid 14 days · One use per customer · No spam
      </p>
    </>
  )
}
