import { hero } from '../lib/site.js'
import { HeroCanvas } from './HeroCanvas.jsx'

// A quiet mark, drawn rather than typeset, to anchor the line.
function Mark() {
  return (
    <svg className="hero__mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="42" height="42" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="13" y="13" width="18" height="18" fill="currentColor" />
    </svg>
  )
}

// The hero is one line and nothing else. Everything that used to live here has
// a section of its own further down the page.
export function Hero() {
  return (
    <section className="hero on-dark" id="top">
      <HeroCanvas />

      <div className="shell hero__inner">
        <p className="hero__est label">{hero.est}</p>

        <div className="hero__body">
          <span className="reveal" data-reveal><Mark /></span>

          <h1 className="hero__title reveal" data-reveal style={{ '--d': '140ms' }}>
            {hero.line}
          </h1>

          <div className="reveal" data-reveal style={{ '--d': '300ms' }}>
            <a className="arrowlink" href={hero.cta.href}>{hero.cta.label}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
