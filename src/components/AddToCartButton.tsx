'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full py-4 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold/90 transition-colors"
    >
      {added ? 'Added to Cart ✓' : 'Add to Cart'}
    </button>
  )
}
