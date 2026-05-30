'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSavedCards, SavedCard } from '@/hooks/useSavedCards';
import { US_STATES, FL_STATE_CODE } from '@/lib/us-states';
import { getParentBySlug, type Variant } from '@/data/parent-products';

// Re-export for any local references kept in sync with the shared source.
void FL_STATE_CODE;

const FLAT_SHIPPING = 25.0; // Bloom's actual shipping cost

type SubmitState = 'idle' | 'submitting' | 'done' | 'error';
type YN = '' | 'yes' | 'no';

function fieldClass(extra = '') {
  return (
    'w-full bg-obsidian-mid border border-cream-dim/30 rounded-lg px-4 py-3.5 text-cream text-base sm:text-sm ' +
    'placeholder:text-cream-dim/50 focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/30 ' +
    'transition-all ' +
    extra
  );
}

function Label({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="block font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim mb-2">
      {children}
      {required && <span className="text-emerald ml-1">*</span>}
    </span>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6 pb-3 border-b border-cream-dim/15">
      <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">{kicker}</div>
      <h2 className="font-cormorant text-2xl text-cream tracking-tight">{title}</h2>
    </div>
  );
}

// --- Yes / No toggle pair, with optional "describe" reveal -----------------

function YesNoToggle({
  question,
  subtext,
  value,
  onChange,
  describe,
  onDescribeChange,
  describePlaceholder = 'Please describe…',
}: {
  question: string;
  subtext?: string;
  value: YN;
  onChange: (v: YN) => void;
  describe?: string;
  onDescribeChange?: (v: string) => void;
  describePlaceholder?: string;
}) {
  return (
    <div>
      <div className="mb-2">
        <div className="text-cream text-sm leading-snug">{question}</div>
        {subtext && (
          <div className="text-cream-dim/70 text-xs leading-snug mt-1">{subtext}</div>
        )}
      </div>
      <div className="flex gap-2">
        {(['yes', 'no'] as const).map((opt) => {
          const active = value === opt;
          const activeYesClass = 'bg-gold/20 text-gold border-gold/60 shadow-[0_0_0_4px_rgba(202,138,4,0.08)]';
          const activeNoClass = 'bg-emerald text-obsidian border-emerald shadow-[0_0_0_4px_rgba(16,185,129,0.18)]';
          const inactiveClass = 'bg-obsidian-mid border-cream-dim/25 text-cream-dim hover:text-cream hover:border-cream-dim/50';
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={
                'rounded-full border px-7 py-3 min-w-[96px] font-jetbrains text-[0.7rem] tracking-widest uppercase transition-all ' +
                (active
                  ? opt === 'yes'
                    ? activeYesClass
                    : activeNoClass
                  : inactiveClass)
              }
              aria-pressed={active}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {value === 'yes' && onDescribeChange && (
        <div className="mt-3 border-l-2 border-gold/60 bg-gold/5 pl-4 py-1">
          <input
            value={describe ?? ''}
            onChange={(e) => onDescribeChange(e.target.value)}
            placeholder={describePlaceholder}
            className={fieldClass()}
          />
        </div>
      )}
    </div>
  );
}

// --- Card number formatter --------------------------------------------------

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 19); // up to 19 (Amex 15, Visa 16, others)
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function brandFromPan(pan: string): string {
  const d = pan.replace(/\D/g, '');
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  if (/^6(?:011|5)/.test(d)) return 'Discover';
  return 'Card';
}

// ---------------------------------------------------------------------------

export default function OrderOutOfStatePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cards: savedCards, loading: cardsLoading } = useSavedCards();

  // ---- Auth gate ----------------------------------------------------------
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Preserve product query params so customer returns to the same flow
      const qs = params.toString();
      const callback = '/order-out-of-state' + (qs ? `?${qs}` : '');
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    }
  }, [status, params, router]);

  // ---- Product context ----------------------------------------------------
  // If the customer arrived from a parent product page (?slug=...) we load
  // the full molecule and let them pick a variant inline. Direct query
  // params (?product/dose/size/price) are still supported for legacy CTAs.
  const slug = params.get('slug') || '';
  const parentProduct = useMemo(() => (slug ? getParentBySlug(slug) : undefined), [slug]);

  // null = no variant chosen yet (or customer deselected). Defaults to 0 so the
  // form is functional out of the box; clicking the active row toggles it off.
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number | null>(0);
  const selectedVariant: Variant | undefined =
    selectedVariantIdx !== null ? parentProduct?.variants[selectedVariantIdx] : undefined;

  const productName = parentProduct?.name || params.get('product') || params.get('name') || '';
  const productDose = selectedVariant?.dose || params.get('dose') || '';
  const productSize = selectedVariant?.size || params.get('size') || '';
  const productPrice: number | undefined = selectedVariant?.price
    ?? (params.get('price') ? parseFloat(params.get('price') as string) : undefined);

  // ---- Section 1 — Health screening --------------------------------------
  const [sex, setSex] = useState<'' | 'male' | 'female'>('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [hasCancer, setHasCancer] = useState<YN>('');
  const [hasCancerDescribe, setHasCancerDescribe] = useState('');
  const [hasThyroid, setHasThyroid] = useState<YN>('');
  const [hasThyroidDescribe, setHasThyroidDescribe] = useState('');
  const [takingMeds, setTakingMeds] = useState<YN>('');
  const [takingMedsDescribe, setTakingMedsDescribe] = useState('');
  const [firstTimePeptides, setFirstTimePeptides] = useState<YN>('');
  const [hasAllergies, setHasAllergies] = useState<YN>('');
  const [hasAllergiesDescribe, setHasAllergiesDescribe] = useState('');

  // ---- Section 2 — About you ---------------------------------------------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  // ---- Section 3 — Shipping address ---------------------------------------
  const [streetAddress, setStreetAddress] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zip, setZip] = useState('');

  // Prefill from session once authenticated. Customer can still edit each
  // field — they might be shipping to a friend or sending a gift.
  useEffect(() => {
    if (!session?.user) return;
    const u = session.user;
    if (u.name && !fullName) setFullName(u.name);
    if (u.email && !email) setEmail(u.email);
    if (u.phone && !phone) setPhone(u.phone);
    if (u.dateOfBirth && !dob) setDob(u.dateOfBirth);
    const a = u.shippingAddress;
    if (a) {
      if (a.line1 && !streetAddress) setStreetAddress(a.line1);
      if (a.line2 && !aptSuite) setAptSuite(a.line2);
      if (a.city && !city) setCity(a.city);
      if (a.state && !stateCode) setStateCode(a.state);
      if (a.zip && !zip) setZip(a.zip);
    } else if (u.shippingState && !stateCode) {
      setStateCode(u.shippingState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // ---- Section 4 — Payment ------------------------------------------------
  const [selectedCardId, setSelectedCardId] = useState<string>(''); // '' = none, 'new' = add new
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Default to "new" if no saved cards, else first saved card
  useEffect(() => {
    if (cardsLoading) return;
    if (savedCards.length === 0) setSelectedCardId('new');
    else if (!selectedCardId) setSelectedCardId(savedCards[0].id);
  }, [savedCards, cardsLoading, selectedCardId]);

  const usingNewCard = selectedCardId === 'new' || savedCards.length === 0;

  // ---- Section 5 — Consents ----------------------------------------------
  const [consentCompounding, setConsentCompounding] = useState(false);
  const [consentTelehealth, setConsentTelehealth] = useState(false);
  const [consentHipaa, setConsentHipaa] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  // ---- Submit state -------------------------------------------------------
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderRef, setOrderRef] = useState('');

  // ---- Totals -------------------------------------------------------------
  const subtotal = productPrice ?? 0;
  const total = useMemo(() => subtotal + FLAT_SHIPPING, [subtotal]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    // Final validation
    if (!sex) { setErrorMsg('Please select biological sex.'); return; }
    if (!heightFt || !heightIn) { setErrorMsg('Please enter your height.'); return; }
    if (!weightLbs) { setErrorMsg('Please enter your weight.'); return; }
    const screenings: Array<[string, YN]> = [
      ['cancer', hasCancer], ['thyroid', hasThyroid], ['medications', takingMeds],
      ['first-time-peptides', firstTimePeptides], ['allergies', hasAllergies],
    ];
    const unanswered = screenings.filter(([, v]) => v === '');
    if (unanswered.length) {
      setErrorMsg('Please answer all health screening questions.');
      return;
    }
    if (!consentCompounding || !consentTelehealth || !consentHipaa || !consentTerms) {
      setErrorMsg('All four consents are required.');
      return;
    }
    if (usingNewCard) {
      const panDigits = cardNumber.replace(/\D/g, '');
      if (panDigits.length < 13 || panDigits.length > 19) {
        setErrorMsg('Please enter a valid card number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setErrorMsg('Expiry must be in MM/YY format.');
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvc)) {
        setErrorMsg('CVC must be 3 or 4 digits.');
        return;
      }
      if (!cardholderName.trim()) {
        setErrorMsg('Please enter the cardholder name.');
        return;
      }
    }

    setSubmitState('submitting');

    try {
      const selectedSaved = !usingNewCard
        ? savedCards.find((c) => c.id === selectedCardId)
        : null;

      const res = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Product
          productName, productDose, productSize, productPrice,
          subtotal, shipping: FLAT_SHIPPING, total,

          // Health screening
          sex, heightFt, heightIn, weightLbs,
          hasCancer, hasCancerDescribe,
          hasThyroid, hasThyroidDescribe,
          takingMeds, takingMedsDescribe,
          firstTimePeptides,
          hasAllergies, hasAllergiesDescribe,

          // About you
          fullName, email, phone, dob,

          // Shipping
          streetAddress, aptSuite, city, state: stateCode, zip,

          // Payment — raw PAN only sent if new card. Pete needs it to enter into Bloom.
          card: usingNewCard
            ? {
                kind: 'new',
                number: cardNumber.replace(/\s/g, ''),
                expiry: cardExpiry,
                cvc: cardCvc,
                cardholderName,
                brand: brandFromPan(cardNumber),
              }
            : {
                kind: 'saved',
                id: selectedSaved?.id,
                brand: selectedSaved?.brand,
                last4: selectedSaved?.last4,
                exp_month: selectedSaved?.exp_month,
                exp_year: selectedSaved?.exp_year,
              },
          saveCard: usingNewCard ? saveCard : false,

          // Consents
          consentCompounding, consentTelehealth, consentHipaa, consentTerms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Submission failed. Please try again.');
        setSubmitState('error');
        return;
      }
      setOrderRef(data.ref || '');
      setSubmitState('done');
      // Clear card from memory immediately on success
      setCardNumber('');
      setCardCvc('');
      // Jump to the top so the customer sees the "Thank you" confirmation
      // (the success screen replaces the form, but the page scroll
      // position is preserved by the browser otherwise).
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setSubmitState('error');
    }
  }

  // ---- Auth loading / redirect states ------------------------------------
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-obsidian text-cream pt-32 pb-24 px-6 grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim">
            {status === 'loading' ? 'Loading…' : 'Redirecting to sign in…'}
          </div>
        </div>
      </main>
    );
  }

  // ---- Success state ------------------------------------------------------
  if (submitState === 'done') {
    const firstName = (fullName.trim().split(/\s+/)[0]) || 'there';
    return (
      <main className="min-h-screen bg-obsidian text-cream pt-32 pb-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-4">Order received</div>
          <h1 className="font-cormorant text-4xl text-cream tracking-tight mb-6">Thank you, {firstName}.</h1>
          <p className="text-cream-dim text-base leading-relaxed mb-8">
            We have your order and our team will process it through our pharmacy partner within one business day.
            You&apos;ll receive a shipping confirmation by email as soon as it leaves our fulfillment hub.
          </p>
          <div className="inline-block px-6 py-4 border border-emerald/30 bg-emerald/5 mb-8">
            <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim mb-1">Order reference</div>
            <div className="font-jetbrains text-lg text-emerald-light tracking-wider">{orderRef}</div>
          </div>
          <div>
            <Link href="/" className="font-jetbrains text-xs tracking-widest uppercase text-cream-dim hover:text-gold transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---- Form ---------------------------------------------------------------
  return (
    <main className="min-h-screen bg-obsidian text-cream pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-12">
        {/* Left — form */}
        <div>
          <div className="mb-10">
            <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-2">Secure Checkout</div>
            <h1 className="font-cormorant text-4xl text-cream tracking-tight mb-4">Place your order.</h1>
            <p className="text-cream-dim text-sm leading-relaxed max-w-prose">
              Your medication is dispensed by a licensed 503A compounding pharmacy and shipped
              directly to your home. Place your order below and a licensed team member will
              process it through our fulfillment hub.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-14">
            {/* 00 — PRODUCT (variant picker, only shown when slug-routed) */}
            {parentProduct && (
              <section>
                <SectionHeading kicker="00" title={`Select ${parentProduct.name} option`} />
                <div className="space-y-3">
                  {parentProduct.variants.map((v, idx) => {
                    const active = selectedVariantIdx === idx;
                    return (
                      <button
                        key={`${v.dose}-${v.size}-${v.price}`}
                        type="button"
                        onClick={() =>
                          setSelectedVariantIdx((cur) => (cur === idx ? null : idx))
                        }
                        aria-pressed={active}
                        className={
                          'w-full flex items-center justify-between gap-4 px-5 py-4 sm:py-5 rounded-2xl border-2 text-left transition-all min-h-[64px] ' +
                          (active
                            ? 'border-emerald bg-emerald/15 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]'
                            : 'border-cream-dim/30 bg-obsidian-mid/60 hover:border-cream-dim/55 hover:-translate-y-0.5')
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={
                              'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                              (active ? 'border-emerald bg-emerald' : 'border-cream-dim/40 bg-transparent')
                            }
                            aria-hidden="true"
                          >
                            {active && <span className="w-2 h-2 rounded-full bg-obsidian" />}
                          </span>
                          <div className="min-w-0">
                            <div className="text-base font-medium text-cream">{v.label}</div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {/* Dose pill (mg / mg-per-mL) — sky blue */}
                              <span
                                className={
                                  'inline-flex items-center rounded-full px-2.5 py-1 font-jetbrains text-[0.65rem] tracking-widest uppercase border transition-colors ' +
                                  (active
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/60'
                                    : 'bg-sky-500/10 text-sky-300/85 border-sky-400/35')
                                }
                              >
                                {v.dose}
                              </span>
                              {/* Size pill (vial / tablet count) — amber */}
                              <span
                                className={
                                  'inline-flex items-center rounded-full px-2.5 py-1 font-jetbrains text-[0.65rem] tracking-widest uppercase border transition-colors ' +
                                  (active
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                                    : 'bg-amber-500/10 text-amber-300/85 border-amber-400/35')
                                }
                              >
                                {v.size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`font-jetbrains font-medium shrink-0 ${active ? 'text-emerald-light text-lg' : 'text-cream text-base'}`}>
                          ${v.price.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 01 — HEALTH SCREENING */}
            <section>
              <SectionHeading kicker="01" title="Health screening" />

              {/* Biological sex */}
              <div className="mb-8">
                <Label required>Biological sex</Label>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((opt) => {
                    const active = sex === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSex(opt)}
                        className={
                          'rounded-full border px-8 py-3 min-w-[120px] font-jetbrains text-[0.7rem] tracking-widest uppercase transition-all ' +
                          (active
                            ? 'bg-emerald text-obsidian border-emerald shadow-[0_0_0_4px_rgba(16,185,129,0.18)]'
                            : 'bg-obsidian-mid border-cream-dim/30 text-cream-dim hover:text-cream hover:border-cream-dim/50')
                        }
                        aria-pressed={active}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Height + Weight */}
              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <Label required>Height</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className={fieldClass()} required>
                      <option value="">Feet…</option>
                      {[3,4,5,6,7].map((n) => <option key={n} value={n}>{n} ft</option>)}
                    </select>
                    <select value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className={fieldClass()} required>
                      <option value="">Inches…</option>
                      {Array.from({length: 12}, (_, i) => i).map((n) => <option key={n} value={n}>{n} in</option>)}
                    </select>
                  </div>
                </div>
                <label>
                  <Label required>Weight (lbs)</Label>
                  <input
                    type="number" min={50} max={700}
                    inputMode="numeric"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="e.g. 165"
                    className={fieldClass()}
                    required
                  />
                </label>
              </div>

              {/* Yes/No screening questions */}
              <div className="space-y-8">
                <YesNoToggle
                  question="Do you currently have cancer?"
                  subtext="Any active diagnosis or treatment"
                  value={hasCancer}
                  onChange={setHasCancer}
                  describe={hasCancerDescribe}
                  onDescribeChange={setHasCancerDescribe}
                />
                <YesNoToggle
                  question="Do you have a thyroid condition?"
                  subtext="Hypo/hyper, Hashimoto's, Graves', or other"
                  value={hasThyroid}
                  onChange={setHasThyroid}
                  describe={hasThyroidDescribe}
                  onDescribeChange={setHasThyroidDescribe}
                />
                <YesNoToggle
                  question="Are you currently taking any medications?"
                  subtext="Prescription, OTC, or supplements"
                  value={takingMeds}
                  onChange={setTakingMeds}
                  describe={takingMedsDescribe}
                  onDescribeChange={setTakingMedsDescribe}
                />
                <YesNoToggle
                  question="Is this your first time taking peptides?"
                  value={firstTimePeptides}
                  onChange={setFirstTimePeptides}
                />
                <YesNoToggle
                  question="Do you have any known allergies?"
                  subtext="Medications, foods, substances, or environmental"
                  value={hasAllergies}
                  onChange={setHasAllergies}
                  describe={hasAllergiesDescribe}
                  onDescribeChange={setHasAllergiesDescribe}
                />
              </div>
            </section>

            {/* 02 — ABOUT YOU */}
            <section>
              <SectionHeading kicker="02" title="About you" />
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="sm:col-span-2">
                  <Label required>Full name</Label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fieldClass()}
                    required
                  />
                </label>
                <label>
                  <Label required>Email</Label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className={fieldClass('opacity-70 cursor-not-allowed')}
                    required
                  />
                </label>
                <label>
                  <Label required>Phone</Label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className={fieldClass()}
                    required
                  />
                </label>
                <label className="sm:col-span-2">
                  <Label required>Date of birth (mm/dd/yyyy)</Label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={fieldClass()}
                    required
                  />
                </label>
              </div>
            </section>

            {/* 03 — SHIPPING ADDRESS */}
            <section>
              <SectionHeading kicker="03" title="Shipping address" />
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="sm:col-span-2">
                  <Label required>Street address</Label>
                  <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className={fieldClass()} required />
                </label>
                <label className="sm:col-span-2">
                  <Label>Apt / Suite</Label>
                  <input value={aptSuite} onChange={(e) => setAptSuite(e.target.value)} placeholder="Optional" className={fieldClass()} />
                </label>
                <label>
                  <Label required>City</Label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass()} required />
                </label>
                <div className="grid grid-cols-[1fr_120px] gap-3">
                  <label>
                    <Label required>State</Label>
                    <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={fieldClass()} required>
                      <option value="">Select state…</option>
                      {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </label>
                  <label>
                    <Label required>ZIP</Label>
                    <input
                      inputMode="numeric"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      className={fieldClass()}
                      required
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* 04 — PAYMENT */}
            <section>
              <SectionHeading kicker="04" title="Payment" />

              {/* Saved cards picker */}
              {savedCards.length > 0 && (
                <div className="mb-6 space-y-3">
                  {savedCards.map((c: SavedCard) => {
                    const selected = selectedCardId === c.id;
                    return (
                      <label
                        key={c.id}
                        className={
                          'flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all min-h-[64px] ' +
                          (selected
                            ? 'border-emerald bg-emerald/10 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]'
                            : 'border-cream-dim/30 bg-obsidian-mid/60 hover:border-cream-dim/55')
                        }
                      >
                        <input
                          type="radio"
                          name="saved-card"
                          checked={selected}
                          onChange={() => setSelectedCardId(c.id)}
                          className="sr-only"
                        />
                        <span
                          className={
                            'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                            (selected ? 'border-emerald bg-emerald' : 'border-cream-dim/40 bg-transparent')
                          }
                          aria-hidden="true"
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-obsidian" />}
                        </span>
                        <span className="text-cream text-base">
                          {c.brand} <span className="font-jetbrains tracking-wider">••••{c.last4}</span>
                          <span className="text-cream-dim ml-2 text-sm">
                            exp {String(c.exp_month).padStart(2, '0')}/{String(c.exp_year).slice(-2)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  <label
                    className={
                      'flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all min-h-[64px] ' +
                      (selectedCardId === 'new'
                        ? 'border-emerald bg-emerald/10 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]'
                        : 'border-cream-dim/30 bg-obsidian-mid/60 hover:border-cream-dim/55')
                    }
                  >
                    <input
                      type="radio"
                      name="saved-card"
                      checked={selectedCardId === 'new'}
                      onChange={() => setSelectedCardId('new')}
                      className="sr-only"
                    />
                    <span
                      className={
                        'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                        (selectedCardId === 'new' ? 'border-emerald bg-emerald' : 'border-cream-dim/40 bg-transparent')
                      }
                      aria-hidden="true"
                    >
                      {selectedCardId === 'new' && <span className="w-2 h-2 rounded-full bg-obsidian" />}
                    </span>
                    <span className="text-cream text-base">+ Add new card</span>
                  </label>
                </div>
              )}

              {/* New card inputs */}
              {usingNewCard && (
                <>
                  <p className="text-cream-dim/80 text-xs leading-relaxed mb-5">
                    Card information is encrypted at rest and used one time to process your prescription
                    with our pharmacy partner. It is permanently purged from our servers the moment your
                    order is fulfilled.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="sm:col-span-2">
                      <Label required>Card number</Label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className={fieldClass('font-jetbrains tracking-wider')}
                        required
                      />
                    </label>
                    <label>
                      <Label required>Expiry (MM/YY)</Label>
                      <input
                        autoComplete="cc-exp"
                        value={cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                          setCardExpiry(v);
                        }}
                        placeholder="MM/YY"
                        className={fieldClass('font-jetbrains')}
                        required
                      />
                    </label>
                    <label>
                      <Label required>CVC</Label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className={fieldClass('font-jetbrains')}
                        required
                      />
                    </label>
                    <label className="sm:col-span-2">
                      <Label required>Cardholder name</Label>
                      <input
                        autoComplete="cc-name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className={fieldClass()}
                        required
                      />
                    </label>
                  </div>

                  <label
                    className={
                      'inline-flex items-center gap-3 mt-6 cursor-pointer rounded-full border-2 px-5 py-2.5 transition-all ' +
                      (saveCard
                        ? 'border-emerald bg-emerald/15 text-emerald-light'
                        : 'border-cream-dim/30 bg-obsidian-mid text-cream-dim hover:border-cream-dim/50 hover:text-cream')
                    }
                  >
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={
                        'shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ' +
                        (saveCard ? 'border-emerald bg-emerald' : 'border-cream-dim/40 bg-transparent')
                      }
                      aria-hidden="true"
                    >
                      {saveCard && (
                        <svg viewBox="0 0 14 14" className="w-3 h-3 text-obsidian" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,7 6,11 12,3" />
                        </svg>
                      )}
                    </span>
                    <span className="font-jetbrains text-[0.7rem] tracking-widest uppercase">
                      Save card for future orders
                    </span>
                  </label>
                </>
              )}
            </section>

            {/* 05 — CONSENT */}
            <section>
              <SectionHeading kicker="05" title="Consent" />
              <div className="space-y-4">
                {[
                  {
                    v: consentCompounding, set: setConsentCompounding,
                    label: <>I understand my medication will be prepared by a licensed compounding pharmacy and acknowledge the FDA&apos;s position on compounded medications. <Link href="#" className="text-emerald-light underline hover:text-emerald">Read disclaimer</Link>.</>,
                  },
                  {
                    v: consentTelehealth, set: setConsentTelehealth,
                    label: <>I consent to receive medical care via telehealth and understand the risks and benefits. <Link href="#" className="text-emerald-light underline hover:text-emerald">Read consent</Link>.</>,
                  },
                  {
                    v: consentHipaa, set: setConsentHipaa,
                    label: <>I acknowledge that I have reviewed the <Link href="#" className="text-emerald-light underline hover:text-emerald">HIPAA Notice of Privacy Practices</Link>.</>,
                  },
                  {
                    v: consentTerms, set: setConsentTerms,
                    label: <>I have read and agree to the <Link href="#" className="text-emerald-light underline hover:text-emerald">Terms of Service</Link>.</>,
                  },
                ].map((c, i) => (
                  <label
                    key={i}
                    className={
                      'flex items-start gap-4 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ' +
                      (c.v
                        ? 'border-emerald/60 bg-emerald/5'
                        : 'border-cream-dim/25 bg-obsidian-mid/40 hover:border-cream-dim/45')
                    }
                  >
                    <input
                      type="checkbox"
                      checked={c.v}
                      onChange={(e) => c.set(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <span
                      className={
                        'mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ' +
                        (c.v ? 'border-emerald bg-emerald' : 'border-cream-dim/45 bg-transparent')
                      }
                      aria-hidden="true"
                    >
                      {c.v && (
                        <svg viewBox="0 0 14 14" className="w-4 h-4 text-obsidian" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,7 6,11 12,3" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-base leading-relaxed transition-colors ${c.v ? 'text-cream' : 'text-cream-dim'}`}>
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* SUBMIT */}
            {errorMsg && (
              <div className="px-4 py-3 border border-error/40 bg-error/10 text-error text-sm">
                {errorMsg}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 bg-emerald hover:bg-emerald-light disabled:opacity-60 disabled:cursor-wait text-obsidian font-jetbrains text-sm tracking-widest uppercase font-semibold transition-all shadow-lg shadow-emerald/20 hover:shadow-emerald/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitState === 'submitting'
                  ? 'Submitting…'
                  : `Place order — $${total.toFixed(2)}`}
              </button>
              <p className="text-cream-dim/70 text-xs mt-4 max-w-prose">
                By placing your order, you confirm the information above is accurate. Your prescription
                is dispensed by a licensed Florida 503A compounding pharmacy.
              </p>
            </div>
          </form>
        </div>

        {/* Right rail — Order summary */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="border border-cream-dim/15 bg-obsidian-mid/40 p-6">
            <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald mb-1">Summary</div>
            <h2 className="font-cormorant text-2xl text-cream tracking-tight mb-5">Your order</h2>

            {productName ? (
              <div className="pb-4 mb-4 border-b border-cream-dim/15">
                <div className="text-cream text-sm font-medium">{productName}</div>
                <div className="text-cream-dim text-xs mt-1">
                  {[productDose, productSize].filter(Boolean).join(' · ')}
                </div>
              </div>
            ) : (
              <div className="pb-4 mb-4 border-b border-cream-dim/15 text-cream-dim text-xs italic">
                No product selected.
              </div>
            )}

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-cream-dim">Subtotal</dt>
                <dd className="text-cream font-jetbrains">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cream-dim">Shipping</dt>
                <dd className="text-cream font-jetbrains">${FLAT_SHIPPING.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-cream-dim/15">
                <dt className="text-cream font-jetbrains text-[0.7rem] tracking-widest uppercase">Total</dt>
                <dd className="text-gold font-cormorant text-2xl">${total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
