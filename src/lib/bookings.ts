const STORAGE_KEY = 'tarot-ananya-bookings'

export type BookingRecord = {
  dateKey: string
  time: string
  serviceId: string
  contact?: string
  paymentId?: string
}

function readLocalBookings(): BookingRecord[] {
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
  return new Set(readLocalBookings().map((b) => `${b.dateKey}|${b.time}`))
}

export function saveBooking(record: BookingRecord) {
  const next = [
    ...readLocalBookings().filter((b) => !(b.dateKey === record.dateKey && b.time === record.time)),
    record,
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('tarot-bookings-updated'))
}

/** Paid bookings from the server (all visitors see the same availability) */
export async function fetchBookedKeys(): Promise<Set<string>> {
  try {
    const res = await fetch('/api/booked-slots')
    const data = (await res.json()) as { keys?: string[] }
    const keys = Array.isArray(data.keys) ? data.keys : []
    const merged = new Set([...keys, ...getBookedKeys()])
    return merged
  } catch {
    return getBookedKeys()
  }
}
