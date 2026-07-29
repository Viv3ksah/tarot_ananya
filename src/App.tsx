import { Header, Hero } from './components/Hero'
import { QuickLinks } from './components/QuickLinks'
import { Offerings } from './components/Offerings'
import { Products } from './components/Products'
import { Coaching } from './components/Coaching'
import { LeadMagnet } from './components/LeadMagnet'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="site">
      <Header />
      <Hero />
      <QuickLinks />
      <Offerings />
      <Products />
      <Coaching />
      <LeadMagnet />
      <Testimonials />
      <FAQ />
      <Booking />
      <Footer />
    </div>
  )
}
