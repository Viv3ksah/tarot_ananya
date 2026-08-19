export type ServiceBadge = 'rating' | 'trending' | 'popular'

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
  featured?: boolean
  badges?: ServiceBadge[]
  format?: 'session' | 'bundle'
  bundleSessions?: number
}

export const profile = {
  name: 'Tarot by Ananya',
  shortName: 'Ananya',
  tagline: 'Your guide towards healing',
  specialties: 'Tarot | Astrology | Spells | Reiki',
  handle: 'Tarot by ananya ✨',
  bio: '5+ yrs of expertise | Guided & healed 50,000+ clients | All sessions are confidential',
  instagram:
    'https://www.instagram.com/tarot.ananya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  // Use country code + number, digits only (example: India 91 + 9876543210)
  whatsapp: 'https://wa.me/919163732506?text=Hi%20Ananya%2C%20I%27d%20like%20to%20book%20a%20session',
  avatar: '/images/AVATAR1.png',
  cover: '/images/session.jpg',
}

const sessionImage = '/images/CARDS3.png'   // 30 min
const ritualImage = '/images/CARDS1.png'  // vashikaran
const quickImage = '/images/CARDS2.png'  // 60 min
const quickImage1 = '/images/CARDS4.png' // 15 min

export const services: Service[] = [
  {
    id: 'vashikaran',
    title: 'Vashikaran ritual',
    durationMins: 45,
    price: 14999,
    originalPrice: 19999,
    discountLabel: '25% OFF',
    platform: 'Google Meet',
    rating: 5,
    description:
      'A focused ritual session for attraction, reconciliation, and energetic alignment. Includes guidance, mantras, and aftercare notes tailored to your intention.',
    thumb: ritualImage,
    image: ritualImage,
    kind: 'session',
    featured: true,
  },
  {
    id: '60min',
    title: '60 mins Session',
    durationMins: 60,
    price: 1999,
    originalPrice: 2500,
    discountLabel: '20% OFF',
    platform: 'Google Meet',
    rating: 5,
    description:
      'Experience a complete 60-minute 1:1 tarot session with in-depth guidance, clarity, and personalized insights',
    thumb: quickImage,
    image: quickImage,
    kind: 'session',
    featured: true,
  },
  {
    id: '30min',
    title: '30mins Session',
    durationMins: 30,
    price: 599,
    originalPrice: 699,
    discountLabel: '14% OFF',
    platform: 'Google Meet',
    rating: 5,
    description:
      'Dive deeper with a 30-minute 1:1 tarot session for detailed guidance, clarity, and personalized insights',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
    featured: true,
    badges: ['rating', 'trending'],
  },
  {
    id: '15min',
    title: '15 mins session',
    durationMins: 15,
    price: 399,
    originalPrice: 450,
    discountLabel: '11% OFF',
    platform: 'Google Meet',
    rating: 5,
    description:
      'Tarot guidance and clarity on your questions in a focused 15-minute 1:1 Google Meet session',
    thumb: ritualImage,
    image: ritualImage,
    kind: 'session',
    featured: true,
  },
  {
    id: '1q',
    title: '1 question reading',
    durationMins: 10,
    price: 111,
    originalPrice: 150,
    discountLabel: '26% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Only one question will be covered in detail',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
    badges: ['rating', 'popular'],
  },
  {
    id: 'intention-spell',
    title: 'Any intention spell',
    durationMins: 15,
    price: 399,
    originalPrice: 888,
    discountLabel: '55% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Any of your intention will be added in this spell',
    thumb: ritualImage,
    image: ritualImage,
    kind: 'session',
  },
  {
    id: '2q',
    title: '2 questions reading',
    durationMins: 15,
    price: 199,
    originalPrice: 250,
    discountLabel: '20% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Only two question will be covered in detail',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
  },
  {
    id: '3q',
    title: '3 questions reading',
    durationMins: 20,
    price: 299,
    originalPrice: 380,
    discountLabel: '21% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Only three question will be covered in detail',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
  },
  {
    id: '5q',
    title: '5 questions reading',
    durationMins: 25,
    price: 555,
    originalPrice: 666,
    discountLabel: '17% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Only five question will be covered in detail',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
  },
  {
    id: 'yesno',
    title: '5 yes/no questions',
    durationMins: 10,
    price: 59,
    originalPrice: 99,
    discountLabel: '40% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: 'Answer will be given in yes/no and one line explanation',
    thumb: quickImage1,
    image: quickImage1,
    kind: 'session',
  },
  {
    id: 'love-binding',
    title: '3 days love binding spell',
    durationMins: 20,
    price: 999,
    originalPrice: 2222,
    discountLabel: '55% OFF',
    platform: 'Your Phone Number',
    rating: 5,
    description: '3 days love binding spell',
    thumb: ritualImage,
    image: ritualImage,
    kind: 'session',
  },
  {
    id: 'reiki',
    title: 'Reiki healing',
    durationMins: 0,
    price: 7999,
    originalPrice: 11999,
    discountLabel: '33% OFF',
    platform: 'Bundle',
    rating: 5,
    description: '(7 days healing) Heals root cause of any underlying emotional & physical issues',
    thumb: sessionImage,
    image: sessionImage,
    kind: 'session',
    format: 'bundle',
    bundleSessions: 7,
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
    href: undefined, // uses profile.whatsapp
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

function parseSlotMinutes(time: string) {
  const [clock, period] = time.split(' ')
  const [h, m] = clock.split(':').map(Number)
  let hour24 = h % 12
  if (period === 'PM') hour24 += 12
  if (period === 'AM' && h === 12) hour24 = 0
  return hour24 * 60 + m
}

function todayKey(now = new Date()) {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}

function isSlotInPast(dateKey: string, time: string, now = new Date()) {
  if (dateKey > todayKey(now)) return false
  if (dateKey < todayKey(now)) return true
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return parseSlotMinutes(time) <= nowMinutes
}

/** Paid bookings only — past slots are omitted, never shown as fake "booked" */
export function getSlotsForDate(dateKey: string, paidBooked: Set<string> = new Set()): TimeSlot[] {
  const now = new Date()
  return FULL_DAY_SLOTS.filter((time) => !isSlotInPast(dateKey, time, now)).map((time) => ({
    time,
    booked: paidBooked.has(`${dateKey}|${time}`),
  }))
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

export function countOpenSlots(dateKey: string, paidBooked: Set<string> = new Set()) {
  return getSlotsForDate(dateKey, paidBooked).filter((s) => !s.booked).length
}

/** Next N bookable dates starting today (skips days with no remaining future slots) */
export function getBookableDates(count = 14, paidBooked: Set<string> = new Set()) {
  const dates: { key: string; day: string; dateLabel: string; slots: number }[] = []
  const now = new Date()
  for (let i = 0; dates.length < count && i < count + 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const key = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
    const open = countOpenSlots(key, paidBooked)
    if (open === 0 && i === 0) continue
    dates.push({
      key,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dateLabel: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      slots: open,
    })
  }
  return dates
}
