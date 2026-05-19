import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'pete@fluidfaithsolutions.com';

export async function sendWelcomeEmail({ to, name }: { to: string; name?: string | null }) {
  if (!resend) {
    console.warn('[auth-emails] RESEND_API_KEY missing — skipping welcome email');
    return;
  }

  const greeting = name ? `Welcome, ${name}.` : 'Welcome to Greenstone Wellness.';

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#0a0e0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e8e3d6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0e0d;">
    <tr><td align="center" style="padding:48px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#101714;border:1px solid rgba(196,164,107,0.18);">
        <tr><td style="padding:40px 40px 24px 40px;border-bottom:1px solid rgba(196,164,107,0.12);">
          <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#5db89a;font-family:'IBM Plex Mono',Menlo,monospace;">// Account confirmed</p>
          <h1 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:32px;line-height:1.15;color:#f4eedd;">${greeting}</h1>
        </td></tr>
        <tr><td style="padding:28px 40px;font-size:15px;line-height:1.65;color:#cfc8b3;">
          <p style="margin:0 0 16px 0;">Your account is active. You can now browse the full catalog and submit a prescription request.</p>
          <p style="margin:0 0 24px 0;">All Greenstone Wellness products are compounded in the USA under USP 797 sterile standards and sold strictly for research and educational use only.</p>
          <p style="margin:0;">
            <a href="${SITE_URL}/shop" style="display:inline-block;background:#5db89a;color:#0a0e0d;text-decoration:none;padding:14px 28px;font-family:'IBM Plex Mono',Menlo,monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;">Browse catalog &rarr;</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid rgba(196,164,107,0.12);font-family:'IBM Plex Mono',Menlo,monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#8d8773;">
          Greenstone Wellness &middot; ${SITE_URL.replace('https://', '')}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Greenstone Wellness <hello@greenstonewellness.store>',
      to,
      subject: 'Welcome to Greenstone Wellness',
      html,
      replyTo: 'support@greenstonewellness.store',
    });
  } catch (err) {
    console.error('[auth-emails] welcome send failed', err);
  }
}

type SignupNotificationInput = {
  email: string;
  fullName?: string | null;
  dateOfBirth: string;
  ip?: string | null;
  userAgent?: string | null;
};

/**
 * Internal alert to Pete every time a new account is created.
 * Plain, scannable, mobile-friendly — designed for the mailbox glance.
 */
export async function sendSignupNotification(input: SignupNotificationInput) {
  if (!resend) {
    console.warn('[auth-emails] RESEND_API_KEY missing — skipping admin signup notification');
    return;
  }

  const { email, fullName, dateOfBirth, ip, userAgent } = input;
  const when = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#0a0e0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e8e3d6;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0e0d;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#101714;border:1px solid rgba(196,164,107,0.18);">
        <tr><td style="padding:32px 32px 16px 32px;border-bottom:1px solid rgba(196,164,107,0.12);">
          <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#5db89a;font-family:'IBM Plex Mono',Menlo,monospace;">// New signup</p>
          <h1 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:24px;line-height:1.2;color:#f4eedd;">${fullName ? escapeHtml(fullName) : 'New account'}</h1>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:13px;color:#cfc8b3;font-family:'IBM Plex Mono',Menlo,monospace;">
            <tr><td style="padding:4px 0;width:120px;color:#8d8773;">Email</td><td style="padding:4px 0;color:#f4eedd;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:4px 0;color:#8d8773;">Name</td><td style="padding:4px 0;">${fullName ? escapeHtml(fullName) : '—'}</td></tr>
            <tr><td style="padding:4px 0;color:#8d8773;">DOB</td><td style="padding:4px 0;">${escapeHtml(dateOfBirth)}</td></tr>
            <tr><td style="padding:4px 0;color:#8d8773;">When (ET)</td><td style="padding:4px 0;">${escapeHtml(when)}</td></tr>
            <tr><td style="padding:4px 0;color:#8d8773;">IP</td><td style="padding:4px 0;">${ip ? escapeHtml(ip) : '—'}</td></tr>
            ${userAgent ? `<tr><td style="padding:4px 0;color:#8d8773;vertical-align:top;">UA</td><td style="padding:4px 0;font-size:11px;line-height:1.5;color:#a89f8b;word-break:break-all;">${escapeHtml(userAgent)}</td></tr>` : ''}
          </table>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(196,164,107,0.12);font-family:'IBM Plex Mono',Menlo,monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#8d8773;">
          Greenstone Wellness · admin alert
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Greenstone Signups <hello@greenstonewellness.store>',
      to: ADMIN_NOTIFY_EMAIL,
      subject: `New signup: ${fullName || email}`,
      html,
      replyTo: email,
    });
  } catch (err) {
    console.error('[auth-emails] admin notification send failed', err);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
