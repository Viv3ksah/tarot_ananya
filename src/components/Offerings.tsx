import { offerings } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function Offerings() {
  const headRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="offerings">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Readings</span>
          <h2>Choose the depth you need</h2>
          <p>
            Live and written tarot sessions shaped around one honest question —
            no fluff, just clarity you can use.
          </p>
        </div>

        <div className="offer-list reveal reveal-delay-1" ref={listRef}>
          {offerings.map((item) => (
            <article className="offer-row" key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <div className="offer-meta">{item.duration}</div>
              </div>
              <p>{item.description}</p>
              <div className="offer-price">{item.price}</div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <a className="btn" href="#book">
            Reserve a session
          </a>
        </div>
      </div>
    </section>
  )
}
