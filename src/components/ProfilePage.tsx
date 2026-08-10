import { useMemo, useState } from 'react'
import { profile, services, type Service } from '../data/content'
import { ServiceAccordion } from './ServiceAccordion'
import { FollowModal } from './FollowModal'

type Props = {
  onBookSession: (service: Service) => void
}

export function ProfilePage({ onBookSession }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [followOpen, setFollowOpen] = useState(false)
  const sessionServices = useMemo(
    () => services.filter((s) => s.kind === 'session'),
    [],
  )
  const wa = services.find((s) => s.id === 'whatsapp')

  function scrollToServices() {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="profile-page">
      <div className="profile-top">
        <button
          className="chip-btn"
          type="button"
          aria-label="Follow"
          onClick={() => setFollowOpen(true)}
        >
          <BellIcon />
          Follow
        </button>
        <button className="icon-btn" type="button" aria-label="Profile">
          <UserIcon />
        </button>
      </div>

      <div className="profile-layout">
        <section className="profile-intro" aria-label="Profile">
          <div className="avatar-ring">
            <img src={profile.avatar} alt={profile.name} width={220} height={220} />
          </div>
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-bio">{profile.bio}</p>
          <a
            className="ig-link"
            href={profile.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <button className="book-cta" type="button" onClick={scrollToServices}>
            Book a session with me
          </button>
        </section>

        <section className="service-list" id="services" aria-label="Services">
          {sessionServices.map((service) => (
            <ServiceAccordion
              key={service.id}
              service={service}
              open={openId === service.id}
              onToggle={() => setOpenId((id) => (id === service.id ? null : service.id))}
              onBook={() => onBookSession(service)}
            />
          ))}

          {wa && (
            <a
              className="service-pill"
              href={wa.href ?? profile.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <span className="wa-thumb" aria-hidden="true">
                <WhatsAppIcon />
              </span>
              <span className="service-title">{wa.title}</span>
              <span aria-hidden="true" style={{ width: '1.5rem' }} />
            </a>
          )}
        </section>
      </div>

      <p className="made-with">Made for Tarot by Ananya</p>

      <FollowModal open={followOpen} onClose={() => setFollowOpen(false)} />
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        fill="currentColor"
      />
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 3.3 17.7L2 22l4.4-1.2A11 11 0 1 0 20.5 3.5zM12 20a9 9 0 0 1-4.6-1.3l-.3-.2-2.6.7.7-2.5-.2-.3A9 9 0 1 1 12 20zm5-6.6c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.5 4.1 5.2 5.2 0 0 0 3 .9 2.5 2.5 0 0 0 1.7-.7 2 2 0 0 0 .4-1.4c-.1-.1-.3-.2-.6-.3z" />
    </svg>
  )
}
