import { formatINR, profile, services, type Service } from '../data/content'

type Props = {
  onBack: () => void
  onSelect: (service: Service) => void
}

const CATALOG_ORDER = [
  '60min',
  '30min',
  '15min',
  '1q',
  'intention-spell',
  '2q',
  '3q',
  '5q',
  'yesno',
  'love-binding',
  'reiki',
  'vashikaran',
]

const catalogServices = CATALOG_ORDER.map((id) => services.find((s) => s.id === id)).filter(
  (s): s is Service => Boolean(s),
)

export function SessionsPage({ onBack, onSelect }: Props) {
  return (
    <div className="sessions-page">
      <div className="sessions-frame">
        <header className="sessions-hero">
          <button className="back-btn" type="button" onClick={onBack} aria-label="Back">
            <BackIcon />
          </button>
          <span className="built-note sessions-credit">Secure booking</span>

          <div className="sessions-profile">
            <div className="sessions-avatar">
              <img src={profile.avatar} alt={profile.name} width={112} height={112} />
            </div>
            <h1>{profile.name}</h1>
            <p className="sessions-tagline">{profile.tagline}</p>
            <p className="sessions-specialties">
              {profile.handle} {profile.specialties}
            </p>
            <div className="sessions-socials">
              <a
                className="social-btn social-wa"
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a
                className="social-btn social-ig"
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </header>

        <div className="sessions-panel">
          <h2 className="sessions-heading">1-on-1 session</h2>
          <div className="offer-grid">
            {catalogServices.map((service) => (
              <OfferCard key={service.id} service={service} onSelect={onSelect} />
            ))}
          </div>

          <section className="about-me" aria-label="About me">
            <h2>About Me</h2>
            <div className="about-me-body">
              <img src={profile.avatar} alt={profile.shortName} width={220} height={220} />
              <div>
                <h3>{profile.shortName}</h3>
                <p>
                  {profile.handle}
                  <br />
                  {profile.specialties}
                </p>
                <div className="sessions-socials about-socials">
                  <a
                    className="social-btn social-wa"
                    href={profile.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon />
                  </a>
                  <a
                    className="social-btn social-ig"
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function OfferCard({
  service,
  onSelect,
}: {
  service: Service
  onSelect: (service: Service) => void
}) {
  const isBundle = service.format === 'bundle'
  return (
    <article className="offer-card">
      <div className="offer-top">
        <div className="offer-icon" aria-hidden="true">
          <CrystalBallIcon />
        </div>
        {service.badges && service.badges.length > 0 && (
          <div className="offer-badges">
            {service.badges.includes('rating') && (
              <span className="badge-rating">★ {service.rating}</span>
            )}
            {service.badges.includes('trending') && <span className="badge-trending">Trending</span>}
            {service.badges.includes('popular') && (
              <span className="badge-popular">Most Popular</span>
            )}
          </div>
        )}
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
      <div className="offer-foot">
        <div className="offer-meta">
          {isBundle ? (
            <>
              <strong className="bundle-label">
                <RefreshIcon /> Bundle
              </strong>
              <span>{service.bundleSessions} sessions</span>
            </>
          ) : (
            <>
              <strong>{service.durationMins} mins</strong>
              <span>{service.platform}</span>
            </>
          )}
        </div>
        <div className="offer-price">
          <div className="offer-price-copy">
            <s>{formatINR(service.originalPrice)}</s>
            <small>{service.discountLabel}</small>
          </div>
          <button
            className="offer-cta"
            type="button"
            onClick={() => onSelect(service)}
            aria-label={`Book ${service.title} for ${formatINR(service.price)}`}
          >
            {formatINR(service.price)}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrystalBallIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="14" r="10" fill="#c084fc" />
      <circle cx="16" cy="14" r="8" fill="#a855f7" />
      <path d="M11 11c2-2 5-2 6 0" stroke="#fde68a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M19 9.5l.8 1.6 1.7.3-1.2 1.2.3 1.7L19 13.4l-1.6.9.3-1.7-1.2-1.2 1.7-.3L19 9.5z" fill="#facc15" />
      <rect x="10" y="23" width="12" height="4" rx="1.5" fill="#7c3aed" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.2-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M20 5v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 3.3 17.7L2 22l4.4-1.2A11 11 0 1 0 20.5 3.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.7.7-2.5-.2-.3A9 9 0 1 1 12 20zm5-6.6c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.5 4.1 5.2 5.2 0 0 0 3 .9 2.5 2.5 0 0 0 1.7-.7 2 2 0 0 0 .4-1.4c-.1-.1-.3-.2-.6-.3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  )
}
