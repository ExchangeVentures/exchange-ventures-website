import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// The one piece of spectacle on the site: a white wireframe surface on black
// that breathes, and lifts under the cursor.
//
// Plain canvas 2D, no library, roughly 3KB. It pauses when scrolled out of
// view, and renders a single static frame when the visitor prefers reduced
// motion, so it never costs anyone a smooth scroll.
// ---------------------------------------------------------------------------

const COLS = 54        // points across
const ROWS = 26        // points into the distance
const SPAN = 3.6       // world width
const DEPTH = 1.7      // world depth
const AMP = 0.105      // wave height
const LIFT = 0.34      // how high the cursor lifts the surface
const LIFT_RADIUS = 0.62

export function HeroCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Hidden by CSS on small screens; do not spend a frame loop there either.
    // Tracked live rather than checked once, so resizing a window still works.
    const small = window.matchMedia('(max-width: 900px)')
    let isSmall = small.matches

    let w = 0, h = 0, dpr = 1
    let raf = 0
    let running = true
    let t = 0

    // Pointer in world coordinates, eased toward the real pointer.
    const target = { x: 0, z: 0.55, active: 0 }
    const eased = { x: 0, z: 0.55, active: 0 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // World (x, y, z) -> screen. z is depth: 0 near, 1 far.
    const project = (x, y, z) => {
      const persp = 1 / (1 + z * 0.85)
      return {
        px: w * 0.56 + x * w * 0.42 * persp,
        py: h * 1.02 - z * h * 0.55 - y * h * persp * 1.2,
        persp,
      }
    }

    const heightAt = (x, z, time) => {
      // Two travelling waves, so the surface never looks like it loops.
      const base =
        Math.sin(x * 2.1 + time) * 0.55 +
        Math.sin(z * 3.4 - time * 0.75) * 0.30 +
        Math.sin((x + z) * 1.5 + time * 0.45) * 0.15

      let y = base * AMP

      // Cursor lifts a soft bump out of the surface.
      if (eased.active > 0.001) {
        const dx = x - eased.x
        const dz = z - eased.z
        const d2 = (dx * dx) / (LIFT_RADIUS * LIFT_RADIUS) + (dz * dz) / (LIFT_RADIUS * LIFT_RADIUS)
        y += Math.exp(-d2 * 2.4) * LIFT * eased.active
      }
      return y
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1

      const px = (i) => -SPAN / 2 + (SPAN * i) / (COLS - 1)
      const pz = (j) => (DEPTH * j) / (ROWS - 1)

      // Rows running across, faded by depth.
      for (let j = 0; j < ROWS; j++) {
        const z = pz(j)
        const fade = Math.pow(1 - j / (ROWS - 1), 1.5)
        ctx.strokeStyle = `rgba(255,255,255,${0.06 + fade * 0.36})`
        ctx.beginPath()
        for (let i = 0; i < COLS; i++) {
          const x = px(i)
          const p = project(x, heightAt(x, z, t), z)
          i === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py)
        }
        ctx.stroke()
      }

      // Columns running into the distance, drawn sparser.
      for (let i = 0; i < COLS; i += 2) {
        const x = px(i)
        ctx.strokeStyle = 'rgba(255,255,255,0.13)'
        ctx.beginPath()
        for (let j = 0; j < ROWS; j++) {
          const z = pz(j)
          const p = project(x, heightAt(x, z, t), z)
          j === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py)
        }
        ctx.stroke()
      }
    }

    const frame = () => {
      if (!running || isSmall) return
      t += 0.0085
      eased.x += (target.x - eased.x) * 0.06
      eased.z += (target.z - eased.z) * 0.06
      eased.active += (target.active - eased.active) * 0.05
      draw()
      raf = requestAnimationFrame(frame)
    }

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      target.x = (nx - 0.5) * SPAN
      target.z = Math.max(0, Math.min(DEPTH, (1 - ny) * DEPTH * 0.9))
      target.active = 1
    }
    const onLeave = () => { target.active = 0 }

    resize()

    const start = () => {
      if (isSmall || raf) return
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      ctx.clearRect(0, 0, w, h)
    }

    if (reduce) {
      // One static frame: the shape, none of the motion.
      t = 1.2
      eased.active = 0
      if (!isSmall) draw()
    } else {
      start()
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerdown', onPointer, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }

    const onBreakpoint = (e) => {
      isSmall = e.matches
      if (isSmall) { stop(); return }
      resize()
      if (reduce) draw()
      else if (running) start()
    }
    small.addEventListener('change', onBreakpoint)

    const onResize = () => { if (isSmall) return; resize(); if (reduce) draw() }
    window.addEventListener('resize', onResize)

    // Stop drawing entirely once the hero has scrolled away.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return
        if (entry.isIntersecting && !running) {
          running = true
          start()
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      small.removeEventListener('change', onBreakpoint)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas className="herocanvas" ref={ref} aria-hidden="true" />
}
