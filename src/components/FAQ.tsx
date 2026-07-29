import { faqs } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function FAQ() {
  const headRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">FAQ</span>
          <h2>Before you book</h2>
          <p>A few answers so you can arrive settled and ready.</p>
        </div>
        <div className="faq-list reveal reveal-delay-1" ref={listRef}>
          {faqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
