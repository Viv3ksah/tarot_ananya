export type Service = {
  id: string
  title: string
  durationMins: number
  price: number
  originalPrice: number
  discountLabel: string
  platform: string
  rating: number
  description: string
  thumb: string
  image: string
  kind: 'session' | 'link'
  href?: string
}

export const profile = {
  name: 'Tarot by Ananya',
  tagline: 'Your guide towards healing',
  bio: '5+ yrs of expertise | Guided & healed 10,000+ clients | All sessions are confidential',
  instagram: 'https://instagram.com/tarotananya',
  whatsapp: 'https://wa.me/919999999999',
  avatar: '/images/avatar.jpg',
  cover: '/images/session.jpg',
}

const sessionImage = '/images/cards.jpg'
const ritualImage = '/images/ritual.jpg'
const quickImage = '/images/session.jpg'

export const services: Service[] = [
  {
    id: 'vashikaran',
    title: 'Vashikaran ritual',
    durationMins: 45,
    price: 2499,
    originalPrice: 2999,
    discountLabel: '17% off',
    platform: 'Google Meet',
    rating: 5,
    description:
      'A focused ritual session for attraction, reconciliation, and energetic alignment. Includes guidance, mantras, and aftercare notes tailored to your intention.',
    thumb: ritualImage,
    image: ritualImage,
    kind: 'session',
  },
  {
    id: '60min',
    title: '60 mins Session',
    durationMins: 60,
    price: 999,
    originalPrice: 1299,
    discountLabel: '23% off',
    platform: 'Google Meet',
    rating: 5,
    description:
      'A deep 1:1 tarot reading for major life questions. We explore multiple areas, patterns, and practical next steps with healing suggestions.',
    thumb: quickImage,
    image: quickImage,
    kind: 'session',
  },
  {
    id: '30min',
    title: '30mins Session',
    durationMins: 30,
    price: 599,
    originalPrice: 699,
    discountLabel: '14% off',
    platform: 'Google Meet',
    rating: 5,
    description:
      'This 30-minute 1:1 tarot session is ideal if you’re seeking deeper clarity and a detailed reading. With extra time, we can explore multiple areas of your life, uncover underlying energies, and answer follow-up questions and guidance with spell/healing suggestions',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
  },
  {
    id: '15min',
    title: '15 mins session',
    durationMins: 15,
    price: 299,
    originalPrice: 399,
    discountLabel: '25% off',
    platform: 'Google Meet',
    rating: 5,
    description:
      'A quick clarity pull for one focused question — perfect when you need direction fast before a decision.',
    thumb: quickImage,
    image: quickImage,
    kind: 'session',
  },
  {
    id: 'whatsapp',
    title: 'DM me on WhatsApp',
    durationMins: 0,
    price: 0,
    originalPrice: 0,
    discountLabel: '',
    platform: 'WhatsApp',
    rating: 5,
    description: '',
    thumb: '',
    image: '',
    kind: 'link',
    href: 'https://wa.me/919999999999',
  },
]

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export type DayPart = 'Morning' | 'Afternoon' | 'Evening'

export type TimeSlot = {
  time: string
  booked: boolean
}

/** Build half-hour labels from 10:00 AM through 10:00 PM */
export function buildDaySlots(): string[] {
  const slots: string[] = []
  for (let minutes = 10 * 60; minutes <= 22 * 60; minutes += 30) {
    const hour24 = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
    slots.push(`${String(hour12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`)
  }
  return slots
}

export const FULL_DAY_SLOTS = buildDaySlots()

export function dayPartForTime(time: string): DayPart {
  const [clock, period] = time.split(' ')
  const [h, m] = clock.split(':').map(Number)
  let hour24 = h % 12
  if (period === 'PM') hour24 += 12
  if (period === 'AM' && h === 12) hour24 = 0
  const total = hour24 * 60 + m
  if (total < 13 * 60) return 'Morning' // 10:00–12:30
  if (total < 18 * 60) return 'Afternoon' // 1:00–5:30
  return 'Evening' // 6:00–10:00
}

export const DAY_PART_ORDER: DayPart[] = ['Morning', 'Afternoon', 'Evening']

function hashString(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Every day has the full 10AM–10PM grid; some slots are marked booked */
export function getSlotsForDate(dateKey: string, extraBooked: Set<string> = new Set()): TimeSlot[] {
  const seed = hashString(dateKey)
  return FULL_DAY_SLOTS.map((time, index) => {
    const bit = (seed + index * 17) % 7
    // ~28% pre-booked demo slots, plus any locally confirmed bookings
    const booked = bit === 0 || bit === 4 || extraBooked.has(`${dateKey}|${time}`)
    return { time, booked }
  })
}

export function groupSlotsByPart(slots: TimeSlot[]): Record<DayPart, TimeSlot[]> {
  const grouped: Record<DayPart, TimeSlot[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  }
  for (const slot of slots) {
    grouped[dayPartForTime(slot.time)].push(slot)
  }
  return grouped
}

export function countOpenSlots(dateKey: string, extraBooked: Set<string> = new Set()) {
  return getSlotsForDate(dateKey, extraBooked).filter((s) => !s.booked).length
}

/** Next N bookable dates starting today */
export function getBookableDates(count = 14, extraBooked: Set<string> = new Set()) {
  const dates: { key: string; day: string; dateLabel: string; slots: number }[] = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const key = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
    dates.push({
      key,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dateLabel: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      slots: countOpenSlots(key, extraBooked),
    })
  }
  return dates
}
