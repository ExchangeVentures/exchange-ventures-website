import { useEffect, useRef, useState } from 'react'
import { approach } from '../lib/site.js'

// The method, pinned while you scroll through it: the four steps advance one at
// a time on the left, and the detail swaps on the right.
export function Approach() {
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean)
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.i)
            if (!Number.isNaN(i)) setActive(i)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  const step = approach.steps[active]

  return (
    <section className="section approach on-dark" id="approach">
      <div className="shell">
        <div className="approach__head">
          <p className="tagbox reveal" data-reveal>{approach.label}</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>{approach.headline}</h2>
        </div>

        <div className="pin">
          {/* Sticky summary: which step you are on. */}
          <aside className="pin__aside">
            <ol className="ladder">
              {approach.steps.map((s, i) => (
                <li key={s.n} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
                  <span className="ladder__n label">{s.n}</span>
                  <span className="ladder__t">{s.t}</span>
                  <span className="ladder__bar" aria-hidden="true" />
                </li>
              ))}
            </ol>

            <div className="pin__detail" key={active}>
              <span className="label">{step.dur}</span>
              <p className="pin__out">{step.out}</p>
            </div>
          </aside>

          {/* The scrolling track that drives it. */}
          <ol className="pin__track" ref={trackRef}>
            {approach.steps.map((s, i) => (
              <li
                key={s.n}
                data-i={i}
                ref={(el) => { stepRefs.current[i] = el }}
                className={`pinstep ${i === active ? 'is-active' : ''}`}
              >
                <span className="pinstep__n label">{s.n}</span>
                <h3 className="pinstep__t">{s.t}</h3>
                <p className="pinstep__d">{s.d}</p>
                <p className="pinstep__out"><span className="label">What you get</span>{s.out}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
