import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/db';
import { US_STATE_CODES } from '@/lib/us-states';
import { encryptCard, brandFromPan, type CardPayload } from '@/lib/order-crypto';

// Force Node runtime — we use node:crypto for AES-256-GCM.
export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

const PETE_EMAIL = 'pete@fluidfaithsolutions.com';

// `from` MUST use a domain verified in Resend. greenstonewellness.store is
// verified; gswellnesspharmacy.com is the new public domain but hasn't been
// added to Resend yet, and sends from unverified domains silently fail.
const INTERNAL_FROM = 'GS Wellness Orders <orders@greenstonewellness.store>';
const CUSTOMER_FROM = 'GS Wellness Pharmacy <orders@greenstonewellness.store>';
const SUPPORT_EMAIL = 'support@gswellnesspharmacy.com';

const DEEP_GREEN = '#1a3d2e';
const CREAM = '#f4efe6';
const BORDER_CREAM = '#e8e2d4';
const MUTED = '#7a8175';
const BODY = '#444';

const HEADER_FONT = "'Cormorant Garamond', Georgia, serif";
const BODY_FONT = 'Arial, sans-serif';
const MONO_FONT = 'Courier, monospace';

type YN = '' | 'yes' | 'no';

interface NewCardInput {
  kind: 'new';
  number?: string;
  expiry?: string;
  cvc?: string;
  cardholderName?: string;
  brand?: string;
}
interface SavedCardRef {
  kind: 'saved';
  id?: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

interface OrderPayload {
  productName?: string;
  productDose?: string;
  productSize?: string;
  productPrice?: number;
  subtotal?: number;
  shipping?: number;
  total?: number;

  sex?: 'male' | 'female' | '';
  heightFt?: string;
  heightIn?: string;
  weightLbs?: string;
  hasCancer?: YN;
  hasCancerDescribe?: string;
  hasThyroid?: YN;
  hasThyroidDescribe?: string;
  takingMeds?: YN;
  takingMedsDescribe?: string;
  firstTimePeptides?: YN;
  hasAllergies?: YN;
  hasAllergiesDescribe?: string;

  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;

  streetAddress?: string;
  aptSuite?: string;
  city?: string;
  state?: string;
  zip?: string;

  card?: NewCardInput | SavedCardRef;
  saveCard?: boolean;

  consentCompounding?: boolean;
  consentTelehealth?: boolean;
  consentHipaa?: boolean;
  consentTerms?: boolean;
}

function escape(s: unknown) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function makeRef() {
  // OOS- + 6 random uppercase alphanum chars from crypto.randomBytes
  const buf = randomBytes(6);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = 'OOS-';
  for (let i = 0; i < 6; i++) out += alphabet[buf[i] % alphabet.length];
  return out;
}

function ynLabel(v: YN | undefined) {
  if (v === 'yes') return 'YES';
  if (v === 'no') return 'no';
  return '—';
}

function row(label: string, value: string, highlight = false) {
  return `<tr>
    <td style="color:${MUTED};width:230px;padding:4px 0;vertical-align:top;">${label}</td>
    <td style="padding:4px 0;${highlight ? `color:${DEEP_GREEN};font-weight:600;` : ''}">${value}</td>
  </tr>`;
}

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function siteUrlFromReq(req: NextRequest): string {
  // Prefer the public site URL when explicitly configured; otherwise reconstruct
  // from the request host so local dev (localhost:3000) keeps working.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('host') || 'gswellnesspharmacy.com';
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const d = (await req.json()) as OrderPayload;

    // ---- Validation -----------------------------------------------------
    if (!d.fullName?.trim() || !d.email?.trim() || !d.phone?.trim() || !d.dob?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, phone, and date of birth are required.' },
        { status: 400 },
      );
    }
    if (!d.productName?.trim()) {
      return NextResponse.json({ error: 'Product is required.' }, { status: 400 });
    }
    if (!d.streetAddress?.trim() || !d.city?.trim() || !d.state?.trim() || !d.zip?.trim()) {
      return NextResponse.json({ error: 'Shipping address is required.' }, { status: 400 });
    }
    if (!US_STATE_CODES.includes(d.state.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid shipping state.' }, { status: 400 });
    }
    if (d.state.toUpperCase() === 'FL') {
      return NextResponse.json(
        { error: 'Florida customers should order directly at bloom.greenstonerx.com.' },
        { status: 400 },
      );
    }
    if (!d.sex || !d.heightFt || !d.heightIn || !d.weightLbs) {
      return NextResponse.json({ error: 'Please complete the health screening.' }, { status: 400 });
    }
    if (!d.consentCompounding || !d.consentTelehealth || !d.consentHipaa || !d.consentTerms) {
      return NextResponse.json({ error: 'All four consents are required.' }, { status: 400 });
    }
    if (!d.card || d.card.kind !== 'new') {
      return NextResponse.json(
        { error: 'Card details are required to place this order.' },
        { status: 400 },
      );
    }
    const cardIn = d.card;
    if (!cardIn.number || !cardIn.expiry || !cardIn.cvc || !cardIn.cardholderName) {
      return NextResponse.json({ error: 'Card details are incomplete.' }, { status: 400 });
    }

    const panDigits = cardIn.number.replace(/\D/g, '');
    if (panDigits.length < 13 || panDigits.length > 19) {
      return NextResponse.json({ error: 'Invalid card number.' }, { status: 400 });
    }
    const expMatch = /^(\d{2})\/(\d{2})$/.exec(cardIn.expiry);
    if (!expMatch) {
      return NextResponse.json({ error: 'Card expiry must be MM/YY.' }, { status: 400 });
    }
    const expMonth = parseInt(expMatch[1], 10);
    const expYear = 2000 + parseInt(expMatch[2], 10);
    if (expMonth < 1 || expMonth > 12) {
      return NextResponse.json({ error: 'Invalid expiry month.' }, { status: 400 });
    }
    if (!/^\d{3,4}$/.test(cardIn.cvc)) {
      return NextResponse.json({ error: 'Invalid CVC.' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    // Sync shipping_state on user_profiles silently (same behavior as before).
    try {
      const submittedState = d.state.toUpperCase();
      if (userId && US_STATE_CODES.includes(submittedState)) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('shipping_state')
          .eq('user_id', userId)
          .maybeSingle<{ shipping_state: string | null }>();
        if (profile?.shipping_state !== submittedState) {
          await supabaseAdmin
            .from('user_profiles')
            .update({
              shipping_state: submittedState,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
        }
      }
    } catch (e) {
      console.warn('[place-order] shipping_state sync failed', e);
    }

    // ---- Encrypt the card payload --------------------------------------
    const cardPayload: CardPayload = {
      pan: panDigits,
      cvc: cardIn.cvc,
      exp_month: expMonth,
      exp_year: expYear,
      cardholder: cardIn.cardholderName,
    };
    const enc = encryptCard(cardPayload);

    const brand = cardIn.brand || brandFromPan(panDigits);
    const last4 = panDigits.slice(-4);

    // Generate ref with collision retry — unique constraint on ref column.
    const ref = makeRef();

    // ---- Money in cents -------------------------------------------------
    const subtotalCents = Math.round((d.subtotal ?? 0) * 100);
    const shippingCents = Math.round((d.shipping ?? 25) * 100);
    const totalCents = Math.round((d.total ?? (d.subtotal ?? 0) + (d.shipping ?? 25)) * 100);

    // ---- Insert order ---------------------------------------------------
    const screening = {
      sex: d.sex,
      height_ft: d.heightFt,
      height_in: d.heightIn,
      weight_lbs: d.weightLbs,
      cancer: { answer: d.hasCancer || '', describe: d.hasCancerDescribe || '' },
      thyroid: { answer: d.hasThyroid || '', describe: d.hasThyroidDescribe || '' },
      medications: { answer: d.takingMeds || '', describe: d.takingMedsDescribe || '' },
      first_time_peptides: { answer: d.firstTimePeptides || '' },
      allergies: { answer: d.hasAllergies || '', describe: d.hasAllergiesDescribe || '' },
    };

    const consents = {
      compounding: !!d.consentCompounding,
      telehealth: !!d.consentTelehealth,
      hipaa: !!d.consentHipaa,
      terms: !!d.consentTerms,
    };

    const { data: insertRow, error: insertErr } = await supabaseAdmin
      .from('orders')
      .insert({
        ref,
        user_id: userId,
        status: 'awaiting_fulfillment',
        full_name: d.fullName,
        email: d.email,
        phone: d.phone,
        dob: d.dob,
        ship_street: d.streetAddress,
        ship_apt: d.aptSuite || null,
        ship_city: d.city,
        ship_state: d.state.toUpperCase(),
        ship_zip: d.zip,
        screening,
        product: d.productName || null,
        dose: d.productDose || null,
        size: d.productSize || null,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        consents,
        card_ciphertext: enc.ciphertext,
        card_iv: enc.iv,
        card_tag: enc.tag,
        card_brand: brand,
        card_last4: last4,
        card_exp_month: expMonth,
        card_exp_year: expYear,
      })
      .select('id, ref')
      .single();

    // Best-effort: wipe local references to the cleartext card payload now
    // that the encrypted blob is durably stored. Strings in JS are immutable
    // so this only nulls the reference; the GC will reclaim.
    cardPayload.pan = '';
    cardPayload.cvc = '';

    if (insertErr || !insertRow) {
      console.error('[place-order] orders insert failed', insertErr);
      return NextResponse.json({ error: 'Failed to save order.' }, { status: 500 });
    }

    // ---- Build notification emails (NO card details in either body) ----
    const siteUrl = siteUrlFromReq(req);
    const adminUrl = `${siteUrl}/admin/orders/${ref}`;

    const height = `${d.heightFt}'${d.heightIn}"`;
    const weight = `${d.weightLbs} lbs`;

    const internalHtml = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:${CREAM};font-family:${BODY_FONT};color:${BODY};">
  <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid ${BORDER_CREAM};">
    <div style="padding:24px 28px;background:${DEEP_GREEN};color:${CREAM};">
      <div style="font-family:${HEADER_FONT};font-size:24px;font-weight:500;letter-spacing:-0.01em;">
        New Order &middot; ${escape(ref)}
      </div>
      <div style="font-family:${MONO_FONT};font-size:11px;color:#a8c0b3;margin-top:6px;text-transform:uppercase;letter-spacing:0.08em;">
        Total ${dollars(totalCents)} &middot; Card details in admin only
      </div>
    </div>

    <div style="padding:24px 28px;">

      <div style="margin:0 0 24px;text-align:center;">
        <a href="${escape(adminUrl)}" style="display:inline-block;padding:14px 32px;background:${DEEP_GREEN};color:${CREAM};text-decoration:none;font-family:${MONO_FONT};font-size:12px;text-transform:uppercase;letter-spacing:0.12em;">
          Open order in admin &rarr;
        </a>
        <div style="margin-top:10px;font-size:11px;color:${MUTED};">
          Card details are <strong>not</strong> in this email. Reveal them on the admin page only when you're ready to enter them into Bloom.
        </div>
      </div>

      <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:0 0 8px;font-size:18px;">Product</h3>
      <div style="font-size:14px;line-height:1.6;margin-bottom:20px;">
        <strong>${escape(d.productName)}</strong>${d.productDose ? ' &middot; ' + escape(d.productDose) : ''}${d.productSize ? ' &middot; ' + escape(d.productSize) : ''}
        <br><span style="color:${MUTED};">Subtotal ${dollars(subtotalCents)} &middot; Shipping ${dollars(shippingCents)} &middot; Total ${dollars(totalCents)}</span>
      </div>

      <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:20px 0 8px;font-size:18px;">Customer</h3>
      <table style="width:100%;font-size:13px;line-height:1.6;margin-bottom:20px;border-collapse:collapse;">
        ${row('Name', escape(d.fullName))}
        ${row('Email', escape(d.email))}
        ${row('Phone', escape(d.phone))}
        ${row('DOB', escape(d.dob))}
      </table>

      <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:20px 0 8px;font-size:18px;">
        Ship-to address
      </h3>
      <div style="font-size:13px;line-height:1.7;margin-bottom:20px;font-family:${MONO_FONT};padding:12px;background:${CREAM};border-left:3px solid ${DEEP_GREEN};">
        ${escape(d.fullName)}<br>
        ${escape(d.streetAddress)}${d.aptSuite ? ', ' + escape(d.aptSuite) : ''}<br>
        ${escape(d.city)}, ${escape(d.state)} ${escape(d.zip)}
      </div>

      <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:20px 0 8px;font-size:18px;">Health screening</h3>
      <table style="width:100%;font-size:13px;line-height:1.6;margin-bottom:20px;border-collapse:collapse;">
        ${row('Biological sex', escape(d.sex).toUpperCase())}
        ${row('Height', escape(height))}
        ${row('Weight', escape(weight))}
        ${row('Cancer?', ynLabel(d.hasCancer) + (d.hasCancerDescribe ? ` &mdash; ${escape(d.hasCancerDescribe)}` : ''))}
        ${row('Thyroid?', ynLabel(d.hasThyroid) + (d.hasThyroidDescribe ? ` &mdash; ${escape(d.hasThyroidDescribe)}` : ''))}
        ${row('Medications?', ynLabel(d.takingMeds) + (d.takingMedsDescribe ? ` &mdash; ${escape(d.takingMedsDescribe)}` : ''))}
        ${row('First time peptides?', ynLabel(d.firstTimePeptides))}
        ${row('Allergies?', ynLabel(d.hasAllergies) + (d.hasAllergiesDescribe ? ` &mdash; ${escape(d.hasAllergiesDescribe)}` : ''))}
      </table>

      <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:20px 0 8px;font-size:18px;">Payment</h3>
      <div style="font-size:13px;line-height:1.7;margin-bottom:8px;font-family:${MONO_FONT};padding:12px;background:${CREAM};border-left:3px solid ${DEEP_GREEN};">
        ${escape(brand)} &middot; &bull;&bull;&bull;&bull; ${escape(last4)} &middot; exp ${String(expMonth).padStart(2, '0')}/${String(expYear).slice(-2)}<br>
        <span style="color:${MUTED};font-size:11px;">Full card details encrypted at rest &middot; reveal via admin only</span>
      </div>

      <div style="margin-top:24px;padding:14px 16px;background:${CREAM};border-left:3px solid ${DEEP_GREEN};font-size:12px;line-height:1.6;color:${BODY};">
        <strong>Workflow:</strong> open the admin link above &rarr; reveal card &rarr; enter into Bloom &rarr; mark fulfilled. Marking fulfilled purges the encrypted card blob.
      </div>

      <div style="margin-top:20px;font-size:11px;color:${MUTED};font-family:${MONO_FONT};text-transform:uppercase;letter-spacing:0.08em;">
        Ref ${escape(ref)}
      </div>
    </div>
  </div>
</body></html>`;

    // ---- Customer receipt (no card details) ----------------------------
    const firstName = (d.fullName || '').trim().split(/\s+/)[0] || 'there';
    const customerHtml = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:${CREAM};font-family:${BODY_FONT};color:${BODY};">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid ${BORDER_CREAM};">
    <div style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid ${BORDER_CREAM};">
      <img src="https://gswellnesspharmacy.com/logo.png" alt="GS Wellness Pharmacy" width="220" style="display:block;margin:0 auto;width:220px;max-width:220px;height:auto;border:0;outline:none;text-decoration:none;" />
    </div>
    <div style="padding:32px;">
      <h1 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};margin:0 0 16px;font-size:26px;font-weight:500;letter-spacing:-0.01em;">
        We received your order, ${escape(firstName)}.
      </h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BODY};">
        Thanks for choosing GS Wellness Pharmacy. We'll process your order within 24 hours
        through our licensed pharmacy partner.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BODY};">
        You'll get a second email with shipping confirmation and a tracking number once
        your medication leaves our fulfillment hub.
      </p>

      <div style="margin:28px 0;padding:18px 20px;background:${CREAM};border-left:3px solid ${DEEP_GREEN};">
        <div style="font-family:${MONO_FONT};font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Order reference</div>
        <div style="font-family:${MONO_FONT};font-size:18px;color:${DEEP_GREEN};letter-spacing:0.05em;">${escape(ref)}</div>
        <div style="font-size:14px;line-height:1.6;margin-top:12px;">
          <strong>${escape(d.productName)}</strong>${d.productDose ? ' &middot; ' + escape(d.productDose) : ''}${d.productSize ? ' &middot; ' + escape(d.productSize) : ''}
        </div>
        <table style="width:100%;font-size:13px;line-height:1.6;margin-top:14px;border-collapse:collapse;">
          <tr><td style="color:${MUTED};padding:2px 0;">Subtotal</td><td style="text-align:right;">${dollars(subtotalCents)}</td></tr>
          <tr><td style="color:${MUTED};padding:2px 0;">Shipping</td><td style="text-align:right;">${dollars(shippingCents)}</td></tr>
          <tr><td style="padding:6px 0 0;border-top:1px solid ${BORDER_CREAM};"><strong>Total</strong></td><td style="text-align:right;padding:6px 0 0;border-top:1px solid ${BORDER_CREAM};"><strong>${dollars(totalCents)}</strong></td></tr>
        </table>
      </div>

      <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:${MUTED};">
        Questions? Reply to this email or write to
        <a href="mailto:${SUPPORT_EMAIL}" style="color:${DEEP_GREEN};text-decoration:underline;">${SUPPORT_EMAIL}</a>.
      </p>
    </div>
    <div style="padding:18px 32px;background:${CREAM};border-top:1px solid ${BORDER_CREAM};font-size:11px;color:${MUTED};text-align:center;font-family:${MONO_FONT};text-transform:uppercase;letter-spacing:0.08em;">
      GS Wellness Pharmacy &middot; Florida 503A Compounding Partner
    </div>
  </div>
</body></html>`;

    // Send emails. If Resend is not configured or the send fails, we still
    // return success — the order is durably saved and Pete can fulfill from
    // the admin index even without an email notification.
    if (process.env.RESEND_API_KEY) {
      // Resend SDK returns { data, error } and does NOT throw on API errors,
      // so a try/catch alone misses unverified-domain rejections. Inspect
      // each response explicitly and log so we can see failures in the
      // server log. Order is already saved — mail failures never block it.
      try {
        const [internalRes, customerRes] = await Promise.all([
          resend.emails.send({
            from: INTERNAL_FROM,
            to: PETE_EMAIL,
            subject: `New order — ${ref} — ${dollars(totalCents)}`,
            html: internalHtml,
          }),
          resend.emails.send({
            from: CUSTOMER_FROM,
            to: d.email!,
            subject: `We received your order — ${ref}`,
            html: customerHtml,
          }),
        ]);
        if (internalRes.error) {
          console.warn('[place-order] internal email failed:', ref, internalRes.error);
        }
        if (customerRes.error) {
          console.warn('[place-order] customer email failed:', ref, customerRes.error);
        }
      } catch (mailErr) {
        console.warn('[place-order] resend threw (order still saved)', mailErr);
      }
    } else {
      console.warn('[place-order] RESEND_API_KEY not set — emails skipped. Ref:', ref);
    }

    return NextResponse.json({ ok: true, ref });
  } catch (e) {
    console.error('[place-order] error:', e);
    return NextResponse.json(
      { error: 'Failed to submit order. Please try again or email support@gswellnesspharmacy.com.' },
      { status: 500 },
    );
  }
}
