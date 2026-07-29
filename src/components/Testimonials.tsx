import { testimonials } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function Testimonials() {
  const headRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="stories">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Kind words</span>
          <h2>What clients carry away</h2>
          <p>Soft honesty, practical next steps, and readings that feel like being seen.</p>
        </div>
        <div className="quote-grid reveal reveal-delay-1" ref={gridRef}>
          {testimonials.map((item) => (
            <figure className="quote" key={item.name}>
              <blockquote>“{item.quote}”</blockquote>
              <cite>— {item.name}</cite>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
