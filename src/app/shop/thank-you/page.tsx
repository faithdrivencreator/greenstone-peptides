import Link from 'next/link'

export const metadata = {
  title: 'Request Received | Greenstone Wellness',
  description: 'Your prescription request has been received.',
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-obsidian text-cream pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-cormorant text-4xl md:text-5xl font-light mb-4">
          Request Received
        </h1>

        <p className="text-cream/70 text-lg mb-8 leading-relaxed">
          Thank you for submitting your prescription request. Our clinical team will review your information and follow up by email. Plan on roughly <span className="text-cream">two weeks total</span> from approval to your door.
        </p>

        <div className="bg-white/5 border border-gold/10 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-cormorant text-xl text-gold mb-4">What Happens Next</h2>
          <ol className="space-y-3 text-cream/70">
            <li className="flex gap-3">
              <span className="text-gold font-mono text-sm mt-0.5">01</span>
              <span><strong className="text-cream">Clinical Review:</strong> A licensed clinician reviews your health screening and issues a prescription if appropriate.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-mono text-sm mt-0.5">02</span>
              <span><strong className="text-cream">Compounding (Days 1–7):</strong> Your formulation is compounded and quality-tested under USP 797 standards (5–7 business days).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-mono text-sm mt-0.5">03</span>
              <span><strong className="text-cream">Shipping (Days 7–12):</strong> Shipped via USPS Priority Mail with tracking (3–5 business days in transit).</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="px-8 py-3 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold/90 transition-colors">
            Browse Formulary
          </Link>
          <Link href="/contact" className="px-8 py-3 border border-cream/20 text-cream rounded-lg hover:bg-white/5 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  )
}
