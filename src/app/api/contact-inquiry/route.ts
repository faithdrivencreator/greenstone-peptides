import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PETE_EMAIL = 'pete@fluidfaithsolutions.com';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, topic, message } = data;

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Greenstone Contact <contact@greenstonewellness.store>',
      to: PETE_EMAIL,
      subject: `Contact Form — ${topic} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0a0f1a;border-bottom:2px solid #1a9e6e;padding-bottom:8px">New Contact Form Submission</h2>
          <table style="width:100%;margin:16px 0">
            <tr><td style="color:#666;padding:6px 0">Topic</td><td><strong>${topic}</strong></td></tr>
            <tr><td style="color:#666;padding:6px 0">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="color:#666;padding:6px 0">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="color:#666;padding:6px 0">Phone</td><td>${phone || 'Not provided'}</td></tr>
          </table>
          <h3 style="color:#0a0f1a">Message</h3>
          <p style="background:#f5f5f5;padding:12px;border-left:3px solid #1a9e6e;white-space:pre-wrap">${message}</p>
          <p style="margin-top:20px"><a href="mailto:${email}" style="background:#1a9e6e;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block">Reply to ${name} →</a></p>
        </div>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact Inquiry] Error:', err);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
