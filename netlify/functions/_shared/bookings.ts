import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'

export type BookingRecord = {
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

const STORE_NAME = 'tarot-bookings'
const INDEX_KEY = 'index'

function store() {
  return getStore({ name: STORE_NAME, consistency: 'strong' })
}

export async function listBookings(): Promise<BookingRecord[]> {
  const raw = await store().get(INDEX_KEY, { type: 'json' })
  if (!Array.isArray(raw)) return []
  return raw as BookingRecord[]
}

export async function getBookedSlotKeys(): Promise<string[]> {
  const bookings = await listBookings()
  return bookings.map((b) => `${b.dateKey}|${b.time}`)
}

export async function isSlotTaken(dateKey: string, time: string): Promise<boolean> {
  const bookings = await listBookings()
  return bookings.some((b) => b.dateKey === dateKey && b.time === time)
}

export async function saveConfirmedBooking(
  input: Omit<BookingRecord, 'id' | 'createdAt'>,
): Promise<BookingRecord> {
  const bookings = await listBookings()
  const existing = bookings.find(
    (b) =>
      (b.dateKey === input.dateKey && b.time === input.time) ||
      b.paymentId === input.paymentId ||
      b.orderId === input.orderId,
  )
  if (existing) return existing

  const record: BookingRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const next = [record, ...bookings]
  await store().setJSON(INDEX_KEY, next)
  return record
}
