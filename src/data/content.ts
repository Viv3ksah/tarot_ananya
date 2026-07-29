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

export const ALL_TIME_SLOTS = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Midday: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
  Evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
} as const

export type DayPart = keyof typeof ALL_TIME_SLOTS

/** @deprecated use ALL_TIME_SLOTS / getSlotsForDate */
export const timeSlots = ALL_TIME_SLOTS

function hashString(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Deterministic available slots for a given date — changes when the date changes */
export function getSlotsForDate(dateKey: string): Record<DayPart, string[]> {
  const seed = hashString(dateKey)
  const parts = Object.keys(ALL_TIME_SLOTS) as DayPart[]
  const result = {} as Record<DayPart, string[]>

  parts.forEach((part, partIndex) => {
    const pool = ALL_TIME_SLOTS[part]
    const available = pool.filter((_, index) => {
      const bit = (seed + partIndex * 17 + index * 13) % 5
      // Keep ~60–80% of slots; pattern shifts by date
      return bit !== 0 && bit !== 3
    })
    result[part] =
      available.length > 0
        ? available
        : [pool[(seed + partIndex) % pool.length]]
  })

  return result
}

export function countSlotsForDate(dateKey: string) {
  const slots = getSlotsForDate(dateKey)
  return (Object.keys(slots) as DayPart[]).reduce((sum, part) => sum + slots[part].length, 0)
}

/** Next N bookable dates starting today */
export function getBookableDates(count = 14) {
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
      slots: countSlotsForDate(key),
    })
  }
  return dates
}
