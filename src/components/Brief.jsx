import { useEffect, useState } from 'react'
import { questions } from '../lib/engine.js'
import { Arrow } from './Arrow.jsx'

const label = (id, value) =>
  questions.find((q) => q.id === id)?.options.find((o) => o.value === value)?.label ?? value

function toPlainText(brief, answers) {
  const lines = [
    'STRATEGY SNAPSHOT / Exchange Ventures',
    '',
    brief.headline,
    '',
    'YOUR ANSWERS',
    ...questions.map((q) => `  ${q.label} ${label(q.id, answers[q.id])}`),
    '',
    'WHERE YOU ARE',
    brief.position,
    '',
    `THE BINDING CONSTRAINT: ${brief.constraint.name}`,
    brief.constraint.why,
    brief.constraint.evidence,
    '',
    'THREE MOVES',
    ...brief.moves.flatMap((m, i) => [
      `  ${i + 1}. ${m.title}  [${m.effort} effort, payback ${m.payback}]`,
      `     ${m.detail}`,
    ]),
    '',
    'THE NINETY',
    ...brief.plan.flatMap((p) => [
      `  ${p.block}: ${p.objective}`,
      `     Moves: ${p.moves.join('; ')}`,
      `     Watch: ${p.metric}`,
    ]),
    '',
    'STOP DOING',
    ...brief.stop.map((s) => `  · ${s}`),
    '',
    'MOST LIKELY WAY THIS FAILS',
    brief.risk,
    '',
    'This is a first-pass read generated from six answers. It is a starting point',
    'for a conversation, not financial, legal or tax advice.',
  ]
  return lines.join('\n')
}

export function Brief({ brief, answers, onReset }) {
  const [shown, setShown] = useState(0)
  const [copied, setCopied] = useState(false)

  // Reveal the brief section by section so it reads as being written.
  useEffect(() => {
    const id = setInterval(() => setShown((n) => (n >= 6 ? (clearInterval(id), n) : n + 1)), 260)
    return () => clearInterval(id)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toPlainText(brief, answers))
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const on = (i) => (shown >= i ? 'brief__block is-in' : 'brief__block')

  return (
    <div className="brief" aria-live="polite">
      <div className={on(0)}>
        <span className={`chip ${brief.source === 'model' ? 'chip--model' : ''}`}>
          {brief.source === 'model' ? 'Drafted by Claude' : 'Drafted by the in-house engine'}
        </span>
        <h3 className="brief__headline h3">{brief.headline}</h3>
      </div>

      <div className={on(1)}>
        <p className="label">Where you are</p>
        <p className="brief__p">{brief.position}</p>
      </div>

      <div className={on(2)}>
        <p className="label">The binding constraint</p>
        <p className="brief__constraint">{brief.constraint.name}</p>
        <p className="brief__p">{brief.constraint.why}</p>
        <p className="brief__evidence">{brief.constraint.evidence}</p>
      </div>

      <div className={on(3)}>
        <p className="label">{brief.moves.length === 2 ? 'Two' : 'Three'} moves, in order</p>
        <ol className="brief__moves">
          {brief.moves.map((m, i) => (
            <li key={m.title}>
              <div className="brief__move-head">
                <span className="brief__move-n">{i + 1}</span>
                <h4 className="brief__move-t">{m.title}</h4>
              </div>
              <p className="brief__p">{m.detail}</p>
              <div className="brief__tags">
                <span className={`tag tag--${m.effort.toLowerCase()}`}>{m.effort} effort</span>
                <span className="tag">Payback {m.payback}</span>
              </div>
            </li>
          ))}
        </ol>
        {brief.hoursNote && <p className="brief__note">{brief.hoursNote}</p>}
      </div>

      <div className={on(4)}>
        <p className="label">The ninety</p>
        <div className="brief__plan">
          {brief.plan.map((p) => (
            <article className="planblock" key={p.block}>
              <span className="planblock__block label">{p.block}</span>
              <h4 className="planblock__obj">{p.objective}</h4>
              <ul className="planblock__moves">
                {p.moves.map((m) => <li key={m}>{m}</li>)}
              </ul>
              <p className="planblock__metric"><span className="label">Watch</span> {p.metric}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={on(5)}>
        <div className="brief__two">
          <div>
            <p className="label">Stop doing</p>
            <ul className="brief__stop">
              {brief.stop.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <p className="label">Most likely way this fails</p>
            <p className="brief__p">{brief.risk}</p>
          </div>
        </div>
      </div>

      <div className={`${on(6)} brief__actions`}>
        <a className="btn btn--accent" href="#contact">
          Talk this through <Arrow />
        </a>
        <button className="btn btn--ghost-dark" onClick={copy}>
          {copied ? 'Copied' : 'Copy the brief'}
        </button>
        <button className="btn btn--ghost-dark" onClick={() => window.print()}>
          Save as PDF
        </button>
        <button className="brief__reset" onClick={onReset}>Start over</button>
      </div>
    </div>
  )
}
