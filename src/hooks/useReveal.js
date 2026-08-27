import { useEffect } from 'react'

// Adds .is-in to every [data-reveal] element as it enters the viewport.
//
// Two rules learned the hard way:
//
// 1. Set the observer up ONCE. An earlier version had no dependency array and
//    rebuilt it on every render; disconnecting drops pending callbacks, so a
//    rapidly re-rendering component (the counting stats) could starve its
//    neighbours and leave them stuck at opacity 0 forever.
//
// 2. Never let above-the-fold content depend on observer timing. In a hidden or
//    throttled tab the first IntersectionObserver callback may not arrive at
//    all, which leaves a visitor looking at an empty hero. Anything already in
//    the viewport is revealed directly, and re-swept when the tab comes back.
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const all = () => document.querySelectorAll('[data-reveal]:not(.is-in)')
    const show = (n) => n.classList.add('is-in')

    if (reduce || !('IntersectionObserver' in window)) {
      all().forEach(show)
      return
    }

    const inView = (el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight * 0.92
    }

    // The safety net: whatever is on screen right now reveals regardless of IO.
    const sweep = () => all().forEach((n) => { if (inView(n)) show(n) })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )

    const observe = (root) => {
      if (root.matches?.('[data-reveal]') && !root.classList.contains('is-in')) io.observe(root)
      root.querySelectorAll?.('[data-reveal]:not(.is-in)').forEach((n) => io.observe(n))
    }

    observe(document.body)
    // A timeout, not requestAnimationFrame: rAF is paused in a hidden tab, which
    // is exactly the case this safety net exists for. Deferring by a task still
    // lets the browser paint the initial state so the transition runs.
    const timer = setTimeout(sweep, 0)

    const onVisible = () => { if (!document.hidden) sweep() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('resize', sweep)

    // Anything React mounts after this point still gets picked up.
    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((n) => { if (n.nodeType === 1) observe(n) }))
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      io.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('resize', sweep)
    }
  }, [])
}
