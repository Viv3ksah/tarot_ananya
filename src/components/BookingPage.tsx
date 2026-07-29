import { useMemo, useRef, useState } from 'react'
import {
  formatINR,
  getBookableDates,
  profile,
  timeSlots,
  type DayPart,
  type Service,
} from '../data/content'

type Props = {
  service: Service
  onBack: () => void
  onConfirm: (selection: { dateKey: string; dateLabel: string; time: string }) => void
}

export function BookingPage({ service, onBack, onConfirm }: Props) {
  const dates = useMemo(() => getBookableDates(14), [])
  const [selectedDate, setSelectedDate] = useState(dates[0]?.key ?? '')
  const [dayPart, setDayPart] = useState<DayPart>('Midday')
  const [selectedTime, setSelectedTime] = useState('03:30 PM')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const selectedMeta = dates.find((d) => d.key === selectedDate)

  function scrollDates(dir: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div className="booking-page">
      <div className="booking-top">
        <button className="back-btn" type="button" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="booking-brand">
          <img src={profile.avatar} alt="" width={42} height={42} />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.tagline}</span>
          </div>
        </div>
        <span className="built-note">Built with ♥ for Tarot by Ananya</span>
      </div>

      <div className="booking-card">
        <section className="service-detail">
          <h1>{service.title}</h1>
          <div className="meta-row">
            <span>{service.durationMins} mins</span>
            <span>|</span>
            <span>{service.platform}</span>
          </div>
          <div className="badge-row">
            <div className="price-badge">
              <span className="was">{formatINR(service.originalPrice)}</span>
              <span>{formatINR(service.price)}</span>
            </div>
            <div className="rating-badge">★ {service.rating}</div>
          </div>
          <img className="detail-image" src={service.image} alt="" width={640} height={400} />
          <p className="detail-copy">{service.description}</p>
        </section>

        <section className="scheduler">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>When should we connect?</h2>
            <div className="date-nav">
              <button className="nav-arrow" type="button" onClick={() => scrollDates(-1)} aria-label="Previous dates">
                ‹
              </button>
              <button className="nav-arrow" type="button" onClick={() => scrollDates(1)} aria-label="Next dates">
                ›
              </button>
            </div>
          </div>

          <div className="date-scroller" ref={scrollerRef}>
            {dates.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`date-card${selectedDate === d.key ? ' is-selected' : ''}`}
                onClick={() => setSelectedDate(d.key)}
              >
                <span className="dow">{d.day}</span>
                <span className="dom">{d.dateLabel}</span>
                <span className="slots">{d.slots} slots</span>
              </button>
            ))}
          </div>

          <h2>Select your preferred time slot</h2>
          <div className="daypart-tabs" role="tablist" aria-label="Time of day">
            {(Object.keys(timeSlots) as DayPart[]).map((part) => (
              <button
                key={part}
                type="button"
                role="tab"
                aria-selected={dayPart === part}
                className={dayPart === part ? 'is-active' : ''}
                onClick={() => {
                  setDayPart(part)
                  setSelectedTime(timeSlots[part][0])
                }}
              >
                {part}
              </button>
            ))}
          </div>

          <div className="slot-grid">
            {timeSlots[dayPart].map((slot) => (
              <button
                key={slot}
                type="button"
                className={`slot-btn${selectedTime === slot ? ' is-selected' : ''}`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <div className="scheduler-foot">
            <div className="timezone">Asia/Calcutta (GMT+5:30)</div>
            <button
              className="confirm-btn"
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() =>
                onConfirm({
                  dateKey: selectedDate,
                  dateLabel: selectedMeta?.dateLabel ?? selectedDate,
                  time: selectedTime,
                })
              }
            >
              Confirm details
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
