// LEGAL NOTICE: This is a placeholder Privacy Policy for launch purposes.
// Pete should have a licensed attorney review and approve this document
// before relying on it for legal protection. — FFS Lab, April 2026

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Greenstone Peptides',
  description:
    'Privacy Policy for Greenstone Peptides (DBA Greenstone Wellness). Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://greenstonewellness.store/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="text-cream-dim text-sm mt-4">
            Last Updated: April 2026
          </p>
        </header>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">1. Overview</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Greenstone Peptides, LLC (doing business as{' '}
            <strong className="text-cream">Greenstone Wellness</strong>, "we," "us," or
            "our") operates the website at{' '}
            <strong className="text-cream">greenstonewellness.store</strong>. This Privacy
            Policy explains how we collect, use, disclose, and protect your personal
            information when you visit or make a purchase from our Site.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            By using the Site, you agree to the collection and use of information in
            accordance with this Policy. If you do not agree with this Policy, please do
            not use our Site.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            2. Information We Collect
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We collect information you provide directly to us when you place an order,
            create an account, or contact us:
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Identity information:</strong> First name,
                last name
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Contact information:</strong> Email address,
                phone number (if provided)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Shipping information:</strong> Shipping
                address (street, city, state, ZIP, country)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Payment information:</strong> Processed
                securely by Stripe — we do not store your credit card number, CVV, or
                full payment card details on our servers
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Order history:</strong> Products purchased,
                order dates, amounts
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Communications:</strong> Messages you send
                us via email or contact forms
              </span>
            </li>
          </ul>

          <p className="text-cream-dim text-sm leading-relaxed mt-6">
            We also collect certain information automatically when you visit the Site:
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Usage data:</strong> Pages visited, time
                spent, referring URLs, browser type, device type, IP address
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Cookies and local storage:</strong> Used
                for age verification (stored in localStorage), shopping cart state, and
                analytics (see Section 5)
              </span>
            </li>
          </ul>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Process and fulfill your orders, including payment and shipping</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Send order confirmations, shipping updates, and customer support communications</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Send marketing emails and product updates (only with your consent — you can unsubscribe at any time)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Enforce age verification (18+) requirements</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Improve and optimize the Site through analytics</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Comply with legal obligations and enforce our Terms of Service</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>Detect and prevent fraud</span>
            </li>
          </ul>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            4. Payment Processing — Stripe
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            All payment processing is handled by{' '}
            <strong className="text-cream">Stripe, Inc.</strong>, a PCI-DSS compliant
            payment processor. When you enter your payment information at checkout, it
            is transmitted directly and securely to Stripe. We{' '}
            <strong className="text-cream">do not store</strong> your credit card number,
            CVV, or full card details on our servers at any time.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Stripe may collect and retain your payment information in accordance with
            their own Privacy Policy, available at{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline"
            >
              stripe.com/privacy
            </a>.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            5. Email Marketing — Klaviyo
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We use <strong className="text-cream">Klaviyo</strong> to send marketing
            emails, product announcements, and promotional communications. If you opt in
            to receive marketing emails (for example, by subscribing at checkout or
            through a sign-up form), your name and email address will be shared with
            Klaviyo for this purpose.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            You can <strong className="text-cream">unsubscribe at any time</strong> by
            clicking the "Unsubscribe" link in any marketing email we send. Opting out
            of marketing emails will not affect transactional communications such as
            order confirmations and shipping updates.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Klaviyo's privacy practices are governed by their Privacy Policy at{' '}
            <a
              href="https://www.klaviyo.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:underline"
            >
              klaviyo.com/legal/privacy-policy
            </a>.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">6. Cookies & Local Storage</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We use cookies and browser local storage for the following purposes:
          </p>
          <ul className="mt-4 space-y-3 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <div>
                <strong className="text-cream">Age Verification (localStorage):</strong>{' '}
                We store a record of age gate confirmation in your browser's local storage
                so you are not prompted every visit. This data does not leave your device.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <div>
                <strong className="text-cream">Shopping Cart (localStorage):</strong> Your
                cart contents are stored locally in your browser to persist between sessions.
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <div>
                <strong className="text-cream">Analytics:</strong> We may use third-party
                analytics tools (such as Google Analytics) that use cookies to collect
                anonymized data about how visitors use the Site — pages viewed, time on
                page, referral sources. This data is used to improve the Site experience.
              </div>
            </li>
          </ul>
          <p className="text-cream-dim text-sm leading-relaxed mt-4">
            You can control cookies through your browser settings. Disabling cookies may
            affect Site functionality.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            7. Sharing of Information
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We <strong className="text-cream">do not sell, rent, or trade</strong> your
            personal information to third parties. We share your information only in the
            following limited circumstances:
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Service providers:</strong> Stripe (payment
                processing), Klaviyo (email marketing), shipping carriers, and other
                vendors who assist us in operating the Site and fulfilling orders — only
                to the extent necessary to perform their services
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Legal compliance:</strong> When required by
                law, subpoena, court order, or government request
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Business transfers:</strong> In connection
                with a merger, acquisition, or sale of all or a portion of our assets,
                your information may be transferred as part of that transaction
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Protection of rights:</strong> To protect
                the rights, property, or safety of Greenstone Peptides, our customers, or
                others
              </span>
            </li>
          </ul>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">8. Data Retention</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the
            purposes outlined in this Policy, including to provide our services, comply
            with legal obligations, resolve disputes, and enforce our agreements.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            Order records are typically retained for a minimum of seven (7) years for tax
            and accounting purposes. Marketing data is retained until you unsubscribe or
            request deletion. If you request deletion of your account or data, we will
            remove your information subject to any legal retention requirements.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">9. Your Rights</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Depending on your location, you may have the following rights with respect to
            your personal information:
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Access:</strong> Request a copy of the
                personal information we hold about you
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Correction:</strong> Request that we correct
                inaccurate or incomplete information
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Deletion:</strong> Request that we delete
                your personal information, subject to legal retention requirements
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                <strong className="text-cream">Opt-out of marketing:</strong> Unsubscribe
                from marketing emails at any time via the link in any email
              </span>
            </li>
          </ul>
          <p className="text-cream-dim text-sm leading-relaxed mt-4">
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:info@greenstonewellness.store"
              className="text-emerald hover:underline"
            >
              info@greenstonewellness.store
            </a>. We will respond to verified requests within 30 days.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            10. California Consumer Privacy Act (CCPA)
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            If you are a California resident, you have additional rights under the
            California Consumer Privacy Act (CCPA):
          </p>
          <ul className="mt-4 space-y-2 text-cream-dim text-sm">
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                The right to know what personal information we collect, use, disclose,
                and sell
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>The right to request deletion of your personal information</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                The right to opt out of the sale of your personal information — we do
                not sell personal information
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald mt-0.5 shrink-0">—</span>
              <span>
                The right to non-discrimination for exercising your privacy rights
              </span>
            </li>
          </ul>
          <p className="text-cream-dim text-sm leading-relaxed mt-4">
            To submit a CCPA request, email us at{' '}
            <a
              href="mailto:info@greenstonewellness.store"
              className="text-emerald hover:underline"
            >
              info@greenstonewellness.store
            </a>{' '}
            with the subject line "CCPA Privacy Request."
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">11. Data Security</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We take reasonable technical and organizational measures to protect your
            personal information from unauthorized access, disclosure, alteration, and
            destruction. All data transmission between your browser and the Site is
            encrypted via SSL/HTTPS.
          </p>
          <p className="text-cream-dim text-sm leading-relaxed mt-3">
            However, no method of transmission over the internet or method of electronic
            storage is 100% secure. While we strive to protect your information, we
            cannot guarantee absolute security.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            12. Children's Privacy
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Our Site is not intended for individuals under 18 years of age. We do not
            knowingly collect personal information from minors. If we become aware that
            we have collected personal information from a person under 18, we will take
            steps to delete that information promptly.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">13. External Links</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            The Site may contain links to third-party websites (such as Stripe or
            Klaviyo). We are not responsible for the privacy practices of those sites
            and encourage you to review their privacy policies independently.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">
            14. Changes to This Policy
          </h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            We reserve the right to update this Privacy Policy at any time. Changes are
            effective immediately upon posting to the Site. We will update the "Last
            Updated" date at the top of this page when changes are made. We encourage
            you to review this Policy periodically.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">15. Contact Us</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy
            or your personal information, contact us at:
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
