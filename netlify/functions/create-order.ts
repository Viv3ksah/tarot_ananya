import type { Config, Context } from '@netlify/functions'

function getEnv(name: string) {
  try {
    const value = Netlify.env.get(name)
    if (value) return value
  } catch {
    // fall through for local tooling
  }
  return process.env[name] ?? ''
}

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const keyId = getEnv('RAZORPAY_KEY_ID')
  const keySecret = getEnv('RAZORPAY_KEY_SECRET')

  if (!keyId || !keySecret) {
    return json(
      {
        error:
          'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Netlify env vars.',
      },
      500,
    )
  }

  let body: {
    amount?: number
    serviceId?: string
    serviceTitle?: string
    dateKey?: string
    time?: string
    contact?: string
  }

  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const amountInr = Number(body.amount)
  if (!Number.isFinite(amountInr) || amountInr < 1) {
    return json({ error: 'Invalid amount' }, 400)
  }

  const amountPaise = Math.round(amountInr * 100)
  const receipt = `ta_${Date.now().toString(36)}`

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        serviceId: body.serviceId ?? '',
        serviceTitle: body.serviceTitle ?? '',
        dateKey: body.dateKey ?? '',
        time: body.time ?? '',
        contact: body.contact ?? '',
      },
    }),
  })

  const orderData = (await orderRes.json()) as {
    id?: string
    amount?: number
    currency?: string
    error?: { description?: string }
  }

  if (!orderRes.ok || !orderData.id) {
    return json(
      { error: orderData.error?.description ?? 'Could not create Razorpay order' },
      502,
    )
  }

  return json({
    orderId: orderData.id,
    amount: orderData.amount,
    currency: orderData.currency ?? 'INR',
    keyId,
  })
}

export const config: Config = {
  path: '/api/create-order',
  method: ['POST', 'OPTIONS'],
}
