'use client'

import { useCart } from '@/context/CartContext'
import { useEffect } from 'react'

export default function ClearCart() {
  const { clearCart } = useCart()
  useEffect(() => { clearCart() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
