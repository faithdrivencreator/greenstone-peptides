import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns | GS Wellness Pharmacy',
  description:
    '$10 flat shipping on all US orders. Compounded to order in 5-7 business days, then shipped Priority Mail in 3-5 business days. Temperature-controlled packaging.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Customer Information</p>
          <h1>Shipping &amp; Returns</h1>
        </header>

        <div className="card-glass border-gold/30 bg-obsidian-light/60">
          <h2 className="font-cormorant text-3xl text-white mb-4">$10 flat shipping. Compounded to order.</h2>
          <p className="text-cream-dim leading-relaxed mb-3">
            Every Greenstone formulation is compounded fresh for your order by our USA pharmacy
            partners under USP 797 sterile standards. That means no warehouse inventory and no
            shelf-aged product, your peptide is synthesized after you check out.
          </p>
          <p className="text-cream-dim leading-relaxed">
            Plan on roughly <strong className="text-cream">two weeks from order to door</strong>: 5–7
            business days for compounding and quality testing, plus 3–5 business days in transit
            via US Priority Mail. Tracking is sent automatically the moment your order ships.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Order timeline</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-cream-dim">
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Compounding:</strong> 5–7 business days. Your formulation is prepared, sterile-filtered, and quality-tested under USP 797 standards by our licensed USA pharmacy partner.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Shipping:</strong> $10 flat-rate US Priority Mail (USPS). Delivery typically 3–5 business days from the date the package leaves our facility.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Total time:</strong> approximately 8–12 business days from checkout to delivery.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Tracking:</strong> you&apos;ll receive a tracking email the moment your order leaves our facility.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Packaging:</strong> temperature-controlled, insulated mailers with cold packs when required by product stability. Discreet outer packaging.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Delivery area:</strong> United States only. We do not ship internationally at this time.</span></li>
          </ul>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Delivery concerns</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-3">
            If your order is delayed more than 5 business days past the expected delivery window
            or you have any concerns about your shipment, reach out and we'll make it right.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed">
            Please contact us within 14 days of the shipping date so we can file a claim with
            the carrier when applicable.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Returns</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-3">
            Because our products are temperature-sensitive and intended for research use, we
            cannot accept returns of opened or unsealed items. Sealed, unopened products may be
            returned within 14 days of delivery for a full refund minus the original shipping
            cost, please contact us before sending anything back so we can authorize the return.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed">
            Defective or incorrectly shipped products are eligible for replacement or full refund
            at no cost to you, regardless of the 14-day window.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Order changes &amp; cancellations</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Need to change a shipping address, cancel an order, or adjust quantities? Contact us
            as soon as possible. Because compounding begins shortly after checkout, changes are
            easiest if you reach out within 24 hours of placing the order, before your formulation
            enters the pharmacy queue.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Contact</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Questions about your order or our shipping policies? Email{' '}
            <a href="mailto:support@gswellnesspharmacy.com" className="text-gold underline hover:text-gold-light">
              support@gswellnesspharmacy.com
            </a>{' '}
            and we'll respond within one business day.
          </p>
        </div>
      </div>
    </section>
  );
}
