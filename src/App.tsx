import { useEffect, useState } from 'react'
import { services, type Service } from './data/content'
import { ProfilePage } from './components/ProfilePage'
import { SessionsPage } from './components/SessionsPage'
import { BookingPage } from './components/BookingPage'
import { CheckoutModal } from './components/CheckoutModal'
import { AdminDashboard } from './components/AdminDashboard'

type Selection = {
  dateKey: string
  dateLabel: string
  time: string
}

type AppRoute =
  | { name: 'admin' }
  | { name: 'profile' }
  | { name: 'catalog' }
  | { name: 'booking'; serviceId: string }

function parseRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/admin') return { name: 'admin' }
  if (path === '/book' || path === '/sessions') return { name: 'catalog' }
  const booked = path.match(/^\/book\/([^/]+)$/)
  if (booked) return { name: 'booking', serviceId: decodeURIComponent(booked[1]) }
  return { name: 'profile' }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute())
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    const sync = () => {
      setRoute(parseRoute())
      setSelection(null)
    }
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  function navigate(path: string) {
    window.history.pushState({}, '', path)
    setRoute(parseRoute())
    setSelection(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const bookedService =
    route.name === 'booking'
      ? services.find((s) => s.id === route.serviceId && s.kind === 'session')
      : null

  function startBooking(next: Service) {
    navigate(`/book/${next.id}`)
  }

  if (route.name === 'admin') {
    return (
      <div className="app-shell">
        <AdminDashboard />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {route.name === 'profile' && (
        <ProfilePage onOpenCatalog={() => navigate('/book')} onBookSession={startBooking} />
      )}

      {(route.name === 'catalog' || (route.name === 'booking' && !bookedService)) && (
        <SessionsPage onBack={() => navigate('/')} onSelect={startBooking} />
      )}

      {route.name === 'booking' && bookedService && (
        <BookingPage
          service={bookedService}
          onBack={() => navigate('/book')}
          onConfirm={(next) => setSelection(next)}
        />
      )}

      {route.name === 'booking' && bookedService && selection && (
        <CheckoutModal
          service={bookedService}
          selection={selection}
          onBack={() => setSelection(null)}
          onClose={() => navigate('/')}
        />
      )}
    </div>
  )
}
