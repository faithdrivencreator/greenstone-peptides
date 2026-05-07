import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@greenstonewellness.store';
const FROM_HEADER = `Greenstone Peptides <${FROM_EMAIL}>`;

type Ebook = 'made-easy' | 'unlocked';

interface SubscribeRequestBody {
  email: string;
  ebook: Ebook;
  firstName?: string;
  source?: string;
}

interface EbookConfig {
  filename: string;
  title: string;
  subject: string;
  intro: string;
  discountCode: string;
  discountLabel: string;
  coverImage: string;
}

const EBOOKS: Record<Ebook, EbookConfig> = {
  'made-easy': {
    filename: 'greenstone-peptides-made-easy.pdf',
    title: 'Peptides Made Easy',
    subject: 'Your free Greenstone guide is here — Peptides Made Easy',
    intro:
      "Welcome — and thank you for downloading <em>Peptides Made Easy</em>. This is the same plain-language explainer we share with first-time customers and curious researchers who want a clear, honest starting point.",
    discountCode: 'WELCOME10',
    discountLabel: '10% off your first order',
    coverImage: '/images/ebook-covers/peptides-made-easy-cover.jpg',
  },
  unlocked: {
    filename: 'greenstone-peptides-unlocked.pdf',
    title: 'Peptides Unlocked',
    subject: 'Your Greenstone Volume II guide is ready — Peptides Unlocked',
    intro:
      "Welcome to Volume II. <em>Peptides Unlocked</em> goes deeper — matching peptide families to research goals, and walking through the quality and sourcing checks worth running before any protocol.",
    discountCode: 'RESEARCH15',
    discountLabel: '15% off your next order',
    coverImage: '/images/ebook-covers/peptides-unlocked-cover.jpg',
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  if (email.length < 5 || email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

function isEbook(value: unknown): value is Ebook {
  return value === 'made-easy' || value === 'unlocked';
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';
}

function buildEmailHtml(config: EbookConfig, firstName: string | undefined, downloadUrl: string): string {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi there,';
  const coverUrl = `${siteUrl()}${config.coverImage}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(config.title)} — Greenstone Peptides</title>
</head>
<body style="margin:0;padding:0;background-color:#0D1117;font-family:Georgia,'Times New Roman',serif;color:#F5F1EB;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0D1117;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#161C26;border:1px solid #1E2738;">
          <tr>
            <td style="background-color:#1A9E6E;height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px 32px;text-align:center;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A96E;">Greenstone Peptides</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0 32px;text-align:center;">
              <img src="${coverUrl}" alt="${escapeHtml(config.title)} cover" width="200" style="display:inline-block;width:200px;max-width:60%;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0 32px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;color:#F5F1EB;font-weight:normal;">
                Your guide is ready.
              </h1>
              <p style="margin:8px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#C9A96E;font-style:italic;">
                ${escapeHtml(config.title)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <hr style="border:0;border-top:1px solid #C9A96E;opacity:0.3;margin:0 0 24px 0;" />
              <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#F5F1EB;">
                ${greeting}
              </p>
              <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#B8B2A8;">
                ${config.intro}
              </p>
              <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#B8B2A8;">
                Download your copy below. The PDF is yours to keep — read it on any device, print it, share it with someone who's curious. We wrote it for educational and research purposes, in plain language, with the references that matter.
              </p>
              <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#B8B2A8;">
                If anything in the guide raises a question, just reply to this email. A real person on the Greenstone team will see it.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#1A9E6E;border:1px solid #26C98A;">
                    <a href="${downloadUrl}" style="display:inline-block;padding:16px 36px;font-family:'Courier New',monospace;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#0D1117;text-decoration:none;font-weight:bold;">
                      Download Your Guide &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0D1117;border:1px solid #C9A96E;">
                <tr>
                  <td style="padding:18px 20px;text-align:center;">
                    <p style="margin:0 0 6px 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A96E;">
                      P.S. — A small thank-you
                    </p>
                    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#B8B2A8;">
                      Use code <strong style="color:#26C98A;font-family:'Courier New',monospace;letter-spacing:0.1em;">${escapeHtml(config.discountCode)}</strong> at checkout for ${escapeHtml(config.discountLabel)}.
                    </p>
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#B8B2A8;opacity:0.7;">
                      Valid for 30 days · One use per customer
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#F5F1EB;font-style:italic;">
                — The Greenstone Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0D1117;padding:20px 32px;border-top:1px solid #1E2738;">
              <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:#B8B2A8;opacity:0.8;text-align:center;">
                Greenstone Peptides ships from a USA-licensed compounding pharmacy. Third-party verified for purity. All educational content is for research and educational purposes only and does not constitute medical advice.
              </p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.05em;color:#B8B2A8;opacity:0.6;text-align:center;">
                You received this because you requested the ${escapeHtml(config.title)} guide. Reply with "unsubscribe" to stop hearing from us.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(config: EbookConfig, firstName: string | undefined, downloadUrl: string): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  return [
    greeting,
    '',
    `Your guide is ready: ${config.title}`,
    '',
    `Download: ${downloadUrl}`,
    '',
    `P.S. Use code ${config.discountCode} at checkout for ${config.discountLabel}. Valid for 30 days.`,
    '',
    '— The Greenstone Team',
    '',
    'Greenstone Peptides — USA-compounded, third-party verified.',
    'For research and educational purposes only. Not medical advice.',
  ].join('\n');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function addToAudience(email: string, firstName: string | undefined): Promise<void> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.warn('[subscribe-ebook] RESEND_AUDIENCE_ID not set — skipping audience add');
    return;
  }
  try {
    await resend.contacts.create({
      audienceId,
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/already|exists|duplicate/i.test(message)) {
      // Idempotent — contact already in audience, continue.
      return;
    }
    // Log non-fatal and continue with email send. We don't want a contacts API hiccup
    // to block the actual delivery email.
    console.error('[subscribe-ebook] Failed to add to audience (continuing):', message);
  }
}

export async function POST(req: NextRequest) {
  let body: SubscribeRequestBody;
  try {
    body = (await req.json()) as SubscribeRequestBody;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, ebook, firstName } = body;

  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!isEbook(ebook)) {
    return NextResponse.json({ success: false, error: 'Unknown ebook.' }, { status: 400 });
  }

  const config = EBOOKS[ebook];
  const cleanFirstName = typeof firstName === 'string' ? firstName.trim().slice(0, 80) : undefined;
  const downloadPath = `/downloads/${config.filename}`;
  const absoluteDownloadUrl = `${siteUrl()}${downloadPath}`;

  try {
    await addToAudience(email, cleanFirstName);

    const html = buildEmailHtml(config, cleanFirstName, absoluteDownloadUrl);
    const text = buildEmailText(config, cleanFirstName, absoluteDownloadUrl);

    await resend.emails.send({
      from: FROM_HEADER,
      to: email,
      subject: config.subject,
      html,
      text,
    });

    return NextResponse.json({ success: true, downloadUrl: downloadPath });
  } catch (err) {
    // Only surface the email's existence in error logs.
    console.error('[subscribe-ebook] Send failed for ebook=%s: %s', ebook, err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { success: false, error: 'We could not send your guide. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
