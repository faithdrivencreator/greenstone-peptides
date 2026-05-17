'use client'

import { useState } from 'react'
import { Product } from '@/types'
import RequestPrescriptionModal from './RequestPrescriptionModal'

// Kept under the AddToCartButton filename so existing imports don't break.
// While Stripe is paused for peptide compliance review, this triggers a
// pharmacist-reviewed prescription request flow instead of a cart checkout.
export default function AddToCartButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold/90 transition-colors"
      >
        Request Prescription
      </button>
      <RequestPrescriptionModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
