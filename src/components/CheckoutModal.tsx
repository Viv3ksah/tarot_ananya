import { useState, type FormEvent } from 'react'
import { formatINR, profile, type Service } from '../data/content'
import { saveBooking } from '../lib/bookings'
import {
  createPaymentOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
  verifyPayment,
} from '../lib/razorpay'

type Selection = {
  dateKey: string
  dateLabel: string
  time: string
}

type Props = {
  service: Service
  selection: Selection
  onBack: () => void
  onClose: () => void
}

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

function prettyDate(selection: Selection) {
  const d = new Date(`${selection.dateKey}T12:00:00`)
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  return `${weekday}, ${day}${suffix} ${month}, ${selection.time}`
}

function looksLikeEmail(value: string) {
  return value.includes('@')
}

export function CheckoutModal({ service, selection, onBack, onClose }: Props) {
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [paymentId, setPaymentId] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return

    setSubmitting(true)
    setErrorMessage('')
    setStatus('idle')

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Could not load Razorpay checkout')
      }

      const order = await createPaymentOrder({
        amount: service.price,
        serviceId: service.id,
        serviceTitle: service.title,
        dateKey: selection.dateKey,
        time: selection.time,
        contact: contact.trim(),
      })

      await new Promise<void>((resolve, reject) => {
        openRazorpayCheckout({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: profile.name,
          description: `${service.title} · ${selection.dateLabel} · ${selection.time}`,
          order_id: order.orderId,
          prefill: looksLikeEmail(contact)
            ? { email: contact.trim() }
            : { contact: contact.trim() },
          notes: {
            serviceId: service.id,
            dateKey: selection.dateKey,
            time: selection.time,
          },
          theme: { color: '#e91e8c' },
          handler: async (response) => {
            try {
              const verified = await verifyPayment(response)
              setPaymentId(verified.paymentId ?? response.razorpay_payment_id)

              await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encode({
                  'form-name': 'booking',
                  email: contact.trim(),
                  service: service.title,
                  date: selection.dateKey,
                  time: selection.time,
                  amount: String(service.price),
                  paymentId: verified.paymentId ?? response.razorpay_payment_id,
                }),
              })

              saveBooking({
                dateKey: selection.dateKey,
                time: selection.time,
                serviceId: service.id,
              })

              setStatus('done')
              resolve()
            } catch (err) {
              reject(err instanceof Error ? err : new Error('Payment verification failed'))
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        })
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      if (message !== 'Payment cancelled') {
        setStatus('error')
        setErrorMessage(message)
      } else {
        setErrorMessage('Payment was cancelled. You can try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Booking details">
      <div className="checkout">
        {status === 'done' ? (
          <div className="success">
            <h2>Payment successful</h2>
            <p>
              Your {service.title.toLowerCase()} is confirmed for {prettyDate(selection)}.
              {paymentId ? ` Payment ID: ${paymentId}` : ''}
            </p>
            <button className="pay-btn" type="button" onClick={onClose}>
              Back to profile
            </button>
          </div>
        ) : (
          <>
            <div className="checkout-head">
              <div className="checkout-nav">
                <button type="button" onClick={onBack} aria-label="Back">
                  ←
                </button>
                <button type="button" onClick={onBack}>
                  Details ▾
                </button>
              </div>
              <img className="checkout-avatar" src={profile.avatar} alt="" width={68} height={68} />
              <h2>Session with {profile.name}</h2>
              <p>{prettyDate(selection)}</p>
              <div className="checkout-price">{formatINR(service.price)}</div>
              <p className="checkout-pay-note">Secure payment via Razorpay</p>
            </div>

            <form className="checkout-body" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="booking" />
              <h3>Account</h3>
              <div className="account-field">
                <input
                  type="text"
                  name="email"
                  required
                  placeholder="Email / Phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <p className="helper">Booking confirmation will be sent to this contact</p>
              <p className="terms">By paying, you agree to {profile.name}&apos;s terms</p>
              <button className="pay-btn" type="submit" disabled={submitting || !contact.trim()}>
                {submitting ? 'Opening Razorpay…' : `Pay ${formatINR(service.price)}`}
              </button>
              {(status === 'error' || errorMessage) && (
                <p className="helper payment-error">{errorMessage || 'Something went wrong. Please try again.'}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
