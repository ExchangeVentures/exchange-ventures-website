import { brand, nav } from '../lib/site.js'
import { Arrow } from './Arrow.jsx'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__top">
          <a className="footer__mark display" href="#top">{brand.wordmark}</a>
          <p className="footer__tagline muted">{brand.tagline}</p>
        </div>

        <div className="footer__grid">
          <nav aria-label="Footer">
            <p className="label">Site</p>
            <ul className="footer__links">
              {nav.map((n) => (
                <li key={n.href}><a className="link-sweep" href={n.href}>{n.label}</a></li>
              ))}
              <li><a className="link-sweep" href="#contact">Contact</a></li>
            </ul>
          </nav>

          <div>
            <p className="label">Get in touch</p>
            <ul className="footer__links">
              <li><a className="link-sweep" href={`mailto:${brand.email}`}>{brand.email}</a></li>
              <li className="muted">{brand.location}</li>
            </ul>
          </div>

          <div className="footer__cta">
            <p className="footer__cta-text">
              Not ready to talk? Run the Snapshot and keep the brief.
            </p>
            <a className="btn btn--on-dark" href="#snapshot">Run the Snapshot <Arrow /></a>
          </div>
        </div>

        <div className="footer__base">
          <p className="muted">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p className="muted">
            Nothing on this site is financial, legal or tax advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
