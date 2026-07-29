import { useEffect, useMemo, useRef, useState } from 'react'
import {
  formatINR,
  getBookableDates,
  getSlotsForDate,
  profile,
  type DayPart,
  type Service,
} from '../data/content'

type Props = {
  service: Service
  onBack: () => void
  onConfirm: (selection: { dateKey: string; dateLabel: string; time: string }) => void
}

const DAY_PARTS: DayPart[] = ['Morning', 'Midday', 'Evening']

function pickBestDayPart(slots: Record<DayPart, string[]>, preferred: DayPart): DayPart {
  if (slots[preferred].length > 0) return preferred
  return DAY_PARTS.find((part) => slots[part].length > 0) ?? preferred
}

export function BookingPage({ service, onBack, onConfirm }: Props) {
  const dates = useMemo(() => getBookableDates(14), [])
  const [selectedDate, setSelectedDate] = useState(dates[0]?.key ?? '')
  const [dayPart, setDayPart] = useState<DayPart>('Midday')
  const [selectedTime, setSelectedTime] = useState('')
  const preferredPartRef = useRef<DayPart>('Midday')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const selectedMeta = dates.find((d) => d.key === selectedDate)
  const slotsByPart = useMemo(
    () => (selectedDate ? getSlotsForDate(selectedDate) : { Morning: [], Midday: [], Evening: [] }),
    [selectedDate],
  )
  const visibleSlots = slotsByPart[dayPart]

  // When the date changes, refresh day-part + selected time to match that day's availability
  useEffect(() => {
    if (!selectedDate) return
    const nextSlots = getSlotsForDate(selectedDate)
    const nextPart = pickBestDayPart(nextSlots, preferredPartRef.current)
    preferredPartRef.current = nextPart
    setDayPart(nextPart)
    setSelectedTime(nextSlots[nextPart][0] ?? '')
  }, [selectedDate])

  function selectDate(key: string) {
    setSelectedDate(key)
    const el = scrollerRef.current?.querySelector(`[data-date="${key}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  function selectDayPart(part: DayPart) {
    preferredPartRef.current = part
    setDayPart(part)
    const next = slotsByPart[part]
    setSelectedTime((current) => (next.includes(current) ? current : (next[0] ?? '')))
  }

  function scrollDates(dir: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="booking-page">
      <div className="booking-top">
        <button className="back-btn" type="button" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <div className="booking-brand">
          <img src={profile.avatar} alt="" width={42} height={42} />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.tagline}</span>
          </div>
        </div>
        <span className="built-note">Secure booking</span>
      </div>

      <div className="booking-card">
        <section className="service-detail">
          <h1>{service.title}</h1>
          <div className="meta-row">
            <span className="meta-chip">{service.durationMins} mins</span>
            <span className="meta-chip">{service.platform}</span>
          </div>
          <div className="badge-row">
            <div className="price-badge">
              <span className="was">{formatINR(service.originalPrice)}</span>
              <span>{formatINR(service.price)}</span>
            </div>
            <div className="rating-badge">
              <StarIcon /> {service.rating}.0
            </div>
          </div>
          <img className="detail-image" src={service.image} alt="" width={640} height={400} />
          <p className="detail-copy">{service.description}</p>
        </section>

        <section className="scheduler">
          <div className="scheduler-block">
            <div className="scheduler-heading">
              <h2>When should we connect?</h2>
              <div className="date-nav">
                <button className="nav-arrow" type="button" onClick={() => scrollDates(-1)} aria-label="Previous dates">
                  <ChevronLeft />
                </button>
                <button className="nav-arrow" type="button" onClick={() => scrollDates(1)} aria-label="Next dates">
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="date-scroller" ref={scrollerRef}>
              {dates.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  data-date={d.key}
                  className={`date-card${selectedDate === d.key ? ' is-selected' : ''}`}
                  onClick={() => selectDate(d.key)}
                >
                  <span className="dow">{d.day}</span>
                  <span className="dom">{d.dateLabel}</span>
                  <span className="slots">{d.slots} slots</span>
                </button>
              ))}
            </div>
          </div>

          <div className="scheduler-block">
            <div className="scheduler-heading">
              <h2>Select your preferred time slot</h2>
              {selectedMeta && (
                <p className="slot-hint">
                  Showing availability for <strong>{selectedMeta.dateLabel}</strong>
                </p>
              )}
            </div>

            <div className="daypart-tabs" role="tablist" aria-label="Time of day">
              {DAY_PARTS.map((part) => {
                const count = slotsByPart[part].length
                return (
                  <button
                    key={part}
                    type="button"
                    role="tab"
                    aria-selected={dayPart === part}
                    className={dayPart === part ? 'is-active' : ''}
                    disabled={count === 0}
                    onClick={() => selectDayPart(part)}
                  >
                    <span>{part}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </div>

            <div className="slot-grid" key={`${selectedDate}-${dayPart}`}>
              {visibleSlots.length === 0 ? (
                <p className="empty-slots">No {dayPart.toLowerCase()} slots on this date. Try another time of day.</p>
              ) : (
                visibleSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn${selectedTime === slot ? ' is-selected' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="scheduler-foot">
            <div className="timezone">
              <GlobeIcon />
              Asia/Calcutta (GMT+5:30)
            </div>
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

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1 6L12 17.8 6.7 20.7l1-6L3.3 10l6-.9L12 3.5z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
