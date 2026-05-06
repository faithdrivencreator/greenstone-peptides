'use client'

import { useCart, type CartItem } from '@/context/CartContext'
import { trackPurchase } from '@/lib/gtag'
import { useEffect } from 'react'

const FIRED_KEY = 'grx-purchase-fired'

export default function ClearCart() {
  const { items, clearCart } = useCart()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (!sessionId) {
      clearCart()
      return
    }

    // Idempotency — Stripe success page can be reloaded; only fire once per session_id
    const alreadyFired = sessionStorage.getItem(FIRED_KEY) === sessionId
    if (alreadyFired) {
      clearCart()
      return
    }

    // Read directly from localStorage in case CartProvider hasn't hydrated yet
    let purchaseItems: CartItem[] = items
    if (!purchaseItems.length) {
      try {
        const stored = localStorage.getItem('grx-cart')
        if (stored) purchaseItems = JSON.parse(stored)
      } catch {}
    }

    if (purchaseItems.length) {
      const value = purchaseItems.reduce((sum, i) => sum + i.price * i.qty, 0)
      trackPurchase({
        transactionId: sessionId,
        value,
        items: purchaseItems.map((i) => ({
          item_id: i.productId,
          item_name: i.name,
          price: i.price,
          quantity: i.qty,
          item_variant: [i.strength, i.size, i.format].filter(Boolean).join(' · ') || undefined,
        })),
      })
      sessionStorage.setItem(FIRED_KEY, sessionId)
    }

    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
