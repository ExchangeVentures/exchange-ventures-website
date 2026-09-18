# Exchange Ventures

Marketing site for a two-practice firm serving businesses with fewer than ten people:

- **Advisory** — strategy for expansion and improvement
- **Capital** — micro private equity, buying and taking stakes in small businesses

React + Vite, no CSS framework, strictly black and white.

```bash
npm install
npm run dev      # http://localhost:5183
npm run build    # -> dist/
```

## Where things live

| Path | What it is |
|---|---|
| `src/lib/site.js` | **All copy.** Brand, nav, hero, practices, steps, fees, FAQ. Edit here first. |
| `src/lib/engine.js` | The Strategy Snapshot's local engine: questions, and the house point of view written as code. |
| `src/lib/ai.js` | Snapshot client. Calls your endpoint if configured, otherwise the local engine. |
| `api/strategy.js` | Ready-made serverless handler that calls Claude. Not wired up by default. |
| `src/styles/tokens.css` | The whole design system: palette, type scale, spacing. |
| `src/styles/global.css` | Primitives — buttons, labels, reveal animation. |
| `src/styles/components.css` | Section styles, in page order. |

## The Strategy Snapshot

Six questions, then a written brief: the binding constraint, three moves ranked by
effort and payback, a ninety-day plan in three blocks, what to stop doing, and the
most likely way the plan fails.

It runs two ways:

1. **Local engine (default).** Deterministic, offline, zero cost, no key. The
   content in `engine.js` is the firm's actual point of view, so the output is
   specific rather than generic.
2. **Claude.** Deploy `api/strategy.js`, then set `VITE_AI_ENDPOINT=/api/strategy`
   in `.env`. The API key lives server-side only. If the call fails or times out,
   the front end silently falls back to the local engine, so the tool never breaks
   in front of a visitor.

The result panel shows which one produced the brief.

```bash
npm i @anthropic-ai/sdk        # only needed for the Claude path
```

## Before this goes live

- [ ] Confirm the email and location in `src/lib/site.js`
- [ ] Confirm the fee numbers in `engagements`
- [ ] Wire the contact form: set `VITE_LEAD_ENDPOINT` or keep the `mailto:` fallback
- [ ] Tick **Enforce HTTPS** in the repo's Pages settings once the certificate issues
- [ ] Add DKIM and DMARC records at Namecheap (see `docs/EMAIL-SETUP.md` steps 6 and 7)
- [ ] Add real client quotes if you want a proof section (none are on the site now,
      deliberately: there are no invented testimonials or outcome numbers anywhere)

## Brand assets

Everything in `public/` ships as-is to the site root. Regenerate the raster files
with `python3 scripts/gen_assets.py` after changing the mark or the headline.

| File | What it is |
|---|---|
| `favicon.svg` | The mark: a solid square and an outlined one on the diagonal |
| `favicon.ico` | 16, 32 and 48px, each drawn natively so small sizes stay crisp |
| `apple-touch-icon.png` | 180px, for iOS home screens |
| `icon-512.png` | 512px, referenced by `site.webmanifest` |
| `og.png` | 1200x630 link preview, black with the hero line |
| `404.html` | Standalone page GitHub Pages serves for unknown paths |
| `robots.txt`, `sitemap.xml` | Both point at `https://xchngventure.com` |

The mark is the nav's square, doubled: one solid, one outlined. Same idea as the
Capital diagram, one shape becoming another. `index.html` carries the Open Graph
and Twitter tags plus a `ProfessionalService` JSON-LD block.

## Notes on the content

The stats in the hero describe how the engagement is structured (ten days, ninety
days, under ten people). They are true by construction. No client
results, revenue lifts or testimonials are claimed anywhere, because the practice
is new. Add those once they are real.
