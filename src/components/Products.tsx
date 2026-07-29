import { products } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function Products() {
  const headRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="products">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Digital shop</span>
          <h2>Guides & courses you keep forever</h2>
          <p>
            Instant-access digital products — journals, ritual packs, and a
            mini course to read cards with confidence.
          </p>
        </div>

        <div className="product-grid reveal reveal-delay-1" ref={gridRef}>
          {products.map((item, index) => (
            <article
              className={`product reveal-delay-${Math.min(index + 1, 3)}`}
              key={item.id}
            >
              <div className="product-media">
                <img src={item.image} alt="" width={800} height={1000} loading="lazy" />
              </div>
              <div>
                <div className="product-type">{item.type}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="product-foot">
                  <span className="product-price">{item.price}</span>
                  <a className="btn btn-ghost" href="#book">
                    Get it
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
