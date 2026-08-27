import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nav, engagements, brand } from '../lib/site.js'

// Cmd+K palette. Jumps to a section, starts the Snapshot, or opens an email.
// Small enough to be worth it, and the only keyboard-first thing on the site.
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '')

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const commands = useMemo(() => {
    const go = (href) => () => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return [
      { id: 'snapshot-run', label: 'Run the Strategy Snapshot', hint: 'Tool', run: go('#snapshot') },
      ...nav.map((n) => ({ id: n.href, label: n.label, hint: 'Section', run: go(n.href) })),
      { id: 'contact', label: 'Contact', hint: 'Section', run: go('#contact') },
      ...engagements.map((e) => ({
        id: `fee-${e.id}`,
        label: `${e.name} — ${e.price}`.replace('—', '·'),
        hint: 'Fees',
        run: go('#fees'),
      })),
      { id: 'email', label: `Email ${brand.email}`, hint: 'Action', run: () => { window.location.href = `mailto:${brand.email}` } },
      { id: 'top', label: 'Back to top', hint: 'Action', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ]
  }, [])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(needle) || c.hint.toLowerCase().includes(needle))
  }, [q, commands])

  const close = useCallback(() => { setOpen(false); setQ(''); setSel(0) }, [])

  const runAt = useCallback((i) => {
    const cmd = results[i]
    if (!cmd) return
    close()
    // Let the overlay unmount before scrolling, so focus does not fight it.
    requestAnimationFrame(() => cmd.run())
  }, [results, close])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (!open) return
      if (e.key === 'Escape') { e.preventDefault(); close() }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); runAt(sel) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results.length, sel, runAt, close])

  useEffect(() => { setSel(0) }, [q])

  // The hint is fixed to the corner, so at the top of the page it lands on the
  // stat band. Hold it back until the hero has scrolled away.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setHintVisible(window.scrollY > window.innerHeight * 0.75)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  return (
    <>
      <button
        className={`kbd-hint ${hintVisible ? 'is-in' : ''}`}
        onClick={() => setOpen(true)}
        tabIndex={hintVisible ? 0 : -1}
        aria-hidden={!hintVisible}
      >
        <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span>
        <span className="kbd">K</span>
        <span className="kbd-hint__text">Jump to</span>
      </button>

      {open && (
        <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
          <button className="cmdk__scrim" onClick={close} tabIndex={-1} aria-hidden="true" />
          <div className="cmdk__box">
            <div className="cmdk__field">
              <span className="label">Go</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sections, fees, actions"
                aria-label="Search commands"
                aria-activedescendant={results[sel] ? `cmdk-${results[sel].id}` : undefined}
              />
              <span className="kbd">esc</span>
            </div>

            <ul className="cmdk__list" role="listbox" ref={listRef}>
              {results.map((c, i) => (
                <li key={c.id}>
                  <button
                    id={`cmdk-${c.id}`}
                    role="option"
                    aria-selected={i === sel}
                    data-sel={i === sel}
                    className={`cmdk__item ${i === sel ? 'is-sel' : ''}`}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => runAt(i)}
                  >
                    <span>{c.label}</span>
                    <span className="label cmdk__hint">{c.hint}</span>
                  </button>
                </li>
              ))}
              {!results.length && <li className="cmdk__empty muted">Nothing matches that.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
