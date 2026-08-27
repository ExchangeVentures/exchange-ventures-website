import { practices } from '../lib/site.js'
import { Arrow } from './Arrow.jsx'
import { AdvisoryDiagram, CapitalDiagram } from './PracticeDiagram.jsx'

// The two halves of the business, given equal weight and separated by a rule.
export function Practices() {
  return (
    <section className="section practices" id="practices">
      <div className="shell">
        <div className="practices__head">
          <p className="tagbox reveal" data-reveal>What we do</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>
            Two practices, <em>one point of view.</em>
          </h2>
        </div>

        <div className="practices__grid">
          {practices.map((p, i) => (
            <article className="practice reveal" data-reveal key={p.id} id={p.id} style={{ '--d': `${i * 100}ms` }}>
              <p className="label practice__tag">{p.tag}</p>
              <div className="practice__fig">{p.id === 'advisory' ? <AdvisoryDiagram /> : <CapitalDiagram />}</div>
              <h3 className="practice__name">{p.name}</h3>
              <p className="practice__line">{p.line}</p>

              <ul className="practice__points">
                {p.points.map((pt) => (
                  <li key={pt.t}>
                    <h4 className="practice__pt">{pt.t}</h4>
                    <p className="muted">{pt.d}</p>
                  </li>
                ))}
              </ul>

              <a className="btn btn--ghost practice__cta" href={p.cta.href}>
                {p.cta.label} <Arrow />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
