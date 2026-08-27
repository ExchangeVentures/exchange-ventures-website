import { useEffect, useRef } from 'react'

// Pulls an element gently toward the pointer while it is nearby, then lets it
// spring back. Disabled for coarse pointers and reduced motion.
// `max` caps the offset so a magnetic button can never drift into its neighbour.
export function useMagnetic(strength = 0.16, radius = 45, max = 12) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const cur = { x: 0, y: 0 }
    const to = { x: 0, y: 0 }

    const loop = () => {
      cur.x += (to.x - cur.x) * 0.18
      cur.y += (to.y - cur.y) * 0.18
      el.style.transform = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px)`
      if (Math.abs(to.x - cur.x) > 0.05 || Math.abs(to.y - cur.y) > 0.05) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + radius
      if (dist < reach) {
        const clamp = (v) => Math.max(-max, Math.min(max, v))
        to.x = clamp(dx * strength)
        to.y = clamp(dy * strength)
      } else {
        to.x = 0
        to.y = 0
      }
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [strength, radius, max])

  return ref
}
