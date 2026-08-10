import type { Handler, HandlerEvent } from '@netlify/functions'
import { getBookedSlotKeys } from './_shared/bookings'

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
  if (event.httpMethod !== 'GET') return json({ error: 'Method not allowed' }, 405)

  try {
    const keys = await getBookedSlotKeys(event)
    return json({ keys })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load booked slots'
    return json({ error: message, keys: [] }, 500)
  }
}
