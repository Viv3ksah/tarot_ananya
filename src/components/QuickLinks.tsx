import { profile } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function QuickLinks() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="links" aria-label="Quick links">
      <div className="wrap">
        <div className="links-grid reveal" ref={ref}>
          {profile.socials.map((item) => (
            <a
              key={item.label}
              className="link-item"
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <div>
                <strong>{item.label}</strong>
                <span>{item.hint}</span>
              </div>
              <span className="link-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
