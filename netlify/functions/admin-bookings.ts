import type { Config, Context } from '@netlify/functions'
import { listBookings } from './_shared/bookings'
import { getEnv } from './_shared/env'

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}

function readPassword(req: Request) {
  const header = req.headers.get('x-admin-password')
  if (header) return header
  const auth = req.headers.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim()
  const url = new URL(req.url)
  return url.searchParams.get('password') ?? ''
}

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return json({ ok: true })
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const expected = getEnv('ADMIN_DASHBOARD_PASSWORD')
  if (!expected) {
    return json(
      { error: 'Admin dashboard is not configured. Set ADMIN_DASHBOARD_PASSWORD in Netlify env.' },
      503,
    )
  }

  if (readPassword(req) !== expected) {
    return json({ error: 'Unauthorized' }, 401)
  }

  try {
    const bookings = await listBookings()
    bookings.sort((a, b) => {
      const aKey = `${a.dateKey} ${a.time}`
      const bKey = `${b.dateKey} ${b.time}`
      return aKey.localeCompare(bKey)
    })
    return json({ bookings })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not load bookings'
    return json({ error: message }, 500)
  }
}

export const config: Config = {
  path: '/api/admin/bookings',
  method: ['GET', 'OPTIONS'],
}
