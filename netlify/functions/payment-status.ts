import type { Config, Context } from '@netlify/functions'
import { getEnvDebug } from './_shared/env'

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') {
    return Response.json({ ok: true })
  }

  return Response.json({
    ok: true,
    razorpay: getEnvDebug(),
  })
}

export const config: Config = {
  path: '/api/payment-status',
  method: ['GET', 'OPTIONS'],
}
