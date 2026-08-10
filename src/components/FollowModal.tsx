import { useState, type FormEvent } from 'react'
import { profile } from '../data/content'

type Props = {
  open: boolean
  onClose: () => void
}

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export function FollowModal({ open, onClose }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!agreed) {
      setError('Please agree to share your contact details.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'follow',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: `+91${phone.trim()}`,
        }),
      })
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overlay follow-overlay" role="dialog" aria-modal="true" aria-label="Follow">
      <div className="follow-modal">
        <button className="follow-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        {done ? (
          <div className="follow-success">
            <img className="follow-avatar" src={profile.avatar} alt="" width={72} height={72} />
            <h2>You’re following {profile.name}</h2>
            <p>Thanks! You’ll get regular updates and important information.</p>
            <button className="follow-submit" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="follow-form" name="follow" method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="follow" />
            <p className="sr-only">
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>

            <img className="follow-avatar" src={profile.avatar} alt="" width={72} height={72} />
            <h2>Follow {profile.name}</h2>
            <p className="follow-sub">Get regular updates and important information</p>

            <div className="follow-row">
              <input
                name="firstName"
                required
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                name="lastName"
                required
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="follow-phone">
              <span className="follow-cc" aria-hidden="true">
                +91
              </span>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <label className="follow-consent">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to share my contact details with {profile.name}, who may contact me.
              </span>
            </label>

            <button
              className="follow-submit"
              type="submit"
              disabled={submitting || !agreed}
            >
              {submitting ? 'Please wait…' : 'Follow'}
            </button>

            {error && <p className="follow-error">{error}</p>}

            <p className="follow-legal">
              <a href="#terms">Terms &amp; Conditions</a> and <a href="#privacy">Privacy Policy</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
