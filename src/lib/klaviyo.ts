export const KLAVIYO_COMPANY_ID = 'pk_ec707a288a01d41d1b31745bb1ce1c0a0f'

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
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: 'RvW5qV',
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

export async function trackContactSubmission(payload: {
  email: string
  name: string
  phone: string
  topic: string
  message: string
}): Promise<boolean> {
  try {
    const [firstName, ...rest] = payload.name.trim().split(/\s+/)
    const lastName = rest.join(' ')
    const response = await fetch(
      `https://a.klaviyo.com/client/events/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'event',
            attributes: {
              properties: {
                topic: payload.topic,
                message: payload.message,
                phone: payload.phone,
                name: payload.name,
              },
              metric: {
                data: {
                  type: 'metric',
                  attributes: { name: 'Contact Form Submitted' },
                },
              },
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: payload.email,
                    first_name: firstName || undefined,
                    last_name: lastName || undefined,
                    phone_number: payload.phone || undefined,
                  },
                },
              },
            },
          },
        }),
      }
    )
    return response.ok
  } catch {
    return false
  }
}
