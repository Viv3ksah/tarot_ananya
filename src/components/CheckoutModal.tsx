import { useState, type FormEvent } from 'react'
import { formatINR, profile, type Service } from '../data/content'

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

export function CheckoutModal({ service, selection, onBack, onClose }: Props) {
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return
    setSubmitting(true)
    try {
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
        }),
      })
      setStatus('done')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Booking details">
      <div className="checkout">
        {status === 'done' ? (
          <div className="success">
            <h2>Request received</h2>
            <p>
              We’ll confirm your {service.title.toLowerCase()} for {prettyDate(selection)} shortly.
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
              <button className="discount-btn" type="button">
                Add a discount code
              </button>
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
                <button className="verify-btn" type="button">
                  Verify
                </button>
              </div>
              <p className="helper">Details regarding this booking will be sent to this account</p>
              <p className="terms">By purchasing, you agree to {profile.name}&apos;s terms</p>
              <button className="pay-btn" type="submit" disabled={submitting || !contact.trim()}>
                {submitting ? 'Please wait…' : 'Continue to payment'}
              </button>
              {status === 'error' && (
                <p className="helper">Something went wrong. Please try again.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
