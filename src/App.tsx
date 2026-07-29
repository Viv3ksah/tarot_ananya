import { useState } from 'react'
import { type Service } from './data/content'
import { ProfilePage } from './components/ProfilePage'
import { BookingPage } from './components/BookingPage'
import { CheckoutModal } from './components/CheckoutModal'

type Selection = {
  dateKey: string
  dateLabel: string
  time: string
}

export default function App() {
  const [view, setView] = useState<'profile' | 'booking'>('profile')
  const [service, setService] = useState<Service | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)

  function startBooking(next: Service) {
    setService(next)
    setSelection(null)
    setView('booking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
