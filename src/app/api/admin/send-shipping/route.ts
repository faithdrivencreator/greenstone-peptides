/**
 * Admin endpoint, fires the branded shipping notification to a customer.
 *
 * Auth: HTTP header `Authorization: Bearer <ADMIN_PASSWORD>` OR `password` field in body.
 * Both Pete-facing UIs use the body field; the header is for curl/Postman.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderShippingEmail, type CarrierName } from '@/lib/shipping-email';

const resend = new Resend(process.env.RESEND_API_KEY);
const ORDERS_FROM = 'Greenstone Wellness <orders@gswellnesspharmacy.com>';
const SUPPORT_EMAIL = 'support@gswellnesspharmacy.com';

interface ShippingPayload {
  password: string;
  customerEmail: string;
  customerFirstName?: string;
  orderRef: string;
  trackingNumber: string;
  carrier: CarrierName;
  expectedDelivery?: string;
  customNote?: string;
}

function authorize(req: NextRequest, body: ShippingPayload): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const headerAuth = req.headers.get('authorization');
  if (headerAuth === `Bearer ${expected}`) return true;
  if (body.password === expected) return true;
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ShippingPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!authorize(req, body)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate required fields
  const required: (keyof ShippingPayload)[] = ['customerEmail', 'orderRef', 'trackingNumber', 'carrier'];
  for (const f of required) {
    if (!body[f]) {
      return NextResponse.json({ error: `Missing required field: ${f}` }, { status: 400 });
    }
  }

  const validCarriers: CarrierName[] = ['USPS', 'UPS', 'FedEx', 'DHL', 'Other'];
  if (!validCarriers.includes(body.carrier)) {
    return NextResponse.json({ error: 'Invalid carrier' }, { status: 400 });
  }

  // Render email
  const { subject, html } = renderShippingEmail({
    customerEmail: body.customerEmail,
    customerFirstName: body.customerFirstName ?? null,
    orderRef: body.orderRef.toUpperCase(),
    trackingNumber: body.trackingNumber.trim(),
    carrier: body.carrier,
    expectedDelivery: body.expectedDelivery,
    customNote: body.customNote,
  });

  // Send via Resend
  try {
    const sent = await resend.emails.send({
      from: ORDERS_FROM,
      to: body.customerEmail,
      replyTo: SUPPORT_EMAIL,
      subject,
      html,
    });
    console.log('[Admin Shipping] Sent to', body.customerEmail, 'tracking', body.trackingNumber, 'id', sent.data?.id);

    return NextResponse.json({ ok: true, emailId: sent.data?.id });
  } catch (err) {
    console.error('[Admin Shipping] Resend send failed:', err);
    return NextResponse.json({ error: 'Failed to send email', detail: String(err) }, { status: 500 });
  }
}
