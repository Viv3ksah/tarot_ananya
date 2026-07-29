import { profile } from '../data/content'

export function Header() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <a className="brand-mark" href="#top">
          Tarot Ananya
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#offerings">Readings</a>
          <a href="#products">Shop</a>
          <a href="#coaching">1:1</a>
          <a href="#book">Book</a>
        </nav>
      </div>
    </header>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Tarot Ananya">
      <div className="hero-media" aria-hidden="true">
        <img
          src={profile.heroImage}
          alt=""
          width={1800}
          height={1200}
          fetchPriority="high"
        />
      </div>
      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-content">
        <h1 className="hero-brand">Tarot Ananya</h1>
        <p className="hero-copy">{profile.tagline}</p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#book">
            Book a reading
          </a>
          <a className="btn btn-ghost" href="#products">
            Browse the shop
          </a>
        </div>
      </div>
    </section>
  )
}
