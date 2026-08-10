import type { Handler, HandlerEvent } from '@netlify/functions'
import { getEnvDebug } from './_shared/env'

function json(data: unknown, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
    body: JSON.stringify(data),
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return json({ ok: true })
  return json({
    ok: true,
    razorpay: getEnvDebug(),
  })
}
