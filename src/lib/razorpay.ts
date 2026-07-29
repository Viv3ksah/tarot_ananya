export type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: { contact?: string; email?: string; name?: string }
  notes?: Record<string, string>
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay]')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpay = 'true'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function createPaymentOrder(input: {
  amount: number
  serviceId: string
  serviceTitle: string
  dateKey: string
  time: string
  contact: string
}) {
  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json()) as {
    orderId?: string
    amount?: number
    currency?: string
    keyId?: string
    error?: string
  }
  if (!res.ok || !data.orderId || !data.keyId || !data.amount) {
    throw new Error(data.error ?? 'Could not start payment')
  }
  return {
    orderId: data.orderId,
    amount: data.amount,
    currency: data.currency ?? 'INR',
    keyId: data.keyId,
  }
}

export async function verifyPayment(payload: RazorpaySuccessResponse) {
  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as { ok?: boolean; error?: string; paymentId?: string }
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? 'Payment verification failed')
  }
  return data
}

export function openRazorpayCheckout(options: RazorpayCheckoutOptions) {
  if (!window.Razorpay) {
    throw new Error('Razorpay failed to load')
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
  return rzp
}
