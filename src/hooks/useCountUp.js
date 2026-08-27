import { useEffect, useRef, useState } from 'react'

// Counts a numeric string up when it scrolls into view, preserving any
// non-numeric prefix (so "<10" still reads "<10" at rest).
//
// The displayed number must never be wrong, so the animation is only ever a
// decoration on top of the final value: if motion is reduced, if the tab is
// hidden, or if the component goes away mid-count, we snap to the real number.
export function useCountUp(value, duration = 1100) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    setShown(value)
    const el = ref.current
    if (!el) return

    const match = String(value).match(/^(\D*)(\d+)(\D*)$/)
    if (!match) return
    const [, prefix, digits, suffix] = match
    const end = Number(digits)
    const final = `${prefix}${end}${suffix}`

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let done = false

    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(raf)
      raf = 0
      setShown(final)
    }

    const run = () => {
      // A hidden tab throttles rAF, which would leave a half-counted number on
      // screen when the visitor comes back. Show the real one instead.
      if (document.hidden) { finish(); return }
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setShown(`${prefix}${Math.round(end * eased)}${suffix}`)
        if (p < 1) raf = requestAnimationFrame(tick)
        else finish()
      }
      raf = requestAnimationFrame(tick)
    }

    const onHide = () => { if (document.hidden) finish() }
    document.addEventListener('visibilitychange', onHide)

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { run(); io.disconnect() } },
      { threshold: 0.4 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [value, duration])

  return [ref, shown]
}
