/**
 * Branded shipping notification email for Greenstone orders.
 * Called from /api/admin/send-shipping when Pete enters tracking info.
 */

const SITE_URL = 'https://gswellnesspharmacy.com';
const SUPPORT_EMAIL = 'support@gswellnesspharmacy.com';

const CARRIER_TRACKING_URLS: Record<string, (tracking: string) => string> = {
  USPS: (t) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(t)}`,
  UPS: (t) => `https://www.ups.com/track?tracknum=${encodeURIComponent(t)}`,
  FedEx: (t) => `https://www.fedex.com/fedextrack/?tracknumbers=${encodeURIComponent(t)}`,
  DHL: (t) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(t)}`,
};

export type CarrierName = 'USPS' | 'UPS' | 'FedEx' | 'DHL' | 'Other';

export interface ShippingEmailInput {
  customerEmail: string;
  customerFirstName: string | null;
  orderRef: string; // order reference ID, uppercase
  trackingNumber: string;
  carrier: CarrierName;
  expectedDelivery?: string; // ISO date string or display text
  customNote?: string;
}

export function buildTrackingUrl(carrier: CarrierName, tracking: string): string | null {
  const fn = CARRIER_TRACKING_URLS[carrier];
  return fn ? fn(tracking) : null;
}

export function renderShippingEmail(input: ShippingEmailInput): { subject: string; html: string } {
  const greetingName = input.customerFirstName ? `, ${input.customerFirstName}` : '';
  const trackingUrl = buildTrackingUrl(input.carrier, input.trackingNumber);

  const subject = `Your Greenstone order has shipped, #${input.orderRef}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Greenstone</title></head>
<body style="margin:0;padding:0;background:#0D1117;color:#F5F1EB">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Your Greenstone order is on its way, tracking inside.</div>
<div style="background:#0D1117;padding:40px 16px">
  <div style="max-width:600px;margin:0 auto;background:#161C26;border:1px solid #1E2738">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      <tr><td align="center" style="padding:24px 0 16px 0;background:#F5F1EB;">
        <img src="https://gswellnesspharmacy.com/logo.png" alt="GS Wellness Pharmacy" width="220" style="display:block;width:220px;max-width:220px;height:auto;border:0;outline:none;text-decoration:none;" />
      </td></tr>
    </table>
    <div style="padding:48px 36px">
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1E2738;margin-bottom:36px">
      <a href="${SITE_URL}" style="text-decoration:none">
        <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:36px;font-weight:400;letter-spacing:0.18em;color:#F5F1EB;margin:0 0 6px">GREENSTONE</h1>
        <p style="color:#C9A96E;font-family:'DM Sans',-apple-system,sans-serif;font-size:10px;letter-spacing:0.4em;margin:0">WELLNESS</p>
      </a>
    </div>

    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:#F5F1EB;font-weight:400;margin:0 0 12px">Your order is on its way${greetingName}.</h2>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 28px;font-family:'DM Sans',-apple-system,sans-serif">Order <strong style="color:#C9A96E">#${input.orderRef}</strong> shipped via <strong style="color:#1A9E6E">${input.carrier}</strong>. Tracking details below.</p>

    <div style="background:#0D1117;border:1px solid #1A9E6E;padding:28px 24px;margin:24px 0">
      <p style="margin:0 0 8px;color:#8A6E3E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">TRACKING NUMBER</p>
      <p style="margin:0;font-family:'IBM Plex Mono','SF Mono',Consolas,monospace;font-size:22px;letter-spacing:0.1em;color:#F5F1EB;word-break:break-all">${input.trackingNumber}</p>
      <p style="margin:8px 0 0;color:#1A9E6E;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif">${input.carrier}</p>
    </div>

    ${trackingUrl ? `
    <p style="text-align:center;margin:28px 0">
      <a href="${trackingUrl}" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:14px 36px;text-decoration:none;letter-spacing:0.2em;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">TRACK YOUR ORDER →</a>
    </p>` : ''}

    ${input.expectedDelivery ? `
    <table style="width:100%;margin:24px 0;font-family:'DM Sans',-apple-system,sans-serif;border-collapse:collapse">
      <tr><td style="color:#8A6E3E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;padding:6px 0">Expected delivery</td><td style="text-align:right;color:#F5F1EB;font-weight:500">${input.expectedDelivery}</td></tr>
    </table>` : ''}

    ${input.customNote ? `
    <div style="background:#1E2738;padding:20px 24px;margin:28px 0;border-left:3px solid #C9A96E">
      <p style="margin:0;color:#B8B2A8;line-height:1.6;font-family:'DM Sans',-apple-system,sans-serif">${input.customNote}</p>
    </div>` : ''}

    <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#F5F1EB;font-weight:400;margin:40px 0 12px">What to do when it arrives</h3>
    <table style="width:100%;border-collapse:collapse;font-family:'DM Sans',-apple-system,sans-serif">
      <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">Refrigerate temperature-sensitive peptides immediately on arrival.</td></tr>
      <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">Store it properly and reach out if you have any questions.</td></tr>
      <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">Questions about storage or handling? <a href="${SITE_URL}/safety" style="color:#C9A96E;text-decoration:none;border-bottom:1px solid #8A6E3E">Safety guide</a></td></tr>
    </table>

    <p style="color:#B8B2A8;line-height:1.7;margin:36px 0 8px;font-family:'DM Sans',-apple-system,sans-serif">Anything unexpected? Reply to this email or write us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#C9A96E;text-decoration:none;border-bottom:1px solid #8A6E3E">${SUPPORT_EMAIL}</a>.</p>

    <hr style="border:none;border-top:1px solid #1E2738;margin:32px 0 20px">
    <p style="text-align:center;color:#8A6E3E;font-size:10px;letter-spacing:0.25em;margin:0;font-family:'DM Sans',-apple-system,sans-serif">
      <a href="${SITE_URL}" style="color:#8A6E3E;text-decoration:none">GREENSTONE WELLNESS</a>
    </p>
    </div>
  </div>
</div>
</body></html>`;

  return { subject, html };
}
