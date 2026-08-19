import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DAY_PART_ORDER,
  formatINR,
  getBookableDates,
  getSlotsForDate,
  groupSlotsByPart,
  profile,
  type DayPart,
  type Service,
  type TimeSlot,
} from '../data/content'
import { getBookedKeys, fetchBookedKeys } from '../lib/bookings'

type Props = {
  service: Service
  onBack: () => void
  onConfirm: (selection: { dateKey: string; dateLabel: string; time: string }) => void
}

function firstOpen(slots: TimeSlot[]) {
  return slots.find((s) => !s.booked)?.time ?? ''
}

function pickBestDayPart(
  grouped: Record<DayPart, TimeSlot[]>,
  preferred: DayPart,
): DayPart {
  if (grouped[preferred].some((s) => !s.booked)) return preferred
  return DAY_PART_ORDER.find((part) => grouped[part].some((s) => !s.booked)) ?? preferred
}

export function BookingPage({ service, onBack, onConfirm }: Props) {
  const [bookedKeys, setBookedKeys] = useState<Set<string>>(() => getBookedKeys())
  const dates = useMemo(() => getBookableDates(14, bookedKeys), [bookedKeys])
  const [selectedDate, setSelectedDate] = useState(dates[0]?.key ?? '')
  const [dayPart, setDayPart] = useState<DayPart>('Morning')
  const [selectedTime, setSelectedTime] = useState('')
  const preferredPartRef = useRef<DayPart>('Morning')
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetchBookedKeys().then((keys) => {
      if (!cancelled) setBookedKeys(keys)
    })
    const refresh = () => {
      fetchBookedKeys().then((keys) => {
        if (!cancelled) setBookedKeys(keys)
      })
    }
    window.addEventListener('tarot-bookings-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('tarot-bookings-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const selectedMeta = dates.find((d) => d.key === selectedDate)
  const allSlots = useMemo(
    () => (selectedDate ? getSlotsForDate(selectedDate, bookedKeys) : []),
    [selectedDate, bookedKeys],
  )
  const slotsByPart = useMemo(() => groupSlotsByPart(allSlots), [allSlots])
  const visibleSlots = slotsByPart[dayPart]

  useEffect(() => {
    if (!selectedDate) return
    const next = groupSlotsByPart(getSlotsForDate(selectedDate, bookedKeys))
    const nextPart = pickBestDayPart(next, preferredPartRef.current)
    preferredPartRef.current = nextPart
    setDayPart(nextPart)
    setSelectedTime(firstOpen(next[nextPart]))
  }, [selectedDate, bookedKeys])

  function selectDate(key: string) {
    setSelectedDate(key)
    const scroller = scrollerRef.current
    const el = scroller?.querySelector<HTMLElement>(`[data-date="${key}"]`)
    if (!scroller || !el) return
    const left = el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2
    scroller.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }

  function selectDayPart(part: DayPart) {
    preferredPartRef.current = part
    setDayPart(part)
    const next = slotsByPart[part]
    setSelectedTime((current) => {
      const stillOpen = next.find((s) => s.time === current && !s.booked)
      return stillOpen ? current : firstOpen(next)
    })
  }

  function scrollDates(dir: -1 | 1) {
    scrollerRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="booking-page">
      <div className="booking-frame">
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
              {service.format === 'bundle' ? (
                <span className="meta-chip">{service.bundleSessions} sessions</span>
              ) : (
                <span className="meta-chip">{service.durationMins} mins</span>
              )}
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
                    <span className="slots">{d.slots} open</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="scheduler-block scheduler-slots">
              <div className="scheduler-heading">
                <h2>Select your preferred time slot</h2>
                {selectedMeta && (
                  <p className="slot-hint">
                    10:00 AM – 10:00 PM · <strong>{selectedMeta.dateLabel}</strong>
                  </p>
                )}
              </div>

              <div className="daypart-tabs" role="tablist" aria-label="Time of day">
                {DAY_PART_ORDER.map((part) => {
                  const openCount = slotsByPart[part].filter((s) => !s.booked).length
                  return (
                    <button
                      key={part}
                      type="button"
                      role="tab"
                      aria-selected={dayPart === part}
                      className={dayPart === part ? 'is-active' : ''}
                      disabled={openCount === 0}
                      onClick={() => selectDayPart(part)}
                    >
                      <span>{part}</span>
                      <small>{openCount} open</small>
                    </button>
                  )
                })}
              </div>

              <div className="slot-grid" key={`${selectedDate}-${dayPart}`}>
                {visibleSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time && !slot.booked
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      className={`slot-btn${isSelected ? ' is-selected' : ''}${slot.booked ? ' is-booked' : ''}`}
                      disabled={slot.booked}
                      aria-disabled={slot.booked}
                      title={slot.booked ? 'Already booked' : slot.time}
                      onClick={() => {
                        if (!slot.booked) setSelectedTime(slot.time)
                      }}
                    >
                      <span className="slot-time">{slot.time}</span>
                      {slot.booked && <span className="slot-status">Booked</span>}
                    </button>
                  )
                })}
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
