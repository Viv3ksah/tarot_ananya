import type { Handler, HandlerEvent } from '@netlify/functions'
import { listBookings } from './_shared/bookings'
import { getEnv } from './_shared/env'

function json(data: unknown, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
    body: JSON.stringify(data),
  }
}

function readPassword(event: HandlerEvent) {
  const header = event.headers['x-admin-password'] || event.headers['X-Admin-Password']
  if (header) return header
  const auth = event.headers.authorization || event.headers.Authorization
  if (auth?.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()
  return event.queryStringParameters?.password ?? ''
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return json({ ok: true })
  if (event.httpMethod !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const expected = getEnv('ADMIN_DASHBOARD_PASSWORD')
  if (!expected) {
    return json(
      { error: 'Admin dashboard is not configured. Set ADMIN_DASHBOARD_PASSWORD in Netlify env.' },
      503,
    )
  }

  if (readPassword(event) !== expected) {
    return json({ error: 'Unauthorized' }, 401)
  }

  try {
    const bookings = await listBookings(event)
    bookings.sort((a, b) => `${a.dateKey} ${a.time}`.localeCompare(`${b.dateKey} ${b.time}`))
    return json({ bookings })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load bookings'
    return json({ error: message }, 500)
  }
}
