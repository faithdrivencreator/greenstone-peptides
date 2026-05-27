import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PETE_EMAIL = 'pete@fluidfaithsolutions.com';
const ORDERS_FROM = 'GS Wellness Pharmacy <orders@gswellnesspharmacy.com>';
const CONTACT_FROM = 'Greenstone Pharmacy <contact@gswellnesspharmacy.com>';
const SUPPORT_EMAIL = 'support@gswellnesspharmacy.com';

// Storefront brand tokens (email-design-system.md)
const DEEP_GREEN = '#1a3d2e';
const CREAM = '#f4efe6';
const BORDER_CREAM = '#e8e2d4';
const MUTED = '#7a8175';
const BODY = '#444';

const HEADER_FONT = "'Cormorant Garamond', Georgia, serif";
const BODY_FONT = 'Arial, sans-serif';
const MONO_FONT = 'Courier, monospace';

const FDA_DISCLAIMER =
  'Compounded medications are prepared by a licensed 503A pharmacy pursuant to a valid prescription. They are not FDA-approved drug products. Individual results may vary.';

function makeRef() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function escape(s: unknown) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface RequestItem {
  productId?: string;
  productName?: string;
  productSlug?: string;
  productStrength?: string;
  productSize?: string;
  productFormat?: string;
  productCategory?: string;
  productPrice?: number;
  quantity?: number;
  reasonLabel?: string;
  reasonText?: string;
}

interface IncomingBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  globalNotes?: string;
  items?: RequestItem[];
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as IncomingBody;

    const firstName = (data.firstName || '').trim();
    const lastName = (data.lastName || '').trim();
    const email = (data.email || '').trim();
    const phone = (data.phone || '').trim();
    const globalNotes = (data.globalNotes || '').trim();
    const rawItems = Array.isArray(data.items) ? data.items : [];

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields (first name, last name, email).' },
        { status: 400 },
      );
    }
    if (rawItems.length === 0) {
      return NextResponse.json(
        { error: 'Add at least one product to the request.' },
        { status: 400 },
      );
    }

    const items = rawItems.map((i) => ({
      productName: (i.productName || '').trim() || 'Unknown product',
      productSlug: (i.productSlug || '').trim(),
      productStrength: (i.productStrength || '').trim(),
      productSize: (i.productSize || '').trim(),
      productFormat: (i.productFormat || '').trim(),
      productCategory: (i.productCategory || '').trim(),
      productPrice: typeof i.productPrice === 'number' ? i.productPrice : undefined,
      quantity: Math.max(1, Math.min(10, Number(i.quantity) || 1)),
      reasonLabel: (i.reasonLabel || '').trim(),
      reasonText: (i.reasonText || '').trim(),
    }));

    const reference = makeRef();
    const fullName = `${firstName} ${lastName}`.trim();

    const subtotal = items.reduce(
      (sum, i) => sum + (i.productPrice ?? 0) * i.quantity,
      0,
    );
    const subtotalLine = subtotal > 0 ? `$${subtotal.toFixed(0)}` : '';

    function variantOf(i: typeof items[number]) {
      return [i.productStrength, i.productSize, i.productFormat].filter(Boolean).join(' · ');
    }

    // ─── Internal — Pete review ───────────────────────────────────────
    const internalItemsHtml = items
      .map((i) => {
        const variant = variantOf(i);
        const lineTotal =
          i.productPrice !== undefined
            ? ` · subtotal $${(i.productPrice * i.quantity).toFixed(0)}`
            : '';
        return `
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid ${BORDER_CREAM};vertical-align:top;">
              <div style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:17px;line-height:1.2;">${escape(i.productName)}</div>
              ${variant ? `<div style="font-family:${BODY_FONT};color:${MUTED};font-size:12px;margin-top:3px;">${escape(variant)}</div>` : ''}
              ${i.productCategory ? `<div style="font-family:${BODY_FONT};color:${MUTED};font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">${escape(i.productCategory)}</div>` : ''}
              ${i.productSlug ? `<div style="font-family:${BODY_FONT};font-size:11px;margin-top:6px;"><a href="https://gswellnesspharmacy.com/shop/${escape(i.productSlug)}" style="color:${DEEP_GREEN};">/shop/${escape(i.productSlug)}</a></div>` : ''}
            </td>
            <td style="padding:12px 14px;border-bottom:1px solid ${BORDER_CREAM};vertical-align:top;text-align:right;font-family:${BODY_FONT};color:${BODY};font-size:13px;white-space:nowrap;">
              <strong>Qty ${i.quantity}</strong>${i.productPrice !== undefined ? `<br/><span style="color:${MUTED};font-size:12px;">$${i.productPrice.toFixed(0)} ea${lineTotal}</span>` : ''}
            </td>
          </tr>
          ${i.reasonLabel || i.reasonText ? `
          <tr>
            <td colspan="2" style="padding:0 14px 14px;border-bottom:1px solid ${BORDER_CREAM};background:#fff;">
              ${i.reasonLabel ? `<div style="font-family:${BODY_FONT};color:${MUTED};font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Reason: ${escape(i.reasonLabel)}</div>` : ''}
              ${i.reasonText ? `<div style="font-family:${BODY_FONT};color:${BODY};font-size:13px;line-height:1.5;white-space:pre-wrap;">${escape(i.reasonText)}</div>` : ''}
            </td>
          </tr>` : ''}
        `;
      })
      .join('');

    const internalHtml = `
<!doctype html>
<html><body style="margin:0;padding:0;background:${CREAM};font-family:${BODY_FONT};color:${BODY};">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid ${BORDER_CREAM};">
      <div style="font-family:${HEADER_FONT};font-size:28px;color:${DEEP_GREEN};letter-spacing:0.5px;">GS Wellness Pharmacy</div>
      <div style="font-family:${BODY_FONT};font-size:11px;color:${MUTED};letter-spacing:3px;text-transform:uppercase;margin-top:4px;">New Prescription Request</div>
    </div>

    <h2 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:22px;margin:24px 0 6px;">${items.length} item${items.length === 1 ? '' : 's'} · ${escape(fullName)}</h2>
    <p style="font-family:${BODY_FONT};color:${MUTED};font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:0 0 16px;">Reference #${reference}${subtotalLine ? ` · est. ${subtotalLine}` : ''}</p>

    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid ${BORDER_CREAM};margin:8px 0 24px;">
      ${internalItemsHtml}
    </table>

    <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:18px;margin:20px 0 6px;">Customer</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;width:140px;">Name</td><td style="padding:6px 0;color:${BODY};font-size:13px;"><strong>${escape(fullName)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;"><a href="mailto:${escape(email)}" style="color:${DEEP_GREEN};">${escape(email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:${MUTED};font-size:13px;">Phone</td><td style="padding:6px 0;color:${BODY};font-size:13px;">${phone ? escape(phone) : `<span style="color:${MUTED};">not provided</span>`}</td></tr>
    </table>

    ${globalNotes ? `
    <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:18px;margin:20px 0 6px;">Notes from customer</h3>
    <p style="background:#fff;border-left:3px solid ${DEEP_GREEN};padding:12px 14px;margin:0;color:${BODY};font-size:14px;white-space:pre-wrap;">${escape(globalNotes)}</p>
    ` : ''}

    <div style="background:${DEEP_GREEN};color:${CREAM};padding:16px 20px;margin-top:24px;text-align:center;font-family:${MONO_FONT};font-size:12px;letter-spacing:2px;text-transform:uppercase;">
      Action: review &amp; reply with payment link within 24 hours
    </div>

    <p style="margin-top:24px;text-align:center;">
      <a href="mailto:${escape(email)}?subject=${encodeURIComponent('Your Greenstone prescription request #' + reference)}" style="display:inline-block;background:${DEEP_GREEN};color:${CREAM};padding:12px 24px;text-decoration:none;font-family:${BODY_FONT};font-size:13px;letter-spacing:1px;text-transform:uppercase;">Reply to ${escape(firstName)}</a>
    </p>

    <p style="text-align:center;color:${MUTED};font-size:11px;margin-top:32px;">
      ${FDA_DISCLAIMER}
    </p>
  </div>
</body></html>`;

    // ─── Customer confirmation ────────────────────────────────────────
    const customerItemsHtml = items
      .map((i) => {
        const variant = variantOf(i);
        return `
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid ${BORDER_CREAM};vertical-align:top;">
              <div style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:17px;line-height:1.2;">${escape(i.productName)}</div>
              ${variant ? `<div style="font-family:${BODY_FONT};color:${MUTED};font-size:12px;margin-top:3px;">${escape(variant)}</div>` : ''}
              ${i.reasonLabel ? `<div style="font-family:${BODY_FONT};color:${MUTED};font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-top:6px;">For: ${escape(i.reasonLabel)}</div>` : ''}
            </td>
            <td style="padding:12px 14px;border-bottom:1px solid ${BORDER_CREAM};text-align:right;font-family:${BODY_FONT};color:${BODY};font-size:13px;white-space:nowrap;">Qty ${i.quantity}</td>
          </tr>`;
      })
      .join('');

    const customerHtml = `
<!doctype html>
<html><body style="margin:0;padding:0;background:${CREAM};font-family:${BODY_FONT};color:${BODY};">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid ${BORDER_CREAM};">
      <div style="font-family:${HEADER_FONT};font-size:32px;color:${DEEP_GREEN};letter-spacing:0.5px;">GS Wellness Pharmacy</div>
      <div style="font-family:${BODY_FONT};font-size:11px;color:${MUTED};letter-spacing:3px;text-transform:uppercase;margin-top:6px;">USA-Compounded Peptide Therapy</div>
    </div>

    <h1 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:26px;margin:28px 0 12px;">We received your request, ${escape(firstName)}.</h1>

    <p style="font-family:${BODY_FONT};color:${BODY};font-size:15px;line-height:1.6;margin:0 0 14px;">
      Thank you for choosing GS Wellness Pharmacy. Your prescription request has been forwarded to our pharmacy team for review.
    </p>

    <p style="font-family:${BODY_FONT};color:${BODY};font-size:15px;line-height:1.6;margin:0 0 14px;">
      A pharmacist will review your request and reply within <strong>24 hours</strong> with confirmation, dosing notes, and a secure payment link to complete your order. Once payment is received, your formulation enters our compounding queue (5&ndash;7 business days) before shipping in temperature-controlled packaging.
    </p>

    <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:18px;margin:24px 0 8px;">Your request <span style="font-family:${MONO_FONT};font-size:13px;color:${MUTED};letter-spacing:1px;">#${reference}</span></h3>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid ${BORDER_CREAM};">
      ${customerItemsHtml}
    </table>

    <h3 style="font-family:${HEADER_FONT};color:${DEEP_GREEN};font-size:18px;margin:24px 0 8px;">What happens next</h3>
    <ol style="font-family:${BODY_FONT};color:${BODY};font-size:14px;line-height:1.7;padding-left:20px;margin:0 0 18px;">
      <li>Pharmacist review (within 24 hours)</li>
      <li>You receive a confirmation email with a secure payment link</li>
      <li>Compounding begins after payment (5&ndash;7 business days)</li>
      <li>Temperature-controlled shipping (3&ndash;5 business days)</li>
    </ol>

    <div style="background:${DEEP_GREEN};color:${CREAM};padding:18px 20px;margin:24px 0;text-align:center;">
      <div style="font-family:${BODY_FONT};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${CREAM};opacity:0.7;margin-bottom:6px;">Questions in the meantime?</div>
      <a href="mailto:${SUPPORT_EMAIL}" style="font-family:${HEADER_FONT};font-size:20px;color:${CREAM};text-decoration:none;">${SUPPORT_EMAIL}</a>
    </div>

    <p style="font-family:${BODY_FONT};color:${MUTED};font-size:12px;line-height:1.6;margin:24px 0 0;text-align:center;">
      ${FDA_DISCLAIMER}
    </p>

    <p style="text-align:center;margin-top:20px;">
      <a href="https://gswellnesspharmacy.com" style="font-family:${BODY_FONT};color:${MUTED};font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">gswellnesspharmacy.com</a>
    </p>
  </div>
</body></html>`;

    const productNames = items.map((i) => i.productName).join(' + ');
    const productNamesShort =
      productNames.length > 80 ? `${items.length} items` : productNames;

    const [internalRes, customerRes] = await Promise.allSettled([
      resend.emails.send({
        from: CONTACT_FROM,
        to: PETE_EMAIL,
        subject: `Prescription request, ${productNamesShort}, ${fullName} (#${reference})`,
        html: internalHtml,
        replyTo: email,
      }),
      resend.emails.send({
        from: ORDERS_FROM,
        to: email,
        subject: `We received your Greenstone prescription request — #${reference}`,
        html: customerHtml,
        replyTo: SUPPORT_EMAIL,
      }),
    ]);

    if (internalRes.status === 'rejected') {
      console.error('[prescription-request] internal email failed:', internalRes.reason);
    }
    if (customerRes.status === 'rejected') {
      console.error('[prescription-request] customer email failed:', customerRes.reason);
    }

    if (internalRes.status === 'rejected' && customerRes.status === 'rejected') {
      return NextResponse.json(
        {
          error:
            'Unable to submit your request right now. Please email support@gswellnesspharmacy.com.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error('[prescription-request] Error:', err);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
