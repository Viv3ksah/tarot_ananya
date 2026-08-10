import { connectLambda, getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'
import type { HandlerEvent } from '@netlify/functions'

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

function store(event?: HandlerEvent) {
  if (event) connectLambda(event)
  return getStore({ name: STORE_NAME })
}

export async function listBookings(event?: HandlerEvent): Promise<BookingRecord[]> {
  const raw = await store(event).get(INDEX_KEY, { type: 'json' })
  if (!Array.isArray(raw)) return []
  return raw as BookingRecord[]
}

export async function getBookedSlotKeys(event?: HandlerEvent): Promise<string[]> {
  const bookings = await listBookings(event)
  return bookings.map((b) => `${b.dateKey}|${b.time}`)
}

export async function isSlotTaken(
  dateKey: string,
  time: string,
  event?: HandlerEvent,
): Promise<boolean> {
  const bookings = await listBookings(event)
  return bookings.some((b) => b.dateKey === dateKey && b.time === time)
}

export async function saveConfirmedBooking(
  input: Omit<BookingRecord, 'id' | 'createdAt'>,
  event?: HandlerEvent,
): Promise<BookingRecord> {
  const bookings = await listBookings(event)
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
  await store(event).setJSON(INDEX_KEY, [record, ...bookings])
  return record
}
