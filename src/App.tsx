import { useEffect, useState } from 'react'
import { type Service } from './data/content'
import { ProfilePage } from './components/ProfilePage'
import { BookingPage } from './components/BookingPage'
import { CheckoutModal } from './components/CheckoutModal'
import { AdminDashboard } from './components/AdminDashboard'

type Selection = {
  dateKey: string
  dateLabel: string
  time: string
}

function pathView() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/admin') return 'admin' as const
  return 'app' as const
}

export default function App() {
  const [route, setRoute] = useState<'app' | 'admin'>(() => pathView())
  const [view, setView] = useState<'profile' | 'booking'>('profile')
  const [service, setService] = useState<Service | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    const sync = () => setRoute(pathView())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  function startBooking(next: Service) {
    setService(next)
    setSelection(null)
    setView('booking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (route === 'admin') {
    return (
      <div className="app-shell">
        <AdminDashboard />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {view === 'profile' && <ProfilePage onBookSession={startBooking} />}

      {view === 'booking' && service && (
        <BookingPage
          service={service}
          onBack={() => {
            setView('profile')
            setSelection(null)
          }}
          onConfirm={(next) => setSelection(next)}
        />
      )}

      {view === 'booking' && service && selection && (
        <CheckoutModal
          service={service}
          selection={selection}
          onBack={() => setSelection(null)}
          onClose={() => {
            setSelection(null)
            setView('profile')
            setService(null)
          }}
        />
      )}
    </div>
  )
}
