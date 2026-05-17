'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

// Filename kept so existing imports don't break. While Stripe is paused for
// peptide compliance review, this adds the product to the prescription-request
// basket (cart context, re-themed) and opens the request drawer.
export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, updateQty, items, openCart } = useCart()
  const [qty, setQty] = useState(1)

  function handleAdd() {
    // addItem increments by 1 if the product is already in the basket; if a
    // higher qty was selected here, top it up to match.
    addItem(product)
    if (qty > 1) {
      const existing = items.find((i) => i.productId === product._id)
      const startingQty = existing ? existing.qty + 1 : 1
      const target = Math.max(startingQty, qty)
      updateQty(product._id, target)
    }
    openCart()
  }

  return (
    <div className="w-full flex items-stretch gap-2">
      <div className="flex items-center border border-gold/25">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-full grid place-items-center text-cream-dim hover:text-gold transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center font-jetbrains text-sm text-cream">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(10, q + 1))}
          className="w-10 h-full grid place-items-center text-cream-dim hover:text-gold transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 py-4 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold/90 transition-colors"
      >
        Add to Prescription Request
      </button>
    </div>
  )
}
