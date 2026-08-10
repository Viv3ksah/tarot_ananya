import { formatINR, type Service } from '../data/content'

type Props = {
  service: Service
  open: boolean
  onToggle: () => void
  onBook: () => void
}

export function ServiceAccordion({ service, open, onToggle, onBook }: Props) {
  return (
    <div className={`service-pill${open ? ' is-open' : ''}`}>
      <button className="service-pill-head" type="button" onClick={onToggle} aria-expanded={open}>
        <img className="service-thumb" src={service.thumb} alt="" width={40} height={40} />
        <span className="service-title">{service.title}</span>
        <ChevronIcon className="chevron" />
      </button>

      {open && (
        <div className="service-body">
          <img className="service-hero" src={service.image} alt="" width={640} height={400} />
          <h3 className="service-body-title">{service.title}</h3>
          <div className="price-row">
            <span className="price-now">{formatINR(service.price)}</span>
            <span className="price-was">{formatINR(service.originalPrice)}</span>
            <span className="price-off">{service.discountLabel}</span>
          </div>
          <button className="book-now" type="button" onClick={onBook}>
            Book now
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
