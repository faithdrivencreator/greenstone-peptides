'use client'

// Filename kept so existing imports (PDP at src/app/shop/[slug]/page.tsx)
// keep working. Visually this is the big primary CTA on a product detail
// page — it now opens the Greenstone Rx Pharmacy storefront (Bloom Health)
// in a new tab where the customer goes through phone verification, intake,
// prescriber review, and pays the pharmacy directly.

import type { Product } from '@/types'
import { PharmacyButton } from '@/components/PharmacyButton'

export default function AddToCartButton({ product: _product }: { product: Product }) {
  return (
    <div className="w-full">
      <PharmacyButton
        label="Order at Pharmacy"
        variant="primary"
        className="w-full justify-center !py-4 !text-base"
        showArrow
        showIcon
        trackId="pdp-primary"
      />
      <p className="mt-3 text-[0.7rem] leading-relaxed text-cream-dim/70 text-center font-jetbrains tracking-wide">
        Orders are fulfilled by Greenstone Rx — a licensed USA compounding pharmacy.
        Your prescribing physician reviews your health screening before any medication ships.
      </p>
    </div>
  )
}
