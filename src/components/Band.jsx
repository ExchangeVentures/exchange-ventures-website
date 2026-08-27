import { facts, criteria } from '../lib/site.js'
import { useCountUp } from '../hooks/useCountUp.js'

function Fact({ f, i }) {
  const [ref, shown] = useCountUp(f.value)
  return (
    <li className="facts__item reveal" data-reveal style={{ '--d': `${i * 70}ms` }}>
      <span className="facts__value" ref={ref}>
        {shown}<span className="facts__unit">{f.unit}</span>
      </span>
      <span className="facts__label label">{f.label}</span>
    </li>
  )
}

// The shape of the business in one strip. Data, not prose, and deliberately
// kept out of the hero so the hero stays a single line.
export function Band() {
  return (
    <div className="band on-dark">
      <div className="shell band__inner">
        <ul className="facts">
          {facts.map((f, i) => <Fact f={f} i={i} key={f.label} />)}
        </ul>
        <ul className="band__notes">
          {criteria.map((c) => <li className="label" key={c}>{c}</li>)}
        </ul>
      </div>
    </div>
  )
}
