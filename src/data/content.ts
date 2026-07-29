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
  avatar:
    'https://images.unsplash.com/photo-1606326608606-ee76c6c0a1e8?auto=format&fit=crop&w=400&q=80',
  cover:
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=1200&q=80',
}

const sessionImage =
  'https://images.unsplash.com/photo-1650460078862-ba05f66a2a0b?auto=format&fit=crop&w=900&q=80'
const ritualImage =
  'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=900&q=80'

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
    thumb: sessionImage,
    image: sessionImage,
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
    thumb: sessionImage,
    image: sessionImage,
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

/** Next N bookable dates starting today */
export function getBookableDates(count = 14) {
  const dates: { key: string; day: string; dateLabel: string; slots: number }[] = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    dates.push({
      key: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dateLabel: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      slots: 10 + ((i * 3) % 9),
    })
  }
  return dates
}

export const timeSlots = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Midday: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
  Evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
} as const

export type DayPart = keyof typeof timeSlots
