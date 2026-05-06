// Update Klaviyo welcome flow emails with branded Greenstone content
const API_KEY = 'pk_ec707a288a01d41d1b31745bb1ce1c0a0f'
const API_BASE = 'https://a.klaviyo.com/api'

const headers = {
  'Authorization': `Klaviyo-API-Key ${API_KEY}`,
  'revision': '2024-10-15',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// Branded HTML email template
function welcomeEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0D1117;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#161C26">

<!-- HEADER -->
<tr><td style="background:#0D1117;padding:40px 30px;text-align:center;border-bottom:1px solid rgba(201,169,110,0.15)">
  <h1 style="font-family:Georgia,serif;font-size:26px;color:#F5F1EB;font-weight:400;margin:0">Greenstone Peptides</h1>
  <p style="font-family:monospace;font-size:10px;letter-spacing:3px;color:#C9A96E;margin:10px 0 0;text-transform:uppercase">Peptide Solutions</p>
</td></tr>

<!-- BODY -->
<tr><td style="padding:40px 30px">
  <h2 style="font-family:Georgia,serif;font-size:30px;color:#F5F1EB;font-weight:400;margin:0 0 20px;text-align:center">Welcome to Greenstone.</h2>
  <p style="font-size:15px;line-height:1.7;color:#B8B2A8;margin:0 0 24px;text-align:center">Thanks for joining. As promised, here is your exclusive discount code for $30 off your first order:</p>

  <!-- CODE BOX -->
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="background:#0D1117;border:2px solid #C9A96E;border-radius:8px;padding:30px;text-align:center">
    <p style="font-size:11px;color:#B8B2A8;margin:0 0 10px;text-transform:uppercase;letter-spacing:3px">Your Discount Code</p>
    <p style="font-family:monospace;font-size:38px;color:#C9A96E;letter-spacing:6px;margin:0 0 10px;font-weight:bold">CLINICAL30</p>
    <p style="font-size:12px;color:#7A9E87;margin:0">$30 off &middot; Valid 14 days &middot; One use per customer</p>
  </td></tr>
  </table>

  <!-- CTA BUTTON -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0">
  <tr><td align="center">
    <a href="https://greenstonewellness.store/shop" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:16px 48px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:2px;text-transform:uppercase">Shop Now</a>
  </td></tr>
  </table>

  <!-- TRUST SIGNALS -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;border-radius:4px;margin:30px 0">
  <tr><td style="padding:24px 24px 8px">
    <h3 style="font-family:Georgia,serif;font-size:18px;color:#F5F1EB;font-weight:400;margin:0 0 16px">Why Greenstone?</h3>
  </td></tr>
  <tr><td style="padding:0 24px 6px"><p style="font-size:13px;color:#B8B2A8;margin:0;padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.08)"><span style="color:#7A9E87;margin-right:8px">&#10003;</span> USA-compounded by licensed pharmacy partners</p></td></tr>
  <tr><td style="padding:0 24px 6px"><p style="font-size:13px;color:#B8B2A8;margin:0;padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.08)"><span style="color:#7A9E87;margin-right:8px">&#10003;</span> USP 797 sterile compounding standards</p></td></tr>
  <tr><td style="padding:0 24px 6px"><p style="font-size:13px;color:#B8B2A8;margin:0;padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.08)"><span style="color:#7A9E87;margin-right:8px">&#10003;</span> Third-party tested for potency, sterility, and purity</p></td></tr>
  <tr><td style="padding:0 24px 6px"><p style="font-size:13px;color:#B8B2A8;margin:0;padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.08)"><span style="color:#7A9E87;margin-right:8px">&#10003;</span> Temperature-controlled shipping</p></td></tr>
  <tr><td style="padding:0 24px 16px"><p style="font-size:13px;color:#B8B2A8;margin:0;padding:8px 0"><span style="color:#7A9E87;margin-right:8px">&#10003;</span> 25+ years of pharmaceutical care</p></td></tr>
  </table>

  <p style="font-size:13px;color:#888;text-align:center;margin:20px 0 0">Questions about a product? Just reply to this email.</p>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#0D1117;padding:30px;text-align:center;border-top:1px solid rgba(201,169,110,0.1)">
  <p style="font-size:12px;color:#666;margin:0 0 4px">Greenstone Peptides</p>
  <p style="font-size:11px;color:#555;margin:0 0 12px">USA-Compounded Peptide Therapy</p>
  <p style="margin:0 0 16px">
    <a href="https://greenstonewellness.store/shop" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">Shop</a>
    <a href="https://greenstonewellness.store/learn" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">Learn</a>
    <a href="https://greenstonewellness.store/about" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">About</a>
  </p>
  <p style="font-size:10px;color:#444;margin:0">{% manage_preferences %} | {% unsubscribe %}</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function existingCustomerEmailHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0D1117;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#161C26">

<!-- HEADER -->
<tr><td style="background:#0D1117;padding:40px 30px;text-align:center;border-bottom:1px solid rgba(201,169,110,0.15)">
  <h1 style="font-family:Georgia,serif;font-size:26px;color:#F5F1EB;font-weight:400;margin:0">Greenstone Peptides</h1>
  <p style="font-family:monospace;font-size:10px;letter-spacing:3px;color:#C9A96E;margin:10px 0 0;text-transform:uppercase">Peptide Solutions</p>
</td></tr>

<!-- BODY -->
<tr><td style="padding:40px 30px">
  <h2 style="font-family:Georgia,serif;font-size:30px;color:#F5F1EB;font-weight:400;margin:0 0 20px;text-align:center">Thanks for subscribing.</h2>
  <p style="font-size:15px;line-height:1.7;color:#B8B2A8;margin:0 0 24px;text-align:center">Welcome to the Greenstone community. We will keep you updated on new formulations, product availability, and educational content.</p>
  <p style="font-size:15px;line-height:1.7;color:#B8B2A8;margin:0 0 24px;text-align:center">No spam — just the updates that matter, about once a month.</p>

  <!-- CTA BUTTON -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">
  <tr><td align="center">
    <a href="https://greenstonewellness.store/shop" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:16px 48px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:2px;text-transform:uppercase">Browse Products</a>
  </td></tr>
  </table>

  <p style="font-size:13px;color:#888;text-align:center;margin:20px 0 0">Questions? Just reply to this email.</p>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#0D1117;padding:30px;text-align:center;border-top:1px solid rgba(201,169,110,0.1)">
  <p style="font-size:12px;color:#666;margin:0 0 4px">Greenstone Peptides</p>
  <p style="font-size:11px;color:#555;margin:0 0 12px">USA-Compounded Peptide Therapy</p>
  <p style="margin:0 0 16px">
    <a href="https://greenstonewellness.store/shop" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">Shop</a>
    <a href="https://greenstonewellness.store/learn" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">Learn</a>
    <a href="https://greenstonewellness.store/about" style="color:#C9A96E;font-size:11px;text-decoration:none;margin:0 8px">About</a>
  </p>
  <p style="font-size:10px;color:#444;margin:0">{% manage_preferences %} | {% unsubscribe %}</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

async function updateEmail(messageId, label, subject, previewText, html) {
  const res = await fetch(`${API_BASE}/flow-messages/${messageId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      data: {
        type: 'flow-message',
        id: messageId,
        attributes: {
          label,
          content: {
            subject,
            preview_text: previewText,
            from_email: '{{ organization.email }}',
            from_label: 'Greenstone Peptides',
            html,
          },
        },
      },
    }),
  })
  const data = await res.json()
  if (data.errors) {
    console.error(`FAIL ${messageId}:`, JSON.stringify(data.errors, null, 2))
  } else {
    console.log(`OK ${messageId} — "${label}"`)
  }
}

async function main() {
  // 1. Welcome Email #1: Never Purchased (V7K6va) — discount code email
  await updateEmail(
    'V7K6va',
    'Welcome — Your $30 Discount Code',
    'Your $30 discount code is inside',
    'Welcome to Greenstone Peptides — your code is waiting',
    welcomeEmailHtml()
  )

  // 2. Welcome Email #1: Existing Customer (Yad5eT) — thank you email
  await updateEmail(
    'Yad5eT',
    'Thanks for Subscribing',
    'Thanks for subscribing to Greenstone Peptides',
    'Welcome to the Greenstone community',
    existingCustomerEmailHtml()
  )

  console.log('\nDone. Go to Klaviyo → Flows → Welcome Series → click "Review and turn on" to make it live.')
}

main()
