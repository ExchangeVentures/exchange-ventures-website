import { useState } from 'react'
import { brand, cta } from '../lib/site.js'
import { Arrow } from './Arrow.jsx'

const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || ''

export function Contact() {
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', business: '', email: '', message: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setState('sending')

    // With no endpoint configured we hand the message to the visitor's own mail
    // client rather than pretend to have sent it.
    if (!LEAD_ENDPOINT) {
      const subject = encodeURIComponent(`Enquiry from ${form.name || 'the website'}`)
      const body = encodeURIComponent(
        `Name: ${form.name}\nBusiness: ${form.business}\nEmail: ${form.email}\n\n${form.message}`
      )
      window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
      setState('sent')
      return
    }

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="section contact on-dark" id="contact">
      <div className="shell contact__inner">
        <div className="contact__left">
          <p className="tagbox reveal" data-reveal>{cta.label}</p>
          <h2 className="h2 reveal" data-reveal style={{ '--d': '80ms' }}>{cta.headline}</h2>
          <p className="lead contact__lead reveal" data-reveal style={{ '--d': '160ms' }}>{cta.lead}</p>

          <dl className="contact__details reveal" data-reveal style={{ '--d': '240ms' }}>
            <div>
              <dt className="label">Email</dt>
              <dd><a className="link-sweep" href={`mailto:${brand.email}`}>{brand.email}</a></dd>
            </div>
            <div>
              <dt className="label">Where</dt>
              <dd>{brand.location}</dd>
            </div>
            <div>
              <dt className="label">Response time</dt>
              <dd>One working day, always from a person</dd>
            </div>
          </dl>

        </div>

        <form className="form reveal" data-reveal style={{ '--d': '200ms' }} onSubmit={submit}>
          {state === 'sent' ? (
            <div className="form__done">
              <span className="form__tick" aria-hidden="true">✓</span>
              <h3 className="h3">That is on its way.</h3>
              <p className="muted">
                {LEAD_ENDPOINT
                  ? 'We reply within one working day, always from a person.'
                  : 'Your email client should have opened with the message ready to send. If it did not, write to us directly at '}
                {!LEAD_ENDPOINT && <a className="link-sweep" href={`mailto:${brand.email}`}>{brand.email}</a>}
              </p>
              <button type="button" className="btn btn--ghost-dark" onClick={() => setState('idle')}>
                Send another
              </button>
            </div>
          ) : (
            <>
              <div className="form__row">
                <label className="field">
                  <span className="label">Your name</span>
                  <input required value={form.name} onChange={set('name')} autoComplete="name" />
                </label>
                <label className="field">
                  <span className="label">Business</span>
                  <input value={form.business} onChange={set('business')} autoComplete="organization" />
                </label>
              </div>

              <label className="field">
                <span className="label">Email</span>
                <input required type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              </label>

              <label className="field">
                <span className="label">What is going on?</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="A few lines is plenty. What changed, what you have tried, and what you want to be true in ninety days."
                />
              </label>

              {state === 'error' && (
                <p className="form__error">
                  That did not go through. Email us directly at{' '}
                  <a className="link-sweep" href={`mailto:${brand.email}`}>{brand.email}</a>.
                </p>
              )}

              <button className="btn btn--accent form__submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending' : 'Send it'} <Arrow />
              </button>
              <p className="form__fine muted">
                We use what you send to reply to you and nothing else. No list, no sequence.
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
