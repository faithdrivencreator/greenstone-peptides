const KLAVIYO_COMPANY_ID = 'pk_ec707a288a01d41d1b31745bb1ce1c0a0f'

export async function subscribeToKlaviyo(
  email: string,
  source: string = 'Website'
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              custom_source: source,
              profile: {
                data: {
                  type: 'profile',
                  attributes: { email },
                },
              },
            },
          },
        }),
      }
    )
    // Klaviyo returns 202 on success; 409 for already-subscribed (still a win)
    return response.ok || response.status === 409
  } catch {
    return false
  }
}
