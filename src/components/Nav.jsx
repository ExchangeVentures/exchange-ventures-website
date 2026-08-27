import { useEffect, useState } from 'react'
import { brand, nav } from '../lib/site.js'
import { Arrow } from './Arrow.jsx'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner shell">
        <a className="nav__mark" href="#top" onClick={() => setOpen(false)}>
          <span className="nav__dot" aria-hidden="true" />
          {brand.wordmark}
        </a>

        <nav className="nav__pill" aria-label="Sections">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav__link ${active === item.href.slice(1) ? 'is-active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="arrowlink nav__cta" href="#contact">Contact</a>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`nav__burger-bars ${open ? 'is-open' : ''}`} aria-hidden="true">
            <i /><i />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`nav__sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul>
          {nav.map((item, i) => (
            <li key={item.href} style={{ '--i': i }}>
              <a href={item.href} onClick={() => setOpen(false)}>
                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--on-dark" href="#contact" onClick={() => setOpen(false)}>
          Contact <Arrow />
        </a>
      </div>
    </header>
  )
}
