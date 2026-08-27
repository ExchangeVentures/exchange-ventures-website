import { useCallback, useEffect, useRef, useState } from 'react'
import { ai as aiCopy, brand } from '../lib/site.js'
import { questions } from '../lib/engine.js'
import { requestBrief } from '../lib/ai.js'
import { Arrow } from './Arrow.jsx'
import { Brief } from './Brief.jsx'

const THINKING = [
  'Reading your six answers',
  'Locating the binding constraint',
  'Ranking moves by effort and payback',
  'Sizing the plan to the hours you have',
  'Writing the brief',
]

export function Snapshot() {
  const [step, setStep] = useState(0)          // 0..questions.length-1, then 'working' | 'done'
  const [phase, setPhase] = useState('form')   // form | working | done
  const [answers, setAnswers] = useState({})
  const [thinkingLine, setThinkingLine] = useState(0)
  const [brief, setBrief] = useState(null)
  const panelRef = useRef(null)
  const headingRef = useRef(null)

  const q = questions[step]
  const total = questions.length
  const answeredAll = questions.every((x) => answers[x.id])

  const scrollPanelIntoView = useCallback(() => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const run = useCallback(async (finalAnswers) => {
    setPhase('working')
    setThinkingLine(0)
    scrollPanelIntoView()
    const started = Date.now()
    const result = await requestBrief(finalAnswers)
    // Hold the working state long enough for the status lines to read as real work.
    const elapsed = Date.now() - started
    const minimum = 2600
    if (elapsed < minimum) await new Promise((r) => setTimeout(r, minimum - elapsed))
    setBrief(result)
    setPhase('done')
  }, [scrollPanelIntoView])

  const choose = (value) => {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (step < total - 1) {
      setTimeout(() => setStep((s) => s + 1), 180)
    } else if (questions.every((x) => next[x.id])) {
      setTimeout(() => run(next), 180)
    }
  }

  // Cycle the working-state status lines.
  useEffect(() => {
    if (phase !== 'working') return
    const id = setInterval(() => {
      setThinkingLine((n) => Math.min(n + 1, THINKING.length - 1))
    }, 620)
    return () => clearInterval(id)
  }, [phase])

  // Move focus to the new question so keyboard and screen-reader users follow.
  useEffect(() => {
    if (phase === 'form' && headingRef.current) headingRef.current.focus()
  }, [step, phase])

  const reset = () => {
    setAnswers({})
    setBrief(null)
    setStep(0)
    setPhase('form')
    scrollPanelIntoView()
  }

  return (
    <section className="section snapshot" id="snapshot">
      <div className="shell snapshot__inner">
        <div className="snapshot__intro">
          <p className="tagbox reveal" data-reveal>{aiCopy.label}</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>{aiCopy.headline}</h2>
          <p className="lead snapshot__lead reveal" data-reveal style={{ '--d': '160ms' }}>{aiCopy.lead}</p>

          <p className="snapshot__disclaimer">{aiCopy.disclaimer}</p>
        </div>

        <div className="snapshot__panelwrap reveal" data-reveal style={{ '--d': '200ms' }}>
          <div className="panel" ref={panelRef}>
            <div className="panel__bar">
              <span className="panel__dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="label panel__title">
                {phase === 'done' ? 'Brief ready' : phase === 'working' ? 'Working' : `Snapshot · question ${Math.min(step + 1, total)} of ${total}`}
              </span>
            </div>

            <div className="panel__progress" aria-hidden="true">
              <span
                className="panel__progress-fill"
                style={{ width: `${phase === 'done' ? 100 : (Object.keys(answers).length / total) * 100}%` }}
              />
            </div>

            <div className="panel__body">
              {phase === 'form' && (
                <div className="qstep" key={q.id}>
                  <h3 className="qstep__label" tabIndex={-1} ref={headingRef}>{q.label}</h3>
                  {q.help && <p className="qstep__help">{q.help}</p>}

                  <div className="qstep__options" role="radiogroup" aria-label={q.label}>
                    {q.options.map((o, i) => {
                      const selected = answers[q.id] === o.value
                      return (
                        <button
                          key={o.value}
                          role="radio"
                          aria-checked={selected}
                          className={`opt ${selected ? 'is-selected' : ''}`}
                          style={{ '--d': `${i * 45}ms` }}
                          onClick={() => choose(o.value)}
                        >
                          <span className="opt__key">{String.fromCharCode(65 + i)}</span>
                          <span className="opt__text">{o.label}</span>
                          <span className="opt__tick" aria-hidden="true">
                            <Arrow size={13} className="" />
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="qstep__foot">
                    <button
                      className="qstep__back"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                    >
                      Back
                    </button>
                    {answeredAll && (
                      <button className="btn btn--accent" onClick={() => run(answers)}>
                        Generate the brief <Arrow />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {phase === 'working' && (
                <div className="working" aria-live="polite">
                  <div className="working__glyph" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                  <ul className="working__lines">
                    {THINKING.map((line, i) => (
                      <li
                        key={line}
                        className={i < thinkingLine ? 'is-done' : i === thinkingLine ? 'is-current' : ''}
                      >
                        <span className="working__mark" aria-hidden="true">{i < thinkingLine ? '✓' : '·'}</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {phase === 'done' && brief && (
                <Brief brief={brief} onReset={reset} answers={answers} />
              )}
            </div>
          </div>

          <p className="snapshot__privacy muted">
            Nothing is stored. Your answers stay in this browser tab unless you send them to us at{' '}
            <a className="link-sweep" href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
