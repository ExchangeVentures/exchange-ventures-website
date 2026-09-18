import { Shell, Btn, Reveal } from "../components/Primitives.jsx";
import HeroCanvas from "../components/HeroCanvas.jsx";
import FocusList from "../components/FocusList.jsx";

const MAIL = "mailto:info@exchangeventures.ca?subject=Exchange%20Ventures";

/* Each of these is a published finding, not an assertion. */
const PROBLEMS = [
  ["01", "The systems predate the question",
   "Roughly four in five producers run critical systems more than fifteen years old, built before anyone asked them to integrate with anything. They have no interfaces to give.",
   "Industry legacy systems research"],
  ["02", "Nothing shares a key",
   "Volumes live across historians, SCADA, engineering tools, spreadsheets, ERP and field notebooks at once. Each names the same well a slightly different way, so none of it joins.",
   "Upstream data integration research"],
  ["03", "The field is still on paper",
   "Gauges get written on a sheet at the lease, sent in days later, and keyed by someone else later still. A well that stopped last week can be dead nine days before anyone sees it.",
   "Field data capture practice"],
  ["04", "So the analysis never lands",
   "Models trained on partial inputs produce guidance operators learn to ignore. Fragmented data, not weak analytics, is the thing standing in the way.",
   "Digital transformation research"],
];

const SUITE = [
  ["Phase one", "Datum", "live",
   "Capture and the regulatory filing. Every facility, well and disposition point resolves against the register, so the identifiers are right before anything gets built on them.",
   "#/platform"],
  ["Phase two", "Compliance", "next",
   "Vent, flare, fuel and leak survey records captured on the round the operator already walks, against emissions rules that tighten from 2027.", null],
  ["Phase three", "Intelligence", "later",
   "Benchmarking, decline and netback that can be trusted, because by then the keys underneath them finally match. This is the part everyone wants first, and it has to come last.", null],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="herotxt">
          <h1>Exchange Ventures</h1>
          <p className="tagline">An oil and gas intelligence company.</p>
          <p className="lede">
            We build software for producers. It makes field data easier to gather and the
            systems around it easier to <b>automate</b>.
          </p>
          <div className="cta">
            <Btn href={MAIL}>Get in touch</Btn>
            <Btn href="#/platform" variant="ghost" icon="→">See the platform</Btn>
          </div>
        </div>
        <HeroCanvas />
      </section>

      <section className="sec">
        <Reveal>
          <div className="railed">
            <span className="raillabel">The problem</span>
            <div className="sechead"><h2>The industry runs on data it cannot trust.</h2></div>
          </div>
        </Reveal>
        <div className="probs">
          {PROBLEMS.map(([n, title, body, source], i) => (
            <Reveal key={n} delay={i * 110} className="prob">
              <Shell style={{ height: "100%" }}>
                <div className="probin">
                  <i>{n}</i><b>{title}</b><p>{body}</p><cite>{source}</cite>
                </div>
              </Shell>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="railed">
            <span className="raillabel">The suite</span>
            <div className="sechead">
              <h2>Three phases, in the only order that works.</h2>
              <p className="sub">
                Nothing above the first one holds up until the identifiers underneath it are right.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="suite">
          <FocusList
            items={SUITE}
            renderItem={([phase, name, state, body, href]) => (
              <article className="suitecard">
                <div className="body">
                  <div className="ph">
                    <b>{phase}</b>
                    <span className={`state${state === "live" ? " live" : ""}`}>
                      {state === "live" ? "Building now" : state === "next" ? "Next" : "Later"}
                    </span>
                  </div>
                  <h3>{name}</h3>
                  <p>{body}</p>
                  {href && (
                    <div className="cta" style={{ marginTop: 8 }}>
                      <Btn href={href} size="sm" icon="→">See Datum</Btn>
                    </div>
                  )}
                </div>
              </article>
            )}
          />
        </div>
        <Reveal delay={90} style={{ marginTop: 44 }}>
          <Shell>
            <div className="band">
              <div className="bandtxt">
                <h3>Phase one, running now.</h3>
                <p>
                  Every facility, well and disposition point is matched against Petrinex before
                  it can be saved, so the keys are right the first time.
                </p>
                <div className="cta">
                  <Btn href="#/platform" size="sm" icon="→">Open Datum</Btn>
                </div>
              </div>
              <div className="bandimg">
                <img src="/platform.jpg" width="1240" height="697" loading="lazy"
                     alt="The Datum capture grid running against the Alberta facility register." />
              </div>
            </div>
          </Shell>
        </Reveal>
      </section>

      <section className="sec">
        <Reveal>
          <Shell>
            <div className="closein">
              <h2>Talk to us.</h2>
              <p>
                We are working with a small number of producers before general release.
                If this data problem is yours, we want to hear how it shows up.
              </p>
              <Btn href={MAIL}>Get in touch</Btn>
            </div>
          </Shell>
        </Reveal>
      </section>
    </main>
  );
}
