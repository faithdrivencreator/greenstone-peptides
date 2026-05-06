import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PETE_EMAIL = 'pete@fluidfaithsolutions.com';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { firstName, lastName, businessName, email, state, monthlyVolume, notes } = data;

    if (!firstName || !lastName || !businessName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Greenstone Wholesale <wholesale@greenstonewellness.store>',
      to: PETE_EMAIL,
      subject: `Wholesale Inquiry — ${businessName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0a0f1a;border-bottom:2px solid #1a9e6e;padding-bottom:8px">New Wholesale Inquiry</h2>
          <table style="width:100%;margin:16px 0">
            <tr><td style="color:#666;padding:6px 0">Name</td><td><strong>${firstName} ${lastName}</strong></td></tr>
            <tr><td style="color:#666;padding:6px 0">Business</td><td><strong>${businessName}</strong></td></tr>
            <tr><td style="color:#666;padding:6px 0">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="color:#666;padding:6px 0">State</td><td>${state || 'Not specified'}</td></tr>
            <tr><td style="color:#666;padding:6px 0">Monthly Volume</td><td>${monthlyVolume || 'Not specified'}</td></tr>
          </table>
          ${notes ? `<h3 style="color:#0a0f1a">Notes</h3><p style="background:#f5f5f5;padding:12px;border-left:3px solid #1a9e6e">${notes}</p>` : ''}
          <p style="margin-top:20px"><a href="mailto:${email}" style="background:#1a9e6e;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block">Reply to ${firstName} →</a></p>
        </div>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Wholesale Inquiry] Error:', err);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
