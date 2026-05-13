import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Greenstone Peptides',
  description:
    'Free Priority shipping on all US orders. Temperature-controlled packaging. Tracking provided. Returns and refund policy for Greenstone Peptides.',
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
          <h2 className="font-cormorant text-3xl text-white mb-4">Free shipping on every order.</h2>
          <p className="text-cream-dim leading-relaxed">
            We ship every order free via US Priority Mail. No minimums, no thresholds, no
            calculator at checkout. The price you see on the product page is the price you pay.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">How orders ship</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-cream-dim">
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Processing time:</strong> orders placed Monday–Friday before 2pm ET ship the same business day. Orders placed after 2pm or on weekends ship the next business day.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Carrier:</strong> US Priority Mail (USPS). Most US orders arrive in 2–4 business days.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Tracking:</strong> you'll receive a tracking email the moment your order leaves our facility.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Packaging:</strong> temperature-controlled, insulated mailers with cold packs when required by product stability. Discreet outer packaging.</span></li>
            <li className="flex gap-3"><span className="text-gold">•</span><span><strong className="text-cream">Delivery area:</strong> United States only. We do not ship internationally at this time.</span></li>
          </ul>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Lost, damaged, or delayed orders</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-3">
            If your order is delayed more than 5 business days past the expected delivery window,
            arrives damaged, or doesn't arrive at all, contact us and we'll make it right —
            either replace the order at no charge or issue a full refund.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed">
            Please reach out within 14 days of the shipping date so we can file a claim with the
            carrier when applicable.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Returns</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-3">
            Because our products are temperature-sensitive and intended for research use, we
            cannot accept returns of opened or unsealed items. Sealed, unopened products may be
            returned within 14 days of delivery for a full refund minus the original shipping
            cost — please contact us before sending anything back so we can authorize the return.
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
            within 1 hour of placing the order — most orders ship within hours, so the sooner you
            reach out the better.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Contact</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Questions about your order or our shipping policies? Email{' '}
            <a href="mailto:support@greenstonewellness.store" className="text-gold underline hover:text-gold-light">
              support@greenstonewellness.store
            </a>{' '}
            and we'll respond within one business day.
          </p>
        </div>
      </div>
    </section>
  );
}
