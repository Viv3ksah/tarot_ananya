import Razorpay from 'razorpay'
import type { Config, Context } from '@netlify/functions'
import { getEnv } from './_shared/env'

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
          'Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env / Netlify env vars.',
      },
      500,
    )
  }

  let body: {
    amount?: number
    amountPaise?: number
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

  // Accept INR rupees (frontend) or paise directly
  const amountPaise = Number.isFinite(Number(body.amountPaise))
    ? Math.round(Number(body.amountPaise))
    : Math.round(Number(body.amount) * 100)

  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return json({ error: 'Amount must be at least 100 paise (₹1)' }, 400)
  }

  const receipt = `ta_${Date.now().toString(36)}`
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

  try {
    const order = await razorpay.orders.create({
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
    })

    return json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency ?? 'INR',
      keyId,
    })
  } catch (err) {
    const statusCode =
      typeof err === 'object' &&
      err !== null &&
      'statusCode' in err &&
      typeof (err as { statusCode?: unknown }).statusCode === 'number'
        ? (err as { statusCode: number }).statusCode
        : 500

    const message =
      typeof err === 'object' &&
      err !== null &&
      'error' in err &&
      typeof (err as { error?: { description?: string } }).error?.description === 'string'
        ? (err as { error: { description: string } }).error.description
        : err instanceof Error
          ? err.message
          : 'Could not create Razorpay order'

    if (statusCode === 401 || /auth|unauthorized|authentication/i.test(message)) {
      return json({ error: message }, 401)
    }

    return json({ error: message }, 500)
  }
}

export const config: Config = {
  path: '/api/create-order',
  method: ['POST', 'OPTIONS'],
}
