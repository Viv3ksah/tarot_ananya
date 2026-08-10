import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Handler, HandlerEvent } from '@netlify/functions'
import { saveConfirmedBooking } from './_shared/bookings'
import { getEnv } from './_shared/env'

function json(data: unknown, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
    body: JSON.stringify(data),
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return json({ ok: true })
  if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const keySecret = getEnv('RAZORPAY_KEY_SECRET')
  if (!keySecret) {
    return json(
      {
        error:
          'Razorpay secret missing. Add RAZORPAY_KEY_SECRET to .env and restart npm run dev.',
      },
      500,
    )
  }

  let body: {
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
    serviceId?: string
    serviceTitle?: string
    dateKey?: string
    time?: string
    contact?: string
    amount?: number
  }

  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const orderId = body.razorpay_order_id ?? ''
  const paymentId = body.razorpay_payment_id ?? ''
  const signature = body.razorpay_signature ?? ''

  if (!orderId || !paymentId || !signature) {
    return json({ error: 'Missing payment verification fields' }, 400)
  }

  const expected = createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const expectedBuf = Buffer.from(expected)
  const signatureBuf = Buffer.from(signature)

  const valid =
    expectedBuf.length === signatureBuf.length &&
    timingSafeEqual(expectedBuf, signatureBuf)

  if (!valid) {
    return json({ error: 'Invalid payment signature' }, 400)
  }

  const dateKey = (body.dateKey ?? '').trim()
  const time = (body.time ?? '').trim()
  const contact = (body.contact ?? '').trim()
  const serviceId = (body.serviceId ?? '').trim()
  const serviceTitle = (body.serviceTitle ?? '').trim()
  const amount = Number(body.amount ?? 0)

  let bookingId: string | undefined

  if (dateKey && time && contact && serviceId) {
    const booking = await saveConfirmedBooking(
      {
        dateKey,
        time,
        serviceId,
        serviceTitle: serviceTitle || serviceId,
        contact,
        paymentId,
        orderId,
        amount: Number.isFinite(amount) ? amount : 0,
      },
      event,
    )
    bookingId = booking.id
  }

  return json({
    ok: true,
    orderId,
    paymentId,
    bookingId,
  })
}
