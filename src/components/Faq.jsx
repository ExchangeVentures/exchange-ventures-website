import { useState } from 'react'
import { faqs } from '../lib/site.js'
import { Chevron } from './Arrow.jsx'

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq" id="faq">
      <div className="shell faq__inner">
        <div className="faq__head">
          <p className="tagbox reveal" data-reveal>Questions</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>
            The things people ask before they call.
          </h2>
        </div>

        <ul className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <li className={`faq__item reveal ${isOpen ? 'is-open' : ''}`} data-reveal key={f.q}>
                <h3>
                  <button
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className={`faq__icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                      <Chevron size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  className="faq__panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  hidden={!isOpen}
                >
                  <p>{f.a}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
