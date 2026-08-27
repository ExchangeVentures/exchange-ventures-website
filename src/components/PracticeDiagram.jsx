import { useEffect, useRef, useState } from 'react'

// Line-art SVGs that draw themselves in when scrolled to. Pure stroke, so they
// inherit the page's black and white and need no image assets.

function useDrawIn() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, on]
}

// Advisory: a flat line that steps upward, one block at a time.
export function AdvisoryDiagram() {
  const [ref, on] = useDrawIn()
  return (
    <svg ref={ref} className={`diagram ${on ? 'is-in' : ''}`} viewBox="0 0 320 150" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" opacity="0.18">
        {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={30 + i * 30} x2="320" y2={30 + i * 30} />)}
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="150" />)}
      </g>
      <path className="diagram__draw" d="M8 122 H88 V92 H168 V62 H248 V26 H312"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      {[[88, 92], [168, 62], [248, 26]].map(([x, y], i) => (
        <rect key={i} className="diagram__node" style={{ '--i': i }}
          x={x - 3.5} y={y - 3.5} width="7" height="7" fill="currentColor" />
      ))}
      <text x="8" y="140" className="diagram__cap">DAY 0</text>
      <text x="312" y="140" textAnchor="end" className="diagram__cap">DAY 90</text>
    </svg>
  )
}

// Capital: one shape absorbed into another, with the operator kept in place.
export function CapitalDiagram() {
  const [ref, on] = useDrawIn()
  return (
    <svg ref={ref} className={`diagram ${on ? 'is-in' : ''}`} viewBox="0 0 320 150" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" opacity="0.18">
        {[0, 1, 2, 3].map((i) => <line key={i} x1="0" y1={30 + i * 30} x2="320" y2={30 + i * 30} />)}
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="150" />)}
      </g>
      <rect className="diagram__draw" x="18" y="46" width="86" height="60"
        stroke="currentColor" strokeWidth="1.75" />
      <rect className="diagram__draw diagram__draw--2" x="216" y="46" width="86" height="60"
        stroke="currentColor" strokeWidth="1.75" strokeDasharray="5 4" />
      <path className="diagram__draw diagram__draw--3" d="M112 76 H206 M194 68 L206 76 L194 84"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      <circle className="diagram__node" style={{ '--i': 0 }} cx="61" cy="76" r="4" fill="currentColor" />
      <circle className="diagram__node" style={{ '--i': 1 }} cx="259" cy="76" r="4" fill="currentColor" />
      <text x="18" y="140" className="diagram__cap">OWNER</text>
      <text x="302" y="140" textAnchor="end" className="diagram__cap">OWNER STAYS</text>
    </svg>
  )
}
