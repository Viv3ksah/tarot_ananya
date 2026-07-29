import { useState, type FormEvent } from 'react'
import { offerings } from '../data/content'
import { useReveal } from '../hooks/useReveal'

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export function Booking() {
  const ref = useReveal<HTMLElement>()
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: offerings[0]?.title ?? '',
    message: '',
  })

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'booking',
          ...form,
        }),
      })
      setStatus('done')
      setForm({ name: '', email: '', service: offerings[0]?.title ?? '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="book" ref={ref}>
      <div className="wrap booking-grid reveal">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Book</span>
          <h2>Tell me what you’re holding</h2>
          <p>
            Share a little context and the offering you want. I’ll reply within
            a day with timing and payment details.
          </p>
        </div>

        {status === 'done' ? (
          <p className="form-success">
            Request received. I’ll write back soon with next steps.
          </p>
        ) : (
          <form className="booking-form" name="booking" method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="booking" />
            <p className="sr-only">
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="service">Offering</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              >
                {offerings.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title} — {item.price}
                  </option>
                ))}
                <option value="1:1 Coaching">1:1 Coaching</option>
                <option value="Digital product">Digital product</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Your question or notes</label>
              <textarea
                id="message"
                name="message"
                required
                placeholder="What would you like clarity on?"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <button className="btn" type="submit">
              Send booking request
            </button>
            {status === 'error' && (
              <p className="form-note">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
