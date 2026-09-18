import { Shell, Btn, Reveal } from "../components/Primitives.jsx";
import Resolver from "../components/Resolver.jsx";

const MAIL = "mailto:info@exchangeventures.ca?subject=Datum%20access";

/* Capability set mirrors what the incumbent production data systems cover,
   so a production accountant recognises the category immediately. */
const CAPABILITIES = [
  ["01", "Field data capture",
   "Manual entry on any device alongside automated SCADA import. Tanks, truck tickets, gas meters and well tests on one screen, and it keeps working without coverage."],
  ["02", "Validation and exceptions",
   "Configurable rules flag missing, late and out of tolerance data at the point of entry rather than at month end. An unresolved row cannot post."],
  ["03", "Allocation and hydrocarbon accounting",
   "Produced, flared, injected and sold volumes balanced across the facility network, daily and month to date."],
  ["04", "Surveillance",
   "Production plots, decline curves, downtime and deferment, measured against each well's own prior period rather than a fleet average."],
  ["05", "Regulatory reporting",
   "Volumetric filing generated and balanced against the regulator's rules days ahead of the deadline, instead of two days before it."],
  ["06", "Emissions",
   "Vent, flare and fuel volumes captured at source, on the round the operator already walks."],
];

const RESEARCH = [
  ["2 to 4 hrs", "Spent by hand on a single well that does not tie out, every month it does not tie out.", "Industry reconciliation benchmarks"],
  ["60 to 160 hrs", "What a two hundred well operation loses to reconciliation in one month, at a normal fifteen to twenty percent discrepancy rate.", "Industry reconciliation benchmarks"],
  ["$8.9B", "Where the oil and gas accounting software market is headed by 2033, up from 4.3 billion today.", "Accounting software market forecast"],
  ["72%", "Share of that market that is upstream, where the volumes are captured in the first place.", "Accounting software market forecast"],
];

export default function Platform() {
  return (
    <main>
      <section className="hero" style={{ gridTemplateColumns: "minmax(0,1fr)", paddingBottom: "clamp(30px,4vw,54px)" }}>
        <div className="herotxt">
          <span className="eyebrow">Coming soon</span>
          <h1 style={{ maxWidth: "13ch" }}>Datum</h1>
          <p className="lede">
            Production data management for upstream oil and gas, built on the{" "}
            <b>regulator's own register</b> instead of on free text.
          </p>
          <div className="cta"><Btn href={MAIL}>Get in touch</Btn></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: "clamp(30px,4vw,56px)" }}>
        <Reveal>
          <div className="sechead">
            <h2>Try it.</h2>
            <p className="sub">
              A working slice on real Petrinex records. Type a name instead of picking one.
              Put 18 in the LSD, or set the range to 41.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} style={{ marginTop: 40 }}><Resolver /></Reveal>
      </section>

      <section className="sec">
        <Reveal><div className="sechead"><h2>What it covers.</h2></div></Reveal>
        <div className="caps">
          {CAPABILITIES.map(([n, title, body], i) => (
            <Reveal key={n} delay={(i % 3) * 90} className="cap">
              <Shell style={{ height: "100%" }}>
                <div className="capin"><span className="n">{n}</span><b>{title}</b><p>{body}</p></div>
              </Shell>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <Shell style={{ marginTop: 12 }}>
            <div className="callout">
              <b>Every system in this category does most of that list.</b>
              <p>
                All of them also let somebody type the facility name. That is the part we fixed
                first, because none of the rest holds up when the keys underneath do not match.
              </p>
            </div>
          </Shell>
        </Reveal>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sechead">
            <h2>What the current way costs.</h2>
            <p className="sub">
              Published benchmarks for what production teams spend reconciling volumes that do not tie out.
            </p>
          </div>
        </Reveal>
        <div className="research">
          {RESEARCH.map(([figure, body, source], i) => (
            <Reveal key={figure} delay={(i % 2) * 90}>
              <Shell>
                <div className="resin"><b>{figure}</b><p>{body}</p><cite>{source}</cite></div>
              </Shell>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <Shell>
            <div className="closein">
              <h2>Coming soon.</h2>
              <p>
                We are onboarding a handful of producers first. Get in touch and we will run it
                against your own facilities.
              </p>
              <Btn href={MAIL}>Get in touch</Btn>
            </div>
          </Shell>
        </Reveal>
      </section>
    </main>
  );
}
