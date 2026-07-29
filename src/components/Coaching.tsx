import { useReveal } from '../hooks/useReveal'

export function Coaching() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="coaching" id="coaching">
      <div className="wrap">
        <div className="coaching-panel reveal" ref={ref}>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">1:1 coaching</span>
            <h2>Ongoing guidance between the big readings</h2>
            <p>
              A private coaching container for transitions, decision fatigue,
              and rebuilding trust in your own intuition.
            </p>
          </div>
          <div>
            <ul className="coaching-points">
              <li>Two 45-minute calls each month</li>
              <li>WhatsApp check-ins between sessions</li>
              <li>Custom card pulls when you need a nudge</li>
              <li>Flexible month-to-month — cancel anytime</li>
            </ul>
            <div style={{ marginTop: '1.75rem' }}>
              <a className="btn btn-gold" href="#book">
                Apply for coaching
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
