import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { formatINR, profile } from '../data/content'

type Booking = {
  id: string
  dateKey: string
  time: string
  serviceId: string
  serviceTitle: string
  contact: string
  paymentId: string
  orderId: string
  amount: number
  createdAt: string
}

const SESSION_KEY = 'tarot-admin-password'

function formatWhen(dateKey: string, time: string) {
  const d = new Date(`${dateKey}T12:00:00`)
  const dateLabel = d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${dateLabel} · ${time}`
}

export function AdminDashboard() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? '')
  const [input, setInput] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const upcoming = useMemo(() => {
    const today = new Date()
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')
    return bookings.filter((b) => b.dateKey >= todayKey)
  }, [bookings])

  const past = useMemo(() => {
    const today = new Date()
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')
    return bookings.filter((b) => b.dateKey < todayKey).reverse()
  }, [bookings])

  async function loadBookings(pass: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin-bookings', {
        headers: { 'X-Admin-Password': pass },
      })
      const data = (await res.json()) as { bookings?: Booking[]; error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Could not load bookings')
      }
      setBookings(Array.isArray(data.bookings) ? data.bookings : [])
      sessionStorage.setItem(SESSION_KEY, pass)
      setPassword(pass)
    } catch (err) {
      setBookings([])
      sessionStorage.removeItem(SESSION_KEY)
      setPassword('')
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (password) loadBookings(password)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    loadBookings(input.trim())
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setPassword('')
    setBookings([])
    setInput('')
  }

  return (
    <div className="admin-page">
      <div className="admin-frame">
        <header className="admin-top">
          <div>
            <p className="admin-kicker">Private</p>
            <h1>Bookings dashboard</h1>
            <p className="admin-sub">{profile.name}</p>
          </div>
          <div className="admin-top-actions">
            <a className="admin-link" href="/">
              ← Site
            </a>
            {password && (
              <button className="admin-ghost" type="button" onClick={logout}>
                Log out
              </button>
            )}
          </div>
        </header>

        {!password ? (
          <form className="admin-login" onSubmit={handleLogin}>
            <h2>Admin login</h2>
            <p>Enter the dashboard password to see paid bookings.</p>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Dashboard password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? 'Checking…' : 'View bookings'}
            </button>
            {error && <p className="admin-error">{error}</p>}
          </form>
        ) : (
          <div className="admin-body">
            <div className="admin-stats">
              <div>
                <strong>{upcoming.length}</strong>
                <span>Upcoming</span>
              </div>
              <div>
                <strong>{past.length}</strong>
                <span>Past</span>
              </div>
              <div>
                <strong>{bookings.length}</strong>
                <span>Paid total</span>
              </div>
            </div>

            {loading && <p className="admin-muted">Refreshing…</p>}
            {error && <p className="admin-error">{error}</p>}

            <section className="admin-section">
              <h2>Upcoming sessions</h2>
              {upcoming.length === 0 ? (
                <p className="admin-muted">No upcoming paid bookings yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Service</th>
                        <th>Contact</th>
                        <th>Paid</th>
                        <th>Payment ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcoming.map((b) => (
                        <tr key={b.id}>
                          <td>{formatWhen(b.dateKey, b.time)}</td>
                          <td>{b.serviceTitle}</td>
                          <td>{b.contact}</td>
                          <td>{formatINR(b.amount)}</td>
                          <td className="mono">{b.paymentId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-section">
              <h2>Past sessions</h2>
              {past.length === 0 ? (
                <p className="admin-muted">No past bookings yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Service</th>
                        <th>Contact</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {past.map((b) => (
                        <tr key={b.id}>
                          <td>{formatWhen(b.dateKey, b.time)}</td>
                          <td>{b.serviceTitle}</td>
                          <td>{b.contact}</td>
                          <td>{formatINR(b.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
