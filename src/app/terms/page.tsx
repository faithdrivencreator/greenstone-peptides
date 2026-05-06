// LEGAL NOTICE: This is a placeholder Terms of Service for launch purposes.
// Pete should have a licensed attorney review and approve this document
// before relying on it for legal protection. — FFS Lab, April 2026

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Greenstone Peptides',
  description:
    'Terms of Service for Greenstone Peptides (DBA Greenstone Wellness). Products are for research and educational purposes only. Not for human consumption.',
  alternates: {
    canonical: 'https://greenstonewellness.store/terms',
  },
};

export default function TermsPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Legal</p>
          <h1>Terms of Service</h1>
          <p className="text-cream-dim text-sm mt-4">
            Effective Date: April 2026 &nbsp;|&nbsp; Last Updated: April 2026
          </p>
        </header>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">1. Agreement to Terms</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of the website
            located at <strong className="text-cream">greenstonewellness.store</strong> (the
            "Site") and any purchases made through the Site. The Site is operated by{' '}
            <strong className="text-cream">Greenstone Peptides, LLC</strong>, doing business
            as <strong className="text-cream">Greenstone Wellness</strong> ("Company," "we,"
            "us," or "our").
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            By accessing or using the Site, placing an order, or creating an account, you
            agree to be bound by these Terms. If you do not agree, do not use the Site.
          </p>
        </div>

        <div className="card-glass border-red-500/30">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            2. Research Use Only — Critical Notice
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            <strong className="text-cream">ALL PRODUCTS SOLD ON THIS SITE ARE STRICTLY
            FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY.</strong> They are not intended for
            human or animal consumption, diagnostic use, or therapeutic application of any kind.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            The introduction of any product sold on this Site into the human or animal body —
            by any route including injection, ingestion, inhalation, or topical application —
            is <strong className="text-cream">strictly prohibited</strong> and constitutes a
            misuse of the product. By placing an order, you represent and warrant that you
            will use all products solely for lawful research and educational purposes.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            These products have not been approved by the U.S. Food and Drug Administration
            (FDA). They are not intended to diagnose, treat, cure, or prevent any disease or
            medical condition.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">3. Eligibility</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            You must be at least <strong className="text-cream">18 years of age</strong> to
            purchase from or use this Site. By using the Site, you represent and warrant that
            you are 18 years of age or older. We reserve the right to refuse service to
            anyone who cannot confirm their age or who we believe is a minor.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Purchases are available to residents of the{' '}
            <strong className="text-cream">United States only</strong>. We do not currently
            ship internationally. You are responsible for ensuring that the purchase and use
            of these products is legal in your jurisdiction.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">4. Products & Descriptions</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We make reasonable efforts to display product information accurately, including
            descriptions, formulations, and concentrations. However, we do not warrant that
            product descriptions or other content on the Site are accurate, complete, reliable,
            current, or error-free.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            All products are compounded by licensed USA-based pharmacy partners under USP 797
            sterile compounding standards. Certificates of Analysis are available upon request.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            5. Orders, Payment & Pricing
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            By placing an order, you offer to purchase a product at the stated price. We
            reserve the right to refuse or cancel any order for any reason, including errors
            in pricing or product information.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Payment is processed securely through{' '}
            <strong className="text-cream">Stripe, Inc.</strong> We accept major credit and
            debit cards. All prices are listed in U.S. dollars. We do not store your payment
            card information — Stripe handles all payment data in accordance with PCI-DSS
            standards.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Prices are subject to change without notice. Applicable sales tax may be added at
            checkout depending on your shipping address.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">6. Shipping</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We ship to addresses within the <strong className="text-cream">United States only</strong>.
            All orders are shipped with temperature-controlled packaging to maintain product
            integrity during transit. Estimated delivery times are provided at checkout and are
            not guaranteed.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Risk of loss and title for products purchased pass to you upon delivery to the
            carrier. If your order arrives damaged or the cold pack is fully thawed, contact
            us within 48 hours at{' '}
            <a
              href="mailto:info@greenstonewellness.store"
              className="text-emerald hover:underline"
            >
              info@greenstonewellness.store
            </a>.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            7. Returns & Refund Policy
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Due to the nature of our products — temperature-sensitive, compounded peptide
            formulations — all sales are final on opened items.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            We accept returns of <strong className="text-cream">unopened, undamaged items</strong>{' '}
            within <strong className="text-cream">30 days</strong> of the delivery date,
            provided the product has remained properly stored (refrigerated, out of direct
            light). To initiate a return, contact us at{' '}
            <a
              href="mailto:info@greenstonewellness.store"
              className="text-emerald hover:underline"
            >
              info@greenstonewellness.store
            </a>{' '}
            with your order number. Return shipping costs are the responsibility of the buyer
            unless the return is due to our error.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Refunds will be processed to the original payment method within 5–10 business
            days of receiving and inspecting the returned item.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            8. Disclaimer of Warranties
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            THE SITE AND ALL PRODUCTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, OR NON-INFRINGEMENT.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            We do not warrant that the Site will be uninterrupted or error-free. We make no
            warranty regarding the results that may be obtained from the use of our products
            for research purposes.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GREENSTONE
            PEPTIDES, LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR PHARMACY PARTNERS
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES — INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL — ARISING OUT OF OR IN
            CONNECTION WITH YOUR USE OF THE SITE OR ANY PRODUCTS PURCHASED THROUGH IT.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE
            TERMS OR YOUR USE OF THE SITE SHALL NOT EXCEED THE TOTAL AMOUNT YOU PAID TO US
            IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            You expressly acknowledge that any misuse of our products — including introduction
            into the human or animal body — is at your sole risk, and we disclaim all
            liability arising from such misuse.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">10. Indemnification</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            You agree to defend, indemnify, and hold harmless Greenstone Peptides, LLC and
            its affiliates, officers, directors, employees, and agents from and against any
            claims, liabilities, damages, losses, and expenses — including reasonable
            attorneys' fees — arising out of or in any way connected with your access to or
            use of the Site, your violation of these Terms, or your misuse of any product
            purchased through the Site.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            11. Intellectual Property
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            All content on this Site — including text, graphics, logos, product descriptions,
            images, and software — is the property of Greenstone Peptides, LLC or its content
            suppliers and is protected by applicable intellectual property laws. Unauthorized
            reproduction, distribution, or use of any content is prohibited.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            12. Governing Law & Dispute Resolution
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the{' '}
            <strong className="text-cream">State of Florida</strong>, without regard to its
            conflict of law provisions.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Any dispute arising out of or relating to these Terms or your use of the Site
            shall be resolved exclusively in the state or federal courts located in{' '}
            <strong className="text-cream">Miami-Dade County, Florida</strong>. You consent
            to personal jurisdiction in those courts.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">13. Changes to Terms</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes are effective
            immediately upon posting to the Site. Your continued use of the Site following
            the posting of revised Terms means you accept and agree to the changes. We
            encourage you to review these Terms periodically.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">14. Contact Information</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Questions about these Terms of Service may be directed to:
          </p>
          <div className="mt-4 text-sm text-cream-dim space-y-1">
            <p>
              <strong className="text-cream">Greenstone Peptides, LLC</strong> (DBA Greenstone
              Wellness)
            </p>
            <p>Miami, Florida</p>
            <p>
              Email:{' '}
              <a
                href="mailto:info@greenstonewellness.store"
                className="text-emerald hover:underline"
              >
                info@greenstonewellness.store
              </a>
            </p>
            <p>Website: greenstonewellness.store</p>
          </div>
        </div>
      </div>
    </section>
  );
}
