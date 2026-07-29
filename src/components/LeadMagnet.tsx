import { useState, type FormEvent } from 'react'
import { useReveal } from '../hooks/useReveal'

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export function LeadMagnet() {
  const ref = useReveal<HTMLElement>()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'lead-magnet',
          email,
        }),
      })
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="free-guide" ref={ref}>
      <div className="wrap lead reveal">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Free lead magnet</span>
          <h2>A 7-day intuition reset</h2>
          <p>
            A short email series with one card pull, one prompt, and one gentle
            practice each day — no spam, just a soft reset.
          </p>
        </div>

        {status === 'done' ? (
          <p className="form-success">You’re in. Check your inbox for day one.</p>
        ) : (
          <form className="lead-form" name="lead-magnet" method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="lead-magnet" />
            <p className="sr-only">
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>
            <div className="field">
              <label htmlFor="lead-email">Email</label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn" type="submit">
              Send me the guide
            </button>
            {status === 'error' && (
              <p className="form-note">Something went wrong. Please try again.</p>
            )}
            <p className="form-note">Unsubscribe anytime. Your inbox stays sacred.</p>
          </form>
        )}
      </div>
    </section>
  )
}
