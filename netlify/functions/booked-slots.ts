import type { Config, Context } from '@netlify/functions'
import { getBookedSlotKeys } from './_shared/bookings'

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return json({ ok: true })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  try {
    const keys = await getBookedSlotKeys()
    return json({ keys })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load booked slots'
    return json({ error: message, keys: [] }, 500)
  }
}

export const config: Config = {
  path: '/api/booked-slots',
  method: ['GET', 'OPTIONS'],
}
