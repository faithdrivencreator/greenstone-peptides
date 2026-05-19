# Bloom Storefront — End-to-End Flow & Architecture

Scraped 2026-05-19 via Playwright from the live `bloom.greenstonerx.com` clinic dashboard and patient-facing storefront.

This document captures the **exact mechanics** of how a patient becomes a paying customer through your clinic, what Bloom owns, what you own, and where your marketing site (`greenstonewellness.store`) plugs in.

---

## 1. Who you are inside Bloom

| | |
|---|---|
| Account email | `pete+mystore1@fluidfaithsolutions.com` |
| Account label | Dr. Luciano Kolodny |
| Role | **Clinic \| Physician** |
| Clinic display name | **GreenstoneWellness.Store** |
| State | **FL** |
| Storefront URL | `https://bloom.greenstonerx.com/dtp/6a0bb254fa53ddc1571c040b` |
| Current layout | **Educational** (`/learn` route) |
| Pharmacy partner (footer attribution) | **Powered by Bloom Health** · © 2026 GreenstoneWellness.Store |

You are positioned in the Bloom system as a Florida-licensed clinic with a named physician (Dr. Luciano Kolodny) on file. The pharmacy that fulfills is Greenstone Rx (the 503A pharmacy). You earn margin/commission on every prescription that ships through your storefront link.

## 2. The clinic dashboard (what's on your side)

Menu structure inside `bloom.greenstonerx.com`:

- **Home** (`/dashboard`)
- **Orders**
  - Patient Orders (`/orders`)
  - Bulk Orders (`/bulk-orders/list`)
  - Invoice Tracking (`/invoice-tracking`)
  - Patients (`/patients`)
  - **My Store** (`/store`) ← layout config lives here
- **Products**
  - Products (`/products`)
  - Product Requests (`/requests`)
- **Reporting**
- Settings (`/settings`)

The dashboard is **your back office**. Patients never see it. Your marketing site sits in front of all of this and exists only to push qualified traffic into your Bloom storefront link.

## 3. The two storefront layout choices

Configured in dashboard → My Store. You pick one; you can flip any time.

| Layout | URL pattern | Behavior | Best for |
|---|---|---|---|
| **Lightweight** | `/dtp/<clinic-id>` (root) | Fast browse, fewest clicks to checkout. Patients hit category → product → add to cart immediately. | Patients who already know what they want |
| **Educational** *(currently selected)* | `/dtp/<clinic-id>/learn` | Categories + full drug explainers + dose finder (sex / age / weight / height → recommended starting dose). | Patients new to a treatment area |

**Recommendation:** Keep **Educational** as the default. Traffic from `greenstonewellness.store` will be mostly first-time peptide patients; the dose finder and explainer pages do the heavy lifting your marketing site can't.

## 4. The patient-facing storefront structure

Live URL: `https://bloom.greenstonerx.com/dtp/6a0bb254fa53ddc1571c040b/learn`

### Header

- Brand: `GreenstoneWellness.Store · FL`
- Nav: Shop · Sign in · Cart

### Hero block

- Eyebrow: *"GreenstoneWellness.Store's curated formulary"*
- H1: **"Medicine, _prescribed_ for you."**
- Subhead: *"Each medication in this store has been selected by GreenstoneWellness.Store for our patients. Read about what each one does, how it works, and whether it's right for you — then request a consult."*
- Trust badges: `Licensed in FL` · `503A pharmacy` · `Free shipping` *(see anti-pattern note below)*

### Browse block

`What brings you here?` — **3 treatment areas · 11 medications**

| Category | Count | Tagline |
|---|---|---|
| **Weight Loss** | 3 options | GLP-1 and GIP medications that reset hunger signals — not willpower. |
| **Men's ED** | 1 option | Sildenafil, tadalafil, and combination oral therapies — discreetly shipped. |
| **Peptides** | 7 options | Targeted biological signals for healing, growth hormone, metabolism, and collagen. |

### Category page (example: Weight Loss `/learn/weight-loss`)

Breadcrumb · `Shop / Weight Loss`

- Eyebrow: `Weight Loss`
- H1 hero: **"GLP-1s changed _what's possible._"**
- Lead paragraph (set in canonical content guide)
- 4 explainer blocks: **How this works in your body** · **Who does well** · **Who should wait** · **What timelines actually look like**
- Formulary grid: 3 medication cards (Retatrutide $277, Semaglutide $54, Tirzepatide $95) — each shows category badge, "from $X" price, name, one-line description, # of options, "Learn more"

### Product detail page (example: Tirzepatide `/learn/weight-loss/tirzepatide`)

Breadcrumb · `Shop / Weight Loss / Tirzepatide`

Two-column layout:

**Left column (content):**
- Category eyebrow · H1 product name · subhead
- Product hero image
- 4 explainer sections: How it works · Who it's for · What to expect · Who should not take this
- FAQ accordion: "Why pick X over Y?", "Is the side-effect profile worse?"

**Right column (sticky dose-finder sidebar):**
- "Dose finder — Find your starting dose"
- Editable patient profile chip: `M · 38y · 180 lbs · 5'10"`
- Suggested dose with Light / Standard / Strong toggle
- Disclaimer: **"Suggestions only — your physician reviews and approves the final protocol before any medication ships."**
- "Your match" card: variant (e.g., Tirzepatide 0.50mg, 30 Tablets · ODT), price ($95), shipping ETA ("est. 3 days")
- **Add to cart** button
- "See all 18 options ↓" link to full dose grid

### Footer

- Brand: `GreenstoneWellness.Store · Licensed in FL`
- Support: FAQ · Shipping · Contact
- Legal: Terms · Privacy
- Attribution: **Powered by Bloom Health · © 2026 GreenstoneWellness.Store**

## 5. Checkout / intake flow (4 steps)

URL: `/dtp/<clinic-id>/checkout`

A 4-step horizontal progress bar surfaces at the top of every checkout step:

| # | Step | What happens |
|---|---|---|
| **1** | **Verify Phone** | Patient enters US phone, receives SMS code, confirms. This is the gate — they cannot proceed without a verified phone on file. |
| **2** | **Your Info** | Name, sex (male/female), DOB, height, weight, shipping address. (Bloom uses this both for shipping and as inputs to the dose-finder logic on product pages.) |
| **3** | **Health Screening** | Medical questionnaire — contraindication screening (thyroid cancer history, pregnancy, pancreatitis, gallbladder disease, nitrates, etc.) + HIPAA + telehealth consent. |
| **4** | **Review & Pay** | Order summary, payment. **Pharmacy (Greenstone Rx) processes the card directly — not the clinic.** Your commission/markup is paid out separately. |

After payment, the pharmacy's prescribing physician reviews the intake and either approves, denies, or requests follow-up before the medication ships. Estimated shipping shown on the product card ("est. 3 days") begins after physician approval.

The full intake/screening is owned by Bloom — your marketing site never collects PHI, never handles payment, never stores patient data. This is the compliance moat: greenstonewellness.store is a marketing/educational surface; Bloom is the regulated patient flow.

## 6. Where greenstonewellness.store fits

Your marketing site is **the funnel TO this storefront**, not a replacement for it.

| Layer | Owner | Handles |
|---|---|---|
| Awareness / SEO / education | **greenstonewellness.store** (yours) | Blog, treatment area explainers, brand presence, FAQs, trust signals, founder/clinic narrative |
| Soft consideration | **greenstonewellness.store** | Formulary catalog page that mirrors the Bloom storefront; product detail pages with the same educational content; CTAs deep-link to Bloom |
| Hard funnel (phone verify → intake → screening → payment) | **bloom.greenstonerx.com** (clinic storefront) | All PHI, payment, physician review, prescription, fulfillment |
| Order management / patient records / billing reconciliation | **bloom.greenstonerx.com** (clinic dashboard) | Patient Orders, Bulk Orders, Invoice Tracking, Reporting |
| Pharmacy fulfillment | **Greenstone Rx** (503A pharmacy) | Compounding, dispensing, cold-chain shipping |

### What every product CTA on greenstonewellness.store should do

Open `https://bloom.greenstonerx.com/dtp/6a0bb254fa53ddc1571c040b/learn/<category>/<medication>` in a new tab (deep link straight to the product detail, not the storefront root). Patient lands logged-out, hits Add to cart, runs through the 4-step intake. This is exactly what the existing `<PharmacyButton>` component does — confirm every product page on greenstonewellness.store calls it with the right deep link before tomorrow's unlock.

## 7. Compliance posture (the resolved version)

You are a **Florida-licensed telehealth clinic** branded as GreenstoneWellness.Store, partnered with Greenstone Rx (a 503A compounding pharmacy). Your marketing site mirrors the pharmacy storefront's exact framing: "Medicine, prescribed for you," 503A pharmacy, licensed in FL, physician-prescribed.

### Acceptable claims (mirroring Bloom)
- Licensed in FL
- 503A compounding pharmacy
- Physician-prescribed
- USP 797 sterile compounding
- Specialized temperature-controlled packaging *(NOT "free shipping" — Bloom uses this badge but it is incorrect per Pete; do not replicate)*
- "Suggestions only — your physician reviews and approves the final protocol before any medication ships." *(use verbatim wherever dosing is discussed)*

### Banned posture (do not surface anywhere)
- ❌ "Research use only"
- ❌ "Not for human consumption"
- ❌ "For educational purposes only"
- ❌ "For laboratory research purposes"
- ❌ Any claim that conflicts with the clinic / 503A framing — these belong to RUO peptide vendors (e.g., 73aminos.com), not to a licensed clinic

The "research use only" framing on the Greenstone Rx + Seventy3 Aminos co-branded flyer applies to the **B2B trade flyer audience** (clinics + prescribers reading about the partnership), not the patient-facing brand. 73aminos.com itself runs in RUO mode because it is a research-chemicals vendor — a fundamentally different operation from your clinic. You're already on the clinic side of that flyer.

## 8. Open items for tomorrow's unlock

| # | Action | Owner |
|---|---|---|
| 1 | Sync greenstonewellness.store catalog to the exact 11 medications in your Bloom formulary (3 weight-loss, 1 ED, 7 peptides) | Build |
| 2 | Sync prices to Bloom's "from $X" pricing on every card | Build |
| 3 | Verify every product CTA deep-links via `<PharmacyButton>` to the matching `/dtp/<clinic-id>/learn/<category>/<medication>` URL — not the storefront root | Build |
| 4 | Add flyer's trust grid to homepage: TELEHEALTH / COLD SHIPPING SAME DAY / QUALITY YOU CAN TRUST + "For Clinics / For Doctors / For Patients" supporting block | Build |
| 5 | Add small co-brand to footer: "Pharmacy partner: Greenstone Rx · 503A Compounding Pharmacy" | Build |
| 6 | Confirm with Pete whether "Dr. Luciano Kolodny" surfaces publicly on /about, or whether prescribing physician stays anonymous as "our licensed FL physician" | Pete |
| 7 | Flip `NEXT_PUBLIC_MAINTENANCE_MODE=false` in Netlify and redeploy | Build |

## Reference URLs

- Storefront root: `https://bloom.greenstonerx.com/dtp/6a0bb254fa53ddc1571c040b`
- Educational layout: `https://bloom.greenstonerx.com/dtp/6a0bb254fa53ddc1571c040b/learn`
- Category example: `…/learn/weight-loss`
- Product example: `…/learn/weight-loss/tirzepatide`
- Checkout: `…/checkout`
- Clinic dashboard: `https://bloom.greenstonerx.com/dashboard`
- Clinic store config: `https://bloom.greenstonerx.com/store`
