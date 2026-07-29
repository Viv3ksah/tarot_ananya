const STORAGE_KEY = 'tarot-ananya-bookings'

type BookingRecord = {
  dateKey: string
  time: string
  serviceId: string
}

function readBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as BookingRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getBookedKeys(): Set<string> {
  return new Set(readBookings().map((b) => `${b.dateKey}|${b.time}`))
}

export function isSlotBookedLocally(dateKey: string, time: string) {
  return getBookedKeys().has(`${dateKey}|${time}`)
}

export function saveBooking(record: BookingRecord) {
  const next = [...readBookings().filter((b) => !(b.dateKey === record.dateKey && b.time === record.time)), record]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('tarot-bookings-updated'))
}
