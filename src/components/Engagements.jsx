import { engagements } from '../lib/site.js'
import { Arrow } from './Arrow.jsx'

export function Engagements() {
  return (
    <section className="section engagements" id="fees">
      <div className="shell">
        <div className="engagements__head">
          <p className="tagbox reveal" data-reveal>Fees</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>
            Fixed prices, <em>quoted up front.</em>
          </h2>
          <p className="lead reveal" data-reveal style={{ '--d': '160ms' }}>
            No hourly billing. On the capital side you never pay us anything.
          </p>
        </div>

        <div className="cards">
          {engagements.map((e, i) => (
            <article
              className={`card ${e.featured ? 'card--featured' : ''} reveal`}
              data-reveal
              key={e.id}
              style={{ '--d': `${i * 70}ms` }}
            >
              {e.featured && <span className="card__flag label">Most engagements start here</span>}
              <div className="card__top">
                <span className="card__n label">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3 card__name">{e.name}</h3>
                <div className="card__price">
                  <span className="card__amount display">{e.price}</span>
                  <span className="card__pricenote muted">{e.priceNote}</span>
                </div>
              </div>

              <p className="card__summary">{e.summary}</p>

              <ul className="card__list">
                {e.includes.map((li) => (
                  <li key={li}><span className="card__bullet" aria-hidden="true" />{li}</li>
                ))}
              </ul>

              <a className={`btn ${e.featured ? 'btn--on-dark' : 'btn--ghost'} card__cta`} href={e.cta.href}>
                {e.cta.label} <Arrow />
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
